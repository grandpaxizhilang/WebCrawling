# -*- coding: utf-8 -*-
r"""
WB antibot 挑战 challenge_vm_fp_v1.9.0_029781bb 离线 u 求解器（Python 版）
=====================================================================
由 v1.9.0 字节码逆向移植（与 v1.8.0 结构相同，但常量/旋转量/反馈公式均不同）。

用法:
    python solve_v190.py "<payload>"     # payload 来自 create-token 接口

固定指纹:
    读取与脚本同目录的 fixed_fp_v1.9.0.b64（单行 base64，无换行）。
    获取方式:
        1. 浏览器控制台运行 capture_fp.js（SCRIPT_PATH 改成
           /statics/challenge_vm_fp_v1.9.0_029781bb.js），打印 __CAPTURE__。
        2. 把 __CAPTURE__ 整段粘进 extract_fixed_v1.9.0.py 的 _RAW 并运行:
           python extract_fixed_v1.9.0.py
        3. 脚本自动写入 fixed_fp_v1.9.0.b64。

注意: 只支持 v1.9.0_029781bb 构建。
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

# ---------------- 常量表（v1.9.0_029781bb；来自字节码常量池） ----------------
AO = [2016804802, 2118595122, 1967760369, 785815747, 193022992, 2852732299, 2868588502, 3002755691]
AP = [1535886362, 2069011537, 3355610669, 849936845, 2605248180, 11635162, 665347834, 4111416763,
      351718269, 1693381394, 63656312, 1233263085, 3322825680, 1773226891, 4280871492, 2153063533]
AQ = [3123954511, 2980613366, 964222396, 1404647122, 1223323165, 3806026074, 668657927, 110041415,
      1841521029, 2376245626, 2388794302, 819829764, 2718617493, 1365585457, 794122987, 402229532]
AR = [1387840897, 2956904512, 3745528828, 1965009149, 3688950796, 2577727964, 3824365246, 3964569831]
A3 = 698019239     # a6
A2 = 4             # a2
A0 = 4             # a0  frameNonce 头长度
A1 = 16            # a1  MAC 长度
A_G = 1484301268   # aG  frameNonce = (Date.now() ^ A_G) >>> 0

# ---------------- 字符串哈希 gv(px, py)：自定义 FNV 变体 ----------------
def gv(px, py):
    h = u32(px)
    for ch in py:
        h ^= (ord(ch) & 255)
        h = (h + ((h << 5) & 0xFFFFFFFF) + (h >> 2) + 2654435769) & 0xFFFFFFFF
        h = rotl32(h, 7)
    return h

# ---------------- 密钥派生 gw(challengeId, clls, frameNonce, serializedLen) ----------------
def gw(pz, pA, pB, pC):
    seed = (2166136261 ^ u32(pB) ^ u32(pC) ^ A3) & 0xFFFFFFFF
    h = gv(seed, pz)
    h = (h ^ 2779096485) & 0xFFFFFFFF
    h = gv(h, pA)
    return (h ^ rotl32(u32(pC), 11) ^ rotl32(A3, 17)) & 0xFFFFFFFF

# ---------------- 密封器（对应字节码 gx/p6/p7/p8） ----------------
class Sealer:
    def __init__(self, out, challenge_id, clls, frame_nonce, serialized_len):
        self.out = out
        self.frame_nonce = u32(frame_nonce)
        self.serialized_len = serialized_len
        self.pO = gw(challenge_id, clls, u32(frame_nonce), serialized_len)
        self.state = {
            's2': ((3831913300 ^ 986108159) ^ self.pO ^ serialized_len) & 0xFFFFFFFF,          # aV
            's3': ((809265011 ^ 3199716496) + self.frame_nonce + rotl32(self.pO, 16)) & 0xFFFFFFFF,   # aS, rotl16
            's4': ((1917602104 ^ 1118357537) ^ rotl32(serialized_len, 6)) & 0xFFFFFFFF,         # aT, rotl6
            's5': (self.pO ^ (1326441159 ^ 3331965874)) & 0xFFFFFFFF,                            # aU
            's6': (self.pO ^ (1671020923 ^ 2387710388)) & 0xFFFFFFFF,                            # aY
            's7': ((1768812460 ^ 1199063185) + serialized_len) & 0xFFFFFFFF,                     # aX
            's8': (self.frame_nonce ^ (2863056139 ^ 10415982)) & 0xFFFFFFFF,                     # aW
            's9': ((2503221425 ^ 3116736075) + rotl32(self.pO, 16)) & 0xFFFFFFFF,                # aZ, rotl16
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
        t12 = (pX + 2) & 7
        t13 = (AO[((t12 * 5 + 3) & 7)] ^ ((1533342475 + t12 * 381634453) & 0xFFFFFFFF)) & 0xFFFFFFFF
        t14 = (pX + 3) & 7
        t15 = (AR[((t14 + 4) & 7)] ^ ((803359278 + t14 * 1963635215) & 0xFFFFFFFF)) & 0xFFFFFFFF
        t16 = ((s2 ^ s3) + (s4 ^ s5) + pX) & 15
        t17 = (AP[((t16 * 15 + 10) & 15)] ^ ((945755024 + t16 * 4172540785) & 0xFFFFFFFF)) & 0xFFFFFFFF
        s2 = (s2 + t17 + t13 + pX) & 0xFFFFFFFF
        s2 = (s2 ^ ((s2 << 1) & 0xFFFFFFFF) ^ (s2 >> 10)) & 0xFFFFFFFF
        t18 = ((s2 + s4) + s5 + pX) & 15
        t19 = (AQ[((t18 * 7 + 5) & 15)] ^ ((3645158977 + t18 * 2671332691) & 0xFFFFFFFF)) & 0xFFFFFFFF
        s3 = (s3 + t19 + s5) & 0xFFFFFFFF
        s3 = (s3 ^ (s3 >> 11)) & 0xFFFFFFFF
        s4 = (s4 + rotl32((s3 ^ t15) & 0xFFFFFFFF, 16) + s2) & 0xFFFFFFFF
        t22 = (pX + s5 + 3) & 7
        t23 = (AR[((t22 + 4) & 7)] ^ ((803359278 + t22 * 1963635215) & 0xFFFFFFFF)) & 0xFFFFFFFF
        ks = ((s2 + (s4 ^ t23)) & 0xFFFFFFFF) ^ (s3 >> 2)
        ct = (block ^ ks) & 0xFFFFFFFF
        idx = A0 + pX * A2
        self.out[idx] = ct & 0xFF
        if count > 1:
            self.out[idx + 1] = (ct >> 8) & 0xFF
        if count > 2:
            self.out[idx + 2] = (ct >> 16) & 0xFF
        if count > 3:
            self.out[idx + 3] = (ct >> 24) & 0xFF
        mask = 0xFFFFFFFF if count == 4 else ((1 << (count * 8)) - 1) & 0xFFFFFFFF
        s30 = (ct & mask) & 0xFFFFFFFF
        s6 = (s6 + s30 + s5) & 0xFFFFFFFF
        s7 = (s7 ^ s30 ^ s2 ^ s4) & 0xFFFFFFFF
        s8 = (s8 + s30 + s3 + pX) & 0xFFFFFFFF
        s9 = (s9 ^ ((s6 + s8 + s4) & 0xFFFFFFFF)) & 0xFFFFFFFF
        s5 = (s30 + s3 + s4) & 0xFFFFFFFF
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
        w1 = (s6 ^ self.serialized_len ^ self.pO ^ ((AR[4] ^ 803359278) & 0xFFFFFFFF)) & 0xFFFFFFFF
        w2 = (s7 + self.frame_nonce + rotl32(w1, 17) + ((AR[5] ^ 2766994493) & 0xFFFFFFFF)) & 0xFFFFFFFF
        w3 = (s8 ^ rotl32((w2 + self.serialized_len) & 0xFFFFFFFF, 16) ^ ((AR[6] ^ 435662412) & 0xFFFFFFFF)) & 0xFFFFFFFF
        w4 = (s9 + rotl32((w3 ^ self.pO) & 0xFFFFFFFF, 6) + ((AR[7] ^ 2399297627) & 0xFFFFFFFF)) & 0xFFFFFFFF
        w1 = (w1 + rotl32((w4 ^ self.frame_nonce) & 0xFFFFFFFF, 16) + ((AR[0] ^ 67965546) & 0xFFFFFFFF)) & 0xFFFFFFFF
        base = A0 + self.serialized_len
        for i, w in enumerate([w1, w2, w3, w4]):
            self.out[base + i * 4] = w & 0xFF
            self.out[base + i * 4 + 1] = (w >> 8) & 0xFF
            self.out[base + i * 4 + 2] = (w >> 16) & 0xFF
            self.out[base + i * 4 + 3] = (w >> 24) & 0xFF
        self.p1 = True

# ---------------- 密封已知明文字节（离线复用固定指纹） ----------------
def seal_bytes(challenge_id, clls, plaintext_bytes, frame_nonce):
    serialized_len = len(plaintext_bytes)
    out = bytearray(A0 + serialized_len + A1)
    fn = u32(frame_nonce)
    out[0] = fn & 0xFF
    out[1] = (fn >> 8) & 0xFF
    out[2] = (fn >> 16) & 0xFF
    out[3] = (fn >> 24) & 0xFF
    sealer = Sealer(out, challenge_id, clls, fn, serialized_len)
    off = 0
    while off < serialized_len:
        cnt = min(A2, serialized_len - off)
        v = 0
        for k in range(cnt):
            v |= plaintext_bytes[off + k] << (8 * k)
        sealer.pm(v, cnt)
        off += cnt
    sealer.pn()
    return bytes(out)

# ---------------- 解封（供 extract_fixed_v1.9.0.py 提取明文指纹） ----------------
def keystream_for(sealer):
    st = sealer.state
    s2 = st['s2']; s3 = st['s3']; s4 = st['s4']; s5 = st['s5']
    pX = sealer.pX
    t12 = (pX + 2) & 7
    t13 = (AO[((t12 * 5 + 3) & 7)] ^ ((1533342475 + t12 * 381634453) & 0xFFFFFFFF)) & 0xFFFFFFFF
    t14 = (pX + 3) & 7
    t15 = (AR[((t14 + 4) & 7)] ^ ((803359278 + t14 * 1963635215) & 0xFFFFFFFF)) & 0xFFFFFFFF
    t16 = ((s2 ^ s3) + (s4 ^ s5) + pX) & 15
    t17 = (AP[((t16 * 15 + 10) & 15)] ^ ((945755024 + t16 * 4172540785) & 0xFFFFFFFF)) & 0xFFFFFFFF
    s2 = (s2 + t17 + t13 + pX) & 0xFFFFFFFF
    s2 = (s2 ^ ((s2 << 1) & 0xFFFFFFFF) ^ (s2 >> 10)) & 0xFFFFFFFF
    t18 = ((s2 + s4) + s5 + pX) & 15
    t19 = (AQ[((t18 * 7 + 5) & 15)] ^ ((3645158977 + t18 * 2671332691) & 0xFFFFFFFF)) & 0xFFFFFFFF
    s3 = (s3 + t19 + s5) & 0xFFFFFFFF
    s3 = (s3 ^ (s3 >> 11)) & 0xFFFFFFFF
    s4 = (s4 + rotl32((s3 ^ t15) & 0xFFFFFFFF, 16) + s2) & 0xFFFFFFFF
    t22 = (pX + s5 + 3) & 7
    t23 = (AR[((t22 + 4) & 7)] ^ ((803359278 + t22 * 1963635215) & 0xFFFFFFFF)) & 0xFFFFFFFF
    return u32((s2 + (s4 ^ t23)) ^ (s3 >> 2))

def decrypt_seal(challenge_id, clls, sealed_bytes):
    if len(sealed_bytes) < A0 + A1:
        raise ValueError("sealed bytes too short")
    fn = int.from_bytes(sealed_bytes[:A0], "little")
    total = len(sealed_bytes) - A0 - A1
    out = bytearray(A0 + total + A1)
    sealer = Sealer(out, challenge_id, clls, fn, total)
    plain = bytearray(total)
    off = A0
    while off < A0 + total:
        remain = A0 + total - off
        cnt = A2 if remain >= A2 else remain
        ct = 0
        for k in range(cnt):
            ct |= sealed_bytes[off + k] << (8 * k)
        ct = u32(ct)
        ks = keystream_for(sealer)
        pt = u32(ct ^ ks)
        sealer.pm(pt, cnt)
        for k in range(cnt):
            plain[off - A0 + k] = (pt >> (8 * k)) & 0xFF
        off += cnt
    return fn, bytes(plain)

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

# ---------------- 固定指纹（读取同目录 fixed_fp_v1.9.0.b64，单行 base64） ----------------
_FIXED_FP_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fixed_fp_v1.9.0.b64")
_fixed_bytes = None

def get_fixed_bytes():
    global _fixed_bytes
    if _fixed_bytes is None:
        try:
            with open(_FIXED_FP_PATH, "r", encoding="utf-8") as f:
                data = f.read().strip()
        except OSError:
            raise FileNotFoundError(
                "缺少 fixed_fp_v1.9.0.b64，请先运行 extract_fixed_v1.9.0.py 生成该文件（需与 solve_v190.py 同目录）")
        _fixed_bytes = base64.b64decode(data)
    return _fixed_bytes

# ---------------- frameNonce 生成（对应字节码 gB：Date.now() ^ A_G，自增） ----------------
_nonce_state = None

def frame_nonce():
    global _nonce_state
    if _nonce_state is None:
        _nonce_state = (int(time.time() * 1000) ^ A_G) & 0xFFFFFFFF
    v = _nonce_state
    _nonce_state = (_nonce_state + 1) & 0xFFFFFFFF
    return v

def solve(payload, frame_nonce_val=None, elapsed=None):
    d = parse_payload(payload)
    fixed = get_fixed_bytes()
    nonce = frame_nonce() if frame_nonce_val is None else u32(frame_nonce_val)
    t0 = time.time() * 1000
    sealed = seal_bytes(d["id"], d["clls"], fixed, nonce)
    ms = elapsed if elapsed is not None else max(1, int(time.time() * 1000 - t0))
    return str(ms) + "|" + base64.b64encode(sealed).decode()

if __name__ == "__main__":
    payload = "8ZnBfdm0uZXlKMlpYSnphVzl1SWpveExDSjBhVzFsYzNSaGJYQWlPakUzT0RjMk1qWTJOVE15TWpjc0ltbGtJam9pWkRreVltVXdNRFF0WXpBNE5pMDBOek15TFdFM09USXRORFJpTWpFME1tVmxaRE5rSWl3aWFYQWlPaUl4TWpFdU16TXVNakEzTGpNMklpd2lkV0VpT2lKTmIzcHBiR3hoTHpVdU1DQW9WMmx1Wkc5M2N5Qk9WQ0F4TUM0d095QlhhVzQyTkRzZ2VEWTBLU0JCY0hCc1pWZGxZa3RwZEM4MU16Y3VNellnS0V0SVZFMU1MQ0JzYVd0bElFZGxZMnR2S1NCRGFISnZiV1V2TVRVeExqQXVNQzR3SUZOaFptRnlhUzgxTXpjdU16WWlMQ0p6YVhSbFMyVjVJam9pTnpRd01HSmtOV1JtT0dJNE5ETmlNamd5TlRRMk5UbG1NVEE1TVRWbU16RWlMQ0prWlhacFkyVlViMnRsYmlJNklpSXNJblZ6WlhKVFkyOXlaU0k2ZXlKb1lYTm9Jam9pSW4wc0luQnlaWFpwYjNWelZHOXJaVzRpT2lJaUxDSmhZM1JwYjI0aU9pSnlaWFZ6WVdKc1pTSXNJblJ2YTJWdVZIbHdaU0k2SWpJaUxDSnpZM1FpT2pFM09EYzJNalkyTlRNeU1qY3NJbVp3YVdRaU9pSmtPVEppWlRBd05DMWpNRGcyTFRRM016SXRZVGM1TWkwME5HSXlNVFF5WldWa00yUWlMQ0owYVNJNmV5SnBaQ0k2SWpVd01XSmtORFF6TlRabVlUUmhNalU1T1RWa01qZzFPVGd6TWpabE1HRXpJaXdpYlNJNklqRWlmU3dpWm1sa0lqb2laREprTnpNNE1UVXRPVGt3TmkwME4yWXlMV0UwT0RRdFltWXpOamN4WVdGa09XUTVJaXdpY0dKeklqb3dMQ0p0ZEdSeklqb3dMQ0pqYkd4eklqb2lZbVl3TmpSbE5qQmxabU5tWlRjek5TSXNJbTFwWkNJNkltWndYekl3TWpaZk1EaGZNalJmWmpFMU4yTXdNR1VpZlE9PS43NDE5NTFiNDg0ZmYxZWEwZWNiZjQxYWMwYjg0YmY3MGM5MGIyMDY2OTA3Y2U0ZDY0Njg4YTA3ZWQxOWU1MGMx"
    print(solve(payload))
