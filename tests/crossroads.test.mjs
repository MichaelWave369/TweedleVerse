import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {PASSPORT_SOURCES,readPassport} from "../assets/passport-core.mjs";
import {initialProgress,encodeSave} from "../assets/progression-core.mjs";
import {initialPD,encodePD} from "../assets/pd-core.mjs";
import {initialPatrol,encodePatrol,PATROL_CALLS} from "../assets/patrol-core.mjs";
import {initialTunnel,encodeTunnel,BUDS,ROOMS} from "../assets/tweedsie-core.mjs";
import {initialCourier,encodeCourier,CONTRACTS} from "../assets/tunnel-contracts.mjs";
import {initialGolf,encodeGolf} from "../assets/golf-core.mjs";
import {initialCup,encodeCup} from "../assets/golf-cup.mjs";
import {CROSSROADS_KEY,CROSSROADS_VERSION,CROSSROADS_CASES,caseOf,initialCrossroads,decodeCrossroads,encodeCrossroads,unlockedCases,isUnlocked,beginCrossroads,activeScene,chooseCrossroads,caseCount} from "../assets/crossroads-core.mjs";
const root=resolve(import.meta.dirname,".."),read=path=>readFileSync(resolve(root,path),"utf8");
const pdSolved=()=>({...initialPD(),scene:"precinct",clues:["receipt","tape"],interviews:["chuck","marty"],solved:true,report:"chief:snack:tape"});
function sourceProgress(){
 const stem={...initialProgress(),quest:3,finale:{stage:5,evidence:3,mistakes:0,ending:"commons"}};
 const pd=pdSolved(),patrol={...initialPatrol(),resolved:PATROL_CALLS.map(x=>x.id)};
 const tunnels={...initialTunnel(),room:"vault",found:BUDS.map(x=>x.id),visits:ROOMS.map(x=>x.id),finished:true};
 const courier={...initialCourier(),claimed:CONTRACTS.map(x=>x.id)};
 const golf={...initialGolf(),clubName:"GOPHER GREENS"};
 const cup={...initialCup(),status:"completed",scores:[4,5,3],rounds:1,best:12,last:12};
 return {stemside:encodeSave(stem),pd:encodePD(pd),patrol:encodePatrol(patrol),
  tunnels:encodeTunnel(tunnels),courier:encodeCourier(courier,tunnels),golf:encodeGolf(golf),cup:encodeCup(cup)};
}
const fullPassport=()=>readPassport(sourceProgress());
function solveCase(progress,passport,id){
 let r=beginCrossroads(progress,passport,id);assert.equal(r.started,true);
 progress=r.progress;
 const mission=caseOf(id);
 for(let i=0;i<mission.scenes.length;i++){
  assert.equal(progress.active.step,i);
  const scene=activeScene(progress);
  const right=scene.choices.find(c=>c.right);
  r=chooseCrossroads(progress,passport,right.id);
  assert.equal(r.correct,true);progress=r.progress;
 }
 assert.ok(progress.completed.includes(id));
 return progress;
}
test("all three crossover cases have two real, distinct stamps, unique scenes and a legitimate winning answer",()=>{
 assert.equal(CROSSROADS_CASES.length,3);
 const ids=new Set(),passport=fullPassport(),badgeMap=new Map(passport.badges.map(b=>[b.id,b]));
 for(const mission of CROSSROADS_CASES){
  assert.ok(!ids.has(mission.id));ids.add(mission.id);
  assert.equal(mission.required.length,2);assert.notEqual(mission.required[0],mission.required[1]);
  assert.notEqual(badgeMap.get(mission.required[0]).series,badgeMap.get(mission.required[1]).series);
  assert.ok(mission.scenes.length>=3);
  for(const scene of mission.scenes){
   assert.equal(scene.choices.filter(c=>c.right).length,1);
   assert.equal(new Set(scene.choices.map(c=>c.id)).size,scene.choices.length);
   assert.ok(scene.text&&scene.place&&scene.speaker&&scene.prompt);
  }
 }
 assert.equal(new Set(PASSPORT_SOURCES.map(s=>s.key)).has(CROSSROADS_KEY),false);
});
test("blank Passport cannot open cases; unlocking follows VALID original-game stamps",()=>{
 const blank=readPassport({});
 assert.equal(unlockedCases(blank).length,0);
 for(const mission of CROSSROADS_CASES)assert.equal(isUnlocked(blank,mission.id),false);
 const refused=beginCrossroads(initialCrossroads(),blank,"fairway");
 assert.equal(refused.started,false);
 assert.deepEqual(refused.progress,initialCrossroads());
 const only=sourceProgress();delete only.golf;
 const limited=readPassport(only);
 assert.equal(isUnlocked(limited,"fairway"),false);
 assert.equal(isUnlocked(limited,"billing"),true);
});
test("each of three cases is a real 3-scene choice chain with retries and an archive reward",()=>{
 const passport=fullPassport();let p=initialCrossroads();
 assert.equal(unlockedCases(passport).length,3);
 let r=beginCrossroads(p,passport,"fairway");p=r.progress;assert.equal(r.started,true);
 const scene=activeScene(p);
 const wrong=scene.choices.find(x=>!x.right);
 r=chooseCrossroads(p,passport,wrong.id);
 assert.equal(r.correct,false);p=r.progress;assert.equal(p.wrong,1);assert.equal(p.active.step,0);
 assert.equal(chooseCrossroads(p,passport,"not-an-option").correct,false);
 assert.equal(beginCrossroads(p,passport,"billing").started,false);
 for(const id of CROSSROADS_CASES.map(c=>c.id)){
  if(id==="fairway"){
   for(const step of caseOf(id).scenes){r=chooseCrossroads(p,passport,step.choices.find(c=>c.right).id);p=r.progress}
   assert.equal(r.finished.id,"fairway");
  }else p=solveCase(p,passport,id);
 }
 assert.equal(caseCount(p),3);
 assert.equal(p.active,null);
 assert.equal(beginCrossroads(p,passport,"fairway").started,false);
 assert.equal(chooseCrossroads(p,passport,"bunker").correct,false);
 assert.deepEqual(decodeCrossroads(JSON.parse(encodeCrossroads(p,passport)),passport),p);
});
test("invalid saves, forged claims and missing source proofs cannot grant cases",()=>{
 const passport=fullPassport();
 for(const bad of [null,[],{}, {version:300},"junk"])assert.equal(decodeCrossroads(bad,passport),null);
 const invalid=decodeCrossroads({version:CROSSROADS_VERSION,completed:["unreal","fairway","fairway"],active:{id:"fairway",step:9},wrong:999999},passport);
 assert.deepEqual(invalid.completed,["fairway"]);assert.equal(invalid.active,null);assert.equal(invalid.wrong,9999);
 const weak=readPassport({});
 const forged=decodeCrossroads({version:CROSSROADS_VERSION,completed:["fairway","billing"],active:{id:"ledger",step:2},wrong:5},weak);
 assert.deepEqual(forged.completed,[]);assert.equal(forged.active,null);assert.equal(forged.wrong,5);
 const p=beginCrossroads(initialCrossroads(),passport,"ledger").progress;
 const denied=chooseCrossroads(p,weak,"manifest");
 assert.equal(denied.correct,false);assert.equal(denied.progress.active,null);
});
test("actual case save is the ONLY localStorage key written and UI retains independent original game progress",()=>{
 const html=read("crossroads.html"),js=read("assets/crossroads.js"),css=read("assets/crossroads.css");
 for(const id of ["crossroads-main","crossroads-case-grid","crossroads-investigation","crossroads-options","crossroads-refresh","crossroads-reset","crossroads-victory","crossroads-storage"])
  assert.ok(html.includes('id="'+id+'"'),id);
 assert.ok(js.includes("localStorage.getItem(source.key)"));
 assert.ok(js.includes("localStorage.setItem(CROSSROADS_KEY"));
 assert.ok(!js.includes("innerHTML"));
 assert.ok(js.includes("confirm("));
 assert.ok(css.includes("@media(max-width:690px)"));
 assert.ok(read("arcade.html").includes('href="crossroads.html"'));
 assert.ok(read("passport.html").includes('href="crossroads.html"'));
 assert.ok(read("assets/passport.js").includes("decodeCrossroads"));
 assert.ok(read(".github/workflows/pages.yml").includes("crossroads.html"));
 assert.ok(read(".github/workflows/checks.yml").includes("assets/crossroads-core.mjs"));
 assert.ok(Number(JSON.parse(read("package.json")).version.split(".")[1])>=17);
});
