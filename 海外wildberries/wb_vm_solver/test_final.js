const re = require("C:/Users/ds/Desktop/wb_vm_solver/reimpl.js");

// 57 source names (aJ) - needed for serialization
const SOURCE_NAMES = [
  "runtimeWorkerConsistency", "sessionStorage", "canvas", "runtimeWebDriver", "reducedMotion", "monochrome",
  "applePay", "runtimeEvalLength", "pdfViewerEnabled", "fonts", "languages", "runtimeFunctionBind",
  "vendorFlavors", "indexedDB", "invertedColors", "privateClickMeasurement", "runtimePlugins", "runtimeErrorStack",
  "colorDepth", "runtimeSolveCallCount", "hdr", "webGlExtensions", "vendor", "runtimeProductSub",
  "openDatabase", "forcedColors", "localStorage", "platform", "userAgentData", "runtimeUserAgent",
  "runtimeDocumentElementAttrs", "runtimeIntrinsicIntegrity", "plugins", "domBlockers", "audio", "dateTimeLocale",
  "runtimeTimingContext", "cookiesEnabled", "screenResolution", "math", "deviceMemory", "audioBaseLatency",
  "timezone", "touchSupport", "fontPreferences", "hardwareConcurrency", "reducedTransparency",
  "runtimeAutomationGlobals", "osCpu", "webGlBasics", "screenFrame", "contrast", "architecture", "colorGamut",
  "runtimeAppVersion", "runtimeCdpStackGetter", "cpuClass"
];

// 测试向量（来自真 VM）
const challengeId = "abc123def456";
const clls = "";
const fp = { version: "5.2.0", components: {} };
const frameNonce = 3666199878;
const expected = [70,197,133,218,40,144,175,247,192,164,169,86,113,134,1,60,91,86,132,245,179,100,134,155,119,188,183,62,246];

const out = re.seal(challengeId, clls, fp, frameNonce, SOURCE_NAMES);
const got = Array.from(out);
const ok = got.length === expected.length && got.every((v, i) => v === expected[i]);
console.log("sealed:", Buffer.from(out).toString("hex"));
console.log("expect:", Buffer.from(expected).toString("hex"));
console.log("MATCH:", ok);

// full u (with a payload)
const payload = "v" + Buffer.from("1." + Buffer.from(JSON.stringify({ id: challengeId, clls }), "utf8").toString("base64"), "utf8").toString("base64");
const u = re.solve(payload, fp, { sourceNames: SOURCE_NAMES, now: frameNonce });
console.log("u =", u);
const b64 = u.split("|")[1];
console.log("u sealed b64 match:", Buffer.from(b64, "base64").equals(Buffer.from(expected)) ? "YES" : "NO");
