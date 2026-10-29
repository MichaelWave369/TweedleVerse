// TweedlePD v0.1: a deterministic, local-only comedy detective adventure.
// Designed as an original fictional parody of bureaucratic nonsense. No network or DOM use.
export const PD_SAVE_KEY="tweedleverse.tweedlepd.case001.v1";
export const PD_SAVE_VERSION=1;
export const CASE_TITLE="THE MISSING DONUT INCIDENT";
export const SCENES=Object.freeze([
 {id:"precinct",name:"TVPD PRECINCT",sub:"Department of Law and Extremely Unnecessary Order",theme:"station",detail:"The bulletin board contains 38 wanted posters, all of the same printer. The coffee is officially evidence."},
 {id:"coffeechucks",name:"COFFEECHUCKS",sub:"Coffee and unfortunate testimony",theme:"diner",detail:"The shop smells like beans, guilt, and a shift manager actively regretting his career decisions."},
 {id:"lackluster",name:"LACKLUSTER VIDEO",sub:"Security tapes from tomorrow",theme:"video",detail:"Marty rents surveillance recordings with late fees that start before the crime."},
 {id:"tweedcorp",name:"TWEEDCORP COMPLIANCE",sub:"Bureaucracy is considered probable cause",theme:"office",detail:"Buffer Bob has printed so many forms the paper supply requires a permit."}
]);
export const CLUES=Object.freeze([
 {id:"crumbs",scene:"precinct",label:"Inspect the suspicious crumbs",title:"EVIDENCE 01 · THE CRUMBS",detail:"A neat trail of powdered sugar leads directly under Chief McBadge's desk. The chief claims sugar is a controlled substance."},
 {id:"log",scene:"precinct",label:"Read the duty roster",title:"EVIDENCE 02 · THE DUTY ROSTER",detail:"Chief McBadge was on 'Donut Security' for four hours, alone. A coffee stain obscures the rest of his schedule."},
 {id:"receipt",scene:"coffeechucks",label:"Review yesterday's receipt",title:"EVIDENCE 03 · THE RECEIPT",detail:"CoffeeChucks delivered exactly one dozen donuts to TVPD. Signed for by 'B. McBadge'. Spacealite billed another twelve for looking at them."},
 {id:"tape",scene:"lackluster",label:"Play the security tape",title:"EVIDENCE 04 · THE FUTURE-DATED TAPE",detail:"The footage clearly shows Chief McBadge eating the last donut, then putting the empty box back on the desk and shouting ROBBERY."},
 {id:"invoice",scene:"tweedcorp",label:"Audit the Spacealite invoice",title:"EVIDENCE 05 · THE INVOICE",detail:"Spacealite attempted to charge the precinct a 'missing pastry investigation fee'. Buffer Bob has marked it NON-BINDING."}
]);
export const WITNESSES=Object.freeze([
 {id:"chief",scene:"precinct",name:"CHIEF BUSTER McBADGE",line:"CHIEF: Someone stole every donut! I was guarding them personally. The white powder on my uniform? Tactical chalk."},
 {id:"chuck",scene:"coffeechucks",name:"CHUCK, SHIFT MANAGER",line:"CHUCK: I delivered twelve. The chief signed the receipt, then asked for a glass of milk and an alibi."},
 {id:"marty",scene:"lackluster",name:"MARTY, REWIND TECHNICIAN",line:"MARTY: Our camera caught it. I have to rewind it to tomorrow to see yesterday. Don't ask me how."},
 {id:"bob",scene:"tweedcorp",name:"BUFFER BOB, COMPLIANCE",line:"BOB: There was no outside intruder. There was, however, an attempt to monetize the investigation. Reggie signed the invoice."}
]);
export const REPORT_SUSPECTS=Object.freeze([
 {id:"chief",label:"CHIEF McBADGE"},
 {id:"tweedsie",label:"TWEEDSIE"},
 {id:"reggie",label:"REGGIE BANDS"},
 {id:"unknown",label:"AN UNKNOWN PASTRY CRIMINAL"}
]);
export const REPORT_EXPLANATIONS=Object.freeze([
 {id:"snack",label:"THE CHIEF ATE THE DONUTS"},
 {id:"theft",label:"A THIEF STOLE THE DONUTS"},
 {id:"portal",label:"THE BOX ENTERED ANOTHER DIMENSION"},
 {id:"subscription",label:"SPACEALITE CONVERTED THEM TO A SUBSCRIPTION"}
]);
export const REPORT_EVIDENCE=Object.freeze([
 {id:"tape",label:"SECURITY TAPE"},
 {id:"receipt",label:"DELIVERY RECEIPT"},
 {id:"crumbs",label:"POWDERED SUGAR"},
 {id:"invoice",label:"SPACEALITE BILL"}
]);
const sceneIds=new Set(SCENES.map(x=>x.id));
const clueIds=new Set(CLUES.map(x=>x.id));
const witnessIds=new Set(WITNESSES.map(x=>x.id));
const unique=(input,valid)=>Array.isArray(input)?[...new Set(input.filter(x=>typeof x==="string"&&valid.has(x)))]:[];
export function initialPD(){
 return {version:PD_SAVE_VERSION,scene:"precinct",clues:[],interviews:[],attempts:0,solved:false,report:null};
}
export function decodePD(raw){
 if(!raw||typeof raw!=="object"||Array.isArray(raw)||raw.version!==PD_SAVE_VERSION)return null;
 const start=initialPD();
 const scene=sceneIds.has(raw.scene)?raw.scene:start.scene;
 const clues=unique(raw.clues,clueIds),interviews=unique(raw.interviews,witnessIds);
 const attempts=Number.isInteger(raw.attempts)?Math.max(0,Math.min(99,raw.attempts)):0;
 const solved=raw.solved===true&&clues.includes("tape")&&clues.includes("receipt")&&interviews.includes("chuck")&&interviews.includes("marty");
 const report=solved?"chief:snack:tape":null;
 return {version:PD_SAVE_VERSION,scene,clues,interviews,attempts,solved,report};
}
export function encodePD(progress){
 const validated=decodePD({...progress,version:PD_SAVE_VERSION});
 if(!validated)throw new Error("Invalid detective save");
 return JSON.stringify(validated);
}
export function findScene(id){return SCENES.find(x=>x.id===id)||null}
export function sceneClues(scene){return CLUES.filter(x=>x.scene===scene)}
export function sceneWitnesses(scene){return WITNESSES.filter(x=>x.scene===scene)}
export function travelTo(progress,scene){
 if(!sceneIds.has(scene)||progress.solved)return progress;
 return {...progress,scene};
}
export function inspect(progress,id){
 const clue=CLUES.find(x=>x.id===id&&x.scene===progress.scene);
 if(!clue||progress.solved)return {progress,feedback:"YOU CANNOT FILE THAT AS EVIDENCE HERE.",newItem:false};
 if(progress.clues.includes(id))return {progress,feedback:"ALREADY BAGGED. THE EVIDENCE ROOM HAS ENOUGH DUPLICATES.",newItem:false};
 return {progress:{...progress,clues:[...progress.clues,id]},feedback:clue.detail,newItem:true};
}
export function interview(progress,id){
 const witness=WITNESSES.find(x=>x.id===id&&x.scene===progress.scene);
 if(!witness||progress.solved)return {progress,feedback:"THAT WITNESS ISN'T ON THIS SCENE'S CALL SHEET.",newItem:false};
 if(progress.interviews.includes(id))return {progress,feedback:witness.line+" (STATEMENT ALREADY RECORDED.)",newItem:false};
 return {progress:{...progress,interviews:[...progress.interviews,id]},feedback:witness.line,newItem:true};
}
export function canFile(progress){
 return !progress.solved&&progress.clues.includes("tape")&&progress.clues.includes("receipt")&&progress.interviews.includes("chuck")&&progress.interviews.includes("marty");
}
export function submitReport(progress,{suspect,explanation,evidence}={}){
 if(progress.solved)return {progress,success:false,feedback:"CASE ALREADY CLOSED. NO DOUBLE OVERTIME."};
 if(!canFile(progress))return {progress,success:false,feedback:"YOUR REPORT IS INCOMPLETE. FIND THE RECEIPT AND TAPE; INTERVIEW CHUCK AND MARTY."};
 if(progress.scene!=="precinct")return {progress,success:false,feedback:"RETURN TO THE TVPD PRECINCT TO FILE THIS REPORT. EVEN REASONABLE RULES HAPPEN SOMETIMES."};
 const correct=suspect==="chief"&&explanation==="snack"&&evidence==="tape";
 const attempts=Math.min(99,progress.attempts+1);
 if(!correct)return {progress:{...progress,attempts},success:false,
   feedback:"REPORT RETURNED: THE EVIDENCE DOES NOT SUPPORT THAT CONCLUSION. REVISIT YOUR CASEBOOK. NO ARRESTS, ROOKIE."};
 return {progress:{...progress,attempts,solved:true,report:"chief:snack:tape"},success:true,
  feedback:"CASE CLOSED! Chief McBadge ate the donuts himself. No theft occurred. Tweedsie did not commit this crime. Reggie's investigation invoice is void. You earn the UNPAID DETECTIVE BADGE."};
}
export function caseStatus(progress){
 if(progress.solved)return "CASE CLOSED · UNPAID DETECTIVE BADGE AWARDED";
 if(canFile(progress))return "READY TO FILE · TAKE YOUR EVIDENCE TO THE REPORT DESK";
 return "OPEN INVESTIGATION · "+progress.clues.length+" / "+CLUES.length+" CLUES · "+progress.interviews.length+" / "+WITNESSES.length+" STATEMENTS";
}
export function objective(progress){
 if(progress.solved)return "Case solved. Chief McBadge owes CoffeeChucks an apology and twelve donuts.";
 if(canFile(progress))return "Return to the TVPD precinct and file your report at the paperwork desk.";
 if(!progress.clues.includes("crumbs"))return "Inspect the crumbs in the TVPD precinct.";
 if(!progress.clues.includes("receipt"))return "Visit CoffeeChucks and obtain the delivery receipt.";
 if(!progress.interviews.includes("chuck"))return "Interview Chuck about the delivery.";
 if(!progress.clues.includes("tape"))return "Find the security tape at Lackluster Video.";
 if(!progress.interviews.includes("marty"))return "Interview Marty about the tape.";
 return "Keep interviewing and collecting evidence. This department rarely does either.";
}
