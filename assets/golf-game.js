import {GOLF_KEY,WIDTH,HEIGHT,COLS,ROWS,TILE,CLUBS,HOLES,CELEBS,initialGolf,decodeGolf,encodeGolf,holeById,tileAt,prestige,guestsFor,setClub,chooseHole,paintTile,renameClub,inviteGuest,ballAtCup,swing,totalScore} from "./golf-core.mjs";
import {CUP_KEY,CUP_RIVALS,initialCup,decodeCup,encodeCup,cupActive,cupHole,cupTotal,startCup,recordCupHole,advanceCup,cupStandings,cupRank,cupBadge} from "./golf-cup.mjs";
const el=id=>document.getElementById(id),canvas=el("golf-canvas"),ctx=canvas.getContext("2d");
let state=initialGolf(),cup=initialCup(),mode="play",angle=0,aim={x:800,y:270},anim=null;
const colors={rough:"#457e46",fairway:"#79b65d",green:"#a2d66a",sand:"#eac580",water:"#4d9eb7"};
function save(msg){try{localStorage.setItem(GOLF_KEY,encodeGolf(state));localStorage.setItem(CUP_KEY,encodeCup(cup));el("golf-save").textContent=msg||"GOLF CAREER AND DESIGN SAVED LOCALLY"}catch{el("golf-save").textContent="STORAGE UNAVAILABLE. GAME WILL WORK UNTIL THIS TAB CLOSES."}}
function restore(){try{const raw=localStorage.getItem(GOLF_KEY);if(!raw)return;const p=decodeGolf(JSON.parse(raw));if(p)state=p;
 const savedCup=localStorage.getItem(CUP_KEY);
 if(savedCup){const restored=decodeCup(JSON.parse(savedCup));if(restored)cup=restored}
 if(cup.status==="playing"&&state.hole!==cupHole(cup))state=chooseHole(state,cupHole(cup));
 }catch{state=initialGolf();cup=initialCup()}}
