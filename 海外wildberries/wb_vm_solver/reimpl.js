"use strict";
/**
 * challenge_vm_fp_v1.8.0_25fd2657 纯 JS 等价还原（脱离 VM，逐字节验证）
 * ==============================================================
 * 已通过真实 VM 测试向量逐字节验证（含多组 challengeId/frameNonce）。
 *
 * 协议：
 *   调用 window[Symbol.for("1343830250")](payload) → u
 *   payload = <marker> + base64( part0 + "." + base64( UTF8(JSON{id,clls}) ) )
 *   u = String(elapsedMs) + "|" + base64( sealed )
 *   sealed = frameNonce_u32_LE(4) + 密文 + MAC(16)
 *   密文 = 指纹序列化字节 XOR 密钥流（自定义 SHA-256 变体）
 */

const u32 = (x) => x >>> 0;
const rotl32 = (x, n) => u32((x << n) | (x >>> (32 - n)));

// ---- 常量表（来自字节码常量池）----
const AO = [506037737, 1380525555, 1481123111, 2144274173, 4256830938, 319283536, 2052269474, 1103931820];
const AP = [2221413526, 337464729, 878936712, 1322708464, 1970579571, 125091323, 3249788392, 3594322204,
  1730408, 3288845640, 671832838, 1983988634, 280125792, 745802730, 4224876618, 674815678];
const AQ = [3517948609, 3730247009, 2046577556, 1324486146, 3343993857, 2844232229, 1658723780, 2224498283,
  503085645, 1953420943, 603287083, 3400961923, 797212334, 129712255, 3087241547, 480664648];
const AR = [2635912526, 919394836, 1249444562, 3409935095, 3654076373, 558841405, 2902322402, 3319725996];
const A3 = 1796158859;
const A2 = 4;

// ---- 字符串哈希 go(px, py)（自定义 FNV 变体）----
function go(px, py) {
  let h = u32(px);
  for (let i = 0; i < py.length; i++) {
    h ^= (py.charCodeAt(i) & 255);
    h = u32(h + u32(h << 5) + (h >>> 2) + 2654435769);
    h = u32(rotl32(h, 7));
  }
  return h;
}

// ---- 密钥派生 gp(challengeId, clls, frameNonce, serializedLen) ----
function gp(pz, pA, pB, pC) {
  let h = u32(go(u32(2166136261 ^ pB ^ pC ^ A3), pz) ^ 2779096485);
  h = go(h, pA);
  return u32(h ^ rotl32(u32(pC), 11) ^ rotl32(A3, 17));
}

