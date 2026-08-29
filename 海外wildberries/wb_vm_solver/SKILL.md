---
name: wb-challenge-re
description: Use when Wildberries (www.wildberries.ru / antibot.wildberries.ru) challenge builds rotate or update (challenge_vm_fp_v*.js), when a captured u no longer decrypts/reseals (build changed), or when asked to re-reverse / port / debug the offline u solver (solve*.py, extract_fixed*.py, fixed_fp*.b64). Provides the full step-by-step methodology: fetch+decode the JVO1 VM bundle, disassemble, locate the sealer, extract constants, port to Python, and verify byte-exact against a real captured u. Reference the two finished cases (v1.8.0_25fd2657, v1.9.0_029781bb) as worked examples.
---

# WB 挑战（JVO1 VM）逆向方法论

> 目标：WB 反爬挑战脚本 `challenge_vm_fp_vX.Y.Z_<hash>.js` 每次**构建轮换**都会换字节码常量与部分密码学。
> 本 skill 给出「换构建后如何重新逆向」的完整可执行流程，并附两个已完成的对照案例（v1.8.0 / v1.9.0）。
> 工程目录：`C:\Users\ds\Desktop\wb_vm_solver\`（README_逆向总结.md 有更完整的背景与最终文件清单）。

---

## 0. 何时触发 / 如何判断构建已轮换

- `create-token` 返回的 `challenge.scriptPath` 变了（例如 `v1.9.0_029781bb` → 新 hash）。
- 用旧版 `solve_*.py` 解新 payload 后，`extract_fixed_*.py` 报「重新密封比对不一致」。
- 用旧密码学解真实 `u`，明文头**不是 `56 46`（"VF"）**。

**判定脚本思路**：取旧版求解器的 `decrypt_seal`，对真实 u 前 60 个 base64 字符解一段，看明文头是否 `VF`；不是即密码学已变。

---

## 1. 取回新 bundle

- URL：`https://antibot.wildberries.ru/statics/<scriptPath 文件名>`。
- 保存到工程目录（如 `challenge_vm_fp_vX.Y.Z_<hash>.js`），并保留旧 bundle 作对照。

---

## 2. 解码 JVO1 字节码

JVO1 是自定义 VM：bundle 里一段 base64 → LZSS 解压 → 头 + 名字表 + 常量池 + 函数表 + 字节码。
同一 VM 框架下，解码函数名字会被 minify 重排，有两种解码路径：

### 路径 A：bundle 自带 `__VM_EXPORTS__`（v1.8.0 这类）
直接 `require(bundle.js)`，用 `globalThis.__VM_EXPORTS__` 的解码 API：
```
Zn(vi) 解压 → Wi(raw, Ji) → ne 读头 → Xo 全量解码 → {names, constants, functions, bytecode}
```
产物：`decoded.json`。

### 路径 B：bundle 不再导出内部函数（v1.9.0 这类）
新 bundle 只暴露 `{bundle, getExported, run}`，且 `we/jB/bB/Ne` 等标记名已失去原含义。
**解法：给 bundle 源码打补丁**，在唯一锚点 `return z.o` 前注入导出：
```js
try{z.o.__Xo=Xo}catch(e){} try{z.o.__No=No}catch(e){} ... // 逐个 try/catch，名字猜错也不崩
```
然后用它自己的解码 API 解自己：
```
jn(base64) → KB(LZSS 解压) → ne(读头) → VB(构建运行时) → Xs(全量解码)
Xs(dec, { uniqueBuildRuntime: VB(dec), Or: true, xA: true })
  → { FD: {namePool, constantPool}, functions, yL }
```
- `Or:true / xA:true` 是反汇编选项（对应字节码错误 E120/E121），解码时必传。
- 产物：`decoded_v*.json`（v1.9.0 为 1291 名字 / 1410 常量 / 483 函数 / 26417 指令）。

---

## 3. 反汇编

- 复用 `disasm` 逻辑（把 `{names, constants, functions, bytecode}` 格式化成可读文本）。
- **函数区间语义注意**：v1.9.0 函数表字段 `oy`=起始、`Nt`=**结束下标**（不是长度！），区间为 `[oy, Nt)`。用错会导致反汇编无限膨胀。

