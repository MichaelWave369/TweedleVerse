import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {TUNNEL_KEY,TUNNEL_VERSION,CAVE,ROOMS,BUDS,VAULT_REQUIRED,initialTunnel,decodeTunnel,encodeTunnel,roomOf,exitsOf,traverse,moveTunnel,collectBud,finishVault} from "../assets/tweedsie-core.mjs";
import {GOLF_KEY,GOLF_VERSION,WIDTH,HEIGHT,COLS,ROWS,TERRAIN,CLUBS,HOLES,CELEBS,defaultTiles,holeById,initialGolf,decodeGolf,encodeGolf,prestige,guestsFor,chooseHole,setClub,paintTile,renameClub,inviteGuest,swing,ballAtCup} from "../assets/golf-core.mjs";
const root=resolve(import.meta.dirname,".."),read=p=>readFileSync(resolve(root,p),"utf8");
test("Tunnel map is original, connected, branching and persistent",()=>{
 assert.ok(ROOMS.length>=8);assert.ok(BUDS.length>=6);
 assert.equal(new Set(ROOMS.map(r=>r.id)).size,ROOMS.length);
 const ids=new Set(ROOMS.map(r=>r.id));
 for(const r of ROOMS)for(const e of exitsOf(r.id))assert.ok(ids.has(e.target));
 const seen=new Set(["burrow"]),todo=["burrow"];while(todo.length){const id=todo.shift();for(const e of exitsOf(id))if(!seen.has(e.target)){seen.add(e.target);todo.push(e.target)}}
 assert.equal(seen.size,ROOMS.length,"All tunnels accessible from original hole");
 assert.notEqual(TUNNEL_KEY,GOLF_KEY);
 const saved=initialTunnel();assert.deepEqual(decodeTunnel(JSON.parse(encodeTunnel(saved))),saved);
});
test("Tweedsie movement and jumps enforce map physics",()=>{
 const p=initialTunnel();
 const horizontal=moveTunnel(p,1,false,.03);assert.ok(horizontal.x>p.x);assert.ok(horizontal.x-p.x<=CAVE.speed*.03+.001);
 const jumping=moveTunnel(p,0,true,.03);assert.ok(jumping.y<p.y);assert.ok(jumping.vy<0);
 assert.deepEqual(moveTunnel(p,NaN,false,NaN),p);
 let edge={...p,x:CAVE.width-18};edge=moveTunnel(edge,1,false,.04);assert.equal(edge.x,CAVE.width-18);
});
test("Tunnel travel must occur at accessible doors, and buds collected once",()=>{
 let p=initialTunnel();assert.strictEqual(traverse(p,"right"),p);
 p={...p,x:1124};p=traverse(p,"right");assert.equal(p.room,"roots");
 p={...p,x:350,y:445,onGround:true};
 const got=collectBud(p);assert.equal(got.found.id,"root-sprig");assert.equal(collectBud(got.state).found,null);
 const invalid=traverse(got.state,"west");assert.strictEqual(invalid,got.state);
});
test("The vault requires enough collections and cannot unlock from other rooms",()=>{
 let p=initialTunnel();const found=BUDS.slice(0,VAULT_REQUIRED).map(b=>b.id);
 const elsewhere={...p,found,x:1100};assert.strictEqual(finishVault(elsewhere),elsewhere);
 p={...p,room:"vault",x:1100,found:found.slice(0,-1)};assert.equal(finishVault(p).finished,false);
 p={...p,found};const f=finishVault(p);assert.equal(f.finished,true);
 assert.deepEqual(decodeTunnel(JSON.parse(encodeTunnel(f))),{...f,vy:0,onGround:true,visits:["burrow"]});
});
test("Bad tunnel saves sanitize coordinates and reject foreign data",()=>{
 for(const x of [null,{},[],{version:123}])assert.equal(decodeTunnel(x),null);
 const p=decodeTunnel({version:1,room:"evil",x:Infinity,y:-200,found:["root-sprig","root-sprig","fake"],visits:["fake"],finished:true});
 assert.equal(p.room,"burrow");assert.equal(p.y,0);assert.deepEqual(p.found,["root-sprig"]);assert.equal(p.finished,false);
});
test("Golf contains three holes, different terrain and four clubs",()=>{
 assert.equal(GOLF_VERSION,1);assert.equal(HOLES.length,3);assert.equal(CLUBS.length,4);
 assert.equal(new Set(HOLES.map(h=>h.id)).size,HOLES.length);
 for(const h of HOLES){assert.equal(h.tiles.length,COLS*ROWS);assert.ok(h.tiles.every(x=>TERRAIN.includes(x)))}
 assert.deepEqual(decodeGolf(JSON.parse(encodeGolf(initialGolf()))),initialGolf());
 assert.notEqual(GOLF_KEY,TUNNEL_KEY);
 assert.equal(holeById("custom",defaultTiles()).tiles.length,COLS*ROWS);
});
test("Golf shots use club distances, power, aim, penalties, and do not mutate original",()=>{
 const p=initialGolf();
 const first=swing(p,0,1);assert.equal(first.state.shots,1);assert.ok(first.state.ball.x>p.ball.x);
 assert.equal(p.shots,0);assert.equal(swing(p,NaN,1).event,"INVALID");
 const stronger=swing(p,0,1),weaker=swing(p,0,.2);assert.ok(stronger.state.ball.x>weaker.state.ball.x);
 const other=setClub(p,"putter");assert.equal(other.club,"putter");assert.equal(setClub(p,"laser"),p);
 const wet={...p,ball:{x:260,y:110},club:"driver"}; // water strip in default layout at column 5, row 0.
 const sunk=swing(wet,0,.25);assert.equal(sunk.event,"WATER");assert.equal(sunk.state.shots,2);assert.deepEqual(sunk.state.ball,wet.ball);
 const h=holeById(p.hole,p.tiles);
 const near={...p,ball:{x:h.cup.x-40,y:h.cup.y},club:"putter"};
 const result=swing(near,0,40/78);assert.equal(result.event,"HOLED");assert.equal(result.state.results[p.hole],1);
 assert.equal(ballAtCup(result.state),true);
});
test("Designer tile painting stays bounded, tee and flag protected, guests persist",()=>{
 let p=initialGolf();const i=2*COLS+2;
 const next=paintTile(p,i,"water");assert.equal(next.tiles[i],"water");assert.notEqual(next.tiles,p.tiles);
 assert.equal(p.tiles[i],defaultTiles()[i]);
 assert.strictEqual(paintTile(p,4*COLS+1,"water"),p);
 assert.strictEqual(paintTile(p,4*COLS+13,"water"),p);
 assert.strictEqual(paintTile(p,-1,"water"),p);
 p=renameClub(p,"Northside Tee Club <script>");assert.equal(p.clubName,"Northside Tee Club script");
 const luxury=Array.from({length:COLS*ROWS},()=>"water");luxury[4*COLS+1]="fairway";luxury[4*COLS+13]="green";
 p={...p,tiles:luxury};assert.ok(prestige(p.tiles)>=CELEBS[0].threshold);assert.ok(guestsFor(p.tiles).length>0);
 const invited=inviteGuest(p,CELEBS[0].id);assert.equal(invited.invited,true);
 assert.equal(inviteGuest(invited.state,CELEBS[0].id).invited,false);
 assert.deepEqual(decodeGolf(JSON.parse(encodeGolf(invited.state))).guests,[CELEBS[0].id]);
 assert.equal(chooseHole(p,"custom").hole,"custom");
});
test("Invalid golf progress sanitizes save inputs",()=>{
 for(const x of [null,{},[],{version:2}])assert.equal(decodeGolf(x),null);
 const p=decodeGolf({version:1,hole:"fake",ball:{x:Infinity,y:-4},tiles:["hack"],results:{chucks:-100,reggie:2},clubName:"  ",guests:["ghost"]});
 assert.equal(p.hole,"chucks");assert.equal(p.ball.y,10);assert.equal(p.tiles.length,COLS*ROWS);assert.deepEqual(p.guests,[]);
 assert.equal(p.results.reggie,2);assert.equal(p.results.chucks,undefined);
});
test("Both playable games have entry links, controls and deployment coverage",()=>{
 const hub=read("arcade.html"),t=read("tweedsie.html"),g=read("golf.html");
 for(const url of ['href="tweedsie.html"','href="golf.html"'])assert.ok(hub.includes(url));
 assert.ok(t.includes("tunnel-canvas"));assert.ok(g.includes("golf-canvas"));
 for(const [path,match] of [["assets/tweedsie-game.js","from \"./tweedsie-core.mjs\""],["assets/golf-game.js","from \"./golf-core.mjs\""]])assert.ok(read(path).includes(match));
 for(const f of ["tweedsie.html","golf.html"])assert.ok(read(".github/workflows/pages.yml").includes(f));
 assert.ok(read(".github/workflows/checks.yml").includes("assets/golf-core.mjs"));
 assert.ok(read("README.md").includes("TweedleGolf ProTour"));
 assert.ok(!read("assets/golf-game.js").includes("innerHTML"));
 assert.ok(!read("assets/tweedsie-game.js").includes("innerHTML"));
});
