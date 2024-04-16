import requests


headers = {
    "Pragma": "no-cache",
    "Referer": "",
    "User-Agent": "",

}
cookies = {

}
url = ""
params = {
    "vipver": "1",
    "client": "kt",
    "ft": "music",
    "cluster": "0",
    "strategy": "2012",
    "encoding": "utf8",
    "rformat": "json",
    "mobi": "1",
    "issubtitle": "1",
    "show_copyright_off": "1",
    "pn": "0",
    "rn": "20",
    "all": "周杰伦"
}
response = requests.get(url, headers=headers, cookies=cookies, params=params)

print(response.text)
print(response)