/** EARLY CITY: independent top-down open-world prototype. No external dependencies. */
const $ = s => document.querySelector(s);
const canvas=$('#game'),ctx=canvas.getContext('2d'), keys=new Set();
const W={width:3600,height:2880,block:360,road:102};
const rand=(seed=>()=>((seed=(Math.imul(seed,1664525)+1013904223)|0)>>>0)/4294967296)(83245);
const blocks=[], parks=[], lamps=[], props=[];
const colors=['#324451','#314855','#40505a','#554c54','#384858','#424959','#4c534e'];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const road=(x,y)=>x%W.block<W.road||y%W.block<W.road;
for(let gx=0;gx<10;gx++)for(let gy=0;gy<8;gy++){
 const x=gx*W.block+W.road+17,y=gy*W.block+W.road+17,w=W.block-W.road-34;
 if((gx*3+gy*7)%11===0){parks.push({x,y,w,h:w});continue;}
 blocks.push({x,y,w,h:w,color:colors[Math.floor(rand()*colors.length)],floors:2+Math.floor(rand()*6),type:(gx+gy)%6===0?'shop':'apartments'});
}
for(let x=42;x<W.width;x+=180)for(let y=42;y<W.height;y+=180){if(road(x,y)) lamps.push({x,y});}
const worldCars=[], pedestrians=[];
let game,camera,last=0, elapsed=0, noticeUntil=0, heatTick=0, saveTick=0, spawnTick=0;
const GARAGES=[{x:235,y:155,name:'Starter Garage'},{x:2920,y:1840,name:'Eastside Auto'}];
const missions=[
 {name:'Welcome to Early City',desc:'Reach the city center marked on your map.',target:{x:1860,y:1110},kind:'travel',reward:250},
 {name:'First Wheels',desc:'Get into your red car and drive to the garage.',target:{x:2920,y:1840},kind:'drive',reward:650},
 {name:'Courier Shift',desc:'Deliver a package to the pier warehouse.',target:{x:680,y:2450},kind:'drive',reward:900},
 {name:'Night Run',desc:'Reach the northern checkpoint before the clock expires.',target:{x:3220,y:75},kind:'timed',time:95,reward:1400},
 {name:'City Explorer',desc:'Visit the west-side lookout.',target:{x:84,y:2200},kind:'travel',reward:1800},
 {name:'Southbound',desc:'Cross the city and reach the south service road on foot.',target:{x:1780,y:2720},kind:'travel',reward:500},
 {name:'Garage Appointment',desc:'Drive a car to Eastside Auto.',target:{x:2920,y:1840},kind:'drive',reward:850},
 {name:'The Long Way Home',desc:'Drive to your starter garage.',target:{x:235,y:155},kind:'drive',reward:1200},
 {name:'Midnight Errand',desc:'Reach the harbor checkpoint before the timer expires.',target:{x:1160,y:2550},kind:'timed',time:110,reward:1600}
];
function clear(x,y,r=12){if(x<r||y<r||x>W.width-r||y>W.height-r)return false;return !blocks.some(b=>x+r>b.x&&x-r<b.x+b.w&&y+r>b.y&&y-r<b.y+b.h);}
function toast(message,seconds=3){$('#toast').textContent=message;noticeUntil=elapsed+seconds;}
function makeCar(x,y,angle=0,color='#f2634f',npc=false){return {x,y,angle,color,npc,speed:0,health:100,occupied:false,trafficPhase:rand()*100, turnSeed:rand()};}
function addTraffic(){worldCars.length=0;for(let i=0;i<38;i++){const horizontal=i%2===0;let x,y,angle;
 if(horizontal){x=100+rand()*(W.width-200);y=Math.floor(rand()*8)*W.block+(i%4<2?28:74);angle=i%4<2?0:Math.PI;}
 else{x=Math.floor(rand()*10)*W.block+(i%4<2?28:74);y=100+rand()*(W.height-200);angle=i%4<2?Math.PI/2:-Math.PI/2;}
 worldCars.push(makeCar(x,y,angle,['#62a4bb','#dfae50','#94a6a1','#c57762','#e0ded6'][i%5],true));
 }}
