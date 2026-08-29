import sys
import base64
import time
import json
import asyncio

sys.path.insert(0, r"C:\Users\ds\Desktop\wb_vm_solver")
from solve_v190 import solve

SKU = "431798601"
CREATE = "https://www.wildberries.ru/__wbaas/challenges/antibot/api/v1/create-token"
DETAIL = "https://www.wildberries.ru/__internal/u-card/cards/v4/detail"
KEY = "7400bd5df8b843b28254659f10915f31"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36"
SCHUA = '"Not=A?Brand";v="99", "Google Chrome";v="151", "Chromium";v="151"'


def challenge_headers():
    return {
        "accept": "*/*",
        "accept-language": "zh-CN,zh;q=0.9",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "origin": "https://www.wildberries.ru",
        "pragma": "no-cache",
        "priority": "u=1, i",
        "referer": f"https://www.wildberries.ru/catalog/{SKU}/detail.aspx",
        "sec-ch-ua": SCHUA,
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent": UA,
        "x-guardium-antibot-key": KEY,
        "x-guardium-antibot-sdk-version": "js-front-desktop/3.1.0",
    }


def detail_headers():
    return {
        "accept": "*/*",
        "accept-language": "zh-CN,zh;q=0.9",
        "cache-control": "no-cache",
        "deviceid": "site_cfacc0eae124463fabe12b8e89e32a6e",
        "pragma": "no-cache",
        "priority": "u=1, i",
        "sec-ch-ua": SCHUA,
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent": UA,
        "x-requested-with": "XMLHttpRequest",
        "x-spa-version": "14.22.0",
    }


def detail_params():
    return {
        "appType": "1", "curr": "rub", "dest": "1259570991", "spp": "30",
        "hide_vflags": "4294967296", "mtype": "257", "lang": "ru",
        "ab_testing": "false", "nm": SKU,
    }


def solution_json(payload):
    sp = solve(payload)
    loadtime = int(sp.split("|")[0])
    now = round(time.time() * 1000, 4)
    return {
        "challenge": {"scriptPath": "/statics/challenge_vm_fp_v1.9.0_029781bb.js", "payload": payload},
        "solution": {"payload": sp},
        "meta": {
            "type": "SCRIPT",
            "name": "challenge_vm_fp_v1.9.0_029781bb",
            "marks": [
                {"ts": now - loadtime * 2, "name": "started_challenge"},
                {"ts": now - loadtime, "name": "loaded_api"},
                {"ts": now, "name": "solved_challenge"},
            ],
            "startHidden": True,
            "becameHidden": False,
        },
    }


def decode_token_ip(token):
    try:
        b64 = token.split(".", 3)[3]
        raw = base64.b64decode(b64).decode("utf-8", "replace")
        return raw.split("|")[1] if "|" in raw else raw
    except Exception:
        return "?"


async def run_curl_cffi(label, impersonate, proxy):
    from curl_cffi.requests import AsyncSession
    kwargs = {}
    if impersonate:
        kwargs["impersonate"] = impersonate
    print(f"\n===== {label} | impersonate={impersonate} proxy={proxy} =====")
    async with AsyncSession(timeout=30, proxies={"all": proxy} if proxy else None, **kwargs) as s:
        r1 = await s.post(CREATE, headers=challenge_headers(), json={})
        print("create-token:", r1.status_code)
        try:
            b1 = r1.json()
        except Exception as e:
            print("  non-json body:", r1.text[:200]); return
        payload = (b1.get("challenge") or {}).get("payload")
        if not payload:
            print("  no challenge payload:", str(b1)[:300]); return
        r2 = await s.post(CREATE, headers=challenge_headers(), json=solution_json(payload))
        print("solve-submit:", r2.status_code)
        try:
            b2 = r2.json()
        except Exception as e:
            print("  non-json body:", r2.text[:300]); return
        token = b2.get("secureToken")
        if not token:
            print("  no secureToken:", str(b2)[:300]); return
        print("  secureToken head:", token[:30], "| token_ip:", decode_token_ip(token))
        r3 = await s.get(DETAIL, headers=detail_headers(), cookies={"x_wbaas_token": token}, params=detail_params())
        print("detail:", r3.status_code, r3.text[:160])


def run_requests(label, proxies=None):
    import requests
    print(f"\n===== {label} =====")
    s = requests.Session()
    if proxies:
        s.proxies = proxies
    r1 = s.post(CREATE, headers=challenge_headers(), json={}, timeout=30)
    print("create-token:", r1.status_code)
    b1 = r1.json()
    payload = b1["challenge"]["payload"]
    r2 = s.post(CREATE, headers=challenge_headers(), json=solution_json(payload), timeout=30)
    print("solve-submit:", r2.status_code)
    token = r2.json()["secureToken"]
    print("  token_ip:", decode_token_ip(token))
    r3 = requests.get(DETAIL, headers=detail_headers(), cookies={"x_wbaas_token": token}, params=detail_params(), timeout=30)
    print("detail:", r3.status_code, r3.text[:160])


async def main():
    await run_curl_cffi("curl_cffi direct", None, None)
    await run_curl_cffi("curl_cffi via 127.0.0.1:7897", None, "http://127.0.0.1:7897")
    await run_curl_cffi("curl_cffi chrome145 direct", "chrome145", None)
    await run_curl_cffi("curl_cffi chrome145 via 127.0.0.1:7897", "chrome145", "http://127.0.0.1:7897")
    run_requests("requests direct")
    run_requests("requests via 127.0.0.1:7897", {"http": "http://127.0.0.1:7897", "https": "http://127.0.0.1:7897"})


if __name__ == "__main__":
    asyncio.run(main())
