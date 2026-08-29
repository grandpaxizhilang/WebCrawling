"use strict";
/**
 * WB antibot challenge_vm_fp_v1.8.0_25fd2657 — 纯算还原求解器
 *
 * 原理（已完整逆向验证）：
 *   页面加载 challenge-vm 脚本（JVO1 字节码 VM 保护），该脚本执行顶层程序后注册：
 *     window[Symbol.for(String(Math.abs(hashCode("challenge_vm_fp_v1.8.0_25fd2657"))))] = async gu
 *   调用 gu(payload) 后返回：
 *     u = String(Math.round(now - t0)) + "|" + btoa(sealedBytes)
 *   sealedBytes = frameNonce_u32_LE(4B) + 密封后的指纹数据(4B+varint指纹 + 16B MAC)
 *   其中指纹 = JSON 序列化后的浏览器组件，密封使用 JVO1 自定义 SHA-256 变体。
 *
 * 本文件用 Node 直接执行该 VM 字节码（bundle.js 内含完整解释器），
 * 配合可替换的宿主桩（浏览器 API），从而在无浏览器环境下求出 u。
 *
 * 用法：
 *   node solver.js "<payload>"
 *   node solver.js --trace "<payload>"     # 打印指纹采集过程读到的宿主值
 */

// ================== 宿主桩（可按真实浏览器环境替换） ==================
function buildStubs(opts) {
  const log = (s) => { if (opts.trace) console.log("[env]", s); };
  const noop = () => {};
  const record = (tag) => (...a) => { log(tag + (a.length ? " " + JSON.stringify(a).slice(0, 120) : "")); };

  function makeCanvas() {
    const gl = {
      getParameter: (p) => { log("canvas.getParameter(" + p + ")"); return p === 7936 || p === 7937 ? "" : 0; },
      getExtension: () => null,
      getSupportedExtensions: () => [],
      getContextAttributes: () => ({}),
      getShaderPrecisionFormat: () => ({ rangeMin: 0, rangeMax: 0, precision: 0 }),
      createShader: noop, shaderSource: noop, compileShader: noop, createProgram: noop,
      attachShader: noop, linkProgram: noop, useProgram: noop, createBuffer: noop,
      bindBuffer: noop, bufferData: noop, enableVertexAttribArray: noop, vertexAttribPointer: noop,
      drawArrays: noop, createTexture: noop, bindTexture: noop, texImage2D: noop,
      texParameteri: noop, viewport: noop, clearColor: noop, clear: noop, readPixels: noop,
      fillStyle: "", textBaseline: "alphabetic", fillRect: noop, fillText: noop,
      measureText: () => ({ width: 0 }), beginPath: noop, arc: noop, closePath: noop,
      stroke: noop, moveTo: noop, lineTo: noop,
      createLinearGradient: () => ({ addColorStop: noop }),
      globalCompositeOperation: "source-over",
      isPointInPath: () => false
    };
    return {
      getContext: (t) => { log("canvas.getContext(" + t + ")"); return t === "webgl" || t === "experimental-webgl" || t === "2d" ? gl : null; },
      toDataURL: () => { log("canvas.toDataURL"); return "data:image/png;base64,"; },
      width: 300, height: 150,
      addEventListener: noop, removeEventListener: noop
    };
  }

  const UA = opts.userAgent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
  const nav = Object.assign({
    userAgent: UA,
    platform: opts.platform || "Win32",
    language: "en-US",
    languages: ["en-US", "en"],
    hardwareConcurrency: opts.hardwareConcurrency || 8,
    deviceMemory: opts.deviceMemory || 8,
    maxTouchPoints: 0,
    webdriver: false,
    plugins: { length: 0, item: () => null, namedItem: () => null, refresh: noop },
    mimeTypes: { length: 0, item: () => null, namedItem: () => null, refresh: noop },
    cookieEnabled: true,
    userAgentData: { brands: [], mobile: false, platform: "Windows", getHighEntropyValues: () => Promise.resolve({}) },
    vendor: "Google Inc.",
    appName: "Netscape",
    appVersion: "5.0 (Windows)",
    productSub: "20030107",
    connection: { effectiveType: "4g", downlink: 10, rtt: 50, saveData: false },
    onLine: true,
    getBattery: () => Promise.resolve({ level: 1, charging: true }),
    sendBeacon: () => true
  }, opts.navigatorExtras || {});
  if (opts.trace) for (const k of ["userAgent", "platform", "language", "languages", "hardwareConcurrency", "deviceMemory", "maxTouchPoints", "webdriver", "plugins", "vendor", "productSub", "connection"]) {
    try {
      let val = nav[k];
      Object.defineProperty(nav, k, {
        get() { log("navigator." + k + " -> " + JSON.stringify(val).slice(0, 100)); return val; },
        set(v) { val = v; },
        configurable: true, enumerable: true
      });
    } catch (e) {}
  }

  const screen = {
    width: 1920, height: 1080, availWidth: 1920, availHeight: 1040,
    availTop: 0, availLeft: 0, colorDepth: 24, pixelDepth: 24,
    orientation: { type: "landscape-primary" }
  };

  const documentEl = { lang: "en-US", clientWidth: 1920, clientHeight: 1040, style: {} };
  const documentStub = {
    createElement: (tag) => {
      log("document.createElement(" + tag + ")");
      if (tag === "canvas") return makeCanvas();
      return { getContext: noop, style: {}, src: "", setAttribute: noop, addEventListener: noop, removeEventListener: noop, appendChild: noop, removeChild: noop, click: noop };
    },
    createElementNS: () => makeCanvas(),
    documentElement: documentEl,
    body: { appendChild: noop, removeChild: noop, clientWidth: 1920, clientHeight: 1040, style: {} },
    head: { appendChild: noop },
    readyState: "complete",
    visibilityState: "visible",
    hidden: false,
    characterSet: "UTF-8",
    contentType: "text/html",
    cookie: "",
    title: "",
    URL: "https://www.wildberries.ru/",
    referrer: "",
    domain: "www.wildberries.ru",
    addEventListener: noop, removeEventListener: noop,
    querySelector: () => null, querySelectorAll: () => [],
    getElementById: () => null, getElementsByTagName: () => [], getElementsByClassName: () => [],
    fonts: { ready: Promise.resolve(), check: () => true, load: () => Promise.resolve([]), status: "loaded" },
    hasFocus: () => true, exitFullscreen: noop, fullscreenElement: null,
    scrollingElement: { clientWidth: 1920, clientHeight: 1040 },
    activeElement: null
  };

  const windowStub = {
    chrome: { loadTimes: undefined, csi: undefined, runtime: undefined, app: undefined, webstore: undefined },
    DeviceMotionEvent: undefined, opera: undefined, opr: undefined, webdriver: false,
    innerWidth: 1920, innerHeight: 1040, outerWidth: 1920, outerHeight: 1040, devicePixelRatio: 1,
    screenX: 0, screenY: 0, pageXOffset: 0, pageYOffset: 0,
    location: { href: "https://www.wildberries.ru/", protocol: "https:", host: "www.wildberries.ru", origin: "https://www.wildberries.ru" },
    navigator: nav, document: documentStub, screen,
    performance: globalThis.performance,
    addEventListener: noop, removeEventListener: noop, dispatchEvent: () => true,
    getComputedStyle: () => ({ getPropertyValue: () => "" }),
    matchMedia: () => ({ matches: false, media: "", addListener: noop, removeListener: noop, addEventListener: noop, removeEventListener: noop }),
    postMessage: noop,
    requestAnimationFrame: cb => setTimeout(cb, 16), cancelAnimationFrame: clearTimeout,
    setTimeout, clearTimeout, getSelection: () => null,
    crypto: globalThis.crypto,
    indexedDB: undefined, openDatabase: undefined, msIndexedDB: undefined,
    name: "", visualViewport: { width: 1920, height: 1040, offsetLeft: 0, offsetTop: 0 },
    AudioContext: undefined, OfflineAudioContext: undefined, webkitOfflineAudioContext: undefined,
    Worker: undefined, SharedWorker: undefined, MessageChannel: undefined,
    URL, WebSocket: undefined, Image: function(){}, Audio: function(){},
    MutationObserver: undefined, ResizeObserver: undefined, IntersectionObserver: undefined,
    HTMLElement: function(){}, HTMLCanvasElement: function(){}, Element: function(){}
  };
  windowStub.self = windowStub; windowStub.window = windowStub; windowStub.parent = windowStub; windowStub.top = windowStub;

  class IntlDTF { resolvedOptions() { return { locale: "en-US", calendar: "gregory", numberingSystem: "latn", timeZone: opts.timeZone || "Europe/Moscow", hourCycle: "h23" }; } }
  class IntlNF { resolvedOptions() { return { locale: "en-US", numberingSystem: "latn" }; } }
  const intlStub = {
    DateTimeFormat: IntlDTF, NumberFormat: IntlNF, Collator: IntlNF, PluralRules: IntlNF,
    DisplayNames: IntlNF, ListFormat: IntlNF, RelativeTimeFormat: IntlNF,
    Locale: function(){}, Segmenter: function(){},
    getCanonicalLocales: l => (Array.isArray(l) ? l : [l]),
    supportedValuesOf: () => []
  };

  const store = { getItem: () => null, setItem: noop, removeItem: noop, clear: noop, key: () => null, length: 0 };

  const g = globalThis;
  function defGlobal(name, val) {
    try { Object.defineProperty(g, name, { value: val, writable: true, configurable: true, enumerable: true }); }
    catch (e) { try { g[name] = val; } catch (e2) { throw new Error("cannot stub global " + name); } }
  }
  defGlobal("window", windowStub);
  defGlobal("document", documentStub);
  defGlobal("navigator", nav);
  defGlobal("screen", screen);
  defGlobal("Intl", intlStub);
  g.self = g;
  defGlobal("chrome", windowStub.chrome);
  defGlobal("localStorage", store);
  defGlobal("sessionStorage", { ...store });
  defGlobal("alert", noop); defGlobal("confirm", () => true); defGlobal("prompt", () => null); defGlobal("print", noop); defGlobal("open", noop);
  defGlobal("atob", (s) => Buffer.from(s, "base64").toString("binary"));
  defGlobal("btoa", (s) => Buffer.from(s, "binary").toString("base64"));
  defGlobal("Blob", Blob); defGlobal("URL", URL); defGlobal("URLSearchParams", URLSearchParams);
  defGlobal("DOMParser", function(){}); defGlobal("XMLHttpRequest", function(){});
  defGlobal("fetch", () => Promise.resolve({ json: () => Promise.resolve({}), text: () => Promise.resolve(""), ok: true }));
  g.performance = globalThis.performance;
}

