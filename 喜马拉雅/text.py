import execjs
import requests

headers = {

}
cookies = {
}
url = ""
params = {
    "size": "10"
}

with open('code.js','r',encoding='utf-8')as fp:
    jscode = fp.read()
    result = execjs.compile(jscode).call('get_xm')
    headers['xm-sign'] = result

    response = requests.get(url, headers=headers, cookies=cookies, params=params)

    print(response.text)
    print(response)



