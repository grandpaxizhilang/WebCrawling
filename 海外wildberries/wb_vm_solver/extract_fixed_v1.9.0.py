# -*- coding: utf-8 -*-
r"""
从浏览器采集的 u 提取 v1.9.0 固定指纹，自动写入 fixed_fp_v1.9.0.b64
=====================================================================
唯一用法：
    1. 浏览器控制台运行 capture_fp.js（把 SCRIPT_PATH 改成
       /statics/challenge_vm_fp_v1.9.0_029781bb.js，填入 create-token
       返回的 payload），打印 __CAPTURE__ = {...}。
    2. 把 __CAPTURE__ 整段粘到下面的 _RAW 字符串里
       （payload 和 u 必须来自同一次 capture）。
    3. 直接运行：  python extract_fixed_v1.9.0.py
    4. 脚本校验通过后自动把指纹写入同目录的 fixed_fp_v1.9.0.b64，
       solve_v190.py 直接读取，无需手动复制。

注意: 只支持 v1.9.0_029781bb 构建。
"""
import os
import json
import re
import base64

from solve_v190 import parse_payload, seal_bytes, decrypt_seal, A0, A2

# ============ 在这里粘贴浏览器复制的内容（整段 __CAPTURE__）============
# 粘贴前请确认 capture_fp.js 里的 SCRIPT_PATH 是
#   /statics/challenge_vm_fp_v1.9.0_029781bb.js
# 且 create-token 返回的 scriptPath 也是同一个（两者必须一致）。
_RAW = """__CAPTURE__ = {
  "challengeName": "challenge_vm_fp_v1.9.0_029781bb",
  "payload": "<在 capture_fp.js 控制台输出里粘贴这里的 payload>",
  "u": "<粘贴这里的 u>"
}
"""
# ====================================================================


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
        raise ValueError("重新密封比对不一致：请确认 _RAW 里 payload 和 u 来自同一次 capture，"
                         "且 solve_v190.py 的密码学正确")

    if plain[:2] != b"VF":
        raise ValueError("明文指纹头不是 VF magic")
    pos = 2
    vlen, pos = read_varint(plain, pos)
    version = plain[pos:pos + vlen].decode("utf-8", "replace")
    pos += vlen
    count, pos = read_varint(plain, pos)

    fixed_b64 = base64.b64encode(plain).decode()

    out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fixed_fp_v1.9.0.b64")
    with open(out_path, "w", encoding="utf-8", newline="") as f:
        f.write(fixed_b64 + os.linesep)

    print("id:", d["id"])
    print("frameNonce:", fn)
    print("指纹明文:", len(plain), "字节，version", version, "，组件数", count)
    print("重新密封比对(MAC): OK")
    print()
    print("已写入固定指纹 ->", out_path, "（solve_v190.py 会自动读取）")


if __name__ == "__main__":
    main()