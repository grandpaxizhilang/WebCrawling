import requests
import json
import execjs

headers = {
    "accept": "application/json",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    "cache-control": "no-cache",
    "content-type": "application/x-www-form-urlencoded",
    "origin": "https://y.qq.com",
    "pragma": "no-cache",
    "referer": "https://y.qq.com/",
    "sec-ch-ua": "\"Microsoft Edge\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0"
}
cookies = {
    "pgv_pvid": "8280765235",
    "fqm_pvqid": "f83ca148-d816-4f64-99c3-88d5d2f16389",
    "fqm_sessionid": "0ea3e865-6743-4cc9-a31e-10f93ba94f4f",
    "pgv_info": "ssid=s2928236476",
    "ts_refer": "music.qq.com/",
    "ts_uid": "6723463472",
    "ts_last": "y.qq.com/"
}
url = "https://u6.y.qq.com/cgi-bin/musics.fcg"
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