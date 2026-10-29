// TweedleGolf: offline, fictional three-hole tournament with an independent save.
// The opponent scorecards are scripted characters, not online golfers or real tournaments.
import {HOLES,chooseHole,ballAtCup} from "./golf-core.mjs";
export const CUP_KEY="tweedleverse.tweedlegolf.cup.v1";
export const CUP_VERSION=1;
export const CUP_RIVALS=Object.freeze([
 {id:"duke",name:"DUKE VON DIVOT",strokes:11},
 {id:"cindy",name:"CINDY CHIPSHOT",strokes:14},
 {id:"reggie",name:"REGGIE BANDS III",strokes:17}
]);
const HOLE_IDS=HOLES.map(h=>h.id);
export function initialCup(){return {version:CUP_VERSION,status:"idle",scores:[],rounds:0,best:null,last:null}}
const isScore=n=>Number.isInteger(n)&&n>=1&&n<=30;
export function decodeCup(raw){
 if(!raw||typeof raw!=="object"||Array.isArray(raw)||raw.version!==CUP_VERSION)return null;
 const scores=Array.isArray(raw.scores)?raw.scores.slice(0,HOLES.length).filter(isScore):[];
 const rounds=Number.isInteger(raw.rounds)?Math.max(0,Math.min(9999,raw.rounds)):0;
 const best=isScoreTotal(raw.best)?raw.best:null;
 const last=isScoreTotal(raw.last)?raw.last:null;
 let status=raw.status;
 if(!["idle","playing","between","completed"].includes(status))status="idle";
 if(status==="completed"&&scores.length!==HOLES.length)status="idle";
 if(status==="between"&&(scores.length===0||scores.length>=HOLES.length))status="idle";
 if(status==="playing"&&scores.length>=HOLES.length)status="idle";
 if(status==="idle")scores.length=0;
 return {version:CUP_VERSION,status,scores,rounds,best,last};
}
const isScoreTotal=n=>Number.isInteger(n)&&n>=HOLES.length&&n<=HOLES.length*30;
export function encodeCup(p){const x=decodeCup({...p,version:CUP_VERSION});if(!x)throw Error("Invalid cup save");return JSON.stringify(x)}
export const cupActive=p=>p?.status==="playing"||p?.status==="between";
export const cupHole=p=>cupActive(p)?HOLE_IDS[p.scores.length]:null;
export const cupTotal=p=>p.scores.reduce((sum,n)=>sum+n,0);
export function startCup(cup,golf){
 if(cupActive(cup))return {cup,golf,started:false};
 return {cup:{...cup,status:"playing",scores:[]},golf:chooseHole(golf,HOLE_IDS[0]),started:true};
}
export function recordCupHole(cup,golf){
 if(cup.status!=="playing"||golf.hole!==HOLE_IDS[cup.scores.length]||!ballAtCup(golf)||!isScore(golf.shots))
  return {cup,recorded:false};
 const scores=[...cup.scores,golf.shots];
 if(scores.length===HOLE_IDS.length){
  const total=scores.reduce((a,b)=>a+b,0);
  return {cup:{...cup,status:"completed",scores,rounds:Math.min(9999,cup.rounds+1),
    last:total,best:cup.best===null?total:Math.min(cup.best,total)},recorded:true};
 }
 return {cup:{...cup,status:"between",scores},recorded:true};
}
export function advanceCup(cup,golf){
 if(cup.status!=="between")return {cup,golf,advanced:false};
 const id=HOLE_IDS[cup.scores.length];
 if(!id)return {cup,golf,advanced:false};
 return {cup:{...cup,status:"playing"},golf:chooseHole(golf,id),advanced:true};
}
export function cupStandings(cup){
 if(cup.status!=="completed")return [];
 const players=[...CUP_RIVALS.map(p=>({name:p.name,strokes:p.strokes,player:false})),
 {name:"YOU · THE UNPAID PRO",strokes:cup.last,player:true}];
 return players.sort((a,b)=>a.strokes-b.strokes||(a.player?-1:1));
}
export const cupRank=cup=>cupStandings(cup).findIndex(p=>p.player)+1;
export const cupBadge=cup=>cup.status==="completed"?(cupRank(cup)===1?"GRAND STEM CUP CHAMPION":"OFFICIAL GRAND STEM FINISHER"):null;
