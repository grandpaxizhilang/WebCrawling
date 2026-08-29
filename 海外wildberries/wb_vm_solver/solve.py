# -*- coding: utf-8 -*-
r"""
WB antibot 挑战 challenge_vm_fp_v1.8.0_25fd2657 离线 u 求解器（Python 版）
=====================================================================
由已验证的 JS 版（reimpl.js，与真实 u 逐字节一致）移植。

用法:
    python solve.py "<payload>"     # payload 来自 create-token 接口

固定指纹:
    读取与脚本同目录的 fixed_fp.b64（单行 base64，无换行）。
    获取方式:
        1. 浏览器控制台运行 capture_fp.js（填入最新 SCRIPT_PATH 和
           create-token 返回的 payload），打印 __CAPTURE__ = {...}。
        2. 把 __CAPTURE__ 整段粘进 extract_fixed.py 的 _RAW 并运行:
           python extract_fixed.py
        3. 完成后自动写入 fixed_fp.b64，无需手动复制。

注意: 只支持 v1.8.0_25fd2657 构建，构建轮换后需重新逆向。
"""
import os
import json
import time
import base64

# ---------------- 32 位工具 ----------------
def u32(x):
    return x & 0xFFFFFFFF

def rotl32(x, n):
    return ((x << n) | (x >> (32 - n))) & 0xFFFFFFFF

# ---------------- 常量表（25fd2657 构建；来自字节码常量池） ----------------
AO = [506037737, 1380525555, 1481123111, 2144274173, 4256830938, 319283536, 2052269474, 1103931820]
AP = [2221413526, 337464729, 878936712, 1322708464, 1970579571, 125091323, 3249788392, 3594322204,
      1730408, 3288845640, 671832838, 1983988634, 280125792, 745802730, 4224876618, 674815678]
AQ = [3517948609, 3730247009, 2046577556, 1324486146, 3343993857, 2844232229, 1658723780, 2224498283,
      503085645, 1953420943, 603287083, 3400961923, 797212334, 129712255, 3087241547, 480664648]
AR = [2635912526, 919394836, 1249444562, 3409935095, 3654076373, 558841405, 2902322402, 3319725996]
A3 = 1796158859
A2 = 4

# ---------------- 字符串哈希 go(px, py)：自定义 FNV 变体 ----------------
def go(px, py):
    h = u32(px)
    for ch in py:
        h ^= (ord(ch) & 255)
        h = (h + ((h << 5) & 0xFFFFFFFF) + (h >> 2) + 2654435769) & 0xFFFFFFFF
        h = rotl32(h, 7)
    return h

# ---------------- 密钥派生 gp(challengeId, clls, frameNonce, serializedLen) ----------------
def gp(pz, pA, pB, pC):
    seed = (2166136261 ^ u32(pB) ^ u32(pC) ^ A3) & 0xFFFFFFFF
    h = go(seed, pz)
    h = (h ^ 2779096485) & 0xFFFFFFFF
    h = go(h, pA)
    return (h ^ rotl32(u32(pC), 11) ^ rotl32(A3, 17)) & 0xFFFFFFFF

