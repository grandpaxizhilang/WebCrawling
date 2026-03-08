import requests
from urllib.parse import urlencode
import execjs


headers = {
    # 不给你看
}
cookies = {
    # 不给你看
}
url = "aHR0cHM6Ly93d3ctaGouZG91eWluLmNvbS9hd2VtZS92MS93ZWIvY29tbWVudC9saXN0Lw=="
params = {
    # 不给你看
    # "a_bogus": "",
}

query = urlencode(params)
ua = headers['user-agent']
with open('a_bogus_192.js', 'r', encoding='utf-8') as fp:
    jscode = fp.read()
    ctx = execjs.compile(jscode)
    result = ctx.call('get_ab', query, ua)
    print(result)

params['a_bogus'] = result
response = requests.get(url, headers=headers, cookies=cookies, params=params)

print(response.text)
print(response)