---

## 4. 定位密封相关函数

字节码里函数名随构建变化但**模式固定**，按「哈希 / 密钥派生 / 状态初始化 / cipher / writer / MAC / 序列化 / frameNonce」的特征定位：

| 角色 | v1.8.0 | v1.9.0 |
|---|---|---|
| 字符串哈希（FNV 变体：^char&255; h+(h<<5)>>>0+(h>>>2)+2654435769; rotl7） | `go` | `gv` |
| 密钥派生（2166136261 ^ pB ^ pC ^ A3；gv(seed,id)；^2779096485；gv(h,clls)；^rotl(len,11)^rotl(A3,17)） | `gp` | `gw` |
| 状态初始化 s2..s9（createSealer） | `gq`（+pL/pM/pN） | `gx`（+p6/p7/p8） |
| 每块密钥流 + 反馈 | `pL` | `p6` |
| 字节写入器（4 字节块累积） | `pM` | `p7` |
| MAC finalize（w1..w4，16B） | `pN` | `p8` |
| 指纹序列化主函数（`w(18006,2)` 起头） | `gj` | `gq` |
| 组件写入器（status/duration/value 或 error） | `gi` | `gp` |
| LEB128 / 长度前缀字符串 / float64 | `fC`/`fK`/`fE` | `fJ`/`fR`/`fL` |
| frameNonce 生成（`(Date.now()^A_G)>>>0`，自增） | `gs`(A_G=358657350) | `gB`(A_G=1484301268) |
| sealBytes 主流程（u32 头 + gx 建状态 + 序列化 + MAC） | `gr/gt` | `gA/gC` |

> 注意：函数名是字节码内的名字，**不一定与 JS 模块级变量一致**（v1.9.0 里 `gr/gs` 会撞上框架同名变量）。
> 定位后直接看反汇编，不要试图从外部 JS 调用这些字节码函数。

---

## 5. 提取常量

常量表来自**字节码常量池**（`decoded_v*.json` 的 `constants`），不是 JS 源码字面量。

需要提取的常量（对照两版差异表见 README_逆向总结.md）：
- 4 张查表：`AO[8] / AP[16] / AQ[16] / AR[8]`（v1.9.0 为 `aO/aP/aQ/aR`）。
- 密钥派生常量 `A3`（v1.8.0=1796158859；v1.9.0=`a6`=698019239）。
- frameNonce 异或常量 `A_G`（v1.8.0=358657350；v1.9.0=`aG`=1484301268）。
- 状态初始化配对常量 `aV..aZ` 及其 XOR 掩码（v1.9.0）。
- 每块掩码 基+乘数：t13 `(1533342475,381634453)`、t15/t23 `(803359278,1963635215)`、t17 `(945755024,4172540785)`、t19 `(3645158977,2671332691)`。
- MAC 各词 XOR 常量与旋转量。
- 序列化头常量 `18006`（=0x4656，小端 2 字节即 "VF"）。

提取技巧：
- 顶层程序（function 0）里一堆 `assign <name>`，前一指令是 `const <id>` / `lit <v>`，从 `constants[id]` 取值。
- 用脚本按 `constIds` 展开数组常量，避免手抄出错。

---

## 6. 移植到 Python

保持 v1.8.0 与 v1.9.0 **两套独立文件**，互不影响：
- `solve_v*.py`：`u32/rotl32`、常量、`gv`(哈希)、`gw`(密钥派生)、`Sealer`(状态+cipher+writer+MAC)、`seal_bytes`、`decrypt_seal`、`parse_payload`、`solve(payload, frame_nonce=None, elapsed=None)`、frameNonce 生成。
- `extract_fixed_v*.py`：粘贴 `__CAPTURE__` → 解封 → 重密封校验 → 自动写 `fixed_fp_v*.b64`。
- `fixed_fp_v*.b64`：指纹明文 base64（单行）。

**幂等自测**：先做「往返」——随机明文(带 VF 头) → seal → decrypt → 应一致、长度 `4+len+16`。往返通过只说明内部一致，**不代表与真实构建一致**。

---

## 7. 验证（最关键，必须用真实 u）