// ---- 密封器（对应字节码 gq/pL/pM/pN）----
function createSealer(out, challengeId, clls, frameNonce, serializedLen) {
  const pO = gp(challengeId, clls, frameNonce, serializedLen);
  const state = {
    s2: u32((1835258167 ^ 2213876847) ^ pO ^ serializedLen),   // pP
    s3: u32((829809575 ^ 1462419888) + frameNonce + rotl32(pO, 15)), // pQ
    s4: u32((2189847915 ^ 710962929) ^ rotl32(serializedLen, 24)),   // pR
    s5: u32(pO ^ (2697922674 ^ 4254473266)),                          // pS
    s6: u32(pO ^ (3698997261 ^ 3064996804)),                          // pT
    s7: u32((2126702976 ^ 1420962161) + serializedLen),               // pU
    s8: u32(frameNonce ^ (761070724 ^ 4071894814)),                   // pV
    s9: u32((1322732482 ^ 2427860171) + rotl32(pO, 18)),              // pW
  };
  let pX = 0, pY = 0, pZ = 0, p0 = 0, p1 = false;

  function pL(block, count) {
    let s2 = state.s2, s3 = state.s3, s4 = state.s4, s5 = state.s5, s6 = state.s6, s7 = state.s7, s8 = state.s8, s9 = state.s9;
    const t12 = (pX + 7) & 7;
    const t13 = u32(AO[((t12 * 5 + 3) & 7)] ^ (1842276411 + t12 * 2110078725));
    const t14 = (pX + 6) & 7;
    const t15 = u32(AR[((t14 + 4) & 7)] ^ (3340988254 + t14 * 3750563199));
    const t16 = (s2 + (s5 ^ s3) + pX) & 15;
    const t17 = u32(AP[((t16 * 15 + 10) & 15)] ^ (2192809920 + t16 * 2274619873));
    s2 = u32(s2 + t17 + t13 + pX);
    s2 = u32(s2 ^ u32(s2 << 3) ^ (s2 >>> 9));
    const t18 = ((s4 ^ s5) + s3 + pX) & 15;
    const t19 = u32(AQ[((t18 * 7 + 5) & 15)] ^ (1248962321 + t18 * 835872739));
    s3 = u32(s3 + t19 + s5);
    s3 = u32(s3 ^ (s3 >>> 7));
    s4 = u32(rotl32(u32(s2 + t15), 24) ^ s4);
    const t22 = (pX + s5 + 6) & 7;
    const t23 = u32(AR[((t22 + 4) & 7)] ^ (3340988254 + t22 * 3750563199));
    const ks = u32(s2 ^ rotl32(s3, 15) ^ s4 ^ t23);
    const ct = u32(block ^ ks);
    const idx = 4 + pX * 4;
    out[idx] = ct & 255;
    if (count > 1) out[idx + 1] = (ct >>> 8) & 255;
    if (count > 2) out[idx + 2] = (ct >>> 16) & 255;
    if (count > 3) out[idx + 3] = (ct >>> 24) & 255;
    const mask = count === 4 ? 0xFFFFFFFF : u32(1 << (count * 8)) - 1;
    const s30 = u32(ct & mask);
    s6 = u32(s6 + s30 + s2);
    s7 = u32(s7 ^ s30 ^ s3);
    s8 = u32(s8 + (s30 ^ s5) + pX);
    s9 = u32(s9 ^ u32(s8 + s4));
    s5 = u32(s30 + (s2 ^ s3) + pX);
    pX = u32(pX + 1);
    state.s2 = s2; state.s3 = s3; state.s4 = s4; state.s5 = s5;
    state.s6 = s6; state.s7 = s7; state.s8 = s8; state.s9 = s9;
  }

  // writer pM(value, byteCount)：按 4 字节块吸收进 pL
  function pM(value, byteCount) {
    let v = u32(value);
    if (p0 === 0 && byteCount === A2) {
      pL(v, A2);
      pY += byteCount;
      return byteCount;
    }
    let acc = pZ;
    let n = byteCount;
    let pos = p0;
    while (n > 0) {
      let chunk = A2 - pos;
      if (n < chunk) chunk = n;
      const cnt = chunk;
      const mask = cnt === A2 ? 0xFFFFFFFF : u32(1 << (cnt * 8)) - 1;
      acc = u32(acc | ((v & mask) << (pos * 8)));
      v = cnt === A2 ? 0 : v >>> (cnt * 8);
      pos += cnt;
      n -= cnt;
      if (pos === A2) { pL(acc, A2); acc = 0; pos = 0; }
    }
    pY += byteCount;
    pZ = acc; p0 = pos;
    return byteCount;
  }

  // finalize pN()：补零吸收 + 输出 16 字节 MAC
  function pN() {
    if (p1) throw new Error("sealing writer is already finished");
    if (pY !== serializedLen) throw new Error("sealing payload underflow");
    if (p0 > 0) { pL(pZ, p0); pZ = 0; p0 = 0; }
    if (Math.ceil(serializedLen / A2) !== pX) throw new Error("sealing word count mismatch");
    const s6 = state.s6, s7 = state.s7, s8 = state.s8, s9 = state.s9, s5 = state.s5;
    let w1 = u32(s6 ^ serializedLen ^ pO ^ u32(AR[4] ^ 3340988254));
    let w2 = u32(s7 + frameNonce + rotl32(w1, 27) + u32(AR[5] ^ 2796584157));
    let w3 = u32(s8 ^ rotl32(u32(w2 + serializedLen), 15) ^ u32(AR[6] ^ 2252180060));
    let w4 = u32(s9 + rotl32(u32(w3 ^ pO), 24) + u32(AR[7] ^ 1707775963));
    w1 = u32(w1 + rotl32(u32(w4 ^ frameNonce), 18) + u32(AR[0] ^ 1163371866));
    const base = 4 + serializedLen;
    out[base] = w1 & 255; out[base + 1] = (w1 >>> 8) & 255; out[base + 2] = (w1 >>> 16) & 255; out[base + 3] = (w1 >>> 24) & 255;
    out[base + 4] = w2 & 255; out[base + 5] = (w2 >>> 8) & 255; out[base + 6] = (w2 >>> 16) & 255; out[base + 7] = (w2 >>> 24) & 255;
    out[base + 8] = w3 & 255; out[base + 9] = (w3 >>> 8) & 255; out[base + 10] = (w3 >>> 16) & 255; out[base + 11] = (w3 >>> 24) & 255;
    out[base + 12] = w4 & 255; out[base + 13] = (w4 >>> 8) & 255; out[base + 14] = (w4 >>> 16) & 255; out[base + 15] = (w4 >>> 24) & 255;
    p1 = true;
  }

  return { pM, pN, state, get pX() { return pX; } };
}

