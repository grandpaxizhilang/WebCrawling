import requests
import re
import hashlib
import json
import execjs


session = requests.Session()

def md5_encrypt(data):
    md5 = hashlib.md5()
    md5.update(data.encode('utf-8'))
    return md5.hexdigest()


def get_data():
    headers = {}
    cookies = {}
    url = "aHR0cHM6Ly9mbGlnaHRzLmN0cmlwLmNvbS9vbmxpbmUvbGlzdC9yb3VuZC1zaGEtbmtn"
    params = {
        "_": "1",
        "depdate": "2026-01-01_2026-01-02",
        "cabin": "Y_S_C_F"
    }
    response = session.get(url, headers=headers,cookies=cookies, params=params)

    datas_str = re.search(r'"GlobalSearchCriteria":(\{.*?\}),"seo', response.text, re.DOTALL).group(1)
    # print(datas_str)
    return datas_str


def get_sign(datas):
    transactionID = datas['transactionID']
    str1 = datas['flightSegments'][0]['departureCityCode'] + datas['flightSegments'][0]['arrivalCityCode'] + datas['flightSegments'][0]['departureDate']
    str2 = datas['flightSegments'][1]['departureCityCode'] + datas['flightSegments'][1]['arrivalCityCode'] + datas['flightSegments'][1]['departureDate']
    return md5_encrypt(transactionID + str1 + str2)


def get_w_payload_source(data_str):
    md5_n = md5_encrypt(data_str)
    with open('w_payload_source_102.js', 'r', encoding='utf-8') as fp:
        jscode = fp.read()
        ctx = execjs.compile(jscode)
        result = ctx.call('get_result', md5_n)
        print(result)
        return result


def get_token():
    with open('token_1001.js', 'r', encoding='utf-8') as fp:
        jscode = fp.read()
        ctx = execjs.compile(jscode)
        result = ctx.call('get_result')
        print(result)
        return result



if __name__ == '__main__':
    datas_str = get_data()
    print(datas_str)
    datas = json.loads(datas_str)
    transactionID = datas['transactionID']
    sign = get_sign(datas)
    print(sign)
    w_payload_source = get_w_payload_source(datas_str)
    token = get_token()


