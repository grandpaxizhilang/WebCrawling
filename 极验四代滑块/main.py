import json
import execjs
import requests
from PIL import Image
import io
from loguru import logger
from OpenCv import get_distance
import time
import random
import hashlib
from Trace import get_slide_track



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


def get_challenge():
    template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    uuid_str = ''
    for c in template:
        if c == 'x':
            uuid_str += random.choice('0123456789abcdef')
        elif c == 'y':
            uuid_str += random.choice('89ab')
        else:
            uuid_str += c
    return uuid_str


# 第一个接口
def first_request():
    url = ""
    params = {
    }
    params['challenge'] = get_challenge()
    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 200:
        logger.success('请求第一个接口:' + str(response.status_code))
    else:
        logger.error('请求第一个接口:' + str(response.status_code))

    response_json = json.loads(''.join(response.text.split('(')[1:])[:-1])
    pic_bottom_url =  response_json["data"]["bg"]
    pic_slide_url =  response_json["data"]["slice"]
    lot_number = response_json["data"]["lot_number"]
    payload = response_json["data"]["payload"]
    process_token = response_json["data"]["process_token"]
    datatime = response_json["data"]["pow_detail"]["datetime"]
    # 返回第一个接口返回的必要数据
    return {
        'pic_bottom_url': pic_bottom_url,
        'pic_slide_url': pic_slide_url,
        'lot_number': lot_number,
        'payload': payload,
        'process_token': process_token,
        'datatime': datatime
    }


# 第二个滑动接口
def slide_request(lot_number, payload, process_token, datatime, distance, slide_time):
    url = ""
    params = {
    }
    with open('./js/code.js', 'r', encoding='utf-8') as f:
        jscode = f.read()
        result = execjs.compile(jscode).call('get_result', lot_number, params['captcha_id'], datatime, distance, slide_time)
        # print(result)
        params['w'] = result
    response = requests.get(url, headers=headers, params=params)

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
    # print(first_list)

    # 获取底层图片和滑块图片
    get_bottom_pic(first_list['pic_bottom_url'])
    get_slide_pic(first_list['pic_slide_url'])

    # ddddocr识别滑块缺口距离
    distance = int(get_distance())
    logger.info('滑块缺口距离:' + str(distance))

    # 获取轨迹和滑动时间
    slide_trace = get_slide_track(distance)
    logger.info('滑动轨迹:' + str(slide_trace['trace']))
    logger.info('滑动时间:' + str(slide_trace['t']))

    # 请求第二个滑动接口
    slide_request(first_list['lot_number'], first_list['payload'], first_list['process_token'], first_list['datatime'], distance, slide_trace['t'])

