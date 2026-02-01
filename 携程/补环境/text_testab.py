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
    "accept": "application/json",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    "content-type": "application/json;charset=UTF-8",
    "origin": "https://hotels.ctrip.com",
    "p": "21753324140",
    "priority": "u=1, i",
    "referer": "https://hotels.ctrip.com/",
    "sec-ch-ua": "\"Microsoft Edge\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0"
}
cookies = {
    "MKT_CKID": "1716621525229.0a30c.p5xy",
    "UBT_VID": "1716621525527.ba766vB4LEun",
    "GUID": "09031066416516426752",
    "_RF1": "223.160.230.38",
    "_RSG": "XZqvuCNNPoBqoo2Ozuxos8",
    "_RDG": "28d3d9e8a6cc2222c41dce0f3841ece293",
    "_RGUID": "bc995d73-38e7-48e1-8db2-ef8f580b2cb4",
    "MKT_Pagesource": "PC",
    "manualclose": "1",
    "Session": "smartlinkcode=U130727&smartlinklanguage=zh&SmartLinkKeyWord=&SmartLinkQuary=&SmartLinkHost=",
    "Union": "AllianceID=4902&SID=130727&OUID=&createtime=1716622026&Expires=1717226826070",
    "ibulanguage": "CN",
    "ibulocale": "zh_cn",
    "cookiePricesDisplayed": "CNY",
    "intl_ht1": "h4=2_441585",
    "librauuid": "",
    "cticket": "889EB3B37F54CC3C810A2C94D588BF0FD4F0999490A33B67DAD6F6FB48D387EC",
    "login_type": "0",
    "login_uid": "6F90D8C0A83076481A44FB774C417EAA",
    "DUID": "u=03789637FFE786FF7C36810405B8E4B9&v=0",
    "IsNonUser": "F",
    "AHeadUserInfo": "VipGrade=0&VipGradeName=%C6%D5%CD%A8%BB%E1%D4%B1&UserName=&NoReadMessageCount=0",
    "_bfa": "1.1716621525527.ba766vB4LEun.1.1716622524588.1716622543016.1.6.102003",
    "_jzqco": "%7C%7C%7C%7C%7C1.718742243.1716621525226.1716622524749.1716622543228.1716622524749.1716622543228.0.0.0.6.6"
}
url = "https://m.ctrip.com/restapi/soa2/21881/json/getHotelScript"
data = {
    "callback": callback(),
    "a": 441585,
    "d": "zh-cn",
    "e": 2,
    "head": {
        "Locale": "zh-CN",
        "Currency": "CNY",
        "Device": "PC",
        "UserIP": "223.160.224.61",
        "Group": "ctrip",
        "ReferenceID": "",
        "UserRegion": "CN",
        "AID": "4902",
        "SID": "130727",
        "Ticket": "",
        "UID": "",
        "IsQuickBooking": "",
        "ClientID": "09031066416516426752",
        "OUID": "",
        "TimeZone": "8",
        "P": "21753324140",
        "PageID": "102003",
        "Version": "",
        "HotelExtension": {
            "WebpSupport": True,
            "group": "CTRIP",
            "Qid": None,
            "hasAidInUrl": False
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
    url_ = "https://m.ctrip.com/restapi/soa2/21881/json/GetReviewList"
    params_ = {
        "testab": result
    }
    data_ = {
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
            "Locale": "zh-CN",
            "Currency": "CNY",
            "Device": "PC",
            "UserIP": "223.160.224.213",
            "Group": "ctrip",
            "ReferenceID": "",
            "UserRegion": "CN",
            "AID": "4902",
            "SID": "130727",
            "Ticket": "",
            "UID": "",
            "IsQuickBooking": "",
            "ClientID": "09031066416516426752",
            "OUID": "",
            "TimeZone": "8",
            "P": "21753324140",
            "PageID": "102003",
            "Version": "",
            "HotelExtension": {
                "WebpSupport": True,
                "group": "CTRIP",
                "Qid": None,
                "hasAidInUrl": False,
                "hotelUuidKey": "hZBxQsisbikqvbUrFgeGAEa1W4TKLDE4MjDY86yBtRLfJFmY1bEaMRLPj3TJ7YNArbDed6rmOe13E9NjdgWXArFsR9tvhYfSE88KBcEGoyc6wP1ea5j3JkLjLtw6Niz3jkJzBjkbwgPvSNjqJzhv6LY3Sy4MjP7vmzeTHYdcjglylfjq1YAsWbYXkW1jNTWfay4qj6cvOtEGOvPlW8fjtqwObIXnRoYFlefAvXQw8XYXhiNnwSmRA5EmAW0XJSw9OYhYbqKfjLhxtsJToipTw0YHPwk5WOzyLbJG4I0SeaYDmR7XeQPIncv3kYHZygnjl3vmDeSFYAtjazygJoTvplY4XyZUj1tvkhe1bYNPjaFybJqPYsmvhZWHdW87IT0IkfxXYUQENFj65vSlvh9e3BYfPiQnYAfy3Xrz0YaYSsi8Li1HJN3KgGJz3yFY8DrTmIlpvbZyGkvzsYdkw3Nj0pe5fiMPY0pw7piNLJq7jd9wTlegpYSzxAAKsyOsJD0EaYanwSbi3qe4hYQGihXiS3i1AjfSJc7rbQJqYhNwaLw3tKOkYdFvPMY0XwLaJG8wMHY3owbMjdSWzDetYAcxLEXgYdQRlHy0kRXQwZSvU3WFcYPpvpUvqlETAYhlWX5Eafj4ypJkYcwZcYsjoLwdsjnzy5Ya4J6By5pyfsRPqyolR9OwkZwLqYgkR1DJUGYTkJG5JZpYl9yDUY5HioaytYAPy7DwPkwmDjk5wTqvGljHbKLZJB8KAYOvMzi49I7SRTMJdbicZw49e3kjNzw4ZEzBy4PY8NEGYBDJd5WsPjk9RgZJ1TiqtwTnegnj6bidXE8ETnRMoI4YGfRM9x9hik9R98ypqRcMwstvk6WN4YGbvcTyo0JLUiagwA4J3fWHGyZki3Yo7vq0JqdWPTEn1j95WbLWM4W9hYNbYPtYD0Rm3Y9aWnmY4pYTtYkzjzlepNEQFWH7e4fwSHeUGjLGY6byHfEZGjqsE5hrBsjmfwgZym9wZfjfpekYqPROLW4qW3nWt6WaBY0YTzrg5ronxspv8UEPQWUmyOcjSJH4v7lEQkWakyP5j9BK5pWqhiZYTLKAbjQ9e4BEqnEaME9OR41Ecw3AJG7vMYOsJbUYNNK6aYBUEXoELNYSPYD7YLPYpQiM0ioT"
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






