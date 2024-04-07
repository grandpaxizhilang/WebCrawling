
import execjs
import requests


js = open('code.js', 'r', encoding='utf-8').read()
ctx = execjs.compile(js)
# 调用js里面的函数（第一个是函数名，参数）
result = ctx.call('get_result','{"query":"python","pageNum":1,"limit":15}')

url = "" + result['b'] + "&kiv=" +result['kiv']
headers = {
    "referer": "",
    "user-agent": "",
    'Cookie':''
}

response = requests.get(url, headers=headers)
data = response.text

js = open('code.js', 'r', encoding='utf-8').read()
ctx = execjs.compile(js)
# 调用js里面的函数（第一个是函数名，参数）
result = ctx.call('get_data',data,result['kiv'])

print(result)