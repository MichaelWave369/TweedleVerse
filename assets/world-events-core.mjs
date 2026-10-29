// TweedleVerse World Events v0.19: pure story encounters on the existing street graph.
// This module does not read/write localStorage; never grants gameplay authority to other games.
import {placeOf} from "./world-map-core.mjs";
export const EVENTS_KEY="tweedleverse.worldmap.encounters.v1";
export const EVENTS_VERSION=1;
export const EVENTS=Object.freeze([
 {id:"sidewalk",title:"THE SIDEWALK SUBSCRIPTION",label:"STREET CASE #019-A",unlock:[],
  summary:"Reggie has begun billing pedestrians for stepping on publicly owned pavement. Chuck and Chip want answers.",
  award:"PUBLIC SIDEWALK DEFENDER",scenes:[
   {place:"coffee",speaker:"CHUCK",setup:"CHUCK: Reggie sent me twelve invoices for people walking past CoffeeChucks. One bill includes a convenience fee for blinking.",
    prompt:"What is the best first lead?",
    options:[
     {id:"receipt",label:"TAKE THE ITEMIZED INVOICE AS EVIDENCE",correct:true,response:"CHUCK: Thank you. It even bills the shadow of my coffee sign. That's one suspiciously ambitious invoice."},
     {id:"pay",label:"PAY EVERY BILL AND APOLOGIZE TO REGGIE",correct:false,response:"CHUCK: That doesn't establish the charge is valid. I have enough subscriptions already."},
     {id:"cuff",label:"ARREST A PEDESTRIAN FOR HAVING FEET",correct:false,response:"CHIP: Being able to walk is still legal, as far as I've checked."}
    ]},
   {place:"tvpd",speaker:"CHIP",setup:"CHIP: The city charter says public sidewalks belong to the town, and Spacealite has no street-use franchise. Chief McBadge keeps demanding donuts.",
    prompt:"What should Chip do with the evidence?",
    options:[
     {id:"charter",label:"MATCH THE INVOICE AGAINST THE PUBLIC CHARTER",correct:true,response:"CHIP: The charge is fictitious. I have the charter clause and the invoice attached to the complaint."},
     {id:"raid",label:"SEND A HELICOPTER AFTER THE SIDEWALK",correct:false,response:"CHIP: I don't think the sidewalk is going anywhere, Chief."},
     {id:"permit",label:"CHARGE EVERYONE FOR A WALKING PERMIT",correct:false,response:"BUFFER BOB: That is literally the scam you're investigating."}
    ]},
   {place:"spacealite",speaker:"REGGIE BANDS",setup:"REGGIE: My invoices are valid because they're printed in a very expensive font. I also own the concept of direction.",
    prompt:"How do you resolve the dispute?",
    options:[
     {id:"void",label:"VOID THE FALSE CHARGES AND PUBLISH THE CHARTER",correct:true,response:"REGGIE: YOU CAN'T VOID MY INVOICE! CHIP: We just did. The sidewalk remains free."},
     {id:"fine",label:"GIVE REGGIE A BLANK CHECK",correct:false,response:"REGGIE: A strong start, but let's review the laws first. CHIP: Absolutely not."},
     {id:"grass",label:"BAN SHOES FROM PUBLIC LAND",correct:false,response:"CHUCK: The town just escaped a sidewalk tax. Let's not add a footwear crisis."}
    ]}
  ]},
 {id:"divot",title:"THE DIVOT DIPLOMATIC INCIDENT",label:"STREET CASE #019-B",unlock:[],
  summary:"A mysterious tunnel appears under the fairway. Tweedsie and a golfing celebrity want the turf put back where it belongs.",
  award:"FAIRWAY PEACEKEEPER",scenes:[
   {place:"golf",speaker:"CINDY CHIPSHOT",setup:"CINDY: Somebody's replaced a sand bunker with a tiny door. Reggie wants to charge a premium for an underground tee time.",
    prompt:"Where should the investigation begin?",
    options:[
     {id:"survey",label:"CHECK THE COURSE SURVEY AND THE NEW DOOR",correct:true,response:"CINDY: The door lines up with an approved tunnel service corridor, not a stolen bunker."},
     {id:"trap",label:"INSTALL A GIGANTIC GOPHER TRAP",correct:false,response:"TWEEDSIE: I'm standing right here, bro. A conversation would be cheaper."},
     {id:"rent",label:"PAY REGGIE'S EXTRA GREEN FEE",correct:false,response:"CINDY: Fees aren't evidence. Not even when printed on golf balls."}
    ]},
   {place:"burrow",speaker:"TWEEDSIE",setup:"TWEEDSIE: My tunnel didn't hit the green. Your construction team dug into the old map and didn't update the signs.",
    prompt:"Which information resolves the boundary?",
    options:[
     {id:"map",label:"COMPARE THE BURROW MAP WITH THE COURSE PLANS",correct:true,response:"TWEEDSIE: Told you! One map, two departments, zero coordination. Same hole, different paperwork."},
     {id:"dig",label:"DIG TWELVE MORE UNMARKED HOLES",correct:false,response:"TWEEDSIE: You'll have to explain the other eleven holes to the groundskeeper."},
     {id:"blame",label:"DECLARE ALL GOPHERS GUILTY",correct:false,response:"CHIP: We already learned what happens when you skip actual evidence."}
    ]},
   {place:"orchard",speaker:"NORTHSIDE FARMER",setup:"FARMER: The old transit passage was marked in my farm ledger decades before anyone invented the celebrity golf tournament.",
    prompt:"How does the town settle this turf argument?",
    options:[
     {id:"restore",label:"RESTORE THE SIGNS AND PRESERVE THE PUBLIC PASSAGE",correct:true,response:"FARMER: There, everybody keeps their land and the gophers get a clearly marked way home."},
     {id:"close",label:"BULLDOZE THE WHOLE FARM",correct:false,response:"CINDY: That seems like the opposite of good course management."},
     {id:"toll",label:"CHARGE A FEE FOR EVERY ROOT",correct:false,response:"TWEEDSIE: Reggie, stop trying to invoice photosynthesis."}
    ]}
  ]},
 {id:"broadcast",title:"THE BROADCAST OF ABSOLUTELY NOTHING",label:"STREET CASE #019-C · FINALE",unlock:["sidewalk","divot"],
  summary:"The two civic mysteries lead to a Spacealite broadcast conspiracy involving old VHS tapes and a pay-per-minute silence subscription.",
  award:"UNPAID STEMSIDE CIVIC HERO",scenes:[
   {place:"video",speaker:"MARTY",setup:"MARTY: Somebody recorded a full hour of silence and mailed me a bill for playing it back. The timecode says tomorrow.",
    prompt:"What is the sensible first step?",
    options:[
     {id:"tape",label:"CHECK THE TAPE TIMECODE AND ORIGINAL RECORDING",correct:true,response:"MARTY: The audio track is empty and the license was added after the tape was made."},
     {id:"arrest",label:"ARREST THE VCR FOR PLAYING SILENCE",correct:false,response:"MARTY: The VCR is already serving a life sentence in a rental store."},
     {id:"pay",label:"SUBSCRIBE TO THE SILENCE CHANNEL",correct:false,response:"BUFFER BOB: There is nothing to subscribe to. Quite literally."}
    ]},
   {place:"arcade",speaker:"BUFFER BOB",setup:"BOB: The Arcade cabinet has the original transmission logs. Turns out Spacealite inserted a recurring invoice without permission.",
    prompt:"Which system record matters?",
    options:[
     {id:"logs",label:"COMPARE THE ORIGINAL LOG WITH THE NEW BILL",correct:true,response:"BOB: There it is. Reggie's invoice script ran after the broadcast ended. An excellent self-own."},
     {id:"delete",label:"DELETE EVERY RECORD TO SAVE SPACE",correct:false,response:"CHIP: Destroying the evidence does not improve the investigation."},
     {id:"fee",label:"INVENT AN ARCADE SCREEN VIEWING TAX",correct:false,response:"BOB: Why is your solution always a new form of the original problem?"}
    ]},
   {place:"commons",speaker:"CHIP",setup:"CHIP: We have the old tape and a clean transmission ledger. The city can announce its findings to everyone without asking Reggie for permission.",
    prompt:"How should the community hear the truth?",
    options:[
     {id:"notice",label:"PUBLISH AN ACCESSIBLE PUBLIC NOTICE WITH THE EVIDENCE",correct:true,response:"CHIP: Posted at the Commons and backed by the records. Nobody owes a fee for silence."},
     {id:"secret",label:"HIDE THE FINDINGS IN THE CHIEF'S DONUT DRAWER",correct:false,response:"CHIP: Chief, you can't use breakfast as the city's entire public records system."},
     {id:"lease",label:"LEASE THE COMMUNAL NOTICEBOARD TO SPACEALITE",correct:false,response:"TWEEDSIE: Bruh. Didn't we just solve the public property problem?"}
    ]},
   {place:"tweedcorp",speaker:"REGGIE BANDS",setup:"REGGIE: This is slander! My silence channel is my most profitable program! The city is threatening to give the public a free statement.",
    prompt:"Close the final public hearing.",
    options:[
     {id:"close",label:"CANCEL UNAUTHORIZED BILLS AND ARCHIVE THE EVIDENCE",correct:true,response:"CHIP: The city keeps its records, residents keep their money, and Reggie keeps yelling into an empty microphone. CASE CLOSED."},
     {id:"subscribe",label:"LET REGGIE BILL THE CITY FOR ITS OWN NOTICE",correct:false,response:"BOB: The entire purpose of this hearing was to stop that exact behavior."},
     {id:"destroy",label:"BURN ALL COPIES OF THE CITY CHARTER",correct:false,response:"MARTY: I have an archived copy of that, too. Everything here is on tape."}
    ]}
  ]}
]);
const eventIndex=new Map(EVENTS.map(e=>[e.id,e]));
export const eventOf=id=>eventIndex.get(id)||null;
export const initialEvents=()=>({version:EVENTS_VERSION,completed:[],active:null,wrong:0});
export function decodeEvents(raw){
 if(!raw||typeof raw!=="object"||Array.isArray(raw)||raw.version!==EVENTS_VERSION)return null;
 const claims=Array.isArray(raw.completed)?raw.completed:[],completed=[];
 for(const mission of EVENTS){
  if(claims.includes(mission.id)&&mission.unlock.every(id=>completed.includes(id)))completed.push(mission.id);
 }
 const candidate=raw.active,mission=eventOf(candidate?.id);
 const active=mission&&!completed.includes(mission.id)&&
  mission.unlock.every(id=>completed.includes(id))&&Number.isInteger(candidate?.step)&&candidate.step>=0&&candidate.step<mission.scenes.length
  ?{id:mission.id,step:candidate.step}:null;
 const wrong=Number.isInteger(raw.wrong)?Math.max(0,Math.min(raw.wrong,9999)):0;
 return {version:EVENTS_VERSION,completed,active,wrong};
}
export function encodeEvents(progress){
 const safe=decodeEvents({...progress,version:EVENTS_VERSION});
 if(!safe)throw Error("Invalid street encounter save");
 return JSON.stringify(safe);
}
export const unlockedEvent=(progress,id)=>Boolean(eventOf(id)&&eventOf(id).unlock.every(x=>progress?.completed?.includes(x)));
export const activeEncounter=progress=>eventOf(progress?.active?.id)?.scenes[progress?.active?.step]||null;
export const pendingLocation=progress=>activeEncounter(progress)?.place||null;
export function beginEvent(progress,id){
 const mission=eventOf(id);
 if(!mission)return {state:progress,started:false,feedback:"NO SUCH CASE EXISTS IN CITY HALL."};
 if(!unlockedEvent(progress,id))return {state:progress,started:false,feedback:"CLOSE THE TWO CIVIC CASES BEFORE OPENING THE CITYWIDE FINALE."};
 if(progress.completed.includes(id))return {state:progress,started:false,feedback:"THIS STREET CASE IS ALREADY IN THE MUNICIPAL ARCHIVE."};
 if(progress.active?.id===id)return {state:progress,started:true,feedback:"RESUMING THE ACTIVE STREET CASE."};
 if(progress.active)return {state:progress,started:false,feedback:"CLOSE YOUR CURRENT STREET CASE BEFORE OPENING ANOTHER."};
 return {state:{...progress,active:{id,step:0}},started:true,feedback:"NEW INCIDENT FILED. FOLLOW THE MAP TO "+placeOf(mission.scenes[0].place).name+"."};
}
export function answerEvent(progress,world,choiceId){
 const mission=eventOf(progress?.active?.id),scene=activeEncounter(progress);
 if(!scene||!mission)return {state:progress,correct:false,feedback:"NO ACTIVE STREET CASE."};
 if(world?.current!==scene.place)return {state:progress,correct:false,feedback:"TRAVEL TO "+placeOf(scene.place).name+" BEFORE INTERVIEWING THIS WITNESS."};
 const option=scene.options.find(c=>c.id===choiceId);
 if(!option)return {state:progress,correct:false,feedback:"THAT RESPONSE IS NOT IN THE INCIDENT FORM."};
 if(!option.correct)return {state:{...progress,wrong:Math.min(9999,progress.wrong+1)},correct:false,feedback:option.response+" · WRONG LEAD. TRY AGAIN."};
 const last=progress.active.step===mission.scenes.length-1;
 if(last)return {state:{...progress,active:null,completed:[...progress.completed,mission.id]},
  correct:true,completed:mission,feedback:option.response+" · AWARDED: "+mission.award+"."};
 return {state:{...progress,active:{id:mission.id,step:progress.active.step+1}},correct:true,
  feedback:option.response+" · NEXT STOP: "+placeOf(mission.scenes[progress.active.step+1].place).name+"."};
}
export function eventBoard(progress){
 return EVENTS.map(e=>({
  id:e.id,title:e.title,summary:e.summary,award:e.award,unlock:e.unlock,
  complete:progress.completed.includes(e.id),unlocked:unlockedEvent(progress,e.id),
  active:progress.active?.id===e.id,steps:e.scenes.length
 }));
}
