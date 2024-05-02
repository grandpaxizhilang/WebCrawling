import execjs
import requests
import json


headers = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "currencycode": "USD",
    "deviceid": "9aefb48c-5b9c-4349-b714-f757483b4d3b",
    "devicetype": "pc",
    "language": "en",
    "origin": "",
    "platform": "pc",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "referer": "",
    "region": "US",
    "sec-ch-ua": "\"Chromium\";v=\"124\", \"Microsoft Edge\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sk": "9Or7Otj9tTqFc3gy3txZG6Lx6npXqxh88trQuKQlRQD8O1gU6TT1HfeckKICAhyiO5AY0dQvOCoVOGRpZGt3K9zoo61w",
    "timezone": "G+08:00",
    "traceparent": "00-f5067fe56632071e806447e2a9530590-d483a215ff4f7112-01",
    "user-agent": ""
}
cookies = {
}
url = ""
params = {
}
data = {
    "scene": 1,
    "keywords": "Jordan",
    "recSpuIds": [],
    "pageNum": 1,
    "pageSize": 60,
    "url": "/search"
}


with open('code.js','r',encoding='utf-8')as fp:
    jscode = fp.read()
    result = execjs.compile(jscode).call('get_sign',data)
    params['sign'] = result

    data = json.dumps(data, separators=(',', ':'))
    response = requests.post(url, headers=headers, cookies=cookies, params=params, data=data)

    print(response.text)
    print(response)