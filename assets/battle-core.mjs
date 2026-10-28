// TweedleVerse v0.5: original, nonviolent, deterministic satirical encounter system.
// This logic is free of browser APIs, random rolls, licensed characters, or remote services.
export const PARTY=Object.freeze([
 {id:"chip",name:"CHIP",role:"QUALITY ASSURANCE",move:"PLAY DUMB",effect:"Chip asks the most inconveniently simple question.",pressure:19,restore:6,shield:0,cost:0},
 {id:"dank",name:"DANK-9000",role:"UNLICENSED SALES",move:"PITCH A BUNDLE",effect:"Dank sells the executive their own meeting minutes.",pressure:27,restore:0,shield:0,cost:0},
 {id:"bob",name:"BUFFER BOB",role:"COMPLIANCE",move:"CITE SECTION 42",effect:"Bob produces a signed regulation nobody has read.",pressure:17,restore:0,shield:14,cost:0},
 {id:"professor",name:"TERPENSTEIN",role:"BOTANICAL R&D",move:"DEPLOY PROTOTYPE",effect:"A prototype confetti cannon makes every form unreadable.",pressure:34,restore:0,shield:0,cost:24}
]);
export const ENCOUNTERS=Object.freeze({
 "coffeecharles":{id:"coffeecharles",title:"THE GRAND CHARLES SURCHARGE",foe:"MENU TAX ENFORCER",district:"NORTH STEMSIDE",icon:"☕",target:69,retort:13,flavor:"A barista demands seventeen credits for pronouncing coffee out loud.",victory:"The menu tax is abolished. The coffee still costs the same.",rebuttals:["The barista adds a syllable-usage surcharge.","Your coffee is upgraded to Executive Beige.","A napkin consultant sends an invoice."]},
 "whole-moods":{id:"whole-moods",title:"MANDATORY FEELING AUDIT",foe:"WELLNESS COMPLIANCE ORB",district:"NORTH STEMSIDE",icon:"✳",target:83,retort:16,flavor:"Your emotional shopping cart has violated the store's happiness quota.",victory:"The orb is forced to experience an emotion it cannot monetize: mild satisfaction.",rebuttals:["An artisan invoice floats toward the party.","The orb audits your facial expression.","A wellness consultant charges for eye contact."]},
 "spacealite":{id:"spacealite",title:"THE SUBSCRIPTION SHOWDOWN",foe:"REGGIE'S BILLING MAINFRAME",district:"NORTH STEMSIDE",icon:"▣",target:100,retort:17,flavor:"Reggie Bands has billed the whole neighborhood for looking at his building.",victory:"Reggie's own fine print wins the argument. Spacealite owes South Stemside a refund.",rebuttals:["The mainframe charges a fourth-wall processing fee.","An invoice claims ownership of your next sentence.","Reggie shouts SEEDS McSTEMS IS NOT A TAX CATEGORY!"]}
});
export const TWEEDSIE_ACTION="tweedsie";
export function startBattle(id){
 const foe=ENCOUNTERS[id];
 if(!foe)return null;
 return {id,turn:0,composure:100,pressure:0,shield:0,tweedsieUsed:false,status:"active",last:"",log:foe.flavor};
}
export function actionAvailable(battle,action,wins=[]){
 if(!battle||battle.status!=="active")return false;
 if(action===TWEEDSIE_ACTION)return wins.length>=2&&!battle.tweedsieUsed;
 return PARTY.some(member=>member.id===action);
}
export function playTurn(battle,action,wins=[]){
 if(!actionAvailable(battle,action,wins))return null;
 const foe=ENCOUNTERS[battle.id];
 if(!foe)return null;
 const move=PARTY.find(member=>member.id===action);
 const next={...battle,turn:battle.turn+1};
 const isTweedsie=action===TWEEDSIE_ACTION;
 const pressure=isTweedsie?20:move.pressure;
 const recovery=isTweedsie?0:move.restore;
 const cost=isTweedsie?0:move.cost;
 const shield=battle.shield+(isTweedsie?0:move.shield);
 next.composure=Math.max(0,Math.min(100,battle.composure+recovery-cost));
 next.pressure=Math.min(foe.target,battle.pressure+pressure);
 next.tweedsieUsed=battle.tweedsieUsed||isTweedsie;
 const actionLog=isTweedsie?"Tweedsie pops out of the receipt printer and strikes out the entire invoice.":move.effect;
 // Self-defeating prototypes can exhaust the party before the invoice is defeated.\n if(next.composure===0){next.status="lost";next.shield=shield;next.last=actionLog;next.log="The prototype crashed the whole meeting. Try a more balanced plan.";return next;}\n // A winning turn ends the encounter before a foe retaliation.
 if(next.pressure>=foe.target){
   next.status="won";next.shield=shield;next.last=actionLog;
   next.log=foe.victory;return next;
 }
 // Tweedsie skips the opposing turn; Bob's shield absorbs the next retort.
 const penalty=isTweedsie?0:foe.retort+Math.floor(battle.turn/3)*2;
 const blocked=Math.min(shield,penalty);
 next.shield=shield-blocked;
 next.composure=Math.max(0,next.composure-(penalty-blocked));
 next.status=next.composure===0?"lost":"active";
 const reply=isTweedsie?"The executive skips their turn in stunned silence.":foe.rebuttals[battle.turn%foe.rebuttals.length];
 next.last=actionLog;
 next.log=next.status==="lost"?"COMPOSURE EXHAUSTED. The meeting has been adjourned. Try again.":reply;
 return next;
}
export function progress(battle){
 if(!battle)return 0;
 return Math.round(battle.pressure/ENCOUNTERS[battle.id].target*100);
}
export function awardWin(wins,battle){
 if(!battle||battle.status!=="won"||!ENCOUNTERS[battle.id])return [...wins];
 return [...new Set([...wins,battle.id])];
}
export function medalText(wins){
 if(wins.length===3)return "THREE CORPORATE DISPUTES RESOLVED · REBEL OF STEMSIDE";
 return wins.length+" / 3 CITY DISPUTES RESOLVED";
}
