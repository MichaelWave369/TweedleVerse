// TweedleVerse v0.6: transparent, local-only, versioned RPG progression.
// This pure module does not access browsers, storage, network or global state.
import {WORLD,clamp} from "./game-core.mjs";
import {initialStory,REWRITES} from "./story-core.mjs";
import {ENCOUNTERS} from "./battle-core.mjs";
import {TAPE_REWARD} from "./residents-core.mjs";
import {GIG_REWARD} from "./gig-core.mjs";

export const SAVE_KEY="tweedleverse.stemside.save.v1";
export const SAVE_VERSION=3; // Same storage key; versions 1 and 2 migrate automatically.
export const LANDMARK_SOUVENIRS=Object.freeze({
 "whole-moods":{name:"Mood Receipt",description:"Certifies that your feelings were properly billed."},
 "coffeecharles":{name:"Executive Stirrer",description:"Same coffee. Fancy little stick."},
 "biestro":{name:"Seven-Foot Menu",description:"The appetizer takes three pages to describe."},
 "royal-club":{name:"Royal Paddle Polish",description:"Not a paddle. Just the polish."},
 "north-invitational":{name:"VIP Parking Warning",description:"Your car is not on the guest list."},
 "spacealite":{name:"Reality Invoice",description:"Payable in every known dimension."},
 "tweedcorp":{name:"Unsigned Work Order",description:"Authorized by nobody. Enforced by everyone."},
 "coffeechucks":{name:"CoffeeChucks Coupon",description:"Valid for one cup, subject to 97 clauses."},
 "stems-league":{name:"Southside Scorecard",description:"Smudged but somehow official."},
 "lackluster":{name:"Tomorrow's VHS Receipt",description:"Already overdue next Thursday."},
 "taco-bell":{name:"Mystery Combo Wrapper",description:"A burger inside a taco inside a complaint."},
 "reggies-reggie":{name:"Bag of Mostly Stems",description:"The receipt weighs more than the product."},
 "snublishers":{name:"Giant Fake Check",description:"Redeemable nowhere, but excellent for photographs."}
});
export const LANDMARK_IDS=Object.freeze(Object.keys(LANDMARK_SOUVENIRS));
export const RANKS=Object.freeze([
 {xp:0,name:"UNPAID INTERN"},
 {xp:40,name:"SIDEWALK INVESTIGATOR"},
 {xp:100,name:"SOUTHSIDE REGULAR"},
 {xp:190,name:"PAPERWORK REBEL"},
 {xp:300,name:"STEMSIDE LEGEND"}
]);
const isObj=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const int=(n,max,def=0)=>Number.isInteger(n)&&n>=0&&n<=max?n:def;
const uniqueKnown=(items,known,limit)=>Array.isArray(items)?
  [...new Set(items.filter(x=>typeof x==="string"&&known.has(x)))].slice(0,limit):[];