function fB(a, b) { return b; }   // 长度模式 writer

// ---- LEB128 变长整数：fC(writer, n) ----
function fC(w, n) {
  let v = u32(n), acc = 0, shift = 0, total = 0;
  for (;;) {
    if (v >= 128) {
      acc |= ((v & 127) | 128) << (shift * 8);
      shift++; v >>>= 7;
      if (shift === 4) { total += w(acc, 4); acc = 0; shift = 0; }
    } else {
      acc |= v << (shift * 8);
      total += w(acc, shift + 1);
      break;
    }
  }
  return total;
}

// ---- UTF-8 字节长度 ----
function utf8Len(s) {
  let n = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c < 0x80) n += 1;
    else if (c < 0x800) n += 2;
    else if (c >= 0xD800 && c <= 0xDBFF) { n += 4; i++; }
    else n += 3;
  }
  return n;
}

// ---- 写 UTF-8 字节：fJ(writer, s) ----
function fJ(w, s) {
  let total = 0, i = 0;
  while (i < s.length) {
    const c = s.charCodeAt(i);
    if (c < 0x80) {
      let acc = c, cnt = 1;
      while (cnt < 4 && i + cnt < s.length && s.charCodeAt(i + cnt) < 0x80) {
        acc |= s.charCodeAt(i + cnt) << (cnt * 8);
        cnt++;
      }
      total += w(acc, cnt);
      i += cnt;
    } else if (c < 0x800) {
      total += w(((192 | (c >>> 6)) | ((128 | (c & 63)) << 8)), 2);
      i++;
    } else if (c >= 0xD800 && c <= 0xDBFF) {
      const cp = 0x10000 + ((c - 0xD800) << 10) + (s.charCodeAt(i + 1) - 0xDC00);
      total += w((0xF0 | (cp >>> 18)) | ((0x80 | ((cp >>> 12) & 63)) << 8) | ((0x80 | ((cp >>> 6) & 63)) << 16) | ((0x80 | (cp & 63)) << 24), 4);
      i += 2;
    } else {
      total += w((0xE0 | (c >>> 12)) | ((0x80 | ((c >>> 6) & 63)) << 8) | ((0x80 | (c & 63)) << 16), 3);
      i++;
    }
  }
  return total;
}

// ---- 长度前缀字符串：fK(w, s) = varint(utf8len) + utf8 ----
function fK(w, s) {
  const str = String(s);
  const len = utf8Len(str);
  if (len > 65536) throw new Error("str");
  const prefix = fC(w, len);
  if (w === fB) return prefix + len;
  return prefix + fJ(w, str);
}

// ---- float64 写入：fE(w, n) = 8 字节（两个 4 字节字）----
const _f64buf = new ArrayBuffer(8);
const _f64dv = new DataView(_f64buf);
function fE(w, n) {
  if (typeof n !== "number" || !isFinite(n)) throw new Error("num");
  _f64dv.setFloat64(0, n, true);
  return w(_f64dv.getUint32(0, true), 4) + w(_f64dv.getUint32(4, true), 4);
}

// ---- 错误码映射：gh(w, errorCode) ----
function gh(w, code) {
  if (code === "source_error") return fC(w, 3);
  if (code === "contract_mismatch") return fC(w, 2);
  return fC(w, 1);
}

// ---- 组件值写入：gi(writer, componentWriter, value) ----
// 组件值为 {status:"ok", duration, value} 或 {status, duration, errorCode, error}
function gi(w, writer, value) {
  if (value && value.status === "ok") {
    return fC(w, 1) + fE(w, value.duration) + writer(w, value.value);
  }
  return fC(w, 2) + fE(w, value.duration) + gh(w, value.errorCode) + fK(w, value.error);
}

