// v0.11: authored, deterministic consequences from Episode One's saved ending.
// Side-effect free. All events are fictional and intentionally non-commercial.
export const CONSEQUENCES=Object.freeze({
 refund:{
  title:"SOUTHSIDE REFUND DECLARED",theme:"refund",
  headline:"THE CITY GOT ITS CREDITS BACK",
  ticker:"REGGIE BANDS MUST ISSUE REFUNDS · CHUCK IS ALREADY SPENDING HIS ON A NEW COFFEE MACHINE",
  perk:"RECEIPT SHIELD: +12 protection at the start of every new corporate dispute",
  feature:"TOWN HALL NOTICE: Reggie is required to repay fictional processing fees. The compensation check is spectacularly oversized.",
  board:[
   "COFFEECHUCKS: Free coffee is finally free. The cup still comes with seventeen disclaimers.",
   "WHOLE MOODS: A refund specialist is available, for an optional refund-specialist fee.",
   "SOUTHSIDE STEMS: The team can now afford one regulation-sized ball."
  ]
 },
 commons:{
  title:"THE SIGNAL IS FREE",theme:"commons",
  headline:"PUBLIC BROADCAST ESCAPES SPACEALITE",
  ticker:"CHANNEL ZERO IS NOW PUBLIC · SPACEALITE'S LAWYERS CANNOT FIND THE OFF SWITCH",
  perk:"COMMUNITY SIGNAL: Tweedsie can interrupt once per corporate encounter, even without two prior victories",
  feature:"CHANNEL ZERO IS ON AIR: It broadcasts Lenny rehearsals, Chuck complaints, and live footage of Reggie demanding royalties.",
  board:[
   "CHANNEL ZERO: Today's top story is a coffee machine declaring independence.",
   "LENNY SMOKINS: A free broadcast of original rehearsal footage is now a public service.",
   "REGGIE BANDS: Stop watching me lose control of my own television network!"
  ]
 }
});
export const PLACE_REACTIONS=Object.freeze({
 coffeechucks:{
  refund:"CHUCK: I got my credits back! Now the receipt is longer than the coffee line. But your cup is on me.",
  commons:"CHUCK: Somebody put my morning complaints on Channel Zero. It's got better ratings than Reggie's entire package."
 },
 spacealite:{
  refund:"REGGIE: REFUNDS?! I INVENTED THE PROCESSING FEE. HOW COULD IT BE USED AGAINST ME?",
  commons:"REGGIE: TURN OFF CHANNEL ZERO! WHY IS THE REMOTE CONTROL VOTING AGAINST ME?"
 },
 lackluster:{
  refund:"MARTY: The studio refunded all future late fees. My movie still doesn't exist, but the credit is real.",
  commons:"MARTY: Channel Zero is showing tomorrow's news yesterday. The guide says we're already in reruns."
 },
 "stems-league":{
  refund:"ANNOUNCER: The Stems League has enough recovered credits for matching shoelaces. Nobody on the roster wears shoes.",
  commons:"ANNOUNCER: Tonight's free broadcast features Lenny, a Tweedleball match and seventeen arguments with Reggie."
 },
 "coffeecharles":{
  refund:"BARISTA: Our grand refund is served in the same cup as the regular refund. Only the title costs more.",
  commons:"BARISTA: We now offer a Channel Zero listening surcharge. Yes, television has sound."
 },
 "whole-moods":{
  refund:"CONCIERGE: Your emotional wellness fee was returned. The return itself may cause feelings.",
  commons:"CONCIERGE: Your mood is streaming live. Our lawyers are unable to put it back in the bottle."
 },
 tweedcorp:{
  refund:"BUFFER BOB: The reimbursement was approved by a committee that didn't know it existed.",
  commons:"BUFFER BOB: Channel Zero's terms of service are one word: 'Enjoy'. This violates seventy-four company policies."
 },
 "reggies-reggie":{
  refund:"SHOPKEEPER: Our refund makes the Reggie special a whole three credits cheaper. It still contains mostly stems.",
  commons:"SHOPKEEPER: This place is on Channel Zero! Reggie's lawyers just entered the chat. They left crying."
 }
});
export const RESIDENT_REACTIONS=Object.freeze({
 "bob-street":{
  refund:"BUFFER BOB: The city has been refunded. I am forbidden to call this a victory until Form 9-G approves the word.",
  commons:"BUFFER BOB: The public channel now airs our paperwork hearings. Ratings are embarrassingly strong."
 },
 marty:{
  refund:"MARTY: Got my future late fees back. Which means I've already spent them yesterday.",
  commons:"MARTY: Channel Zero just broadcast the director's cut of tomorrow. It hasn't been directed yet."
 },
 "chuck-street":{
  refund:"CHUCK: I got reimbursed for every coffee I was never allowed to give away. Don't tell management.",
  commons:"CHUCK: My coffee rant went viral on a channel we don't pay for. Reggie's furious. I'll make another pot."
 },
 lenny:{
  refund:"LENNY: My guitar solo fees were refunded! Unfortunately they charged me for the encore.",
  commons:"LENNY: CHANNEL ZERO, BABY! Everybody can watch the gig. I still can't get anybody to tune my guitar."
 }
});
export function activeEnding(progress){
 const finale=progress?.finale;
 return finale?.stage===5 && Object.hasOwn(CONSEQUENCES,finale.ending)?finale.ending:null;
}
export function consequenceFor(progress){
 const id=activeEnding(progress);
 return id?CONSEQUENCES[id]:null;
}
export function placeReaction(progress,id,fallback=""){
 const ending=activeEnding(progress);
 return (ending&&PLACE_REACTIONS[id]?.[ending])||fallback;
}
export function residentReaction(progress,id,fallback=""){
 const ending=activeEnding(progress);
 return (ending&&RESIDENT_REACTIONS[id]?.[ending])||fallback;
}
export function disputePerk(progress){
 const ending=activeEnding(progress);
 return {startingShield:ending==="refund"?12:0,tweedsieAccess:ending==="commons"};
}
export function worldHeadline(progress){
 return consequenceFor(progress)?.headline||"SPACEALITE OWNS EVERY CHANNEL. FOR NOW.";
}
