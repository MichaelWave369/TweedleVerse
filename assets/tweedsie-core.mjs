// Original Tweedsie tunnel-metroidvania vertical slice. Pure deterministic state machine.
// All plants, buds, and corporations are fictional comedy props.
export const TUNNEL_KEY="tweedleverse.tweedsie.tunnels.v1";
export const TUNNEL_VERSION=1;
export const CAVE={width:1200,height:640,ground:552,gravity:1300,jump:-550,speed:250,radius:18};
export const ROOMS=Object.freeze([
 {id:"burrow",name:"THE ORIGINAL HOLE",color:"#224b52",left:null,right:"roots",branch:null,desc:"Tweedsie's place. The rent is zero unless Reggie finds out."},
 {id:"roots",name:"ROOT CELLAR",color:"#4b533b",left:"burrow",right:"glow",branch:"orchard",desc:"The farmers' northside roots reach all the way down here."},
 {id:"glow",name:"FIREFLY SUBWAY",color:"#334d70",left:"roots",right:"fungus",branch:null,desc:"The tunnel transit authority consists of six unemployed fireflies."},
 {id:"fungus",name:"THE MUSHROOM EXCHANGE",color:"#57446b",left:"glow",right:"echo",branch:"market",desc:"Every fungus claims to be a licensed financial advisor."},
 {id:"echo",name:"ECHO SHAFT",color:"#695247",left:"fungus",right:"vault",branch:null,desc:"Your last three complaints are still echoing. Reggie charges per syllable."},
 {id:"vault",name:"THE LOUD VAULT",color:"#494b70",left:"echo",right:null,branch:null,desc:"Safekeeping for the farmers' loudest fictional harvest."},
 {id:"orchard",name:"NORTHSIDE FARM UNDERPASS",color:"#4a5b3e",left:"roots",right:"market",branch:"roots",desc:"An absurdly enormous network under a very small garden."},
 {id:"market",name:"THE UNDERGROUND EXCHANGE",color:"#41615a",left:"orchard",right:"fungus",branch:"fungus",desc:"Underground merchants trade buds, coupons and expired metaphors."}
]);
export const BUDS=Object.freeze([
 {id:"root-sprig",room:"roots",x:350,y:445,name:"Royal Root Sprig"},
 {id:"glow-stem",room:"glow",x:680,y:390,name:"Fluorescent Loud Bud"},
 {id:"fungus-bloom",room:"fungus",x:900,y:445,name:"Midnight Bloom"},
 {id:"echo-leaf",room:"echo",x:390,y:390,name:"Echo Leaf"},
 {id:"orchard-crop",room:"orchard",x:720,y:390,name:"Northside Garden Stash"},
 {id:"market-sample",room:"market",x:875,y:445,name:"Market Mystery Nug"}
]);
export const VAULT_REQUIRED=5;
const ids=new Set(ROOMS.map(r=>r.id)),budIds=new Set(BUDS.map(b=>b.id));
export const roomOf=id=>ROOMS.find(r=>r.id===id)||ROOMS[0];
export const platformLayout=room=>[
 {x:0,y:CAVE.ground,width:CAVE.width,height:88},
 {x:255,y:478,width:215,height:18},
 {x:585,y:425,width:195,height:18},
 {x:830,y:478,width:220,height:18},
 ...(room==="echo"||room==="orchard"?[{x:375,y:340,width:155,height:18}]:[])
];
export function initialTunnel(){return {version:TUNNEL_VERSION,room:"burrow",x:120,y:CAVE.ground-46,vy:0,onGround:true,found:[],finished:false,visits:["burrow"]}}
export function decodeTunnel(raw){
 if(!raw||typeof raw!=="object"||Array.isArray(raw)||raw.version!==TUNNEL_VERSION)return null;
 const base=initialTunnel();const room=ids.has(raw.room)?raw.room:"burrow";
 const found=Array.isArray(raw.found)?[...new Set(raw.found.filter(x=>typeof x==="string"&&budIds.has(x)))]:[];
 const visits=Array.isArray(raw.visits)?[...new Set(raw.visits.filter(x=>typeof x==="string"&&ids.has(x)))]:["burrow"];
 const x=typeof raw.x==="number"&&Number.isFinite(raw.x)?Math.max(CAVE.radius,Math.min(CAVE.width-CAVE.radius,raw.x)):base.x;
 const y=typeof raw.y==="number"&&Number.isFinite(raw.y)?Math.max(0,Math.min(CAVE.ground-46,raw.y)):base.y;
 const finished=raw.finished===true&&room==="vault"&&found.length>=VAULT_REQUIRED;
 return {version:TUNNEL_VERSION,room,x,y,vy:0,onGround:true,found,finished,visits:visits.includes("burrow")?visits:["burrow",...visits]};
}
export function encodeTunnel(p){const s=decodeTunnel({...p,version:TUNNEL_VERSION});if(!s)throw Error("Invalid tunnel save");return JSON.stringify(s)}
export function moveTunnel(p,axis,jump,dt){
 if(p.finished)return p;
 const t=Number.isFinite(dt)?Math.min(0.04,Math.max(0,dt)):0;
 const a=Number.isFinite(axis)?Math.max(-1,Math.min(1,axis)):0;
 if(t===0)return p;
 const oldY=p.y;
 let vy=p.onGround&&jump?CAVE.jump:p.vy;
 vy=Math.min(850,vy+CAVE.gravity*t);
 let y=p.y+vy*t;
 const x=Math.max(CAVE.radius,Math.min(CAVE.width-CAVE.radius,p.x+a*CAVE.speed*t));
 let onGround=false;
 for(const platform of platformLayout(p.room)){
  const landing=platform.y-46;
  if(vy>=0&&oldY<=landing+3&&y>=landing&&x+CAVE.radius>platform.x&&x-CAVE.radius<platform.x+platform.width){
   y=landing;vy=0;onGround=true;break;
  }
 }
 if(y>CAVE.height+35){y=CAVE.ground-46;vy=0;onGround=true}
 return {...p,x,y,vy,onGround};
}
export const exitsOf=room=>[
 {id:"left",label:"WEST PASSAGE",x:76,target:roomOf(room).left},
 {id:"right",label:"EAST PASSAGE",x:1124,target:roomOf(room).right},
 {id:"branch",label:"SECRET SHAFT",x:590,target:roomOf(room).branch}
].filter(e=>e.target);
export function passageNear(p){return exitsOf(p.room).find(e=>Math.abs(p.x-e.x)<88&&p.onGround)||null}
export function traverse(p,direction){
 const exit=exitsOf(p.room).find(e=>e.id===direction);
 if(!exit||Math.abs(p.x-exit.x)>=88||!p.onGround)return p;
 const room=exit.target;
 return {...p,room,x:direction==="left"?1040:direction==="right"?160:550,y:CAVE.ground-46,vy:0,onGround:true,
  visits:p.visits.includes(room)?p.visits:[...p.visits,room]};
}
export function collectBud(p){
 if(p.finished)return {state:p,found:null};
 const bud=BUDS.find(b=>b.room===p.room&&!p.found.includes(b.id)&&Math.abs(p.x-b.x)<49&&Math.abs(p.y-b.y)<65);
 if(!bud)return {state:p,found:null};
 return {state:{...p,found:[...p.found,bud.id]},found:bud};
}
export function finishVault(p){
 if(p.room!=="vault"||p.found.length<VAULT_REQUIRED||p.x<965||!p.onGround)return p;
 return {...p,finished:true};
}
export const progressMessage=p=>p.finished?"THE LOUD VAULT IS SAFE · UNDERGROUND LEGEND BADGE EARNED":
 p.found.length+" / "+BUDS.length+" FICTIONAL BUDS FOUND · "+p.visits.length+" / "+ROOMS.length+" CAVES DISCOVERED";
