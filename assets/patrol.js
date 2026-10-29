import {PD_SAVE_KEY} from "./pd-core.mjs";
import {PATROL_SAVE_KEY,PATROL_WORLD,PATROL_STOPS,PATROL_CALLS,initialPatrol,decodePatrol,encodePatrol,detectiveEligible,callFor,checkpoint,shiftComplete,atDispatch,moveCar,respond,shiftStatus,distance} from "./patrol-core.mjs";
const el=id=>document.getElementById(id);
const canvas=el("patrol-canvas"),ctx=canvas.getContext("2d");
const arrows={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
let state=initialPatrol(),keys=new Set(),touch=new Set(),last=0,lastSave=0,lastCar={...state.car},openRadio=false,notice="CHIEF McBADGE: YOUR CRUISER IS INSURED FOR TWO DONUTS. PLEASE DO NOT SCRATCH IT.",facing=0,padHeld=false;
function save(message){
 try{
  localStorage.setItem(PATROL_SAVE_KEY,encodePatrol(state));
  lastCar={...state.car};
  el("patrol-save").textContent=message||"PATROL SAVED ON THIS DEVICE · NO UPLOAD";
 }catch{el("patrol-save").textContent="BROWSER STORAGE UNAVAILABLE. THIS SHIFT WORKS UNTIL THE TAB CLOSES."}
}
function restore(){
 try{
  const raw=localStorage.getItem(PATROL_SAVE_KEY);
  if(!raw)return;
  const p=decodePatrol(JSON.parse(raw));
  if(p){state=p;notice="DISPATCH: WELCOME BACK. YOU STILL OWE THE DEPARTMENT A PEN."}
  else notice="DISPATCH: DAMAGED PATROL RECORD IGNORED. RESTARTING YOUR SHIFT.";
 }catch{notice="DISPATCH: LOCAL PATROL SAVE COULD NOT BE LOADED. YOU CAN STILL PLAY."}
}
function canUnlock(){
 try{const raw=localStorage.getItem(PD_SAVE_KEY);return raw?detectiveEligible(JSON.parse(raw)):false}
 catch{return false}
}
function line(text){notice=text;el("patrol-feedback").textContent=text}
function sceneButtons(){
 const root=el("patrol-choices");root.replaceChildren();
 if(!openRadio||!atDispatch(state)||shiftComplete(state))return;
 const call=callFor(state);
 for(const choice of call.choices){
  const b=document.createElement("button");
  b.type="button";b.textContent=choice.label;
  b.addEventListener("click",()=>{
   const result=respond(state,choice.id);
   state=result.progress;
   if(result.correct)openRadio=false;
   line(result.feedback);
   render();save(result.correct?"DISPATCH CALL RESOLVED · SAVED LOCALLY":"REPORT CORRECTION RECORDED · SAVED LOCALLY");
  });
  root.append(b);
 }
}
function render(){
 const call=callFor(state),destination=checkpoint(state),done=shiftComplete(state),near=atDispatch(state);
 el("patrol-status").textContent=shiftStatus(state);
 el("patrol-rank").textContent=done?"OFFICER CHIP · SENIOR UNPAID DEPUTY":"OFFICER CHIP · UNPAID ROOKIE IN TRAINING";
 el("patrol-call-number").textContent=call?call.number:"TVPD DISPATCH · SHIFT COMPLETE";
 el("patrol-call-title").textContent=call?call.title:"THE SQUAD CAR SURVIVED";
 el("patrol-call-setup").textContent=call?call.setup:"All three calls resolved without unnecessary arrests. The chief is furious about your successful paperwork.";
 el("patrol-destination").textContent=destination?destination.name:"TVPD HOME BASE";
 el("patrol-arrival").textContent=done?"BADGE AWARDED · END OF SHIFT":near?"ON SCENE · OPEN RADIO TO DECIDE HOW TO RESPOND":"DRIVE TO "+destination.name+" TO RESPOND";
 el("patrol-interact").disabled=done||!near;
 el("patrol-interact").textContent=near&&openRadio?"RADIO OPEN · CHOOSE BELOW":"RESPOND AT LOCATION · E";
 el("patrol-fast-travel").disabled=done;
 el("patrol-count").textContent=state.resolved.length+" / 3 CALLS RESOLVED";
 el("patrol-errors").textContent=state.mistakes+" QUESTIONABLE DECISIONS LOGGED · NO REAL FINES";
 el("patrol-reward").hidden=!done;
 const log=el("patrol-log");log.replaceChildren();
 for(const [i,item] of PATROL_CALLS.entries()){
  const li=document.createElement("li");
  li.textContent=item.number+": "+item.title+" · "+(i<state.resolved.length?"RESOLVED":i===state.resolved.length?"ACTIVE":"AWAITING DISPATCH");
  if(i<state.resolved.length)li.className="done";
  if(i===state.resolved.length)li.className="next";
  log.append(li);
 }
 sceneButtons();
}
function interact(){
 if(!atDispatch(state)||shiftComplete(state))return;
 openRadio=true;
 line(callFor(state).witness+" · CHIP: Let's not arrest the first object we see.");
 render();
}
function fastTravel(){
 const goal=checkpoint(state);if(!goal)return;
 state={...state,car:{x:goal.x,y:goal.y}};
 openRadio=false;line("TVPD ACCESSIBILITY DISPATCH: ARRIVED AT "+goal.name+". NO MILEAGE PENALTY APPLIES.");
 render();save("ACCESSIBLE TRANSFER COMPLETE · SAVED LOCALLY");
 canvas.focus();
}
function draw(){
 if(!ctx)return;
 const {width:w,height:h}=PATROL_WORLD;
 ctx.clearRect(0,0,w,h);
 const sky=ctx.createLinearGradient(0,0,w,h);
 sky.addColorStop(0,"#475f7e");sky.addColorStop(1,"#2a6653");
 ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
 // Streets are original, schematic satire, not geographic GPS or a driving simulator.
 ctx.strokeStyle="#1d3245";ctx.lineWidth=100;
 for(const x of [220,650,1000]){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}
 for(const y of [205,630]){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
 ctx.strokeStyle="#c9bb8d";ctx.lineWidth=3;ctx.setLineDash([25,23]);
 for(const x of [220,650,1000]){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}
 for(const y of [205,630]){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
 ctx.setLineDash([]);
 ctx.font="900 30px Trebuchet MS,Arial";ctx.textAlign="left";
 ctx.fillStyle="#f3d6b677";ctx.fillText("NORTH STEMSIDE",25,60);
 ctx.fillStyle="#d5efbf77";ctx.fillText("SOUTH STEMSIDE",25,520);
 for(const [i,p] of PATROL_STOPS.entries()){
  const active=checkpoint(state)?.id===p.id;
  const color=active?"#fcdd7a":"#98cfc4";
  if(active){
   ctx.beginPath();ctx.arc(p.x,p.y,PATROL_WORLD.arrivalRadius,0,Math.PI*2);
   ctx.fillStyle="#fae38438";ctx.fill();
   ctx.strokeStyle="#fae384";ctx.lineWidth=4;ctx.stroke();
  }
  ctx.fillStyle="#102734dc";ctx.fillRect(p.x-86,p.y-61,172,120);
  ctx.strokeStyle=color;ctx.lineWidth=5;ctx.strokeRect(p.x-86,p.y-61,172,120);
  ctx.font="900 39px Trebuchet MS,Arial";ctx.textAlign="center";ctx.fillStyle=color;ctx.fillText(p.icon,p.x,p.y+7);
  ctx.font="900 15px Trebuchet MS,Arial";ctx.fillText(p.name,p.x,p.y+40,159);
  ctx.font="900 13px Trebuchet MS,Arial";ctx.fillText(active?"● DISPATCH":i===0?"HQ":"• DISTRICT",p.x,p.y-35);
 }
 const goal=checkpoint(state);
 if(goal){
  ctx.strokeStyle="#f9e6a780";ctx.lineWidth=7;ctx.setLineDash([12,13]);
  ctx.beginPath();ctx.moveTo(state.car.x,state.car.y);ctx.lineTo(goal.x,goal.y);ctx.stroke();ctx.setLineDash([]);
 }
 // Original car drawn from geometric primitives; no external art or copyrighted assets.
 ctx.save();ctx.translate(state.car.x,state.car.y);ctx.rotate(facing);
 ctx.fillStyle="#07162688";ctx.fillRect(-24,-36,54,79);
 ctx.fillStyle="#141c2a";ctx.fillRect(-27,-29,8,20);ctx.fillRect(19,-29,8,20);ctx.fillRect(-27,12,8,20);ctx.fillRect(19,12,8,20);
 ctx.fillStyle="#e6ded0";ctx.fillRect(-21,-35,42,70);
 ctx.fillStyle="#273e50";ctx.fillRect(-16,-22,32,21);ctx.fillRect(-16,16,32,14);
 ctx.fillStyle="#e84d58";ctx.fillRect(-19,-2,19,8);ctx.fillStyle="#5ebcef";ctx.fillRect(0,-2,19,8);
 ctx.fillStyle="#f6da98";ctx.font="1000 13px Trebuchet MS,Arial";ctx.textAlign="center";ctx.fillText("TVPD",0,12);
 ctx.restore();
 ctx.textAlign="left";ctx.font="900 14px Trebuchet MS,Arial";ctx.fillStyle="#e6ecd3";
 ctx.fillText("ALL STREETS SUBJECT TO REASONABLE SILLINESS",19,779);
}
function axes(){
 let x=0,y=0;
 const held=new Set([...keys,...touch]);
 for(const k of held){if(k==="ArrowLeft"||k==="a"||k==="A"||k==="left")x--;if(k==="ArrowRight"||k==="d"||k==="D"||k==="right")x++;if(k==="ArrowUp"||k==="w"||k==="W"||k==="up")y--;if(k==="ArrowDown"||k==="s"||k==="S"||k==="down")y++}
 const pads=navigator.getGamepads?.();
 const p=pads&&Array.from(pads).find(x=>x&&x.connected);
 if(p){
  const px=Math.abs(p.axes[0]||0)>0.18?p.axes[0]:0;
  const py=Math.abs(p.axes[1]||0)>0.18?p.axes[1]:0;
  x+=px;y+=py;
  const pressed=Boolean(p.buttons[0]?.pressed);
  if(pressed&&!padHeld)interact();
  padHeld=pressed;
 }else padHeld=false;
 return {x,y};
}
function loop(now){
 const dt=last?Math.min((now-last)/1000,0.06):0;last=now;
 const {x,y}=axes();
 if(x||y){
  const next=moveCar(state,x,y,dt);
  state=next;
  if(Math.hypot(x,y)>0.2)facing=Math.atan2(y,x)+Math.PI/2;
  openRadio=openRadio&&atDispatch(state);
  el("patrol-interact").disabled=!atDispatch(state)||shiftComplete(state);
  if(atDispatch(state)&&el("patrol-interact").textContent!=="RESPOND AT LOCATION · E"&&!openRadio)el("patrol-interact").textContent="RESPOND AT LOCATION · E";
  if(!atDispatch(state))el("patrol-arrival").textContent="DRIVE TO "+(checkpoint(state)?.name||"TVPD HQ")+" TO RESPOND";
  else if(!shiftComplete(state))el("patrol-arrival").textContent="ON SCENE · OPEN RADIO TO DECIDE HOW TO RESPOND";
  if(now-lastSave>2500&&distance(state.car,lastCar)>40){save();lastSave=now}
 }
 draw();requestAnimationFrame(loop);
}
function bindControls(){
 for(const b of document.querySelectorAll("[data-drive]")){
  const dir=b.dataset.drive;
  b.addEventListener("pointerdown",ev=>{ev.preventDefault();touch.add(dir);b.setPointerCapture?.(ev.pointerId)});
  for(const event of ["pointerup","pointercancel","lostpointercapture"])b.addEventListener(event,()=>touch.delete(dir));
 }
 document.addEventListener("keydown",event=>{
  if(["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName))return;
  if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","w","a","s","d","W","A","S","D"].includes(event.key)){
   event.preventDefault();keys.add(event.key);
  }
  if(event.key==="e"||event.key==="E"){if(!event.repeat){event.preventDefault();interact()}}
 });
 document.addEventListener("keyup",ev=>keys.delete(ev.key));
 window.addEventListener("blur",()=>{keys.clear();touch.clear();last=0;save()});
 document.addEventListener("visibilitychange",()=>{if(document.hidden){keys.clear();touch.clear();last=0;save()}});
 window.addEventListener("pagehide",()=>save());
 el("patrol-interact").addEventListener("click",interact);
 el("patrol-fast-travel").addEventListener("click",fastTravel);
 el("patrol-reset").addEventListener("click",()=>{
  if(!window.confirm("Reset only your TweedlePD patrol shift? The donut detective case and Stemside RPG will not be changed."))return;
  state=initialPatrol();openRadio=false;facing=0;line("DISPATCH: NEW SHIFT. PLEASE TRY NOT TO DETAIN ANY INANIMATE OBJECTS.");
  render();save("NEW PATROL SHIFT SAVED LOCALLY");canvas.focus();
 });
}
if(canUnlock()){
 el("patrol-game").hidden=false;el("patrol-locked").hidden=true;
 restore();line(notice);bindControls();render();requestAnimationFrame(loop);
}else{
 el("patrol-game").hidden=true;el("patrol-locked").hidden=false;
}