# ---------------- 密封器（对应字节码 gq/pL/pM/pN） ----------------
class Sealer:
    def __init__(self, out, challenge_id, clls, frame_nonce, serialized_len):
        self.out = out                      # bytearray，写入密文
        self.frame_nonce = u32(frame_nonce)
        self.serialized_len = serialized_len
        self.pO = gp(challenge_id, clls, u32(frame_nonce), serialized_len)
        self.state = {
            's2': ((1835258167 ^ 2213876847) ^ self.pO ^ serialized_len) & 0xFFFFFFFF,
            's3': ((829809575 ^ 1462419888) + self.frame_nonce + rotl32(self.pO, 15)) & 0xFFFFFFFF,
            's4': ((2189847915 ^ 710962929) ^ rotl32(serialized_len, 24)) & 0xFFFFFFFF,
            's5': (self.pO ^ (2697922674 ^ 4254473266)) & 0xFFFFFFFF,
            's6': (self.pO ^ (3698997261 ^ 3064996804)) & 0xFFFFFFFF,
            's7': ((2126702976 ^ 1420962161) + serialized_len) & 0xFFFFFFFF,
            's8': (self.frame_nonce ^ (761070724 ^ 4071894814)) & 0xFFFFFFFF,
            's9': ((1322732482 ^ 2427860171) + rotl32(self.pO, 18)) & 0xFFFFFFFF,
        }
        self.pX = 0
        self.pY = 0
        self.pZ = 0
        self.p0 = 0
        self.p1 = False

    def pl(self, block, count):
        st = self.state
        s2 = st['s2']; s3 = st['s3']; s4 = st['s4']; s5 = st['s5']
        s6 = st['s6']; s7 = st['s7']; s8 = st['s8']; s9 = st['s9']
        pX = self.pX
        t12 = (pX + 7) & 7
        t13 = (AO[((t12 * 5 + 3) & 7)] ^ ((1842276411 + t12 * 2110078725) & 0xFFFFFFFF)) & 0xFFFFFFFF
        t14 = (pX + 6) & 7
        t15 = (AR[((t14 + 4) & 7)] ^ ((3340988254 + t14 * 3750563199) & 0xFFFFFFFF)) & 0xFFFFFFFF
        t16 = (s2 + (s5 ^ s3) + pX) & 15
        t17 = (AP[((t16 * 15 + 10) & 15)] ^ ((2192809920 + t16 * 2274619873) & 0xFFFFFFFF)) & 0xFFFFFFFF
        s2 = (s2 + t17 + t13 + pX) & 0xFFFFFFFF
        s2 = (s2 ^ ((s2 << 3) & 0xFFFFFFFF) ^ (s2 >> 9)) & 0xFFFFFFFF
        t18 = ((s4 ^ s5) + s3 + pX) & 15
        t19 = (AQ[((t18 * 7 + 5) & 15)] ^ ((1248962321 + t18 * 835872739) & 0xFFFFFFFF)) & 0xFFFFFFFF
        s3 = (s3 + t19 + s5) & 0xFFFFFFFF
        s3 = (s3 ^ (s3 >> 7)) & 0xFFFFFFFF
        s4 = (rotl32((s2 + t15) & 0xFFFFFFFF, 24) ^ s4) & 0xFFFFFFFF
        t22 = (pX + s5 + 6) & 7
        t23 = (AR[((t22 + 4) & 7)] ^ ((3340988254 + t22 * 3750563199) & 0xFFFFFFFF)) & 0xFFFFFFFF
        ks = (s2 ^ rotl32(s3, 15) ^ s4 ^ t23) & 0xFFFFFFFF
        ct = (block ^ ks) & 0xFFFFFFFF
        idx = 4 + pX * 4
        self.out[idx] = ct & 0xFF
        if count > 1:
            self.out[idx + 1] = (ct >> 8) & 0xFF
        if count > 2:
            self.out[idx + 2] = (ct >> 16) & 0xFF
        if count > 3:
            self.out[idx + 3] = (ct >> 24) & 0xFF
        mask = 0xFFFFFFFF if count == 4 else ((1 << (count * 8)) - 1) & 0xFFFFFFFF
        s30 = (ct & mask) & 0xFFFFFFFF
        s6 = (s6 + s30 + s2) & 0xFFFFFFFF
        s7 = (s7 ^ s30 ^ s3) & 0xFFFFFFFF
        s8 = (s8 + (s30 ^ s5) + pX) & 0xFFFFFFFF
        s9 = (s9 ^ ((s8 + s4) & 0xFFFFFFFF)) & 0xFFFFFFFF
        s5 = (s30 + (s2 ^ s3) + pX) & 0xFFFFFFFF
        self.pX = (pX + 1) & 0xFFFFFFFF
        st['s2'] = s2; st['s3'] = s3; st['s4'] = s4; st['s5'] = s5
        st['s6'] = s6; st['s7'] = s7; st['s8'] = s8; st['s9'] = s9

    def pm(self, value, byte_count):
        v = u32(value)
        if self.p0 == 0 and byte_count == A2:
            self.pl(v, A2)
            self.pY += byte_count
            return byte_count
        acc = self.pZ
        n = byte_count
        pos = self.p0
        while n > 0:
            chunk = A2 - pos
            if n < chunk:
                chunk = n
            cnt = chunk
            mask = 0xFFFFFFFF if cnt == A2 else ((1 << (cnt * 8)) - 1) & 0xFFFFFFFF
            acc = (acc | ((v & mask) << (pos * 8))) & 0xFFFFFFFF
            v = 0 if cnt == A2 else (v >> (cnt * 8))
            pos += cnt
            n -= cnt
            if pos == A2:
                self.pl(acc, A2)
                acc = 0
                pos = 0
        self.pY += byte_count
        self.pZ = acc
        self.p0 = pos
        return byte_count

    def pn(self):
        if self.p1:
            raise Exception("sealing writer is already finished")
        if self.pY != self.serialized_len:
            raise Exception("sealing payload underflow")
        if self.p0 > 0:
            self.pl(self.pZ, self.p0)
            self.pZ = 0
            self.p0 = 0
        if (self.serialized_len + A2 - 1) // A2 != self.pX:
            raise Exception("sealing word count mismatch")
        st = self.state
        s6 = st['s6']; s7 = st['s7']; s8 = st['s8']; s9 = st['s9']
        w1 = (s6 ^ self.serialized_len ^ self.pO ^ ((AR[4] ^ 3340988254) & 0xFFFFFFFF)) & 0xFFFFFFFF
        w2 = (s7 + self.frame_nonce + rotl32(w1, 27) + ((AR[5] ^ 2796584157) & 0xFFFFFFFF)) & 0xFFFFFFFF
        w3 = (s8 ^ rotl32((w2 + self.serialized_len) & 0xFFFFFFFF, 15) ^ ((AR[6] ^ 2252180060) & 0xFFFFFFFF)) & 0xFFFFFFFF
        w4 = (s9 + rotl32((w3 ^ self.pO) & 0xFFFFFFFF, 24) + ((AR[7] ^ 1707775963) & 0xFFFFFFFF)) & 0xFFFFFFFF
        w1 = (w1 + rotl32((w4 ^ self.frame_nonce) & 0xFFFFFFFF, 18) + ((AR[0] ^ 1163371866) & 0xFFFFFFFF)) & 0xFFFFFFFF
        base = 4 + self.serialized_len
        for i, w in enumerate([w1, w2, w3, w4]):
            self.out[base + i * 4] = w & 0xFF
            self.out[base + i * 4 + 1] = (w >> 8) & 0xFF
            self.out[base + i * 4 + 2] = (w >> 16) & 0xFF
            self.out[base + i * 4 + 3] = (w >> 24) & 0xFF
        self.p1 = True

