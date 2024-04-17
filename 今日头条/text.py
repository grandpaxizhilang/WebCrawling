import os
import requests

headers = {
    "referer": "",
    "user-agent": ""
}
cookies = {

}
url = ""
params = {
    "channel_id": "3189398999",
    "min_behot_time": "0",
    "offset": "0",
    "refresh_count": "1",
    "category": "pc_profile_channel",
    "client_extra_params": "{\"short_video_item\":\"filter\"}",
    "aid": "24",
    "app_name": "toutiao_web",
}

params['_signature'] = os.popen('/node.exe "/vm.js"').read().replace('\n','')

response = requests.get(url, headers=headers, cookies=cookies, params=params)
print(response.text)
print(response)

