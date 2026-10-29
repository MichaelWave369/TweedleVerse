import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {resolve} from "node:path";
import {WORLD,OBJECTIVES,move,nearby,advanceQuest,scoreShot,arenaResult,normalizedPlaces} from "../assets/game-core.mjs";
const root=resolve(import.meta.dirname,"..");
const read=p=>readFileSync(resolve(root,p),"utf8");
const places=normalizedPlaces(JSON.parse(read("data/stemside-map.json")));
test("game controls and positions stay within the world, with normalized diagonals",()=>{
 const p={x:800,y:560};
 const cardinal=move(p,{x:1,y:0},.02);
 const diagonal=move(p,{x:1,y:1},.02);
 assert.ok(Math.abs(Math.hypot(diagonal.x-p.x,diagonal.y-p.y)-(cardinal.x-p.x))<.001);
 assert.equal(move({x:1590,y:1090},{x:1,y:1},10).x,WORLD.width-32);
 assert.equal(move({x:20,y:20},{x:-1,y:-1},10).y,32);
});
test("nearby interaction uses shared Stemside JSON coordinates",()=>{
 const coffee=places.find(p=>p.id==="coffeechucks");
 assert.equal(nearby(places,coffee.x/100*WORLD.width,coffee.y/100*WORLD.height).id,"coffeechucks");
 assert.equal(nearby(places,-900,-900),null);
});
test("quest progresses only in its original order",()=>{
 assert.deepEqual(OBJECTIVES,["coffeechucks","stems-league","tweedcorp"]);
 assert.equal(advanceQuest(0,"tweedcorp"),0);
 assert.equal(advanceQuest(0,"coffeechucks"),1);
 assert.equal(advanceQuest(1,"stems-league"),2);
 assert.equal(advanceQuest(2,"tweedcorp"),3);
 assert.equal(advanceQuest(3,"coffeechucks"),3);
});
test("Tweedleball rewards correct timing and aim, never random outcomes",()=>{
 assert.equal(scoreShot(0,.62),3);
 assert.equal(scoreShot(.4,.62),1);
 assert.equal(scoreShot(1,.62),0);
 assert.equal(scoreShot(0,.03),0);
 assert.equal(scoreShot(.95,.62,true),3);
 assert.equal(arenaResult(6,5),"medal");
 assert.equal(arenaResult(5,5),"try_again");
 assert.equal(arenaResult(5,4),"in_progress");
});
test("entry point and offline assets are wired",()=>{
 const html=read("play.html");
 const homepage=read("index.html");
 const explorer=read("stemside.html");
 const pages=read(".github/workflows/pages.yml");
 assert.ok(html.includes('src="assets/play.js"'));
 assert.ok(html.includes('id="world"'));
 assert.ok(html.includes('id="arena-overlay"'));
 assert.ok(html.includes('id="tweedsie-overlay"'));
 assert.ok(html.includes('data-dir="left"'));
 assert.ok(html.includes('aria-live="polite"'));
 assert.ok(homepage.includes('href="play.html"'));
 assert.ok(explorer.includes('href="play.html"'));
 for(const file of ["index.html","stemside.html","play.html","arcade.html","tweedlepd.html","patrol.html"])assert.ok(pages.includes(file),file);
 for(const file of ["assets/play.js","assets/play.css","assets/game-core.mjs"])assert.ok(existsSync(resolve(root,file)));
 for(const unsafe of ['<script src="http','<link rel="stylesheet" href="http','<img src="http'])assert.equal(html.includes(unsafe),false,unsafe);
});
