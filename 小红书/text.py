import json
import os
import requests


url = 'https://edith.xiaohongshu.com/api/sns/web/v1/homefeed'

cookies = {
    
}

data = {
    "cursor_score": "",
    "num": 18,
    "refresh_type": 1,
    "note_index": 14,
    "unread_begin_note_id": "",
    "unread_end_note_id": "",
    "unread_note_count": 0,
    "category": "homefeed.fashion_v3",
    "search_key": "",
    "need_num": 8,
    "image_formats": [
        "jpg",
        "webp",
        "avif"
    ],
    "need_filter_image": False
}

headers = {
    "content-type": "application/json;charset=UTF-8",
    "origin": "",
    "referer": "",
    "user-agent": "",
}



headers['x-s'] = os.popen('/node.exe "/vm.js"').read().replace('\n','')
print(headers['x-s'])

data = json.dumps(data, separators=(',', ':'))
response = requests.post(url=url, headers=headers, cookies=cookies, data=data)

print(response.text)
print(response)


