import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {RESIDENTS,TAPE_STEPS,TAPE_REWARD,advanceTapeQuest,tapeStatus,residentPosition,nearestResident,npcReply} from "../assets/residents-core.mjs";
import {initialProgress,decodeSave,encodeSave,inventory,experience,journalEntries,SAVE_VERSION,SAVE_KEY} from "../assets/progression-core.mjs";
const root=resolve(import.meta.dirname,".."),read=x=>readFileSync(resolve(root,x),"utf8");
const places=JSON.parse(read("data/stemside-map.json")).places;
test("four original characters occupy distinct legal city coordinates",()=>{
 assert.equal(RESIDENTS.length,4);
 assert.equal(new Set(RESIDENTS.map(x=>x.id)).size,4);
 for(const npc of RESIDENTS){assert.ok(npc.x>30&&npc.x<1570);assert.ok(npc.y>30&&npc.y<1090);assert.ok(npc.talk&&npc.name)}
});
test("walk-around is deterministic and reduced-motion stable",()=>{
 const npc=RESIDENTS[0];
 assert.deepEqual(residentPosition(npc,12),residentPosition(npc,12));
 assert.deepEqual(residentPosition(npc,11,true),residentPosition(npc,80,true));
 assert.equal(nearestResident(npc.x,npc.y,0).id,npc.id);
 assert.equal(nearestResident(-100,-100,0),null);
});
test("side quest requires correct order and actual mission sites",()=>{
 const expected=[["npc","marty"],["place","snublishers"],["npc","bob-street"],["npc","marty"]];
 assert.deepEqual(TAPE_STEPS.map(x=>[x.type,x.id]),expected);
 assert.ok(places.some(p=>p.id==="snublishers"));
 let stage=0;
 assert.equal(advanceTapeQuest(stage,"place","snublishers"),0);
 for(const [type,id] of expected){stage=advanceTapeQuest(stage,type,id)}
 assert.equal(stage,4);
 assert.equal(advanceTapeQuest(stage,"npc","marty"),4);
 assert.match(tapeStatus(stage),/SOLVED/);
 assert.match(npcReply("marty",3),/film credit/i);
 assert.equal(npcReply("unknown",0),null);
});
test("v1 save migrates to v2 without losing prior achievements",()=>{
 const old={...initialProgress(),version:1};
 delete old.tapeQuest;
 old.quest=3;old.wins=["spacealite"];old.visited=["coffeechucks"];old.story={points:1,heard:["coffeechucks"],rewrite:null,finished:false};
 const migrated=decodeSave(old);
 assert.equal(SAVE_VERSION,4);assert.equal(migrated.version,4);assert.equal(migrated.tapeQuest,0);
 assert.equal(migrated.quest,3);assert.deepEqual(migrated.wins,["spacealite"]);
 assert.deepEqual(migrated.visited,["coffeechucks"]);
 assert.equal(decodeSave(JSON.parse(encodeSave(migrated))).version,4);
 assert.match(SAVE_KEY,/tweedleverse/);
});
test("tape completion awards souvenir and XP exactly once",()=>{
 let p=initialProgress();
 p={...p,tapeQuest:4};
 assert.equal(inventory(p).filter(x=>x.id===TAPE_REWARD.id).length,1);
 assert.equal(inventory(p).length,1);
 assert.equal(experience(p)-experience(initialProgress()),50);
 assert.ok(journalEntries(p,places).some(x=>x.includes("TOMORROW")));
});
test("malformed progression stages fail safely",()=>{
 assert.equal(decodeSave({...initialProgress(),tapeQuest:-10}).tapeQuest,0);
 assert.equal(decodeSave({...initialProgress(),tapeQuest:100}).tapeQuest,0);
 assert.equal(decodeSave({...initialProgress(),version:999}),null);
});
test("DOM, source and deployment are wired",()=>{
 const html=read("play.html"),js=read("assets/play.js"),css=read("assets/play.css");
 for(const id of ["talk-resident","resident-label","tape-status","tape-steps"])assert.ok(html.includes('id="'+id+'"'),id);
 assert.ok(js.includes('from "./residents-core.mjs"'));
 assert.ok(js.includes('advanceTapeQuest('));
 assert.ok(css.includes("prefers-reduced-motion"));
 assert.ok(read(".github/workflows/checks.yml").includes("residents-core.mjs"));
 assert.ok(read(".github/workflows/pages.yml").includes("residents-core.mjs"));
});
