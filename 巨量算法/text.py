import os
import random

import execjs
import requests


def get_ms_token(randomlength):
    """
    根据传入长度产生随机字符串
    """
    random_str = ''
    base_str = 'ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz0123456789=_-'
    length = len(base_str) - 1
    for _ in range(randomlength):
        random_str += base_str[random.randint(0, length)]
    return random_str


headers = {

    "referer": "",
    "user-agent": ""
}
cookies = {

}
url = ""
params = {
    "app": "aweme",
    "num": "30",
    "date": "",
}

params["msToken"] = get_ms_token(128)

with open('vm.js','r',encoding='utf-8') as fp:
    params["msToken"] = get_ms_token(128)
    jscode = fp.read()
    result = execjs.compile(jscode).call('get_result',params["msToken"])
    params["X-Bogus"] = result['xb']
    params["_signature"] = result['sig']
    response = requests.get(url, headers=headers, cookies=cookies, params=params)

    print(response.text)