1. **采集**：浏览器跑 `capture_fp.js`（SCRIPT_PATH/PAYLOAD 填最新），得 `__CAPTURE__ = {challengeName, payload, u}`。
2. **解封**：`decrypt_seal` → 明文头应为 `56 46 05 35 2e 32 2e 30` = `VF` + LEB128(5) + `"5.2.0"` + LEB128(36)。
3. **重密封**：`seal_bytes` 与真实 u 的 sealed 逐字节相等（MAC: OK）。
4. 通过后：`extract_fixed_v*.py` 写 `fixed_fp_v*.b64`；`solve_v*.py` 出新 u，再解回应与指纹一致。

**排错（转录错误定位法）——重点**：
- 用「明文头 `VF\x05 5.2.0` 反推第 0 块应有密钥流」：`expected_ks0 = ct0 ^ 0x35054656`。
- 若与 Python 算的 ks0 不符，**写一个迷你栈式解释器直接执行真实 p6 字节码**（注入状态，逐条 opcode 执行），拿到真实中间值（t13/t15/t16/t17/s2'/t18/t19/ks）。
- 逐条对照解释器输出与 Python 中间值，**第一个不一致处就是转录错误**。
- 案例：v1.9.0 的 `t18` 被误写成 `(s4^s5)+s3+pX`，真实是 `((s2+s4)+s5+pX)&15`（用更新后的 s2、全加法、用 s4/s5 不用 s3）。解释器算出的 `ks0=0x77b1c97d` 与期望一致，从而锁定 bug 在 t18。

---

## 8. 交付清单（换构建后应产出）

- [ ] `challenge_vm_fp_vX.Y.Z_<hash>.js`（新 bundle，保留旧版）
- [ ] `solve_v*.py` + `extract_fixed_v*.py`（新密码学）
- [ ] `fixed_fp_v*.b64`（新指纹，14818 字节左右 / 36 组件 / version 5.2.0）
- [ ] 用真实 u 验证：明文头 `VF...` + 重密封 MATCH（必须为 True）
- [ ] HTTP 流程脚本 `test*.py` 的 `scriptPath/name` 更新为当前构建

---

## 9. 常见坑

1. **转录易错**：操作数顺序、`+`/`^`、用哪个 slot、是否「更新后」的 s2 等——一律以真实字节码 + 迷你解释器为准，别信人工转写。
2. **函数区间**：`oy`=起始，`Nt`=结束下标（`[oy,Nt)`），不是长度。
3. **frameNonce 与 marks 时间线**：`u` 的 elapsed、frameNonce 时间、`meta.marks` 时间戳要合理且接近提交时间。
4. **环境绑定**：固定指纹绑定采集时的浏览器/IP/UA；请求须用 curl_cffi `impersonate="chrome"` 匹配 TLS/HTTP2 指纹，且 IP/UA 一致，否则 ck 不可信。
5. **secureToken ≠ ck**：create-token 200 只返回 `secureToken`（内含 IP+UA），后续用 cookie `x_wbaas_token=<secureToken>` 调真实接口。
6. **scriptPath 动态读取**：提交的 `challenge.scriptPath/name` 必须取 `create-token` 响应当前的，别硬编码。
7. **解码选项**：v1.9.0 全量解码需 `{uniqueBuildRuntime, Or:true, xA:true}`，缺 `Or/xA` 会报 E120/E121。

---

## 10. 参考文件（工程目录 C:\Users\ds\Desktop\wb_vm_solver）

- `README_逆向总结.md`：完整背景、协议、两版密码学差异表、文件清单。
- `solve.py` / `extract_fixed.py` / `fixed_fp.b64`：v1.8.0 已交付。
- `solve_v190.py` / `extract_fixed_v1.9.0.py` / `fixed_fp_v1.9.0.b64`：v1.9.0 已交付。
- `reimpl.js` / `solve.js` / `solver.js` / `source_names.js`：v1.8.0 JS 参考（seal/decryptSeal 权威实现）。
- `bundle.js`：v1.8.0 bundle（JVO1 解码宿主）。
- `capture_fp.js`：浏览器采集脚本。
- `test.py` / `test2.py`：HTTP 全流程示例（含 x_wbaas_token 用法）。
