import requests
import time

timestamp = int(time.time())
headers = {
    "referer": "",
    "user-agent": ""
}
cookies = {

}
url = ""
params = {
    "callback": "jQuery19107553803004393538_" + str(timestamp),
    "word": "周杰伦",
    "_": str(timestamp + 2)
}
response = requests.get(url, headers=headers, cookies=cookies, params=params)

print(response.text)
print(response)