function addPeople(){pedestrians.length=0;for(let i=0;i<75;i++){let x,y,attempt=0;do{x=25+rand()*(W.width-50);y=25+rand()*(W.height-50);attempt++;}while(!clear(x,y,9)&&attempt<100);if(clear(x,y,9))pedestrians.push({x,y,homeX:x,homeY:y,angle:rand()*6.28,pace:32+rand()*25,turn:rand()*5,coat:['#e3af82','#7db8aa','#ddd5c7','#96a1c7','#c97f8d'][i%5]});}}
function fresh(){const car=makeCar(235,155,0);game={player:{x:145,y:145,angle:0,stamina:100,health:100,inCar:false},car,owned:[car],carIndex:0,money:1200,wanted:0,missionIndex:0,missionStart:0,completed:0, distance:0, time:0, dayOffset:8*60, paused:false, showMap:false, showHelp:false, muted:false, events:[], trafficHits:0,missionsPassed:[]};camera={x:0,y:0};addTraffic();addPeople();showMission();toast('Welcome to Early City. Press H for controls.',5);}
function save(){try{localStorage.setItem('earlycity-save-v2',JSON.stringify({player:game.player,car:game.car,owned:game.owned,money:game.money,wanted:game.wanted,missionIndex:game.missionIndex,completed:game.completed,distance:game.distance,time:game.time,dayOffset:game.dayOffset,missionsPassed:game.missionsPassed}));toast('Progress saved',1.4);}catch(e){toast('Browser storage unavailable',2);}}
function load(){try{const data=JSON.parse(localStorage.getItem('earlycity-save-v2'));if(!data){toast('No save found');return;}fresh();for(const k of ['player','car','owned','money','wanted','missionIndex','completed','distance','time','dayOffset','missionsPassed'])if(data[k]!==undefined)game[k]=data[k];game.missionIndex=clamp(game.missionIndex,0,missions.length);game.missionStart=elapsed;showMission();toast('Save loaded');}catch(e){toast('Could not load save');}}
function showMission(){const m=missions[game.missionIndex];$('#mission').textContent=m?m.name+' · '+m.desc:'ALL JOBS COMPLETE · Free roam unlocked';$('#objective').textContent=m?`REWARD $${m.reward.toLocaleString()}`:'FREE ROAM';}
function interact(){if(game.paused||game.showMap||game.showHelp)return;const p=game.player;
 if(p.inCar){const c=game.car;const x=c.x+Math.cos(c.angle+Math.PI/2)*44,y=c.y+Math.sin(c.angle+Math.PI/2)*44;if(clear(x,y,11)){p.inCar=false;p.x=x;p.y=y;toast('Exited vehicle');}else toast('No room to exit');return;}
 let nearest=null,best=64;for(const c of game.owned.concat(worldCars)){const d=dist(p,c);if(d<best){best=d;nearest=c;}}
 if(nearest){game.car=nearest;p.inCar=true;p.x=nearest.x;p.y=nearest.y;nearest.occupied=true;toast(nearest.npc?'Vehicle entered':'Your vehicle entered');}else toast('Move closer to a vehicle');}
