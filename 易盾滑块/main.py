import json
import re
import execjs
import requests
from PIL import Image
import io
from loguru import logger
from ddddocr_pic import ddddocr_pic
from Trace import get_slide_track

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


def first_request(cb, fp):
    url = ""
    params = {
    }

    params['cb'] = cb
    params['fp'] = fp

    response = requests.get(url, headers=headers, cookies=cookies, params=params)
    if response.status_code == 200:
        logger.success('请求第一个接口:' + str(response.status_code))
    else:
        logger.error('请求第一个接口:' + str(response.status_code))

    response_json = json.loads(response.text.split('(')[1].split(')')[0])
    pic_bottom_url = response_json['data']['bg'][0]
    pic_slide_url = response_json['data']['front'][0]
    token = response_json['data']['token']

    return {
        'bg_url': pic_bottom_url,
        'fg_url': pic_slide_url,
        'token': token,
    }


def silde_request(token,cb,data):
    url = ""
    params = {

    }
    params['token'] = token
    params['data'] = data
    params['cb'] = cb

    response = requests.get(url, headers=headers,cookies=cookies, params=params)
    if response.status_code == 200:
        logger.success('请求滑动接口:' + str(response.status_code))
        logger.info(response.text)
    else:
        logger.error('请求滑动接口:' + str(response.status_code))


if __name__ == '__main__':
    headers = {

    }
    cookies = {

    }
    with open('./js/vm.js','r',encoding='utf-8') as f:
        jscode = f.read()
        # 第一次请求接口
        result = execjs.compile(jscode).call('get_result')
        cb = result[0]
        fp = result[1]
        first_list = first_request(cb, fp)

        # 获取底层图片和滑块图片
        get_bottom_pic(first_list['bg_url'])
        get_slide_pic(first_list['fg_url'])

        # ddddocr识别滑块缺口距离
        distance = ddddocr_pic()
        logger.info('滑块缺口距离:' + str(distance))

        # 生成轨迹
        trace = get_slide_track(distance)
        logger.info('生成的轨迹参数:' + str(trace))

        # 请求第二个滑动接口,先动态替换轨迹和滑块距离变量生成加密参数
        re_token = re.findall("'token' : '(.*)',", jscode)[0]
        re_distance = re.findall("'distance' : (.*),", jscode)[0]
        re_trace = re.findall("'trace' : (.*),", jscode)[0]

        jscode = jscode.replace(re_token, first_list['token']).replace(re_distance, str(distance)).replace(re_trace, str(re_trace))
        result = execjs.compile(jscode).call('get_result')

        silde_request(first_list['token'], result[0], result[2])


