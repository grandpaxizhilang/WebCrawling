# Wildberries antibot 挑战逆向总结（v1.8.0 → v1.9.0）

> 目标：绕过 `antibot.wildberries.ru` 的 JS 指纹挑战，离线生成合法的 `u` 解，从而换取 `ck` 会话凭证。
> 核心思路：**不执行 VM、不伪造浏览器环境**，而是把浏览器真实算出的 `u` 解封成「指纹明文」，再离线用新 challengeId 重新密封。

---

## 1. 背景与总体架构

- WB 商品页反爬：首次请求返回 403/498，附带 `create-token` 接口与挑战脚本。
- 挑战脚本 `challenge_vm_fp_vX.Y.Z_<hash>.js` 是一个 **JVO1 自定义 VM 字节码** 程序，由宿主编排脚本 `challenge-solver_v1.0.8.js` 加载并调用。
- 每次挑战会**轮换构建**（hash 不同、字节码常量不同），需要重新逆向。
- 页面里注册的导出函数：`window[Symbol.for(hash(challengeName))]`，其中 hash 是 Java 风格：
  ```js
  const hash = s => { let h = 0; for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i), h |= 0; return String(Math.abs(h)); };
  ```
  例如 `challenge_vm_fp_v1.8.0_25fd2657` → `1343830250`。

---

## 2. 挑战协议（两个版本通用）

```
payload = "<marker>" + base64( part0 + "." + base64( JSON{ id, clls } ) )
u       = String(elapsed) + "|" + base64( sealed )
sealed  = frameNonce_u32_LE(4) + 密文 + MAC(16)
```

- **frameNonce**：4 字节小端，密封器的随机/时间种子。
- **密文**：指纹序列化明文逐 4 字节块 XOR 密钥流（密钥流由自定义分组密码生成）。
- **MAC**：末尾 16 字节，由最终状态 + 若干常量/旋转导出。
- **指纹明文头**：`56 46 05 35 2e 32 2e 30` = 常量 `18006`(0x4656) 小端 2 字节 `"VF"` + LEB128 长度 `5` + 版本字符串 `"5.2.0"` + LEB128 组件数（36）。

### HTTP 完整流程

```
1) POST /__wbaas/challenges/antibot/api/v1/create-token  (空 body)
   → 498 { challenge: { scriptPath, payload } }
2) 求解 payload → u
3) POST create-token  body = { challenge:{scriptPath,payload}, solution:{payload:u}, meta:{type:"SCRIPT", name, marks:[...], startHidden, becameHidden} }
   → 200 { secureToken }
4) 用 secureToken 作为 cookie：x_wbaas_token=<secureToken>，去请求真实接口
   （如 /__internal/u-card/cards/v4/detail）
```

- `secureToken` 内部编码了 **IP + UA + 时间戳**，因此必须用 curl_cffi 等做 TLS 指纹伪装（`impersonate="chrome"`），且 IP/UA 要与指纹采集环境一致，否则后续请求会被判不可信。
- 请求真实接口时还需要带上 `deviceid`、`x-requested-with: XMLHttpRequest`、`x-spa-version` 等头（见 `test.py` 完整示例）。
- 注意：`create-token` 200 只返回 `secureToken`，**不会直接下发 `ck` cookie**；凭证是通过 `x_wbaas_token` cookie 交给后续接口使用的。

---

## 3. v1.8.0 逆向（challenge_vm_fp_v1.8.0_25fd2657）

### 3.1 解码与反汇编

- JVO1 字节码可直接用宿主 bundle 自带的解码 API（`__VM_EXPORTS__`）：
  - `decode.js`：`Zn(vi)` 解压 → `ne` 读头 → `Xo` 全量解码 → `decoded.json`
  - `disasm.js`：把 `{names, constants, functions, bytecode}` 反汇编成 `disasm.txt`
