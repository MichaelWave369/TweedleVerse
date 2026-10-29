import {PASSPORT_SOURCES,readPassport} from "./passport-core.mjs";
import {CROSSROADS_KEY,CROSSROADS_CASES,initialCrossroads,decodeCrossroads,encodeCrossroads,isUnlocked,beginCrossroads,activeScene,chooseCrossroads,caseOf,caseCount} from "./crossroads-core.mjs";
const el=id=>document.getElementById(id);
let passport=readPassport({}),progress=initialCrossroads(),message="",storageOK=true;
const make=(tag,text,cls)=>{const node=document.createElement(tag);if(typeof text==="string")node.textContent=text;if(cls)node.className=cls;return node};
function readProof(){
 const raw={};storageOK=true;
 try{for(const source of PASSPORT_SOURCES)raw[source.id]=localStorage.getItem(source.key)}
 catch{storageOK=false;for(const source of PASSPORT_SOURCES)raw[source.id]=null}
 passport=readPassport(raw);
 try{const data=localStorage.getItem(CROSSROADS_KEY);
  progress=data?decodeCrossroads(JSON.parse(data),passport)||initialCrossroads():initialCrossroads();
 }catch{progress=initialCrossroads()}
}
function save(){
 try{localStorage.setItem(CROSSROADS_KEY,encodeCrossroads(progress,passport));el("crossroads-storage").textContent="CROSSROADS CASE LEDGER SAVED · SEPARATE FROM ALL SEVEN ORIGINAL GAME SAVE SLOTS"}
 catch{storageOK=false;el("crossroads-storage").textContent="LOCAL STORAGE UNAVAILABLE. CASES WORK IN THIS TAB UNTIL CLOSED."}
}
function receipt(text){message=text;el("crossroads-feedback").textContent=text}
function renderCards(){
 const root=el("crossroads-case-grid");root.replaceChildren();
 for(const mission of CROSSROADS_CASES){
  const unlocked=isUnlocked(passport,mission.id),done=progress.completed.includes(mission.id);
  const article=make("article",null,"crossroads-case "+mission.color+(done?" closed":!unlocked?" locked":""));
  article.append(make("p",mission.code,"eyebrow"),make("h3",mission.title),make("p",mission.summary));
  const prereq=make("div",null,"crossroads-proof");
  for(const id of mission.required){
   const stamp=passport.badges.find(b=>b.id===id),ok=stamp?.earned;
   const line=make("span",(ok?"✓ ":"○ ")+(stamp?.title||id),ok?"proof-yes":"proof-no");
   prereq.append(line);
  }
  article.append(prereq);
  const badge=make("p",done?"✓ CASE CLOSED · "+mission.reward:unlocked?"AVAILABLE · EVIDENCE REQUIRED":"LOCKED · COMPLETE TWO SOURCE GAME STAMPS","crossroads-case-state");article.append(badge);
  if(!unlocked){
   const links=make("div",null,"crossroads-source-links");
   for(const id of mission.required){
    const stamp=passport.badges.find(b=>b.id===id);
    if(stamp?.earned)continue;
    const a=make("a","EARN "+(stamp?.title||id)+" ↗");a.href=stamp?.href||"arcade.html";links.append(a);
   }
   article.append(links);
  }
  const button=make("button",done?"CASE IN ARCHIVES":progress.active?.id===mission.id?"CONTINUE INVESTIGATION":"OPEN CASE FILE", "btn main-btn");
  button.type="button";button.disabled=done||!unlocked||Boolean(progress.active&&progress.active.id!==mission.id);
  button.addEventListener("click",()=>{
   const r=beginCrossroads(progress,passport,mission.id);
   progress=r.progress;receipt(r.feedback);render();if(r.started){save();el("crossroads-investigation").scrollIntoView({block:"start"})}
  });
  article.append(button);root.append(article);
 }
}
function renderScene(){
 const scene=activeScene(progress),mission=caseOf(progress.active?.id);
 const section=el("crossroads-investigation");
 section.hidden=!scene;
 if(!scene||!mission)return;
 el("crossroads-number").textContent=mission.code;
 el("investigation-heading").textContent=mission.title;
 el("crossroads-scene-count").textContent="SCENE "+(progress.active.step+1)+" / "+mission.scenes.length;
 el("crossroads-scene-place").textContent=scene.place;
 el("crossroads-scene-sign").textContent=scene.place;
 el("crossroads-art").dataset.case=mission.id;
 el("crossroads-speaker").textContent=scene.speaker;
 el("crossroads-story").textContent=scene.text;
 el("crossroads-question").textContent=scene.prompt;
 const options=el("crossroads-options");options.replaceChildren();
 for(const choice of scene.choices){
  const button=make("button",choice.label);
  button.type="button";
  button.addEventListener("click",()=>{
   const result=chooseCrossroads(progress,passport,choice.id);
   progress=result.progress;
   receipt(result.feedback);
   render();
   save();
   if(result.finished){el("crossroads-victory-name").textContent=result.finished.reward;
    el("crossroads-victory-copy").textContent=result.finished.title+" is officially closed. The incident exists only in your own browser case ledger.";
    el("crossroads-victory").hidden=false;el("crossroads-victory").scrollIntoView({block:"start"});}
  });
  options.append(button);
 }
}
function render(){
 el("crossroads-count").textContent=caseCount(progress)+" / "+CROSSROADS_CASES.length+" CASES CLOSED";
 el("crossroads-status").textContent=!storageOK?"LOCAL STORAGE NOT AVAILABLE":
  CROSSROADS_CASES.filter(c=>isUnlocked(passport,c.id)).length+" CASES UNLOCKED · "+caseCount(progress)+" COMPLETED · NO EXTERNAL SAVE WRITES";
 el("crossroads-mistakes").textContent=progress.wrong+" WRONG LEADS · ZERO REAL FINES";
 el("crossroads-victory").hidden=true;
 renderCards();renderScene();
 if(message)el("crossroads-feedback").textContent=message;
}
function refresh(){
 const before=progress.active?.id;
 readProof();
 receipt(before&&!progress.active?"SOURCE ACHIEVEMENTS NO LONGER AVAILABLE ON THIS BROWSER. THE UNVERIFIED CASE WAS SAFELY CLOSED.":"PROOF RECHECKED AGAINST THE ORIGINAL LOCAL GAME SAVES.");
 render();
}
el("crossroads-refresh").addEventListener("click",refresh);
el("crossroads-back").addEventListener("click",()=>el("crossroads-case-grid").scrollIntoView({block:"start"}));
el("crossroads-more").addEventListener("click",()=>el("crossroads-case-grid").scrollIntoView({block:"start"}));
el("crossroads-reset").addEventListener("click",()=>{
 if(!window.confirm("Reset ONLY the Crossroads side-case ledger? This will not touch the seven existing game saves or the Universe Passport."))return;
 progress=initialCrossroads();receipt("CROSSROADS SIDE CASES REOPENED. YOUR ORIGINAL GAMES REMAIN UNTOUCHED.");
 save();render();
});
document.addEventListener("visibilitychange",()=>{if(!document.hidden)refresh()});
window.addEventListener("pageshow",event=>{if(event.persisted)refresh()});
readProof();receipt("CASE BOARD READY. GAME PROGRESS IS READ-ONLY; ONLY THIS NEW CROSSROADS LEDGER IS WRITABLE.");render();
