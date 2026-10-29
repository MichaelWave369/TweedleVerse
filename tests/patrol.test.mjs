import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {PATROL_SAVE_KEY,PATROL_VERSION,PATROL_WORLD,PATROL_STOPS,PATROL_CALLS,initialPatrol,decodePatrol,encodePatrol,detectiveEligible,callFor,checkpoint,shiftComplete,atDispatch,moveCar,respond,shiftStatus,distance} from "../assets/patrol-core.mjs";
import {initialPD,encodePD,PD_SAVE_KEY} from "../assets/pd-core.mjs";
const root=resolve(import.meta.dirname,".."),read=p=>readFileSync(resolve(root,p),"utf8");
const solvedCase=()=>({...initialPD(),scene:"precinct",solved:true,clues:["receipt","tape"],interviews:["chuck","marty"],report:"chief:snack:tape"});
function atCall(p){const t=checkpoint(p);return {...p,car:{x:t.x,y:t.y}}}
test("a solved, schema-valid donut case unlocks patrol, but an unsolved or invalid case cannot",()=>{
 assert.equal(detectiveEligible(initialPD()),false);
 assert.equal(detectiveEligible(null),false);
 assert.equal(detectiveEligible({version:1,solved:true,clues:[],interviews:[]}),false);
 assert.equal(detectiveEligible(solvedCase()),true);
 assert.equal(detectiveEligible(JSON.parse(encodePD(solvedCase()))),true);
 assert.notEqual(PATROL_SAVE_KEY,PD_SAVE_KEY);
 assert.notEqual(PATROL_SAVE_KEY,"tweedleverse.stemside.save.v1");
});
test("unique authored scenes, calls and valid choices in strict order",()=>{
 assert.equal(PATROL_CALLS.length,3);
 assert.equal(PATROL_STOPS.length,4);
 assert.equal(new Set(PATROL_CALLS.map(c=>c.id)).size,PATROL_CALLS.length);
 for(const call of PATROL_CALLS){
  assert.ok(PATROL_STOPS.some(s=>s.id===call.stop),call.stop);
  assert.equal(new Set(call.choices.map(c=>c.id)).size,call.choices.length);
  assert.ok(call.choices.some(c=>c.id===call.correct));
  assert.ok(call.witness&&call.setup&&call.result);
 }
 assert.equal(callFor(initialPatrol()).id,"coupon");
 assert.equal(checkpoint(initialPatrol()).id,"coffee");
});
test("squad car motion is normalized, clamped, deterministic and cannot teleport via dt exploits",()=>{
 const p=initialPatrol();
 const x=moveCar(p,1,0,0.05),diagonal=moveCar(p,1,1,0.05);
 assert.ok(distance(x.car,p.car)>0);
 assert.ok(Math.abs(distance(x.car,p.car)-distance(diagonal.car,p.car))<0.001);
 assert.equal(p.car.x,220);
 assert.deepEqual(moveCar(p,0,0,5),p);
 assert.deepEqual(moveCar(p,NaN,Infinity,NaN),p);
 const edge=moveCar({...p,car:{x:PATROL_WORLD.width-22,y:PATROL_WORLD.height-22}},1,1,100);
 assert.equal(edge.car.x,PATROL_WORLD.width-22);
 assert.equal(edge.car.y,PATROL_WORLD.height-22);
 const finished={...p,resolved:PATROL_CALLS.map(c=>c.id)};
 assert.strictEqual(moveCar(finished,1,0,1),finished);
});
test("dispatch requires arrival and rejects wrong choices without skipping calls",()=>{
 let p=initialPatrol();
 const wrongPlace=respond(p,"deescalate");
 assert.equal(wrongPlace.correct,false);assert.deepEqual(wrongPlace.progress,p);
 p=atCall(p);assert.equal(atDispatch(p),true);
 assert.equal(respond(p,"unknown").correct,false);
 const wrong=respond(p,"arrest");
 assert.equal(wrong.correct,false);assert.deepEqual(wrong.progress.resolved,[]);assert.equal(wrong.progress.mistakes,1);
 const good=respond(wrong.progress,"deescalate");
 assert.equal(good.correct,true);assert.deepEqual(good.progress.resolved,["coupon"]);
 assert.equal(callFor(good.progress).id,"noise");
 assert.equal(atDispatch(good.progress),false);
});
test("three nonviolent dispatch resolutions unlock final badge exactly once",()=>{
 let p=initialPatrol();
 for(const call of PATROL_CALLS){
  p=atCall(p);
  const answer=respond(p,call.correct);
  assert.equal(answer.correct,true);
  p=answer.progress;
 }
 assert.equal(shiftComplete(p),true);
 assert.equal(callFor(p),null);
 assert.equal(checkpoint(p),null);
 assert.match(shiftStatus(p),/SENIOR UNPAID DEPUTY/);
 assert.equal(respond(p,"void").correct,false);
 assert.deepEqual(respond(p,"void").progress,p);
 assert.deepEqual(decodePatrol(JSON.parse(encodePatrol(p))),p);
});
test("patrol save is versioned and safely rejects invalid or fabricated progress",()=>{
 for(const bad of [null,{},[],{version:3},"json"])assert.equal(decodePatrol(bad),null);
 const tampered={version:PATROL_VERSION,car:{x:99999,y:-100},resolved:["coupon","silence"],mistakes:100000};
 const clean=decodePatrol(tampered);
 assert.deepEqual(clean.resolved,["coupon"]);
 assert.equal(clean.car.x,PATROL_WORLD.width-22);
 assert.equal(clean.car.y,22);
 assert.equal(clean.mistakes,99);
 const other=decodePatrol({version:PATROL_VERSION,car:{x:NaN,y:Infinity},resolved:["silence"]});
 assert.deepEqual(other.car,initialPatrol().car);assert.deepEqual(other.resolved,[]);
});
test("Patrol Shift is wired to the Arcade and detective badge, and published by Pages",()=>{
 const page=read("patrol.html"),js=read("assets/patrol.js"),css=read("assets/patrol.css");
 const arcade=read("arcade.html"),pd=read("tweedlepd.html");
 for(const id of ["patrol-locked","patrol-game","patrol-canvas","patrol-interact","patrol-fast-travel","patrol-choices","patrol-log","patrol-reward","patrol-reset"])
   assert.ok(page.includes('id="'+id+'"'),id);
 assert.ok(js.includes('from "./patrol-core.mjs"'));
 assert.ok(js.includes('from "./pd-core.mjs"'));
 assert.ok(js.includes("detectiveEligible("));
 assert.ok(js.includes("requestAnimationFrame"));
 assert.ok(js.includes("localStorage.setItem(PATROL_SAVE_KEY"));
 assert.ok(!js.includes("innerHTML"));
 assert.ok(css.includes("prefers-reduced-motion"));
 assert.ok(arcade.includes('href="patrol.html"'));
 assert.ok(pd.includes('href="patrol.html"'));
 assert.ok(read(".github/workflows/pages.yml").includes("arcade.html tweedlepd.html patrol.html public/"));
 assert.ok(read(".github/workflows/checks.yml").includes("assets/patrol-core.mjs"));
 assert.ok(read("package.json").includes("0.13.0"));
});
