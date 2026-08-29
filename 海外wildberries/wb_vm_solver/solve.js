"use strict";
/**
 * WB antibot 离线 u 求解器（构建 challenge_vm_fp_v1.8.0_25fd2657）
 * =========================================================
 * 原理：
 *   1. 从真实浏览器采集一次指纹 → 解密真实 u → 得到固定指纹的【序列化字节】(fixed_fp.b64)
 *   2. 任意新 payload（新 challengeId/clls），用同样的固定字节 + 新 key 重新密封 → u
 *   u = String(elapsed) + "|" + base64(frameNonce(4) + 密文 + MAC(16))
 *
 * 用法：
 *   node solve.js "<payload>"
 *   # 或
 *   node -e "console.log(require('./solve.js').solve('<payload>'))"
 *
 * 注意：固定指纹来自你采集时的浏览器环境；纯 HTTP 请求必须用 curl_cffi 等把 TLS/UA
 *       伪装成同一个 Chrome 151，否则服务器比对指纹会拒绝。
 */

const fs = require("fs");
const path = require("path");
const re = require(path.join(__dirname, "reimpl.js"));

// 固定指纹序列化字节（来自真实浏览器采集 + 解密真实 u）
let FIXED_BYTES = null;
function getFixedBytes() {
  if (FIXED_BYTES) return FIXED_BYTES;
  const b64 = fs.readFileSync(path.join(__dirname, "fixed_fp.b64"), "utf8").trim();
  FIXED_BYTES = Buffer.from(b64, "base64");
  return FIXED_BYTES;
}

// 对应 VM 里 gs(): frameNonce = (Date.now() ^ 358657350) >>> 0
const A_G = 358657350;

/**
 * 求解：payload -> u
 * @param {string} payload create-token 返回的 payload
 * @param {object} opts { frameNonce?, elapsed? } 可覆盖（测试用）
 */
function solve(payload, opts = {}) {
  const { id, clls } = re.parsePayload(payload);
  const fixed = getFixedBytes();
  const t0 = Date.now();
  const nonce = opts.frameNonce !== undefined ? opts.frameNonce >>> 0 : (Date.now() ^ A_G) >>> 0;
  const sealed = re.sealBytes(id, clls, fixed, nonce);
  const elapsed = opts.elapsed !== undefined ? opts.elapsed : Math.max(1, Math.round(Date.now() - t0));
  return String(elapsed) + "|" + re.bytesToB64(sealed);
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const payload = args.find(a => !a.startsWith("--"));
  if (!payload) {
    console.error('用法: node solve.js "<payload>"');
    process.exit(2);
  }
  // 支持 --frameNonce=xxx 便于验证
  let frameNonce;
  for (const a of args) {
    if (a.startsWith("--frameNonce=")) frameNonce = parseInt(a.split("=")[1], 10);
  }
  try {
    console.log(solve(payload, frameNonce !== undefined ? { frameNonce } : {}));
  } catch (e) {
    console.error("错误:", e.message);
    process.exit(1);
  }
}

module.exports = { solve, getFixedBytes };
