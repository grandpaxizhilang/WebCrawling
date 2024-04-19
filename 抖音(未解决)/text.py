import random

import execjs
import requests


headers = {
}
cookies = {
}
url = ""
params = {
    "device_platform": "webapp",
    "aid": "6383",
    "channel": "channel_pc_web",
    "publish_video_strategy_type": "2",
    "source": "channel_pc_web",
    "sec_user_id": "MS4wLjABAAAAkgXrA1nz4ggkGTdbK8cPBBLxYgxP0Z5a95Xdu_sO3Vz5zrvwpkWa1zdOSFB-3r_S",
    "personal_center_strategy": "1",
    "pc_client_type": "1",
    "version_code": "170400",
    "version_name": "17.4.0",
    "cookie_enabled": "true",
    "screen_width": "1536",
    "screen_height": "864",
    "browser_language": "zh-CN",
    "browser_platform": "Win32",
    "browser_name": "Edge",
    "browser_version": "123.0.0.0",
    "browser_online": "true",
    "engine_name": "Blink",
    "engine_version": "123.0.0.0",
    "os_name": "Windows",
    "os_version": "10",
    "cpu_core_num": "12",
    "device_memory": "8",
    "platform": "PC",
    "downlink": "10",
    "effective_type": "4g",
    "round_trip_time": "50",
    "webid": "7359177215757026855",
    "msToken": "A-a3JtUeSsDPiedVEPaWPWVSviLnqmFcMPzT6w0unYhZp_AjeIJ32av0bZAc_ZSuqT8-IALEegRfbesysLSkYcW-7B1RUdn4jxFXyw9D5TTE05V52uPa_PhzLX8mKC8OYg==",
    "a_bogus": "QJRMBmwgmD2kDd6g51ILfY3q61B3YDHB0trEMD2fZVV8Ly39HMP39exo4K0vI7mjLT/AIb6jy4hcTNqMicV9A3v6HSRKl29p-g00t-P2so0j5ZhjCfuDrtfF-vzWt-Bd-Jd3xcXmy7dcK8RplnAJ5k1cthMeaRL="
}

with open('vm.js','r',encoding='utf-8') as fp:

    jscode = fp.read()
    data = ''
    for i in params:
        if i != 'publish_video_strategy_type' and i != 'source' and i != 'sec_user_id' and i != 'personal_center_strategy':
            data += i + '=' + params[i] + '&'

    data += '&msToken=' + params['msToken'] + '&msToken='
    # print(data)
    result = execjs.compile(jscode).call('get_result',data)

    params['a_bogus'] = result
    # print(params)
    print(result)
    response = requests.get(url, headers=headers, cookies=cookies, params=params)
    print(response.text)
    print(response)