// ================== VM 执行 ==================
const bundlePath = require("path").join(__dirname, "bundle.js");
function loadVM() {
  require(bundlePath);
  return globalThis.__VM_EXPORTS__;
}

function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i), h |= 0;
  return String(Math.abs(h));
}

const CHALLENGE_NAME = "challenge_vm_fp_v1.8.0_25fd2657";

function makeSolver(opts = {}) {
  buildStubs(opts);
  const ex = loadVM();
  ex.run({});                                     // 执行 VM 顶层程序 → 注册导出函数
  const key = Symbol.for(hashCode(CHALLENGE_NAME));
  const fn = globalThis.window[key];
  if (typeof fn !== "function")
    throw new Error("export not registered: " + key.toString());

  return async function solve(payload) {
    return await fn(payload);
  };
}

// ================== CLI ==================
if (require.main === module) {
  const args = process.argv.slice(2);
  const trace = args.includes("--trace");
  const payloadArg = args.find(a => !a.startsWith("--"));
  if (!payloadArg) {
    console.error("usage: node solver.js [--trace] \"<payload>\"");
    process.exit(2);
  }
  const solve = makeSolver({ trace });
  solve(payloadArg).then(u => {
    console.log("u = " + u);
    process.exit(0);
  }).catch(e => {
    console.error("solve failed:", e && e.message, e && e.cause && ("(" + e.cause.message + ")"));
    process.exit(1);
  });
}

module.exports = { makeSolver, hashCode, CHALLENGE_NAME };
