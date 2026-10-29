import {TUNNEL_KEY,CAVE,ROOMS,BUDS,VAULT_REQUIRED,initialTunnel,decodeTunnel,encodeTunnel,roomOf,platformLayout,exitsOf,passageNear,traverse,moveTunnel,collectBud,finishVault,progressMessage} from "./tweedsie-core.mjs";
const el=id=>document.getElementById(id),canvas=el("tunnel-canvas"),ctx=canvas.getContext("2d");
const state={save:initialTunnel(),keys:new Set(),touch:new Set(),jumpPending:false,last:0,lastSave:0,prevX:0,ready:false,padJump:false,padEnter:false};
const avatar=new Image();avatar.src="assets/tweedsie.svg";
function say(text){el("tunnel-story").textContent=text}
function save(msg){try{localStorage.setItem(TUNNEL_KEY,encodeTunnel(state.save));el("tunnel-save").textContent=msg||"UNDERGROUND PROGRESS SAVED LOCALLY";state.prevX=state.save.x}catch{el("tunnel-save").textContent="BROWSER STORAGE UNAVAILABLE; THIS SESSION STILL WORKS."}}
function restore(){try{const raw=localStorage.getItem(TUNNEL_KEY);if(!raw)return;const decoded=decodeTunnel(JSON.parse(raw));if(decoded)state.save=decoded;else say("OLD OR INVALID BURROW MAP IGNORED. NEW HOLE, WHO DIS?")}catch{say("LOCAL SAVE UNREADABLE. NEW HOLE, SAME DAY.")}}
function drawCave(){
 const p=state.save,room=roomOf(p.room),width=canvas.width,height=canvas.height,scaleY=height/CAVE.height;
 const cameraX=Math.max(0,Math.min(CAVE.width-width,p.x-width*.5));
 ctx.setTransform(1,0,0,scaleY,0,0);ctx.clearRect(0,0,width,CAVE.height);
 const g=ctx.createLinearGradient(0,0,0,CAVE.height);g.addColorStop(0,room.color);g.addColorStop(1,"#111d20");
 ctx.fillStyle=g;ctx.fillRect(0,0,width,CAVE.height);
 ctx.save();ctx.translate(-cameraX,0);
 for(let layer=0;layer<3;layer++){ctx.fillStyle=["#101a2870","#d4b86c15","#e0c99412"][layer];
  for(let i=0;i<20;i++){const x=(i*163+layer*88)%CAVE.width,y=120+((i*113+layer*61)%360);
   ctx.beginPath();ctx.arc(x,y,9+layer*17,0,Math.PI*2);ctx.fill()}}
 ctx.fillStyle="#3e342d";ctx.fillRect(0,CAVE.ground,CAVE.width,CAVE.height-CAVE.ground);
 ctx.fillStyle="#7f6142";ctx.fillRect(0,CAVE.ground,CAVE.width,14);
 for(const ledge of platformLayout(p.room).slice(1)){
  ctx.fillStyle="#362d35";ctx.fillRect(ledge.x+4,ledge.y+8,ledge.width,ledge.height+6);
  ctx.fillStyle="#92775d";ctx.fillRect(ledge.x,ledge.y,ledge.width,ledge.height);
  ctx.fillStyle="#b6a276";ctx.fillRect(ledge.x,ledge.y,ledge.width,5);
 }
 ctx.font="900 18px Trebuchet MS,Arial";ctx.textAlign="center";
 for(const exit of exitsOf(p.room)){
  const near=Math.abs(exit.x-p.x)<88&&p.onGround;
  ctx.fillStyle=near?"#c5f98b33":"#a7e4d012";ctx.fillRect(exit.x-39,CAVE.ground-100,78,100);
  ctx.strokeStyle=near?"#ddff9f":"#75b7b0";ctx.lineWidth=5;ctx.strokeRect(exit.x-39,CAVE.ground-100,78,100);
  ctx.fillStyle=near?"#f1ffa6":"#b5e6d4";
  ctx.fillText(exit.id==="branch"?"◆":exit.id==="left"?"◀":"▶",exit.x,CAVE.ground-42);
  ctx.font="900 12px Trebuchet MS,Arial";ctx.fillText(exit.label,exit.x,CAVE.ground-117);
  ctx.font="900 18px Trebuchet MS,Arial";
 }
 for(const bud of BUDS.filter(b=>b.room===p.room&&!p.found.includes(b.id))){
  ctx.fillStyle="#abed74";ctx.shadowColor="#c7ff79";ctx.shadowBlur=20;
  ctx.beginPath();ctx.arc(bud.x,bud.y+12,19,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  ctx.fillStyle="#163b28";ctx.font="1000 22px Trebuchet MS,Arial";ctx.fillText("✳",bud.x,bud.y+20);
  ctx.fillStyle="#f6eda9";ctx.font="900 11px Trebuchet MS,Arial";ctx.fillText("LOUD BUD",bud.x,bud.y-20);
 }
 if(p.room==="vault"){
  ctx.fillStyle=p.found.length>=VAULT_REQUIRED?"#d1ee97":"#ba9b89";
  ctx.fillRect(1004,CAVE.ground-135,125,135);ctx.fillStyle="#263c48";ctx.fillRect(1021,CAVE.ground-120,92,113);
  ctx.fillStyle="#f5e8b4";ctx.font="900 15px Trebuchet MS,Arial";ctx.fillText("THE VAULT",1066,CAVE.ground-80);
  ctx.fillText(p.found.length>=VAULT_REQUIRED?"READY · E":"LOCKED",1066,CAVE.ground-50);
 }
 if(avatar.complete&&avatar.naturalWidth>0)ctx.drawImage(avatar,p.x-30,p.y-18,60,69);
 else{ctx.fillStyle="#d7a789";ctx.beginPath();ctx.arc(p.x,p.y+19,27,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#192b32";ctx.fillRect(p.x-17,p.y+10,34,10)}
 ctx.restore();ctx.setTransform(1,0,0,1,0,0);
 ctx.fillStyle="#0e2029e8";ctx.fillRect(12,13,Math.min(width-24,580),65);
 ctx.fillStyle="#dcf4c3";ctx.font="900 23px Trebuchet MS,Arial";ctx.fillText(room.name,28,42);
 ctx.font="900 14px Trebuchet MS,Arial";ctx.fillStyle="#baf589";ctx.fillText("BUDS "+p.found.length+"/"+BUDS.length+" · CAVES "+p.visits.length+"/"+ROOMS.length,28,64);
}
function render(){
 const p=state.save,room=roomOf(p.room);el("tunnel-room").textContent=room.name;el("tunnel-count").textContent=progressMessage(p);
 el("tunnel-room-desc").textContent=room.desc;
 const passage=passageNear(p),isVault=p.room==="vault"&&p.x>965&&p.onGround&&p.found.length>=VAULT_REQUIRED;
 el("tunnel-enter").disabled=!(passage||isVault)||p.finished;
 el("tunnel-enter").textContent=isVault?"ENTER LOUD VAULT · E":passage?"ENTER "+roomOf(passage.target).name+" · E":"ENTER PASSAGE · E";
 el("tunnel-portal").textContent=isVault?"THE VAULT IS READY. PRESS E.":passage?"NEAR PASSAGE: "+passage.label+" → "+roomOf(passage.target).name:
 p.room==="vault"&&p.found.length<VAULT_REQUIRED?"VAULT REQUIRES "+VAULT_REQUIRED+" BUDS. YOU HAVE "+p.found.length+".":"MOVE TO GLOWING DOORS. JUMP ON PLATFORMS TO GET BUDS.";
 el("tunnel-progress").textContent=p.found.length+" / "+BUDS.length+" BUDS FOUND · NEED "+VAULT_REQUIRED+" TO OPEN THE VAULT";
 const root=el("tunnel-network");root.replaceChildren();
 for(const r of ROOMS){
  const span=document.createElement("span");span.className="tunnel-room-chip"+(r.id===p.room?" current":"")+(p.visits.includes(r.id)?" explored":"");
  span.textContent=p.visits.includes(r.id)?r.name:"UNKNOWN PASSAGE";span.title=p.visits.includes(r.id)?r.desc:"NOT DISCOVERED";root.append(span);
 }
 const list=el("tunnel-buds");list.replaceChildren();if(!p.found.length){const li=document.createElement("li");li.textContent="No buds recovered.";list.append(li)}
 for(const id of p.found){const b=BUDS.find(x=>x.id===id);if(!b)continue;const li=document.createElement("li");li.textContent="✳ "+b.name;list.append(li)}
 el("tunnel-win").hidden=!p.finished;
}
function enter(){
 const p=state.save;
 if(p.room==="vault"&&p.x>965&&p.onGround){
  const finished=finishVault(p);
  if(finished!==p){state.save=finished;say("TWEEDSIE: SAME HOLE. DIFFERENT DIMENSION. NO REFUNDS, REG!");render();save("LOUD VAULT COMPLETED · UNDERGROUND LEGEND BADGE SAVED");return}
 }
 const exit=passageNear(p);if(!exit)return;
 state.save=traverse(p,exit.id);say("TWEEDSIE: "+roomOf(state.save.room).desc);render();save("NEW CAVERN FOUND · SAVED LOCALLY");
}
function axis(){
 let x=0;for(const key of [...state.keys,...state.touch]){if(["ArrowLeft","a","A","left"].includes(key))x--;if(["ArrowRight","d","D","right"].includes(key))x++}
 const pads=navigator.getGamepads?.();const pad=pads&&Array.from(pads).find(p=>p&&p.connected);
 if(pad){
  const a=pad.axes[0]||0;if(Math.abs(a)>.18)x+=a;
  if(pad.buttons[0]?.pressed&&!state.padJump)state.jumpPending=true;
  state.padJump=!!pad.buttons[0]?.pressed;
  if(pad.buttons[1]?.pressed&&!state.padEnter)enter();
  state.padEnter=!!pad.buttons[1]?.pressed;
 }
 return Math.max(-1,Math.min(1,x));
}
function loop(now){
 const dt=state.last?Math.min(.04,(now-state.last)/1000):0;state.last=now;
 const a=axis();const old=state.save;state.save=moveTunnel(old,a,state.jumpPending,dt);state.jumpPending=false;
 const got=collectBud(state.save);state.save=got.state;
 if(got.found){say("TWEEDSIE: "+got.found.name.toUpperCase()+"! ONE MORE FOR THE LOUD VAULT.");save("NEW BUD SAVED · "+got.found.name)}
 else if(Math.abs(state.save.x-state.prevX)>115&&now-state.lastSave>2400){save();state.lastSave=now}
 if(a||got.found||old.room!==state.save.room||now-state.lastSave>400){render();if(!a)state.lastSave=now}
 drawCave();requestAnimationFrame(loop);
}
function jump(){state.jumpPending=true}
document.addEventListener("keydown",ev=>{
 if(["ArrowLeft","ArrowRight","ArrowUp"," ","a","A","d","D","w","W","e","E"].includes(ev.key)){ev.preventDefault()}
 if([" ","ArrowUp","w","W"].includes(ev.key)&&!ev.repeat)jump();
 if(["e","E"].includes(ev.key)&&!ev.repeat)enter();
 state.keys.add(ev.key);
});
document.addEventListener("keyup",ev=>state.keys.delete(ev.key));
for(const button of document.querySelectorAll("[data-control]")){
 const d=button.dataset.control;
 if(d==="jump"){button.addEventListener("click",jump);continue}
 button.addEventListener("pointerdown",ev=>{ev.preventDefault();state.touch.add(d);button.setPointerCapture?.(ev.pointerId)});
 for(const event of ["pointerup","pointercancel","lostpointercapture"])button.addEventListener(event,()=>state.touch.delete(d));
}
el("tunnel-enter").addEventListener("click",enter);
el("tunnel-reset").addEventListener("click",()=>{
 if(!window.confirm("Reset only Adventures of Tweedsie? Your golf, Stemside and TweedlePD saves are unaffected."))return;
 state.save=initialTunnel();say("NEW HOLE. SAME DAY. THE NORTHSIDE FARMERS ARE GETTING NERVOUS.");render();save("TUNNEL ADVENTURE RESET");
});
window.addEventListener("blur",()=>{state.keys.clear();state.touch.clear();state.last=0;save()});
document.addEventListener("visibilitychange",()=>{if(document.hidden){state.keys.clear();state.touch.clear();state.last=0;save()}});
window.addEventListener("pagehide",()=>save());
restore();say("TWEEDSIE: "+roomOf(state.save.room).desc);render();requestAnimationFrame(loop);
