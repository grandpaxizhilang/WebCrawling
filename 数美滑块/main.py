import json
import random
import execjs
import requests
from PIL import Image
import io
from loguru import logger
from ddddocr_pic import ddddocr_pic



def get_sm_track(distance):
    track_length = random.randint(4, 10)
    track = [[0, -2, 0]]
    m = distance % track_length
    e = int(distance / track_length)
    for i in range(track_length):
        x = (i + 1) * e + m + random.randint(20, 40)
        y = -2 + (random.randint(-1, 10))
        t = (i + 1) * 100 + random.randint(-3, 5)
        if i == track_length - 1:
            x = distance
            track.append([x, y, t])
        else:
            track.append([x, y, t])
    return track


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



def first_request():
    url = ""
    params = {
    }
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        logger.success('请求第一个接口:' + str(response.status_code))
    else:
        logger.error('请求第一个接口:' + str(response.status_code))

    response_json = json.loads(response.text.split('(')[1].split(')')[0])
    pic_bottom_url = '' + response_json['detail']['bg']
    pic_slide_url = '' + response_json['detail']['fg']
    rid = response_json['detail']['rid']

    return {
        'bg_url': pic_bottom_url,
        'fg_url': pic_slide_url,
        'rid': rid,
    }

def silde_request(rid,distance,trace):
    url = ""
    params = {
    }
    with open('./code.js','r',encoding='utf-8') as f:
        jscode = f.read()
        params['je'] = execjs.compile(jscode).call('DESEncrypt','5ea96022',str(distance/300))
        params['mu'] = execjs.compile(jscode).call('DESEncrypt', 'e7e1eb0d', str(trace).replace(' ',''))


    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        logger.success('请求滑动接口:' + str(response.status_code))
        logger.info(response.text)
    else:
        logger.error('请求滑动接口:' + str(response.status_code))


if __name__ == '__main__':
    headers = {
    }

    first_list = first_request()

    # 获取底层图片和滑块图片
    get_bottom_pic(first_list['bg_url'])
    get_slide_pic(first_list['fg_url'])

    # ddddocr识别滑块缺口距离(除以2是因为请求的图片是600*300，而网站的图片是300*150)
    distance = int((ddddocr_pic()) / 2)
    logger.info('滑块缺口距离:' + str(distance))

    # 生成轨迹
    # trace = get_slide_track(distance)
    trace = get_sm_track(distance)
    logger.info('生成的轨迹参数:' + str(trace))

    # 请求第二个滑动接口
    silde_request(first_list['rid'], distance, trace)


