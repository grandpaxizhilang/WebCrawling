import execjs
import requests
import json
import re
import random


def callback():
    e = "qwertyuiopasdfg$hjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM"
    t = ""
    for n in range(10):
        t += random.choice(e)
    return t



headers = {
}
cookies = {
}
url = ""
data = {
    {
    "callback": callback(),
    "a": 441585,
    "d": "zh-cn",
    "e": 2,
    "head": {
 
        },
        "Frontend": {
            "vid": "1716621525527.ba766vB4LEun",
            "sessionID": "7",
            "pvid": "1"
        }
    },
    "ServerData": ""
}
data = json.dumps(data, separators=(',', ':'))
response = requests.post(url, headers=headers, cookies=cookies, data=data)
code = json.loads(response.text)['Response']

sub_str = ';var ref ='
count = 0
for match in re.finditer(sub_str, code):
    if count == 1:
        new_code = ';;;debugger;;;try{' + code[:match.start()] + ';window.chl = args' + code[match.start():] + '}catch(e){console.log(e);debugger;};window.chl[1]();;;debugger;;;'
        with open('code.js', 'w', encoding='utf-8') as fp:
            fp.write(new_code)
        break
    count += 1

with open('vm.js','r',encoding='utf-8')as fp:
    jscode = fp.read()
    result = execjs.compile(jscode).call('get_result')
    url_ = ""
    params_ = {
        "testab": result
    }
    data_ = {
        {
        "PageNo": 1,
        "PageSize": 10,
        "MasterHotelId": 532874,
        "NeedFilter": True,
        "UnUsefulPageNo": 1,
        "UnUsefulPageSize": 5,
        "isHasFold": False,
        "genk": True,
        "genKeyParam": {
            "a": 532874,
            "d": "zh-cn",
            "e": 2
        },
        "ssr": False,
        "head": {

        },
            "Frontend": {
                "vid": "1716621525527.ba766vB4LEun",
                "sessionID": "8",
                "pvid": "4"
            }
        },
        "ServerData": ""
    }
    data_ = json.dumps(data_, separators=(',', ':'))
    response = requests.post(url_, headers=headers, cookies=cookies, params=params_, data=data_)

    print(response.text)
    print(response)






