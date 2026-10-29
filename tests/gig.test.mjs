import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {GIG_STEPS,GIG_REWARD,BEAT_COUNT,BEAT_TIMES,WIN_SCORE,freshShow,beginShow,tickShow,hitBeat,gigStatus,gigReply,advanceGigQuest} from "../assets/gig-core.mjs";
import {initialProgress,decodeSave,encodeSave,inventory,experience,journalEntries,SAVE_VERSION} from "../assets/progression-core.mjs";
const root=resolve(import.meta.dirname,".."),read=p=>readFileSync(resolve(root,p),"utf8");
const map=JSON.parse(read("data/stemside-map.json")).places;
test("gig mission follows five valid story locations and is not skippable",()=>{
 const order=[["npc","lenny"],["place","lackluster"],["place","taco-bell"],["npc","lenny"],["show","stems-league"]];
 assert.deepEqual(GIG_STEPS.map(s=>[s.type,s.id]),order);
 for(const step of GIG_STEPS.filter(s=>s.type==="place"||s.type==="show"))assert.ok(map.some(p=>p.id===step.id));
 let stage=0;
 assert.equal(advanceGigQuest(0,"place","lackluster"),0);
 for(const [type,id] of order)stage=advanceGigQuest(stage,type,id);
 assert.equal(stage,5);
 assert.equal(advanceGigQuest(stage,"show","stems-league"),5);
 assert.match(gigStatus(stage),/SHOW COMPLETE/);
 assert.ok(gigReply(0).includes("amplifier"));
});
test("beat times and scoring are original, deterministic, and single-award",()=>{
 assert.equal(BEAT_COUNT,8);
 assert.equal(BEAT_TIMES.length,8);
 let show=beginShow(freshShow());
 assert.equal(show.status,"playing");
 for(const time of BEAT_TIMES){
  show={...show,elapsed:time};
  const after=hitBeat(show);
  assert.equal(after.score,show.score+2);
  assert.equal(hitBeat(after).score,after.score);
  show=after;
 }
 assert.equal(show.score,16);
 show=tickShow({...show,elapsed:BEAT_TIMES.at(-1)+.54},.08);
 assert.equal(show.status,"won");
 assert.equal(show.score>=WIN_SCORE,true);
 assert.equal(hitBeat(show).score,show.score);
});
test("misses and retry are real, easy mode broadens timing",()=>{
 let show=beginShow(freshShow());
 show=hitBeat({...show,elapsed:0});
 assert.equal(show.score,0);
 for(let i=0;i<100;i++)show=tickShow(show,.1);
 assert.equal(show.status,"lost");
 assert.equal(beginShow(show).score,0);
 const narrow=hitBeat({...beginShow(show),elapsed:BEAT_TIMES[0]+.27},false);
 const easy=hitBeat({...beginShow(show),elapsed:BEAT_TIMES[0]+.27},true);
 assert.equal(narrow.score,0);assert.equal(easy.score,1);
});
test("older save versions 1 and 2 migrate to 3, preserving progress",()=>{
 assert.equal(SAVE_VERSION,4);
 for(const version of [1,2]){
  const p={...initialProgress(),version,quest:3,tapeQuest:4,visited:["coffeechucks"],wins:["spacealite"],gigQuest:undefined};
  const old=decodeSave(p);
  assert.equal(old.version,4);assert.equal(old.gigQuest,0);
  assert.equal(old.quest,3);assert.equal(old.tapeQuest,4);
  assert.deepEqual(old.visited,["coffeechucks"]);
  assert.deepEqual(decodeSave(JSON.parse(encodeSave(old))),old);
 }
});
test("completed concert grants one bonus collectible, xp and journal entry",()=>{
 const initial=initialProgress();
 const finished={...initial,gigQuest:5};
 assert.equal(inventory(finished).filter(i=>i.id===GIG_REWARD.id).length,1);
 assert.equal(experience(finished)-experience(initial),60);
 assert.ok(journalEntries(finished).some(x=>x.includes("LENNY")));
 assert.equal(decodeSave({...initial,gigQuest:500}).gigQuest,0);
});
test("gig DOM, script and workflows are wired with no external audio",()=>{
 const html=read("play.html"),js=read("assets/play.js"),css=read("assets/play.css");
 for(const id of ["gig-overlay","gig-open","gig-start","gig-hit","gig-close","gig-status","gig-score","gig-steps","gig-meter","gig-notes","gig-easy"])assert.ok(html.includes('id="'+id+'"'),id);
 assert.ok(js.includes('from "./gig-core.mjs"'));
 assert.ok(js.includes("advanceGigQuest("));
 assert.ok(css.includes("prefers-reduced-motion"));
 assert.ok(read(".github/workflows/checks.yml").includes("gig-core.mjs"));
 assert.ok(read(".github/workflows/pages.yml").includes("gig-core.mjs"));
 assert.ok(read("README.md").includes("v0.8"));
 assert.ok(!html.includes("<audio"));
});
