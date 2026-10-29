// TweedleVerse Crossroads v0.17: pure original, deterministic crossover mini-cases.
// Each case is unlocked by TWO different existing series' authentic Passport stamps.
// No mutation of any source game save. This local story ledger is entertainment, not proof against tampering.
export const CROSSROADS_KEY="tweedleverse.crossroads.cases.v1";
export const CROSSROADS_VERSION=1;
export const CROSSROADS_CASES=Object.freeze([
 {id:"fairway",title:"THE EIGHTEENTH HOLE THAT WASN'T",code:"CROSSROADS CASE #001",
  summary:"A hole appears beneath a TweedleGolf fairway. Chip investigates, Tweedsie is blamed, and Reggie bills the dirt.",
  required:["detective","architect"],origin:["TWEEDLEPD CASE #001","TWEEDLEGOLF COURSE ARCHITECT"],
  reward:"FAIRWAY FORENSICS",color:"green",scenes:[
   {id:"the-green",place:"TWEEDLEGOLF CLUBHOUSE",speaker:"CINDY CHIPSHOT",
    text:"CINDY: An enormous hole appeared on the practice green! Reggie says a gopher committed property theft. But the grounds crew installed a new bunker yesterday.",
    prompt:"What should Chip inspect first?",
    choices:[
     {id:"bunker",label:"CHECK THE GROUNDS CREW'S WORK ORDER",right:true,
      reply:"CHIP: The bunker was commissioned by Reggie himself, but he forgot which hole number he authorized."},
     {id:"warrant",label:"ARREST TWEEDSIE FOR EXISTING NEAR DIRT",right:false,
      reply:"TWEEDSIE: I've been underground the whole time, bro. CHIEF: THAT'S WHAT MAKES IT SUSPICIOUS!"},
     {id:"bill",label:"PAY REGGIE'S EMERGENCY DIRT INVOICE",right:false,
      reply:"BUFFER BOB: An invoice isn't evidence. It's usually just an invoice in a silly hat."}
    ]},
   {id:"the-shaft",place:"NORTHSIDE UNDERPASS",speaker:"TWEEDSIE",
    text:"TWEEDSIE: My tunnels are 40 feet away. The big new pit lines up exactly with the survey stakes. They even left the instruction manual in it.",
    prompt:"Which evidence determines the hole's actual origin?",
    choices:[
     {id:"survey",label:"COMPARE THE SURVEY STAKES WITH THE CLUB PLAN",right:true,
      reply:"CHIP: Survey matches the bunker blueprint. No gopher crime. Amazing what reading a map can do."},
     {id:"dreads",label:"CONFISCATE TWEEDSIE'S SUNGLASSES",right:false,
      reply:"TWEEDSIE: These are prescription cool, officer. None of this proves a thing."},
     {id:"trap",label:"INSTALL A BILLABLE GOPHER TRAP",right:false,
      reply:"CHIP: There is no gopher at the pit. Reggie's trap invoices appear to have multiplied anyway."}
    ]},
   {id:"the-verdict",place:"TVPD PUBLIC REPORT DESK",speaker:"BUFFER BOB",
    text:"BOB: Chief McBadge is ready to accuse anyone with paws. The signed contract proves Reggie ordered the new hazard and never told his golfers.",
    prompt:"How should the case be closed?",
    choices:[
     {id:"notice",label:"CORRECT THE COURSE MAP AND VOID THE FALSE CHARGE",right:true,
      reply:"CHIP: Nothing was stolen. Players get a new course map, and Tweedsie gets his name cleared."},
     {id:"cuff",label:"ARREST ALL GROUNDSKEEPERS FOR LANDSCAPING",right:false,
      reply:"BOB: Landscaping is still not a crime, Chief. We've discussed this."},
     {id:"tax",label:"INVOICE EVERY GOLFER FOR HAVING SHOES",right:false,
      reply:"REGGIE: FINALLY, SOMEONE UNDERSTANDS MUNICIPAL FINANCE. CHIP: No."}
    ]}
  ]},
 {id:"billing",title:"THE GRAND RECOUNT OF NOTHING",code:"CROSSROADS CASE #002",
  summary:"Reggie disputes the golf tournament after the city's billing reversal. A receipt may be more powerful than a putter.",
  required:["reversal","cup"],origin:["STEMSIDE BILLING FINALE","GRAND STEM CUP FINISH"],
  reward:"BILLING BIRDIE",color:"amber",scenes:[
   {id:"press",place:"SPACEALITE NEWS DESK",speaker:"REGGIE BANDS",
    text:"REGGIE: The Grand Stem Cup is rigged! My golf fee wasn't paid after someone abolished the Universal Billing Charge!",
    prompt:"What is the first thing the tournament commissioner needs?",
    choices:[
     {id:"score",label:"PULL UP THE OFFICIAL THREE-HOLE SCORECARD",right:true,
      reply:"CINDY: Three holes, valid strokes, signed card. Fees don't alter scores."},
     {id:"fee",label:"RESTORE THE UNIVERSAL BILLING CHARGE",right:false,
      reply:"BOB: A charge that was voided by the town cannot be revived by shouting at a flag."},
     {id:"erase",label:"DELETE THE CHAMPION'S SCORES",right:false,
      reply:"CHIP: That destroys evidence instead of checking it. Quite the strategy."}
    ]},
   {id:"audit",place:"TWEEDCORP PAPERWORK BUNKER",speaker:"BUFFER BOB",
    text:"BOB: I found two documents: one is a signed scorecard, and the other is a subscription invoice for 'walking near grass'.",
    prompt:"Which record controls the championship?",
    choices:[
     {id:"signed",label:"FOLLOW THE SIGNED SCORECARD, NOT A BILL",right:true,
      reply:"BOB: Correct. A golf score is not determined by whoever mails the biggest bill."},
     {id:"invoice",label:"USE THE HIGHEST INVOICE AS THE WINNER",right:false,
      reply:"REGGIE: I'M A CHAMPION! CINDY: You're a line item."},
     {id:"coin",label:"FLIP A COIN SOLD BY SPACEALITE",right:false,
      reply:"REGGIE: Every coin flip incurs a convenience fee. Not helping."}
    ]},
   {id:"final",place:"GRAND STEM CUP PODIUM",speaker:"DUKE VON DIVOT",
    text:"DUKE: The scores are intact, the billing scheme is void, and Reggie's protest is written on a napkin that says 'I deserve more'.",
    prompt:"Deliver the final ruling.",
    choices:[
     {id:"stand",label:"HONOR THE SCORES AND REJECT THE FAKE FEE",right:true,
      reply:"THE CROWD: FORE! REGGIE: YOU CAN'T JUST USE FACTS AGAINST ME!"},
     {id:"redo",label:"REPLAY THE TOURNAMENT UNTIL REGGIE WINS",right:false,
      reply:"CINDY: That's not how sporting events work, despite the evidence of television."},
     {id:"taxagain",label:"CHARGE THE SPECTATORS PER CHEER",right:false,
      reply:"BOB: The billing reversal already covered this exact nonsense."}
    ]}
  ]},
 {id:"ledger",title:"THE UNDERGROUND EVIDENCE DELIVERY",code:"CROSSROADS CASE #003",
  summary:"Chip's dispatch ledger meets Tweedsie's courier receipts. Nobody is guilty, which is devastating news for Chief McBadge.",
  required:["deputy","courier"],origin:["TWEEDLEPD PATROL SHIFT","TWEEDSIE COURIER UNION"],
  reward:"CROSSOVER COURIER",color:"blue",scenes:[
   {id:"dispatch",place:"TVPD RADIO ROOM",speaker:"CHIEF McBADGE",
    text:"CHIEF: Rookie! Three parcels were seen below city hall. I'm declaring an interdepartmental emergency! And also lunch.",
    prompt:"How should Chip begin?",
    choices:[
     {id:"manifest",label:"REQUEST THE OFFICIAL COURIER MANIFEST",right:true,
      reply:"DISPATCH: Three legal deliveries, three original receipts. The emergency appears to be Chief's imagination."},
     {id:"raid",label:"SEND A SWAT TEAM INTO A ONE-FOOT TUNNEL",right:false,
      reply:"CHIP: The squad car doesn't fit. Neither does the chief's ego."},
     {id:"confiscate",label:"SEIZE EVERY PARCEL WITHOUT A REASON",right:false,
      reply:"BOB: The city has not invented a valid reason to do that. An impressive first."}
    ]},
   {id:"exchange",place:"THE UNDERGROUND EXCHANGE",speaker:"TWEEDSIE",
    text:"TWEEDSIE: I got six fictional curiosities, three filed deliveries and zero unpaid tolls. Check the dates, Chip.",
    prompt:"Which records answer the question?",
    choices:[
     {id:"receipts",label:"MATCH THE THREE COURIER RECEIPTS TO DISPATCH",right:true,
      reply:"CHIP: Every delivery was filed. Nothing illegal happened. The paperwork is almost suspiciously correct."},
     {id:"scent",label:"CLASSIFY THE AIR AS CONTRABAND",right:false,
      reply:"TWEEDSIE: That's just the mushroom station, bro. No crime in smelling weird."},
     {id:"hole",label:"ARREST THE NEAREST HOLE",right:false,
      reply:"CHIP: Chief, your 'suspect' is an absence of earth. It has no legal representation."}
    ]},
   {id:"close",place:"STEMSIDE PUBLIC RECORDS",speaker:"OFFICER CHIP",
    text:"CHIP: The courier manifests are valid, the dispatch calls are closed and the town is safe. The chief is insisting we charge the tunnels rent.",
    prompt:"What is the correct final report?",
    choices:[
     {id:"clear",label:"CLOSE THE FALSE ALARM AND KEEP THE RECEIPTS",right:true,
      reply:"TWEEDSIE: Same hole. Different day. CHIP: For once, a statement I can put in the report."},
     {id:"billing",label:"CREATE A NEW TUNNEL BREATHING FEE",right:false,
      reply:"REGGIE: A VISIONARY! CHIP: That is not a compliment."},
     {id:"book",label:"BOOK THE CITY HALL BASEMENT FOR RESISTING",right:false,
      reply:"DISPATCH: The basement refused to cooperate. Because it is a basement."}
    ]}
  ]}
]);
const caseIds=new Set(CROSSROADS_CASES.map(c=>c.id));
export const caseOf=id=>CROSSROADS_CASES.find(x=>x.id===id)||null;
export const initialCrossroads=()=>({version:CROSSROADS_VERSION,completed:[],active:null,wrong:0});
const validProof=(passport,mission)=>Boolean(mission&&mission.required.every(id=>passport?.badges?.some(b=>b.id===id&&b.earned)));
export const unlockedCases=passport=>CROSSROADS_CASES.filter(c=>validProof(passport,c)).map(c=>c.id);
export const isUnlocked=(passport,id)=>validProof(passport,caseOf(id));
export function decodeCrossroads(raw,passport){
 if(!raw||typeof raw!=="object"||Array.isArray(raw)||raw.version!==CROSSROADS_VERSION)return null;
 const completed=Array.isArray(raw.completed)?[...new Set(raw.completed.filter(x=>typeof x==="string"&&caseIds.has(x)&&isUnlocked(passport,x)))]:[];
 let active=null;
 const entry=raw.active;
 const mission=caseOf(entry?.id);
 if(mission&&isUnlocked(passport,mission.id)&&!completed.includes(mission.id)&&
    Number.isInteger(entry.step)&&entry.step>=0&&entry.step<mission.scenes.length){
  active={id:mission.id,step:entry.step};
 }
 return {version:CROSSROADS_VERSION,completed,active,
   wrong:Number.isInteger(raw.wrong)?Math.max(0,Math.min(raw.wrong,9999)):0};
}
export function encodeCrossroads(progress,passport){
 const clean=decodeCrossroads({...progress,version:CROSSROADS_VERSION},passport);
 if(!clean)throw new Error("Invalid crossover save");
 return JSON.stringify(clean);
}
export function beginCrossroads(progress,passport,id){
 const mission=caseOf(id);
 if(!mission)return {progress,started:false,feedback:"THAT INCIDENT IS NOT IN THE CROSSROADS FILE CABINET."};
 if(!isUnlocked(passport,id))return {progress,started:false,feedback:"COMPLETE THE TWO LINKED ADVENTURE ACHIEVEMENTS TO UNLOCK THIS CASE."};
 if(progress.completed.includes(id))return {progress,started:false,feedback:"CASE ALREADY CLOSED. THE FILE IS IN THE ARCHIVES."};
 if(progress.active&&progress.active.id!==id)return {progress,started:false,feedback:"FINISH YOUR ACTIVE CROSSOVER CASE FIRST, ROOKIE."};
 return {progress:{...progress,active:{id,step:progress.active?.id===id?progress.active.step:0}},
  started:true,feedback:"CASE OPENED · "+mission.title+". FOLLOW THE EVIDENCE, NOT REGGIE'S INVOICES."};
}
export const activeScene=progress=>{
 const active=progress?.active,mission=caseOf(active?.id);
 return mission?.scenes[active?.step]||null;
};
export function chooseCrossroads(progress,passport,choiceId){
 const active=progress?.active,mission=caseOf(active?.id),scene=activeScene(progress);
 if(!mission||!scene)return {progress,correct:false,feedback:"NO CASE ACTIVE. SELECT AN UNLOCKED MISSION."};
 if(!isUnlocked(passport,mission.id))return {progress:{...progress,active:null},correct:false,feedback:"SOURCE GAME PROGRESS NOT FOUND. REOPEN YOUR ORIGINAL GAMES."};
 const choice=scene.choices.find(c=>c.id===choiceId);
 if(!choice)return {progress,correct:false,feedback:"INVALID CASE ACTION. THIS FORM WAS NOT RECOGNIZED."};
 if(!choice.right)return {progress:{...progress,wrong:Math.min(9999,progress.wrong+1)},correct:false,
  feedback:choice.reply+" · WRONG LEAD. TRY ANOTHER EVIDENCE-BASED RESPONSE."};
 if(active.step===mission.scenes.length-1)return {
  progress:{...progress,active:null,completed:[...progress.completed,mission.id]},correct:true,
  finished:mission,feedback:choice.reply+" · CASE CLOSED! YOU EARNED "+mission.reward+"."};
 return {progress:{...progress,active:{id:mission.id,step:active.step+1}},correct:true,
  feedback:choice.reply+" · EVIDENCE ACCEPTED. CONTINUE TO THE NEXT SCENE."};
}
export const caseCount=p=>p?.completed?.length||0;