// ---- 指纹序列化 gj(writer, {version, components}) → 字节数 ----
function gj(w, fp, sourceNames, componentWriters) {
  const components = fp.components;
  let len = w(18006, 2) + fK(w, fp.version);
  let count = 0;
  for (let i = 0; i < sourceNames.length; i++) {
    if (Object.prototype.hasOwnProperty.call(components, sourceNames[i])) count++;
  }
  len += fC(w, count);
  for (let i = 0; i < sourceNames.length; i++) {
    const name = sourceNames[i];
    if (Object.prototype.hasOwnProperty.call(components, name)) {
      len += fC(w, i + 1) + gi(w, componentWriters[name], components[name]);
    }
  }
  if (len > 1048576) throw new Error("size");
  return len;
}

// ---- 密封主流程（对应 gr/gt）----
function seal(challengeId, clls, normalizedFingerprint, frameNonce, sourceNames, writers) {
  const componentWriters = writers || {};
  const serializedLen = gj(fB, normalizedFingerprint, sourceNames, componentWriters);
  const out = new Uint8Array(4 + serializedLen + 16);
  const fn = frameNonce >>> 0;
  out[0] = fn & 255; out[1] = (fn >>> 8) & 255; out[2] = (fn >>> 16) & 255; out[3] = (fn >>> 24) & 255;
  const { pM, pN } = createSealer(out, challengeId, clls, fn, serializedLen);
  const len2 = gj(pM, normalizedFingerprint, sourceNames, componentWriters);
  if (len2 !== serializedLen) throw new Error("sealing payload length mismatch");
  pN();
  return out;
}

// ---- base64（对应 a9）----
function bytesToB64(bytes) {
  let s = "";
  for (let i = 0; i < bytes.length; i += 8192) {
    s += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192));
  }
  return typeof btoa === "function" ? btoa(s) : Buffer.from(s, "binary").toString("base64");
}

// ---- payload 解析（对应 fz/fx）----
function parsePayload(payload) {
  if (typeof payload !== "string" || payload.length < 2) throw new Error("Challenge payload is invalid.");
  let decoded;
  try { decoded = Buffer.from(payload.slice(1), "base64").toString("utf8"); } catch (e) { throw new Error("Challenge payload is invalid."); }
  const parts = decoded.split(".");
  const jsonStr = parts[1];
  if (typeof jsonStr !== "string" || jsonStr.length === 0) throw new Error("Challenge payload is invalid.");
  let obj;
  try { obj = JSON.parse(Buffer.from(jsonStr, "base64").toString("utf8")); } catch (e) { throw new Error("Challenge payload is invalid."); }
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) throw new Error("Challenge payload is invalid.");
  if (typeof obj.id !== "string" || obj.id.length === 0 || /[^\x00-\x7f]/.test(obj.id)) throw new Error("Challenge payload is invalid.");
  if (obj.clls !== undefined && typeof obj.clls !== "string") throw new Error("Challenge payload is invalid.");
  return { id: obj.id, clls: obj.clls || "" };
}

// ---- frameNonce（对应 gs）----
function frameNonceGen(a4) {
  let state = a4;
  return function () {
    if (state === null) state = (Date.now() >>> 0) ^ 358657350;
    const v = state;
    state = u32(state + 1);
    return v;
  };
}

// ---- 解密 sealed（逆向 pL 密钥流，用于验证/提取明文指纹）----
function decryptSeal(challengeId, clls, sealedBytes) {
  const frameNonce = sealedBytes.readUInt32LE ? sealedBytes.readUInt32LE(0)
    : (sealedBytes[0] | sealedBytes[1] << 8 | sealedBytes[2] << 16 | sealedBytes[3] << 24) >>> 0;
  const total = sealedBytes.length - 4 - 16;   // 密文长度 = 总长 - 4 - MAC16
  const plain = new Uint8Array(total);
  const sealer = createSealer(plain, challengeId, clls, frameNonce, total);

  // 逐块解密：state 只由密文反馈，可正向推进
  let off = 4;
  let block = 0;
  while (off < 4 + total) {
    const remain = 4 + total - off;
    const cnt = remain >= 4 ? 4 : remain;
    // 取出该块密文字节
    let ct = 0;
    for (let k = 0; k < cnt; k++) ct |= sealedBytes[off + k] << (8 * k);
    ct >>>= 0;
    // 计算当前密钥流字并还原明文
    const ks = keystreamFor(sealer, block);
    const pt = u32(ct ^ ks);
    // 明文块回灌（触发 pL 状态更新 + 写回）
    sealer.pM(pt, cnt);
    for (let k = 0; k < cnt; k++) plain[off - 4 + k] = (pt >>> (8 * k)) & 255;
    off += cnt;
    block++;
  }
  return { frameNonce, plaintext: plain, mac: sealedBytes.slice(sealedBytes.length - 16) };
}

