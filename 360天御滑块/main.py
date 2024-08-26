import json
import execjs
import requests
from PIL import Image
import io
from loguru import logger
from ddddocr_pic import ddddocr_pic
from re_pic import pic_re
import time
import random
import hashlib



# 获取底层图片
def get_bottom_pic(url):
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        logger.success('请求底层图片:' + str(response.status_code))
    else:
        logger.error('请求底层图片:' + str(response.status_code))
    pic = response.content
    image = Image.open(io.BytesIO(pic))
    image.save('./img/bg.png', 'PNG')


# 获取滑块图片
def get_slide_pic(url):
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        logger.success('请求滑块图片:' + str(response.status_code))
    else:
        logger.error('请求滑块图片:' + str(response.status_code))
    pic = response.content
    image = Image.open(io.BytesIO(pic))
    image.save('./img/slide.png', 'PNG')


# 获取第一个请求的加密参数
def get_sign():
    timestamp = round(time.time() * 1000)
    nonce = timestamp + random.randint(0, 1000000000)
    # nonce = timestamp + 1000
    string_to_hash = f"appIddc1db94ea7b3843cdc0ec0hc0nonce{nonce}os3pc0phone10000000000pncom.web.tianyurc0sdkName360CaptchaSDKtimestamp{timestamp}type1uinullversion2.0.0xc0"
    sign = hashlib.md5(string_to_hash.encode('utf-8')).hexdigest()
    return {
        'timestamp': timestamp,
        'nonce': nonce,
        'sign': sign
    }


# 第一个接口
def first_request():
    url = ""
    data = {
    }
    data_ = get_sign()
    data['timestamp'] = data_['timestamp']
    data['nonce'] = data_['nonce']
    data['sign'] = data_['sign']
    response = requests.post(url, headers=headers, data=data)
    if response.status_code == 200:
        logger.success('请求第一个接口:' + str(response.status_code))
    else:
        logger.error('请求第一个接口:' + str(response.status_code))

    response_json = json.loads(response.text)
    pic_bottom_url = response_json['data']['bg'][0]
    pic_slide_url = response_json['data']['front'][0]
    token = response_json['data']['token']
    captchaId = response_json['data']['captchaId']
    k = response_json['data']['k']
    # 返回第一个接口返回的必要数据
    return {
        'pic_bottom_url': pic_bottom_url,
        'pic_slide_url': pic_slide_url,
        'token': token,
        'captchaId': captchaId,
        'k': k
    }

# 第二个滑动接口
def slide_request(captchaId, token, k, length):
    url = ""
    data = {
    }
    with open('./js/code.js', 'r',encoding='utf-8') as f:
        jscode = f.read()
        result = execjs.compile(jscode).call('get_result', captchaId, token, k, length)
        data['report'] = result

    response = requests.post(url, headers=headers, data=data)
    if response.status_code == 200:
        logger.success('请求滑动接口:' + str(response.status_code))
        logger.info(response.text)
    else:
        logger.error('请求滑动接口:' + str(response.status_code))
        logger.info(response.text)


if __name__ == '__main__':

    headers = {
    }

    # 请求第一个接口
    first_list = first_request()

    # 获取底层图片和滑块图片
    get_bottom_pic(first_list['pic_bottom_url'])
    get_slide_pic(first_list['pic_slide_url'])

    # 还原乱码的底层图片
    pic_re('./img/bg.png', first_list['pic_bottom_url'])

    # ddddocr识别滑块缺口距离
    distance = int(ddddocr_pic() * (300 / 544))
    logger.info('滑块缺口距离:' + str(distance))

    # # 请求第二个滑动接口
    slide_request(first_list['captchaId'], first_list['token'], first_list['k'], distance)

