import {WORLD,OBJECTIVES,move,nearby,advanceQuest,scoreShot,arenaResult,clamp,normalizedPlaces} from "./game-core.mjs";

const el=id=>document.getElementById(id);
const canvas=el("world"),ctx=canvas.getContext("2d");
const state={
 places:[],player:{x:215,y:690},keys:new Set(),touch:new Set(),
 clock:0,last:0,w:960,h:600,dpr:1,nearId:null,visits:0,
 quest:0,medal:false,overlay:null,returnFocus:null,
 arena:{shots:0,score:0,charge:0,charging:false,active:false},
 gamepadActionHeld:false,gamepadAxes:{x:0,y:0},targetOffset:0
};
const questLines=[
 "Your shift is starting. Get a coffee at CoffeeChucks. It cannot possibly become a sports career.",
 "CoffeeChucks will honor your free-coffee coupon only with a stamp from Stems League Arena. The fine print is evolving.",
 "The Stems League has automatically registered you for the corporate tour. Report to TweedCorp HQ. Maybe your coffee survived.",
 "Mission complete. You are now an involuntary Tweedleball prospect. You still have no free coffee."
];
const dialogues={
 "coffeechucks":"CHUCK: It's coffee, Chuck. Drink it. Your free coupon? You'll need a Tweedleball league stamp. Don't ask me why.",
 "stems-league":"CHUCKSTER: Congratulations! You're registered for the Southside Stems League. We thought you were here to play.",
 "tweedcorp":"BUFFER BOB: Your coffee request has been processed as a corporate athletic obligation. HR considers this efficient.",
 "spacealite":"REGGIE BANDS: Your subscription does not include the privilege of standing in front of my building. Billing starts yesterday.",
 "reggies-reggie":"SHOPKEEPER: Reggie's Reggie! Cheap in a Pinch! Stems sold separately. Wait, no. Stems included. Mostly stems.",
 "coffeecharles":"BARISTA: Coffee? We only serve a Grand Charles. It's the same drink in a more expensive cup.",
 "lackluster":"CLERK: We have the episode you're in right now on VHS. No, you can't rent it. It's already overdue.",
 "whole-moods":"CONCIERGE: Your produce has a wellness counselor. That'll be a 30-credit emotional handling fee.",
 "royal-club":"ATTENDANT: Sir, are you a member? Being in the Southside league does not qualify as a birth certificate.",
 "biestro":"WAITER: Today's tasting menu is one leaf and a 45-minute explanation of why you should be grateful.",
 "north-invitational":"SECURITY: The Invitational is for Northside members. Unless your name is in the qualification clause Reggie signed.",
 "taco-bell":"CASHIER: Would you like a taco with your burger or a burger with your taco? The answer is yes.",
 "snublishers":"PRIZE PATROL: Congratulations! You've won a free obligation! Please sign this enormous novelty check."
};
function say(place,text){
 el("place-heading").textContent=place?place.name.toUpperCase():"CITY HALL ERROR";
 el("place-message").textContent=text;
}
function questUI(){
 el("progress").textContent="THE COFFEE RUN · "+state.quest+"/3";
 el("quest-text").textContent=questLines[state.quest];
 el("quest-status").textContent=state.quest===3?"COMPLETED · COFFEE STILL PENDING":"MISSION ACTIVE";
 for(const [i,li] of Array.from(el("quest-list").children).entries()){
  li.classList.toggle("done",state.quest>i);
 }
}
function resize(){
 const rect=canvas.getBoundingClientRect();
 state.w=Math.max(320,rect.width||960);
 state.h=Math.max(250,rect.height||600);
 state.dpr=Math.min(window.devicePixelRatio||1,2);
 canvas.width=Math.round(state.w*state.dpr);
 canvas.height=Math.round(state.h*state.dpr);
}
window.addEventListener("resize",resize);
if(typeof ResizeObserver!=="undefined")new ResizeObserver(resize).observe(canvas);
function neighborhoodColor(north){return north?"#3c4961":"#31584b"}
function draw(){
 if(!ctx)return;
 ctx.setTransform(state.dpr,0,0,state.dpr,0,0);
 ctx.clearRect(0,0,state.w,state.h);
 const cameraX=clamp(state.player.x-state.w/2,0,Math.max(0,WORLD.width-state.w));
 const cameraY=clamp(state.player.y-state.h/2,0,Math.max(0,WORLD.height-state.h));
 ctx.save();ctx.translate(-cameraX,-cameraY);
 ctx.fillStyle="#3b4660";ctx.fillRect(0,0,WORLD.width,560);
 ctx.fillStyle="#315646";ctx.fillRect(0,560,WORLD.width,560);
 // A simple hand-authored street network. Signposts are interactions, not invisible teleporters.
 ctx.strokeStyle="#ffffff10";ctx.lineWidth=1;
 for(let x=0;x<=WORLD.width;x+=64){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,WORLD.height);ctx.stroke()}
 for(let y=0;y<=WORLD.height;y+=64){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(WORLD.width,y);ctx.stroke()}
 ctx.fillStyle="#243845";ctx.fillRect(0,516,WORLD.width,90);
 ctx.fillRect(305,0,80,WORLD.height);ctx.fillRect(1140,0,80,WORLD.height);
 ctx.strokeStyle="#dac88a";ctx.lineWidth=3;ctx.setLineDash([30,23]);
 ctx.beginPath();ctx.moveTo(0,561);ctx.lineTo(WORLD.width,561);ctx.moveTo(345,0);ctx.lineTo(345,WORLD.height);ctx.moveTo(1180,0);ctx.lineTo(1180,WORLD.height);ctx.stroke();ctx.setLineDash([]);
 ctx.font="900 29px Trebuchet MS, Arial";ctx.textAlign="left";
 ctx.fillStyle="#e7c7b888";ctx.fillText("NORTH STEMSIDE",35,67);
 ctx.fillStyle="#bbecb788";ctx.fillText("SOUTH STEMSIDE",35,676);
 ctx.font="900 13px Trebuchet MS, Arial";ctx.fillStyle="#aaccad";ctx.fillText("NORTHSIDE CROSSING // SURCHARGE APPLIES",700,548);
 for(const p of state.places){
  const x=p.x/100*WORLD.width,y=p.y/100*WORLD.height;
  const isNear=p.id===state.nearId;
  ctx.fillStyle="#0e1a23aa";ctx.fillRect(x-63,y-39,126,88);
  ctx.fillStyle=neighborhoodColor(p.district.startsWith("North"));ctx.fillRect(x-59,y-35,118,76);
  ctx.strokeStyle=isNear?"#c8ef73":p.district.startsWith("North")?"#f2c591":"#8fe3cb";
  ctx.lineWidth=isNear?5:3;ctx.strokeRect(x-59,y-35,118,76);
  ctx.fillStyle="#f5e9cf";ctx.font="bold 25px Trebuchet MS, Arial";ctx.textAlign="center";
  ctx.fillText(p.icon,x,y+3);
  ctx.font="900 11px Trebuchet MS, Arial";
  const title=p.mapLabel||p.name;
  ctx.fillText(title.length>17?title.slice(0,16)+"…":title,x,y+24,114);
  if(isNear){
    ctx.beginPath();ctx.arc(x,y,69,0,Math.PI*2);
    ctx.strokeStyle="#c8ef73";ctx.lineWidth=3;ctx.stroke();
    ctx.fillStyle="#c8ef73";ctx.fillText("E · INTERACT",x,y-54);
  }
 }
 // Player: original, simple silicon explorer avatar.
 const p=state.player;
 ctx.fillStyle="#061c2288";ctx.beginPath();ctx.ellipse(p.x,p.y+23,24,8,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle="#e1af77";ctx.strokeStyle="#0b2830";ctx.lineWidth=5;
 ctx.beginPath();ctx.arc(p.x,p.y,20,0,Math.PI*2);ctx.fill();ctx.stroke();
 ctx.fillStyle="#17222d";ctx.fillRect(p.x-15,p.y-7,30,12);
 ctx.fillStyle="#b4f47f";ctx.fillRect(p.x-10,p.y-4,9,5);ctx.fillRect(p.x+4,p.y-4,7,5);
 ctx.strokeStyle="#e9c56e";ctx.lineWidth=3;ctx.beginPath();ctx.arc(p.x,p.y+8,6,0,Math.PI);ctx.stroke();
 ctx.font="900 12px Trebuchet MS, Arial";ctx.textAlign="center";
 ctx.fillStyle="#f4e8c9";ctx.fillText("YOU",p.x,p.y-32);
 ctx.restore();
}
function nearest(){return nearby(state.places,state.player.x,state.player.y)}
function updateNearby(){
 const place=nearest(),id=place?.id||null;
 if(id===state.nearId)return;
 state.nearId=id;
 el("interact").disabled=!place;
 el("nearby").textContent=place?"NEAR "+place.name.toUpperCase()+" · PRESS E / INTERACT":"MOVE TOWARD A GLOWING STOREFRONT";
}
function openModal(name,focusId){
 state.overlay=name;state.returnFocus=document.activeElement;
 el(name+"-overlay").hidden=false;
 el(focusId).focus();
}
function closeModal(name){
 if(state.overlay!==name)return;
 el(name+"-overlay").hidden=true;state.overlay=null;
 state.arena.charging=false;
 const focus=state.returnFocus;state.returnFocus=null;
 (focus?.isConnected?focus:canvas).focus();
}
function interact(){
 if(state.overlay||!state.places.length)return;
 const place=nearest();if(!place)return;
 state.visits+=1;
 state.quest=advanceQuest(state.quest,place.id);
 questUI();
 say(place,dialogues[place.id]||place.description);
 if(place.id==="stems-league")openArena();
 else if(state.visits%5===0)openModal("tweedsie","tweedsie-close");
}
function reset(){
 state.player={x:215,y:690};
 state.quest=0;state.visits=0;state.medal=false;
 el("medal").textContent="NO TGA MEDAL";
 say(null,"Back to work. The coffee run restarts, because corporate refuses to acknowledge personal growth.");
 questUI();
 canvas.focus();updateNearby();
}
function aim(){
 const steady=el("easy-aim").checked;
 return steady?0:Math.sin(state.clock*1.7);
}
function syncArena(){
 const a=state.arena;
 el("power-fill").style.width=Math.round(a.charge*100)+"%";
 el("power-number").textContent=Math.round(a.charge*100)+"%";
 el("score").textContent="SCORE: "+a.score;
 el("shots").textContent="SHOTS: "+a.shots+" / 5";
 const done=a.shots>=5;
 el("fire").disabled=done;
 el("fire").textContent=done?"ROUND OVER":a.charging?"FIRE NOW!":"START CHARGING";
 el("target").style.left=(50+aim()*32)+"%";
}
function openArena(){
 state.arena={shots:0,score:0,charge:0,charging:false,active:true};
 el("arena-feedback").textContent="SPACE TO CHARGE AND RELEASE, OR TAP START/FIRE. THE TARGET IS MOVING!";
 syncArena();openModal("arena","fire");
}
function beginCharge(){
 if(state.overlay!=="arena"||state.arena.shots>=5||state.arena.charging)return;
 state.arena.charging=true;state.arena.charge=0;syncArena();
}
function fire(){
 const a=state.arena;
 if(state.overlay!=="arena"||!a.charging||a.shots>=5)return;
 a.charging=false;
 const points=scoreShot(aim(),a.charge,el("easy-aim").checked);
 a.score+=points;a.shots+=1;
 el("arena-feedback").textContent=points===3?"BULLSEYE! +3 POINTS!":points===1?"ON THE BOARD! +1 POINT!":"MISSED! REGGIE HAS CHARGED YOU FOR THE AIR.";
 a.charge=0;
 const result=arenaResult(a.score,a.shots);
 if(result!=="in_progress"){
   a.active=false;
   if(result==="medal"){
     state.medal=true;el("medal").textContent="SOUTHSIDE TGA MEDAL";
     el("arena-feedback").textContent="SOUTHSIDE MEDAL WON! THE NORTHSIDE STIMMERS HAVE FILED A COMPLAINT.";
     say(null,"The Southside Stems League has awarded you a practice medal. Reggie Bands demands a recount.");
   } else {
     el("arena-feedback").textContent="NO MEDAL YET. THE LEAGUE RECOMMENDS MORE PRACTICE, NOT MORE FEES.";
   }
 }
 syncArena();
}
function keysAxis(){
 const held=code=>state.keys.has(code);
 const x=Number(held("ArrowRight")||held("KeyD")||state.touch.has("right"))-Number(held("ArrowLeft")||held("KeyA")||state.touch.has("left"));
 const y=Number(held("ArrowDown")||held("KeyS")||state.touch.has("down"))-Number(held("ArrowUp")||held("KeyW")||state.touch.has("up"));
 return {x:clamp(x+state.gamepadAxes.x,-1,1),y:clamp(y+state.gamepadAxes.y,-1,1)};
}
function gamepad(){
 let pad=null;
 try{pad=Array.from(navigator.getGamepads?.()||[]).find(Boolean)||null}catch{return}
 if(!pad){state.gamepadAxes={x:0,y:0};state.gamepadActionHeld=false;return}
 const dx=pad.axes?.[0]||0,dy=pad.axes?.[1]||0;
 state.gamepadAxes={x:Math.abs(dx)<.2?0:dx,y:Math.abs(dy)<.2?0:dy};
 const a=!!pad.buttons?.[0]?.pressed;
 if(a&&!state.gamepadActionHeld&&!state.overlay)interact();
 state.gamepadActionHeld=a;
}
function loop(now){
 const dt=state.last?Math.min((now-state.last)/1000,.05):0;
 state.last=now;state.clock+=dt;
 gamepad();
 if(state.overlay==="arena"){
   if(state.arena.charging)state.arena.charge=Math.min(1,state.arena.charge+dt*.54);
   syncArena();
 }else if(!state.overlay&&state.places.length){
   state.player=move(state.player,keysAxis(),dt);
   updateNearby();
 }
 draw();
 requestAnimationFrame(loop);
}
document.addEventListener("keydown",ev=>{
 if(state.overlay){
   if(ev.code==="Escape"){ev.preventDefault();closeModal(state.overlay);return}
   if(ev.code==="Tab"){const modal=el(state.overlay+"-overlay");const nodes=Array.from(modal.querySelectorAll("button:not(:disabled),input:not(:disabled)"));if(nodes.length){const first=nodes[0],last=nodes[nodes.length-1];if(ev.shiftKey&&document.activeElement===first){ev.preventDefault();last.focus()}else if(!ev.shiftKey&&document.activeElement===last){ev.preventDefault();first.focus()}}return}
   if(state.overlay==="arena"&&ev.code==="Space"&&!ev.repeat&&ev.target?.tagName!=="INPUT"){ev.preventDefault();beginCharge()}
   return;
 }
 if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","KeyW","KeyA","KeyS","KeyD"].includes(ev.code)){ev.preventDefault();state.keys.add(ev.code)}
 if(["KeyE","Enter"].includes(ev.code)&&!ev.repeat&&ev.target?.tagName!=="BUTTON"&&ev.target?.tagName!=="A"){ev.preventDefault();interact()}
});
document.addEventListener("keyup",ev=>{
 state.keys.delete(ev.code);
 if(state.overlay==="arena"&&ev.code==="Space"&&state.arena.charging){ev.preventDefault();fire()}
});
for(const btn of document.querySelectorAll("[data-dir]")){
 const dir=btn.dataset.dir;
 btn.addEventListener("pointerdown",ev=>{ev.preventDefault();state.touch.add(dir);try{btn.setPointerCapture(ev.pointerId)}catch{}})
 for(const type of ["pointerup","pointercancel","lostpointercapture"])btn.addEventListener(type,()=>state.touch.delete(dir));
}
window.addEventListener("blur",()=>{state.keys.clear();state.touch.clear();if(state.arena.charging)state.arena.charging=false});
document.addEventListener("visibilitychange",()=>{if(document.hidden){state.last=0;state.keys.clear();state.touch.clear()}});
el("interact").addEventListener("click",interact);
el("reset").addEventListener("click",reset);
el("arena-close").addEventListener("click",()=>closeModal("arena"));
el("tweedsie-close").addEventListener("click",()=>closeModal("tweedsie"));
el("fire").addEventListener("click",()=>state.arena.charging?fire():beginCharge());
el("easy-aim").checked=matchMedia("(prefers-reduced-motion: reduce)").matches;
el("easy-aim").addEventListener("change",syncArena);
(async()=>{
 try{
  const res=await fetch("data/stemside-map.json");
  if(!res.ok)throw Error("City records unavailable");
  state.places=normalizedPlaces(await res.json());
  say(null,"City Hall approved your walking permit. Find CoffeeChucks to begin your perfectly ordinary errand.");
 }catch(e){say(null,"Couldn't load the city map. Serve this website via GitHub Pages or a local HTTP server. "+e.message)}
 questUI();resize();requestAnimationFrame(loop);
})();
