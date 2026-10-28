"use strict";
(() => {
  const byId = id => document.getElementById(id);
  const state = {places:[],selected:null,visits:new Set(),totalClicks:0,filter:"all",stage:0,modalOpen:false,focusReturn:null};
  const goals = ["","coffeechucks","stems-league","tweedcorp"];
  const messages = [
    "Your first mission is available. A simple trip for coffee. What could possibly go wrong?",
    "Get coffee at CoffeeChucks. This errand is already more complicated than the job description.",
    "CoffeeChucks says the complimentary coffee requires a Stems League stamp. Visit the arena.",
    "The Stems League has entered you in a tournament instead. Report back to TweedCorp HQ.",
    "MISSION COMPLETE! You acquired a tournament obligation and still have no free coffee."
  ];
  function renderMission() {
    byId("quest-instructions").textContent=messages[state.stage];
    const labels=["NOT STARTED","STEP 1 / 3","STEP 2 / 3","STEP 3 / 3","COMPLETED · NO COFFEE RECEIVED"];
    byId("quest-status").textContent=labels[state.stage];
    for(const li of byId("quest-steps").querySelectorAll("li")){
      const step=Number(li.dataset.step);
      li.classList.toggle("active",step===state.stage);
      li.classList.toggle("completed",step<state.stage||state.stage===4);
    }
    const action=byId("quest-action");
    action.textContent=state.stage===0?"START MISSION":state.stage===4?"REPLAY MISSION":"RESTART MISSION";
    byId("begin-quest").textContent=state.stage===4?"PLAY AGAIN ↻":state.stage===0?"START: THE COFFEE RUN ↗":"RESTART THE COFFEE RUN ↻";
  }
  function beginMission() {
    state.stage=1;
    renderMission();
    if(!state.places.length)return;
    select("tweedcorp",false);
    byId("quest-card-placeholder");
  }
  function chooseFilter(next) {
    state.filter=next;
    for(const btn of document.querySelectorAll(".filter")){
      const active=btn.dataset.filter===next;
      btn.classList.toggle("active",active);
      btn.setAttribute("aria-pressed",String(active));
    }
    for(const btn of document.querySelectorAll(".map-pin")){
      btn.classList.toggle("dimmed",next!=="all"&&btn.dataset.district!==next);
      btn.disabled=next!=="all"&&btn.dataset.district!==next;
    }
    for(const btn of document.querySelectorAll(".directory-button")){
      btn.hidden=next!=="all"&&btn.dataset.district!==next;
    }
  }
  function showTweedsie(trigger){
    const pop=byId("tweedsie-pop");
    state.focusReturn=trigger||document.activeElement;
    state.modalOpen=true;
    pop.hidden=false;
    byId("dismiss-tweedsie").focus();
  }
  function hideTweedsie(){
    if(!state.modalOpen)return;
    byId("tweedsie-pop").hidden=true;
    state.modalOpen=false;
    state.focusReturn?.focus();
  }
  function select(id,countVisit=true){
    const place=state.places.find(p=>p.id===id);
    if(!place)return;
    state.selected=id;
    for(const marker of document.querySelectorAll(".map-pin"))marker.setAttribute("aria-pressed",String(marker.dataset.id===id));
    byId("place-category").textContent=place.type.toUpperCase();
    byId("place-icon").textContent=place.icon;
    byId("place-title").textContent=place.name;
    byId("place-district").textContent=place.district.toUpperCase();
    byId("place-description").textContent=place.description;
    byId("place-quote").textContent="“"+place.tagline+"”";
    if(countVisit){
      state.visits.add(id);
      state.totalClicks+=1;
      byId("visit-count").textContent=state.visits.size+" / "+state.places.length+" LANDMARKS VISITED";
      if(state.stage>=1 && state.stage<=3 && id===goals[state.stage]){
        state.stage+=1;
        renderMission();
      }
      if(state.totalClicks%5===0)showTweedsie(document.querySelector('.map-pin[data-id="'+id+'"]'));
    }
  }
  function renderPlaces() {
    const pins=byId("map-pins"), directory=byId("directory-list");
    pins.replaceChildren();directory.replaceChildren();
    for(const place of state.places){
      const marker=document.createElement("button");
      marker.type="button"; marker.className="map-pin";marker.dataset.id=place.id;
      marker.dataset.district=place.district.startsWith("North")?"north":"south";
      marker.style.left=String(place.x)+"%";marker.style.top=String(place.y)+"%";
      marker.setAttribute("aria-label","Visit "+place.name+" in "+place.district);
      marker.setAttribute("aria-pressed","false");
      const icon=document.createElement("span"); icon.className="pin-icon";icon.textContent=place.icon;
      icon.setAttribute("aria-hidden","true");
      const label=document.createElement("span");label.className="pin-name";label.textContent=place.mapLabel||place.name;
      marker.append(icon,label);
      marker.addEventListener("click",()=>select(place.id));
      pins.append(marker);
      const listing=document.createElement("button");
      listing.type="button";listing.className="directory-button";listing.dataset.district=marker.dataset.district;
      const district=document.createElement("small");district.textContent=place.district;
      const name=document.createElement("strong");name.textContent=place.name;
      const detail=document.createElement("span");detail.textContent=place.type;
      listing.append(district,name,detail);
      listing.addEventListener("click",()=>{
        if(state.filter!=="all"&&marker.disabled)chooseFilter("all");
        select(place.id);
        byId("street-map").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});
      });
      directory.append(listing);
    }
    chooseFilter("all");
    select("tweedcorp",false);
  }
  async function init(){
    try {
      const response=await fetch("data/stemside-map.json",{cache:"no-store"});
      if(!response.ok)throw Error("Map data response "+response.status);
      const payload=await response.json();
      if(!Array.isArray(payload.places)||payload.places.length<5)throw Error("Map data is missing locations");
      state.places=payload.places;
      renderPlaces();
    } catch(e) {
      byId("directory-list").textContent="CITY HALL ERROR: Can't load the town directory. Serve this site through a local HTTP server or GitHub Pages. "+e.message;
      byId("place-description").textContent="Stemside's city map data is unavailable. The corporation has been notified but will probably charge us.";
    }
    renderMission();
  }
  document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>chooseFilter(btn.dataset.filter)));
  byId("begin-quest").addEventListener("click",()=>{
    beginMission();
    byId("street-map").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});
  });
  byId("quest-action").addEventListener("click",beginMission);
  byId("dismiss-tweedsie").addEventListener("click",hideTweedsie);
  byId("tweedsie-pop").addEventListener("click",event=>{if(event.target===byId("tweedsie-pop"))hideTweedsie()});
  document.addEventListener("keydown",event=>{
    if(!state.modalOpen)return;
    if(event.key==="Escape")hideTweedsie();
    if(event.key==="Tab"){event.preventDefault();byId("dismiss-tweedsie").focus()}
  });
  init();
})();