# ---------------- 密封已知明文字节（离线复用固定指纹） ----------------
def seal_bytes(challenge_id, clls, plaintext_bytes, frame_nonce):
    serialized_len = len(plaintext_bytes)
    out = bytearray(4 + serialized_len + 16)
    fn = u32(frame_nonce)
    out[0] = fn & 0xFF
    out[1] = (fn >> 8) & 0xFF
    out[2] = (fn >> 16) & 0xFF
    out[3] = (fn >> 24) & 0xFF
    sealer = Sealer(out, challenge_id, clls, fn, serialized_len)
    off = 0
    while off < serialized_len:
        cnt = min(4, serialized_len - off)
        v = 0
        for k in range(cnt):
            v |= plaintext_bytes[off + k] << (8 * k)
        sealer.pm(v, cnt)
        off += cnt
    sealer.pn()
    return bytes(out)

# ---------------- payload 解析 ----------------
def parse_payload(payload):
    if not isinstance(payload, str) or len(payload) < 2:
        raise ValueError("Challenge payload is invalid.")
    try:
        decoded = base64.b64decode(payload[1:]).decode("utf-8")
        parts = decoded.split(".")
        if len(parts) < 2 or not parts[1]:
            raise ValueError("Challenge payload is invalid.")
        obj = json.loads(base64.b64decode(parts[1]).decode("utf-8"))
    except Exception:
        raise ValueError("Challenge payload is invalid.")
    if not isinstance(obj, dict):
        raise ValueError("Challenge payload is invalid.")
    cid = obj.get("id")
    if not isinstance(cid, str) or not cid:
        raise ValueError("Challenge payload is invalid.")
    clls = obj.get("clls")
    if clls is None:
        clls = ""
    if not isinstance(clls, str):
        raise ValueError("Challenge payload is invalid.")
    return {"id": cid, "clls": clls}

