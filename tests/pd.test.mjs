import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {PD_SAVE_KEY,PD_SAVE_VERSION,SCENES,CLUES,WITNESSES,initialPD,decodePD,encodePD,travelTo,sceneClues,sceneWitnesses,inspect,interview,canFile,submitReport,caseStatus,objective} from "../assets/pd-core.mjs";
const root=resolve(import.meta.dirname,"..");
const read=path=>readFileSync(resolve(root,path),"utf8");
function investigate(){
 let p=initialPD();
 for(const [scene,actions] of [
  ["precinct",[["clue","crumbs"],["clue","log"],["witness","chief"]]],
  ["coffeechucks",[["clue","receipt"],["witness","chuck"]]],
  ["lackluster",[["clue","tape"],["witness","marty"]]],
  ["tweedcorp",[["clue","invoice"],["witness","bob"]]]
 ]){
  p=travelTo(p,scene);
  for(const [type,id] of actions)p=(type==="clue"?inspect(p,id):interview(p,id)).progress;
 }
 return travelTo(p,"precinct");
}
test("canonical game map, evidence and witness IDs remain unique",()=>{
 assert.equal(PD_SAVE_VERSION,1);
 assert.equal(PD_SAVE_KEY,"tweedleverse.tweedlepd.case001.v1");
 for(const collection of [SCENES,CLUES,WITNESSES])assert.equal(new Set(collection.map(x=>x.id)).size,collection.length);
 assert.equal(SCENES.length,4);assert.equal(CLUES.length,5);assert.equal(WITNESSES.length,4);
 for(const x of [...CLUES,...WITNESSES])assert.ok(SCENES.some(s=>s.id===x.scene));
});
test("only clues and interviews at the current site can be recorded once",()=>{
 let p=initialPD();
 assert.equal(inspect(p,"tape").newItem,false);
 assert.equal(interview(p,"chuck").newItem,false);
 const first=inspect(p,"crumbs");p=first.progress;
 assert.equal(first.newItem,true);
 assert.equal(inspect(p,"crumbs").newItem,false);
 p=travelTo(p,"coffeechucks");
 assert.equal(sceneClues("coffeechucks")[0].id,"receipt");
 assert.equal(sceneWitnesses("coffeechucks")[0].id,"chuck");
 assert.equal(interview(p,"chuck").newItem,true);
 assert.equal(travelTo(p,"nonexistent"),p);
 assert.equal(canFile(p),false);
});
test("roookie must find receipt and tape and interview Chuck and Marty",()=>{
 let p=initialPD();
 p=travelTo(p,"coffeechucks");p=inspect(p,"receipt").progress;p=interview(p,"chuck").progress;
 assert.equal(canFile(p),false);
 p=travelTo(p,"lackluster");p=inspect(p,"tape").progress;
 assert.equal(canFile(p),false);
 p=interview(p,"marty").progress;
 assert.equal(canFile(p),true);
 assert.match(caseStatus(p),/READY TO FILE/);
 assert.match(objective(p),/report/);
 assert.match(submitReport(p,{suspect:"chief",explanation:"snack",evidence:"tape"}).feedback,/RETURN TO THE TVPD PRECINCT/);
});
test("wrong reports are retriable, and cannot falsely award a badge",()=>{
 let p=investigate();
 assert.equal(canFile(p),true);
 for(const choices of [
  {suspect:"tweedsie",explanation:"theft",evidence:"tape"},
  {suspect:"chief",explanation:"portal",evidence:"tape"},
  {suspect:"chief",explanation:"snack",evidence:"crumbs"}
 ]){
  const r=submitReport(p,choices);
  assert.equal(r.success,false);
  assert.equal(r.progress.solved,false);
  p=r.progress;
 }
 assert.equal(p.attempts,3);
 const r=submitReport(p,{suspect:"chief",explanation:"snack",evidence:"tape"});
 assert.equal(r.success,true);
 assert.equal(r.progress.solved,true);
 assert.equal(r.progress.attempts,4);
 assert.equal(r.progress.report,"chief:snack:tape");
 assert.equal(submitReport(r.progress,{suspect:"chief",explanation:"snack",evidence:"tape"}).success,false);
 assert.equal(travelTo(r.progress,"precinct"),r.progress);
});
test("incomplete report and corrupted saves are rejected or sanitized",()=>{
 const p=initialPD();
 assert.equal(submitReport(p,{suspect:"chief",explanation:"snack",evidence:"tape"}).success,false);
 for(const data of [null,{},[],{version:42},'{}'])assert.equal(decodePD(data),null);
 const malformed={version:1,scene:"invalid",clues:["tape","tape","nonsense"],interviews:["chief","chief","marty"],solved:true,report:"fake",attempts:999999};
 const clean=decodePD(malformed);
 assert.equal(clean.scene,"precinct");
 assert.deepEqual(clean.clues,["tape"]);
 assert.deepEqual(clean.interviews,["chief","marty"]);
 assert.equal(clean.solved,false);
 assert.equal(clean.report,null);
 assert.equal(clean.attempts,99);
});
test("solved case survives save roundtrip and uses separate local slot",()=>{
 const solved=submitReport(investigate(),{suspect:"chief",explanation:"snack",evidence:"tape"}).progress;
 assert.deepEqual(decodePD(JSON.parse(encodePD(solved))),solved);
 assert.notEqual(PD_SAVE_KEY,"tweedleverse.stemside.save.v1");
 assert.match(caseStatus(solved),/BADGE AWARDED/);
});
test("Pages, arcade and playable detective entry points and safety wiring",()=>{
 const page=read("tweedlepd.html"),arcade=read("arcade.html"),js=read("assets/tweedlepd.js"),css=read("assets/arcade.css");
 for(const id of ["pd-main","pd-travel","clue-actions","witness-actions","pd-report","pd-evidence-meter","pd-reset","pd-credits"])assert.ok(page.includes('id="'+id+'"'),id);
 for(const link of ['href="tweedlepd.html"','href="play.html"'])assert.ok(arcade.includes(link),link);
 assert.ok(arcade.includes("CONCEPT ONLY"));
 assert.ok(!arcade.includes("href=\"javascript:"));
 assert.ok(js.includes('from "./pd-core.mjs"'));
 assert.ok(js.includes("localStorage.setItem(PD_SAVE_KEY"));
 assert.ok(js.includes("textContent"));
 assert.ok(!js.includes("innerHTML"));
 assert.ok(css.includes("@media(max-width:760px)"));
 for(const name of ["index.html","play.html","stemside.html"])assert.ok(read(name).includes("arcade.html"),name);
 assert.ok(read(".github/workflows/pages.yml").includes("arcade.html tweedlepd.html"));
 assert.ok(read(".github/workflows/checks.yml").includes("assets/pd-core.mjs"));
 assert.ok(read("README.md").includes("TweedlePD"));
});
