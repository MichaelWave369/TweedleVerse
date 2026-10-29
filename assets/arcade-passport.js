import {PASSPORT_SOURCES,readPassport} from "./passport-core.mjs";
const element=document.getElementById("arcade-passport-progress");
if(element){
 const raw={};
 try{for(const source of PASSPORT_SOURCES)raw[source.id]=localStorage.getItem(source.key)}
 catch{for(const source of PASSPORT_SOURCES)raw[source.id]=null}
 const passport=readPassport(raw);
 element.textContent=passport.count+" / "+passport.total+" STAMPS · "+passport.tier;
}