export function initialProgress(){
 return {version:SAVE_VERSION,player:{x:215,y:690},quest:0,medal:false,story:initialStory(),wins:[],visited:[],interactions:0,tapeQuest:0,gigQuest:0};
}
export function decodeSave(data){
 if(!isObj(data)||![1,2,SAVE_VERSION].includes(data.version))return null;
 const start=initialProgress();
 const visits=uniqueKnown(data.visited,new Set(LANDMARK_IDS),LANDMARK_IDS.length);
 const wins=uniqueKnown(data.wins,new Set(Object.keys(ENCOUNTERS)),Object.keys(ENCOUNTERS).length);
 const heard=uniqueKnown(data.story?.heard,new Set(["coffeechucks","lackluster","tweedcorp"]),3);
 const rewrite=typeof data.story?.rewrite==="string"&&Object.hasOwn(REWRITES,data.story.rewrite)?data.story.rewrite:null;
 const points=Math.min(heard.length,Number.isInteger(data.story?.points)?clamp(data.story.points,0,3):0);
 const player=isObj(data.player)?{
  x:clamp(Number.isFinite(data.player.x)?data.player.x:start.player.x,32,WORLD.width-32),
  y:clamp(Number.isFinite(data.player.y)?data.player.y:start.player.y,32,WORLD.height-32)
 }:start.player;
 const quest=int(data.quest,3);
 const validRewrite=quest===3?rewrite:null;
 return {
  version:SAVE_VERSION,
  player,quest,medal:data.medal===true,
  story:{points,heard,rewrite:validRewrite,finished:validRewrite!==null&&data.story?.finished===true},
  wins,visited:visits,interactions:int(data.interactions,1000000),tapeQuest:int(data.tapeQuest,4),gigQuest:int(data.gigQuest,5)
 };
}
export function encodeSave(progress){
 const snapshot=decodeSave({...progress,version:SAVE_VERSION});
 if(!snapshot)throw new Error("Cannot encode progress");
 return JSON.stringify(snapshot);
}
export function visitLandmark(progress,id){
 if(!Object.hasOwn(LANDMARK_SOUVENIRS,id)||progress.visited.includes(id))return {...progress};
 return {...progress,visited:[...progress.visited,id]};
}
export function inventory(progress){
 const items=progress.visited.filter(id=>Object.hasOwn(LANDMARK_SOUVENIRS,id))
  .map(id=>({id,...LANDMARK_SOUVENIRS[id]}));
 if(progress.tapeQuest===4)items.push(TAPE_REWARD);
 if(progress.gigQuest===5)items.push(GIG_REWARD);
 return items;
}
export function experience(progress){
 return progress.visited.length*5
   +progress.story.heard.length*12
   +progress.quest*10
   +(progress.quest===3?25:0)
   +(progress.medal?35:0)
   +progress.wins.length*30
   +(progress.story.finished?45:0)
   +(progress.tapeQuest===4?50:0)
   +(progress.gigQuest===5?60:0);
}
export function rankFor(xp){
 const score=Number.isFinite(xp)?Math.max(0,xp):0;
 return RANKS.filter(r=>score>=r.xp).at(-1);
}
export function passportStatus(progress){
 const stamps=progress.visited.length;
 if(stamps===LANDMARK_IDS.length)return "FULL PASSPORT · EVERY CORPORATE SIN DOCUMENTED";
 if(stamps>=8)return "8+ STAMPS · DISCOUNT MAY BE WITHHELD";
 if(stamps>=3)return "3+ STAMPS · OFFICIALLY A PUBLIC NUISANCE";
 return stamps+" / "+LANDMARK_IDS.length+" LANDMARK STAMPS";
}
export function journalEntries(progress,places=[]){
 const names=new Map(places.map(p=>[p.id,p.name]));
 const entries=[];
 if(progress.gigQuest===5)entries.push("LENNY'S GIG: Saved the Southside show. Gold-Plated Backstage Pass awarded.");
 else if(progress.gigQuest>0)entries.push("LENNY'S GIG: Rehearsal task "+progress.gigQuest+" of 5.");
 if(progress.tapeQuest===4)entries.push("TOMORROW'S TAPE: Returned to Marty. Film credit awarded.");
 else if(progress.tapeQuest>0)entries.push("TOMORROW'S TAPE: Clue "+progress.tapeQuest+" of 4 uncovered.");
 if(progress.story.finished)entries.push("PAGE 42 REWRITTEN: "+REWRITES[progress.story.rewrite].label+". Corporate reality was amended.");
 if(progress.medal)entries.push("TGA PRACTICE: Earned a Southside Stems League medal.");
 for(const id of progress.wins)entries.push("RESOLVED: "+ENCOUNTERS[id].title+".");
 if(progress.quest===3)entries.push("COFFEE RUN: Completed. Free coffee still pending.");
 else entries.push("COFFEE RUN: Step "+(progress.quest+1)+" of 3. Paperwork continues.");
 for(const id of [...progress.visited].reverse().slice(0,5))entries.push("PASSPORT STAMP: "+(names.get(id)||id)+".");
 if(entries.length<2)entries.push("The good news: nobody has charged you for reading this journal. Yet.");
 return entries.slice(0,9);
}
