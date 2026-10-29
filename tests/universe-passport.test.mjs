import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {PASSPORT_SOURCES,readPassport,snapshot,summaryText} from "../assets/passport-core.mjs";
import {SAVE_KEY,initialProgress,encodeSave,LANDMARK_IDS} from "../assets/progression-core.mjs";
import {PD_SAVE_KEY,initialPD,encodePD} from "../assets/pd-core.mjs";
import {PATROL_SAVE_KEY,initialPatrol,encodePatrol,PATROL_CALLS} from "../assets/patrol-core.mjs";
import {TUNNEL_KEY,initialTunnel,encodeTunnel,ROOMS,BUDS} from "../assets/tweedsie-core.mjs";
import {COURIER_KEY,initialCourier,encodeCourier,CONTRACTS} from "../assets/tunnel-contracts.mjs";
import {GOLF_KEY,initialGolf,encodeGolf,HOLES,CELEBS,COLS,ROWS} from "../assets/golf-core.mjs";
import {CUP_KEY,initialCup,encodeCup} from "../assets/golf-cup.mjs";
const root=resolve(import.meta.dirname,".."),read=p=>readFileSync(resolve(root,p),"utf8");
const solvedPD=()=>({...initialPD(),scene:"precinct",solved:true,clues:["receipt","tape"],interviews:["chuck","marty"],report:"chief:snack:tape"});
const completeTunnel=()=>({...initialTunnel(),room:"vault",found:BUDS.map(b=>b.id),finished:true,visits:ROOMS.map(r=>r.id)});
function completeSaves(){
 const stem={...initialProgress(),quest:3,medal:true,visited:[...LANDMARK_IDS],
  story:{points:0,heard:["coffeechucks","lackluster","tweedcorp"],rewrite:"coffee",finished:true},
  finale:{stage:5,evidence:3,mistakes:0,ending:"commons"}};
 const pd=solvedPD(),patrol={...initialPatrol(),resolved:PATROL_CALLS.map(c=>c.id)};
 const tunnels=completeTunnel(),courier={...initialCourier(),claimed:CONTRACTS.map(c=>c.id),bursts:3};
 const tiles=Array(COLS*ROWS).fill("water");tiles[4*COLS+1]="fairway";tiles[4*COLS+13]="green";
 const golf={...initialGolf(),clubName:"ROOT TOP LINKS",tiles,guests:CELEBS.map(c=>c.id),
  results:Object.fromEntries(HOLES.map(h=>[h.id,h.par]))};
 const cup={...initialCup(),status:"completed",scores:[3,3,3],rounds:2,best:9,last:9};
 return {stemside:encodeSave(stem),pd:encodePD(pd),patrol:encodePatrol(patrol),
  tunnels:encodeTunnel(tunnels),courier:encodeCourier(courier,tunnels),golf:encodeGolf(golf),cup:encodeCup(cup)};
}
test("all seven original source keys are unique and preserve exact original game save slots",()=>{
 assert.equal(PASSPORT_SOURCES.length,7);
 assert.deepEqual(PASSPORT_SOURCES.map(s=>s.key),[SAVE_KEY,PD_SAVE_KEY,PATROL_SAVE_KEY,TUNNEL_KEY,COURIER_KEY,GOLF_KEY,CUP_KEY]);
 assert.equal(new Set(PASSPORT_SOURCES.map(s=>s.key)).size,7);
 assert.ok(PASSPORT_SOURCES.every(s=>s.href.endsWith(".html")));
});
test("empty browser sees fifteen locked stamps and truthful missing slots",()=>{
 const p=readPassport({});
 assert.equal(p.total,15);assert.equal(p.count,0);assert.equal(p.percentage,0);
 assert.equal(p.tier,"UNPAID VISITOR");assert.equal(p.gamesWithStamps,0);
 assert.equal(p.sources.length,7);
 assert.ok(p.sources.every(s=>s.status==="missing"));
 assert.equal(p.headlines.length,1);
 assert.match(p.headlines[0].title,/FIRST CROSSOVER/);
});
test("correctly decoded old game progress earns all game-series badges without modifying saves",()=>{
 const raw=completeSaves();
 const original=JSON.stringify(raw);
 const p=readPassport(raw);
 assert.equal(p.count,15);
 assert.equal(p.total,15);assert.equal(p.percentage,100);
 assert.equal(p.tier,"STEMSIDE MYTH");assert.equal(p.gamesWithStamps,4);
 assert.equal(p.series.length,4);
 assert.ok(p.sources.every(s=>s.status==="loaded"));
 assert.ok(p.badges.every(b=>b.earned===true));
 assert.ok(p.headlines.length>=3);
 assert.equal(JSON.stringify(raw),original);
 assert.match(summaryText(p),/GRAND STEM CHAMPION/);
 assert.match(summaryText(p),/UNDERGROUND LEGEND/);
});
test("malformed save keys, bad JSON and oversized JSON fail independently",()=>{
 const raw=completeSaves();
 raw.pd="{";
 raw.patrol=JSON.stringify({version:404,solved:true});
 raw.courier=JSON.stringify({version:1,claimed:["market","glow","roots"]});
 raw.cup="1".repeat(180001);
 const p=readPassport(raw);
 assert.equal(p.sources.find(s=>s.id==="pd").status,"unreadable");
 assert.equal(p.sources.find(s=>s.id==="patrol").status,"unrecognized");
 assert.equal(p.sources.find(s=>s.id==="courier").status,"loaded");
 assert.equal(p.sources.find(s=>s.id==="cup").status,"unreadable");
 assert.ok(!p.badges.find(b=>b.id==="detective").earned);
 assert.ok(!p.badges.find(b=>b.id==="deputy").earned);
 assert.ok(!p.badges.find(b=>b.id==="courier").earned);
 assert.ok(!p.badges.find(b=>b.id==="champion").earned);
 assert.ok(p.badges.find(b=>b.id==="vault").earned);
});
test("dependent story badges require relevant original proof, not standalone fake claims",()=>{
 const raw=completeSaves();
 delete raw.tunnels;
 const p=readPassport(raw);
 assert.equal(p.sources.find(s=>s.id==="tunnels").status,"missing");
 assert.equal(p.sources.find(s=>s.id==="courier").status,"unrecognized");
 assert.equal(p.badges.find(b=>b.id==="courier").earned,false);
 assert.equal(p.badges.find(b=>b.id==="vault").earned,false);
 const other=completeSaves();
 other.pd=encodePD(initialPD());
 const p2=readPassport(other);
 assert.equal(p2.badges.find(b=>b.id==="deputy").earned,false);
 assert.equal(p2.badges.find(b=>b.id==="detective").earned,false);
});
test("partial real play saves report meaningful progress and crossover newspaper stories",()=>{
 const raw={};
 const stem={...initialProgress(),quest:3};
 raw.stemside=encodeSave(stem);
 raw.pd=encodePD(solvedPD());
 const tunnel={...initialTunnel(),visits:["burrow","roots","orchard"],found:["root-sprig","orchard-crop","glow-stem"]};
 raw.tunnels=encodeTunnel(tunnel);
 raw.golf=encodeGolf({...initialGolf(),results:{chucks:5}});
 const p=readPassport(raw);
 assert.ok(p.count>=2&&p.count<15);
 assert.ok(p.headlines.some(h=>h.title.includes("TVPD OPENS")));
 assert.ok(p.headlines.some(h=>h.title.includes("FARM UNDERPASS")));
 assert.equal(p.sources.find(s=>s.id==="golf").status,"loaded");
});
test("passport HTML, read-only JS, navigation and deployment are connected",()=>{
 const html=read("passport.html"),arcade=read("arcade.html"),js=read("assets/passport.js"),
  core=read("assets/passport-core.mjs"),mini=read("assets/arcade-passport.js"),
  pages=read(".github/workflows/pages.yml"),checks=read(".github/workflows/checks.yml");
 for(const id of ["passport-main","passport-stamps","passport-headlines","passport-source-list","passport-refresh","passport-copy","passport-count","passport-progress"])
  assert.ok(html.includes('id="'+id+'"'),id);
 for(const href of ['href="passport.html"','assets/arcade-passport.js'])assert.ok(arcade.includes(href));
 assert.ok(read("index.html").includes('href="passport.html"'));
 assert.ok(pages.includes("passport.html"));
 assert.ok(pages.includes("crossroads.html"));
 assert.ok(checks.includes("assets/passport-core.mjs"));
 assert.ok(checks.includes("assets/arcade-passport.js"));
 assert.ok(js.includes("localStorage.getItem"));
 assert.ok(mini.includes("localStorage.getItem"));
 assert.ok(!js.includes("localStorage.setItem"));
 assert.ok(!mini.includes("localStorage.setItem"));
 assert.ok(!core.includes("localStorage"));
 assert.ok(!js.includes("innerHTML"));
 assert.ok(!mini.includes("innerHTML"));
 assert.ok(Number(JSON.parse(read("package.json")).version.split(".")[1])>=16);
});
