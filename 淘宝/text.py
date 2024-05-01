import execjs
import requests


headers = {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "referer": "",
    "sec-ch-ua": "\"Chromium\";v=\"124\", \"Microsoft Edge\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "script",
    "sec-fetch-mode": "no-cors",
    "sec-fetch-site": "same-site",
    "user-agent": ""
}
cookies = {
}
url = ""
params = {
    "jsv": "2.5.1",
    "appKey": "12574478",
    "t": "1714551738901",
    "sign": "7ff96bfec1f335660ece753bf2f8bd9c",
    "v": "2.0",
    "timeout": "10000",
    "dataType": "jsonp",
    "valueType": "original",
    "jsonpIncPrefix": "tbbe",
    "api": "mtop.relationrecommend.WirelessRecommend.recommend",
    "type": "originaljsonp",
    "callback": "mtopjsonptbbe8",
    "data": "{\"appId\":\"30986\",\"params\":\"{\\\"pageNum\\\":0,\\\"pageSize\\\":60}\"}"
}


with open('code.js','r',encoding='utf-8') as fp:
    appKey = params['appKey']
    data = params['data']
    jscode = fp.read()
    result = execjs.compile(jscode).call('get_sign',appKey,data)
    print(result)
    params['sign'] = result[0]
    params['t'] = result[1]


    response = requests.get(url, headers=headers, cookies=cookies, params=params)

    print(response.text)
    print(response)

