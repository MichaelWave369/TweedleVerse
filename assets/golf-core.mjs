// TweedleGolf ProTour: original arcade golf + editable club course vertical slice.
// Screen units are fictional, shots are deterministic, no real golf physics claims.
export const GOLF_KEY="tweedleverse.tweedlegolf.protour.v1";
export const GOLF_VERSION=1,WIDTH=900,HEIGHT=540,COLS=15,ROWS=9,TILE=60;
export const TERRAIN=Object.freeze(["rough","fairway","green","sand","water"]);
export const CLUBS=Object.freeze([
 {id:"driver",name:"BIG STICK",max:400},
 {id:"iron",name:"SEVEN IRON",max:260},
 {id:"wedge",name:"WEDGE",max:145},
 {id:"putter",name:"PUTTER",max:78}
]);
export const CELEBS=Object.freeze([
 {id:"duke",name:"DUKE VON DIVOT",title:"Interdimensional golf influencer",threshold:10,quip:"DUKE: The fairway has character. Mostly emotional damage."},
 {id:"cindy",name:"CINDY CHIPSHOT",title:"Former talk-show empress",threshold:23,quip:"CINDY: I only endorse courses with an appropriately dramatic water hazard."},
 {id:"reggie",name:"REGGIE BANDS III",title:"President of unnecessary green fees",threshold:39,quip:"REGGIE: I shall charge your guests for the privilege of losing balls."},
 {id:"mavis",name:"MAVIS McMULLIGAN",title:"Celebrity club inspector",threshold:52,quip:"MAVIS: My goodness. An actually playable course? What an alarming development."}
]);
export function defaultTiles(){
 const t=Array.from({length:COLS*ROWS},(_,i)=>{
  const x=i%COLS,y=Math.floor(i/COLS);
  if((x===3&&y===2)||(x===9&&y===6)||(x===12&&y===2))return "sand";
  if((x===5&&y<=2)||(x===10&&y>=6))return "water";
  if((x===13||x===14)&&y>=3&&y<=5)return "green";
  return y>=2&&y<=6?"fairway":"rough";
 });
 t[4*COLS+1]="fairway";t[4*COLS+13]="green";
 return t;
}
export const HOLES=Object.freeze([
 {id:"chucks",name:"COFFEECHUCKS MUNICIPAL",par:4,tee:{x:75,y:260},cup:{x:825,y:260},tiles:defaultTiles()},
 {id:"reggie",name:"REGGIE'S PAYWALL LINKS",par:5,tee:{x:75,y:420},cup:{x:825,y:120},tiles:(()=>{
  const t=defaultTiles();for(let x=4;x<=8;x++)t[4*COLS+x]="water";for(let x=10;x<=12;x++)t[2*COLS+x]="sand";t[2*COLS+13]="green";return t
 })()},
 {id:"mids",name:"SOUTH STEMSIDE PUBLIC LINKS",par:3,tee:{x:90,y:310},cup:{x:745,y:250},tiles:(()=>{
  const t=defaultTiles();for(let x=5;x<8;x++)t[3*COLS+x]="sand";t[4*COLS+12]="green";return t
 })()}
]);
export const customHole=tiles=>({id:"custom",name:"YOUR CLUB / DESIGNER COURSE",par:4,tee:{x:90,y:270},cup:{x:810,y:270},tiles});
export const holeById=(id,tiles)=>id==="custom"?customHole(tiles):HOLES.find(h=>h.id===id)||HOLES[0];
export const tileAt=(tiles,x,y)=>{
 const col=Math.min(COLS-1,Math.max(0,Math.floor(x/TILE))),row=Math.min(ROWS-1,Math.max(0,Math.floor(y/TILE)));
 return tiles[row*COLS+col]||"rough";
};
export function prestige(tiles){
 const count=t=>tiles.filter(x=>x===t).length;
 return Math.min(100,Math.round(count("fairway")*.22+count("green")*.6+count("sand")*.8+count("water")*.95));
}
export const guestsFor=tiles=>CELEBS.filter(v=>prestige(tiles)>=v.threshold);
export function initialGolf(){
 return {version:GOLF_VERSION,hole:"chucks",ball:{...HOLES[0].tee},shots:0,results:{},tiles:defaultTiles(),selected:"fairway",club:"iron",message:"WELCOME TO TWEEDLEGOLF. TEE UP, CHAMP."};
}
const validHole=new Set([...HOLES.map(h=>h.id),"custom"]),validClub=new Set(CLUBS.map(c=>c.id));
export function decodeGolf(raw){
 if(!raw||typeof raw!=="object"||Array.isArray(raw)||raw.version!==GOLF_VERSION)return null;
 const base=initialGolf();const hole=validHole.has(raw.hole)?raw.hole:"chucks";
 const tiles=Array.isArray(raw.tiles)&&raw.tiles.length===COLS*ROWS?raw.tiles.map(x=>TERRAIN.includes(x)?x:"rough"):defaultTiles();
 // Keep the tee and flag playable regardless of modified or corrupted designer tiles.
 tiles[4*COLS+1]="fairway";tiles[4*COLS+13]="green";
 const h=holeById(hole,tiles);
 const p=raw.ball&&typeof raw.ball==="object"?raw.ball:{};
 const ball={x:Number.isFinite(p.x)?Math.max(10,Math.min(WIDTH-10,p.x)):h.tee.x,
  y:Number.isFinite(p.y)?Math.max(10,Math.min(HEIGHT-10,p.y)):h.tee.y};
 const results={};for(const item of HOLES){
  if(Number.isInteger(raw.results?.[item.id])&&raw.results[item.id]>0&&raw.results[item.id]<=30)results[item.id]=raw.results[item.id];
 }
 if(Number.isInteger(raw.results?.custom)&&raw.results.custom>0&&raw.results.custom<=30)results.custom=raw.results.custom;
 return {version:GOLF_VERSION,hole,ball,shots:Number.isInteger(raw.shots)?Math.max(0,Math.min(30,raw.shots)):0,
  results,tiles,selected:TERRAIN.includes(raw.selected)?raw.selected:base.selected,
  club:validClub.has(raw.club)?raw.club:base.club,message:typeof raw.message==="string"?raw.message.slice(0,160):base.message};
}
export function encodeGolf(p){const x=decodeGolf({...p,version:GOLF_VERSION});if(!x)throw Error("Invalid golf save");return JSON.stringify(x)}
export function setClub(p,id){return validClub.has(id)?{...p,club:id}:p}
export function chooseHole(p,id){
 if(!validHole.has(id))return p;
 const h=holeById(id,p.tiles);
 return {...p,hole:id,ball:{...h.tee},shots:0,message:"TEE TIME AT "+h.name.toUpperCase()+". NO REFUNDS."};
}
export function paintTile(p,index,type){
 if(!Number.isInteger(index)||index<0||index>=COLS*ROWS||!TERRAIN.includes(type))return p;
 if(index===4*COLS+1||index===4*COLS+13)return p;
 const tiles=[...p.tiles];tiles[index]=type;
 return {...p,tiles,selected:type,message:"COURSE ARCHITECT: "+type.toUpperCase()+" PLACED. REPUTATION "+prestige(tiles)+"."};
}
export function ballAtCup(p){
 const h=holeById(p.hole,p.tiles);
 return Math.hypot(p.ball.x-h.cup.x,p.ball.y-h.cup.y)<24;
}
export function swing(p,angle,power){
 if(ballAtCup(p))return {state:p,event:"HOLED"};
 if(!Number.isFinite(angle)||!Number.isFinite(power))return {state:p,event:"INVALID"};
 const club=CLUBS.find(c=>c.id===p.club)||CLUBS[0],h=holeById(p.hole,p.tiles);
 const level=Math.max(.05,Math.min(1,power));
 const start={...p.ball};
 const terrain=tileAt(h.tiles,start.x,start.y);
 const factor=terrain==="sand"?.55:terrain==="rough"?.79:terrain==="green"?.93:1;
 const d=club.max*level*factor;
 const rad=angle*Math.PI/180;
 const target={x:Math.max(10,Math.min(WIDTH-10,start.x+Math.cos(rad)*d)),y:Math.max(10,Math.min(HEIGHT-10,start.y+Math.sin(rad)*d))};
 // Only trace the playable area in 8 substeps. Water resets ball and adds a penalty stroke.
 let water=false;
 for(let i=1;i<=8;i++){
  const x=start.x+(target.x-start.x)*i/8,y=start.y+(target.y-start.y)*i/8;
  if(tileAt(h.tiles,x,y)==="water"){water=true;break}
 }
 const strokes=Math.min(30,p.shots+(water?2:1));
 const next={...p,ball:water?start:target,shots:strokes,
   message:water?"SPLASH! PENALTY STROKE. REGGIE OWNS THE WATER RIGHTS.":"SHOT "+strokes+" · "+club.name+" · "+Math.round(d)+" FICTIONAL YARDS."};
 const distance=Math.hypot(next.ball.x-h.cup.x,next.ball.y-h.cup.y);
 const holed=!water&&distance<24;
 if(holed){
  next.ball={...h.cup};
  next.results={...next.results,[p.hole]:strokes};
  next.message="IN THE CUP! "+strokes+" STROKES · PAR "+h.par+". "+(strokes<=h.par?"THE CROWD GOES WILD.":"REGGIE CHARGES YOU FOR EACH EXTRA STROKE.");
 }
 return {state:next,event:water?"WATER":holed?"HOLED":"SHOT"};
}
export const totalScore=p=>HOLES.reduce((s,h)=>s+(p.results[h.id]||0),0);
