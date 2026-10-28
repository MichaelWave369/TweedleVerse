// TweedleVerse v0.7: deterministic street residents and a portable side quest.
// Original dialog; pure module (no browser/network/storage APIs).
export const RESIDENTS=Object.freeze([
 {id:"marty",name:"Marty the Rewind Technician",label:"MARTY",x:1310,y:822,tone:"#b8a1ed",icon:"M",bubble:"THE FUTURE IS OVERDUE.",
  talk:"MARTY: My customers keep renting tomorrow's movies yesterday. I've lost a tape that technically hasn't been filmed yet."},
 {id:"bob-street",name:"Buffer Bob",label:"BUFFER BOB",x:929,y:738,tone:"#88cae3",icon:"B",bubble:"PLEASE SIGN A FORM.",
  talk:"BOB: I'm technically on a break, but my break has been denied pending a break-permit application."},
 {id:"chuck-street",name:"Chuck from CoffeeChucks",label:"CHUCK",x:276,y:782,tone:"#e3b875",icon:"C",bubble:"IT'S COFFEE, CHUCK.",
  talk:"CHUCK: It's coffee, Chuck. Drink it. Now I'm required to get a permit just to say that outdoors."},
 {id:"lenny",name:"Lenny Smokins",label:"LENNY",x:697,y:963,tone:"#ed94ad",icon:"L",bubble:"NEW TOUR. SAME BUS.",
  talk:"LENNY: The record label called my sound retro. I said I was late because my tour bus has only four functioning dimensions."}
]);
export const TAPE_STEPS=Object.freeze([
 {type:"npc",id:"marty",title:"Ask Marty about the missing movie from tomorrow"},
 {type:"place",id:"snublishers",title:"Check Snublishers Clearing House's prize mail"},
 {type:"npc",id:"bob-street",title:"Ask Buffer Bob to correct the delivery paperwork"},
 {type:"npc",id:"marty",title:"Return the unfilmed tape to Marty"}
]);
export const TAPE_REWARD=Object.freeze({id:"future-film-credit",name:"Tomorrow's Film Credit",description:"A genuine cinema ticket valid after the film has already ended."});
export const NPC_RADIUS=87;
export function residentPosition(npc,seconds=0,reducedMotion=false){
 const wobble=reducedMotion?0:Math.sin(seconds*.48+RESIDENTS.findIndex(r=>r.id===npc.id)*1.4)*10;
 return {x:npc.x+wobble,y:npc.y+Math.sin(seconds*.32+npc.x)* (reducedMotion?0:6)};
}
export function nearestResident(x,y,seconds=0,maxDistance=NPC_RADIUS,reducedMotion=false){
 let chosen=null,nearest=maxDistance;
 for(const npc of RESIDENTS){
  const p=residentPosition(npc,seconds,reducedMotion);
  const d=Math.hypot(x-p.x,y-p.y);
  if(d<nearest){chosen=npc;nearest=d}
 }
 return chosen;
}
export function advanceTapeQuest(stage,eventType,id){
 if(!Number.isInteger(stage)||stage<0||stage>=TAPE_STEPS.length)return stage;
 const objective=TAPE_STEPS[stage];
 return eventType===objective.type&&id===objective.id?stage+1:stage;
}
export function tapeStatus(stage){
 if(stage===TAPE_STEPS.length)return "SOLVED · TOMORROW'S FILM CREDIT COLLECTED";
 return "STEP "+(stage+1)+" / "+TAPE_STEPS.length+": "+TAPE_STEPS[stage]?.title;
}
export function npcReply(id,stage){
 const npc=RESIDENTS.find(n=>n.id===id);
 if(!npc)return null;
 if(id==="marty"&&stage===0)return "MARTY: Somebody checked out a movie from tomorrow and returned it yesterday. Snublishers Clearing House accidentally mailed the tape as a sweepstakes prize. Could you trace it?";
 if(id==="marty"&&stage===3)return "MARTY: YOU FOUND TOMORROW'S MOVIE! Hold on. The credits list you as the hero. That'll be a late fee in reverse. Here, keep this film credit.";
 if(id==="bob-street"&&stage===2)return "BUFFER BOB: This receipt says the tape was mailed in a dimension that doesn't exist until next week. I have corrected the delivery address to 'yesterday.' Please return it to Marty.";
 if(id==="chuck-street")return "CHUCK: Coffee prices went up again. Only the price, though. The actual coffee is aggressively identical.";
 if(id==="lenny")return "LENNY: I'm performing my next original rock anthem at the Southside arena. Reggie wants to charge the crowd for every guitar solo.";
 return npc.talk;
}
