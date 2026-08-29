import requests
import time
from solve_v190 import solve
session = requests.Session()

url = "https://www.wildberries.ru/__wbaas/challenges/antibot/api/v1/create-token"
proxy = {
    "http": "http://172.18.128.107:50001",
    "https": "http://172.18.128.107:50001",
}

headers = {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "origin": "https://www.wildberries.ru",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "referer": "https://www.wildberries.ru/catalog/431798601/detail.aspx",
    "sec-ch-ua": "\"Not=A?Brand\";v=\"99\", \"Google Chrome\";v=\"151\", \"Chromium\";v=\"151\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
    "x-guardium-antibot-key": "7400bd5df8b843b28254659f10915f31",
    "x-guardium-antibot-sdk-version": "js-front-desktop/3.1.0",
}

json_data = {}

response = session.post(
    url,
    headers=headers,
    json=json_data,
    timeout=30,
    proxies=proxy,
    # impersonate="chrome",  # 仅 curl_cffi 支持
)

print(response.text)
print(response.status_code)


challenge_payload = response.json().get("challenge").get("payload")
solution_payload = solve(challenge_payload)
loadtime = int(solution_payload.split("|")[0])
now_timestamp = round(time.time() * 1000, 4)
# print("solution_payload:", solution_payload)

headers = {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "origin": "https://www.wildberries.ru",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Not=A?Brand\";v=\"99\", \"Google Chrome\";v=\"151\", \"Chromium\";v=\"151\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
    "x-guardium-antibot-key": "7400bd5df8b843b28254659f10915f31",
    "x-guardium-antibot-sdk-version": "js-front-desktop/3.1.0",
}

json_data = {
    "challenge": {
        "scriptPath": "/statics/challenge_vm_fp_v1.9.0_029781bb.js",
        "payload": challenge_payload,
        },
    "solution": {
        "payload": solution_payload
    },
    "meta": {
        "type": "SCRIPT",
        "name": "challenge_vm_fp_v1.9.0_029781bb",
        "marks": [
            {
                "ts": now_timestamp - loadtime * 2,
                "name": "started_challenge"
            },
            {
                "ts": now_timestamp - loadtime,
                "name": "loaded_api"
            },
            {
                "ts": now_timestamp,
                "name": "solved_challenge"
            }
        ],
        "startHidden": True,
        "becameHidden": False
    }
}
# print("json_data:", json_data)
response = session.post(
    url,
    headers=headers,
    json=json_data,
    timeout=30,
    proxies=proxy,
    # impersonate="chrome",  # 仅 curl_cffi 支持
)

print(response.text)
print(response.status_code)

secureToken = response.json().get("secureToken")



headers = {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9",
    "cache-control": "no-cache",
    "deviceid": "site_cfacc0eae124463fabe12b8e89e32a6e",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Not=A?Brand\";v=\"99\", \"Google Chrome\";v=\"151\", \"Chromium\";v=\"151\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
    "x-requested-with": "XMLHttpRequest",
    "x-spa-version": "14.22.0"
}
cookies = {
    "x_wbaas_token": secureToken
}
url = 'https://www.wildberries.ru/__internal/u-card/cards/v4/detail'
params = {
    "appType": "1",
    "curr": "rub",
    "dest": "1259570991",
    "spp": "30",
    "hide_vflags": "4294967296",
    "mtype": "257",
    "lang": "ru",
    "ab_testing": "false",
    "nm": "431798601"   # 商品id
}
response = requests.get(
    url, 
    headers=headers, 
    cookies=cookies, 
    params=params,
    proxies=proxy
)

print(response.text)
print(response)
