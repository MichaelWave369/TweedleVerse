// The first three original Stemside interiors and a deterministic script-rewrite epilogue.
// All dialogue, options, and consequences are static authored fiction. No network or AI service.
export const SCENES = Object.freeze({
  coffeechucks:{
    place:"CoffeeChucks",npc:"Chuck, Shift Manager",tone:"south",
    prop:"COFFEECHUCKS // COFFEE GOES IN CUP",
    greeting:"CHUCK: You're here for coffee, right? Fantastic. Unfortunately, the register says you're here for a career opportunity.",
    choices:[
      {id:"coupon",label:"Ask about your free-coffee coupon",reply:"CHUCK: Coupon's valid! Just get a stamp from the Stems League. And the stamp requires a tournament entry. I don't make the rules; I just regret printing them."},
      {id:"charles",label:"Ask if CoffeeCharles sells different coffee",reply:"CHUCK: Same beans, same machine, same delivery truck. Up there it's a Grand Charles. Down here it's a cup. The extra sixteen credits are for syllables."},
      {id:"complaint",label:"File a complaint about the service",reply:"CHUCK: Complaints cost four credits. Compliments are complimentary, provided you agree to be recorded saying one."}
    ]
  },
  lackluster:{
    place:"Lackluster Video",npc:"Marty, Rewind Technician",tone:"violet",
    prop:"LACKLUSTER // PLEASE PRETEND TO REWIND",
    greeting:"MARTY: We rent movies from your past, your future, and whatever year the inventory computer thinks it is. Late fees apply in all timelines.",
    choices:[
      {id:"future",label:"Rent next week's episode",reply:"MARTY: Can't. Somebody returned the finale before it was filmed. Now the end credits are arguing with the opening scene."},
      {id:"script",label:"Ask about the missing script",reply:"MARTY: Oh, page 42? Check the writers' room at TweedCorp. The printer's been billing that page as a recurring character."},
      {id:"tape",label:"Find the lowest-rated movie",reply:"MARTY: You're standing in it. No offense, but your movie is currently two credits a night, one if you return yourself."}
    ]
  },
  tweedcorp:{
    place:"TweedCorp Co.",npc:"Buffer Bob, Compliance",tone:"factory",
    prop:"TWEEDCORP // YOUR HAPPINESS IS MANDATORY",
    greeting:"BOB: Please do not enter the compliance office without a compliance permit. Also, don't ask me where to get one. That requires a permit.",
    choices:[
      {id:"contract",label:"Review your Tweedleball contract",reply:"BOB: The contract has a clause about free coffee. Unfortunately it says the coffee becomes free once you win a national tournament."},
      {id:"writers",label:"Ask why the script knows your future",reply:"BOB: It's an approved narrative forecast. Unapproved futures are considered workplace misconduct. We filed the form yesterday."},
      {id:"union",label:"Ask whether the plot can be changed",reply:"BOB: The episode has a rewrite procedure. Two Plot Points, a completed Coffee Run, and a signature from absolutely nobody. Oddly efficient."}
    ]
  }
});
export const REWRITES=Object.freeze({
  coffee:{id:"coffee",label:"COFFEE FIRST",target:"coffeechucks",objective:"Return to CoffeeChucks to claim your free drink.",outcome:"CHUCK: Fine! The script says you get the coffee. The cup says SPACEALITE PREMIUM BEVERAGE FEE, but I crossed it out."},
  audit:{id:"audit",label:"AUDIT THE BANDWIDTH",target:"spacealite",objective:"Visit Spacealite Tower and challenge Reggie's billing scheme.",outcome:"REGGIE: WHO AUTHORIZED THIS AUDIT?! ...Oh. The episode script. My own signature. SEEDS McSTEMS is not a financial category!"}
});
export const REWRITE_COST=2;
export function initialStory(){return {points:0,heard:[],rewrite:null,finished:false}}
export function canEnter(id){return Object.hasOwn(SCENES,id)}
export function getScene(id){return SCENES[id]||null}
export function getReply(sceneId,choiceId){
 const scene=getScene(sceneId);
 return scene?.choices.find(c=>c.id===choiceId)?.reply||null;
}
export function awardPlotPoint(story,sceneId){
 if(!canEnter(sceneId)||story.heard.includes(sceneId))return {...story};
 return {...story,points:Math.min(3,story.points+1),heard:[...story.heard,sceneId]};
}
export function eligibleToRewrite(story,questStage){
 return questStage===3&&!story.rewrite&&story.points>=REWRITE_COST;
}
export function chooseRewrite(story,questStage,id){
 if(!eligibleToRewrite(story,questStage)||!Object.hasOwn(REWRITES,id))return null;
 return {...story,points:story.points-REWRITE_COST,rewrite:id,finished:false};
}
export function resolveEpilogue(story,placeId){
 if(!story.rewrite||story.finished)return {story,completed:false,message:null};
 const option=REWRITES[story.rewrite];
 if(!option||option.target!==placeId)return {story,completed:false,message:null};
 return {story:{...story,finished:true},completed:true,message:option.outcome};
}
export function scriptStatus(story,questStage){
 if(story.finished)return "EPILOGUE COMPLETE · REWRITTEN BY AN EMPLOYEE";
 if(story.rewrite)return REWRITES[story.rewrite].objective;
 if(questStage<3)return "FINISH THE COFFEE RUN TO UNLOCK PAGE 42.";
 if(story.points<REWRITE_COST)return "TALK INSIDE "+(REWRITE_COST-story.points)+" MORE SHOP"+(REWRITE_COST-story.points===1?"":"S")+" TO EARN PLOT POINTS.";
 return "PAGE 42 UNLOCKED: CHOOSE WHAT THE NEXT SCENE BECOMES.";
}
