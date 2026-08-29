// SCRIPT_PATH和PAYLOAD需要抓包，接口是这个：/challenges/antibot/api/v1/create-token，第一次请求状态码为498请求里面对应的参数
// 但是这里参数全都可以固定，直接把这个脚本扔到浏览器跑，等几分钟返回的数据扔到extract_fixed.py中运行返回指纹
const BASE = "https://antibot.wildberries.ru";
const SCRIPT_PATH = "/statics/challenge_vm_fp_v1.9.0_029781bb.js";  // create-token 返回的 scriptPath 
const PAYLOAD = "TZnBfdm0uZXlKMlpYSnphVzl1SWpveExDSjBhVzFsYzNSaGJYQWlPakUzT0RjMk5EQXpOVGswTmpNc0ltbGtJam9pTlRjMlpURTNPREl0TVRNMVpDMDBObUkwTFRsallUVXRPVEl4Wm1WaFlUSm1PV0l5SWl3aWFYQWlPaUl4TWpFdU16TXVNakEzTGpNMklpd2lkV0VpT2lKTmIzcHBiR3hoTHpVdU1DQW9WMmx1Wkc5M2N5Qk9WQ0F4TUM0d095QlhhVzQyTkRzZ2VEWTBLU0JCY0hCc1pWZGxZa3RwZEM4MU16Y3VNellnS0V0SVZFMU1MQ0JzYVd0bElFZGxZMnR2S1NCRGFISnZiV1V2TVRVeExqQXVNQzR3SUZOaFptRnlhUzgxTXpjdU16WWlMQ0p6YVhSbFMyVjVJam9pTnpRd01HSmtOV1JtT0dJNE5ETmlNamd5TlRRMk5UbG1NVEE1TVRWbU16RWlMQ0prWlhacFkyVlViMnRsYmlJNklpSXNJblZ6WlhKVFkyOXlaU0k2ZXlKb1lYTm9Jam9pSW4wc0luQnlaWFpwYjNWelZHOXJaVzRpT2lJaUxDSmhZM1JwYjI0aU9pSnlaWFZ6WVdKc1pTSXNJblJ2YTJWdVZIbHdaU0k2SWpJaUxDSnpZM1FpT2pFM09EYzJOREF6TlRrME5qTXNJbVp3YVdRaU9pSTFOelpsTVRjNE1pMHhNelZrTFRRMllqUXRPV05oTlMwNU1qRm1aV0ZoTW1ZNVlqSWlMQ0owYVNJNmV5SnBaQ0k2SW1JeU9UVTRZakJpWVdNNU5EUXdOalE0WTJNMk5EQXhObUUwTm1Wak5UWXhJaXdpYlNJNklqRWlmU3dpWm1sa0lqb2laamMyWlRnM05HWXRZVGd3TXkwME1qRXpMVGs1WVRBdFlqRmpPVE0zTkdWaU9HUmxJaXdpY0dKeklqb3dMQ0p0ZEdSeklqb3dMQ0pqYkd4eklqb2laV1V3T0RSaE5qZGlZbU00WldZek15SXNJbTFwWkNJNkltWndYekl3TWpaZk1EaGZNalJmWmpFMU4yTXdNR1VpZlE9PS5jMzcxYWQwNzUwN2UzZTc3OGU1ZTMxZjkwZWVmOTJmYzI1N2YxNWY2YmQ2YjQxYjc1OTk2YmNmOGYyMmFmMDVm";

const D = (m, x) => console.log("[FP] " + m + (x !== undefined ? " " + JSON.stringify(x) : ""));
const url = /^https?:/i.test(SCRIPT_PATH) ? SCRIPT_PATH : SCRIPT_PATH.startsWith("//") ? "https:" + SCRIPT_PATH : BASE + SCRIPT_PATH;
const challengeName = url.match(/\/([^/]+)\.js$/)[1];
const hash = s => { let h = 0; for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i), h |= 0; return String(Math.abs(h)); };
const key = Symbol.for(hash(challengeName));

function waitExport(timeout) {
  return new Promise((res, rej) => {
    const t0 = Date.now();
    (function poll() {
      if (typeof window[key] === "function") return res(window[key]);
      if (Date.now() - t0 > timeout) return rej(new Error("export timeout"));
      setTimeout(poll, 200);
    })();
  });
}

(async () => {
  try {
    D("challengeName", challengeName);
    D("key", key.toString());
    let fn = window[key];
    if (typeof fn === "function") {
      D("export already registered (页面 challenge-solver 已加载)");
    } else {
      D("loading via <script>:", url);
      const s = document.createElement("script");
      s.src = url;
      document.head.appendChild(s);
      fn = await waitExport(15000);
      D("export registered after load");
    }
    D("calling export with payload...");
    const t0 = Date.now();
    const u = await fn(PAYLOAD);
    D("u len", String(u).length, "took", Date.now() - t0 + "ms");
    console.log("=== 复制下面整段发回 ===");
    console.log("__CAPTURE__ = " + JSON.stringify({ challengeName, payload: PAYLOAD, u: String(u) }, null, 1));
  } catch (e) {
    D("FATAL", String(e && e.message || e));
    D("stack", (e && e.stack || "").split("\n").slice(0, 4));
  }
})();
