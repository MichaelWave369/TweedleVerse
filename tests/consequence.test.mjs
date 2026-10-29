import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {CONSEQUENCES,PLACE_REACTIONS,RESIDENT_REACTIONS,activeEnding,consequenceFor,placeReaction,residentReaction,disputePerk,worldHeadline} from "../assets/consequence-core.mjs";
import {initialProgress,decodeSave,encodeSave,inventory,experience} from "../assets/progression-core.mjs";
import {startBattle,actionAvailable,playTurn} from "../assets/battle-core.mjs";
const root=resolve(import.meta.dirname,".."),read=p=>readFileSync(resolve(root,p),"utf8");
const before=initialProgress();
const ended=id=>({...initialProgress(),quest:3,wins:["coffeecharles"],finale:{stage:5,evidence:3,mistakes:0,ending:id}});
test("World stays untouched before the finale or on partial/invalid state",()=>{
 assert.equal(activeEnding(before),null);
 assert.equal(consequenceFor(before),null);
 assert.equal(worldHeadline(before),"SPACEALITE OWNS EVERY CHANNEL. FOR NOW.");
 assert.equal(placeReaction(before,"coffeechucks","NORMAL"),"NORMAL");
 assert.equal(residentReaction(before,"marty","NORMAL"),"NORMAL");
 assert.deepEqual(disputePerk(before),{startingShield:0,tweedsieAccess:false});
 assert.equal(activeEnding({...before,finale:{stage:4,ending:"refund"}}),null);
 assert.equal(activeEnding({...before,finale:{stage:5,ending:"hacked"}}),null);
});
test("Both endings alter at least eight stores and all four street residents independently",()=>{
 assert.deepEqual(Object.keys(CONSEQUENCES).sort(),["commons","refund"]);
 assert.ok(Object.keys(PLACE_REACTIONS).length>=8);
 assert.equal(Object.keys(RESIDENT_REACTIONS).length,4);
 for(const [id,reaction] of Object.entries(PLACE_REACTIONS)){
  assert.ok(reaction.refund&&reaction.commons&&reaction.refund!==reaction.commons,id);
  assert.equal(placeReaction(ended("refund"),id),reaction.refund);
  assert.equal(placeReaction(ended("commons"),id),reaction.commons);
 }
 for(const [id,reaction] of Object.entries(RESIDENT_REACTIONS)){
  assert.ok(reaction.refund!==reaction.commons);
  assert.equal(residentReaction(ended("refund"),id),reaction.refund);
  assert.equal(residentReaction(ended("commons"),id),reaction.commons);
 }
 assert.notEqual(worldHeadline(ended("refund")),worldHeadline(ended("commons")));
});
test("Endings affect repeatable encounters without changing one-use rules",()=>{
 const refund=disputePerk(ended("refund"));
 assert.deepEqual(refund,{startingShield:12,tweedsieAccess:false});
 const commons=disputePerk(ended("commons"));
 assert.deepEqual(commons,{startingShield:0,tweedsieAccess:true});
 let b=startBattle("spacealite");
 b={...b,shield:refund.startingShield};
 assert.equal(b.shield,12);
 assert.equal(actionAvailable(b,"tweedsie",["coffeecharles"],refund),false);
 assert.equal(actionAvailable(b,"tweedsie",["coffeecharles"],commons),true);
 b=playTurn(b,"tweedsie",["coffeecharles"],commons);
 assert.equal(b.tweedsieUsed,true);
 assert.equal(actionAvailable(b,"tweedsie",["coffeecharles"],commons),false);
});
test("Both results remain saved after a roundtrip and keep original rewards",()=>{
 for(const ending of ["refund","commons"]){
  const p=ended(ending);
  const restored=decodeSave(JSON.parse(encodeSave(p)));
  assert.equal(activeEnding(restored),ending);
  assert.equal(inventory(restored).filter(x=>x.id==="universal-fee-waiver").length,1);
  assert.equal(experience(restored),experience(p));
 }
});
test("City landmarks and authored residents have valid matching data",()=>{
 const map=JSON.parse(read("data/stemside-map.json")).places;
 for(const id of Object.keys(PLACE_REACTIONS))assert.ok(map.some(p=>p.id===id),id);
 for(const id of Object.keys(RESIDENT_REACTIONS))assert.ok(["bob-street","marty","chuck-street","lenny"].includes(id),id);
});
test("UI and CI wire the endings without forcing new save keys",()=>{
 const html=read("play.html"),js=read("assets/play.js"),css=read("assets/play.css");
 for(const id of ["city-broadcast","broadcast-title","broadcast-ticker","broadcast-news","broadcast-perk"])assert.ok(html.includes('id="'+id+'"'),id);
 for(const phrase of ["consequenceFor","placeReaction","residentReaction","disputePerk"])assert.ok(js.includes(phrase));
 assert.ok(js.includes('from "./consequence-core.mjs"'));
 assert.ok(css.includes(".broadcast-live"));
 assert.ok(read(".github/workflows/checks.yml").includes("assets/consequence-core.mjs"));
 assert.ok(read(".github/workflows/pages.yml").includes("assets/consequence-core.mjs"));
 assert.ok(read("README.md").includes("v0.11"));
});
