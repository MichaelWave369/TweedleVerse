import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {initialFinale,sanitizeFinale,finaleEligible,nextFinaleEvent,auditEvidence,pickFinaleEnding,finaleStatus,finaleDestination,FINALE_ENDINGS,FINALE_EVIDENCE,FINALE_REWARD} from "../assets/finale-core.mjs";
import {initialProgress,decodeSave,encodeSave,inventory,experience,journalEntries,SAVE_VERSION} from "../assets/progression-core.mjs";
import {resolveWaypoint} from "../assets/travel-core.mjs";
const root=resolve(import.meta.dirname,".."),read=p=>readFileSync(resolve(root,p),"utf8");
const places=JSON.parse(read("data/stemside-map.json")).places;
const eligible=()=>({...initialProgress(),quest:3,wins:["coffeecharles"]});
test("finale unlocked by real accomplishments and guarded against out-of-order events",()=>{
 const p=eligible();
 assert.equal(finaleEligible(initialProgress()),false);
 assert.equal(finaleEligible({...p,wins:[]}),false);
 assert.equal(finaleEligible(p),true);
 let f=initialFinale();
 assert.equal(nextFinaleEvent(f,p,"place","spacealite").stage,0);
 f=nextFinaleEvent(f,p,"npc","bob-street");assert.equal(f.stage,1);
 f=nextFinaleEvent(f,p,"place","lackluster");assert.equal(f.stage,2);
 f=nextFinaleEvent(f,p,"place","spacealite");assert.equal(f.stage,3);
 assert.equal(finaleDestination(f,p),null);
 assert.equal(nextFinaleEvent(f,p,"npc","bob-street").stage,3);
 assert.equal(finaleDestination(initialFinale(),p).id,"bob-street");
});
test("audit genuinely checks evidence sequence, mistakes, no duplicate points",()=>{
 let f={...initialFinale(),stage:3};
 let wrong=auditEvidence(f,"invoice");
 assert.equal(wrong.correct,false);assert.equal(wrong.finale.evidence,0);assert.equal(wrong.finale.mistakes,1);
 assert.equal(f.mistakes,0);
 for(const evidence of FINALE_EVIDENCE){
  let r=auditEvidence(f,evidence.id);
  assert.equal(r.correct,true);
  f=r.finale;
 }
 assert.equal(f.stage,4);assert.equal(f.evidence,3);
 assert.equal(auditEvidence(f,"coupon").correct,false);
});
test("two genuinely distinct endings and single reward",()=>{
 const f={...initialFinale(),stage:4,evidence:3};
 assert.equal(pickFinaleEnding(f,"other"),null);
 assert.equal(pickFinaleEnding(initialFinale(),"refund"),null);
 for(const id of Object.keys(FINALE_ENDINGS)){
  const ending=pickFinaleEnding(f,id);
  assert.equal(ending.stage,5);assert.equal(ending.ending,id);
  assert.equal(pickFinaleEnding(ending,id),null);
  const progress={...eligible(),finale:ending};
  assert.equal(inventory(progress).filter(i=>i.id===FINALE_REWARD.id).length,1);
  assert.equal(experience(progress)-experience({...progress,finale:initialFinale()}),120);
  assert.ok(journalEntries(progress,places).some(s=>s.includes("BILLING REVERSAL")));
  assert.match(finaleStatus(ending,progress),/EPISODE COMPLETE/);
 }
});
test("schema migrates old saves and rejects impossible finale values",()=>{
 assert.equal(SAVE_VERSION,4);
 for(const version of [1,2,3]){
  const p={...initialProgress(),version,quest:3,wins:["spacealite"],tapeQuest:4,gigQuest:5};
  delete p.finale;
  const migrated=decodeSave(p);
  assert.equal(migrated.version,4);assert.deepEqual(migrated.finale,initialFinale());
  assert.equal(migrated.quest,3);assert.equal(migrated.tapeQuest,4);assert.equal(migrated.gigQuest,5);
  assert.deepEqual(decodeSave(JSON.parse(encodeSave(migrated))),migrated);
 }
 assert.deepEqual(sanitizeFinale({stage:5,ending:"hacked",evidence:3}),initialFinale());
 assert.deepEqual(sanitizeFinale({stage:4,evidence:2}),initialFinale());
 assert.equal(sanitizeFinale({stage:3,evidence:2,mistakes:200}).mistakes,99);
});
test("v0.10 finale compass uses live quest progression",()=>{
 const p=eligible();
 assert.equal(resolveWaypoint(p,"finale",places).id,"bob-street");
 assert.equal(resolveWaypoint({...p,finale:{...initialFinale(),stage:1}},"finale",places).id,"lackluster");
 assert.equal(resolveWaypoint({...p,finale:{...initialFinale(),stage:2}},"finale",places).id,"spacealite");
 assert.equal(resolveWaypoint({...p,finale:{...initialFinale(),stage:3}},"finale",places),null);
});
test("HTML, JS and CI wire the episode and preserve local-only logic",()=>{
 const html=read("play.html"),js=read("assets/play.js"),css=read("assets/play.css");
 for(const id of ["finale-open","finale-overlay","finale-evidence","finale-endings","finale-status","finale-feedback","finale-close"])assert.ok(html.includes('id="'+id+'"'),id);
 assert.ok(js.includes('from "./finale-core.mjs"'));
 assert.ok(js.includes("auditEvidence"));
 assert.ok(css.includes(".finale-modal"));
 assert.ok(read(".github/workflows/checks.yml").includes("assets/finale-core.mjs"));
 assert.ok(read(".github/workflows/pages.yml").includes("assets/finale-core.mjs"));
 assert.ok(read("README.md").includes("v0.10"));
});
