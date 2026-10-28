// TweedleVerse v0.8: Lenny Smokins' original visual-only rhythm show.
// No borrowed songs, samples, audio, random notes, browser APIs or remote dependencies.
export const GIG_STEPS=Object.freeze([
 {type:"npc",id:"lenny",title:"Ask Lenny about his missing concert supplies"},
 {type:"place",id:"lackluster",title:"Recover tomorrow's set list from Lackluster Video"},
 {type:"place",id:"taco-bell",title:"Collect the stage power adapter from Taco McBurger Bell"},
 {type:"npc",id:"lenny",title:"Return to Lenny and unlock the rehearsal"},
 {type:"show",id:"stems-league",title:"Play Lenny's eight-beat show at the Southside arena"}
]);
export const GIG_REWARD=Object.freeze({id:"lenny-backstage-pass",name:"Lenny's Gold-Plated Backstage Pass",description:"Valid for any gig, provided the venue remains in this dimension."});
export const BEAT_COUNT=8;
export const BEAT_SPACING=0.9;
export const COUNT_IN=3.0;
export const WIN_SCORE=9;
export const MAX_SCORE=BEAT_COUNT*2;
export const BEAT_TIMES=Object.freeze(Array.from({length:BEAT_COUNT},(_,i)=>COUNT_IN+i*BEAT_SPACING));
export const END_TIME=BEAT_TIMES.at(-1)+0.55;
export function advanceGigQuest(stage,type,id){
 if(!Number.isInteger(stage)||stage<0||stage>=GIG_STEPS.length)return stage;
 const obj=GIG_STEPS[stage];
 return obj.type===type&&obj.id===id?stage+1:stage;
}
export function gigStatus(stage){
 if(stage===GIG_STEPS.length)return "SHOW COMPLETE · GOLD-PLATED BACKSTAGE PASS";
 return "STEP "+(stage+1)+" / "+GIG_STEPS.length+": "+(GIG_STEPS[stage]?.title||"UNKNOWN");
}
export function gigReply(stage){
 if(stage===0)return "LENNY: My set list is stuck on a VHS from tomorrow. And somebody at Taco McBurger Bell used the amplifier plug for the milkshake machine. Can you help?";
 if(stage===3)return "LENNY: You've got the set list AND the power adapter! Meet me at the Stems League stage. No audio required, just eight beats and improbable confidence.";
 if(stage===5)return "LENNY: You saved the show! Reggie charged me for the applause, but I snuck you this backstage pass.";
 return "LENNY: The record label says my next original song is a greatest hit from the future. I don't ask questions anymore.";
}
export function freshShow(){
 return {elapsed:0,notes:Array(BEAT_COUNT).fill(null),score:0,status:"ready",last:""};
}
export function beginShow(show){
 if(!show||show.status==="playing")return show;
 return {...freshShow(),status:"playing",last:"COUNT-IN: GET READY FOR THE FIRST BEAT."};
}
export function tickShow(show,seconds){
 if(!show||show.status!=="playing")return show;
 const dt=Number.isFinite(seconds)?Math.max(0,Math.min(.1,seconds)):0;
 const elapsed=Math.min(END_TIME+1,show.elapsed+dt);
 const status=elapsed>=END_TIME?(show.score>=WIN_SCORE?"won":"lost"):"playing";
 return {...show,elapsed,status,last:status==="won"?"SHOW SAVED! REGGIE CAN SEND THE INVOICE TO HIMSELF.":status==="lost"?"THE CROWD WANTS AN ENCORE. RETRY THE SET!":show.last};
}
export function hitBeat(show,easy=false){
 if(!show||show.status!=="playing")return show;
 const window=easy?.35:.23;
 const perfect=easy?.19:.105;
 let best=-1,distance=Infinity;
 for(let i=0;i<BEAT_COUNT;i++){
  if(show.notes[i]!==null)continue;
  const d=Math.abs(show.elapsed-BEAT_TIMES[i]);
  if(d<distance){distance=d;best=i}
 }
 if(best<0||distance>window)return {...show,last:"OFF BEAT! THE SOUND ENGINE HAS FILED A COMPLAINT."};
 const points=distance<=perfect?2:1;
 const notes=show.notes.slice();notes[best]=points;
 return {...show,notes,score:show.score+points,last:points===2?"PERFECT! +2 THE CROWD HAS APPROVED THE TIMING.":"ON THE BEAT! +1."};
}
export function beatProgress(show){
 return Math.max(0,Math.min(100,Math.round((show?.elapsed||0)/END_TIME*100)));
}
