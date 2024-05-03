import time

import execjs
import requests

url = ''

headers = {
    'Origin':'',
    'Referer':'',
    'User-Agent':''
}

params = {
    "mid": 245833292,
    "ps": 30,
    "tid": 0,
    "pn": 1,
    "keyword": "",
    "order": "pubdate",
    "platform": "web",
    "web_location": 1550101,
    "order_avoided": 'true',
    "dm_img_list": '[{"x":550,"y":-87,"z":0,"timestamp":4,"k":73,"type":0},{"x":924,"y":-297,"z":102,"timestamp":107,"k":87,"type":0},{"x":914,"y":-349,"z":103,"timestamp":296,"k":117,"type":0}]',
    "dm_img_str": "V2ViR0wgMS4wIChPcGVuR0wgRVMgMi4wIENocm9taXVtKQ",
    "dm_cover_img_str": "QU5HTEUgKEFNRCwgQU1EIFJhZGVvbihUTSkgR3JhcGhpY3MgKDB4MDAwMDE2MzYpIERpcmVjdDNEMTEgdnNfNV8wIHBzXzVfMCwgRDNEMTEpR29vZ2xlIEluYy4gKEFNRC",
    "dm_img_inter": '{"ds":[{"t":0,"c":"","p":[246,82,82],"s":[251,2078,-1802]}],"wh":[1872,-86,40],"of":[344,688,344]}',
    "wts": int(time.time())
}


with open('code.js','r',encoding='utf-8')as fp:
    jscode = fp.read()
    result = execjs.compile(jscode).call('get_result',params)
    # print(result)
    params['w_rid'] = result['w_rid']

    response = requests.get(url=url, headers=headers, params=params)

    print(response.text)
    print(response)

