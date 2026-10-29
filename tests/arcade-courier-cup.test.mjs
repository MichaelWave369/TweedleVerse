import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {initialTunnel,BUDS,CAVE,ROOMS} from "../assets/tweedsie-core.mjs";
import {COURIER_KEY,CONTRACTS,initialCourier,decodeCourier,encodeCourier,nextContract,requirementsMet,courierHome,canClaim,claimContract,hasBurst,hasCompass,burst,routeTo,compassHint} from "../assets/tunnel-contracts.mjs";
import {GOLF_KEY,HOLES,initialGolf,chooseHole} from "../assets/golf-core.mjs";
import {CUP_KEY,CUP_VERSION,CUP_RIVALS,initialCup,decodeCup,encodeCup,cupActive,cupHole,cupTotal,startCup,recordCupHole,advanceCup,cupStandings,cupRank,cupBadge} from "../assets/golf-cup.mjs";
const root=resolve(import.meta.dirname,"..");const read=p=>readFileSync(resolve(root,p),"utf8");
const allTunnel=()=>({...initialTunnel(),visits:ROOMS.map(r=>r.id),found:BUDS.map(b=>b.id)});
function finishRound(cup,golf,scores){
 for(const score of scores){
  const course=HOLES[cup.scores.length];
  assert.equal(golf.hole,course.id);
  golf={...golf,ball:{...course.cup},shots:score};
  const answer=recordCupHole(cup,golf);
  assert.equal(answer.recorded,true);
  cup=answer.cup;
  if(cup.status==="between"){
   const next=advanceCup(cup,golf);assert.equal(next.advanced,true);
   cup=next.cup;golf=next.golf;
  }
 }
 return {cup,golf};
}
test("Courier missions have unique IDs and required cave collectibles",()=>{
 assert.equal(CONTRACTS.length,3);
 assert.equal(new Set(CONTRACTS.map(c=>c.id)).size,3);
 for(const contract of CONTRACTS){
  assert.equal(contract.places.length,2);
  assert.equal(contract.items.length,2);
  for(const place of contract.places)assert.ok(ROOMS.some(r=>r.id===place));
  for(const item of contract.items)assert.ok(BUDS.some(b=>b.id===item));
 }
 assert.notEqual(COURIER_KEY,GOLF_KEY);
 assert.notEqual(COURIER_KEY,CUP_KEY);
});
test("Courier deliveries cannot be claimed early, far from home or out of order",()=>{
 let tunnel=allTunnel(),courier=initialCourier();
 assert.equal(canClaim(courier,tunnel),true);
 const far={...tunnel,room:"roots",x:500};
 assert.equal(canClaim(courier,far),false);
 assert.equal(claimContract(courier,far).claimed,null);
 const missing={...tunnel,found:[]};
 assert.equal(claimContract(courier,missing).claimed,null);
 assert.equal(nextContract(courier).id,"roots");
 for(const contract of CONTRACTS){
  const claim=claimContract(courier,tunnel);
  assert.equal(claim.claimed.id,contract.id);
  courier=claim.progress;
 }
 assert.equal(nextContract(courier),null);
 assert.equal(claimContract(courier,tunnel).claimed,null);
 assert.deepEqual(decodeCourier(JSON.parse(encodeCourier(courier,tunnel)),tunnel),courier);
});
test("Courier milestones unlock a bounded dash and a legitimate map hint",()=>{
 const tunnel=allTunnel();
 const first=claimContract(initialCourier(),tunnel).progress;
 assert.equal(hasBurst(first),true);assert.equal(hasCompass(first),false);
 const denied=burst(initialTunnel(),initialCourier(),1);
 assert.equal(denied.used,false);
 const nearEdge={...initialTunnel(),x:CAVE.width-25};
 const d=burst(nearEdge,first,1);
 assert.equal(d.used,true);
 assert.equal(d.tunnel.x,CAVE.width-CAVE.radius);
 assert.equal(d.courier.bursts,1);
 assert.equal(d.tunnel.room,"burrow");
 const second=claimContract(first,tunnel).progress;
 assert.equal(hasCompass(second),true);
 const route=routeTo("burrow","market");
 assert.equal(route[0],"burrow");
 assert.equal(route.at(-1),"market");
 const hint=compassHint({...initialTunnel(),visits:["burrow"],found:[]},second);
 assert.match(hint,/COMPASS/);
});
test("Courier save validates milestone claims using original game progress",()=>{
 const done=allTunnel();
 assert.equal(decodeCourier(null,done),null);
 assert.equal(decodeCourier({version:9,claimed:["roots"]},done),null);
 const forged=decodeCourier({version:1,claimed:["market","roots"],bursts:90000},done);
 assert.deepEqual(forged.claimed,[]);
 assert.equal(forged.bursts,0);
 const sparse={...done,found:[]};
 const invalid=decodeCourier({version:1,claimed:["roots","glow"],bursts:6},sparse);
 assert.deepEqual(invalid.claimed,[]);
 const legit=decodeCourier({version:1,claimed:["roots"],bursts:4},done);
 assert.deepEqual(legit.claimed,["roots"]);
 assert.equal(legit.bursts,4);
});
test("Grand Stem Cup starts only once, advances in order and saves the final leaderboard",()=>{
 let golf=initialGolf(),cup=initialCup();
 let a=startCup(cup,golf);assert.equal(a.started,true);cup=a.cup;golf=a.golf;
 assert.equal(startCup(cup,golf).started,false);
 assert.equal(cupActive(cup),true);
 assert.equal(cupHole(cup),"chucks");
 assert.equal(recordCupHole(cup,golf).recorded,false);
 assert.equal(advanceCup(cup,golf).advanced,false);
 const finished=finishRound(cup,golf,[4,5,3]);cup=finished.cup;
 assert.equal(cup.status,"completed");
 assert.deepEqual(cup.scores,[4,5,3]);
 assert.equal(cupTotal(cup),12);
 assert.equal(cup.last,12);
 assert.equal(cup.best,12);
 assert.equal(cup.rounds,1);
 assert.equal(cupStandings(cup).length,CUP_RIVALS.length+1);
 assert.equal(cupRank(cup),2);
 assert.equal(cupBadge(cup),"OFFICIAL GRAND STEM FINISHER");
 assert.equal(recordCupHole(cup,finished.golf).recorded,false);
 assert.deepEqual(decodeCup(JSON.parse(encodeCup(cup))),cup);
});
test("Golf Cup rankings, best score, replay, tied ranks and fake rival labeling",()=>{
 let result=startCup(initialCup(),initialGolf());
 result=finishRound(result.cup,result.golf,[3,3,3]);
 assert.equal(result.cup.last,9);
 assert.equal(cupRank(result.cup),1);
 assert.equal(cupBadge(result.cup),"GRAND STEM CUP CHAMPION");
 let second=startCup(result.cup,result.golf);
 second=finishRound(second.cup,second.golf,[7,7,7]);
 assert.equal(second.cup.rounds,2);
 assert.equal(second.cup.last,21);
 assert.equal(second.cup.best,9);
 assert.equal(cupRank(second.cup),4);
 assert.ok(cupStandings(second.cup).every(x=>x.player||CUP_RIVALS.some(r=>r.name===x.name)));
});
test("Cup state codec rejects fabricated scores and malformed rounds",()=>{
 for(const bad of [null,{},[],{version:55},"bad"])assert.equal(decodeCup(bad),null);
 const forged=decodeCup({version:CUP_VERSION,status:"completed",scores:[2,-50,Infinity],rounds:-500,best:-1,last:1});
 assert.equal(forged.status,"idle");
 assert.deepEqual(forged.scores,[]);
 assert.equal(forged.rounds,0);
 assert.equal(forged.best,null);
 const legitimate=decodeCup({version:1,status:"between",scores:[4],rounds:1,best:10,last:11});
 assert.equal(legitimate.status,"between");
});
test("Courier and Cup UI controls are wired to working handlers and isolated saves",()=>{
 const cave=read("tweedsie.html"),golf=read("golf.html");
 const caveJS=read("assets/tweedsie-game.js"),golfJS=read("assets/golf-game.js");
 for(const id of ["courier-claim","courier-status","courier-compass","tunnel-burst"])assert.ok(cave.includes('id="'+id+'"'),id);
 for(const id of ["cup-start","cup-status","cup-scores","cup-leaderboard","cup-podium"])assert.ok(golf.includes('id="'+id+'"'),id);
 assert.ok(caveJS.includes("claimContract("));assert.ok(caveJS.includes("burst("));assert.ok(caveJS.includes("localStorage.setItem(COURIER_KEY"));
 assert.ok(golfJS.includes("recordCupHole("));assert.ok(golfJS.includes("localStorage.setItem(CUP_KEY"));
 assert.ok(read("package.json").includes('"version": "0.15.0"'));
 for(const f of ["tunnel-contracts.mjs","golf-cup.mjs"])assert.ok(read(".github/workflows/checks.yml").includes(f));
});
