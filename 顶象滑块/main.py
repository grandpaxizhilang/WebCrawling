import json

import execjs
import requests
from PIL import Image
import io
from re_pic import pic_re
from loguru import logger
from opencv import opencv2
from trace import get_slide_track
import re

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


# 获取ac
def get_ac(sid, x, y):

    url = ""
    params = {
        
    }
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        logger.success('请求动态js:' + str(response.status_code))
    else:
        logger.error('请求动态js:' + str(response.status_code))

    # 替换动态js代码
    with open('./js/code.js', 'r', encoding='utf-8') as f:
        content = f.read()

    re_code = re.findall("/\* start \*/(\n.*\n.*)\n/\* end \*/", content, re.DOTALL)[0]
    content = content.replace(re_code, '\n' + response.text)


    with open('./js/code.js', 'w', encoding='utf-8') as f:
        f.write(content)


    with open('./js/vm.js', 'r', encoding='utf-8') as f:
        jscode = f.read()

    re_sid = re.findall("'sid' : '(.*)',", jscode)[0]
    re_x = re.findall("'pic_x' : (.*),", jscode)[0]
    re_y = re.findall("'pic_y' : (.*),", jscode)[0]

    jscode = jscode.replace(re_sid, sid).replace(re_x, str(x)).replace(re_y, str(y))

    with open('./js/vm.js', 'w', encoding='utf-8') as f:
        f.write(jscode)
        result = execjs.compile(jscode).call('get_result')
    return result



# 第一个接口
def first_request():
    url = ""
    params = {
    }
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        logger.success('请求第一个接口:' + str(response.status_code))
    else:
        logger.error('请求第一个接口:' + str(response.status_code))

    pic_bottom_url = 'https://' + json.loads(response.text)['p1']
    pic_slide_url = 'https://' + json.loads(response.text)['p2']
    sid = json.loads(response.text)['sid']
    y = json.loads(response.text)['y']
    # 返回第一个接口返回的必要数据
    return {
        'pic_bottom_url': pic_bottom_url,
        'pic_slide_url': pic_slide_url,
        'sid': sid,
        'y': y
    }


# 第二个滑动接口
def slide_request(ac, sid, x, y):
    url = ""
    data = {
    }
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

    # CV2识别滑块缺口距离
    distance = opencv2() - 14
    logger.info('滑块缺口距离:' + str(distance))

    # 获取ac参数
    ac = get_ac(first_list['sid'], distance, first_list['y'])

    # 请求第二个滑动接口
    slide_request(ac, first_list['sid'], distance, first_list['y'])
