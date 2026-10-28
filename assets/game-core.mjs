// Pure game logic: usable from a browser and testable under Node, without platform APIs.
export const WORLD = Object.freeze({width:1600,height:1120,speed:235,interactRadius:105});
export const OBJECTIVES = Object.freeze(["coffeechucks","stems-league","tweedcorp"]);
export function clamp(v,min,max){return Math.min(max,Math.max(min,v))}
export function normalizedDirection(x,y){
 const magnitude=Math.hypot(x,y);
 return magnitude>1?{x:x/magnitude,y:y/magnitude}:{x,y};
}
export function move(player,axes,dt){
 const direction=normalizedDirection(axes.x,axes.y);
 const seconds=clamp(dt,0,.05);
 return {x:clamp(player.x+direction.x*WORLD.speed*seconds,32,WORLD.width-32),
         y:clamp(player.y+direction.y*WORLD.speed*seconds,32,WORLD.height-32)};
}
export function nearby(places,x,y,maxDistance=WORLD.interactRadius){
 let best=null;let distance=maxDistance;
 for(const place of places){
   const delta=Math.hypot(place.x/100*WORLD.width-x,place.y/100*WORLD.height-y);
   if(delta<distance){best=place;distance=delta}
 }
 return best;
}
export function advanceQuest(stage,placeId){
 return stage>=0&&stage<3&&OBJECTIVES[stage]===placeId?stage+1:stage;
}
// Power is 0..1. Offset is target position relative to the center, -1..1.
// Timing & power must both be inside the threshold; no random success.
export function scoreShot(offset,power,steady=false){
 const distance=steady?0:Math.abs(offset);
 const error=Math.abs(power-.62);
 if(distance<.22&&error<.115)return 3;
 if(distance<.55&&error<.27)return 1;
 return 0;
}
export function arenaResult(score,shots){
 if(shots<5)return "in_progress";
 return score>=6?"medal":"try_again";
}
export function normalizedPlaces(payload){
 if(!payload||!Array.isArray(payload.places))throw new Error("No city locations");
 const ids=new Set();
 return payload.places.map(p=>{
   if(!p||typeof p.id!=="string"||ids.has(p.id)||typeof p.name!=="string"||
      !Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x<0||p.x>100||p.y<0||p.y>100){
      throw new Error("Invalid Stemside landmark");
   }
   ids.add(p.id);
   return p;
 });
}
