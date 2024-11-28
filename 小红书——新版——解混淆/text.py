import os

import execjs
import requests
import json


headers = {

}
cookies = {

}
url = ""
data = {

}
result = json.loads(os.popen('node.exe "./vm.js"').read().replace('\n','').replace('\'','"'))
# print(result)

headers['x-s'] = result['X-s']
headers['x-t'] = str(result['X-t'])

# print(headers)
data = json.dumps(data, separators=(',', ':'))
response = requests.post(url, headers=headers, cookies=cookies, data=data)

print(response.text)
print(response)