// 计算当前块密钥流（pL 内部逻辑，不写密文）
function keystreamFor(sealer, block) {
  const s = sealer.state;
  let s2 = s.s2, s3 = s.s3, s4 = s.s4, s5 = s.s5;
  const pX = sealer.pX;
  const t12 = (pX + 7) & 7;
  const t13 = u32(AO[((t12 * 5 + 3) & 7)] ^ (1842276411 + t12 * 2110078725));
  const t14 = (pX + 6) & 7;
  const t15 = u32(AR[((t14 + 4) & 7)] ^ (3340988254 + t14 * 3750563199));
  const t16 = (s2 + (s5 ^ s3) + pX) & 15;
  const t17 = u32(AP[((t16 * 15 + 10) & 15)] ^ (2192809920 + t16 * 2274619873));
  s2 = u32(s2 + t17 + t13 + pX);
  s2 = u32(s2 ^ u32(s2 << 3) ^ (s2 >>> 9));
  const t18 = ((s4 ^ s5) + s3 + pX) & 15;
  const t19 = u32(AQ[((t18 * 7 + 5) & 15)] ^ (1248962321 + t18 * 835872739));
  s3 = u32(s3 + t19 + s5);
  s3 = u32(s3 ^ (s3 >>> 7));
  s4 = u32(rotl32(u32(s2 + t15), 24) ^ s4);
  const t22 = (pX + s5 + 6) & 7;
  const t23 = u32(AR[((t22 + 4) & 7)] ^ (3340988254 + t22 * 3750563199));
  return u32(s2 ^ rotl32(s3, 15) ^ s4 ^ t23);
}

// ---- 密封已知明文字节（离线复用固定指纹序列化字节）----
function sealBytes(challengeId, clls, plaintextBytes, frameNonce) {
  const serializedLen = plaintextBytes.length;
  const out = new Uint8Array(4 + serializedLen + 16);
  const fn = frameNonce >>> 0;
  out[0] = fn & 255; out[1] = (fn >>> 8) & 255; out[2] = (fn >>> 16) & 255; out[3] = (fn >>> 24) & 255;
  const { pM, pN } = createSealer(out, challengeId, clls, fn, serializedLen);
  let off = 0;
  while (off < serializedLen) {
    const cnt = Math.min(4, serializedLen - off);
    let v = 0;
    for (let k = 0; k < cnt; k++) v |= plaintextBytes[off + k] << (8 * k);
    v >>>= 0;
    pM(v, cnt);
    off += cnt;
  }
  pN();
  return out;
}

// ---- 完整求解（对应 gu）----
function solve(payload, normalizedFingerprint, opts = {}) {
  const { sourceNames, componentWriters, now } = opts;
  const { id, clls } = parsePayload(payload);
  const t0 = Date.now();
  const nonce = (now !== undefined ? now : (Date.now() >>> 0) ^ 358657350) >>> 0;
  const sealed = seal(id, clls, normalizedFingerprint, nonce, sourceNames, componentWriters);
  const elapsed = Math.max(0, Math.round(Date.now() - t0));
  return String(elapsed) + "|" + bytesToB64(sealed);
}

// ---- 单参数 drop-in 入口（等价 window[Symbol.for(...)](payload)）----
// 指纹（normalizedFingerprint）需从真实浏览器采集一次后注入，默认用空指纹。
const DEFAULT_SOURCE_NAMES = require("./source_names.js");
let _fp = { version: "5.2.0", components: {} };
let _writers = {};
let _sourceNames = DEFAULT_SOURCE_NAMES;

function setFingerprint(fp) { _fp = fp; }
function setComponentWriters(w) { _writers = w; }

