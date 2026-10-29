// Tweedsie courier quests. Derived from the original save; no legacy save migration.
import {ROOMS,BUDS,CAVE,roomOf} from "./tweedsie-core.mjs";
export const COURIER_KEY="tweedleverse.tweedsie.courier.v1";
export const COURIER_VERSION=1;
export const CONTRACTS=Object.freeze([
 {id:"roots",title:"ROOT ROUTE EXPRESS",subtitle:"The Northside farmers need an honest underground courier.",
  places:["roots","orchard"],items:["root-sprig","orchard-crop"],reward:"BURROW BURST · SHIFT OR DASH BUTTON"},
 {id:"glow",title:"THE MIDNIGHT MESSENGER",subtitle:"Make a delivery that even the fireflies can follow.",
  places:["glow","fungus"],items:["glow-stem","fungus-bloom"],reward:"SCENT COMPASS · ACTIVE ROUTE HINTS"},
 {id:"market",title:"STEMSIDE'S MOST WANTED COURIER",subtitle:"Collect the impossible order and return home with the receipts.",
  places:["market","echo"],items:["market-sample","echo-leaf"],reward:"GOLDEN GOPHER COURIER BADGE"}
]);
const ids=new Set(CONTRACTS.map(c=>c.id));
export function initialCourier(){return {version:COURIER_VERSION,claimed:[],bursts:0}}
export function requirementsMet(tunnel,contract){
 return contract.places.every(id=>tunnel?.visits?.includes(id))&&contract.items.every(id=>tunnel?.found?.includes(id));
}
export function decodeCourier(raw,tunnel){
 if(!raw||typeof raw!=="object"||Array.isArray(raw)||raw.version!==COURIER_VERSION)return null;
 const proposed=Array.isArray(raw.claimed)?raw.claimed:[],claimed=[];
 for(const contract of CONTRACTS){
  if(proposed[claimed.length]===contract.id&&requirementsMet(tunnel,contract))claimed.push(contract.id);
  else break;
 }
 const bursts=Number.isInteger(raw.bursts)?Math.max(0,Math.min(raw.bursts,9999)):0;
 return {version:COURIER_VERSION,claimed,bursts:claimed.includes("roots")?bursts:0};
}
export function encodeCourier(progress,tunnel){
 const clean=decodeCourier({...progress,version:COURIER_VERSION},tunnel);
 if(!clean)throw new Error("Invalid courier save");
 return JSON.stringify(clean);
}
export const nextContract=progress=>CONTRACTS[progress?.claimed?.length]||null;
export const courierComplete=progress=>progress?.claimed?.length===CONTRACTS.length;
export const courierHome=tunnel=>tunnel?.finished===true||(tunnel?.room==="burrow"&&tunnel?.x<=230&&tunnel?.onGround===true);
export function canClaim(progress,tunnel){
 const next=nextContract(progress);
 return Boolean(next&&requirementsMet(tunnel,next)&&courierHome(tunnel));
}
export function claimContract(progress,tunnel){
 const next=nextContract(progress);
 if(!next)return {progress,claimed:null,feedback:"ALL CONTRACTS COMPLETE. YOUR UNION REPRESENTATIVE IS A MUSHROOM."};
 if(!requirementsMet(tunnel,next))return {progress,claimed:null,feedback:"DELIVERY INCOMPLETE. VISIT BOTH CAVES AND COLLECT BOTH ORDERED CURIOSITIES."};
 if(!courierHome(tunnel))return {progress,claimed:null,feedback:"BRING THE CARGO HOME TO TWEEDSIE'S ORIGINAL HOLE TO FILE THE DELIVERY."};
 return {progress:{...progress,claimed:[...progress.claimed,next.id]},claimed:next,
  feedback:"CONTRACT DELIVERED! "+next.reward+". TWEEDSIE: SAME HOLE. DIFFERENT PAYCHECK. WHICH IS ZERO."};
}
export function hasBurst(progress){return Boolean(progress?.claimed?.includes("roots"))}
export function hasCompass(progress){return Boolean(progress?.claimed?.includes("glow"))}
export function burst(p,progress,direction){
 if(!hasBurst(progress)||p?.finished||!Number.isFinite(direction)||direction===0)return {tunnel:p,courier:progress,used:false};
 const step=Math.sign(direction)*150;
 return {tunnel:{...p,x:Math.max(CAVE.radius,Math.min(CAVE.width-CAVE.radius,p.x+step))},
  courier:{...progress,bursts:Math.min(9999,progress.bursts+1)},used:true};
}
const connections=()=>new Map(ROOMS.map(room=>[room.id,[room.left,room.right,room.branch].filter(Boolean)]));
export function routeTo(from,to){
 if(from===to)return [from];
 const graph=connections(),queue=[[from]],seen=new Set([from]);
 while(queue.length){
  const path=queue.shift();
  for(const neighbor of graph.get(path.at(-1))||[]){
   if(seen.has(neighbor))continue;
   const next=[...path,neighbor];
   if(neighbor===to)return next;
   seen.add(neighbor);queue.push(next);
  }
 }
 return [];
}
export function compassHint(tunnel,progress){
 const contract=nextContract(progress);
 if(!contract)return "ALL ROUTES CLEARED. THE CORPORATE TOLL COLLECTOR HAS GIVEN UP.";
 const neededItem=contract.items.find(id=>!tunnel.found.includes(id));
 const neededPlace=contract.places.find(id=>!tunnel.visits.includes(id));
 const target=neededItem?BUDS.find(b=>b.id===neededItem)?.room:neededPlace;
 if(!target)return courierHome(tunnel)?"DELIVERY READY. CLAIM THE CONTRACT.":"CARGO COMPLETE. RETURN TO THE ORIGINAL HOLE TO CLAIM.";
 if(tunnel.room===target)return "CARGO IN THIS CAVERN. SEARCH THE PLATFORM LEDGES.";
 const path=routeTo(tunnel.room,target);
 return path.length>1?"COMPASS → "+roomOf(path[1]).name+" · DESTINATION: "+roomOf(target).name:"FOLLOW THE UNDERGROUND PASSAGES.";
}
