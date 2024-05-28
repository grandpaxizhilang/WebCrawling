import requests
import json
import time
import random


headers = {
}
cookies = {

}
url = ""
params = {
    "_fxpcqlniredt": "09031066416516426752",
    "x-traceID": "{}-{}-{}".format(cookies['GUID'], int(time.time() * 1000), int(random.random() * 1e7))
}
data = {
    "cityId": 2,
    "hotCities": False,
    "oversea": False,
    "head": {
        
    }
}


data = json.dumps(data, separators=(',', ':'))
response = requests.post(url, headers=headers, cookies=cookies, params=params, data=data)

print(response.text)
print(response)