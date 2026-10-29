import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {PASSPORT_SOURCES,readPassport} from "../assets/passport-core.mjs";
import {MAP_KEY,MAP_VERSION,MAP_SIZE,PLACES,STREETS,TOUR_TASKS,initialWorld,decodeWorld,encodeWorld,placeOf,neighborsOf,shortestRoute,walkWorld,directionNeighbor,postcards,tourTasks,tourComplete,nodeHint} from "../assets/world-map-core.mjs";
const root=resolve(import.meta.dirname,"..");
const file=path=>readFileSync(resolve(root,path),"utf8");
function follow(state,target){
 const route=shortestRoute(state.current,target);
 assert.ok(route.length>0,"No route to "+target);
 for(const next of route.slice(1)){
  const r=walkWorld(state,next);
  assert.equal(r.arrived,true);state=r.state;
 }
 return state;
}
test("Stemside map has unique named nodes, internal-only game links, sane locations and connected roads",()=>{
 assert.equal(MAP_VERSION,1);assert.equal(PLACES.length,11);
 assert.equal(new Set(PLACES.map(p=>p.id)).size,PLACES.length);
 assert.equal(new Set(PLACES.filter(p=>p.postcard).map(p=>p.postcard)).size,10);
 assert.equal(PLACES.filter(p=>p.postcard).length,10);
 for(const place of PLACES){
  assert.ok(place.name&&place.district&&place.description&&place.quote);
  assert.ok(place.x>=0&&place.x<=MAP_SIZE.width&&place.y>=0&&place.y<=MAP_SIZE.height);
  assert.match(place.href,/^[a-z]+\.html$/);
  assert.ok(["play.html","arcade.html","tweedlepd.html","patrol.html","tweedsie.html","golf.html","passport.html","crossroads.html"].includes(place.href));
  assert.ok(file(place.href).includes("<!doctype html>"),place.href);
  assert.ok(neighborsOf(place.id).length>=1);
 }
 for(const [a,b] of STREETS){assert.ok(placeOf(a)&&placeOf(b));assert.ok(neighborsOf(a).includes(b));assert.ok(neighborsOf(b).includes(a))}
 for(const p of PLACES)assert.ok(shortestRoute("plaza",p.id).length>0,"Not reachable from plaza: "+p.id);
});
test("shortestRoute returns deterministic street-by-street routes and handles bad IDs",()=>{
 assert.deepEqual(shortestRoute("plaza","plaza"),["plaza"]);
 assert.deepEqual(shortestRoute("plaza","bad"),[]);
 assert.deepEqual(shortestRoute("bad","plaza"),[]);
 for(const start of PLACES){
  for(const target of PLACES){
   const route=shortestRoute(start.id,target.id);
   assert.equal(route[0],start.id);assert.equal(route.at(-1),target.id);
   for(let i=1;i<route.length;i++)assert.ok(neighborsOf(route[i-1]).includes(route[i]),route.join(" to "));
  }
 }
});
test("cannot teleport; walking a direct street earns only that visited node and a postcard",()=>{
 let state=initialWorld();
 assert.equal(state.current,"plaza");
 assert.deepEqual(state.visited,["plaza"]);
 assert.deepEqual(postcards(state),[]);
 const invalid=walkWorld(state,"golf");
 assert.equal(invalid.arrived,false);assert.strictEqual(invalid.state,state);
 const arrived=walkWorld(state,"tvpd");
 assert.equal(arrived.arrived,true);assert.equal(arrived.newPlace,true);
 state=arrived.state;
 assert.equal(state.current,"tvpd");assert.equal(state.steps,1);
 assert.equal(postcards(state)[0].postcard,"BADGE POSTCARD");
 assert.equal(walkWorld(state,"plaza").newPlace,false);
});
test("keyboard compass selects existing roads and rejects impossible directions",()=>{
 assert.ok(neighborsOf("plaza").includes(directionNeighbor("plaza","up")));
 assert.ok(neighborsOf("plaza").includes(directionNeighbor("plaza","down")));
 assert.equal(directionNeighbor("plaza","upwards"),null);
 assert.equal(directionNeighbor("nowhere","up"),null);
 assert.equal(directionNeighbor("arcade","left"),null);
});
test("all neighborhood tours and the grand tour require genuinely visiting locations",()=>{
 let state=initialWorld();
 assert.equal(tourComplete(state),false);
 assert.equal(tourTasks(state).filter(t=>t.complete).length,0);
 assert.equal(TOUR_TASKS.length,3);
 for(const place of PLACES.filter(p=>p.id!=="plaza"))state=follow(state,place.id);
 assert.equal(state.visited.length,PLACES.length);
 assert.equal(tourComplete(state),true);
 assert.equal(postcards(state).length,10);
 assert.equal(tourTasks(state).filter(t=>t.complete).length,3);
 assert.equal(tourTasks(state).every(t=>t.places.every(id=>state.visited.includes(id))),true);
 assert.equal(decodeWorld(JSON.parse(encodeWorld(state))).steps,state.steps);
});
test("invalid and corrupted map saves sanitize instead of affecting original games",()=>{
 for(const bad of [null,{},[],{version:999},"bad"])assert.equal(decodeWorld(bad),null);
 const dirty={version:1,current:"golf",visited:["bad","golf","golf","burrow"],steps:100000000};
 const cleaned=decodeWorld(dirty);
 assert.equal(cleaned.current,"golf");
 assert.deepEqual(cleaned.visited,["plaza","golf","burrow"]);
 assert.equal(cleaned.steps,99999);
 const broken=decodeWorld({version:1,current:"invalid",visited:"junk",steps:-5});
 assert.deepEqual(broken,initialWorld());
 assert.notEqual(MAP_KEY,"tweedleverse.stemside.save.v1");
 assert.ok(!PASSPORT_SOURCES.some(s=>s.key===MAP_KEY));
});
test("passport-sensitive dialogue is grounded in validated stamps",()=>{
 const none=readPassport({});
 assert.match(nodeHint("tvpd",none),/DONUT/);
 assert.match(nodeHint("golf",none),/NEW GOLFERS/);
 assert.match(nodeHint("spacealite",none),/BILLED/);
 const badgePassport={badges:[{id:"detective",earned:true},{id:"champion",earned:true},{id:"reversal",earned:true}]};
 assert.match(nodeHint("tvpd",badgePassport),/CLOSED/);
 assert.match(nodeHint("golf",badgePassport),/CHAMPION/);
 assert.match(nodeHint("spacealite",badgePassport),/REVERSAL/);
 assert.match(nodeHint("arcade",{count:8,badges:[]}),/8 LOCAL/);
 assert.equal(nodeHint("missing",none),"EXPLORE STEMSIDE.");
});
test("World page exposes actual map controls, read-only passport and safe isolated save",()=>{
 const html=file("world.html"),js=file("assets/world-map.js"),css=file("assets/world-map.css");
 for(const id of ["world-canvas","world-places","world-enter","world-walk","world-stop","world-postcards","world-victory","world-reset","world-tours","world-story"])
  assert.ok(html.includes('id="'+id+'"'),id);
 assert.ok(js.includes("shortestRoute("));
 assert.ok(js.includes("requestAnimationFrame("));
 assert.ok(js.includes("localStorage.getItem(source.key)"));
 assert.ok(js.includes("localStorage.setItem(MAP_KEY"));
 assert.ok(!js.includes("innerHTML"));
 assert.ok(js.includes("window.confirm("));
 assert.ok(css.includes("@media(max-width:720px)"));
 assert.ok(css.includes("prefers-reduced-motion"));
 for(const name of ["arcade.html","index.html","passport.html","crossroads.html"])assert.ok(file(name).includes('href="world.html"'),name);
 const pages=file(".github/workflows/pages.yml"),checks=file(".github/workflows/checks.yml");
 assert.ok(pages.includes("world.html public/"));
 assert.ok(checks.includes("assets/world-map-core.mjs"));
 assert.ok(checks.includes("assets/world-map.js"));
 assert.equal(JSON.parse(file("package.json")).version,"0.18.0");
});
