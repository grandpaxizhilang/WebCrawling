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
    data = f'msToken={params["msToken"]}&msToken={params["msToken"]}'

    # print(data)
    result = execjs.compile(jscode).call('get_result',data)

    params['a_bogus'] = result
    # print(params)
    # print(result)
    response = requests.get(url, headers=headers, cookies=cookies, params=params)
    print(response.text)
    print(response)