- 关键函数定位（按名字）：`go`=字符串哈希、`gp`=密钥派生、`gj`=指纹序列化、`gi`=组件写入、`gs`=frameNonce 生成、`fC`=LEB128、`fK`=长度前缀字符串、`fE`=float64、密封器 `gq/pL/pM/pN`。

### 3.2 密码学（v1.8.0）

- 常量表（来自字节码常量池）：`AO[8]`、`AP[16]`、`AQ[16]`、`AR[8]`、`A3=1796158859`。
- 字符串哈希 `go(px, py)`：
  ```
  h = px
  for ch in py:
      h ^= ch & 255
      h = h + (h<<5)>>>0 + (h>>>2) + 2654435769
      h = rotl32(h, 7)
  ```
- 密钥派生 `gp(challengeId, clls, frameNonce, serializedLen)`：
  ```
  seed = (2166136261 ^ nonce ^ len ^ A3)
  h = go(seed, challengeId)
  h = go(h ^ 2779096485, clls)
  return h ^ rotl32(len, 11) ^ rotl32(A3, 17)
  ```
- 状态初始化 `s2..s9`（旋转 15/24/18 等）+ 每块密钥流 `pL` + 字节写入器 `pM` + MAC `pN`（w1..w4，旋转 27/15/24/18）。
- frameNonce：`(Date.now() ^ 358657350) >>> 0`，每次自增 1。

### 3.3 离线方案与验证

- **关键洞察**：指纹明文序列化字节与 challengeId **无关**。因此：
  1. 浏览器里跑 `capture_fp.js` 拿到真实 `(payload, u)`；
  2. 用 `decryptSeal` 解封 u → 指纹明文（14818 字节，36 组件）；
  3. 存为 `fixed_fp.b64`；
  4. 离线 `sealBytes(challengeId, clls, 明文, frameNonce)` 重密封 → 新 u。
- 交付物：`reimpl.js`（JS 逐字节等价）、`solve.js`、`solve.py`、`extract_fixed.py`、`capture_fp.js`。
- 验证：用原始 id/clls/frameNonce 重算与真实 u **逐字节一致（MATCH: True）**。

---

## 4. v1.9.0 逆向（challenge_vm_fp_v1.9.0_029781bb）

### 4.1 构建轮换的应对

- 页面/接口切换到了 v1.9.0。新 bundle 不再是 `__VM_EXPORTS__`，只有 `{bundle, getExported, run}`，且变量名全部重排（`we/jB/bB/Ne` 不再是原含义）。
- **解码方案**：给 bundle 源码打补丁，在唯一锚点 `return z.o` 前注入：
  ```js
  try{z.o.__Xo=Xo}catch(e){} try{z.o.__No=No}catch(e){} ... // 逐个 try/catch，名字错也不崩
  ```
  导出内部解码函数后，用自己的解码 API 解自己：
  - `jn`=base64 → `KB`=LZSS 解压 → `ne`=头部解析 → `VB`=构建运行时 → `Xs`=全量解码
  - `Xs(dec, { uniqueBuildRuntime: VB(dec), Or: true, xA: true })` → `{FD:{namePool,constantPool}, functions, yL}`
  - 得到：1291 名字 / 1410 常量 / 483 函数 / 26417 指令。

### 4.2 新密码学（与 v1.8.0 的结构差异）

命名虽然变了（`gv/gw/gx/p6/p7/p8`），但整体结构一致。**关键差异**：

