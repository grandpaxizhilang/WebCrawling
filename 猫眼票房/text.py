import execjs
import requests

headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Pragma": "no-cache",
    "Referer": ,
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": ,
    "X-FOR-WITH": "JxTp5DM6xedZ+335ZVXS56GNS9Eip1GpwtdrGjD5lk9cIhg4AECicqhMnbL1tHmOYiKHJ7r0qWemsXmdQZIMBoBckLo533F0nbup9eYzr47Wjof3/sDvYU5xczco6kZ6BGJPSI+Q9QAisyGL5rEFbayHLEzBIU1hw8HZaZ/82LAn2gieQGv61iBf0KEzmHxjhfikgZa/sRGSHshrCTMepw==",
    "sec-ch-ua": "\"Chromium\";v=\"124\", \"Microsoft Edge\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\""
}
cookies = {

}
url = ""
params = {
    "showDate": "20240420",
    "movieId": "1489410",
    "orderType": "0",
    "uuid": "18f1a1cf5bdc8-0225e37eb0d65e-4c657b58-144000-18f1a1cf5bdc8",
    "channelId": "40009",
    "sVersion": "2",
}


with open('code.js','r',encoding='utf-8') as fp:
    jscode = fp.read()
    result = execjs.compile(jscode).call('get_result',headers["User-Agent"])

    params["index"] = result[0]
    params["User-Agent"] = result[1]
    params["timeStamp"] = result[2]
    params['signKey'] = result[3]

    response = requests.get(url, headers=headers, cookies=cookies, params=params)

    print(response.text)
    print(response)









