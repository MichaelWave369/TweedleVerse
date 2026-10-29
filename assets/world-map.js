import {PASSPORT_SOURCES,readPassport} from "./passport-core.mjs";
import {MAP_KEY,MAP_SIZE,PLACES,STREETS,TOUR_TASKS,initialWorld,decodeWorld,encodeWorld,placeOf,neighborsOf,shortestRoute,walkWorld,directionNeighbor,postcards,tourTasks,tourComplete,nodeHint} from "./world-map-core.mjs";
import {EVENTS_KEY,EVENTS,initialEvents,decodeEvents,encodeEvents,beginEvent,answerEvent,activeEncounter,pendingLocation,eventBoard} from "./world-events-core.mjs";
const el=id=>document.getElementById(id),canvas=el("world-canvas"),ctx=canvas.getContext("2d");
let state=initialWorld(),events=initialEvents(),selected="plaza",passport=readPassport({}),walking=false,stopRequested=false,interpolation=null;
const palette={road:"#244455",edge:"#0f2c3c",land:"#4c7864",north:"#3d655c",south:"#507f5e",corporate:"#556879",sand:"#ab8b70",light:"#e7e8c2",amber:"#f3d594",mint:"#ccefa9"};
function make(tag,text,cls){const x=document.createElement(tag);if(text!==undefined)x.textContent=text;if(cls)x.className=cls;return x}
function say(text){el("world-story").textContent=text}
function readSaves(){
 const raw={};
 try{for(const source of PASSPORT_SOURCES)raw[source.id]=localStorage.getItem(source.key)}catch{for(const source of PASSPORT_SOURCES)raw[source.id]=null}
 passport=readPassport(raw);
}
function restore(){
 try{const raw=localStorage.getItem(MAP_KEY);if(raw){const decoded=decodeWorld(JSON.parse(raw));if(decoded)state=decoded}}catch{/* Play with a clean map if browser storage is absent or corrupt. */}
 selected=state.current;
}
function restoreEvents(){
 try{const raw=localStorage.getItem(EVENTS_KEY);if(!raw)return;const decoded=decodeEvents(JSON.parse(raw));if(decoded)events=decoded}
 catch{/* A bad optional story save never blocks city navigation. */}
}
function saveEvents(){
 try{
  localStorage.setItem(EVENTS_KEY,encodeEvents(events));
  el("world-events-storage").textContent="STREET CASES SAVED LOCALLY · INDEPENDENT FROM WORLD MAP AND ALL OTHER GAMES";
 }catch{el("world-events-storage").textContent="STREET-CASE STORAGE UNAVAILABLE. THIS SESSION CAN CONTINUE UNTIL CLOSED."}
}
function feedbackEvent(message){el("world-event-feedback").textContent=message}
function save(){
 try{
  localStorage.setItem(MAP_KEY,encodeWorld(state));
  el("world-save").textContent="MAP SAVED IN THIS BROWSER · "+state.visited.length+" PLACES · "+state.steps+" STREETS WALKED";
 }catch{el("world-save").textContent="BROWSER STORAGE DISABLED. WALKING WORKS UNTIL THIS TAB CLOSES."}
}
function selectedRoute(){return shortestRoute(state.current,selected)}
function setSelected(id){
 if(!placeOf(id))return;
 selected=id;render();
}
function visit(id){
 const result=walkWorld(state,id);
 if(!result.arrived){say(result.feedback);return}
 state=result.state;
 if(result.newPlace&&placeOf(id)?.postcard){
  say("YOU FOUND: "+placeOf(id).postcard+"! "+result.feedback);
 }else say(result.feedback);
 save();render();
}
function renderPlaces(){
 const root=el("world-places");root.replaceChildren();
 for(const place of PLACES){
  const b=make("button");b.type="button";b.setAttribute("aria-pressed",String(selected===place.id));
  b.append(make("span",place.icon+" "+place.name),make("small",(state.current===place.id?"YOU ARE HERE":state.visited.includes(place.id)?"EXPLORED":"UNDISCOVERED")+" · "+place.district));
  b.addEventListener("click",()=>setSelected(place.id));root.append(b);
 }
}
function renderPostcards(){
 const found=postcards(state),root=el("world-postcards");root.replaceChildren();
 el("world-postcard-count").textContent=found.length+" / "+(PLACES.length-1)+" POSTCARDS COLLECTED";
 if(!found.length)root.append(make("li","Visit other places to start your postcard collection."));
 for(const p of found){
  const li=make("li");li.append(make("strong","✳ "+p.postcard),make("span",p.name));root.append(li);
 }
 el("world-victory").hidden=!tourComplete(state);
}
function renderTours(){
 const root=el("world-tours");root.replaceChildren();
 for(const task of tourTasks(state)){
  const art=make("article",undefined,task.complete?"done":"");
  const done=task.places.filter(id=>state.visited.includes(id)).length;
  art.append(make("h3",(task.complete?"✓ ":"○ ")+task.title),
   make("p",task.description),
   make("small",done+" / "+task.places.length+" STOPS · "+(task.complete?task.reward:"ROUTE NOT YET COMPLETE")));
  root.append(art);
 }
}
function renderEvents(){
 const board=el("world-events-board");board.replaceChildren();
 el("world-events-progress").textContent=events.completed.length+" / "+EVENTS.length+
   " CASES CLOSED · "+events.wrong+" WRONG LEADS · "+(events.completed.length===EVENTS.length?"STEMSIDE CIVIC HERO":"FINALE AFTER TWO NEIGHBORHOOD CASES");
 for(const episode of eventBoard(events)){
  const box=make("article",undefined,"world-case"+(episode.complete?" complete":!episode.unlocked?" locked":""));
  box.append(make("strong",(episode.complete?"✓ ":"") + episode.title));
  box.append(make("p",episode.summary));
  box.append(make("small",episode.complete?"✓ AWARDED: "+episode.award:
    !episode.unlocked?"LOCKED · CLOSE THE FIRST TWO CASES":
    episode.active?"IN PROGRESS · RESUME YOUR INVESTIGATION":"READY · "+episode.steps+" WITNESS INTERVIEWS"));
  const button=make("button",episode.active?"CURRENT INVESTIGATION":episode.complete?"CASE CLOSED":"OPEN INCIDENT FILE","btn secondary-btn");
  button.type="button";button.disabled=walking||episode.complete||!episode.unlocked||Boolean(events.active&&!episode.active);
  button.addEventListener("click",()=>{
   if(walking)return;
   const result=beginEvent(events,episode.id);
   events=result.state;feedbackEvent(result.feedback);
   if(result.started){
    const next=pendingLocation(events);if(next)selected=next;
    saveEvents();
   }
   render();
  });
  box.append(button);board.append(box);
 }
 const scene=activeEncounter(events),mission=EVENTS.find(e=>e.id===events.active?.id);
 const panel=el("world-active-encounter");panel.hidden=!scene;
 if(!scene||!mission)return;
 const here=state.current===scene.place;
 el("world-event-label").textContent=mission.label;
 el("world-event-title").textContent=mission.title;
 el("world-event-step").textContent="INTERVIEW "+(events.active.step+1)+" / "+mission.scenes.length;
 el("world-event-destination").textContent="REPORT TO: "+placeOf(scene.place).name+(here?" · YOU ARE HERE":" · TRAVEL REQUIRED");
 const routeButton=el("world-event-route");
 routeButton.disabled=walking||here;
 el("world-event-dialogue").hidden=!here;
 if(!here)return;
 el("world-event-speaker").textContent=scene.speaker;
 el("world-event-setup").textContent=scene.setup;
 el("world-event-question").textContent=scene.prompt;
 const root=el("world-event-options");root.replaceChildren();
 for(const choice of scene.options){
  const button=make("button",choice.label);
  button.type="button";button.disabled=walking;
  button.addEventListener("click",()=>{
   if(walking)return;
   const outcome=answerEvent(events,state,choice.id);
   events=outcome.state;feedbackEvent(outcome.feedback);
   if(outcome.correct){
    const next=pendingLocation(events);
    if(next)selected=next;
   }
   saveEvents();render();
  });
  root.append(button);
 }
}
function render(){
 const current=placeOf(state.current),target=placeOf(selected)||current,route=selectedRoute();
 el("world-loc-name").textContent=current.name;
 el("world-tour-counter").textContent=state.visited.length+" / "+PLACES.length+" PLACES · "+postcards(state).length+" / "+(PLACES.length-1)+" POSTCARDS";
 el("world-steps").textContent=state.steps+" STREETS WALKED";
 el("world-target-name").textContent=target.name;
 el("world-target-district").textContent=target.district+" · "+target.kind;
 el("world-target-desc").textContent=target.description;
 el("world-context").textContent=nodeHint(target.id,passport);
 el("world-route-summary").textContent=route.length===1?"ALREADY HERE · GAME ENTRANCE OPEN":
  route.length>1?"WALK "+(route.length-1)+" STREETS · "+route.map(x=>placeOf(x).name).join(" → "):"NO CONNECTED ROUTE FOUND";
 const enter=el("world-enter");enter.href=target.href;enter.textContent="ENTER "+target.kind+" ↗";
 enter.hidden=state.current!==selected;
 el("world-walk").disabled=walking||state.current===selected||!route.length;
 el("world-stop").disabled=!walking;
 renderPlaces();renderPostcards();renderTours();renderEvents();draw();
}
function backdrop(){
 if(!ctx)return;
 const {width:w,height:h}=MAP_SIZE;
 ctx.clearRect(0,0,w,h);ctx.fillStyle="#20454e";ctx.fillRect(0,0,w,h);
 ctx.fillStyle=palette.north;ctx.fillRect(0,0,w,380);
 ctx.fillStyle=palette.south;ctx.fillRect(0,380,w,h-380);
 ctx.fillStyle="#294c56";ctx.fillRect(535,235,450,525);
 ctx.fillStyle="#6f855c";ctx.fillRect(735,25,450,310);
 // A comic municipal grid, not a representation of any real-world place.
 for(let x=36;x<w;x+=120)for(let y=30;y<h;y+=118){
  if((x>725&&y<335)||(x>775&&y>395)){
   ctx.fillStyle=(Math.floor((x+y)/15)%3===0)?"#8baf77":"#779970";
   ctx.fillRect(x,y,60,45);
  }else{
   ctx.fillStyle=(Math.floor((x+y)/20)%3===0)?"#365962":"#31535e";
   ctx.fillRect(x,y,45,62);
  }
 }
 ctx.fillStyle="#b4e9cd33";ctx.beginPath();ctx.ellipse(920,100,270,140,-.2,0,Math.PI*2);ctx.fill();
 ctx.font="900 37px Trebuchet MS,Arial";ctx.fillStyle="#d9ebc17a";
 ctx.fillText("NORTH STEMSIDE",35,55);
 ctx.fillText("SOUTH STEMSIDE",35,747);
 ctx.save();ctx.translate(835,390);ctx.rotate(-.23);ctx.font="900 25px Trebuchet MS,Arial";
 ctx.fillStyle="#e4dcc07e";ctx.fillText("THE FAIRWAYS",0,0);ctx.restore();
 // Road casing and route lanes.
 for(const [a,b] of STREETS){
  const x=placeOf(a),y=placeOf(b);
  ctx.strokeStyle=palette.edge;ctx.lineWidth=35;
  ctx.beginPath();ctx.moveTo(x.x,x.y);ctx.lineTo(y.x,y.y);ctx.stroke();
  ctx.strokeStyle=palette.road;ctx.lineWidth=27;ctx.stroke();
  ctx.strokeStyle="#d8d2ad87";ctx.lineWidth=2;ctx.setLineDash([10,19]);
  ctx.beginPath();ctx.moveTo(x.x,x.y);ctx.lineTo(y.x,y.y);ctx.stroke();ctx.setLineDash([]);
 }
 const route=selectedRoute();
 if(route.length>1){
  ctx.strokeStyle="#ffde7e";ctx.lineWidth=10;ctx.setLineDash([16,12]);
  ctx.beginPath();
  for(const [i,id] of route.entries()){const p=placeOf(id);if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y)}
  ctx.stroke();ctx.setLineDash([]);
 }
}
function draw(){
 if(!ctx)return;
 backdrop();
 const current=placeOf(state.current),player=interpolation||{x:current.x,y:current.y};
 for(const place of PLACES){
  const isSelected=selected===place.id,isKnown=state.visited.includes(place.id);
  ctx.fillStyle="#122934a8";ctx.beginPath();ctx.arc(place.x+5,place.y+6,34,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=isSelected?"#f5de94":isKnown?"#c6eba0":"#9cc7be";
  ctx.beginPath();ctx.arc(place.x,place.y,32,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=isSelected?"#fff9c8":"#1b3942";ctx.lineWidth=isSelected?6:4;ctx.stroke();
  ctx.fillStyle="#1b3741";ctx.textAlign="center";ctx.font="900 28px Trebuchet MS,Arial";ctx.fillText(place.icon,place.x,place.y+9);
  ctx.fillStyle="#0c2430df";ctx.fillRect(place.x-68,place.y+39,136,25);
  ctx.fillStyle=isSelected?"#f2db92":"#e3f5d0";ctx.font="900 12px Trebuchet MS,Arial";
  ctx.fillText(place.name,place.x,place.y+56,130);
 }
 const targetId=pendingLocation(events);
 if(targetId){
  const target=placeOf(targetId);
  ctx.strokeStyle="#ffe17b";ctx.lineWidth=5;ctx.setLineDash([7,8]);
  ctx.beginPath();ctx.arc(target.x,target.y,41,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle="#152c38";ctx.fillRect(target.x-55,target.y-73,110,22);
  ctx.fillStyle="#ffe17b";ctx.font="900 11px Trebuchet MS,Arial";ctx.textAlign="center";
  ctx.fillText("CASE WITNESS",target.x,target.y-57);
 }
 ctx.textAlign="center";
 ctx.fillStyle="#111f29";ctx.beginPath();ctx.ellipse(player.x+5,player.y+11,19,11,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle="#ffefa6";ctx.beginPath();ctx.arc(player.x,player.y-4,18,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle="#e9736d";ctx.lineWidth=5;ctx.stroke();
 ctx.fillStyle="#183840";ctx.font="900 15px Trebuchet MS,Arial";ctx.fillText("YOU",player.x,player.y+2);
 ctx.textAlign="left";
 ctx.fillStyle="#162e3ecc";ctx.fillRect(15,15,350,30);
 ctx.font="900 16px Trebuchet MS,Arial";ctx.fillStyle="#e7edba";ctx.fillText("STEMSIDE TRANSIT · ROUTE 369",26,35);
}
function walkRoute(){
 if(walking)return;
 const route=selectedRoute().slice(1);
 if(!route.length)return;
 walking=true;stopRequested=false;render();
 const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 function step(i){
  if(i>=route.length||stopRequested){
   walking=false;interpolation=null;stopRequested=false;render();return;
  }
  const from=placeOf(state.current),to=placeOf(route[i]),start=performance.now();
  const duration=reduced?0:360;
  function frame(now){
   const t=duration?Math.min(1,(now-start)/duration):1;
   const ease=t*t*(3-2*t);
   interpolation={x:from.x+(to.x-from.x)*ease,y:from.y+(to.y-from.y)*ease};
   draw();
   if(t<1){requestAnimationFrame(frame);return}
   interpolation=null;visit(to.id);step(i+1);
  }
  requestAnimationFrame(frame);
 }
 step(0);
}
function walkDirection(direction){
 if(walking)return;
 const next=directionNeighbor(state.current,direction);
 if(!next){say("TVPD TRAFFIC REPORT: NO DIRECT ROAD THAT WAY. EVEN THE SIDEWALKS HAVE BOUNDARIES.");return}
 visit(next);
}
canvas.addEventListener("click",event=>{
 if(walking)return;
 const rect=canvas.getBoundingClientRect();
 const x=(event.clientX-rect.left)/rect.width*MAP_SIZE.width,y=(event.clientY-rect.top)/rect.height*MAP_SIZE.height;
 const nearest=PLACES.map(p=>({id:p.id,d:Math.hypot(p.x-x,p.y-y)})).sort((a,b)=>a.d-b.d)[0];
 if(nearest&&nearest.d<45)setSelected(nearest.id);
});
for(const button of document.querySelectorAll("[data-direction]")){
 button.addEventListener("click",()=>walkDirection(button.dataset.direction));
}
document.addEventListener("keydown",event=>{
 if(event.repeat||walking||!["BODY","CANVAS"].includes(document.activeElement?.tagName))return;
 const direction=({"ArrowUp":"up","ArrowDown":"down","ArrowLeft":"left","ArrowRight":"right","w":"up","s":"down","a":"left","d":"right","W":"up","S":"down","A":"left","D":"right"})[event.key];
 if(direction){event.preventDefault();walkDirection(direction)}
});
el("world-event-route").addEventListener("click",()=>{
 if(walking)return;
 const id=pendingLocation(events);
 if(!id)return;
 selected=id;render();
 feedbackEvent(state.current===id?"WITNESS IS HERE. CHOOSE A RESPONSE BELOW.":"ROUTE SELECTED. WALK TO "+placeOf(id).name+" AND INTERVIEW YOUR WITNESS.");
});
el("world-events-reset").addEventListener("click",()=>{
 if(walking){feedbackEvent("STOP THE WALK BEFORE RESETTING A STREET INVESTIGATION.");return}
 if(!window.confirm("Reset ONLY the World Map street encounters? Map postcards, tours, Passport and other game saves will not change."))return;
 events=initialEvents();feedbackEvent("STREET CASES REOPENED. THE CITY TOUR AND ALL OTHER GAMES ARE UNTOUCHED.");
 render();saveEvents();
});
el("world-walk").addEventListener("click",walkRoute);
el("world-stop").addEventListener("click",()=>{stopRequested=true;say("WALK PAUSED AFTER THE CURRENT STREET. YOUR FOOTPRINTS ARE SAVED.")});
el("world-reset").addEventListener("click",()=>{
 if(walking){say("FINISH OR STOP THE CURRENT WALK BEFORE RESTARTING THE TOUR.");return}
 if(!window.confirm("Restart ONLY the Stemside World Map tour and postcards? All seven original game saves, Passport and Crossroads will remain unchanged."))return;
 state=initialWorld();selected="plaza";say("TOUR RESET. WELCOME BACK TO STEMSIDE PLAZA. REBOOTING THE UNPAID SIDEWALK.");render();save();
});
window.addEventListener("pagehide",save);
window.addEventListener("pageshow",event=>{if(event.persisted){readSaves();render()}});
document.addEventListener("visibilitychange",()=>{if(!document.hidden){readSaves();render()}});
restore();restoreEvents();readSaves();render();save();
