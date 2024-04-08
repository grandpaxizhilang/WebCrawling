import execjs
import requests

url = ''
headers = {
    "Referer": "",
    'Cookie':'',
    "User-Agent": "",
}
params = {
    'keyid': 'webfanyi-key-getter',
    'client': 'fanyideskweb',
    'product': 'webfanyi',
    'appVersion': '1.0.0',
    'vendor': 'web',
    'pointParam': 'client,mysticTime,product',
    'keyfrom': 'fanyi.web',
    'mid': '1',
    'screen': '1',
    'model': '1',
    'network': 'wifi',
    'abtest': '0',
    'yduuid': 'abcdefg'
}


url_end = ''

data = {
    'from': 'auto',
    'to': '',
    'dictResult': 'true',
    'keyid': 'webfanyi',
    'client': 'fanyideskweb',
    'product': 'webfanyi',
    'appVersion': '1.0.0',
    'vendor': 'web',
    'pointParam': 'client,mysticTime,product',
    'keyfrom': 'fanyi.web',
    'mid': '1',
    'screen': '1',
    'model': '1',
    'network': 'wifi',
    'abtest': '0',
    'yduuid': 'abcdefg'
}

with open('code.js','r',encoding='utf-8') as fp:
    jscode = fp.read()
    ctx = execjs.compile(jscode)
    result = ctx.call('get_sign','asdjnjfenknafdfsdfsd')
    params['sign'] = result['sign']
    params['mysticTime'] = result['o']

    response = requests.get(url = url,headers= headers,params=params)
    secretKey = response.json()['data']['secretKey']
    key = response.json()['data']['aesKey']
    iv = response.json()['data']['aesIv']
    result = ctx.call('get_sign', secretKey)
    data['sign'] = result['sign']
    data['mysticTime'] = result['o']
    # 这里的i是要翻译的内容
    data['i'] = 'get'

    response = requests.post(url=url_end,headers=headers,data=data)
    data = response.text
    result = ctx.call('get_data', data,key,iv)
    print(result)


