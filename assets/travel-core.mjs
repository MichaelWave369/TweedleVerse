// v0.9: pure wayfinding and portable, validated local-save serialization.
// Neither module uses a browser API, network request, eval, or mutable globals.
import {WORLD,OBJECTIVES} from "./game-core.mjs";
import {TAPE_STEPS,RESIDENTS} from "./residents-core.mjs";
import {GIG_STEPS} from "./gig-core.mjs";
import {REWRITES,SCENES} from "./story-core.mjs";
import {ENCOUNTERS} from "./battle-core.mjs";
import {decodeSave,encodeSave,LANDMARK_IDS} from "./progression-core.mjs";
import {finaleDestination,initialFinale} from "./finale-core.mjs";

export const NAV_MODES=Object.freeze([
 {id:"auto",label:"NEXT STORY OBJECTIVE"},
 {id:"coffee",label:"COFFEE RUN"},
 {id:"tape",label:"TOMORROW'S TAPE"},
 {id:"gig",label:"LENNY'S GIG"},
 {id:"finale",label:"BILLING REVERSAL FINALE"},
 {id:"script",label:"PAGE 42 REWRITE"},
 {id:"battles",label:"CORPORATE DISPUTES"},
 {id:"passport",label:"PASSPORT STAMPS"},
 {id:"free",label:"FREE EXPLORATION"}
]);
const validModes=new Set(NAV_MODES.map(m=>m.id));
export const PORTABLE_FORMAT="tweedleverse.stemside.portable";
export const PORTABLE_VERSION=1;
export const MAX_SAVE_BYTES=65536;

function target(id,type,places){
 const p=type==="npc"?RESIDENTS.find(n=>n.id===id):places.find(p=>p.id===id);
 if(!p)return null;
 return {id,type,name:p.name,x:type==="npc"?p.x:p.x/100*WORLD.width,
  y:type==="npc"?p.y:p.y/100*WORLD.height};
}
function objectiveTarget(step,places,reason){
 if(!step)return null;
 const type=step.type==="npc"?"npc":"place";
 const goal=target(step.id,type,places);
 return goal?{...goal,reason:reason||step.title}:null;
}
export function resolveWaypoint(progress,mode,places){
 if(!progress||!Array.isArray(places))return null;
 const query=validModes.has(mode)?mode:"auto";
 if(query==="free")return null;
 if(query==="auto"){
   for(const candidate of ["coffee","finale","tape","gig","script","battles","passport"]){
     const next=resolveWaypoint(progress,candidate,places);
     if(next)return {...next,mode:candidate};
   }
   return null;
 }
 if(query==="finale"){
   const scene=finaleDestination(progress.finale||initialFinale(),progress);
   return scene?objectiveTarget(scene,places,"The Great Billing Reversal"):null;
 }
 if(query==="coffee"){
   const id=OBJECTIVES[progress.quest];
   return id?objectiveTarget({id,type:"place",title:"Coffee Run: "+(progress.quest+1)+"/3"},places,"Coffee Run: stop "+(progress.quest+1)+" of 3"):null;
 }
 if(query==="tape"){
   const step=TAPE_STEPS[progress.tapeQuest];
   return objectiveTarget(step,places,step?.title);
 }
 if(query==="gig"){
   const step=GIG_STEPS[progress.gigQuest];
   return objectiveTarget(step,places,step?.title);
 }
 if(query==="script"){
   if(progress.story?.finished)return null;
   if(progress.story?.rewrite){
     const step=REWRITES[progress.story.rewrite];
     return step?objectiveTarget({type:"place",id:step.target},places,step.objective):null;
   }
   if(progress.quest!==3)return resolveWaypoint(progress,"coffee",places);
   for(const id of Object.keys(SCENES)){
     if(!progress.story?.heard?.includes(id))
       return objectiveTarget({type:"place",id,title:"Earn a Plot Point: "+SCENES[id].place},places);
   }
   return null; // Script is ready in the sidebar, no destination to invent.
 }
 if(query==="battles"){
   const id=Object.keys(ENCOUNTERS).find(id=>!progress.wins?.includes(id));
   return id?objectiveTarget({type:"place",id,title:"Dispute: "+ENCOUNTERS[id].title},places):null;
 }
 if(query==="passport"){
   const id=LANDMARK_IDS.find(id=>!progress.visited?.includes(id));
   return id?objectiveTarget({type:"place",id,title:"Uncollected passport stamp"},places):null;
 }
 return null;
}
export function mapPosition(position,width,height){
 return {x:Math.max(0,Math.min(width,position.x/WORLD.width*width)),
  y:Math.max(0,Math.min(height,position.y/WORLD.height*height))};
}
const directionLabels=["E","SE","S","SW","W","NW","N","NE"];
export function compass(player,waypoint){
 if(!waypoint)return null;
 const x=waypoint.x-player.x,y=waypoint.y-player.y;
 const distance=Math.round(Math.hypot(x,y));
 const octant=Math.round(Math.atan2(y,x)/(Math.PI/4));
 return {distance,direction:directionLabels[(octant+8)%8],arrived:distance<=105};
}
export function encodePortableSave(progress){
 const validated=JSON.parse(encodeSave(progress));
 return JSON.stringify({format:PORTABLE_FORMAT,schema:PORTABLE_VERSION,save:validated},null,2);
}
export function decodePortableSave(text){
 if(typeof text!=="string"||text.length===0||text.length>MAX_SAVE_BYTES)return null;
 try{
  const data=JSON.parse(text);
  if(!data||typeof data!=="object"||Array.isArray(data))return null;
  if(Object.hasOwn(data,"format")){
   if(data.format!==PORTABLE_FORMAT||data.schema!==PORTABLE_VERSION)return null;
   return decodeSave(data.save);
  }
  // Also accept a previously copied raw local save from v0.6-v0.8.
  return decodeSave(data);
 }catch{return null}
}
