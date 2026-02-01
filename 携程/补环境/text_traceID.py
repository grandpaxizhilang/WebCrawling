import requests
import json
import time
import random


headers = {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    "content-type": "application/json",
    "cookieorigin": "https://www.ctrip.com",
    "origin": "https://www.ctrip.com",
    "priority": "u=1, i",
    "referer": "https://www.ctrip.com/",
    "sec-ch-ua": "\"Microsoft Edge\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0"
}
cookies = {
    "_jzqco": "%7C%7C%7C%7C%7C1.718742243.1716621525226.1716621525226.1716621525226.1716621525226.1716621525226.0.0.0.1.1",
    "MKT_CKID": "1716621525229.0a30c.p5xy",
    "UBT_VID": "1716621525527.ba766vB4LEun",
    "Session": "smartlinkcode=U130727&smartlinklanguage=zh&SmartLinkKeyWord=&SmartLinkQuary=&SmartLinkHost=",
    "Union": "AllianceID=4902&SID=130727&OUID=&createtime=1716621526&Expires=1717226325768",
    "GUID": "09031066416516426752",
    "_RF1": "223.160.230.38",
    "_RSG": "XZqvuCNNPoBqoo2Ozuxos8",
    "_RDG": "28d3d9e8a6cc2222c41dce0f3841ece293",
    "_RGUID": "bc995d73-38e7-48e1-8db2-ef8f580b2cb4",
    "MKT_Pagesource": "PC",
    "manualclose": "1",
    "_bfa": "1.1716621525527.ba766vB4LEun.1.1716621525538.1716621664212.1.2.102001"
}
url = "https://m.ctrip.com/restapi/soa2/22370/getRecommendHotelList"
params = {
    "_fxpcqlniredt": "09031066416516426752",
    "x-traceID": "{}-{}-{}".format(cookies['GUID'], int(time.time() * 1000), int(random.random() * 1e7))
}
data = {
    "cityId": 2,
    "hotCities": False,
    "oversea": False,
    "head": {
        "cid": "09031066416516426752",
        "ctok": "",
        "cver": "1.0",
        "lang": "01",
        "sid": "8888",
        "syscode": "PC",
        "auth": "",
        "xsid": "",
        "extension": [
            {
                "name": "sdkversion",
                "value": "2.22.0"
            },
            {
                "name": "openid",
                "value": "ce0ae70f-9365-487c-8769-ec5918409aae"
            },
            {
                "name": "supportWebP",
                "value": "true"
            },
            {
                "name": "scene",
                "value": "1036"
            }
        ]
    }
}


data = json.dumps(data, separators=(',', ':'))
response = requests.post(url, headers=headers, cookies=cookies, params=params, data=data)

print(response.text)
print(response)