# -*- coding: utf-8 -*-
"""
从浏览器采集的 u 提取固定指纹，自动写入 fixed_fp.b64
=====================================================
唯一用法：
    1. 把 capture_fp.js 在浏览器控制台输出的整段内容（含 __CAPTURE__）
       粘到下面的 _RAW 字符串里（payload 和 u 必须来自同一次 capture）。
    2. 直接运行：  python extract_fixed.py
    3. 脚本会校验通过后自动把指纹写入同目录的 fixed_fp.b64，
       solve.py 直接读取该文件，无需手动复制。
"""
import os
import json
import re
import base64
import struct

from solve import parse_payload, seal_bytes, u32, rotl32, AO, AP, AQ, AR, Sealer

# ============ 在这里粘贴浏览器复制的内容（整段 __CAPTURE__）============
# 注意：本脚本只支持 v1.8.0_25fd2657 构建。
# 粘贴前请确认 capture_fp.js 里的 SCRIPT_PATH 是
#   /statics/challenge_vm_fp_v1.8.0_25fd2657.js
# 且 create-token 返回的 scriptPath 也是同一个（两者必须一致）。
# 若 __CAPTURE__ 里的 challengeName 不是 challenge_vm_fp_v1.8.0_25fd2657
# （例如 v1.9.0_xxx），说明构建已轮换，本脚本无法处理。
_RAW = """__CAPTURE__ = {
 "challengeName": "challenge_vm_fp_v1.8.0_25fd2657",
 "payload": "bZnBfdm0uZXlKMlpYSnphVzl1SWpveExDSjBhVzFsYzNSaGJYQWlPakUzT0RjMU5UTTROak13T1RFc0ltbGtJam9pTUdSaFl6STBObUl0TlRBME9TMDBOVE5oTFRsaU5Ua3ROR0ZsTkRjd1lXRXlaV05qSWl3aWFYQWlPaUl4TWpFdU16TXVNakEzTGpNMklpd2lkV0VpT2lKTmIzcHBiR3hoTHpVdU1DQW9WMmx1Wkc5M2N5Qk9WQ0F4TUM0d095QlhhVzQyTkRzZ2VEWTBLU0JCY0hCc1pWZGxZa3RwZEM4MU16Y3VNellnS0V0SVZFMU1MQ0JzYVd0bElFZGxZMnR2S1NCRGFISnZiV1V2TVRVeExqQXVNQzR3SUZOaFptRnlhUzgxTXpjdU16WWlMQ0p6YVhSbFMyVjVJam9pTnpRd01HSmtOV1JtT0dJNE5ETmlNamd5TlRRMk5UbG1NVEE1TVRWbU16RWlMQ0prWlhacFkyVlViMnRsYmlJNklpSXNJblZ6WlhKVFkyOXlaU0k2ZXlKb1lYTm9Jam9pSW4wc0luQnlaWFpwYjNWelZHOXJaVzRpT2lJaUxDSmhZM1JwYjI0aU9pSnlaWFZ6WVdKc1pTSXNJblJ2YTJWdVZIbHdaU0k2SWpJaUxDSnpZM1FpT2pFM09EYzFOVE00TmpNd09URXNJbVp3YVdRaU9pSXdaR0ZqTWpRMllpMDFNRFE1TFRRMU0yRXRPV0kxT1MwMFlXVTBOekJoWVRKbFkyTWlMQ0owYVNJNmV5SnBaQ0k2SW1JM00yTTJPV1kxTUROak16UmtabUZoWWprek5tVTVaVEV5TXpVME5XUTRJaXdpYlNJNklqRWlmU3dpWm1sa0lqb2lZVGcxWVRReFpUUXROVE15WmkwME1XSm1MV0l4TjJJdFptRXhaakU0TlRSbE5EVmxJaXdpY0dKeklqb3dMQ0p0ZEdSeklqb3dMQ0pqYkd4eklqb2laV0kxWWpGa05qRmlPR05pWlRFMk15SXNJbTFwWkNJNkltWndYekl3TWpaZk1EaGZNakZmWldKak0ySmxOV01pZlE9PS42NjAwOWRkY2Q3YzcxNTE2ODc3NjI5ZTU5M2I1NTIyNWM1ZWMyYWYwY2I0OTc1MTI1ZTBmMjk5YjRkMDUzMTJk",
 "u": "635|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"
}
"""
# ====================================================================


# ---------------- 输入解析：只认 _RAW 里粘贴的 __CAPTURE__ 内容 ----------------
def parse_raw(raw):
    m = re.search(r"__CAPTURE__\s*=\s*(\{.*\})", raw, re.S)
    if m:
        raw = m.group(1)
    raw = raw.strip()
    if not raw.startswith("{"):
        raise ValueError("没识别到 __CAPTURE__ JSON，请检查 _RAW 里的粘贴内容")
    obj = json.loads(raw)
    payload = obj.get("payload")
    u = obj.get("u")
    if not payload or not u:
        raise ValueError("__CAPTURE__ JSON 缺少 payload 或 u")
    return payload, str(u)


