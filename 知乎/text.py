import execjs
import requests

url = ''

headers = {
    'Cookie':'',
    "referer": "",
    "user-agent": "",
    "x-api-version": "3.0.91",
    "x-app-za": "OS=Web",
    "x-requested-with": "fetch",
    "x-zse-93": "101_3_3.0",
}

params = {
    'gk_version': 'gz-gaokao',
    't': 'general',
    'q': '爬虫',
    'correction': '1',
    'offset': '0',
    'limit': '20',
    'filter_fields': '',
    'lc_idx': '0',
    'show_all_topics': '0',
    'search_source': 'Normal'
}

with open('vm.js','r',encoding='utf-8') as fp:
    jscode = fp.read()
    ctx = execjs.compile(jscode)
    result = ctx.call('get_result')
    print(result)
    headers['x-zse-96'] = result
    response = requests.get(url=url,headers=headers,params=params)
    print(response.text)
    print(response)



