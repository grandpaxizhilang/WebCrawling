import requests
import execjs

 # 打开js文件运行里面的函数
js = open('./vm.js', 'r', encoding='utf-8',errors='ignore').read()
ctx = execjs.compile(js)
# 调用js里面的函数（第一个是函数名，参数）
result = ctx.call('get_result')

print(result)

headers = {
    'User-Agent':'',
    "Referer": "",
}
url = ""
params = {
    "tf_id": "TFRQ0v00000Y_14351",
    "page": "1",
    "size": "100",
    "anti_content": result
}

response = requests.get(url, headers=headers, params=params)

print(response.text)
print(response)