function initInput(){window.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();if(!e.repeat){if(e.code==='KeyE')interact();if(e.code==='KeyH')game.showHelp=!game.showHelp;if(e.code==='KeyM')game.showMap=!game.showMap;if(e.code==='Escape'){game.showHelp=false;game.showMap=false;game.paused=!game.paused;}if(e.code==='KeyP')game.paused=!game.paused;if(e.code==='F5'){e.preventDefault();save();}if(e.code==='F9'){e.preventDefault();load();}if(e.code==='KeyN')skipMission();if(e.code==='KeyG')garageAction();if(e.code==='KeyR'&&e.ctrlKey){e.preventDefault();fresh();}}keys.add(e.code)});window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>keys.clear());$('#pauseBtn').addEventListener('click',()=>game.paused=!game.paused);$('#mapBtn').addEventListener('click',()=>game.showMap=!game.showMap);$('#helpBtn').addEventListener('click',()=>game.showHelp=!game.showHelp);$('#saveBtn').addEventListener('click',save);}
function garageAction(){
 if(game.paused||game.showMap||game.showHelp)return;
 const location=GARAGES.find(g=>dist(game.player,g)<115);
 if(!location){toast('Visit a garage marker to use garage services');return;}
 if(!game.player.inCar){toast('Enter a car to repair it at a garage');return;}
 const damage=100-game.car.health;
 if(damage<1){toast('Vehicle already in perfect condition');return;}
 const cost=Math.ceil(damage*8);
 if(game.money<cost){toast('Garage repair costs $'+cost+' · insufficient cash');return;}
 game.money-=cost;game.car.health=100;toast(location.name+' · repaired for $'+cost,4);
}
function skipMission(){if(game.missionIndex<missions.length){game.missionIndex++;game.missionStart=elapsed;showMission();toast('Mission skipped (no reward)');}}
function resize(){const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.floor(innerWidth*dpr);canvas.height=Math.floor(innerHeight*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);}
function update(dt){elapsed+=dt;if(game.paused||game.showMap||game.showHelp)return;const p=game.player;game.time+=dt;
 const up=keys.has('KeyW')||keys.has('ArrowUp'),down=keys.has('KeyS')||keys.has('ArrowDown'),left=keys.has('KeyA')||keys.has('ArrowLeft'),right=keys.has('KeyD')||keys.has('ArrowRight');
 const dx=(right?1:0)-(left?1:0),dy=(down?1:0)-(up?1:0);let speed;
 if(p.inCar){const c=game.car,acc=(up?1:0)-(down?1:0);c.speed+=acc*(acc>0?330:480)*dt;c.speed*=Math.pow(acc?0.991:0.963,dt*60);c.speed=clamp(c.speed,-150,465);if(Math.abs(c.speed)>7)c.angle+=dx*2.05*dt*Math.sign(c.speed)*Math.min(1,Math.abs(c.speed)/80);const nx=c.x+Math.cos(c.angle)*c.speed*dt,ny=c.y+Math.sin(c.angle)*c.speed*dt;if(clear(nx,ny,19)){c.x=nx;c.y=ny;game.distance+=Math.abs(c.speed*dt);}else{if(Math.abs(c.speed)>100){c.health=clamp(c.health-9,0,100);game.wanted=clamp(game.wanted+.08,0,5);toast('Collision · Vehicle damaged');}c.speed*=-.12;}p.x=c.x;p.y=c.y;p.angle=c.angle;}
 else {const len=Math.hypot(dx,dy);const sprint=keys.has('ShiftLeft')||keys.has('ShiftRight');speed=sprint&&p.stamina>1?260:165;p.stamina=clamp(p.stamina+(sprint&&len?-23:15)*dt,0,100);if(len){const mx=dx/len*speed*dt,my=dy/len*speed*dt;if(clear(p.x+mx,p.y,11))p.x+=mx;if(clear(p.x,p.y+my,11))p.y+=my;p.angle=Math.atan2(dy,dx);game.distance+=Math.hypot(mx,my);}}
 for(const v of worldCars){if(v===game.car)continue;const vel=45+(v.turnSeed*50);const nx=v.x+Math.cos(v.angle)*vel*dt,ny=v.y+Math.sin(v.angle)*vel*dt;if(nx<23||nx>W.width-23||ny<23||ny>W.height-23){v.angle=(v.angle+Math.PI)%(Math.PI*2);}else if(clear(nx,ny,17)){v.x=nx;v.y=ny;}const dc=dist(v,game.car);if(p.inCar&&dc<32&&Math.abs(game.car.speed)>55&&elapsed-(v.hitAt||0)>2){game.car.speed*=.45;v.hitAt=elapsed;game.car.health=clamp(game.car.health-5,0,100);game.wanted=clamp(game.wanted+.4,0,5);game.trafficHits++;toast('Traffic collision · Wanted level increased');}}
 for(const npc of pedestrians){npc.turn-=dt;if(npc.turn<=0){npc.angle+=rand()*2.2-1.1;npc.turn=1+rand()*4;}const nx=npc.x+Math.cos(npc.angle)*npc.pace*dt,ny=npc.y+Math.sin(npc.angle)*npc.pace*dt;if(clear(nx,ny,10)){npc.x=nx;npc.y=ny;}else{npc.angle+=2.5;npc.turn=.6;}}
 const m=missions[game.missionIndex];if(m){const canFinish=m.kind==='drive'?p.inCar:true;if(dist(p,m.target)<72&&canFinish){game.money+=m.reward;game.completed++;game.missionsPassed.push({name:m.name,reward:m.reward,at:Math.round(game.time)});game.missionIndex++;game.missionStart=elapsed;showMission();toast('MISSION PASSED · +$'+m.reward.toLocaleString(),5);saveTick=0;}else if(m.kind==='timed'&&elapsed-game.missionStart>m.time){game.missionStart=elapsed;toast('Timer expired · Try again',4);}}
 if(game.wanted>0){heatTick+=dt;if(heatTick>16){heatTick=0;game.wanted=clamp(game.wanted-.15,0,5);}}
 camera.x+=(p.x-innerWidth/2-camera.x)*Math.min(1,dt*4);camera.y+=(p.y-innerHeight/2-camera.y)*Math.min(1,dt*4);
 saveTick+=dt;if(saveTick>90){saveTick=0;try{localStorage.setItem('earlycity-autosave-v2',JSON.stringify({player:p,car:game.car,money:game.money,missionIndex:game.missionIndex}));}catch{}}
}
function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h);}function circle(x,y,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
function drawCity(){rect(0,0,W.width,W.height,'#6f8773');
 for(let x=0;x<W.width;x+=W.block){rect(x,0,W.road,W.height,'#343d46');rect(x+7,0,4,W.height,'#64717a');rect(x+W.road-11,0,4,W.height,'#64717a');}
 for(let y=0;y<W.height;y+=W.block){rect(0,y,W.width,W.road,'#343d46');rect(0,y+7,W.width,4,'#64717a');rect(0,y+W.road-11,W.width,4,'#64717a');}
 ctx.setLineDash([22,24]);ctx.lineWidth=2;ctx.strokeStyle='#b5ad8b88';for(let x=0;x<W.width;x+=W.block){ctx.beginPath();ctx.moveTo(x+W.road/2,0);ctx.lineTo(x+W.road/2,W.height);ctx.stroke();}for(let y=0;y<W.height;y+=W.block){ctx.beginPath();ctx.moveTo(0,y+W.road/2);ctx.lineTo(W.width,y+W.road/2);ctx.stroke();}ctx.setLineDash([]);
 for(const b of blocks){rect(b.x+8,b.y+12,b.w,b.h,'#17242a66');rect(b.x,b.y,b.w,b.h,b.color);ctx.strokeStyle='#9aaeb04c';ctx.lineWidth=3;ctx.strokeRect(b.x+8,b.y+8,b.w-16,b.h-16);rect(b.x+15,b.y+18,b.w-30,7,'#202d34');for(let y=b.y+43;y<b.y+b.h-16;y+=39)for(let x=b.x+23;x<b.x+b.w-16;x+=39)rect(x,y,18,12,(x+y)%3?'#809ba066':'#c5b98d66');if(b.type==='shop'){rect(b.x+20,b.y+b.h-37,b.w-40,21,'#a67a44');ctx.fillStyle='#fff5c0';ctx.font='12px system-ui';ctx.fillText('CORNER STORE',b.x+31,b.y+b.h-21);}}
 for(const park of parks){rect(park.x,park.y,park.w,park.h,'#5e916f');for(let i=0;i<4;i++)for(let j=0;j<4;j++){const tx=park.x+28+i*55,ty=park.y+30+j*55;circle(tx+3,ty+4,19,'#284c3b55');circle(tx,ty,17,'#355f46');circle(tx-4,ty-5,11,'#47825c');}}
 for(const l of lamps){circle(l.x+2,l.y+3,5,'#19262b88');circle(l.x,l.y,3,'#cfb97f');}
}
function drawVehicle(c){ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.angle);rect(-26,-15,52,30,'#17202a');rect(-22,-13,44,26,c.color);rect(-5,-11,17,22,'#9db7c3');rect(-23,-18,11,4,'#15191a');rect(13,-18,10,4,'#15191a');rect(-23,14,11,4,'#15191a');rect(13,14,10,4,'#15191a');rect(23,-12,4,8,'#f3e9b4');rect(23,4,4,8,'#f3e9b4');rect(-27,-11,4,7,'#a22b2b');rect(-27,4,4,7,'#a22b2b');if(c.health<45)circle(-3,-2,8,'#181b1aa3');ctx.restore();}
function drawPerson(p,npc=false){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);circle(0,0,npc?8:10,'#dfb69a');rect(-6,-7,8,14,npc?p.coat:'#243b74');circle(5,0,2,'#1e2832');ctx.restore();}
function drawGarages(){for(const g of GARAGES){ctx.lineWidth=3;ctx.strokeStyle='#79d6eb';ctx.beginPath();ctx.arc(g.x,g.y,37,0,Math.PI*2);ctx.stroke();circle(g.x,g.y,6,'#79d6eb');ctx.fillStyle='#d8faff';ctx.font='bold 12px system-ui';ctx.textAlign='center';ctx.fillText('GARAGE [G]',g.x,g.y-46);ctx.textAlign='left';}}
function drawTarget(){const m=missions[game.missionIndex];if(!m)return;const r=33+Math.sin(elapsed*4)*4;ctx.lineWidth=5;ctx.strokeStyle='#f5d06b';ctx.beginPath();ctx.arc(m.target.x,m.target.y,r,0,Math.PI*2);ctx.stroke();circle(m.target.x,m.target.y,9,'#fff1a1');ctx.fillStyle='#fff2ba';ctx.font='bold 14px system-ui';ctx.textAlign='center';ctx.fillText('OBJECTIVE',m.target.x,m.target.y-47);ctx.textAlign='left';}
function minimap(x,y,size,big=false){const sx=size/W.width,sy=size/W.height;ctx.save();rect(x-5,y-5,size+10,size+10,'#0b1420e8');ctx.beginPath();ctx.rect(x,y,size,size);ctx.clip();rect(x,y,size,size,'#50705e');for(let gx=0;gx<W.width;gx+=W.block)rect(x+gx*sx,y,W.road*sx,size,'#313e4a');for(let gy=0;gy<W.height;gy+=W.block)rect(x,y+gy*sy,size,W.road*sy,'#313e4a');for(const p of parks)rect(x+p.x*sx,y+p.y*sy,p.w*sx,p.h*sy,'#428057');const m=missions[game.missionIndex];if(m)circle(x+m.target.x*sx,y+m.target.y*sy,big?8:4,'#ffce58');circle(x+game.player.x*sx,y+game.player.y*sy,big?7:4,'#ffffff');ctx.restore();}
function drawBigMap(){const c=$('#bigMap'),g=c.getContext('2d'),sx=c.width/W.width,sy=c.height/W.height;g.fillStyle='#52725e';g.fillRect(0,0,c.width,c.height);g.fillStyle='#33424d';for(let x=0;x<W.width;x+=W.block)g.fillRect(x*sx,0,W.road*sx,c.height);for(let y=0;y<W.height;y+=W.block)g.fillRect(0,y*sy,c.width,W.road*sy);g.fillStyle='#67a775';for(const p of parks)g.fillRect(p.x*sx,p.y*sy,p.w*sx,p.h*sy);const m=missions[game.missionIndex];if(m){g.fillStyle='#ffd15c';g.beginPath();g.arc(m.target.x*sx,m.target.y*sy,8,0,7);g.fill();}g.fillStyle='#fff';g.beginPath();g.arc(game.player.x*sx,game.player.y*sy,7,0,7);g.fill();}
function shade(){const minutes=(game.dayOffset+game.time*1.5)%1440;const h=minutes/60;const dark=h>19||h<6?0.34:h>17||h<8?.17:0;return{h,minutes,dark};}
function render(){ctx.clearRect(0,0,innerWidth,innerHeight);ctx.save();ctx.translate(-camera.x,-camera.y);drawCity();drawGarages();drawTarget();for(const p of pedestrians)if(Math.abs(p.x-game.player.x)<innerWidth&&Math.abs(p.y-game.player.y)<innerHeight)drawPerson(p,true);for(const c of worldCars)drawVehicle(c);if(!worldCars.includes(game.car))drawVehicle(game.car);if(!game.player.inCar)drawPerson(game.player);ctx.restore();const t=shade();if(t.dark)rect(0,0,innerWidth,innerHeight,`rgba(10,18,48,${t.dark})`);
 minimap(innerWidth-196,32,160);const clockH=String(Math.floor(t.minutes/60)).padStart(2,'0'),clockM=String(Math.floor(t.minutes%60)).padStart(2,'0');$('#clock').textContent=clockH+':'+clockM;$('#money').textContent='$'+Math.floor(game.money).toLocaleString();$('#status').textContent=game.player.inCar?`DRIVING · ${Math.round(Math.abs(game.car.speed)*.25)} KM/H`:'ON FOOT';$('#healthFill').style.width=game.player.health+'%';$('#staminaFill').style.width=game.player.stamina+'%';$('#vehicle').textContent=game.player.inCar?'VEHICLE '+Math.ceil(game.car.health)+'%':'NO VEHICLE';$('#garage').textContent=GARAGES.some(g=>dist(game.player,g)<115)?'GARAGE: G TO REPAIR':'GARAGE: FIND CYAN MARKER';$('#wanted').textContent=game.wanted>0.05?'★'.repeat(Math.ceil(game.wanted)):'NO WANTED LEVEL';const m=missions[game.missionIndex];$('#timer').textContent=m&&m.kind==='timed'?`TIME LEFT ${Math.max(0,Math.ceil(m.time-(elapsed-game.missionStart)))}s`:'';
 $('#toast').style.opacity=elapsed<noticeUntil?1:0;
 $('#overlay').hidden=!(game.paused||game.showMap||game.showHelp);if(game.showMap){$('#overlayTitle').textContent='CITY MAP';$('#overlayText').textContent='White: you · Yellow: next objective';drawBigMap();}else if(game.showHelp){$('#overlayTitle').textContent='CONTROLS';$('#overlayText').textContent='WASD / Arrows: move or drive   ·   Shift: sprint   ·   E: enter or exit vehicle   ·   M: map   ·   P / Esc: pause   ·   F5: save   ·   F9: load   ·   G: repair at garage ($8/damage)   ·   N: skip mission   ·   H: close help';}else if(game.paused){$('#overlayTitle').textContent='PAUSED';$('#overlayText').textContent='Press P or Escape to resume';}}
function tick(t){const dt=Math.min((t-last)/1000||.016,.05);last=t;update(dt);render();requestAnimationFrame(tick);}
fresh();initInput();window.addEventListener('resize',resize);resize();requestAnimationFrame(tick);
