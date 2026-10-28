import test from 'node:test'
import assert from 'node:assert/strict'
import { seedKitchen } from '../src/features/kitchen/shared/data.ts'
import { applyKitchen } from '../src/features/kitchen/shared/rules.ts'
const now=Date.parse('2026-10-01T12:00:00+07:00')
const state=()=>({...seedKitchen(now),signedIn:true})
const run=(s,c)=>applyKitchen(s,c,now)
test('unauthenticated and out-of-area commands cannot mutate tickets',()=>{
 const s=seedKitchen(now);assert.ok(run(s,{type:'transition',id:'K101',status:'Cooking'}));assert.equal(s.tickets[0].status,'Pending')
 assert.equal(run(s,{type:'login',area:'Bar'}),null);assert.ok(run(s,{type:'transition',id:'K101',status:'Cooking'}));assert.equal(run(s,{type:'transition',id:'K106',status:'Cooking'}),null)
})
test('duplicate event and duplicate ticket ID do not create duplicate work',()=>{
 const s=state();const ticket={...s.tickets[0],id:'NEW'};const c={type:'receive',eventId:'event-1',ticket};assert.equal(run(s,c),null);assert.ok(run(s,c));assert.ok(run(s,{...c,eventId:'event-2'}));assert.equal(s.tickets.filter(t=>t.id==='NEW').length,1)
})
test('FIFO skips expired lots, spans lots, and deducts exactly once',()=>{
 const s=state();const c={type:'transition',id:'K101',status:'Cooking'};assert.equal(run(s,c),null)
 assert.equal(s.lots.find(l=>l.id==='LOT-00').quantity,0.5);assert.equal(s.lots.find(l=>l.id==='LOT-01').quantity,0);assert.ok(Math.abs(s.lots.find(l=>l.id==='LOT-02').quantity-1.2)<1e-9)
 const movements=structuredClone(s.movements);assert.ok(run(s,c));assert.deepEqual(s.movements,movements);assert.equal(s.alerts.filter(a=>a.ingredient==='fish').length,1)
})
test('insufficient second ingredient leaves ALL lots and ticket unchanged',()=>{
 const s=state();s.lots.find(l=>l.ingredient==='veg').quantity=0;const before=structuredClone(s.lots)
 assert.ok(run(s,{type:'transition',id:'K101',status:'Cooking'}));assert.deepEqual(s.lots,before);assert.equal(s.tickets[0].status,'Pending');assert.equal(s.movements.length,0)
})
test('duplicate BOM ingredients are aggregated before checking stock',()=>{
 const s=state();s.recipes[0].bom=[{ingredient:'fish',amount:0.4},{ingredient:'fish',amount:0.4}];assert.ok(run(s,{type:'transition',id:'K101',status:'Cooking'}));assert.equal(s.movements.length,0)
})
test('Ready requires Cooking and creates exactly one notification',()=>{
 const s=state();assert.ok(run(s,{type:'transition',id:'K101',status:'Ready'}));assert.equal(run(s,{type:'transition',id:'K101',status:'Cooking'}),null);assert.equal(run(s,{type:'transition',id:'K101',status:'Ready'}),null);assert.ok(run(s,{type:'transition',id:'K101',status:'Ready'}));assert.equal(s.notifications.filter(n=>n.ticket==='K101').length,1);assert.equal(s.tickets[0].finished,now)
})
test('notification retry retains identity and is scoped to the kitchen',()=>{
 const s=state();const id='ready-K104';assert.equal(run(s,{type:'notify',id,fail:true}),null);assert.equal(s.notifications[0].status,'failed');assert.equal(run(s,{type:'notify',id,fail:false}),null);assert.equal(s.notifications[0].attempts,2);assert.ok(run(s,{type:'notify',id,fail:false}));s.area='Bar';assert.ok(run(s,{type:'notify',id,fail:true}))
})
test('cancellation requires reason, only Pending, and no inventory movement',()=>{
 const s=state();assert.ok(run(s,{type:'cancel',id:'K101',reason:' '}));for(const id of ['K103','K104','K105'])assert.ok(run(s,{type:'cancel',id,reason:'Khách yêu cầu'}));assert.equal(run(s,{type:'cancel',id:'K101',reason:'Khách đổi ý'}),null);assert.equal(s.tickets[0].status,'Cancelled');assert.equal(s.movements.length,0)
})
test('unavailable dish blocks new orders but preserves previously accepted tickets',()=>{
 const s=state();assert.equal(run(s,{type:'availability',id:'salmon',status:'Temporarily unavailable',reason:'Chờ nhập'}),null);assert.ok(run(s,{type:'receive',eventId:'new',ticket:{...s.tickets[0],id:'NEW'}}));assert.equal(s.tickets[0].status,'Pending');assert.equal(run(s,{type:'transition',id:'K101',status:'Cooking'}),null)
})
test('manual alerts validate scope and preserve source, recipients workflow and audit',()=>{
 const s=state();assert.ok(run(s,{type:'alert',ingredient:'orange',level:'Out of stock',note:'Thiếu'}));assert.equal(run(s,{type:'alert',ingredient:'fish',level:'Running low',note:'Cần bổ sung 2kg'}),null);assert.equal(s.alerts[0].status,'Awaiting acknowledgment');assert.equal(run(s,{type:'acknowledge',id:s.alerts[0].id}),null);assert.equal(s.alerts[0].status,'Acknowledged');assert.ok(s.logs.every(l=>l.actor&&l.time===now&&l.area==='Hot kitchen'))
})
