import json
import execjs
import requests
from PIL import Image
import io
from loguru import logger
from ddddocr_pic import ddddocr_pic
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

    # 裁剪图片
    cropped_img = image.crop((140, 490, 260, 610))

    # 保存裁剪后的图片
    cropped_img.save('./img/slide.png')


# 第一个接口
def first_request():
    url = "https://turing.captcha.qcloud.com/cap_union_prehandle"
    params = {
        "aid": "199999861",
        "protocol": "https",
        "accver": "1",
        "showtype": "popup",
        "ua": "TW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyNy4wLjAuMCBTYWZhcmkvNTM3LjM2IEVkZy8xMjcuMC4wLjA=",
        "noheader": "1",
        "fb": "1",
        "aged": "0",
        "enableAged": "0",
        "enableDarkMode": "0",
        "grayscale": "1",
        "clientype": "2",
        "cap_cd": "",
        "uid": "",
        "lang": "zh-cn",
        "entry_url": "https://cloud.tencent.com/product/captcha",
        "elder_captcha": "0",
        "js": "/tcaptcha-frame.6b7c7665.js",
        "login_appid": "",
        "wb": "2",
        "subsid": "3",
        "callback": "_aq_410921",
        "sess": ""
    }
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        logger.success('请求第一个接口:' + str(response.status_code))
    else:
        logger.error('请求第一个接口:' + str(response.status_code))
    response_json = json.loads(response.text.split('(')[1].split(')')[0])

    pic_bottom_url = 'https://turing.captcha.qcloud.com' + response_json["data"]["dyn_show_info"]["bg_elem_cfg"]["img_url"]
    pic_slide_url = 'https://turing.captcha.qcloud.com' + response_json["data"]["dyn_show_info"]["sprite_url"]
    sess = response_json['sess']
    y = response_json["data"]["dyn_show_info"]["fg_elem_list"][1]["init_pos"][1]
    js_file = response_json['data']['comm_captcha_cfg']['tdc_path']
    # 返回第一个接口返回的必要数据
    return {
        'pic_bottom_url': pic_bottom_url,
        'pic_slide_url': pic_slide_url,
        'y': y,
        'sess': sess,
        'js_file': js_file
    }

# 第二个滑动接口
def slide_request(captchaId, token, k, length):
    url = "https://captcha.jiagu.360.cn/api/v3/check"
    data = {
        "captchaId": captchaId,
        "token": token,
        "length": length,
        "version": "2.0.0",
        "width": "300",
        # "report": '',
        "tracking": "[object Object]"
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
        "Accept": "*/*",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Pragma": "no-cache",
        "Referer": "https://cloud.tencent.com/",
        "Sec-Fetch-Dest": "script",
        "Sec-Fetch-Mode": "no-cors",
        "Sec-Fetch-Site": "cross-site",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
        "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Microsoft Edge\";v=\"127\", \"Chromium\";v=\"127\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\""
    }

    # 请求第一个接口
    first_list = first_request()

    # 获取底层图片和滑块图片
    get_bottom_pic(first_list['pic_bottom_url'])
    get_slide_pic(first_list['pic_slide_url'])

    # ddddocr识别滑块缺口距离
    distance = ddddocr_pic()
    logger.info('滑块缺口距离:' + str(distance))

    # 请求第二个滑动接口
    # slide_request(first_list['captchaId'], first_list['token'], first_list['k'], distance)

