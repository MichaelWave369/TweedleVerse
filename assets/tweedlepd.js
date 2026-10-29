import {PD_SAVE_KEY,PD_SAVE_VERSION,SCENES,CLUES,WITNESSES,REPORT_SUSPECTS,REPORT_EXPLANATIONS,REPORT_EVIDENCE,initialPD,decodePD,encodePD,findScene,sceneClues,sceneWitnesses,travelTo,inspect,interview,canFile,submitReport,caseStatus,objective} from "./pd-core.mjs";

// All writing to the DOM is plain textContent, including previously saved notes.
const el=id=>document.getElementById(id);
let state=initialPD();
let lastLine="CHIEF McBADGE: THE DONUTS ARE GONE! SOMEONE STOLE EVERY LAST ONE! FIND ME A PROFESSIONAL!";
const crests=Object.freeze({precinct:"TVPD",coffeechucks:"COFFEE CHUCKS",lackluster:"LACKLUSTER",tweedcorp:"TWEEDCORP"});
const captions=Object.freeze({precinct:"OFFICER CHIP // BADGE PENDING",coffeechucks:"EVIDENCE WITH A SIDE OF MILK",lackluster:"BE KIND. REWIND. TESTIFY.",tweedcorp:"EVERY FORM COMES WITH MORE FORMS"});
function tell(text,speaker="OFFICER CHIP · CASE NOTES"){
 lastLine=text;
 el("speaker").textContent=speaker;
 el("pd-dialogue").textContent=text;
}
function save(){
 try{
  localStorage.setItem(PD_SAVE_KEY,encodePD(state));
  el("pd-save-message").textContent="AUTO-SAVED · "+state.clues.length+" CLUES · "+state.interviews.length+" INTERVIEWS · THIS BROWSER ONLY";
 }catch{
  el("pd-save-message").textContent="BROWSER STORAGE UNAVAILABLE. THIS RUN CAN CONTINUE UNTIL THE TAB CLOSES.";
 }
}
function commit(next,feedback,speaker){
 state=next;
 if(feedback)tell(feedback,speaker);
 render();
 save();
}
function makeOption(select,value,label){
 const opt=document.createElement("option");
 opt.value=value;opt.textContent=label;select.append(opt);
}
function setupReport(){
 const fields=[["pd-suspect",REPORT_SUSPECTS],["pd-explanation",REPORT_EXPLANATIONS],["pd-proof",REPORT_EVIDENCE]];
 for(const [id,options] of fields)for(const option of options)makeOption(el(id),option.id,option.label);
}
function renderTravel(){
 const root=el("pd-travel");
 root.replaceChildren();
 for(const scene of SCENES){
  const button=document.createElement("button");
  button.type="button";button.textContent=scene.name;
  if(scene.id===state.scene)button.setAttribute("aria-current","location");
  button.disabled=state.solved||scene.id===state.scene;
  button.addEventListener("click",()=>{
   commit(travelTo(state,scene.id),"DISPATCH: NOW ARRIVING AT "+scene.name+". THIS TRIP WILL BE ADDED TO YOUR UNPAID MILEAGE REPORT.","TVPD DISPATCH");
  });
  root.append(button);
 }
}
function renderActions(){
 for(const [containerId,list,items,fn] of [
  ["clue-actions",sceneClues(state.scene),state.clues,inspect],
  ["witness-actions",sceneWitnesses(state.scene),state.interviews,interview]
 ]){
  const root=el(containerId);root.replaceChildren();
  if(!list.length){
   const empty=document.createElement("p");empty.className="empty";
   empty.textContent="No "+(containerId==="clue-actions"?"evidence":"witnesses")+" at this location.";
   root.append(empty);
  }
  for(const item of list){
   const button=document.createElement("button");
   button.type="button";
   const known=items.includes(item.id);
   button.textContent=(known?"✓ ":"")+(containerId==="clue-actions"?item.label:"QUESTION "+item.name);
   button.className=known?"done":"";
   button.disabled=state.solved;
   button.addEventListener("click",()=>{
    const r=fn(state,item.id);
    commit(r.progress,r.feedback,containerId==="clue-actions"?"OFFICER CHIP · EVIDENCE LOG":item.name);
   });
   root.append(button);
  }
 }
}
function renderCasebook(){
 el("pd-status").textContent=caseStatus(state);
 el("pd-objective").textContent=objective(state);
 el("pd-evidence-count").textContent=state.clues.length+" / "+CLUES.length+" CLUES · "+state.interviews.length+" / "+WITNESSES.length+" STATEMENTS";
 el("pd-evidence-fill").style.width=(state.clues.length/CLUES.length*100)+"%";
 el("pd-evidence-meter").setAttribute("aria-valuenow",String(state.clues.length));
 for(const [id,ids,all,empty] of [
  ["pd-clue-list",state.clues,CLUES,"No clues collected."],
  ["pd-witness-list",state.interviews,WITNESSES,"Nobody has given a statement."]
 ]){
  const root=el(id);root.replaceChildren();
  if(!ids.length){const li=document.createElement("li");li.textContent=empty;root.append(li)}
  for(const itemId of ids){
   const item=all.find(x=>x.id===itemId);
   if(!item)continue;
   const li=document.createElement("li"),strong=document.createElement("strong");
   strong.textContent=item.title||item.name;
   li.append(strong,document.createTextNode(item.detail||item.line));
   root.append(li);
  }
 }
}
function renderReport(){
 const ready=canFile(state);
 el("pd-submit").disabled=!ready;
 for(const id of ["pd-suspect","pd-explanation","pd-proof"])el(id).disabled=state.solved;
 el("pd-credits").hidden=!state.solved;
 el("pd-report-status").textContent=state.solved?"REPORT 97-B APPROVED. NO CHARGES FILED. ONE EXTREMELY EMBARRASSED CHIEF.":
  ready?"EVIDENCE COMPLETE. YOU MAY NOW FILE REPORT 97-B. CHECK YOUR FACTS.":
  "COLLECT THE RECEIPT AND SECURITY TAPE; INTERVIEW CHUCK AND MARTY FIRST.";
}
function render(){
 const scene=findScene(state.scene)||SCENES[0];
 el("scene-id").textContent=scene.name;
 el("scene-title").textContent=scene.name;
 el("scene-sub").textContent=scene.sub;
 el("scene-detail").textContent=scene.detail;
 el("building-crest").textContent=crests[scene.id];
 el("stage-caption").textContent=captions[scene.id];
 el("pd-stage").dataset.scene=scene.theme==="station"?"precinct":scene.id;
 el("pd-stage").setAttribute("aria-label","Original cartoon game scene: "+scene.name+", with rookie officer Chip in the foreground.");
 renderTravel();renderActions();renderCasebook();renderReport();
}
function restore(){
 try{
  const raw=localStorage.getItem(PD_SAVE_KEY);
  if(!raw)return;
  const restored=decodePD(JSON.parse(raw));
  if(restored){
   state=restored;
   tell(restored.solved?"YOUR CASE IS STILL CLOSED. CHIEF McBADGE CONTINUES TO DENY EATING ANYTHING.":"WELCOME BACK, ROOKIE. YOUR EVIDENCE IS STILL WHERE YOU LEFT IT.","TVPD CASE ARCHIVE");
  }else{
   el("pd-save-message").textContent="UNRECOGNIZED SAVE IGNORED. STARTING A CLEAN CASE.";
  }
 }catch{
  el("pd-save-message").textContent="LOCAL SAVE COULD NOT BE READ. YOU CAN STILL PLAY.";
 }
}
el("pd-report").addEventListener("submit",event=>{
 event.preventDefault();
 const result=submitReport(state,{suspect:el("pd-suspect").value,explanation:el("pd-explanation").value,evidence:el("pd-proof").value});
 commit(result.progress,result.feedback,result.success?"TVPD CASE CLOSED":"BUFFER BOB · QUALITY CONTROL");
 if(result.success)el("pd-credits").scrollIntoView({block:"nearest",behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});
});
el("pd-reset").addEventListener("click",()=>{
 if(!window.confirm("Restart TweedlePD Case #001? This replaces only the TweedlePD local case save. Your Stemside RPG save will not be touched."))return;
 state=initialPD();
 for(const id of ["pd-suspect","pd-explanation","pd-proof"])el(id).value="";
 commit(state,"DISPATCH: CASE REOPENED. CHIEF McBADGE HAS EATEN THE EVIDENCE AGAIN.","TVPD DISPATCH");
});
setupReport();restore();render();
