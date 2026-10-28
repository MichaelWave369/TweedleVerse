import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {initialProgress,decodeSave,encodeSave,visitLandmark,inventory,experience,rankFor,passportStatus,journalEntries,LANDMARK_IDS,RANKS,SAVE_KEY} from "../assets/progression-core.mjs";
const root=resolve(import.meta.dirname,"..");
const read=p=>readFileSync(resolve(root,p),"utf8");
const places=JSON.parse(read("data/stemside-map.json")).places;
test("passport exactly matches all canonical map landmarks",()=>{
 assert.equal(places.length,13);
 assert.deepEqual(new Set(places.map(p=>p.id)),new Set(LANDMARK_IDS));
});
test("one stamp and souvenir per unique interaction, no repeat farming",()=>{
 const start=initialProgress();
 const one=visitLandmark(start,"coffeechucks");
 assert.equal(start.visited.length,0);
 assert.equal(one.visited.length,1);
 assert.equal(visitLandmark(one,"coffeechucks").visited.length,1);
 assert.equal(visitLandmark(one,"invalid-id").visited.length,1);
 assert.match(inventory(one)[0].name,/CoffeeChucks/);
});
test("all 13 stamps lead to a complete local inventory",()=>{
 let p=initialProgress();
 for(const id of LANDMARK_IDS)p=visitLandmark(p,id);
 assert.equal(inventory(p).length,13);
 assert.match(passportStatus(p),/FULL PASSPORT/);
});
test("XP is earned only from unique progress, levels increase",()=>{
 let p=initialProgress();
 const original=experience(p);
 p=visitLandmark(p,"coffeechucks");
 assert.equal(experience(p)-original,5);
 assert.equal(experience(visitLandmark(p,"coffeechucks")),experience(p));
 assert.equal(rankFor(0).name,RANKS[0].name);
 assert.equal(rankFor(1e6).name,RANKS.at(-1).name);
});
test("schema roundtrips useful state without restoring active battles or modal",()=>{
 let p=initialProgress();
 p={...p,quest:3,medal:true,story:{points:1,heard:["coffeechucks","tweedcorp"],rewrite:"coffee",finished:true},wins:["spacealite"],player:{x:470,y:900},interactions:31};
 p=visitLandmark(p,"coffeechucks");
 const loaded=decodeSave(JSON.parse(encodeSave(p)));
 assert.deepEqual(loaded,p);
 assert.equal(loaded.battle,undefined);
});
test("malformed, stale and foreign save data fail safe",()=>{
 assert.equal(decodeSave(null),null);
 assert.equal(decodeSave({version:99}),null);
 assert.equal(decodeSave("text"),null);
 const p=decodeSave({version:1,quest:9,player:{x:Infinity,y:-700},story:{points:999,heard:["coffeechucks","coffeechucks","unknown"],rewrite:"bogus",finished:true},wins:["bogus","spacealite","spacealite"],visited:["bogus","tweedcorp","tweedcorp"],interactions:-7});
 assert.equal(p.quest,0);
 assert.equal(p.player.x,215);
 assert.equal(p.player.y,32);
 assert.deepEqual(p.wins,["spacealite"]);
 assert.deepEqual(p.visited,["tweedcorp"]);
 assert.equal(p.story.points,1);
 assert.equal(p.story.rewrite,null);
 assert.equal(p.story.finished,false);
 assert.equal(p.interactions,0);
});
test("journal contains meaningful completed tasks and known stops",()=>{
 let p={...initialProgress(),quest:3,medal:true,story:{points:0,heard:["coffeechucks"],rewrite:"audit",finished:true},wins:["spacealite"]};
 p=visitLandmark(p,"coffeechucks");
 const entries=journalEntries(p,places);
 assert.ok(entries.some(x=>x.includes("PAGE 42")));
 assert.ok(entries.some(x=>x.includes("TGA PRACTICE")));
 assert.ok(entries.some(x=>x.includes("CoffeeChucks")));
});
test("v0.6 UI and tests are wired and saves are explicitly local only",()=>{
 const html=read("play.html"),js=read("assets/play.js"),css=read("assets/play.css");
 for(const id of ["passport-stamps","passport-rank","passport-items","passport-journal","save-now","save-status"])assert.ok(html.includes('id="'+id+'"'),id);
 assert.ok(js.includes('from "./progression-core.mjs"'));
 assert.ok(js.includes("localStorage.setItem"));
 assert.ok(js.includes("localStorage.getItem"));
 assert.ok(js.includes("SAVE_KEY"));
 assert.ok(css.includes(".passport-card"));
 assert.ok(read(".github/workflows/checks.yml").includes("assets/progression-core.mjs"));
 assert.ok(read(".github/workflows/pages.yml").includes("assets/progression-core.mjs"));
 assert.ok(read("README.md").includes("v0.6"));
 assert.match(SAVE_KEY,/tweedleverse/);
});
