import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {MAP_KEY,initialWorld,shortestRoute,walkWorld,PLACES,placeOf} from "../assets/world-map-core.mjs";
import {EVENTS_KEY,EVENTS_VERSION,EVENTS,initialEvents,decodeEvents,encodeEvents,eventOf,unlockedEvent,activeEncounter,pendingLocation,beginEvent,answerEvent,eventBoard} from "../assets/world-events-core.mjs";
const read=file=>readFileSync(resolve(import.meta.dirname,"..",file),"utf8");
function arrive(world,id){
 const path=shortestRoute(world.current,id);
 assert.ok(path.length>0,"No connected route to "+id);
 for(const step of path.slice(1)){
  const response=walkWorld(world,step);
  assert.equal(response.arrived,true);
  world=response.state;
 }
 return world;
}
function solve(progress,world,id){
 const start=beginEvent(progress,id);assert.equal(start.started,true);
 progress=start.state;
 const mission=eventOf(id);
 for(let sceneNumber=0;sceneNumber<mission.scenes.length;sceneNumber++){
  const scene=activeEncounter(progress);
  assert.equal(scene,mission.scenes[sceneNumber]);
  const location=pendingLocation(progress);
  world=arrive(world,location);
  assert.equal(world.current,location);
  const option=scene.options.find(x=>x.correct);
  const response=answerEvent(progress,world,option.id);
  assert.equal(response.correct,true);progress=response.state;
  assert.ok(!progress.active||progress.active.step===sceneNumber+1);
 }
 assert.ok(progress.completed.includes(id));
 return {progress,world};
}
test("Street encounters are uniquely authored at real map destinations with genuine choices",()=>{
 assert.equal(EVENTS.length,3);
 assert.equal(new Set(EVENTS.map(x=>x.id)).size,3);
 assert.equal(EVENTS[2].scenes.length,4);
 for(const mission of EVENTS){
  assert.ok(mission.title&&mission.summary&&mission.award);
  assert.ok(mission.scenes.length>=3);
  for(const scene of mission.scenes){
   assert.ok(placeOf(scene.place));
   assert.equal(scene.options.filter(x=>x.correct).length,1);
   assert.equal(new Set(scene.options.map(x=>x.id)).size,scene.options.length);
   assert.ok(scene.setup&&scene.speaker&&scene.prompt);
  }
 }
 assert.notEqual(EVENTS_KEY,MAP_KEY);
});
test("Initial cases are available; finale requires both independent civic resolutions",()=>{
 let p=initialEvents();
 assert.equal(p.version,EVENTS_VERSION);
 assert.deepEqual(eventBoard(p).map(e=>e.unlocked),[true,true,false]);
 assert.equal(beginEvent(p,"broadcast").started,false);
 const first=beginEvent(p,"sidewalk");
 assert.equal(first.started,true);
 assert.equal(beginEvent(first.state,"divot").started,false);
 assert.equal(first.state.active.step,0);
 assert.equal(p.active,null);
});
test("Witnesses are located in the correct districts, wrong leads never advance",()=>{
 let p=beginEvent(initialEvents(),"sidewalk").state,world=initialWorld();
 const scene=activeEncounter(p);
 const right=scene.options.find(x=>x.correct);
 assert.equal(answerEvent(p,world,right.id).correct,false);
 assert.equal(pendingLocation(p),"coffee");
 world=arrive(world,"coffee");
 const wrong=scene.options.find(x=>!x.correct);
 const miss=answerEvent(p,world,wrong.id);
 assert.equal(miss.correct,false);
 assert.equal(miss.state.wrong,1);
 assert.equal(miss.state.active.step,0);
 assert.equal(answerEvent(miss.state,world,"fake").correct,false);
 const rightAnswer=answerEvent(miss.state,world,right.id);
 assert.equal(rightAnswer.correct,true);
 assert.equal(rightAnswer.state.active.step,1);
 assert.equal(pendingLocation(rightAnswer.state),"tvpd");
 assert.equal(answerEvent(rightAnswer.state,world,"charter").correct,false);
});
test("Three complete story quests require connected travel and issue one award each",()=>{
 let p=initialEvents(),world=initialWorld();
 for(const id of ["sidewalk","divot","broadcast"]){
  const next=solve(p,world,id);p=next.progress;world=next.world;
  assert.equal(p.completed.length,["sidewalk","divot","broadcast"].indexOf(id)+1);
  assert.equal(p.active,null);
  assert.equal(beginEvent(p,id).started,false);
 }
 assert.deepEqual(p.completed,["sidewalk","divot","broadcast"]);
 assert.equal(eventBoard(p).every(e=>e.complete),true);
 assert.equal(activeEncounter(p),null);
 assert.equal(pendingLocation(p),null);
 assert.ok(world.visited.length>=8);
 assert.ok(world.steps>=8);
 assert.deepEqual(decodeEvents(JSON.parse(encodeEvents(p))),p);
});
test("New save decoder bounds mistakes and refuses an impossible finale claim or invalid scene",()=>{
 for(const x of [null,[],{}, {version:9},"stuff"])assert.equal(decodeEvents(x),null);
 const forged=decodeEvents({version:1,completed:["broadcast"],active:{id:"broadcast",step:2},wrong:1000000});
 assert.deepEqual(forged.completed,[]);
 assert.equal(forged.active,null);
 assert.equal(forged.wrong,9999);
 const later=decodeEvents({version:1,completed:["sidewalk","broadcast","sidewalk"],active:{id:"divot",step:0},wrong:-30});
 assert.deepEqual(later.completed,["sidewalk"]);
 assert.deepEqual(later.active,{id:"divot",step:0});
 assert.equal(later.wrong,0);
 const broken=decodeEvents({version:1,completed:[],active:{id:"divot",step:999}});
 assert.equal(broken.active,null);
});
test("A map reset cannot erase a separate completed street-case ledger",()=>{
 let p=initialEvents(),world=initialWorld();
 const result=solve(p,world,"sidewalk");
 p=result.progress;
 assert.equal(p.completed.length,1);
 const worldReset=initialWorld();
 assert.deepEqual(worldReset.visited,["plaza"]);
 assert.deepEqual(decodeEvents(JSON.parse(encodeEvents(p))).completed,["sidewalk"]);
 assert.notEqual(EVENTS_KEY,"tweedleverse.stemside.save.v1");
});
test("UI builds live witness controls, independent storage, CSS and CI Pages checks",()=>{
 const html=read("world.html"),js=read("assets/world-map.js"),css=read("assets/world-map.css");
 for(const id of ["world-events-board","world-events-progress","world-active-encounter","world-event-route","world-event-dialogue","world-event-options","world-events-reset","world-event-feedback"])
  assert.ok(html.includes('id="'+id+'"'),id);
 for(const phrase of ["beginEvent(","answerEvent(","pendingLocation(","localStorage.setItem(EVENTS_KEY","localStorage.setItem(MAP_KEY"])
  assert.ok(js.includes(phrase),phrase);
 assert.ok(!js.includes("innerHTML"));
 assert.ok(js.includes("window.confirm("));
 assert.ok(css.includes(".world-event-options"));
 assert.ok(read(".github/workflows/checks.yml").includes("assets/world-events-core.mjs"));
 assert.ok(read(".github/workflows/pages.yml").includes("assets/world-events-core.mjs"));
 assert.ok(read("README.md").includes("Street Encounters"));
 assert.equal(JSON.parse(read("package.json")).version,"0.19.0");
});
