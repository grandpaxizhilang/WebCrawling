import requests
import execjs
import hashlib


def md5_encrypt(data):
    md5 = hashlib.md5()
    md5.update(data.encode('utf-8'))
    return md5.hexdigest()


def get_x_zse_96(tt):
    with open('zse_96.js', 'r', encoding='utf-8') as fp:
        jscode = fp.read()
        ctx = execjs.compile(jscode)
        result = ctx.call('get_zse_96', tt)
        # print(result)
        return result


def get_request():
    headers = {
        "x-zse-93": "101_3_3.0",
    }
    cookies = {
        "d_c0": "XXXXXX",
    }
    url = "aHR0cHM6Ly93d3cuemhpaHUuY29tL2FwaS92NC9zZWFyY2gvaG90X3NlYXJjaA"

    tt = md5_encrypt(headers["x-zse-93"] + "+" + url.replace("https://www.zhihu.com", "") + "+" + cookies["d_c0"])
    headers["x-zse-96"] = get_x_zse_96(tt)

    response = requests.get(url, headers=headers, cookies=cookies)
    print(response.text)
    print(response)


if __name__ == '__main__':
    get_request()