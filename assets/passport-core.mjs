// TweedleVerse Universe Passport v0.16
// A read-only, same-origin summary of individual first-party browser saves.
// Intentionally has no storage, DOM, networking, or side-effect APIs.
import {SAVE_KEY,decodeSave,LANDMARK_IDS} from "./progression-core.mjs";
import {PD_SAVE_KEY,decodePD} from "./pd-core.mjs";
import {PATROL_SAVE_KEY,decodePatrol,PATROL_CALLS} from "./patrol-core.mjs";
import {TUNNEL_KEY,decodeTunnel,ROOMS,VAULT_REQUIRED} from "./tweedsie-core.mjs";
import {COURIER_KEY,decodeCourier,CONTRACTS} from "./tunnel-contracts.mjs";
import {GOLF_KEY,decodeGolf,defaultTiles,HOLES,CELEBS} from "./golf-core.mjs";
import {CUP_KEY,decodeCup,cupRank} from "./golf-cup.mjs";

export const PASSPORT_SOURCES=Object.freeze([
 {id:"stemside",key:SAVE_KEY,title:"WELCOME TO STEMSIDE",href:"play.html",decode:decodeSave},
 {id:"pd",key:PD_SAVE_KEY,title:"TWEEDLEPD CASE #001",href:"tweedlepd.html",decode:decodePD},
 {id:"patrol",key:PATROL_SAVE_KEY,title:"TWEEDLEPD PATROL SHIFT",href:"patrol.html",decode:decodePatrol},
 {id:"tunnels",key:TUNNEL_KEY,title:"ADVENTURES OF TWEEDSIE",href:"tweedsie.html",decode:decodeTunnel},
 {id:"courier",key:COURIER_KEY,title:"TWEEDSIE COURIER",href:"tweedsie.html",decode:null},
 {id:"golf",key:GOLF_KEY,title:"TWEEDLEGOLF PROTOUR",href:"golf.html",decode:decodeGolf},
 {id:"cup",key:CUP_KEY,title:"GRAND STEM CUP",href:"golf.html",decode:decodeCup}
]);
const valid=(x)=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const unique=(x)=>new Set(Array.isArray(x)?x:[]);
const award=(id,series,title,desc,earned,href,symbol)=>Object.freeze({id,series,title,desc,earned:Boolean(earned),href,symbol});
export function readPassport(raw,options={}){
 // caller supplies serialized strings, not direct storage access.
 const saves={},sources=[];
 for(const src of PASSPORT_SOURCES){
  let decoded=null,condition="missing";
  const value=raw&&typeof raw==="object"?raw[src.id]:null;
  if(value!==undefined&&value!==null){
   try{
    if(typeof value!=="string"||value.length>180000)throw Error("Invalid save size or format");
    const parsed=JSON.parse(value);
    decoded=src.id==="courier"?(saves.tunnels?decodeCourier(parsed,saves.tunnels):null):src.decode(parsed);
    condition=decoded?"loaded":"unrecognized";
   }catch{condition="unreadable"}
  }
  saves[src.id]=decoded;
  sources.push({id:src.id,title:src.title,href:src.href,status:condition});
 }
 return snapshot(saves,sources,options);
}
export function snapshot(saves={},sources=null,options={}){
 const stem=saves.stemside||null,police=saves.pd||null,patrol=saves.patrol||null;
 const tunnel=saves.tunnels||null,courier=saves.courier||null,golf=saves.golf||null,cup=saves.cup||null;
 const badgeList=[
  award("coffee","stemside","COFFEE RUN SURVIVOR","Complete the original Stemside Coffee Run.",stem?.quest===3,"play.html","☕"),
  award("tourist","stemside","ALL-ACCESS TOURIST","Discover all 13 official Stemside landmarks.",stem?.visited?.length===LANDMARK_IDS.length,"play.html","◈"),
  award("tweedleball","stemside","TWEEDLEBALL MEDALIST","Earn the absurdist Tweedleball medal.",stem?.medal===true,"play.html","◎"),
  award("rewrite","stemside","SCRIPT REWRITER","Finish one of Stemside's original script rewrites.",stem?.story?.finished===true,"play.html","✎"),
  award("reversal","stemside","BILLING REVERSAL","Finish the Great Billing Reversal finale.",stem?.finale?.stage===5&&["refund","commons"].includes(stem?.finale?.ending),"play.html","▣"),
  award("detective","pd","UNPAID DETECTIVE","Solve the actual missing donut case with real evidence.",police?.solved===true,"tweedlepd.html","⌕"),
  award("deputy","pd","SENIOR UNPAID DEPUTY","Complete three TVPD patrol dispatch calls after Case #001.",police?.solved===true&&patrol?.resolved?.length===PATROL_CALLS.length,"patrol.html","★"),
  award("explorer","tweedsie","BURROW CARTOGRAPHER","Discover every cavern in the connected underground map.",tunnel?.visits?.length===ROOMS.length,"tweedsie.html","⬡"),
  award("vault","tweedsie","UNDERGROUND LEGEND","Open the Loud Vault with enough fictional cargo.",tunnel?.finished===true&&tunnel?.found?.length>=VAULT_REQUIRED,"tweedsie.html","✳"),
  award("courier","tweedsie","GOLDEN GOPHER COURIER","File all three authentic underground delivery contracts.",tunnel!==null&&courier?.claimed?.length===CONTRACTS.length,"tweedsie.html","➜"),
  award("tourcard","golf","TWEEDLEGOLF TOUR CARD","Hole out on all three ProTour courses.",golf&&HOLES.every(h=>Number.isInteger(golf.results?.[h.id])&&golf.results[h.id]>0),"golf.html","⚑"),
  award("architect","golf","COURSE ARCHITECT","Make a real design edit or rename your clubhouse.",golf&&(golf.clubName!=="THE PUBLIC LINKS"||golf.tiles.some((t,i)=>t!==defaultTiles()[i])),"golf.html","▦"),
  award("vip","golf","VIP CLUBHOUSE","Invite all four eligible fictional celebrities.",golf?.guests?.length===CELEBS.length,"golf.html","♢"),
  award("cup","golf","GRAND STEM FINISHER","Finish a full three-hole Grand Stem Cup.",cup?.status==="completed"&&cup?.scores?.length===HOLES.length,"golf.html","🏆"),
  award("champion","golf","GRAND STEM CHAMPION","Place first in the Grand Stem Cup against scripted rivals.",cup?.status==="completed"&&cupRank(cup)===1,"golf.html","♛")
 ];
 const badges=Object.freeze(badgeList);
 const earned=badges.filter(x=>x.earned);
 const series=Object.freeze([
  {id:"stemside",title:"STEMSIDE RPG",href:"play.html",badges:badges.filter(x=>x.series==="stemside")},
  {id:"pd",title:"TWEEDLEPD",href:"tweedlepd.html",badges:badges.filter(x=>x.series==="pd")},
  {id:"tweedsie",title:"ADVENTURES OF TWEEDSIE",href:"tweedsie.html",badges:badges.filter(x=>x.series==="tweedsie")},
  {id:"golf",title:"TWEEDLEGOLF PROTOUR",href:"golf.html",badges:badges.filter(x=>x.series==="golf")}
 ]);
 const count=earned.length;
 const tier=count>=15?"STEMSIDE MYTH":count>=12?"UNIVERSE ARCHIVIST":count>=9?"INTERDIMENSIONAL REGULAR":count>=6?"SOUTHSIDE EXPLORER":count>=3?"CROSSOVER CITIZEN":"UNPAID VISITOR";
 // Crossover headlines are generated only from observed combinations of validated saves.
 const headlines=[];
 if(police?.solved&&tunnel?.found?.length>=3)headlines.push({
  title:"TVPD OPENS A NEW INVESTIGATION",body:"Chief McBadge suspects Tweedsie has been tunneling under the evidence locker. Chip is quietly checking the actual holes first."});
 if(tunnel?.visits?.includes("orchard")&&golf?.results?.chucks)headlines.push({
  title:"FARM UNDERPASS SPOTTED AT THE FAIRWAY",body:"A gopher-sized exit appeared beneath a golf course. The groundskeeper asked whether it counts as a bunker."});
 if(stem?.finale?.stage===5&&cup?.status==="completed")headlines.push({
  title:"REGGIE DEMANDS A RECOUNT",body:"After a billing scandal and a celebrity golf tournament, Reggie Bands insists both were caused by improper invoice alignment."});
 if(courier?.claimed?.length===CONTRACTS.length&&police?.solved)headlines.push({
  title:"CARGO DELIVERED, WARRANT NOT FOUND",body:"TVPD received a delivery receipt from below ground. Nobody is actually wanted. The department remains optimistic."});
 if(headlines.length===0)headlines.push({
  title:"STEMSIDE AWAITS ITS FIRST CROSSOVER",body:"Play different adventures on this same browser to reveal original local newspaper stories connecting their characters."});
 const fileStates=sources||PASSPORT_SOURCES.map(x=>({id:x.id,title:x.title,href:x.href,status:saves[x.id]?"loaded":"missing"}));
 return Object.freeze({badges,earned,series,headlines:Object.freeze(headlines),sources:Object.freeze(fileStates),
  count,total:badges.length,tier,percentage:Math.round(count/badges.length*100),
  gamesWithStamps:series.filter(s=>s.badges.some(b=>b.earned)).length,
  note:"No accounts or cross-game save writes. Stamps appear only when a compatible first-party save exists in this browser."});
}
export function summaryText(passport){
 const result=["TWEEDLEVERSE UNIVERSE PASSPORT",passport.count+" / "+passport.total+" stamps · "+passport.tier];
 for(const group of passport.series){
  const unlocked=group.badges.filter(b=>b.earned);
  result.push(group.title+": "+unlocked.length+" / "+group.badges.length);
  for(const badge of unlocked)result.push("  ✓ "+badge.title);
 }
 result.push("Local browser progress only. No online account or synced achievement service.");
 return result.join("\n");
}
