import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {SCENES,REWRITES,REWRITE_COST,initialStory,canEnter,getScene,getReply,awardPlotPoint,eligibleToRewrite,chooseRewrite,resolveEpilogue,scriptStatus} from "../assets/story-core.mjs";

const root=resolve(import.meta.dirname,"..");
const read=p=>readFileSync(resolve(root,p),"utf8");
test("three unique authored interior scenes, no options without dialogue",()=>{
 assert.deepEqual(Object.keys(SCENES).sort(),["coffeechucks","lackluster","tweedcorp"]);
 const ids=new Set();
 for(const [id,scene] of Object.entries(SCENES)){
  assert.ok(!ids.has(id));ids.add(id);
  assert.ok(scene.greeting.length>30&&scene.npc&&scene.prop);
  assert.ok(scene.choices.length>=2);
  assert.equal(new Set(scene.choices.map(c=>c.id)).size,scene.choices.length);
  for(const choice of scene.choices)assert.equal(getReply(id,choice.id),choice.reply);
 }
 assert.equal(canEnter("whole-moods"),false);
 assert.equal(getScene("whole-moods"),null);
 assert.equal(getReply("tweedcorp","missing"),null);
});
test("plot points are one-time per distinct interior, clamped, and non-mutating",()=>{
 const original=initialStory();
 let s=awardPlotPoint(original,"coffeechucks");
 assert.equal(original.points,0);assert.equal(s.points,1);
 s=awardPlotPoint(s,"coffeechucks");assert.equal(s.points,1);
 s=awardPlotPoint(s,"lackluster");assert.equal(s.points,2);
 s=awardPlotPoint(s,"tweedcorp");assert.equal(s.points,3);
 s=awardPlotPoint(s,"spacealite");assert.equal(s.points,3);
 assert.equal(s.heard.length,3);
});
test("script rewrite requires completed quest and 2 points, rejects invalid paths",()=>{
 let s=initialStory();
 assert.equal(REWRITE_COST,2);
 assert.equal(chooseRewrite(s,3,"coffee"),null);
 s=awardPlotPoint(awardPlotPoint(s,"coffeechucks"),"tweedcorp");
 assert.equal(eligibleToRewrite(s,2),false);
 assert.equal(chooseRewrite(s,2,"coffee"),null);
 assert.equal(chooseRewrite(s,3,"nonexistent"),null);
 assert.equal(eligibleToRewrite(s,3),true);
 const next=chooseRewrite(s,3,"coffee");
 assert.equal(next.points,0);assert.equal(next.rewrite,"coffee");
 assert.equal(s.rewrite,null);
 assert.equal(eligibleToRewrite(next,3),false);
 assert.equal(chooseRewrite(next,3,"audit"),null);
});
test("two choices have truly different destination and successful resolution",()=>{
 assert.notEqual(REWRITES.coffee.target,REWRITES.audit.target);
 let s=awardPlotPoint(awardPlotPoint(initialStory(),"coffeechucks"),"tweedcorp");
 for(const option of Object.values(REWRITES)){
  const branch=chooseRewrite(s,3,option.id);
  const early=resolveEpilogue(branch,"tweedcorp");
  assert.equal(early.completed,false);
  assert.equal(early.story.finished,false);
  const end=resolveEpilogue(branch,option.target);
  assert.equal(end.completed,true);
  assert.equal(end.story.finished,true);
  assert.ok(end.message.length>50);
  assert.equal(resolveEpilogue(end.story,option.target).completed,false);
  assert.match(scriptStatus(end.story,3),/COMPLETE/);
 }
});
test("HTML story controls and deployment assets are wired",()=>{
 const html=read("play.html"),js=read("assets/play.js");
 assert.ok(html.includes('id="interior-overlay"'));
 assert.ok(html.includes('id="script-overlay"'));
 for(const id of ["enter","script-open","interior-choices","script-choices","plot-points","interior-close","script-close"])assert.ok(html.includes('id="'+id+'"'),id);
 assert.ok(html.includes('aria-live="polite"'));
 assert.ok(js.includes('from "./story-core.mjs"'));
 assert.ok(read(".github/workflows/pages.yml").includes("cp -R assets data public/"));
 assert.ok(read("README.md").includes("v0.4"));
});
