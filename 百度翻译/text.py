import requests


headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Origin": "",
    "Referer": "",
    "User-Agent": "",

}
cookies = {
}
url = ""
data = {
    "kw": "get"
}
response = requests.post(url, headers=headers, cookies=cookies, data=data)

print(response.text)
print(response)