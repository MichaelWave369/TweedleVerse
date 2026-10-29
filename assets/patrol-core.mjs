// TweedlePD Patrol Shift v0.13. Pure deterministic movement and dispatch decisions.
// No runtime network calls, real enforcement practices, violence or third-party media.
import {decodePD} from "./pd-core.mjs";
export const PATROL_SAVE_KEY="tweedleverse.tweedlepd.patrol.v1";
export const PATROL_VERSION=1;
export const PATROL_WORLD=Object.freeze({width:1200,height:800,speed:235,arrivalRadius:95});
export const PATROL_STOPS=Object.freeze([
 {id:"precinct",name:"TVPD HQ",x:220,y:630,icon:"★",detail:"The Department of Dubious Decisions"},
 {id:"coffee",name:"COFFEECHUCKS",x:335,y:205,icon:"☕",detail:"Emergency: expired coupons"},
 {id:"video",name:"LACKLUSTER VIDEO",x:720,y:595,icon:"▣",detail:"Emergency: time-travel noise"},
 {id:"tower",name:"SPACEALITE TOWER",x:1000,y:205,icon:"▥",detail:"Emergency: charged silence"}
]);
export const PATROL_CALLS=Object.freeze([
 {id:"coupon",stop:"coffee",number:"TVPD DISPATCH #042",title:"DRIVE-BY COUPON ASSAULT",
  setup:"DISPATCH: Multiple pedestrians hit by expired CoffeeChucks coupons. Suspect is apparently a malfunctioning wind machine. Chief McBadge requests tactical helicopters.",
  witness:"CHUCK: I was just trying to advertise breakfast! The coupon cannon went off when Reggie cut the power.",
  choices:[
   {id:"helicopter",label:"REQUEST AN AIRSTRIKE ON THE COUPON CANNON",reply:"CHIP: The cannon's made of cardboard, Chief. The helicopter would cost more than the entire town."},
   {id:"deescalate",label:"DISABLE THE CANNON AND CLEAN UP THE STREET",reply:"CHIP: Coupon launcher unplugged, sidewalks cleared. CHUCK: So the free coffee coupons are still valid? CHIP: No. Let's not start another case."},
   {id:"arrest",label:"ARREST EVERYONE HOLDING A COUPON",reply:"BUFFER BOB: That includes the entire TVPD precinct. Please reconsider."}
  ],correct:"deescalate",result:"CALL RESOLVED · NO ONE WAS CHARGED FOR BREATHING NEAR THE COUPONS."},
 {id:"noise",stop:"video",number:"TVPD DISPATCH #043",title:"THE NOISE COMPLAINT FROM TOMORROW",
  setup:"DISPATCH: Lackluster Video has received a noise complaint from next Tuesday. The complainant hasn't been born yet, and the stereo is switched off.",
  witness:"MARTY: The complaint was filed next week and our speakers broke last month. This case is somehow overdue.",
  choices:[
   {id:"calendar",label:"CONFISCATE EVERY CALENDAR IN STEMSIDE",reply:"MARTY: That's exactly how we lost September last year."},
   {id:"timestamp",label:"CHECK THE DATE AND CLOSE THE IMPOSSIBLE COMPLAINT",reply:"CHIP: The alleged noise hasn't happened. Complaint closed as premature. MARTY: Can we also cancel tomorrow's late fees? CHIP: I'm only one rookie."},
   {id:"speaker",label:"ARREST THE SILENT SPEAKERS",reply:"CHIP: Arresting silence was Reggie's idea. We don't have cuffs small enough for a mute button."}
  ],correct:"timestamp",result:"CALL RESOLVED · NO CALENDARS WERE HARMED."},
 {id:"silence",stop:"tower",number:"TVPD DISPATCH #044",title:"THE UNAUTHORIZED QUIET FEE",
  setup:"DISPATCH: Reggie Bands filed a theft report. Somebody has allegedly stolen the silence around Spacealite Tower. His invoice says the public owes 9000 credits.",
  witness:"REGGIE BANDS: MY SILENCE IS INTELLECTUAL PROPERTY! TWEEDSIE: Bro, you've been yelling for seven minutes.",
  choices:[
   {id:"pay",label:"PAY REGGIE FOR THE SOUND OF NOTHING",reply:"BUFFER BOB: That sets a terrible precedent. You would have to invoice every nap."},
   {id:"void",label:"VOID THE FAKE FEE AND ISSUE A PUBLIC NOTICE",reply:"CHIP: No theft occurred. You cannot own the absence of noise. TWEEDSIE: Case closed, Reg. Please keep your mouth shut for the evidence."},
   {id:"silence-arrest",label:"DETAIN THE SILENCE FOR QUESTIONING",reply:"CHIEF McBADGE: It exercised its right to remain silent! CHIP: That was already the problem."}
  ],correct:"void",result:"CALL RESOLVED · REGGIE'S SILENCE IS ON THE HOUSE."}
]);
const callIds=new Set(PATROL_CALLS.map(c=>c.id));
const finite=n=>typeof n==="number"&&Number.isFinite(n);
const clamp=(x,min,max)=>Math.max(min,Math.min(max,x));
const starter=()=>({x:220,y:630});
export function initialPatrol(){return {version:PATROL_VERSION,car:starter(),resolved:[],mistakes:0}}
export function detectiveEligible(raw){return decodePD(raw)?.solved===true}
export function decodePatrol(raw){
 if(!raw||typeof raw!=="object"||Array.isArray(raw)||raw.version!==PATROL_VERSION)return null;
 const coords=raw.car&&typeof raw.car==="object"&&!Array.isArray(raw.car)?raw.car:{};
 const car={x:clamp(finite(coords.x)?coords.x:starter().x,22,PATROL_WORLD.width-22),
  y:clamp(finite(coords.y)?coords.y:starter().y,22,PATROL_WORLD.height-22)};
 // Only a strict, ordered prefix is valid: a forged third call cannot skip prior dispatches.
 const claims=Array.isArray(raw.resolved)?raw.resolved:[];
 const resolved=[];
 for(let i=0;i<PATROL_CALLS.length;i++){
  if(claims[i]!==PATROL_CALLS[i].id)break;
  resolved.push(PATROL_CALLS[i].id);
 }
 return {version:PATROL_VERSION,car,resolved,mistakes:Number.isInteger(raw.mistakes)?clamp(raw.mistakes,0,99):0};
}
export function encodePatrol(progress){
 const p=decodePatrol({...progress,version:PATROL_VERSION});
 if(!p)throw new Error("Invalid patrol progress");
 return JSON.stringify(p);
}
export function callFor(progress){return PATROL_CALLS[progress?.resolved?.length]||null}
export function shiftComplete(progress){return progress?.resolved?.length===PATROL_CALLS.length}
export function checkpoint(progress){
 const call=callFor(progress);
 return call?PATROL_STOPS.find(s=>s.id===call.stop):null;
}
export function distance(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
export function atDispatch(progress){
 const goal=checkpoint(progress);
 return goal!==null&&distance(progress.car,goal)<=PATROL_WORLD.arrivalRadius;
}
export function moveCar(progress,x,y,seconds){
 if(shiftComplete(progress))return progress;
 const dx=finite(x)?clamp(x,-1,1):0,dy=finite(y)?clamp(y,-1,1):0;
 const dt=finite(seconds)?clamp(seconds,0,0.06):0;
 const len=Math.hypot(dx,dy);
 if(len===0||dt===0)return progress;
 const factor=Math.min(1,1/len)*PATROL_WORLD.speed*dt;
 return {...progress,car:{
  x:clamp(progress.car.x+dx*factor,22,PATROL_WORLD.width-22),
  y:clamp(progress.car.y+dy*factor,22,PATROL_WORLD.height-22)}};
}
export function respond(progress,choiceId){
 const call=callFor(progress);
 if(!call)return {progress,correct:false,feedback:"SHIFT COMPLETE. GO HOME BEFORE REGGIE BILLS YOU FOR OVERTIME."};
 if(!atDispatch(progress))return {progress,correct:false,feedback:"DRIVE THE SQUAD CAR INTO THE ACTIVE DISPATCH ZONE FIRST."};
 const choice=call.choices.find(c=>c.id===choiceId);
 if(!choice)return {progress,correct:false,feedback:"UNKNOWN RESPONSE. DISPATCH CANNOT READ THAT FORM."};
 if(choice.id!==call.correct){
  return {progress:{...progress,mistakes:Math.min(99,progress.mistakes+1)},correct:false,
   feedback:choice.reply+" · DISPATCH: NOT A SAFE OR USEFUL SOLUTION. TRY AGAIN, ROOKIE."};
 }
 return {progress:{...progress,resolved:[...progress.resolved,call.id]},correct:true,
  feedback:choice.reply+" · "+call.result};
}
export function shiftStatus(progress){
 return shiftComplete(progress)?"SHIFT COMPLETE · SENIOR UNPAID DEPUTY BADGE AWARDED":
  "ACTIVE CALL "+(progress.resolved.length+1)+" / "+PATROL_CALLS.length+" · "+callFor(progress).title;
}
