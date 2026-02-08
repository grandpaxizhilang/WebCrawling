import requests
import execjs

headers = {
    "Referer": "https://www.qidian.com/",
    "User-Agent": "",
}
cookies = {
    "x-waf-captcha-referer": "",
    # "w_tsfp": ""
}
url = "https://www.qidian.com/"

with open("w_tsfp.js", mode="r", encoding="utf-8") as f:
    jsStr = f.read()
    jsCode = execjs.compile(jsStr)
    result = jsCode.call("get_result", url)
    cookies['w_tsfp'] = result
    print(result)

response = requests.get(url, headers=headers, cookies=cookies)
print(response.text)
print(response)