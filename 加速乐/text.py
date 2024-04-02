import json
import execjs
import requests
import execjs

cookie = {}


url = ''
headers = {
    'User-Agent':''
}

# 第一次请求的网址，获取cookie的__jsluid_s和__jsl_clearance_s来更新下一个网址
response1 = requests.get(url=url,headers=headers)
data1 = response1.text.split('cookie=')[1].split(';location')[0]
cookie['__jsl_clearance_s'] = execjs.eval(data1).split(';')[0].split('=')[1]

# 更新cookie
cookie.update(response1.cookies)

# 第二次请求网址
response2 = requests.get(url= url,headers=headers,cookies=cookie)
data2 = response2.text.split(';go(')[1].split(')<')[0]

# 准备参数
params = json.loads(data2)


# 打开js文件运行里面的函数
js = open('node.js', 'r', encoding='utf-8').read()
ctx = execjs.compile(js)
# 调用js里面的函数（第一个是函数名，参数）   获取网站重新生成的 __jsl_clearance_s
cookie['__jsl_clearance_s'] = ctx.call('get_key', params).split(";")[0].split('=')[1]


# 再次更新cookie
cookie.update(cookie)

# 第三次请求网站，获取网页数据
response3 = requests.get(url=url,headers=headers,cookies=cookie)
response3.encoding = 'utf-8'
print(response3.text)

