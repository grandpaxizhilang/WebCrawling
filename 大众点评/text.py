import execjs
import requests


headers = {

}
cookies = {

}
url = ""
params = {

}

with open('vm.js','r',encoding='utf-8') as fp:
    jscode = fp.read()
    result = execjs.compile(jscode).call('get_result')
    print(result)
    params["mtgsig"] = result

    response = requests.get(url, headers=headers, cookies=cookies, params=params)

    print(response.text)
    print(response)