# ---------------- 解密工具（与 reimpl.js 逐字节一致） ----------------
def read_varint(b, pos):
    shift = 0
    val = 0
    while True:
        byte = b[pos]
        pos += 1
        val |= (byte & 0x7F) << shift
        if (byte & 0x80) == 0:
            break
        shift += 7
    return val, pos


def keystream_for(sealer):
    """从当前状态算第 pX 块的密钥流字，不改状态。"""
    st = sealer.state
    s2 = st["s2"]; s3 = st["s3"]; s4 = st["s4"]; s5 = st["s5"]
    pX = sealer.pX
    t12 = (pX + 7) & 7
    t13 = u32(AO[((t12 * 5 + 3) & 7)] ^ ((1842276411 + t12 * 2110078725) & 0xFFFFFFFF))
    t14 = (pX + 6) & 7
    t15 = u32(AR[((t14 + 4) & 7)] ^ ((3340988254 + t14 * 3750563199) & 0xFFFFFFFF))
    t16 = (s2 + (s5 ^ s3) + pX) & 15
    t17 = u32(AP[((t16 * 15 + 10) & 15)] ^ ((2192809920 + t16 * 2274619873) & 0xFFFFFFFF))
    s2 = u32(s2 + t17 + t13 + pX)
    s2 = u32((s2 ^ ((s2 << 3) & 0xFFFFFFFF) ^ (s2 >> 9)) & 0xFFFFFFFF)
    t18 = ((s4 ^ s5) + s3 + pX) & 15
    t19 = u32(AQ[((t18 * 7 + 5) & 15)] ^ ((1248962321 + t18 * 835872739) & 0xFFFFFFFF))
    s3 = u32(s3 + t19 + s5)
    s3 = u32((s3 ^ (s3 >> 7)) & 0xFFFFFFFF)
    s4 = u32(rotl32(u32(s2 + t15), 24) ^ s4)
    t22 = (pX + s5 + 6) & 7
    t23 = u32(AR[((t22 + 4) & 7)] ^ ((3340988254 + t22 * 3750563199) & 0xFFFFFFFF))
    return u32(s2 ^ rotl32(s3, 15) ^ s4 ^ t23)


def decrypt_seal(challenge_id, clls, sealed_bytes):
    """解封密封字节 → (frameNonce, 指纹明文 bytes)。"""
    if len(sealed_bytes) < 4 + 16:
        raise ValueError("sealed bytes too short")
    fn = struct.unpack("<I", sealed_bytes[:4])[0]
    total = len(sealed_bytes) - 4 - 16
    out = bytearray(4 + total + 16)
    sealer = Sealer(out, challenge_id, clls, fn, total)
    plain = bytearray(total)
    off = 4
    while off < 4 + total:
        remain = 4 + total - off
        cnt = 4 if remain >= 4 else remain
        ct = 0
        for k in range(cnt):
            ct |= sealed_bytes[off + k] << (8 * k)
        ct = u32(ct)
        ks = keystream_for(sealer)
        pt = u32(ct ^ ks)
        sealer.pm(pt, cnt)
        for k in range(cnt):
            plain[off - 4 + k] = (pt >> (8 * k)) & 0xFF
        off += cnt
    return fn, bytes(plain)


def main():
    if "<paste" in _RAW:
        raise ValueError("还没粘贴：请先把浏览器控制的 __CAPTURE__ 整段粘到 _RAW。")

    payload, u = parse_raw(_RAW)
    d = parse_payload(payload)
    if "|" not in u:
        raise ValueError("u 格式应为：elapsed|base64(...)")
    sealed = base64.b64decode(u.split("|", 1)[1])

    fn, plain = decrypt_seal(d["id"], d["clls"], sealed)

    resealed = seal_bytes(d["id"], d["clls"], plain, fn)
    if resealed != sealed:
        raise ValueError("重新密封比对不一致：请确认 _RAW 里 payload 和 u 来自同一次 capture")

    if plain[:2] != b"VF":
        raise ValueError("明文指纹头不是 VF magic")
    pos = 2
    vlen, pos = read_varint(plain, pos)
    version = plain[pos:pos + vlen].decode("utf-8", "replace")
    pos += vlen
    count, pos = read_varint(plain, pos)

    fixed_b64 = base64.b64encode(plain).decode()

    out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fixed_fp.b64")
    with open(out_path, "w", encoding="utf-8", newline="") as f:
        f.write(fixed_b64 + os.linesep)

    print("id:", d["id"])
    print("frameNonce:", fn)
    print("指纹明文:", len(plain), "字节，version", version, "，组件数", count)
    print("重新密封比对(MAC): OK")
    print()
    print("已写入固定指纹 ->", out_path, "（solve.py 会自动读取）")


if __name__ == "__main__":
    main()