import execjs
import requests

# 爬取动态js文件
code_url = 'js'
code_headers = {
    "Referer": "",
    "User-Agent": "",
}
code = requests.get(url=code_url,headers=code_headers).text

# 把爬下来的动态js保存到本地
with open('code.js', 'w', encoding='utf-8') as fp:
    fp.write(';;;debugger;;;try{function get_cookie(){' + code + 'return document.cookie;}}catch(e){debugger;;console.log(e);}get_cookie();;;debugger;;;')

# 打开js文件运行里面的函数
js = open('./vm.js', 'r', encoding='utf-8').read()
ctx = execjs.compile(js)
# 调用js里面的函数（第一个是函数名，参数）
result = ctx.call('get_result')


v = result.split('=')[1].split(';')[0]


headers = {
    "Referer": "",
    "User-Agent": " ",
    "hexin-v": v,
    'Host':'',
    'Cookie':'' +v
}
url = ""
params = {
    'scene': 'wap_search_shade_stock_query',
    'userId': '0'
}
response = requests.get(url, headers=headers, params=params)

print(response.text)
print(response)