| 项 | v1.8.0 | v1.9.0 |
|---|---|---|
| A3（密钥派生常量） | 1796158859 | `a6=698019239` |
| frameNonce 异或 | 358657350 | `aG=1484301268` |
| t12 | (pX+7)&7 | (pX+2)&7 |
| t14 | (pX+6)&7 | (pX+3)&7 |
| t22 | (pX+s5+6)&7 | (pX+s5+3)&7 |
| t16 | (s2+(s5^s3)+pX)&15 | ((s2^s3)+(s4^s5)+pX)&15 |
| **t18** | (s4^s5)+s3+pX | **((s2+s4)+s5+pX)&15（用更新后的 s2，全加法）** |
| s2 混合 | ^((s2<<3)>>>0)^(s2>>>9) | ^((s2<<1)>>>0)^(s2>>>10) |
| s3 混合 | ^(s3>>>7) | ^(s3>>>11) |
| s4 更新 | rotl32((s2+t15),24) ^ s4 | (s4 + rotl32((s3^t15),16) + s2) |
| 状态旋转 | 15/24/18 | 16/6/16 |
| 密钥流 ks | s2 ^ rotl32(s3,15) ^ s4 ^ t23 | ((s2+(s4^t23))>>>0) ^ (s3>>>2) |
| 反馈 | s6+s30+s2；s7^s30^s3；s8+(s30^s5)+pX；s9^((s8+s4)>>>0)；s5=s30+(s2^s3)+pX | s6+s30+s5；s7^s30^s2^s4；s8+s30+s3+pX；s9^((s6+s8+s4)>>>0)；s5=s30+s3+s4 |
| MAC 旋转 | 27/15/24/18 | 17/16/6/16 |

- 新常量表：`aO[8]/aP[16]/aQ[16]/aR[8]`（具体值见 `solve_v190.py`）。
- 掩码基/乘数：t13 `(1533342475, 381634453)`、t15/t23 `(803359278, 1963635215)`、t17 `(945755024, 4172540785)`、t19 `(3645158977, 2671332691)`。
- 状态初始化（gx）：`qa..qh` 对应 `s2..s9`，配对常量 `aV..aZ`。

### 4.3 排错过程（重点：t18 公式）

- 初版 Python 往返自测通过（内部一致），但解真实 u 不是 `"VF"` 头。
- 直接验证密码学：用「明文头 `VF\x05 5.2.0` 反推第 0 块应有密钥流」= `0x77b1c97d`，与 Python 算的不符。
- 写了 **迷你栈式解释器 `interp_p6.js`** 直接执行真实 p6 字节码，发现：
  - 它算出的 `ks0 = 0x77b1c97d` 与期望**完全一致** → 说明状态/密钥派生是对的；
  - 逐条打印中间值，定位到 **t18 公式转录错误**：真实字节码是 `slot2 + slot4 + slot5 + pX`（全加法、用 s4/s5），而我误写成 `(s4^s5)+s3+pX`。
- 修正后：解密明文头 `56 46 05 35 2e 32 2e 30` = `VF`+`5.2.0`，**重密封与真实 u 逐字节一致（MAC: OK）**。

---

## 5. 最终交付文件

`C:\Users\ds\Desktop\wb_vm_solver\` 下两套独立版本（互不影响）：

| 文件 | 说明 |
|---|---|
| `solve.py` / `extract_fixed.py` / `fixed_fp.b64` | v1.8.0 求解器 + 指纹提取 + 指纹文件 |
| `solve_v190.py` / `extract_fixed_v1.9.0.py` / `fixed_fp_v1.9.0.b64` | v1.9.0 求解器 + 指纹提取 + 指纹文件 |
| `capture_fp.js` | 浏览器控制台采集 `__CAPTURE__ = {challengeName, payload, u}` |
| `reimpl.js` / `solve.js` / `solver.js` / `source_names.js` | v1.8.0 JS 参考实现（纯算还原/序列化源名） |
| `bundle.js` | v1.8.0 构建 bundle（作 JVO1 解码宿主） |
| `challenge_vm_fp_v1.9.0_029781bb.js` | v1.9.0 构建 bundle（逆向对象） |
| `test.py` / `test2.py` | HTTP 全流程示例（create-token → 求解 → 提交 → 用 x_wbaas_token 调真实接口） |

**用法**（以 v1.9.0 为例）：
```
1. 浏览器控制台跑 capture_fp.js（SCRIPT_PATH 指向最新构建）→ 复制 __CAPTURE__
2. 粘贴到 extract_fixed_v1.9.0.py 的 _RAW → python extract_fixed_v1.9.0.py
   （自动写入 fixed_fp_v1.9.0.b64）
