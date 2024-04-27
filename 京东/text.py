import execjs
import requests


headers = {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "referer": ,
    "sec-ch-ua": "\"Chromium\";v=\"124\", \"Microsoft Edge\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "script",
    "sec-fetch-mode": "no-cors",
    "sec-fetch-site": "same-site",
    "user-agent": 
}
cookies = {

}
url = "https://api.m.jd.com/"
params = {
    "appid": "www-jd-com",
    "body": "{\"page\":1,\"pagesize\":25,\"area\":\"19_1601_0_0\",\"source\":\"pc-home\"}",
    "clientVersion": "1.0.0",
    "client": "pc",
    "functionId": "pc_home_feed",
    "t": "1714217695937",
    "uuid": "76161171.17142045310811581360051.1714204531.1714214612.1714217526.5",
    "loginType": "3",
    "callback": "jsonpMore2Goods",
    "_": "1714220497492"
}


with open('vm.js','r',encoding='utf-8') as fp:
    jscode = fp.read()
    result = execjs.compile(jscode).call('get_result')
    # print(result)
    # params['h5st'] = result

    response = requests.get(url, headers=headers, cookies=cookies, params=params)

    print(response.text)
    print(response)



