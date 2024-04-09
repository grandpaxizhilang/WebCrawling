import execjs
import requests


# 打开js文件运行里面的函数
js = open('./code.js', 'r', encoding='utf-8').read()
ctx = execjs.compile(js)
# 调用js里面的函数（第一个是函数名，参数）
result = ctx.call('get_result')


url = ""

headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Timestamp': str(result['Timestamp']),
    'RequestId': result['RequestId'],
    'Sign': result['Sign'],
}

response = requests.post(url, headers=headers,data=result['data'])
data = response.json()['data']


# 打开js文件运行里面的函数
js = open('./code_data.js', 'r', encoding='utf-8').read()
ctx = execjs.compile(js)
# 调用js里面的函数（第一个是函数名，参数）
result = ctx.call('get_data',data)

print(result)
