import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {PARTY,ENCOUNTERS,startBattle,actionAvailable,playTurn,progress,awardWin,medalText} from "../assets/battle-core.mjs";
const root=resolve(import.meta.dirname,"..");
const read=path=>readFileSync(resolve(root,path),"utf8");
const map=JSON.parse(read("data/stemside-map.json"));
test("three original bosses map to canonical city locations",()=>{
 assert.deepEqual(Object.keys(ENCOUNTERS).sort(),["coffeecharles","spacealite","whole-moods"]);
 for(const [id,foe] of Object.entries(ENCOUNTERS)){
   assert.ok(map.places.some(p=>p.id===id));
   assert.ok(foe.target>0&&foe.retort>0&&foe.victory.length>10);
   assert.equal(foe.rebuttals.length,3);
 }
});
test("all four party moves have unique mechanical roles",()=>{
 assert.equal(PARTY.length,4);
 assert.equal(new Set(PARTY.map(p=>p.id)).size,4);
 assert.ok(PARTY.find(p=>p.id==="chip").restore>0);
 assert.ok(PARTY.find(p=>p.id==="dank").pressure>PARTY.find(p=>p.id==="chip").pressure);
 assert.ok(PARTY.find(p=>p.id==="bob").shield>0);
 assert.ok(PARTY.find(p=>p.id==="professor").cost>0);
});
test("turns are deterministic and original state is immutable",()=>{
 const initial=startBattle("coffeecharles");
 const next=playTurn(initial,"bob");
 assert.equal(initial.turn,0);assert.equal(initial.composure,100);
 assert.equal(next.turn,1);assert.equal(next.pressure,17);
 assert.equal(next.shield,1); // 14 shield absorbs 13 retaliatory pressure
 assert.equal(next.composure,100);
 assert.equal(playTurn(initial,"invalid"),null);
 assert.equal(startBattle("missing"),null);
 assert.equal(progress(initial),0);
});
test("three enemies can be beaten with core four-character party",()=>{
 for(const id of Object.keys(ENCOUNTERS)){
   let battle=startBattle(id),turns=0;
   while(battle.status==="active"&&turns<20){
     const action=turns===0?"bob":turns<=2?"professor":"chip";
     battle=playTurn(battle,action);
     turns++;
   }
   assert.equal(battle.status,"won",id+" was not beatable");
   assert.equal(progress(battle),100);
   assert.equal(playTurn(battle,"dank"),null);
   assert.ok(turns<=7);
 }
});
test("losing is reachable, replay is clean",()=>{
 let battle=startBattle("spacealite");
 for(let i=0;i<20&&battle.status==="active";i++)battle=playTurn(battle,"professor");
 assert.equal(battle.status,"lost");
 assert.equal(startBattle("spacealite").composure,100);
});
test("Tweedsie is a one-use optional reward after two different wins",()=>{
 let battle=startBattle("spacealite");
 assert.equal(actionAvailable(battle,"tweedsie",["coffeecharles"]),false);
 assert.equal(playTurn(battle,"tweedsie",["coffeecharles"]),null);
 battle=playTurn(battle,"tweedsie",["coffeecharles","whole-moods"]);
 assert.equal(battle.tweedsieUsed,true);
 assert.equal(battle.composure,100);
 assert.equal(battle.pressure,20);
 assert.equal(actionAvailable(battle,"tweedsie",["coffeecharles","whole-moods"]),false);
});
test("medals awarded once per unique victory and no award for defeat",()=>{
 const won={...startBattle("coffeecharles"),status:"won"};
 const lost={...startBattle("spacealite"),status:"lost"};
 assert.deepEqual(awardWin([],lost),[]);
 const once=awardWin([],won);
 assert.deepEqual(awardWin(once,won),once);
 assert.equal(medalText(["coffeecharles","whole-moods","spacealite"]).includes("REBEL"),true);
});
test("RPG combat is present in browser game and CI",()=>{
 const html=read("play.html"),js=read("assets/play.js"),css=read("assets/play.css");
 for(const id of ["battle-overlay","challenge","battle-actions","battle-composure","battle-pressure","battle-close","battle-log","battle-tweedsie"])assert.ok(html.includes('id="'+id+'"'),id);
 assert.ok(html.includes('aria-modal="true"'));
 assert.ok(html.includes('aria-live="polite"'));
 assert.ok(js.includes('from "./battle-core.mjs"'));
 assert.ok(css.includes("prefers-reduced-motion"));
 assert.ok(read(".github/workflows/checks.yml").includes("assets/battle-core.mjs"));
 assert.ok(read(".github/workflows/pages.yml").includes("assets/battle-core.mjs"));
 assert.ok(read("README.md").includes("v0.5"));
});
