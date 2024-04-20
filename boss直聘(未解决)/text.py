import requests


headers = {

    "referer": "",
    "user-agent": "",
    "x-requested-with": "XMLHttpRequest"
}
cookies = {
    "wd_guid": "b63e8d42-4e66-4299-80d6-3eae99f19da1",
    "historyState": "state",
    "_bl_uid": "tUl6Rum1jRyssnywkc7tet128b3n",
    "lastCity": "101280100",
    "__zp_seo_uuid__": "312ee67a-add9-4c60-8283-e4590fb3c06a",
    "__g": "-",
    "__l": "r=https%3A%2F%2Fcn.bing.com%2F&l=%2Fwww.zhipin.com%2Fguangzhou%2F&s=1&g=&s=3&friend_source=0",
    "__zp_stoken__": "9a04fOzfDkcK5WMOEOiEKCwcLADYgODcifzg7Izo6RDs3MEQ6Ozc4GjArOMK2w4vCiyVaw4M8My43MDEzO0UwOj4eN0TEuMKwOjYvw4jCssOKwo8WV8OAFBDCsBVFFBkHwoTCsxQ5PzQfwro8MzEwWMKxM8K3csOFPMOFe8K9OMK6MzkwOCo3AQwVUDc5R0lRDU9bSF9bQwZBVUovMDc2MCNGw7goNgsCCgYBAwoCDgkHDgYHAAoDCwcACwIKBgEiM8KXwrzClMSRxJ1hw7jEkcKYwrPCrsKhw7JMwpHCnsKZacO%2FwrDClMK6wpRgw4TCrsK%2BbMKqQFJfw4TCt8KybMKWb8K0flVOwrlsUEzCt0bCsUx5XBUBDmUJNwHDj3vDhg%3D%3D",
    "__c": "1712148405",
    "__a": "85140072.1712148405..1712148405.4.1.4.4"
}
url = ""
params = {
    "scene": "1",
    "query": "python",
    "city": "101280100",
    "experience": "",
    "payType": "",
    "partTime": "",
    "degree": "",
    "industry": "",
    "scale": "",
    "stage": "",
    "position": "",
    "jobType": "",
    "salary": "",
    "multiBusinessDistrict": "",
    "multiSubway": "",
    "page": "1",
    "pageSize": "30"
}
response = requests.get(url, headers=headers, cookies=cookies, params=params)

print(response.text)
print(response)