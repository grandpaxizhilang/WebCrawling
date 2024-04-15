import requests
import json
import execjs

headers = {

    "content-type": "application/x-www-form-urlencoded",
    "origin": "",
    "referer": "",
    "user-agent": ""
}
cookies = {

}
url = ""
params = {

}

data = {
    "comm": {
        "cv": 4747474,
        "ct": 24,
        "format": "json",
        "inCharset": "utf-8",
        "outCharset": "utf-8",
        "notice": 0,
        "platform": "yqq.json",
        "needNewCode": 1,
        "uin": 0,
        "g_tk_new_20200303": 5381,
        "g_tk": 5381
    },
    "req_1": {
        "module": "music.musicsearch.HotkeyService",
        "method": "GetHotkeyForQQMusicMobile",
        "param": {
            "searchid": "23973923384123849",
            "remoteplace": "txt.yqq.top",
            "from": "yqqweb"
        }
    },
    "req_2": {
        "module": "music.musicHall.MusicHallPlatformSvr",
        "method": "GetFocus",
        "param": {}
    },
    "req_3": {
        "module": "newalbum.NewAlbumServer",
        "method": "get_new_album_area",
        "param": {}
    },
    "req_4": {
        "module": "newalbum.NewAlbumServer",
        "method": "get_new_album_info",
        "param": {
            "area": 1,
            "sin": 0,
            "num": 20
        }
    },
    "req_5": {
        "module": "musicToplist.ToplistInfoServer",
        "method": "GetAll",
        "param": {}
    },
    "req_6": {
        "module": "MvService.MvInfoProServer",
        "method": "GetNewMv",
        "param": {
            "style": 0,
            "tag": 0,
            "start": 0,
            "size": 40
        }
    },
    "req_7": {
        "module": "music.paycenterapi.LoginStateVerificationApi",
        "method": "GetChargeAccount",
        "param": {
            "appid": "mlive"
        }
    }
}
data = json.dumps(data, separators=(',', ':'))


js = open('code.js', 'r', encoding='utf-8').read()
ctx = execjs.compile(js)
# 调用js里面的函数（第一个是函数名，参数）
result = ctx.call('get_sign', data)
params["sign"] = result[0]
params["_"] = result[1]

response = requests.post(url, headers=headers, cookies=cookies, params=params, data=data)

print(response.text)
print(response)