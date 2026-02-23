import requests
import re
import execjs
from urllib.parse import urlparse,urlencode

headers = {
    # 不给你看
    # "mtgsig": '',
}

cookies = {
    # 不给你看
}


url = "aHR0cHM6Ly9tYXBpLmRpYW5waW5nLmNvbS9tYXBpL3Jldmlldy9vdXRzaWRlc2hvcHJldmlld2xpc3QuYmlu"
params = {
    "mtsiReferrer": "xxxxx",
    "isNeedNewReview": "1",
    "reqsource": "2",
    "shopuuid": "xxxxx",
    "device_system": "",
    "yodaReady": "h5",
    "csecplatform": "4",
    "csecversion": "4.2.0"
}



if __name__ == '__main__':
    dfpId = cookies['WEBDFPID'].split("-")[0]
    method = "GET"
    path = urlparse(url).path
    params_str = urlencode(sorted(params.items()))
    api_params = f"{method} {path} {params_str}"

    with open("mtgsig1.2.js", mode="r", encoding="utf-8") as f:
        jsStr = f.read()
        jsCode = execjs.compile(jsStr)
        result = jsCode.call("get_mtgsig", dfpId, api_params)
        headers['mtgsig'] = result
        print(result)

    response = requests.get(url, headers=headers, cookies=cookies, params=params)
    print(response.text)
    print(response)