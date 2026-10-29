// TweedleVerse World Map v0.18: a pure local-only navigable fiction city.
// Canonical graph, validated internal destinations, collectible postcard progress.
// This world map never writes to another game's save.
export const MAP_KEY="tweedleverse.worldmap.local.v1";
export const MAP_VERSION=1;
export const MAP_SIZE=Object.freeze({width:1200,height:760});
export const PLACES=Object.freeze([
 {id:"plaza",name:"STEMSIDE PLAZA",district:"CIVIC CENTER",x:170,y:410,icon:"✳",href:"play.html",kind:"RPG",
  description:"The city begins here. A statue commemorates the first successful refund request, which was never processed.",
  postcard:null,quote:"TWEEDSIE: Same hole. Different city block."},
 {id:"tvpd",name:"TWEEDLEPD HQ",district:"CIVIC CENTER",x:410,y:255,icon:"★",href:"tweedlepd.html",kind:"DETECTIVE",
  description:"Chief McBadge's precinct. The evidence room contains one hundred donut boxes and zero answers.",
  postcard:"BADGE POSTCARD",quote:"CHIP: The only crime here is the coffee. CHIEF: IT'S UNDER INVESTIGATION."},
 {id:"coffee",name:"COFFEECHUCKS",district:"SOUTH STEMSIDE",x:345,y:570,icon:"☕",href:"play.html",kind:"RPG",
  description:"Chuck's coffee empire, where the punch card has thirty-seven pages of conditions.",
  postcard:"COFFEE RATION CARD",quote:"CHUCK: Every cup is free until you read the receipt."},
 {id:"arcade",name:"THE GAME ARCADE",district:"SOUTH STEMSIDE",x:150,y:655,icon:"▣",href:"arcade.html",kind:"HUB",
  description:"A glowing cabinet district with way too many adventures and absolutely no permit.",
  postcard:"ARCADE TOKEN",quote:"BUFFER BOB: This game machine costs less than the paperwork to turn it off."},
 {id:"tweedcorp",name:"TWEEDCORP TOWER",district:"CORPORATE ROW",x:645,y:315,icon:"▥",href:"crossroads.html",kind:"CROSSROADS",
  description:"Where Reggie's compliance department keeps the invoices that require invoices.",
  postcard:"UNSIGNED WORK ORDER",quote:"REGGIE: If the form is blank, you owe us for the opportunity to fill it."},
 {id:"video",name:"LACKLUSTER VIDEO",district:"SOUTH STEMSIDE",x:670,y:565,icon:"▶",href:"patrol.html",kind:"PATROL",
  description:"A VHS rental shop whose security footage is due back tomorrow.",
  postcard:"TOMORROW'S LATE FEE",quote:"MARTY: We rewind everything, including appointments and poor decisions."},
 {id:"commons",name:"PUBLIC COMMONS",district:"NORTH STEMSIDE",x:615,y:105,icon:"♧",href:"passport.html",kind:"PASSPORT",
  description:"The only publicly owned patch of the city. Reggie has sent a lawyer to measure the grass.",
  postcard:"PUBLIC SQUARE PERMIT",quote:"TWEEDSIE: You can't own the sky, Reg. REGGIE: I CAN LICENSE IT."},
 {id:"orchard",name:"NORTHSIDE FARMS",district:"NORTH STEMSIDE",x:845,y:175,icon:"✿",href:"tweedsie.html",kind:"TUNNELS",
  description:"Aboveground roots hide the longest, loudest gopher network in the county.",
  postcard:"NORTHSIDE ROOT MAP",quote:"FARMER: Somebody's collecting the crops from underneath again."},
 {id:"burrow",name:"TWEEDSIE'S BURROW",district:"UNDERGROUND ENTRANCE",x:1000,y:330,icon:"◉",href:"tweedsie.html",kind:"TUNNELS",
  description:"An entrance to eight linked caverns. Do not tell the tax department where it is.",
  postcard:"SECRET TUNNEL KEY",quote:"TWEEDSIE: Stay low, stay cool, and always remember your exit."},
 {id:"golf",name:"TWEEDLEGOLF CLUB",district:"THE FAIRWAYS",x:1025,y:500,icon:"⚑",href:"golf.html",kind:"GOLF",
  description:"Three tour holes, one custom course and more celebrity appearance fees than golfers.",
  postcard:"GOPHER DIVOT CARD",quote:"DUKE VON DIVOT: Every hole is a feature. REGGIE: Especially the billable ones."},
 {id:"spacealite",name:"SPACEALITE TOWER",district:"CORPORATE ROW",x:860,y:650,icon:"▤",href:"crossroads.html",kind:"CROSSROADS",
  description:"Reggie's interdimensional cable company. They once charged a silent radio for being quiet.",
  postcard:"QUIET INVOICE",quote:"REGGIE: Would you like to subscribe to the sound of nothing?"}
]);
export const STREETS=Object.freeze([
 ["plaza","tvpd"],["plaza","coffee"],["plaza","arcade"],["arcade","coffee"],
 ["coffee","video"],["tvpd","tweedcorp"],["tvpd","commons"],
 ["tweedcorp","commons"],["tweedcorp","video"],["tweedcorp","orchard"],
 ["commons","orchard"],["orchard","burrow"],["burrow","golf"],
 ["golf","video"],["golf","spacealite"],["video","spacealite"]
]);
export const TOUR_TASKS=Object.freeze([
 {id:"civic",title:"WHO'S IN CHARGE HERE?",places:["plaza","tvpd","tweedcorp"],reward:"CIVIC CONFUSION",
  description:"Visit City Plaza, TVPD and TweedCorp to learn who's supposedly running Stemside."},
 {id:"northside",title:"FROM THE FARM TO THE FAIRWAY",places:["orchard","burrow","golf"],reward:"UNDERGROUND SHORTCUT",
  description:"Visit Northside Farms, Tweedsie's Burrow and the golf course to trace the town's biggest mysterious hole."},
 {id:"southside",title:"THE LOCAL ECONOMY",places:["coffee","video","arcade","spacealite","commons"],reward:"THE SOUTH STEMSIDE SURVIVOR",
  description:"Tour CoffeeChucks, Lackluster, the Arcade, Spacealite and the Public Commons. Refunds remain fictional."}
]);
const ids=new Set(PLACES.map(p=>p.id));
const placeIndex=new Map(PLACES.map(p=>[p.id,p]));
const adjacency=new Map(PLACES.map(p=>[p.id,[]]));
for(const [a,b] of STREETS){adjacency.get(a).push(b);adjacency.get(b).push(a)}
export const placeOf=id=>placeIndex.get(id)||null;
export const neighborsOf=id=>[...(adjacency.get(id)||[])];
export function shortestRoute(start,target){
 if(!ids.has(start)||!ids.has(target))return [];
 if(start===target)return [start];
 const seen=new Set([start]),queue=[[start]];
 for(let i=0;i<queue.length;i++){
  const path=queue[i],current=path.at(-1);
  for(const neighbor of neighborsOf(current)){
   if(seen.has(neighbor))continue;
   const next=[...path,neighbor];
   if(neighbor===target)return next;
   seen.add(neighbor);queue.push(next);
  }
 }
 return [];
}
export const initialWorld=()=>({version:MAP_VERSION,current:"plaza",visited:["plaza"],steps:0});
export function decodeWorld(raw){
 if(!raw||typeof raw!=="object"||Array.isArray(raw)||raw.version!==MAP_VERSION)return null;
 const current=ids.has(raw.current)?raw.current:"plaza";
 const visited=Array.isArray(raw.visited)?[...new Set(raw.visited.filter(x=>typeof x==="string"&&ids.has(x)))]:["plaza"];
 if(!visited.includes("plaza"))visited.unshift("plaza");
 if(!visited.includes(current))visited.push(current);
 const steps=Number.isInteger(raw.steps)?Math.max(0,Math.min(raw.steps,99999)):0;
 return {version:MAP_VERSION,current,visited,steps};
}
export function encodeWorld(state){
 const clean=decodeWorld({...state,version:MAP_VERSION});
 if(!clean)throw new Error("Invalid world map state");
 return JSON.stringify(clean);
}
export function walkWorld(state,nextId){
 if(!ids.has(nextId)||!neighborsOf(state.current).includes(nextId))return {state,arrived:false,feedback:"THAT DISTRICT IS NOT CONNECTED TO YOUR CURRENT STREET."};
 const visited=state.visited.includes(nextId)?state.visited:[...state.visited,nextId];
 return {state:{...state,current:nextId,visited,steps:Math.min(99999,state.steps+1)},
  arrived:true,newPlace:!state.visited.includes(nextId),
  feedback:(placeOf(nextId)?.quote||"")};
}
export function directionNeighbor(current,direction){
 const origin=placeOf(current);
 if(!origin||!["up","down","left","right"].includes(direction))return null;
 const delta={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[direction];
 return neighborsOf(current).map(id=>{
  const target=placeOf(id),dx=target.x-origin.x,dy=target.y-origin.y;
  const len=Math.hypot(dx,dy),dot=(dx*delta[0]+dy*delta[1])/len;
  return {id,dot,dist:len};
 }).filter(x=>x.dot>=0.38).sort((a,b)=>b.dot-a.dot||a.dist-b.dist)[0]?.id||null;
}
export const postcards=state=>state.visited.filter(id=>placeOf(id)?.postcard).map(id=>({place:id,postcard:placeOf(id).postcard,name:placeOf(id).name}));
export const tourTasks=state=>TOUR_TASKS.map(t=>({...t,complete:t.places.every(id=>state.visited.includes(id))}));
export const tourComplete=state=>PLACES.every(p=>state.visited.includes(p.id));
export function nodeHint(placeId,passport){
 const badge=passport?.badges||[];
 const earned=id=>badge.some(b=>b.id===id&&b.earned);
 if(placeId==="tvpd")return earned("detective")?"CHIP RECOGNIZES YOU: THE DONUT FILE IS OFFICIALLY CLOSED.":"THE CHIEF STILL THINKS SOMEONE STOLE HIS DONUTS. SOLVE CASE #001.";
 if(placeId==="burrow")return earned("courier")?"TWEEDSIE: GOLDEN GOPHER COURIER, REPORTING FOR THE UNPAID SHIFT.":"TWEEDSIE KNOWS EVERY BACK ROUTE. FILE A COURIER DELIVERY FOR HIS APPROVAL.";
 if(placeId==="golf")return earned("champion")?"CINDY CHIPSHOT: THE GRAND STEM CHAMPION IS HERE!":"TGA IS ACCEPTING NEW GOLFERS AND CUSTOM COURSE ARCHITECTS.";
 if(placeId==="spacealite")return earned("reversal")?"THE SPACEALITE BILLING REVERSAL IS STILL MAKING REGGIE SWEAT.":"REGGIE JUST BILLED SOMEONE FOR WALKING PAST THIS BUILDING.";
 if(placeId==="arcade")return passport?.count?"YOUR PASSPORT CURRENTLY RECOGNIZES "+passport.count+" LOCAL ACHIEVEMENT STAMPS.":"THE ARCADE IS OPEN. SOMEHOW THE GOVERNMENT NEVER CHARGED ADMISSION.";
 return placeOf(placeId)?.description||"EXPLORE STEMSIDE.";
}