const current=()=>holeById(mode==="build"?"custom":state.hole,state.tiles);
function message(s){el("golf-message").textContent=s||state.message}
function aimAt(x,y){angle=Math.atan2(y-state.ball.y,x-state.ball.x)*180/Math.PI;aim={x,y};}
function draw(){
 if(!ctx)return;
 ctx.clearRect(0,0,WIDTH,HEIGHT);
 const hole=current(),tiles=hole.tiles;
 for(let i=0;i<tiles.length;i++){
  const terrain=tiles[i],x=i%COLS*TILE,y=Math.floor(i/COLS)*TILE;
  ctx.fillStyle=colors[terrain];ctx.fillRect(x,y,TILE,TILE);
  ctx.strokeStyle="#173f331a";ctx.lineWidth=1;ctx.strokeRect(x,y,TILE,TILE);
  if(terrain==="water"){
   ctx.strokeStyle="#b0eaff55";ctx.lineWidth=2;
   ctx.beginPath();ctx.arc(x+30,y+30,19,0,Math.PI);ctx.stroke();
  }else if(terrain==="sand"){
   ctx.fillStyle="#917c5166";ctx.fillRect(x+17,y+16,4,4);ctx.fillRect(x+38,y+35,3,3);
  }else if(terrain==="green"){
   ctx.fillStyle="#c4f09530";ctx.beginPath();ctx.arc(x+30,y+30,20,0,Math.PI*2);ctx.fill();
  }
 }
 ctx.fillStyle="#1c3c27aa";ctx.font="bold 16px Trebuchet MS,Arial";
 ctx.fillText(hole.name,19,31);
 // Protected start and flag positions remain visible in design mode.
 const tee=hole.tee,cup=hole.cup;
 ctx.strokeStyle="#ede6ce";ctx.lineWidth=4;ctx.beginPath();ctx.arc(tee.x,tee.y,12,0,Math.PI*2);ctx.stroke();
 ctx.fillStyle="#faf0cf";ctx.font="1000 12px Trebuchet MS,Arial";ctx.fillText("TEE",tee.x-12,tee.y+30);
 ctx.strokeStyle="#fcf9db";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(cup.x,cup.y);ctx.lineTo(cup.x,cup.y-77);ctx.stroke();
 ctx.fillStyle="#f05a62";ctx.beginPath();ctx.moveTo(cup.x,cup.y-75);ctx.lineTo(cup.x+43,cup.y-62);ctx.lineTo(cup.x,cup.y-48);ctx.closePath();ctx.fill();
 ctx.fillStyle="#1b3825";ctx.beginPath();ctx.ellipse(cup.x,cup.y,12,7,0,0,Math.PI*2);ctx.fill();
 if(mode==="play"){
  const ball=anim?.ball||state.ball;
  if(!ballAtCup(state)){
   ctx.beginPath();ctx.moveTo(state.ball.x,state.ball.y);ctx.lineTo(aim.x,aim.y);
   ctx.strokeStyle="#fff8c8";ctx.lineWidth=3;ctx.setLineDash([12,8]);ctx.stroke();ctx.setLineDash([]);
   ctx.fillStyle="#f9e7ac";ctx.beginPath();ctx.arc(aim.x,aim.y,9,0,Math.PI*2);ctx.fill();
  }
  ctx.fillStyle="#152b32aa";ctx.beginPath();ctx.ellipse(ball.x+5,ball.y+6,10,6,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#ffffff";ctx.beginPath();ctx.arc(ball.x,ball.y,8,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle="#daeadd";ctx.lineWidth=2;ctx.stroke();
 }else{
  const selected=state.selected;
  ctx.fillStyle="#112b2bdc";ctx.fillRect(12,HEIGHT-48,280,35);
  ctx.font="900 15px Trebuchet MS,Arial";ctx.fillStyle="#f5f2ce";ctx.fillText("PAINTING: "+selected.toUpperCase(),23,HEIGHT-26);
 }
}
function renderScore(){
 const h=holeById(state.hole,state.tiles);
 el("golf-hole-name").textContent=h.name;
 el("golf-score").textContent="STROKES "+state.shots+" · PAR "+h.par+(ballAtCup(state)?" · HOLED":"");
 const root=el("golf-card");root.replaceChildren();
 for(const v of HOLES){
  const li=document.createElement("li");li.textContent=v.name+" · PAR "+v.par+" · "+(state.results[v.id]??"NOT YET PLAYED")+" STROKES";root.append(li);
 }
 const custom=document.createElement("li");custom.textContent=state.clubName+" · CUSTOM HOLE · "+(state.results.custom??"NOT YET PLAYED")+" STROKES";root.append(custom);
 const recorded=HOLES.filter(x=>state.results[x.id]);
 el("golf-total").textContent=recorded.length+" / 3 TOUR HOLES SCORED · "+totalScore(state)+" STROKES TOTAL";
}
function renderClub(){
 const rating=prestige(state.tiles);
 el("golf-prestige").textContent=state.clubName.toUpperCase()+" · PRESTIGE "+rating+" / 100 · "+state.guests.length+" VIP GUESTS INVITED";
 el("golf-club-name").value=state.clubName;
 const root=el("golf-guests");root.replaceChildren();
 for(const v of CELEBS){
  const item=document.createElement("li"),title=document.createElement("strong");title.textContent=v.name+" · "+v.title;
  item.append(title);
  if(!guestsFor(state.tiles).some(g=>g.id===v.id)){
   item.append(document.createTextNode("LOCKED · REQUIRES "+v.threshold+" PRESTIGE"));
  }else if(state.guests.includes(v.id)){item.append(document.createTextNode("VISITING YOUR CLUB · "+v.quip))}
  else{
   const b=document.createElement("button");b.type="button";b.className="guest-button";b.textContent="INVITE TO CLUB";b.addEventListener("click",()=>{
    const r=inviteGuest(state,v.id);state=r.state;render();save("CELEBRITY INVITATION SAVED LOCALLY");
   });item.append(b);
  }
  root.append(item);
 }
}
function renderCup(){
 const status=el("cup-status"),record=el("cup-record"),list=el("cup-scores");
 status.textContent=cup.status==="idle"?"READY TO START · THREE HOLES · FICTIONAL RIVALS":
 cup.status==="playing"?"IN PROGRESS · HOLE "+(cup.scores.length+1)+" / 3 · "+cupTotal(cup)+" STROKES RECORDED":
 cup.status==="between"?"HOLE "+cup.scores.length+" RECORDED · NEXT TEE WAITING":
 "TOURNAMENT COMPLETE · "+cup.last+" STROKES · RANK "+cupRank(cup);
 el("cup-start").disabled=cupActive(cup);
 el("cup-start").textContent=cup.status==="completed"?"PLAY A NEW CUP ROUND":"START THREE-HOLE CUP";
 el("cup-next-hint").textContent=cup.status==="between"?"USE THE NEXT TOUR HOLE BUTTON ON THE SCORECARD TO CONTINUE.":
 cup.status==="playing"?"SINK YOUR BALL TO RECORD THIS HOLE. YOU CANNOT SKIP A HOLE.":
 cup.status==="completed"?"CUP FINISHED! START AGAIN TO IMPROVE YOUR BEST ROUND.":"THREE HOLES, ONE HONEST SCORECARD. REPLAYABLE ANYTIME.";
 record.textContent="COMPLETED ROUNDS "+cup.rounds+" · BEST "+(cup.best??"NOT YET SET")+" · LAST "+(cup.last??"NOT YET SET");
 list.replaceChildren();
 for(const [index,hole]of HOLES.entries()){
  const li=document.createElement("li");li.textContent=(index+1)+". "+hole.name+" · "+(cup.scores[index]??"AWAITING ROUND")+" STROKES";list.append(li);
 }
 el("cup-podium").hidden=cup.status!=="completed";
 if(cup.status==="completed"){
  el("cup-badge").textContent=cupBadge(cup);
  el("cup-podium-message").textContent="YOUR OFFICIAL RANK: "+cupRank(cup)+" OF 4. FICTIONAL OPPONENT SCORECARDS ARE SCRIPTED, NOT LIVE PLAYERS.";
  const board=el("cup-leaderboard");board.replaceChildren();
  for(const [i,p] of cupStandings(cup).entries()){
   const li=document.createElement("li");li.textContent=(i+1)+". "+p.name+" · "+p.strokes+" STROKES"+(p.player?" · YOU":"");board.append(li);
  }
 }
 el("golf-hole").disabled=cupActive(cup);
 el("golf-mode-build").disabled=cupActive(cup);
 el("golf-next").disabled=cup.status==="playing";
 el("golf-next").textContent=cup.status==="between"?"NEXT CUP HOLE ↗":"NEXT HOLE ↗";
}
function render(){
 el("golf-hole").value=state.hole;el("golf-club").value=state.club;
 el("golf-mode-play").setAttribute("aria-pressed",String(mode==="play"));
 el("golf-mode-build").setAttribute("aria-pressed",String(mode==="build"));
 el("golf-playtools").hidden=mode!=="play";el("golf-buildtools").hidden=mode!=="build";
 el("golf-swing").disabled=mode!=="play"||ballAtCup(state);
 for(const button of document.querySelectorAll("[data-terrain]"))button.setAttribute("aria-pressed",String(button.dataset.terrain===state.selected));
 renderScore();renderClub();renderCup();message();draw();
}
function selectMode(next){if(next==="build"&&cupActive(cup)){message("FINISH THE GRAND STEM CUP BEFORE EDITING A COURSE.");return}mode=next;anim=null;render();if(next==="build")message("COURSE ARCHITECT MODE · CLICK ANY UNPROTECTED TILE TO PAINT "+state.selected.toUpperCase());else message("PLAY MODE · CLICK THE COURSE TO AIM, SET POWER AND SWING.")}
function doSwing(){
 if(mode!=="play"||ballAtCup(state)||anim)return;
 const old={...state.ball},result=swing(state,angle,Number(el("golf-power").value)/100);
 state=result.state;
 if(result.event==="HOLED"&&cup.status==="playing"){
  const recorded=recordCupHole(cup,state);cup=recorded.cup;
  if(recorded.recorded){state={...state,message:cup.status==="completed"?"GRAND STEM CUP COMPLETE · "+cupBadge(cup)+"!":"CUP HOLE SAVED · CONTINUE AT THE NEXT TEE."}}
 }
 const end={...state.ball};
 const start=performance.now();
 anim={ball:old};
 function tick(now){
  const t=Math.min(1,(now-start)/470),ease=1-Math.pow(1-t,2);
  if(anim)anim.ball={x:old.x+(end.x-old.x)*ease,y:old.y+(end.y-old.y)*ease};
  draw();
  if(t<1&&anim)requestAnimationFrame(tick);else{anim=null;render();}
 }
 requestAnimationFrame(tick);
 if(result.event==="WATER")message("SPLASH! TWO-STROKE WATER PENALTY. REPLAY FROM THE LAST SPOT.");
 else message(state.message);
 renderScore();save("GOLF STROKE SAVED LOCALLY");
}
function nextHole(){
 if(cup.status==="playing"){message("THIS TOUR HOLE ISN'T FINISHED. GET THAT BALL INTO THE CUP.");return}
 if(cup.status==="between"){
  const advancing=advanceCup(cup,state);cup=advancing.cup;state=advancing.golf;
  aimAt(current().cup.x,current().cup.y);render();save("GRAND STEM CUP NEXT TEE SAVED LOCALLY");return;
 }
 const ids=HOLES.map(h=>h.id).concat(["custom"]);
 const next=ids[(ids.indexOf(state.hole)+1)%ids.length];
 state=chooseHole(state,next);angle=0;aim={x:current().cup.x,y:current().cup.y};render();save("NEXT HOLE SAVED LOCALLY");
}
canvas.addEventListener("click",ev=>{
 const rect=canvas.getBoundingClientRect();
 const x=(ev.clientX-rect.left)/rect.width*WIDTH,y=(ev.clientY-rect.top)/rect.height*HEIGHT;
 if(mode==="build"){
  const index=Math.floor(y/TILE)*COLS+Math.floor(x/TILE);
  state=paintTile(state,index,state.selected);render();save("COURSE TERRAIN UPDATED LOCALLY");
 }else if(!anim){aimAt(x,y);draw();message("AIM LOCKED · "+Math.round(angle)+"° · CHOOSE YOUR CLUB AND POWER.")}
});
el("golf-mode-play").addEventListener("click",()=>selectMode("play"));
el("golf-mode-build").addEventListener("click",()=>selectMode("build"));
el("golf-club").addEventListener("change",ev=>{state=setClub(state,ev.target.value);save();render()});
el("golf-hole").addEventListener("change",ev=>{
 if(cupActive(cup)){render();return}
 state=chooseHole(state,ev.target.value);aimAt(current().cup.x,current().cup.y);render();save("NEW HOLE SELECTED");
});
el("golf-power").addEventListener("input",ev=>el("golf-power-label").textContent=ev.target.value+"%");
el("golf-swing").addEventListener("click",doSwing);
el("golf-next").addEventListener("click",nextHole);
for(const b of document.querySelectorAll("[data-terrain]"))b.addEventListener("click",()=>{state={...state,selected:b.dataset.terrain};render();message("TERRAIN BRUSH: "+state.selected.toUpperCase())});
el("golf-try-custom").addEventListener("click",()=>{
 if(cupActive(cup))return;
 state=chooseHole(state,"custom");mode="play";aimAt(current().cup.x,current().cup.y);render();save("NOW PLAYING YOUR DESIGNED CLUB COURSE");
});
el("golf-club-rename").addEventListener("click",()=>{
 state=renameClub(state,el("golf-club-name").value);render();save("CLUB NAME SAVED LOCALLY");
});
el("cup-start").addEventListener("click",()=>{
 const result=startCup(cup,state);if(!result.started)return;
 cup=result.cup;state=result.golf;mode="play";aimAt(current().cup.x,current().cup.y);
 render();save("GRAND STEM CUP STARTED · ROUND 1 / 3 SAVED LOCALLY");
});
el("golf-reset").addEventListener("click",()=>{
 if(!window.confirm("Reset all TweedleGolf scores, course terrain, guests, club name and Grand Stem Cup history? Your other TweedleVerse games will not be affected."))return;
 state=initialGolf();cup=initialCup();mode="play";aimAt(current().cup.x,current().cup.y);render();save("GOLF CAREER RESET LOCALLY");
});
document.addEventListener("keydown",ev=>{
 if(["INPUT","TEXTAREA","SELECT","BUTTON"].includes(document.activeElement?.tagName))return;
 if(ev.code==="Space"&&!ev.repeat&&mode==="play"){ev.preventDefault();doSwing()}
});
window.addEventListener("pagehide",()=>save());
restore();aimAt(holeById(state.hole,state.tiles).cup.x,holeById(state.hole,state.tiles).cup.y);render();
