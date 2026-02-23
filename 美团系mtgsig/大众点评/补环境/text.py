import execjs
import requests


headers = {
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Pragma": "no-cache",
    "Referer": "https://www.dianping.com/shop/H50rbizoCjKWUIGX?response_code=09cb068826d14d66917bd1a0a41c58e7&request_code=ba8d9014004e44128f1d960c4c30c3ea&response_code=c46349190b694388ad771ff254262d88&request_code=dd5e51a4a12e46d9a1010c40d372af20",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
    "X-Requested-With": "XMLHttpRequest",
    "sec-ch-ua": "\"Chromium\";v=\"124\", \"Microsoft Edge\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\""
}
cookies = {
    "_lxsdk_cuid": "18f05113f90c8-05772e5fb860bf-4c657b58-144000-18f05113f90c8",
    "_lxsdk": "18f05113f90c8-05772e5fb860bf-4c657b58-144000-18f05113f90c8",
    "WEBDFPID": "v5665v9549745097zu90z4vz2zx80v1781u94885wuu97958xww3y164-2029136968009-1713776967432UCGMISKfd79fef3d01d5e9aadc18ccd4d0c95071901",
    "_hc.v": "25d77bda-2e35-2b2f-19fc-f242534b1eb6.1713777023",
    "qruuid": "62704cfd-d1e4-492a-abc3-24e7c8094838",
    "dper": "02020026f9abaadc20da0039c8886aab4f32f9a5c5c40d72b4354fee9f4682b8434b295793ec00b2eeed5236c3d58c23eff7f28a08b7fbd37d8300000000a71f00002acc91a003f0a27d22cd964ea38f8620f29e5167824c17f09b7d4e42b06c797bb6cfb97ab103f6abe30b97ca0d5f98d5",
    "ll": "7fd06e815b796be3df069dec7836c3df",
    "s_ViewType": "10",
    "fspop": "test",
    "cy": "4",
    "cye": "guangzhou"
}
url = "https://www.dianping.com/ajax/json/shopDynamic/allReview"
params = {
    "shopId": "H50rbizoCjKWUIGX",
    "cityId": "4",
    "shopType": "10",
    "tcv": "qo767wnn8n",
    "_token": "eJxVUdtu4jAU/Bc/9CkKPo7jOEioQrTqclsEIXTLqlo5tlPSQAhxuIRq/32dbvuAZOnMGY9GmjkfqBoq1AWMMQUHnXSFughc7DLkoNrYnwA8zijzKFDuIHnDBSQIHJRUqwfU/Q0+dgLCXltiYXdLeMyxulfnC3oWEmpfqxlaCdrUdWm6nc75fHZVJooyK95cud91zGZfdn74uEqy637wPn6Oh0+/7ittyn1h9B+5V7qHQ5lgxjlhCqhiLIQgUSCwoCB9roO7Sh+O2tT/1YngKsRAbVBNKRCeggoZllR6WHpa3N2ayzZyCCFOWEg9zoUKAkhT4lPCiOL81lwpX/sgqACiKVOhAAzWGitbkUgJtmV+R7UVZ2nj7nRWH0XxGRbZPnbLtg+gzPEwbYm8JewUX7P+3qf2QtbPZG+FRXp0WUaGmkO6mJrlatE04TiKSDORMIlib3J9rH/G0WnWDHg/KrKXp818u14l2xlR/sa2dsx1/xJPDwMY1Q9zL87y+iovs8n4hCMJs4UaveTbMH/2y2OyW6eFvyry8fyxz0r8vj73eujvP/e3q/s=",
    "uuid": "25d77bda-2e35-2b2f-19fc-f242534b1eb6.1713777023",
    "platform": "1",
    "partner": "150",
    "optimusCode": "10",
    "originUrl": "https://www.dianping.com/shop/H50rbizoCjKWUIGX?response_code=09cb068826d14d66917bd1a0a41c58e7&request_code=ba8d9014004e44128f1d960c4c30c3ea&response_code=c46349190b694388ad771ff254262d88&request_code=dd5e51a4a12e46d9a1010c40d372af20",
    "yodaReady": "h5",
    "csecplatform": "4",
    "csecversion": "2.4.0",
}

with open('vm.js','r',encoding='utf-8') as fp:
    jscode = fp.read()
    result = execjs.compile(jscode).call('get_result')
    print(result)
    params["mtgsig"] = result

    response = requests.get(url, headers=headers, cookies=cookies, params=params)

    print(response.text)
    print(response)