3. python solve_v190.py "<payload>"  → 输出 u
```

---

## 6. 脚本清单与使用说明

### 6.1 指纹采集（浏览器）

**`capture_fp.js`**（控制台运行）
- 作用：在真实浏览器里动态加载挑战脚本并调用导出函数，拿到一份真实的 `(payload, u)`。
- 使用前需修改两处：
  - `SCRIPT_PATH`：改为 `create-token` 返回的最新 scriptPath（如 `/statics/challenge_vm_fp_v1.9.0_029781bb.js`）；
  - `PAYLOAD`：改为 `create-token` 返回的 payload。
- 输出（复制整段给 extract 脚本）：
  ```
  __CAPTURE__ = { "challengeName": "...", "payload": "...", "u": "..." }
  ```

### 6.2 指纹提取（Python，自动写指纹文件）

**`extract_fixed.py`**（v1.8.0） / **`extract_fixed_v1.9.0.py`**（v1.9.0）
- 作用：解封 `u` → 得到指纹明文序列化字节 → base64 写入 `fixed_fp.b64` / `fixed_fp_v1.9.0.b64`。
- 用法：把 `__CAPTURE__` 整段粘到文件顶部的 `_RAW` 三引号里，直接运行：
  ```
  python extract_fixed_v1.9.0.py
  ```
- 自带校验：解封后重新密封必须与真实 u 逐字节一致（MAC: OK），否则报错（多为 payload/u 不配对或构建不对）。
- 只支持单一构建（`challengeName` 必须匹配脚本对应版本）。

### 6.3 离线求解器

**`solve.py`**（v1.8.0） / **`solve_v190.py`**（v1.9.0）
- 作用：输入 `create-token` 的 payload → 输出 `u`（`elapsed|base64(sealed)`）。
- 用法：
  ```
  python solve_v190.py "<payload>"
  # 或 IDE 里直接运行（文件内嵌示例 payload）
  ```
- 读取同目录 `fixed_fp_*.b64`；文件缺失会报错提示先跑 extract。
- 内部 `solve(payload, frame_nonce=None, elapsed=None)` 可传入指定 frameNonce/耗时用于复现调试。

### 6.4 v1.8.0 JS 参考实现

- **`reimpl.js`**：与真实 VM 逐字节一致的纯 JS 还原（含 `seal/decryptSeal/sealBytes/solve` 等，`module.exports` 导出），是 Python 移植的基准；文件底部有一段可直接 `node reimpl.js` 自测。
- **`solve.js`**：v1.8.0 离线 u 求解器 CLI 版（读 `fixed_fp.b64`）：
  ```
  node solve.js "<payload>"
  ```
- **`solver.js`**：更早的纯算还原版本（233 行，含原理注释），已由 reimpl.js 取代，保留参考。
- **`source_names.js`**：57 个指纹组件源名（aJ 表），v1.8.0 从零序列化时需要；离线固定指纹方案不依赖它。
- **`bundle.js`**：v1.8.0 构建 bundle，暴露 `__VM_EXPORTS__`，作为 JVO1 解码宿主（decode/disasm 用它解任何同版本构建）。
- **`test_final.js` / `verify_multi.js`**：多组测试向量下 VM 与 reimpl.js 的逐字节对比验证工具。

### 6.5 HTTP 全流程示例

**`test.py`**（v1.8.0 求解器）/ **`test2.py`**（v1.9.0 求解器）
- 完整链路：第一次 `create-token`（空）→ 498 取 challenge → `solve(challenge_payload)` 得 u → 第二次 `create-token` 提交 solution+meta → 200 取 `secureToken` → 用 cookie `x_wbaas_token=<secureToken>` 请求真实接口。
- 注意：`test.py` 的 `scriptPath/name` 是 v1.8.0_b67278fc（旧构建占位），`test2.py` 是 v1.9.0；**必须与 `create-token` 实际返回的 scriptPath 一致**，建议运行时从响应动态读取而不是硬编码。
- 要真正过 WAF，需把 `requests` 换成 `curl_cffi` 并 `impersonate="chrome"`（代码中已留注释位）。

---

## 7. 指纹生成流程（采集 → 明文 → 固定指纹）

```
浏览器                            Python
─────────────────────────────────────────────────────────────
1. create-token 取 scriptPath/payload
2. capture_fp.js 填入两者并运行
   → 打印 __CAPTURE__（payload + u）