function solveChallenge(payload) {
  const { id, clls } = parsePayload(payload);
  const t0 = Date.now();
  const nonce = (Date.now() >>> 0) ^ 358657350;
  const sealed = seal(id, clls, _fp, nonce, _sourceNames, _writers);
  const elapsed = Math.max(0, Math.round(Date.now() - t0));
  return String(elapsed) + "|" + bytesToB64(sealed);
}

function makeSolver(opts = {}) {
  if (opts.fingerprint) _fp = opts.fingerprint;
  if (opts.componentWriters) _writers = opts.componentWriters;
  if (opts.sourceNames) _sourceNames = opts.sourceNames;
  return function (payload) {
    const { id, clls } = parsePayload(payload);
    const t0 = Date.now();
    const nonce = (Date.now() >>> 0) ^ 358657350;
    const sealed = seal(id, clls, _fp, nonce, _sourceNames, _writers);
    const elapsed = Math.max(0, Math.round(Date.now() - t0));
    return String(elapsed) + "|" + bytesToB64(sealed);
  };
}

module.exports = {
  u32, rotl32, go, gp, seal, sealBytes, createSealer, decryptSeal,
  gj, fC, fK, fJ, fE, gi, gh, utf8Len,
  bytesToB64, parsePayload, frameNonceGen, solve,
  solveChallenge, makeSolver, setFingerprint, setComponentWriters,
};


const payload = "4ZnBfdm0uZXlKMlpYSnphVzl1SWpveExDSjBhVzFsYzNSaGJYQWlPakUzT0Rjek1ETTBPVFk0T1RZc0ltbGtJam9pTlRnellXRTNPV0V0WVRsak1pMDBabVZtTFdGaFpqWXRaalpoTURJeFpEWmhZekpqSWl3aWFYQWlPaUl4TWpFdU16TXVNakEzTGpNMklpd2lkV0VpT2lKTmIzcHBiR3hoTHpVdU1DQW9WMmx1Wkc5M2N5Qk9WQ0F4TUM0d095QlhhVzQyTkRzZ2VEWTBLU0JCY0hCc1pWZGxZa3RwZEM4MU16Y3VNellnS0V0SVZFMU1MQ0JzYVd0bElFZGxZMnR2S1NCRGFISnZiV1V2TVRVeExqQXVNQzR3SUZOaFptRnlhUzgxTXpjdU16WWlMQ0p6YVhSbFMyVjVJam9pTnpRd01HSmtOV1JtT0dJNE5ETmlNamd5TlRRMk5UbG1NVEE1TVRWbU16RWlMQ0prWlhacFkyVlViMnRsYmlJNklpSXNJblZ6WlhKVFkyOXlaU0k2ZXlKb1lYTm9Jam9pSW4wc0luQnlaWFpwYjNWelZHOXJaVzRpT2lJaUxDSmhZM1JwYjI0aU9pSnlaWFZ6WVdKc1pTSXNJblJ2YTJWdVZIbHdaU0k2SWpJaUxDSnpZM1FpT2pFM09EY3pNRE0wT1RZNE9UWXNJbVp3YVdRaU9pSTFPRE5oWVRjNVlTMWhPV015TFRSbVpXWXRZV0ZtTmkxbU5tRXdNakZrTm1Gak1tTWlMQ0owYVNJNmV5SnBaQ0k2SW1JM01qQTFaakkwTTJGbU16UmhNVEU0WTJZMVltVXpPRGRrWkdGaVkyUTBJaXdpYlNJNklqRWlmU3dpWm1sa0lqb2lZekZsTXpNMFlUZ3RPV0l3TUMwMFkySmlMV0psWWpVdFpHTTJOV0k1TkdVNE9EYzNJaXdpY0dKeklqb3dMQ0p0ZEdSeklqb3dMQ0pqYkd4eklqb2laV1V3TnpSbU5qTmxZbU00WldVMk1DSXNJbTFwWkNJNkltWndYekl3TWpaZk1EaGZNVFJmTldFek5HUTJNRFlpZlE9PS4wNjUyNjQxNjk2YmQyZDdhMDIxZDZhYmY5ZDc1MGNmYTliN2RjOTQ4YmNlYzNiNDNkZmUxNDYwOTQ0ZTRhYzg2";
const u = solveChallenge(payload)
console.log(u);


