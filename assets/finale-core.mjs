// TweedleVerse v0.10: one original, fully deterministic episode finale.
// Pure state transitions: no DOM, randomness, real currency, or remote calls.
export const FINALE_TITLE="THE GREAT BILLING REVERSAL";
export const FINALE_REWARD=Object.freeze({
 id:"universal-fee-waiver",name:"Interdimensional Fee Waiver",
 description:"Signed by Reggie under protest. Void wherever management can see it."
});
export const FINALE_EVIDENCE=Object.freeze([
 {id:"coupon",label:"THE COFFEE RECEIPT",explanation:"CHUCK: A free cup apparently accrued a subscription charge."},
 {id:"tape",label:"THE TOMORROW TAPE",explanation:"MARTY: The movie was billed for a screening before it existed."},
 {id:"invoice",label:"REGGIE'S OWN INVOICE",explanation:"BUFFER BOB: Reggie approved a fee on a fee on a fee."}
]);
export const FINALE_ENDINGS=Object.freeze({
 refund:{
 id:"refund",label:"REFUND THE WHOLE TOWN",
 title:"THE REFUND THAT BROKE THE BANK",
 description:"REGGIE: I can't refund an entire DIMENSION! TWEEDSIE: You billed one, Reg. You can refund one. South Stemside gets its credits back, but the coffee is still overpriced."
 },
 commons:{
 id:"commons",label:"FREE THE PUBLIC SIGNAL",
 title:"THE FREQUENCY THAT GOT AWAY",
 description:"REGGIE: That channel is proprietary! TWEEDSIE: Not after your contract expired yesterday, Reg. The public gets one free channel, mostly broadcasting Chuck arguing with coffee machines."
 }
});
export const FINALE_STAGES=Object.freeze([
 "Talk to Buffer Bob outside TweedCorp about the strange bills.",
 "Inspect Lackluster Video for the impossible timestamp.",
 "Visit Spacealite Tower to confront the subscription system.",
 "Audit all three pieces of evidence in the correct order.",
 "Choose the ending of the episode.",
 "FINAL CREDITS: the town survived another episode."
]);
export function initialFinale(){return {stage:0,evidence:0,mistakes:0,ending:null}}
export function sanitizeFinale(raw){
 const base=initialFinale();
 if(!raw||typeof raw!=="object"||Array.isArray(raw))return base;
 const stage=Number.isInteger(raw.stage)&&raw.stage>=0&&raw.stage<=5?raw.stage:0;
 const evidence=Number.isInteger(raw.evidence)&&raw.evidence>=0&&raw.evidence<=3?raw.evidence:0;
 const mistakes=Number.isInteger(raw.mistakes)?Math.max(0,Math.min(99,raw.mistakes)):0;
 const ending=typeof raw.ending==="string"&&Object.hasOwn(FINALE_ENDINGS,raw.ending)?raw.ending:null;
 if(stage===5&&!ending)return {...base};
 if(stage===4&&evidence!==3)return {...base};
 return {stage,evidence:stage<3?0:stage>3?3:evidence,mistakes,ending:stage===5?ending:null};
}
export function finaleEligible(progress){
 return progress?.quest===3&&Array.isArray(progress?.wins)&&progress.wins.length>=1;
}
export function nextFinaleEvent(finale,progress,type,id){
 if(!finaleEligible(progress))return finale;
 const steps=[
  {stage:0,type:"npc",id:"bob-street"},
  {stage:1,type:"place",id:"lackluster"},
  {stage:2,type:"place",id:"spacealite"}
 ];
 const expected=steps.find(s=>s.stage===finale.stage);
 return expected&&expected.type===type&&expected.id===id?{...finale,stage:finale.stage+1}:finale;
}
export function auditEvidence(finale,id){
 if(finale.stage!==3)return {finale,correct:false,feedback:"THE AUDIT IS NOT YET OPEN."};
 const expected=FINALE_EVIDENCE[finale.evidence];
 if(!expected)return {finale,correct:false,feedback:"ALL EVIDENCE ALREADY FILED."};
 if(id!==expected.id){
  return {finale:{...finale,mistakes:Math.min(99,finale.mistakes+1)},
   correct:false,feedback:"WRONG ORDER! REGGIE ADDS AN IMAGINARY PROCESSING FEE."};
 }
 const evidence=finale.evidence+1;
 return {finale:{...finale,evidence,stage:evidence===FINALE_EVIDENCE.length?4:3},
  correct:true,feedback:expected.explanation};
}
export function pickFinaleEnding(finale,id){
 if(finale.stage!==4||!Object.hasOwn(FINALE_ENDINGS,id))return null;
 return {...finale,stage:5,ending:id};
}
export function finaleStatus(finale,progress){
 if(finale.stage===5)return "EPISODE COMPLETE · "+FINALE_ENDINGS[finale.ending].title;
 if(!finaleEligible(progress))return "LOCKED · FINISH THE COFFEE RUN AND WIN ONE CORPORATE DISPUTE";
 return "SCENE "+(finale.stage+1)+" / 6 · "+FINALE_STAGES[finale.stage];
}
export function finaleDestination(finale,progress){
 if(!finaleEligible(progress)||finale.stage>=3)return null;
 return [{type:"npc",id:"bob-street"},{type:"place",id:"lackluster"},{type:"place",id:"spacealite"}][finale.stage];
}