3. 复制 __CAPTURE__  ──────────►  4. 粘入 extract_fixed_*.py 的 _RAW
                                   5. python extract_fixed_*.py
                                      ├─ 解封 u → 指纹明文（如 14818B）
                                      ├─ 重密封校验 == 真实 u（MAC OK）
                                      └─ 自动写 fixed_fp_*.b64（单行 base64）
6. python solve_*.py "<新 payload>"  → 输出新 u（离线重密封）
```

要点：
- 指纹明文与 challengeId **无关**，一份固定指纹可对任意新 challengeId 重密封。
- 但指纹与环境（浏览器版本/渲染结果）绑定：换浏览器/换机建议重新采集。
- 采集的 payload 与 u 必须来自**同一次** capture（脚本会校验 MAC 防止错配）。
- 构建轮换后 `challengeName` 会变，必须用对应版本的 extract/solve（v1.8.0 与 v1.9.0 脚本独立）。

---

## 8. 重要经验与注意事项

1. **构建轮换**：`create-token` 返回的 `scriptPath` 决定当前构建。换构建后常量/密码学全变，需重新逆向（本目录两套脚本各自对应）。
2. **密码学转录易错**：字节码反汇编人工转写很容易抄错操作数/运算符（本次 t18 就是例子）。**强烈建议用真实 u 做逐字节验证**，或用迷你解释器直接执行真实字节码做中间值对照。
3. **指纹环境绑定**：固定指纹来自采集时的浏览器（Chrome 151 等）。若请求的 IP/UA/TLS 指纹与指纹/secureToken 不一致，ck 会被判不可信。
4. **TLS/HTTP2 指纹**：`requests` 的 TLS 指纹与 Chrome 差异大，务必用 `curl_cffi` 的 `impersonate="chrome"`（或对应版本）发起请求。
5. **secureToken → ck**：create-token 200 返回的是 `secureToken`（内部含 IP+UA），还需后续步骤换成 `ck` cookie；不要只停在 create-token。
6. **时间线一致性**：`u` 里的 `elapsed` 与 `meta.marks` 时间戳要保持合理（求解耗时不能为 1ms 这种不真实值），且 frameNonce 时间与提交时间接近。

---

## 9. 附：v1.9.0 关键算法速查（solve_v190.py 核心）

```python
# 密钥派生 gw
seed = (2166136261 ^ nonce ^ serialized_len ^ A3) & 0xFFFFFFFF
h = gv(seed, challenge_id); h = (h ^ 2779096485) & 0xFFFFFFFF; h = gv(h, clls)
pO = (h ^ rotl32(serialized_len, 11) ^ rotl32(A3, 17)) & 0xFFFFFFFF

# 状态 s2..s9（gx），注意旋转 16/6/16
# 每块密钥流（p6）
t12 = (pX + 2) & 7;  t14 = (pX + 3) & 7;  t22 = (pX + s5 + 3) & 7
t16 = ((s2 ^ s3) + (s4 ^ s5) + pX) & 15
t18 = ((s2 + s4) + s5 + pX) & 15          # 更新后的 s2！
ks  = ((s2 + (s4 ^ t23)) & 0xFFFFFFFF) ^ (s3 >> 2)
# 反馈：s6+s30+s5 / s7^s30^s2^s4 / s8+s30+s3+pX / s9^((s6+s8+s4)>>>0) / s5=s30+s3+s4
```
