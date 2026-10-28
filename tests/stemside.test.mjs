import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const read=path=>readFileSync(resolve(root,path),'utf8');
const data=JSON.parse(read('data/stemside-map.json'));
const canon=JSON.parse(read('data/canon.json'));
const html=read('stemside.html'),js=read('assets/stemside.js'),css=read('assets/stemside.css'),home=read('index.html');
test('at least ten distinct coherent locations',()=>{
 assert.ok(data.places.length>=10);
 assert.equal(new Set(data.places.map(p=>p.id)).size,data.places.length);
 assert.equal(new Set(data.places.map(p=>p.name)).size,data.places.length);
});
test('all city map landmarks are recognized canon landmarks or official locations',()=>{
 const anchors=new Set(canon.landmarks.map(x=>x.name));
 for(const p of data.places){
   assert.ok(anchors.has(p.name)||['TweedCorp Co.','Spacealite Executive Tower','Southside Stems League Arena'].includes(p.name),p.name);
   assert.ok(canon.setting.districts.includes(p.district),p.district);
   assert.ok(p.x>2&&p.x<98&&p.y>7&&p.y<96,p.id);
   assert.ok(p.district.startsWith('North')?p.y<50:p.y>50,p.id+' district zone');
 }
});
test('intro, map, filter, quest, directory and modal markup exist',()=>{
 for(const id of ['street-map','map-pins','directory-list','begin-quest','quest-action','quest-steps','quest-status','tweedsie-pop','dismiss-tweedsie'])assert.ok(html.includes('id="'+id+'"'),id);
 assert.ok(html.includes('aria-live="polite"'));
 assert.ok(html.includes('aria-modal="true"'));
 assert.ok(css.includes('prefers-reduced-motion'));
 assert.ok(js.includes('addEventListener'));
 assert.ok(home.includes('stemside.html'),'main website must link to explorer');
});
test('mission progression data matches map IDs',()=>{
 for(const id of ['coffeechucks','stems-league','tweedcorp'])assert.ok(data.places.some(p=>p.id===id));
 assert.ok(js.includes('state.stage+=1'));
 assert.ok(js.includes('goals[state.stage]'));
});
test('no remote runtime assets in explorer',()=>{
 for(const src of ['<script src="http','<script src="//','<link rel="stylesheet" href="http','<img src="http'])assert.ok(!html.includes(src),src);
});
