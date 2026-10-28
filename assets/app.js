"use strict";
(() => {
  const stations = [
    {number:"CH 420 · LOCAL ADVERTISING",title:"REGGIE'S REGGIE",description:"Cheap in a Pinch! Now with slightly fewer stems than the bag you bought yesterday.",tag:"PRODUCT MAY CONTAIN TRACE AMOUNTS OF TWEED."},
    {number:"CH 019 · STEMSIDE COOKING",title:"TACO McBURGER BELL",description:"Think outside the bun. Then put the bun inside the taco. Then consult our legal team.",tag:"COMBO MEAL AVAILABLE IN SELECT DIMENSIONS."},
    {number:"CH 042 · DRAMATIC SCIENCE",title:"IS GRAVITY GUILTY?",description:"Tonight on Law & Disorder: Special Victims of Physics, detectives arrest gravity for bringing everybody down.",tag:"UP NEXT: ANOTHER COMMERCIAL, PROBABLY."},
    {number:"CH 007 · INTERDIMENSIONAL SHOPPING",title:"SNUBLISHERS CLEARING HOUSE",description:"Congratulations! You've won ten million space credits. Redeemable only in a dimension that went bankrupt.",tag:"OFFICIAL PRIZE AMOUNT MAY EQUAL ZERO."},
    {number:"CH 101 · VINTAGE ENTERTAINMENT",title:"LACKLUSTER VIDEO",description:"The movie you're looking for is checked out. We also don't have the other one. Late fees still apply.",tag:"BE KIND. REWIND. WHATEVER."},
    {number:"CH 880 · LIVE SPORTS",title:"TGA PRO TOUR",description:"Southside's surprise qualifier challenges the North Stemside elite. Reggie Bands demands an instant replay of his own entrance.",tag:"SPORTS PREMIUM REQUIRED TO VIEW THE BALL."},
    {number:"CH 999 · BOARDROOM FEED",title:"SPACEALITE UPDATE",description:"Your free trial of existence has expired. Thank you for choosing us without being given a choice.",tag:"YOU HAVE INFINITE CHOICES. NONE ARE INCLUDED."}
  ];
  const modifiers = ["DOUBLE POINTS!","REVERSE THE COURSE!","FOAM HAMMER TIME!","BALL SWAP!","SUDDEN DEATH!","EVERYBODY FREEZES!","RELEASE THE STEMPEDERS!","REGGIE'S RULE CHANGE!"];
  const quips = [
    "Tweedsie has been here the whole time. Check the credits.",
    "A tiny sign appears: SEEDS McSTEMS.",
    "Tweedsie just stole the director's chair.",
    "Same hole. Different day.",
    "Reggie has been charged a gopher-appearance fee.",
    "The script now ends with Tweedsie winning."
  ];
  let channel=0, spins=0, sightings=0;
  const byId=id=>document.getElementById(id);
  const next=byId("next-channel");
  if(next) next.addEventListener("click",()=>{
    channel=(channel+1)%stations.length;
    const s=stations[channel];
    byId("channel-number").textContent=s.number;
    byId("channel-title").textContent=s.title;
    byId("channel-description").textContent=s.description;
    byId("channel-tag").textContent=s.tag;
  });
  const spin=byId("spin-wheel");
  if(spin) spin.addEventListener("click",()=>{
    const n=Math.floor(Math.random()*modifiers.length);
    spins+=1;
    byId("wheel-output").textContent=modifiers[n];
    const wheel=document.querySelector(".wheel");
    if(wheel) wheel.style.transform="rotate("+String(spins*720+n*45)+"deg)";
  });
  const poke=byId("tweedsie-button");
  if(poke)poke.addEventListener("click",()=>{
    const message=quips[sightings%quips.length];
    sightings+=1;
    byId("tweedsie-response").textContent=message;
    poke.textContent=sightings===1?"Poke again (he's still there)":"Poke the gopher hole";
  });
  const script=byId("script-button");
  if(script)script.addEventListener("click",()=>{
    const page=byId("script-page");
    page.hidden=!page.hidden;
    script.setAttribute("aria-expanded",String(!page.hidden));
    script.textContent=page.hidden?"OPEN PAGE 42 ↗":"CLOSE PAGE 42 ↙";
  });
})();
