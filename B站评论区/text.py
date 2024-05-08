import json
import time
import requests
import re
import hashlib
import urllib.parse

session = requests.session()

headers = {
    'Origin':'https://space.bilibili.com',
    'Referer':'https://space.bilibili.com',
    'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0'
}

cookie = {
    "buvid3": "D1EB1C3E-15B1-EF1E-04B3-18CDD3AF80F650899infoc",
    "b_nut": "1709195250",
    "buvid4": "AF6DC7F7-0576-8584-C3A3-A11C1E3D563850899-024022908-NJZlfXRzL2DLcte75U0ArQ%3D%3D",
    "_uuid": "F3D96B4A-F9C8-11C5-B1068-581022437E5D155189infoc",
    "DedeUserID": "86853068",
    "DedeUserID__ckMd5": "89cba52406e553bd",
    "rpdid": "|(JlRYJlukku0J'u~|muml~JJ",
    "enable_web_push": "DISABLE",
    "header_theme_version": "CLOSE",
    "LIVE_BUVID": "AUTO7517092084513301",
    "buvid_fp_plain": "undefined",
    "hit-dyn-v2": "1",
    "share_source_origin": "WEIXIN",
    "CURRENT_QUALITY": "80",
    "go-back-dyn": "0",
    "fingerprint": "6663bd3cc6ffac7d84be2b0a2f5fbd81",
    "buvid_fp": "6663bd3cc6ffac7d84be2b0a2f5fbd81",
    "bsource": "search_bing",
    "FEED_LIVE_VERSION": "V_WATCHLATER_PIP_WINDOW3",
    "bp_video_offset_86853068": "920102155129454611",
    "home_feed_column": "5",
    "SESSDATA": "e6b3e0df%2C1730515304%2C3f64b%2A52CjDSSYtqQo2PyCZcmfHgaWL6Ye8sQUAUz9gjtiuF-fdeCTCAlTWI2ktc6RRQ4HWEOLoSVjhvNDAyMThfNzZrTW5HTHB4YkhlMkd6NHh1c1d3YnB2LW5MczY0dUJjWGlfTW10WVFyRXpsQnQzS1NTX1VlV3dTaENUTHg5NF8wa1ljX3NKNFBZWklBIIEC",
    "bili_jct": "621f6d765818b1d09cc78bc94074dc62",
    "sid": "7uppjlic",
    "CURRENT_FNVAL": "4048",
    "bili_ticket": "eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTUzMzM0NzIsImlhdCI6MTcxNTA3NDIxMiwicGx0IjotMX0.jN4sZGqzCWxynEpKq3DWTijkJwNMrxQj7UY-zW0T4b4",
    "bili_ticket_expires": "1715333412",
    "bp_t_offset_86853068": "928810416067313705",
    "browser_resolution": "1482-724",
    "b_lsid": "DFCA97DC_18F56CAFC81"
}

def md5_encode(s):
    m = hashlib.md5()
    m.update(s.encode('utf-8'))
    return m.hexdigest()

def encode_uri_component(s):
    return urllib.parse.quote(s, safe='~()*!.\'')

def get_rid(data):
    H = 'ea1db124af3c7062474693fa704f4ff8'
    q = sorted(data.keys())
    ne = []
    te = re.compile(r"[!'()*]")
    for oe in range(len(q)):
        le = q[oe]
        de = data[le]
        if de and type(de) == 'str':
            de = te.sub("", de)
        if le == 'pagination_str':
            ne.append(f"pagination_str={encode_uri_component(de)}")
        else:
            ne.append(f'{le}={de}')
    ee = '&'.join(ne)
    w_rid = md5_encode(ee + H)
    return w_rid


# 请求父评论区返回数据
def request_main():
    url = 'https://api.bilibili.com/x/v2/reply/wbi/main'

    params = {
        "oid": '1354042421',
        "type": '1',
        "mode": '3',
        "pagination_str": "{\"offset\":\"\"}",
        "plat": '1',
        "seek_rpid": "",
        "web_location": "1315875",
        "wts": int(time.time())
    }
    # 生成加密参数
    w_rid = get_rid(params)
    params['w_rid'] = w_rid

    # 发送请求
    response = session.get(url=url, headers=headers, params=params, cookies=cookie)
    # print(response.text)
    # print(response)

    # 程序睡眠，防风控
    time.sleep(0.5)

    # 下一页的请求参数，爬取每下一页的请求参数都一样，就时间戳和加密参数发生了变化
    params_next = {
        "oid": "1354042421",
        "type": "1",
        "mode": "3",
        "pagination_str": "{\"offset\":\"{\\\"type\\\":1,\\\"direction\\\":1,\\\"session_id\\\":\\\"1756344138195927\\\",\\\"data\\\":{}}\"}",
        "plat": "1",
        "web_location": "1315875",
    }

    # 这里保持一个会话一直请求就可以实现翻页的操作(这里可以直接使用while死循环)
    for i in range(4):
        # 这里重新赋值请求参数并把时间戳和加密参数放进去
        params = params_next.copy()
        params["wts"] = int(time.time())
        w_rid = get_rid(params)
        params['w_rid'] = w_rid

        # 发送请求
        response_next = session.get(url=url, headers=headers, params=params, cookies=cookie)

        comments = json.loads(response_next.text)


        print(comments['data']['replies'])
        print(response_next)

        # 防风控
        time.sleep(1)

        # 判断是否爬到最后一页    判断的标准是re
        if not comments['data']['replies']:
            break

    print('已完成全部页面评论的爬取')

if __name__ == '__main__':
    request_main()