# ---------------- 固定指纹（读取同目录 fixed_fp.b64，单行 base64） ----------------
_FIXED_FP_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fixed_fp.b64")
_fixed_bytes = None

def get_fixed_bytes():
    global _fixed_bytes
    if _fixed_bytes is None:
        try:
            with open(_FIXED_FP_PATH, "r", encoding="utf-8") as f:
                data = f.read().strip()
        except OSError:
            raise FileNotFoundError(
                "缺少 fixed_fp.b64，请先运行 extract_fixed.py 生成该文件（需与 solve.py 同目录）")
        _fixed_bytes = base64.b64decode(data)
    return _fixed_bytes

A_G = 358657350  # 对应 VM 里 gs(): frameNonce = (Date.now() ^ A_G) >>> 0

def solve(payload, frame_nonce=None, elapsed=None):
    d = parse_payload(payload)
    fixed = get_fixed_bytes()
    if frame_nonce is None:
        nonce = (int(time.time() * 1000) ^ A_G) & 0xFFFFFFFF
    else:
        nonce = u32(frame_nonce)
    t0 = time.time() * 1000
    sealed = seal_bytes(d["id"], d["clls"], fixed, nonce)
    ms = elapsed if elapsed is not None else max(1, int(time.time() * 1000 - t0))
    return str(ms) + "|" + base64.b64encode(sealed).decode()

if __name__ == "__main__":
    payload = "9ZnBfdm0uZXlKMlpYSnphVzl1SWpveExDSjBhVzFsYzNSaGJYQWlPakUzT0RjMk1qRTBNRFV6Tmpjc0ltbGtJam9pWVRZek1tRmxPVEV0WVRObU1DMDBNR0prTFRneE5HSXRObU00TWpSak0yRmpNMll4SWl3aWFYQWlPaUkwTlM0NE9DNDBNeTR4TVRZaUxDSjFZU0k2SWsxdmVtbHNiR0V2TlM0d0lDaFhhVzVrYjNkeklFNVVJREV3TGpBN0lGZHBialkwT3lCNE5qUXBJRUZ3Y0d4bFYyVmlTMmwwTHpVek55NHpOaUFvUzBoVVRVd3NJR3hwYTJVZ1IyVmphMjhwSUVOb2NtOXRaUzh4TlRFdU1DNHdMakFnVTJGbVlYSnBMelV6Tnk0ek5pSXNJbk5wZEdWTFpYa2lPaUkzTkRBd1ltUTFaR1k0WWpnME0ySXlPREkxTkRZMU9XWXhNRGt4TldZek1TSXNJbVJsZG1salpWUnZhMlZ1SWpvaUlpd2lkWE5sY2xOamIzSmxJanA3SW1oaGMyZ2lPaUlpZlN3aWNISmxkbWx2ZFhOVWIydGxiaUk2SWlJc0ltRmpkR2x2YmlJNkluSmxkWE5oWW14bElpd2lkRzlyWlc1VWVYQmxJam9pTWlJc0luTmpkQ0k2TVRjNE56WXlNVFF3TlRNMk55d2labkJwWkNJNkltRTJNekpoWlRreExXRXpaakF0TkRCaVpDMDRNVFJpTFRaak9ESTBZek5oWXpObU1TSXNJblJwSWpwN0ltbGtJam9pWVRZMVl6ZzVZVEJqTmpKak5EQXpPV0ZpTkRWbU5EZ3pPR1UyT1dJMk5qRWlMQ0p0SWpvaU1TSjlMQ0ptYVdRaU9pSmpNV1V6TXpSaE9DMDVZakF3TFRSalltSXRZbVZpTlMxa1l6WTFZamswWlRnNE56Y2lMQ0p3WW5NaU9qQXNJbTEwWkhNaU9qQXNJbU5zYkhNaU9pSmlZVEE1TkdZek1HVmlPV0ZsWlRNd0lpd2liV2xrSWpvaVpuQmZNakF5Tmw4d09GOHlORjltTVRVM1l6QXdaU0o5LjM0YjRjNWZlYzdmNTc2YjdlNTM3YTJhNDAxZThjMDI2MTY5Y2MxZGIwNWI5YzUxNTgyNjE3NDU3YzJmZDExYTE="
    print(solve(payload))
