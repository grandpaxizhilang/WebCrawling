"use strict";
// Multi-vector verification: VM vs pure-JS reimpl
const re = require("C:/Users/ds/Desktop/wb_vm_solver/reimpl.js");
const SOURCE_NAMES = require("C:/Users/ds/Desktop/wb_vm_solver/source_names.js");

function b64decode(s) { return Buffer.from(s, "base64"); }
function b64encode(b) { return Buffer.from(b).toString("base64"); }

async function runVM(challengeId, clls, fixedNow) {
  const stubs = require("C:/Users/ds/AppData/Local/Temp/opencode/wb_vm/stubs.js");
  // re-require bundle fresh? bundle caches; simulate by requiring once and calling repeatedly
  if (!globalThis.__VM_EXPORTS__) require("C:/Users/ds/Desktop/wb_vm_solver/bundle.js");
  Date.now = () => fixedNow;
  const ex = globalThis.__VM_EXPORTS__;
  function hash(s){let h=0;for(let i=0;i<s.length;i++)h=(h<<5)-h+s.charCodeAt(i),h|=0;return String(Math.abs(h));}
  ex.run({});
  const fn = globalThis.window[Symbol.for(hash("challenge_vm_fp_v1.8.0_25fd2657"))];
  const json = JSON.stringify({ id: challengeId, clls });
  const payload = "v" + Buffer.from("1." + Buffer.from(json, "utf8").toString("base64"), "utf8").toString("base64");
  const u = await fn(payload);
  return u;
}

async function main() {
  const cases = [
    { id: "abc123def456", clls: "", now: 1700000000000 },
    { id: "xyz987654321", clls: "", now: 1600000000000 },
    { id: "wb_challenge_42", clls: "", now: 1800000000000 },
    { id: "abcdefghijklmnopqrstuvwxyz012345", clls: "", now: 1500000000000 },
    { id: "TEST-1234", clls: "", now: 1750000000000 },
  ];
  let allOk = true;
  for (const c of cases) {
    const u = await runVM(c.id, c.clls, c.now);
    const [elapsed, b64] = u.split("|");
    const vmSealed = b64decode(b64);
    const frameNonce = vmSealed.readUInt32LE(0);
    // pure JS
    const mine = re.seal(c.id, c.clls, { version: "5.2.0", components: {} }, frameNonce, SOURCE_NAMES);
    const ok = Buffer.compare(Buffer.from(mine), vmSealed) === 0;
    console.log(`[${c.id.slice(0,12)}] frameNonce=${frameNonce} elapsed=${elapsed} MATCH=${ok ? "YES" : "NO"}`);
    if (!ok) {
      allOk = false;
      console.log("  vm:  ", Buffer.from(vmSealed).toString("hex"));
      console.log("  mine:", Buffer.from(mine).toString("hex"));
    }
  }
  console.log(allOk ? "ALL VECTORS MATCH" : "SOME MISMATCHED");
  process.exit(0);
}
main();
