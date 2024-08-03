import execjs
import requests
import re

session = requests.session()

cookie = {

}

# 第一次请求页面，返回网站自己生成的cookie_s，还有一个HTML页面，里面的mete_content和一个自执行函数很重要
url = "https://www.creditchina.gov.cn/"
headers = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Pragma": "no-cache",
    "Origin": "https://www.creditchina.gov.cn",
    "Referer": "https://www.creditchina.gov.cn/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
}
response = session.get(url=url,headers=headers)
print(response)

# 存入第一次页面返回的cookie
for k, v in response.cookies.items():
    cookie[k] = v



# 获取meta和自执行函数
meta = response.text.split('meta content="')[1].split('" r="m">')[0]
fun = response.text.split('''<script type="text/javascript" r='m'>''')[1].split('</script>')[0]
# print(meta)
# print(fun)

# 读取文件内容
with open('env.js', 'r', encoding='utf-8') as f:
    content = f.read()

#动态替换代码,其中包括动态的js和meta中的content
code = re.findall("\$_ts=window\[\'\$_ts\'\][\w\W]*?\$_ts\.lcd\(\);", content)[0]
meta_content = re.findall('content="(.*?)"', content)[0]
content = content.replace(code, fun).replace(meta_content, meta)

# 重新写入文件
with open('env.js', 'w', encoding='utf-8') as f:
    f.write(content)
    result = execjs.compile(content).call('get_cookie')
    key = result.split('=')[0]
    value = result.split('=')[1].split(';')[0]
    cookie[key] = value
print(cookie)

response = session.get(url, headers=headers, cookies=cookie)
print(response.text)
print(response)


