import {PASSPORT_SOURCES,readPassport,summaryText} from "./passport-core.mjs";
import {CROSSROADS_KEY,decodeCrossroads,CROSSROADS_CASES} from "./crossroads-core.mjs";
const el=id=>document.getElementById(id);
let state=null,filter="all";
const make=(tag,text,cls)=>{
 const node=document.createElement(tag);
 if(typeof text==="string")node.textContent=text;
 if(cls)node.className=cls;
 return node;
};
function localSnapshot(){
 const raw={};let unavailable=false;
 for(const source of PASSPORT_SOURCES){
  try{raw[source.id]=localStorage.getItem(source.key)}
  catch{unavailable=true;raw[source.id]=null}
 }
 return {passport:readPassport(raw),unavailable};
}
function renderGroup(group){
 const visible=group.badges.filter(b=>filter==="all"||b.earned===(filter==="earned"));
 if(!visible.length)return null;
 const section=make("section",null,"passport-group");
 const header=make("div",null,"passport-group-header");
 const h=make("h3",group.title),progress=make("span",group.badges.filter(x=>x.earned).length+" / "+group.badges.length+" EARNED","passport-group-progress");
 const link=make("a","PLAY THIS SERIES ↗");link.href=group.href;
 header.append(h,progress,link);section.append(header);
 const grid=make("div",null,"passport-stamp-grid");
 for(const badge of visible){
  const card=make("article",null,"passport-stamp"+(badge.earned?"":" locked"));
  const symbol=make("span",badge.symbol,"stamp-symbol");symbol.setAttribute("aria-hidden","true");
  const title=make("strong",badge.title),desc=make("p",badge.desc);
  const status=make("small",badge.earned?"✓ OFFICIALLY UNOFFICIAL":"NOT YET EARNED");
  card.append(symbol,title,desc,status);grid.append(card);
 }
 section.append(grid);
 return section;
}
function render(passport,unavailable=false){
 state=passport;
 el("passport-count").textContent=passport.count+" / "+passport.total;
 el("passport-grade").textContent=passport.tier;
 el("passport-games").textContent=passport.gamesWithStamps+" / "+passport.series.length;
 el("passport-progress").value=passport.count;
 el("passport-progress").max=passport.total;
 el("passport-progress").textContent=passport.percentage+"%";
 el("passport-percent").textContent=passport.percentage+"%";
 const albums=el("passport-stamps");albums.replaceChildren();
 for(const group of passport.series){
  const section=renderGroup(group);
  if(section)albums.append(section);
 }
 if(!albums.children.length)albums.append(make("p","No stamps in this filter yet. Try another game. Reggie demands proof of effort.","passport-intro"));
 for(const button of document.querySelectorAll("[data-filter]")){
  button.setAttribute("aria-pressed",String(button.dataset.filter===filter));
 }
 const headlines=el("passport-headlines");headlines.replaceChildren();
 for(const headline of passport.headlines){
  const item=make("article",null,"passport-headline");
  item.append(make("div","THE STEMSIDE EVENING NEWS · LOCAL EDITION","byline"),make("h3",headline.title),make("p",headline.body));
  headlines.append(item);
 }
 const sources=el("passport-source-list");sources.replaceChildren();
 for(const source of passport.sources){
  const li=make("li");
  const a=make("a",source.title);a.href=source.href;
  const status=make("span",source.status==="loaded"?"✓ FOUND":source.status==="missing"?"NOT FOUND":source.status==="unrecognized"?"UNRECOGNIZED":"UNREADABLE",source.status==="loaded"?"source-ok":"source-none");
  li.append(a,status);sources.append(li);
 }
 if(unavailable){
  el("passport-notice").textContent="BROWSER STORAGE ACCESS IS DISABLED. THIS PAGE CANNOT READ YOUR LOCAL SAVES. EXISTING GAME FILES ARE NOT TOUCHED.";
 }else{
  el("passport-notice").textContent="LOCAL PASSPORT REFRESHED · "+passport.count+" AUTHENTIC GAME STAMPS RECOGNIZED · NO SAVES WRITTEN.";
 }
}
function refresh(){
 const {passport,unavailable}=localSnapshot();
 render(passport,unavailable);
 let completed=0;
 try{
  const raw=localStorage.getItem(CROSSROADS_KEY);
  const valid=raw?decodeCrossroads(JSON.parse(raw),passport):null;
  completed=valid?.completed.length||0;
 }catch{/* The Passport stays readable if the optional ledger is unavailable. */}
 el("passport-crossroads-count").textContent=completed+" / "+CROSSROADS_CASES.length+" CROSSOVER CASES CLOSED ON THIS BROWSER";
}
for(const button of document.querySelectorAll("[data-filter]")){
 button.addEventListener("click",()=>{filter=button.dataset.filter;refresh()});
}
el("passport-refresh").addEventListener("click",refresh);
el("passport-copy").addEventListener("click",async ()=>{
 if(!state)return;
 try{
  if(!navigator.clipboard?.writeText)throw new Error("Clipboard unavailable");
  await navigator.clipboard.writeText(summaryText(state));
  el("passport-notice").textContent="PASSPORT SUMMARY COPIED. NO GAME SAVE WAS MODIFIED.";
 }catch{el("passport-notice").textContent="CLIPBOARD ACCESS WAS NOT AVAILABLE. THE STAMP ALBUM ABOVE STILL SHOWS YOUR PROGRESS."}
});
window.addEventListener("pageshow",event=>{if(event.persisted)refresh()});
document.addEventListener("visibilitychange",()=>{if(!document.hidden)refresh()});
refresh();
