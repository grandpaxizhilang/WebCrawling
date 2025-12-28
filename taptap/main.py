
import re
import execjs
import requests

headers = {

    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
}

response = requests.get("xxx", headers=headers)
HtmlStr = response.text
print(HtmlStr)

arg = re.findall("var arg1='(.*?)';", HtmlStr)
arg1 = arg[0] if arg else None


with open("1.js", mode="r", encoding="utf-8") as f:
    jsStr = f.read()
    jsCode = execjs.compile(jsStr)
    result = jsCode.call("get_result", arg1)
print(arg1, result)
if arg1 and result:
    cookies = {"acw_sc__v2": result}
    response = requests.get("xxxx", headers=headers, cookies=cookies)
    response.encoding = response.apparent_encoding
    print(response.text)

