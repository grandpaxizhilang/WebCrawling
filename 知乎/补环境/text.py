import execjs
import requests


url = 'https://www.zhihu.com/api/v4/search_v3?'

headers = {
    'Cookie':'_zap=56ff6e48-342e-4d08-a0d5-4777f51d1114; _xsrf=ce2c9bb5-6a12-4f62-a84d-4d374c71df54; d_c0=AADaFoMaPRiPTjdnD2BJK6kOpy3wxu7BBYs=|1709197451; __snaker__id=Cek7E6yMcoM54g3R; captcha_session_v2=2|1:0|10:1712542989|18:captcha_session_v2|88:bFdnTXBHVkpEamJ3R3NHbWt1M0lxUUtQbit4V3RuYVVabjhOdGNxTmVOQjBXckR0ekRBamN5aGhQRGEveStaaQ==|8731bbcc20974f562f5f7b9831e844d2dec93767b41244dad37506044e759b9d; gdxidpyhxdE=nDZ0LfeCeRDA08%2FGxyWgRNCqTLZ%2BMTtOIzUOnnuvb2PpGc9nvbBVt%2F1xDMj3d%2BhWyfnMMkMLOgvDdwOg%2FIivdiTz6adPDyN6%2BItLPIGf%5Ccdf8Cr2RlZe1zgSEO08sBzdGKpqQitfJ6szUtYk5UZ0cDp%5C5vdaQZgGQSZkkI6NSvA8zh37%3A1712543889041; SESSIONID=qdXjfLLycpKhgIQcs14iC2cpFL2mr1I3zOtQp5LieWz; KLBRSID=d017ffedd50a8c265f0e648afe355952|1712560951|1712557101',
    "referer": "https://www.zhihu.com/search?type=content&q=%E7%88%AC%E8%99%AB",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
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



