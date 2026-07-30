"use strict";

/* ================= Data definitions ================= */
const GOALS = ['Get Stronger', 'Build Confidence', 'Become More Athletic', 'Improve for Dance / Soccer', 'Feel Like a Baddie'];
const WINS = ['Lifted heavier', 'Encouraged someone else', 'Did one more rep', 'Tried something new', "Didn't give up", 'Beat one of my records'];
const SCORE_ITEMS = ['I showed up.', "I didn't quit.", 'I worked hard.', 'I got stronger.', 'I encouraged someone.', 'I believed in myself.', 'I felt like a Baddie.'];
const PR_LABELS = ['Heaviest Goblet Squat', 'Longest Wall Sit', 'Longest Plank', 'Farmer Carry Weight', 'Biggest Win This Week'];
const FIELD_LABELS = {wt: 'Wt', reps: 'Reps', time: 'Time', dist: 'Dist'};

// Seed program (used to build the default editable plan)
const DAY_DEFS = [
  { title:'Day 1', subtitle:'Legs · Glutes · Core', roundsCount:3, scaleLabel:"Today's Energy",
    exercises:[{name:'Goblet Squat',fields:['wt','reps']},{name:'Step-Ups',fields:['wt','reps']},{name:'Reverse Lunges',fields:['wt','reps']},{name:'Kettlebell Deadlift',fields:['wt','reps']},{name:'Standing Calf Raises',fields:['wt','reps']},{name:'Farmer Carry',fields:['wt','dist']},{name:'Wall Sit',fields:['time']}],
    finisher:'15 Squats → 10-Second Hold → 15 Squats',
    reflectionFields:[{key:'easy',label:'What Was Easy?'},{key:'hard',label:'What Was Hard?'}] },
  { title:'Day 2', subtitle:'Upper Body · Core', roundsCount:3, scaleLabel:"Today's Confidence",
    exercises:[{name:'Single Arm Press',fields:['wt','reps']},{name:'Incline Push-Ups',fields:['reps']},{name:'Kettlebell Row',fields:['wt','reps']},{name:'Halo',fields:['wt','reps']},{name:'Hammer Curl',fields:['wt','reps']},{name:'Suitcase Carry',fields:['wt','dist']},{name:'Plank',fields:['time']}],
    finisher:null,
    reflectionFields:[{key:'proud',label:"Something I'm Proud Of Today"}] },
  { title:'Day 3', subtitle:'Athletic Conditioning', roundsCount:4, scaleLabel:"Today's Energy",
    exercises:[{name:'Kettlebell Swings',fields:['wt','reps']},{name:'Step-Ups',fields:['reps']},{name:'Skater Hops',fields:['reps']},{name:'Mountain Climbers',fields:['reps']},{name:'Bear Crawl',fields:['time']},{name:'Russian Twists',fields:['reps']},{name:'Jump Rope',fields:['time']}],
    finisher:null,
    reflectionFields:[{key:'proud',label:"Something I'm Proud Of Today"}] },
];

const BODY_PARTS = ['Legs','Glutes','Calves','Chest','Back','Shoulders','Arms','Core','Full Body','Cardio'];
const EQUIP = ['Bodyweight','Dumbbell','Kettlebell','Barbell','Band','Machine','Box','Jump Rope','Other'];

// Exercise library. f = default tracked fields.
const WR=['wt','reps'], RP=['reps'], TM=['time'], WD=['wt','dist'], DS=['dist'], TD=['time','dist'];
const LIBRARY = [
  {n:'Goblet Squat',b:'Legs',e:'Kettlebell',f:WR},{n:'Back Squat',b:'Legs',e:'Barbell',f:WR},{n:'Front Squat',b:'Legs',e:'Barbell',f:WR},{n:'Dumbbell Squat',b:'Legs',e:'Dumbbell',f:WR},{n:'Bodyweight Squat',b:'Legs',e:'Bodyweight',f:RP},{n:'Reverse Lunge',b:'Legs',e:'Dumbbell',f:WR},{n:'Forward Lunge',b:'Legs',e:'Dumbbell',f:WR},{n:'Walking Lunge',b:'Legs',e:'Dumbbell',f:WR},{n:'Bulgarian Split Squat',b:'Legs',e:'Dumbbell',f:WR},{n:'Step-Ups',b:'Legs',e:'Dumbbell',f:WR},{n:'Wall Sit',b:'Legs',e:'Bodyweight',f:TM},{n:'Leg Press',b:'Legs',e:'Machine',f:WR},{n:'Leg Extension',b:'Legs',e:'Machine',f:WR},{n:'Box Jump',b:'Legs',e:'Box',f:RP},{n:'Jump Squat',b:'Legs',e:'Bodyweight',f:RP},
  {n:'Kettlebell Deadlift',b:'Glutes',e:'Kettlebell',f:WR},{n:'Romanian Deadlift',b:'Glutes',e:'Barbell',f:WR},{n:'Dumbbell RDL',b:'Glutes',e:'Dumbbell',f:WR},{n:'Hip Thrust',b:'Glutes',e:'Barbell',f:WR},{n:'Glute Bridge',b:'Glutes',e:'Bodyweight',f:RP},{n:'Kettlebell Swing',b:'Glutes',e:'Kettlebell',f:WR},{n:'Good Morning',b:'Glutes',e:'Barbell',f:WR},{n:'Single-Leg RDL',b:'Glutes',e:'Dumbbell',f:WR},{n:'Curtsy Lunge',b:'Glutes',e:'Dumbbell',f:WR},{n:'Hamstring Curl',b:'Glutes',e:'Machine',f:WR},{n:'Donkey Kicks',b:'Glutes',e:'Bodyweight',f:RP},{n:'Fire Hydrants',b:'Glutes',e:'Bodyweight',f:RP},
  {n:'Standing Calf Raise',b:'Calves',e:'Dumbbell',f:WR},{n:'Seated Calf Raise',b:'Calves',e:'Machine',f:WR},
  {n:'Push-Up',b:'Chest',e:'Bodyweight',f:RP},{n:'Incline Push-Up',b:'Chest',e:'Bodyweight',f:RP},{n:'Knee Push-Up',b:'Chest',e:'Bodyweight',f:RP},{n:'Dumbbell Bench Press',b:'Chest',e:'Dumbbell',f:WR},{n:'Barbell Bench Press',b:'Chest',e:'Barbell',f:WR},{n:'Incline Dumbbell Press',b:'Chest',e:'Dumbbell',f:WR},{n:'Chest Fly',b:'Chest',e:'Dumbbell',f:WR},{n:'Cable Chest Fly',b:'Chest',e:'Machine',f:WR},
  {n:'Kettlebell Row',b:'Back',e:'Kettlebell',f:WR},{n:'Dumbbell Row',b:'Back',e:'Dumbbell',f:WR},{n:'Bent-Over Row',b:'Back',e:'Barbell',f:WR},{n:'Lat Pulldown',b:'Back',e:'Machine',f:WR},{n:'Pull-Up',b:'Back',e:'Bodyweight',f:RP},{n:'Assisted Pull-Up',b:'Back',e:'Machine',f:RP},{n:'Inverted Row',b:'Back',e:'Bodyweight',f:RP},{n:'Band Pull-Apart',b:'Back',e:'Band',f:RP},{n:'Superman',b:'Back',e:'Bodyweight',f:TM},{n:'Renegade Row',b:'Back',e:'Dumbbell',f:WR},
  {n:'Single Arm Press',b:'Shoulders',e:'Dumbbell',f:WR},{n:'Overhead Press',b:'Shoulders',e:'Dumbbell',f:WR},{n:'Arnold Press',b:'Shoulders',e:'Dumbbell',f:WR},{n:'Lateral Raise',b:'Shoulders',e:'Dumbbell',f:WR},{n:'Front Raise',b:'Shoulders',e:'Dumbbell',f:WR},{n:'Halo',b:'Shoulders',e:'Kettlebell',f:WR},{n:'Rear Delt Fly',b:'Shoulders',e:'Dumbbell',f:WR},{n:'Band Shoulder Press',b:'Shoulders',e:'Band',f:RP},{n:'Pike Push-Up',b:'Shoulders',e:'Bodyweight',f:RP},
  {n:'Hammer Curl',b:'Arms',e:'Dumbbell',f:WR},{n:'Bicep Curl',b:'Arms',e:'Dumbbell',f:WR},{n:'Concentration Curl',b:'Arms',e:'Dumbbell',f:WR},{n:'Band Curl',b:'Arms',e:'Band',f:RP},{n:'Tricep Extension',b:'Arms',e:'Dumbbell',f:WR},{n:'Overhead Tricep Extension',b:'Arms',e:'Dumbbell',f:WR},{n:'Tricep Dips',b:'Arms',e:'Bodyweight',f:RP},{n:'Skull Crushers',b:'Arms',e:'Dumbbell',f:WR},{n:'Tricep Kickback',b:'Arms',e:'Dumbbell',f:WR},
  {n:'Plank',b:'Core',e:'Bodyweight',f:TM},{n:'Side Plank',b:'Core',e:'Bodyweight',f:TM},{n:'Russian Twists',b:'Core',e:'Bodyweight',f:RP},{n:'Bicycle Crunches',b:'Core',e:'Bodyweight',f:RP},{n:'Sit-Ups',b:'Core',e:'Bodyweight',f:RP},{n:'Crunches',b:'Core',e:'Bodyweight',f:RP},{n:'Leg Raises',b:'Core',e:'Bodyweight',f:RP},{n:'Mountain Climbers',b:'Core',e:'Bodyweight',f:TM},{n:'Dead Bug',b:'Core',e:'Bodyweight',f:RP},{n:'Hollow Hold',b:'Core',e:'Bodyweight',f:TM},{n:'Flutter Kicks',b:'Core',e:'Bodyweight',f:TM},{n:'Bear Crawl',b:'Core',e:'Bodyweight',f:TM},{n:'Hanging Knee Raise',b:'Core',e:'Bodyweight',f:RP},{n:'V-Ups',b:'Core',e:'Bodyweight',f:RP},
  {n:'Burpees',b:'Full Body',e:'Bodyweight',f:RP},{n:'Thruster',b:'Full Body',e:'Dumbbell',f:WR},{n:'Clean and Press',b:'Full Body',e:'Kettlebell',f:WR},{n:'Turkish Get-Up',b:'Full Body',e:'Kettlebell',f:WR},{n:'Farmer Carry',b:'Full Body',e:'Dumbbell',f:WD},{n:'Suitcase Carry',b:'Full Body',e:'Dumbbell',f:WD},{n:'Devil Press',b:'Full Body',e:'Dumbbell',f:WR},{n:'Man Maker',b:'Full Body',e:'Dumbbell',f:WR},
  {n:'Jump Rope',b:'Cardio',e:'Jump Rope',f:TM},{n:'High Knees',b:'Cardio',e:'Bodyweight',f:TM},{n:'Skater Hops',b:'Cardio',e:'Bodyweight',f:RP},{n:'Jumping Jacks',b:'Cardio',e:'Bodyweight',f:TM},{n:'Run',b:'Cardio',e:'Bodyweight',f:TD},{n:'Walk',b:'Cardio',e:'Bodyweight',f:TD},{n:'Treadmill',b:'Cardio',e:'Machine',f:TD},{n:'Stair Machine',b:'Cardio',e:'Machine',f:TM},{n:'Rowing Machine',b:'Cardio',e:'Machine',f:TD},{n:'Stationary Bike',b:'Cardio',e:'Machine',f:TM},{n:'Battle Ropes',b:'Cardio',e:'Other',f:TM},{n:'Sled Push',b:'Cardio',e:'Other',f:DS},
];

const STORAGE_KEY = 'baddieJournalV3';
const ICONS = {
  home:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  workout:'<path d="M6.5 6.5l11 11"/><path d="M4 9l-1.5 1.5a2 2 0 0 0 0 3L5 16"/><path d="M20 15l1.5-1.5a2 2 0 0 0 0-3L19 8"/><path d="M8 5L6.5 3.5"/><path d="M17.5 20.5L16 19"/>',
  progress:'<path d="M4 19V5"/><path d="M4 19h16"/><path d="M7 15l4-5 3 3 5-7"/>',
  wins:'<path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v4a5 5 0 0 1-10 0V4z"/><path d="M17 5h3v2a3 3 0 0 1-3 3"/><path d="M7 5H4v2a3 3 0 0 0 3 3"/>',
  me:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
};
const CHECK='<svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 6"/></svg>';
const I_UP='<svg class="ic" viewBox="0 0 24 24"><path d="M6 15l6-6 6 6"/></svg>';
const I_DOWN='<svg class="ic" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>';
const I_SWAP='<svg class="ic" viewBox="0 0 24 24"><path d="M8 4v16M8 4L5 7M8 4l3 3M16 20V4M16 20l-3-3M16 20l3-3"/></svg>';
const I_TRASH='<svg class="ic" viewBox="0 0 24 24"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13h10l1-13"/></svg>';
const I_X='<svg class="ic" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>';
// Small inline line-icons used inside text (replace emoji)
const MINI={
  flame:'<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  drop:'<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5S12.5 5.5 12 3c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  trophy:'<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.7V17c0 .6-.5 1-1 1.2C7.8 18.8 7 20.2 7 22"/><path d="M14 14.7V17c0 .6.5 1 1 1.2 1.2.6 2 2 2 3.8"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>',
};
function mi(name,cls){ return '<svg class="mi'+(cls?' '+cls:'')+'" viewBox="0 0 24 24" aria-hidden="true">'+MINI[name]+'</svg>'; }
const ICON_PAUSE='<svg class="ic" viewBox="0 0 24 24"><path d="M8 5v14M16 5v14"/></svg>';
const ICON_PLAY='<svg class="ic" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8 5l12 7-12 7z"/></svg>';

/* ================= State model ================= */
function uid(p){ return (p||'x') + Math.random().toString(36).slice(2,7) + Date.now().toString(36).slice(-4); }

function seedPlan(){
  return { days: DAY_DEFS.map((d,di)=>({
    id:'d'+(di+1), name:d.title, focus:d.subtitle, rounds:d.roundsCount,
    scaleLabel:d.scaleLabel, finisher:d.finisher||'',
    reflectionFields:d.reflectionFields.map(r=>({...r})),
    exercises:d.exercises.map((e,ei)=>({id:'d'+(di+1)+'e'+(ei+1), name:e.name, fields:e.fields.slice()})),
  })) };
}
function freshActive(){ return {week:'',weight:'',water:0,wins:[],note:'',log:{},prs:['','','','',''],score:[],coachNotes:''}; }
function freshUI(){ return {edit:false,picker:null,fBody:'All',fEquip:'All',q:'',custom:false,customName:'',customFields:[]}; }
function freshState(){
  return { tab:'home', workoutDay:0, viewId:null, chartName:null, ui:freshUI(),
    profile:{name:'',goals:[],avatar:''}, plan:seedPlan(), active:freshActive(), history:[] };
}

// Convert an old positional week (days keyed day1.. + parallel scale/ratings/reflections) into id-keyed log.
function convToLog(daysPos, scaleObj, ratingsObj, reflObj, plan){
  const log={};
  plan.days.forEach((d,di)=>{
    const ok='day'+(di+1);
    log[d.id]={ rating:(ratingsObj&&ratingsObj[ok])||0, scale:(scaleObj&&scaleObj[ok])!=null?scaleObj[ok]:null, reflections:{...((reflObj&&reflObj[ok])||{})}, ex:{} };
    d.exercises.forEach((ex,ei)=>{
      const arr=(daysPos&&daysPos[ok]&&daysPos[ok][ei])||[];
      log[d.id].ex[ex.id]=arr.map(rd=>({...(rd||{})}));
    });
  });
  return log;
}

function loadState(){
  let v3=null; try{ v3=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null'); }catch(e){}
  if(v3){
    const s=freshState();
    s.profile={name:(v3.profile&&v3.profile.name)||'', goals:Array.isArray(v3.profile&&v3.profile.goals)?v3.profile.goals:[], avatar:(v3.profile&&v3.profile.avatar)||''};
    if(v3.plan&&Array.isArray(v3.plan.days)&&v3.plan.days.length) s.plan=v3.plan;
    s.active={...freshActive(), ...(v3.active||{})};
    s.active.log=(v3.active&&v3.active.log)||{};
    s.active.wins=Array.isArray(s.active.wins)?s.active.wins:[];
    s.active.score=Array.isArray(s.active.score)?s.active.score:[];
    s.active.prs=Array.isArray(s.active.prs)?s.active.prs.slice(0,5):['','','','',''];
    while(s.active.prs.length<5) s.active.prs.push('');
    s.history=Array.isArray(v3.history)?v3.history:[];
    s.tab=['home','workout','progress','wins','me'].includes(v3.tab)?v3.tab:'home';
    s.workoutDay=Number.isInteger(v3.workoutDay)?v3.workoutDay:0;
    s.chartName=v3.chartName||null;
    return s;
  }
  // Migrate from V2 (had active.days positional + separate scale/ratings/reflections, no plan)
  let v2=null; try{ v2=JSON.parse(localStorage.getItem('baddieJournalV2')||'null'); }catch(e){}
  if(v2){
    const s=freshState();
    s.profile={name:(v2.profile&&v2.profile.name)||'', goals:Array.isArray(v2.profile&&v2.profile.goals)?v2.profile.goals:[]};
    const av=v2.active||{};
    s.active=freshActive();
    s.active.week=av.week||''; s.active.weight=av.weight||''; s.active.water=av.water||0;
    s.active.wins=Array.isArray(av.wins)?av.wins:[]; s.active.note=av.note||'';
    s.active.prs=Array.isArray(av.prs)?av.prs.slice(0,5):s.active.prs; while(s.active.prs.length<5)s.active.prs.push('');
    s.active.score=Array.isArray(av.score)?av.score:[]; s.active.coachNotes=av.coachNotes||'';
    s.active.log=convToLog(av.days,av.scale,av.ratings,av.reflections,s.plan);
    s.history=(Array.isArray(v2.history)?v2.history:[]).map(h=>{
      const pl=seedPlan();
      return { id:h.id||uid('w'), archivedAt:h.archivedAt||null, week:h.week||'Week', name:h.name||s.profile.name, goals:Array.isArray(h.goals)?h.goals:[],
        plan:pl, log:convToLog(h.days,h.scale,h.ratings,h.reflections,pl),
        weight:h.weight||'', water:h.water||0, wins:Array.isArray(h.wins)?h.wins:[], note:h.note||'',
        prs:Array.isArray(h.prs)?h.prs:['','','','',''], score:Array.isArray(h.score)?h.score:[], coachNotes:h.coachNotes||'' };
    });
    return s;
  }
  return freshState();
}

let state = loadState();
let quotaWarned=false;
function persist(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); return true; }
  catch(e){
    if(!quotaWarned){ quotaWarned=true; alert('Storage for this app is full. Open Me → Export backup to save your data, then delete some old weeks in Progress to free space.'); }
    return false;
  }
}
function storageBytes(){ try{ return new Blob([localStorage.getItem(STORAGE_KEY)||'']).size; }catch(e){ return (localStorage.getItem(STORAGE_KEY)||'').length; } }

// Drop empty rounds/exercises/days so archived weeks stay small.
function compactLog(log, plan){
  const out={};
  plan.days.forEach(function(d){
    const dl=log[d.id]; if(!dl) return;
    const ex={};
    d.exercises.forEach(function(e){
      const arr=(dl.ex&&dl.ex[e.id])||[];
      const rounds=arr.map(function(rd){ if(!rd) return null; const o={}; let any=false; for(const k in rd){ if(String(rd[k]).trim()!==''){ o[k]=rd[k]; any=true; } } return any?o:null; });
      while(rounds.length && rounds[rounds.length-1]===null) rounds.pop();
      if(rounds.some(Boolean)) ex[e.id]=rounds;
    });
    const refl={}; if(dl.reflections) for(const k in dl.reflections) if(String(dl.reflections[k]).trim()!=='') refl[k]=dl.reflections[k];
    if((dl.rating>0)||(dl.scale!=null)||Object.keys(ex).length||Object.keys(refl).length||dl.done||dl.duration)
      out[d.id]={rating:dl.rating||0, scale:dl.scale!=null?dl.scale:null, reflections:refl, ex:ex, done:!!dl.done, duration:dl.duration||0};
  });
  return out;
}

function exportData(){
  try{
    const blob=new Blob([JSON.stringify(state)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url; a.download='baddie-journal-backup-'+todayLabel().replace(/[^0-9a-z]+/gi,'-').toLowerCase()+'.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){ URL.revokeObjectURL(url); }, 1500);
  }catch(e){ alert('Could not create the backup file.'); }
}
function importData(file){
  const r=new FileReader();
  r.onload=function(e){
    let data; try{ data=JSON.parse(e.target.result); }catch(err){ alert('That file is not a valid backup.'); return; }
    if(!data||typeof data!=='object'||!data.plan){ alert('That file is not a valid Baddie Journal backup.'); return; }
    if(!confirm('Import this backup? It will REPLACE all current data on this device.')) return;
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }catch(err){ alert('Not enough space to import that backup.'); return; }
    state=loadState(); state.tab='me'; render();
    alert('Backup imported successfully.');
  };
  r.readAsText(file);
}

// Read an image file, center-crop + downscale to a small square, store as data URL.
function loadAvatar(file){
  if(!file || !/^image\//.test(file.type)){ alert('Please choose an image file.'); return; }
  const reader=new FileReader();
  reader.onload=function(e){
    const img=new Image();
    img.onload=function(){
      const S=256, c=document.createElement('canvas'); c.width=S; c.height=S;
      const ctx=c.getContext('2d');
      const scale=Math.max(S/img.width, S/img.height);
      const w=img.width*scale, h=img.height*scale;
      ctx.drawImage(img,(S-w)/2,(S-h)/2,w,h);
      let data; try{ data=c.toDataURL('image/jpeg',0.85); }catch(err){ data=e.target.result; }
      state.profile.avatar=data;
      if(!persist()){ state.profile.avatar=''; render(); return; }
      render();
    };
    img.onerror=function(){ alert('Could not read that image.'); };
    img.src=e.target.result;
  };
  reader.readAsDataURL(file);
}

/* ================= Plan mutators ================= */
function findDay(id){ return state.plan.days.find(d=>d.id===id); }
function addExercise(dayId,name,fields){ const d=findDay(dayId); if(d) d.exercises.push({id:uid('e'),name,fields:fields.slice()}); }
function replaceExercise(dayId,exId,name,fields){ const d=findDay(dayId); const ex=d&&d.exercises.find(e=>e.id===exId); if(ex){ ex.name=name; ex.fields=fields.slice(); } }
function moveEx(dayId,exId,dir){ const d=findDay(dayId); if(!d)return; const i=d.exercises.findIndex(e=>e.id===exId); const j=i+dir; if(i<0||j<0||j>=d.exercises.length)return; const a=d.exercises; const tmp=a[i]; a[i]=a[j]; a[j]=tmp; }
function exHasData(dayId,exId){ const dl=state.active.log[dayId]; if(!dl||!dl.ex||!dl.ex[exId])return false; return dl.ex[exId].some(rd=>rd&&Object.keys(rd).some(k=>String(rd[k]).trim()!=='')); }
// Duplicate a day's plan (exercises get fresh ids, empty log) so a workout can be repeated.
function duplicateDay(dayId){
  const i=state.plan.days.findIndex(d=>d.id===dayId); if(i<0)return;
  const s=state.plan.days[i];
  const copy={ id:uid('d'), name:s.name+' (copy)', focus:s.focus, rounds:s.rounds, scaleLabel:s.scaleLabel, finisher:s.finisher,
    reflectionFields:s.reflectionFields.map(r=>({...r})), exercises:s.exercises.map(e=>({id:uid('e'),name:e.name,fields:e.fields.slice()})) };
  state.plan.days.splice(i+1,0,copy);
  state.workoutDay=i+1;
}
// Reorder a whole day left/right in the plan (dir -1 = earlier, +1 = later).
function moveDay(dayId,dir){
  const days=state.plan.days, i=days.findIndex(d=>d.id===dayId), j=i+dir;
  if(i<0||j<0||j>=days.length) return;
  const tmp=days[i]; days[i]=days[j]; days[j]=tmp;
  state.workoutDay=j;
}

/* ================= Log accessors ================= */
function dayLog(log,dayId){ if(!log[dayId]) log[dayId]={rating:0,scale:null,reflections:{},ex:{}}; return log[dayId]; }
function setCell(dayId,exId,ri,fk,v){ const dl=dayLog(state.active.log,dayId); if(!dl.ex[exId])dl.ex[exId]=[]; if(!dl.ex[exId][ri])dl.ex[exId][ri]={}; dl.ex[exId][ri][fk]=v; }

/* ================= Metrics (operate on a week view {plan,log,...meta}) ================= */
function num(v){ if(v==null)return null; const n=parseFloat(String(v).replace(/[^0-9.\-]/g,'')); return isNaN(n)?null:n; }
function activeView(){ const a=state.active; return {plan:state.plan, log:a.log, wins:a.wins, score:a.score, note:a.note, coachNotes:a.coachNotes, weight:a.weight, water:a.water, week:a.week, prs:a.prs, name:state.profile.name, goals:state.profile.goals}; }
function dayHasData(w,dayId){
  const dl=w.log[dayId]; if(!dl)return false;
  if(dl.done)return true;
  if(dl.rating>0)return true; if(dl.scale!=null)return true;
  if(dl.ex){ for(const k in dl.ex){ for(const rd of dl.ex[k]||[]){ if(rd) for(const f in rd) if(String(rd[f]).trim()!=='')return true; } } }
  if(dl.reflections){ for(const k in dl.reflections) if(String(dl.reflections[k]).trim()!=='')return true; }
  return false;
}
function workoutsDone(w){ return w.plan.days.filter(d=>dayHasData(w,d.id)).length; }
function avgRating(w){ const rs=w.plan.days.filter(d=>dayHasData(w,d.id)).map(d=>(w.log[d.id]&&w.log[d.id].rating)||0).filter(r=>r>0); return rs.length?rs.reduce((a,b)=>a+b,0)/rs.length:null; }
function topSetByName(w,name){ let best=null; for(const d of w.plan.days){ for(const ex of d.exercises){ if(ex.name===name&&ex.fields.includes('wt')){ const arr=(w.log[d.id]&&w.log[d.id].ex[ex.id])||[]; for(const rd of arr){ const n=num(rd&&rd.wt); if(n!=null&&(best==null||n>best))best=n; } } } } return best; }
function hasActivity(w){ return workoutsDone(w)>0||(w.wins&&w.wins.length)||(w.score&&w.score.length)||String(w.note||'').trim()!==''||String(w.coachNotes||'').trim()!==''; }
function weightedNames(){ const set=new Set(); const add=pl=>pl&&pl.days&&pl.days.forEach(d=>d.exercises.forEach(e=>{ if(e.fields.includes('wt'))set.add(e.name); })); add(state.plan); state.history.forEach(h=>add(h.plan)); return [...set]; }
function timeline(includeCurrent){
  const arr=state.history.slice().reverse().map(h=>({w:h,label:h.week||'Wk'}));
  if(includeCurrent){ const av=activeView(); if(hasActivity(av)) arr.push({w:av,label:av.week||'Now',current:true}); }
  return arr;
}

/* ================= Small helpers ================= */
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
const el=document.getElementById.bind(document);
function monthDay(d){ return d.toLocaleDateString('en-US',{month:'short',day:'numeric'}); }
function todayLabel(){ return monthDay(new Date()); }
function startOfWeek(d){ const x=new Date(d); x.setDate(x.getDate()-x.getDay()); x.setHours(0,0,0,0); return x; } // week starts Sunday
function currentWeekLabel(){ return monthDay(startOfWeek(new Date())); }
function firstName(){ const n=(state.profile.name||'').trim(); return n?n.split(/\s+/)[0]:''; }

/* ================= Charts ================= */
function lineChart(series, opts){
  opts=opts||{};
  const pts=series.map(s=>({x:s.x,y:s.y})).filter(p=>p.y!=null&&!isNaN(p.y));
  if(pts.length<2) return '<div class="empty">Log &amp; finish at least two weeks to see this trend.</div>';
  const w=320,h=opts.height||130,padX=14,padTop=16,padBot=24;
  const ys=pts.map(p=>p.y); let mn=Math.min(...ys),mx=Math.max(...ys); if(mn===mx){mn-=1;mx+=1;} const span=mx-mn||1;
  const nx=pts.length;
  const X=i=>padX+(nx===1?(w-2*padX)/2:i*(w-2*padX)/(nx-1));
  const Y=v=>padTop+(1-(v-mn)/span)*(h-padTop-padBot);
  const every=Math.ceil(nx/6);
  const line=pts.map((p,i)=>X(i).toFixed(1)+','+Y(p.y).toFixed(1)).join(' ');
  const area=X(0).toFixed(1)+','+(h-padBot)+' '+line+' '+X(nx-1).toFixed(1)+','+(h-padBot);
  const dots=pts.map((p,i)=>'<circle cx="'+X(i).toFixed(1)+'" cy="'+Y(p.y).toFixed(1)+'" r="'+(i===nx-1?4:3)+'"/>').join('');
  const xl=pts.map((p,i)=>(i%every===0||i===nx-1)?'<text class="cx" x="'+X(i).toFixed(1)+'" y="'+(h-6)+'" text-anchor="middle">'+esc(p.x)+'</text>':'').join('');
  const last=pts[nx-1];
  const vl='<text class="cv" x="'+X(nx-1).toFixed(1)+'" y="'+(Y(last.y)-9).toFixed(1)+'" text-anchor="end">'+esc(opts.fmt?opts.fmt(last.y):last.y)+'</text>';
  return '<svg class="chart" viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="xMidYMid meet"><line class="grid" x1="'+padX+'" y1="'+(h-padBot)+'" x2="'+(w-padX)+'" y2="'+(h-padBot)+'"/><polygon points="'+area+'" fill="url(#chartGrad)"/><polyline points="'+line+'" fill="none" stroke="var(--red)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'+dots+xl+vl+'</svg>';
}

/* ================= Screens ================= */
function greeting(){
  const hr=new Date().getHours();
  const part=hr<12?'Good morning':hr<18?'Good afternoon':'Good evening';
  const n=firstName();
  return '<div class="kicker">'+esc(part)+'</div><h1 class="h1 hdr">'+(n?"Let's go, "+esc(n):"Let's go, Baddie")+'</h1>';
}

function screenHome(){
  const a=state.active, av=activeView(), plan=state.plan;
  const done=workoutsDone(av);
  const streak=(function(){let s=0;const t=timeline(true);for(let i=t.length-1;i>=0;i--){if(workoutsDone(t[i].w)>0)s++;else break;}return s;})();
  const drops=Array.from({length:8},(_,i)=>'<div class="drop'+(i<a.water?' on':'')+'" data-act="water" data-i="'+i+'"></div>').join('');
  const goalChips=state.profile.goals.length? state.profile.goals.map(g=>'<div class="chip on">'+esc(g)+'</div>').join('') : '<div class="sub">No goals set yet — add them on the <b class="spark">Me</b> tab.</div>';
  const segs=plan.days.map((d,i)=>{const dn=state.active.log[d.id]&&state.active.log[d.id].done;return '<div class="seg'+(state.workoutDay===i?' on':'')+(dn?' done':'')+'" data-act="day" data-i="'+i+'">'+esc(d.name)+(dn?'<span class="segchk">'+CHECK+'</span>':'')+'<span class="sd">'+esc((d.focus||'').split(' · ')[0])+'</span></div>';}).join('');
  return greeting()
    +'<div class="sub mb">'+(a.week?'Week of '+esc(a.week):todayLabel())+' · Bertram Baddies</div>'
    +'<div class="stats mt-s">'
    +'<div class="stat accent"><div class="num">'+done+'<small>/'+plan.days.length+'</small></div><div class="cap">Workouts this week</div></div>'
    +'<div class="stat"><div class="num">'+streak+'</div><div class="cap">Week streak'+mi('flame','red')+'</div></div>'
    +'<div class="stat"><div class="num">'+a.water+'<small>/8</small></div><div class="cap">Water today'+mi('drop','red')+'</div></div>'
    +'<div class="stat"><div class="num">'+state.history.length+'</div><div class="cap">Weeks logged</div></div>'
    +'</div>'
    +'<div class="mt"><div class="seclbl">Start a workout</div><div class="segwrap"><div class="segment">'+(segs||'<div class="seg">No days</div>')+'</div></div>'
    +'<button class="btn" data-act="gotoworkout">Open '+(plan.days[state.workoutDay]?esc(plan.days[state.workoutDay].name):'Workout')+' →</button></div>'
    +'<div class="mt"><div class="seclbl">Water — 8 glasses'+mi('drop','red')+'</div><div class="card"><div class="drops">'+drops+'</div></div></div>'
    +'<div class="mt"><div class="seclbl">My goals</div><div class="chips">'+goalChips+'</div></div>';
}

function logDay(day){
  const dl=state.active.log[day.id]||{};
  const scaleNums=day.scaleLabel.includes('Confidence')?[1,2,3,4,5]:[6,7,8,9,10];
  const exs=day.exercises.length? day.exercises.map(ex=>{
    const rounds=Array.from({length:day.rounds},(_,ri)=>{
      const cells=ex.fields.map(fk=>{
        const v=(dl.ex&&dl.ex[ex.id]&&dl.ex[ex.id][ri]&&dl.ex[ex.id][ri][fk])||'';
        return '<input class="cell" inputmode="decimal" placeholder="'+esc(FIELD_LABELS[fk])+'" data-cell data-day="'+day.id+'" data-ex="'+ex.id+'" data-round="'+ri+'" data-fk="'+fk+'" value="'+esc(v)+'">';
      }).join('');
      return '<div class="round"><div class="rlabel">R'+(ri+1)+'</div>'+cells+'</div>';
    }).join('');
    return '<div class="excard"><div class="exname"><span class="dot"></span>'+esc(ex.name)+'</div><div class="rounds">'+rounds+'</div></div>';
  }).join('') : '<div class="empty">No exercises yet. Tap ✎ Edit to add some.</div>';
  const finisher=day.finisher?'<div class="finisher"><div class="fl">'+mi('flame')+' Finisher</div><div class="ft">'+esc(day.finisher)+'</div></div>':'';
  const scale=scaleNums.map(n=>'<div class="sbtn'+(dl.scale===n?' on':'')+'" data-act="scale" data-day="'+day.id+'" data-n="'+n+'">'+n+'</div>').join('');
  const rating=dl.rating||0;
  const stars=[1,2,3,4,5].map(n=>'<div class="star'+(n<=rating?' on':'')+'" data-act="rating" data-day="'+day.id+'" data-n="'+n+'">★</div>').join('');
  const refl=day.reflectionFields.map(rf=>{const v=(dl.reflections&&dl.reflections[rf.key])||'';return '<div class="mt-s"><div class="reflabel">'+esc(rf.label)+'</div><textarea class="ta sm" rows="2" data-refl data-day="'+day.id+'" data-refkey="'+rf.key+'">'+esc(v)+'</textarea></div>';}).join('');
  const restLauncher='<div class="card restcard"><div class="restlbl">Rest timer</div><div class="restpresets">'
    +[30,45,60,90,120].map(function(s){return '<button class="restchip" data-act="rest" data-sec="'+s+'">'+restLabel(s)+'</button>';}).join('')
    +'</div></div>';

  // Workout stopwatch card
  let woCard;
  if(wo.running)
    woCard='<div class="card wocard"><div class="woleft"><div class="wolbl">Workout · running</div><div class="wotime">'+fmtWO(woElapsed())+'</div></div><button class="tbtn" data-act="wopause">Pause</button><button class="tbtn stop" data-act="wostop">Stop</button></div>';
  else if(wo.elapsedMs>0)
    woCard='<div class="card wocard"><div class="woleft"><div class="wolbl">Workout · paused</div><div class="wotime">'+fmtWO(woElapsed())+'</div></div><button class="tbtn go" data-act="wostart">Resume</button><button class="tbtn stop" data-act="wostop">Stop</button></div>';
  else
    woCard='<div class="card wocard"><div class="woleft"><div class="wolbl">Workout timer</div>'+(dl.duration?'<div class="wolast">Last session: '+fmtWO(dl.duration*1000)+'</div>':'<div class="wolast">Track your session time</div>')+'</div><button class="tbtn go" data-act="wostart">Start workout</button></div>';

  const done=dl.done;
  const completeBlock=done
    ? '<button class="btn done-btn mt" data-act="toggledone" data-day="'+day.id+'"><span class="ic-check">'+CHECK+'</span> Workout complete — tap to undo</button>'
    : '<button class="btn ghost mt" data-act="toggledone" data-day="'+day.id+'">Mark workout complete</button>';

  return woCard+restLauncher+'<div class="exlist mt-s">'+exs+'</div>'+finisher
    +'<div class="mt"><div class="seclbl">'+esc(day.scaleLabel)+'</div><div class="scalerow">'+scale+'</div></div>'
    +'<div class="mt"><div class="seclbl">Workout Rating</div><div class="stars">'+stars+'</div></div>'
    +'<div class="mt">'+refl+'</div>'+completeBlock;
}

function editDay(day){
  const conf=day.scaleLabel.includes('Confidence');
  const idx=state.plan.days.findIndex(d=>d.id===day.id), ndays=state.plan.days.length;
  const exs=day.exercises.map((ex,i)=>'<div class="excard editrow"><div class="exname"><span class="dot"></span><span>'+esc(ex.name)+'</span><span class="extag">'+ex.fields.map(f=>esc(FIELD_LABELS[f])).join(' · ')+'</span></div><div class="exctrl">'
    +'<button class="iconbtn" data-act="exup" data-day="'+day.id+'" data-ex="'+ex.id+'"'+(i===0?' disabled':'')+'>'+I_UP+'</button>'
    +'<button class="iconbtn" data-act="exdown" data-day="'+day.id+'" data-ex="'+ex.id+'"'+(i===day.exercises.length-1?' disabled':'')+'>'+I_DOWN+'</button>'
    +'<button class="iconbtn" data-act="exswap" data-day="'+day.id+'" data-ex="'+ex.id+'">'+I_SWAP+'</button>'
    +'<button class="iconbtn danger" data-act="exdel" data-day="'+day.id+'" data-ex="'+ex.id+'">'+I_TRASH+'</button>'
    +'</div></div>').join('');
  return '<div class="card daymeta">'
    +'<div class="row"><div class="field" style="flex:2"><div class="cap">Day name</div><input class="input sm" data-dfield="name" data-dayid="'+day.id+'" value="'+esc(day.name)+'"></div>'
    +'<div class="field"><div class="cap">Rounds</div><div class="stepper"><button class="stepbtn" data-act="roundsdec" data-dayid="'+day.id+'">−</button><div class="stepval">'+day.rounds+'</div><button class="stepbtn" data-act="roundsinc" data-dayid="'+day.id+'">＋</button></div></div></div>'
    +'<div class="field mt-s"><div class="cap">Focus</div><input class="input sm" data-dfield="focus" data-dayid="'+day.id+'" value="'+esc(day.focus||'')+'" placeholder="e.g. Legs · Glutes"></div>'
    +'<div class="field mt-s"><div class="cap">Rating scale</div><div class="segment sm"><div class="seg'+(!conf?' on':'')+'" data-act="scaletype" data-dayid="'+day.id+'" data-t="energy">Energy</div><div class="seg'+(conf?' on':'')+'" data-act="scaletype" data-dayid="'+day.id+'" data-t="confidence">Confidence</div></div></div>'
    +'<div class="field mt-s"><div class="cap">Finisher (optional)</div><input class="input sm" data-dfield="finisher" data-dayid="'+day.id+'" value="'+esc(day.finisher||'')+'" placeholder="e.g. 15 squats → hold → 15"></div>'
    +'<div class="field mt-s"><div class="cap">Move day ('+(idx+1)+' of '+ndays+')</div><div class="moverow">'
    +'<button class="btn ghost sm" data-act="dayleft" data-dayid="'+day.id+'"'+(idx===0?' disabled':'')+'>← Move left</button>'
    +'<button class="btn ghost sm" data-act="dayright" data-dayid="'+day.id+'"'+(idx===ndays-1?' disabled':'')+'>Move right →</button>'
    +'</div></div>'
    +'<button class="btn ghost sm mt-s" data-act="dupday" data-dayid="'+day.id+'">Duplicate this day</button>'
    +'<button class="btn danger-ghost sm mt-s" data-act="delday" data-dayid="'+day.id+'">Delete this day</button></div>'
    +'<div class="seclbl mt">Exercises</div><div class="exlist">'+(exs||'<div class="empty">No exercises yet.</div>')+'</div>'
    +'<button class="btn ghost mt-s" data-act="addex" data-day="'+day.id+'">＋ Add exercise</button>'
    +'<button class="btn ghost mt-s" data-act="addday">＋ Add another day</button>';
}

function screenWorkout(){
  const plan=state.plan, edit=state.ui.edit;
  if(state.workoutDay>=plan.days.length) state.workoutDay=Math.max(0,plan.days.length-1);
  const segs=plan.days.map((d,i)=>{const dn=state.active.log[d.id]&&state.active.log[d.id].done;return '<div class="seg'+(state.workoutDay===i?' on':'')+(dn?' done':'')+'" data-act="day" data-i="'+i+'">'+esc(d.name)+(dn?'<span class="segchk">'+CHECK+'</span>':'')+'<span class="sd">'+esc((d.focus||'').split(' · ')[0])+'</span></div>';}).join('')+(edit?'<div class="seg add" data-act="addday">＋</div>':'');
  const day=plan.days[state.workoutDay];
  let body;
  if(!day) body='<div class="empty">No workout days yet.<br>Tap <b class="spark">Edit</b> then ＋ to add one.</div>';
  else body=edit?editDay(day):logDay(day);
  return '<div class="wkhead"><div><div class="kicker">'+(edit?'Editing plan':"Today's Workout")+'</div><h1 class="h1 hdr">'+(day?esc(day.name):'Workout')+'</h1></div>'
    +'<button class="editpill'+(edit?' on':'')+'" data-act="toggleedit">'+(edit?'✓ Done':'✎ Edit')+'</button></div>'
    +(day&&!edit?'<div class="sub mb">'+esc(day.focus||'')+'</div>':'')
    +'<div class="segwrap"><div class="segment">'+segs+'</div></div>'+body;
}

function screenProgress(){
  if(state.viewId) return screenWeekDetail(state.viewId);
  const t=timeline(true);
  const totalWorkouts=timeline(false).reduce((a,x)=>a+workoutsDone(x.w),0)+workoutsDone(activeView());
  const streak=(function(){let s=0;for(let i=t.length-1;i>=0;i--){if(workoutsDone(t[i].w)>0)s++;else break;}return s;})();
  const ratings=timeline(false).map(x=>avgRating(x.w)).filter(v=>v!=null);
  const avgAll=ratings.length?(ratings.reduce((a,b)=>a+b,0)/ratings.length):null;
  const names=weightedNames();
  if(!names.includes(state.chartName)) state.chartName=names[0]||null;
  const ratingSeries=t.map(x=>({x:x.label,y:avgRating(x.w)}));
  const bwSeries=t.map(x=>({x:x.label,y:num(x.w.weight)}));
  const topSeries=t.map(x=>({x:x.label,y:state.chartName?topSetByName(x.w,state.chartName):null}));
  const options=names.length?names.map(n=>'<option value="'+esc(n)+'"'+(n===state.chartName?' selected':'')+'>'+esc(n)+'</option>').join(''):'<option>No weighted exercises</option>';
  const hist=state.history.length? state.history.map(w=>{
    const dt=w.archivedAt?monthDay(new Date(w.archivedAt)):''; const ar=avgRating(w); const wd=workoutsDone(w);
    const rtxt=ar!=null?'★ '+ar.toFixed(1):wd+' workout'+(wd===1?'':'s');
    return '<div class="hcard" data-act="viewweek" data-id="'+esc(w.id)+'"><div class="hl"><div class="hw">'+esc(w.week||'Week')+'</div><div class="hd">'+wd+' workout'+(wd===1?'':'s')+(dt?' · saved '+esc(dt):'')+'</div></div><div class="hr">'+esc(rtxt)+'</div><svg class="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 6l6 6-6 6"/></svg></div>';
  }).join('') : '<div class="empty">No past weeks yet.<br>Finish your current week on the <b class="spark">Me</b> tab to save it here.</div>';
  return '<div class="kicker">Track your progress</div><h1 class="h1 hdr">Progress</h1><div class="sub mb">See how strong you’re getting</div>'
    +'<div class="stats mt-s">'
    +'<div class="stat accent"><div class="num">'+state.history.length+'</div><div class="cap">Weeks completed</div></div>'
    +'<div class="stat"><div class="num">'+totalWorkouts+'</div><div class="cap">Total workouts</div></div>'
    +'<div class="stat"><div class="num">'+streak+'</div><div class="cap">Week streak'+mi('flame','red')+'</div></div>'
    +'<div class="stat"><div class="num">'+(avgAll!=null?avgAll.toFixed(1):'—')+'</div><div class="cap">Avg rating ★</div></div></div>'
    +'<div class="card pad-lg mt"><div class="charthead"><div class="seclbl" style="margin:0;">Top set — weight</div></div><select class="selex" data-act="chartsel">'+options+'</select>'+lineChart(topSeries,{fmt:v=>v+' lb'})+'</div>'
    +'<div class="card pad-lg mt"><div class="charthead"><div class="seclbl" style="margin:0;">Workout rating</div></div>'+lineChart(ratingSeries,{fmt:v=>'★'+v.toFixed(1)})+'</div>'
    +'<div class="card pad-lg mt"><div class="charthead"><div class="seclbl" style="margin:0;">Bodyweight</div></div>'+lineChart(bwSeries,{fmt:v=>v+' lb'})+'</div>'
    +'<div class="mt"><div class="seclbl">Past weeks</div><div class="hlist">'+hist+'</div></div>';
}

function screenWeekDetail(id){
  const w=state.history.find(x=>x.id===id);
  if(!w){ state.viewId=null; return screenProgress(); }
  const dt=w.archivedAt?monthDay(new Date(w.archivedAt)):'';
  const days=w.plan.days.map(day=>{
    if(!dayHasData(w,day.id)) return '';
    const dl=w.log[day.id]||{};
    const rows=day.exercises.map(ex=>{
      const sets=((dl.ex&&dl.ex[ex.id])||[]).map((rd,ri)=>{
        const parts=ex.fields.map(fk=>{const v=rd&&rd[fk];return (v!=null&&String(v).trim()!=='')?FIELD_LABELS[fk]+' '+esc(v):null;}).filter(Boolean);
        return parts.length?'R'+(ri+1)+': '+parts.join(' · '):null;
      }).filter(Boolean);
      return sets.length?'<div class="rocell"><div class="k">'+esc(ex.name)+'</div><div class="v" style="font-size:12px;font-weight:600;line-height:1.5;">'+sets.join('<br>')+'</div></div>':'';
    }).filter(Boolean).join('');
    const rating=dl.rating||0;
    const refl=day.reflectionFields.map(rf=>{const v=dl.reflections&&dl.reflections[rf.key];return (v&&String(v).trim())?'<div class="romini" style="margin-top:8px;"><b>'+esc(rf.label)+'</b> '+esc(v)+'</div>':'';}).join('');
    return '<div class="ro"><div class="rot">'+esc(day.name)+(day.focus?' — '+esc(day.focus):'')+(dl.done?' <span class="donebadge">Completed</span>':'')+'</div><div class="ros">'+'★'.repeat(rating)+'☆'.repeat(5-rating)+(dl.scale!=null?' · '+day.scaleLabel.replace("Today's ","")+' '+dl.scale:'')+(dl.duration?' · '+fmtWO(dl.duration*1000):'')+'</div><div class="rogrid">'+(rows||'<div class="romini">No sets logged.</div>')+'</div>'+refl+'</div>';
  }).join('');
  const meta=[];
  if(w.weight&&String(w.weight).trim()) meta.push('<div class="rocell"><div class="k">Bodyweight</div><div class="v">'+esc(w.weight)+'</div></div>');
  meta.push('<div class="rocell"><div class="k">Water</div><div class="v">'+(w.water||0)+'/8'+mi('drop','red')+'</div></div>');
  meta.push('<div class="rocell"><div class="k">Workouts</div><div class="v">'+workoutsDone(w)+'/'+w.plan.days.length+'</div></div>');
  const wins=(w.wins&&w.wins.length)?'<div class="ro"><div class="rot">Weekly Wins'+mi('trophy','red')+'</div><div class="chips" style="margin-top:6px;">'+w.wins.map(x=>'<div class="chip on">'+esc(x)+'</div>').join('')+'</div>'+(w.note&&w.note.trim()?'<div class="romini" style="margin-top:10px;">“'+esc(w.note)+'”</div>':'')+'</div>':'';
  const score=(w.score&&w.score.length)?'<div class="ro"><div class="rot">Baddie Score</div><div class="chips" style="margin-top:6px;">'+w.score.map(x=>'<div class="chip on">'+esc(x)+'</div>').join('')+'</div></div>':'';
  const prs=(w.prs&&w.prs.some(p=>String(p).trim()))?'<div class="ro"><div class="rot">Records</div><div class="rogrid" style="margin-top:6px;">'+PR_LABELS.map((l,i)=>String(w.prs[i]||'').trim()?'<div class="rocell"><div class="k">'+esc(l)+'</div><div class="v">'+esc(w.prs[i])+'</div></div>':'').join('')+'</div></div>':'';
  return '<button class="backbtn" data-act="backhist"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 6l-6 6 6 6"/></svg> Back to progress</button>'
    +'<div class="kicker">Past week</div><h1 class="h1 hdr">'+esc(w.week||'Week')+'</h1><div class="sub mb">'+(w.name?'For '+esc(w.name)+' · ':'')+(dt?'Saved '+esc(dt):'')+'</div>'
    +'<div class="rogrid mt-s" style="margin-bottom:14px;">'+meta.join('')+'</div>'+(days||'<div class="empty">No workouts were logged this week.</div>')+wins+score+prs
    +'<div class="divider"></div><button class="btn danger-ghost sm" data-act="delweek" data-id="'+esc(w.id)+'">Delete this week</button>';
}

function screenWins(){
  const a=state.active;
  const wins=WINS.map(w=>'<div class="toggle'+(a.wins.includes(w)?' on':'')+'" data-act="win" data-val="'+esc(w)+'"><div class="tick">'+CHECK+'</div><div class="name">'+esc(w)+'</div></div>').join('');
  const score=SCORE_ITEMS.map(it=>'<div class="toggle'+(a.score.includes(it)?' on':'')+'" data-act="score" data-val="'+esc(it)+'"><div class="tick round">'+CHECK+'</div><div class="name">'+esc(it)+'</div></div>').join('');
  return '<div class="kicker">This week I...</div><h1 class="h1 hdr">Weekly Wins</h1><div class="sub mb">Celebrate every one</div>'
    +'<div class="stack mt-s">'+wins+'</div>'
    +'<div class="mt"><div class="seclbl">A note to myself</div><textarea class="ta" data-note rows="4" placeholder="Write something...">'+esc(a.note)+'</textarea></div>'
    +'<div class="mt"><div class="seclbl">Baddie Score — tap all that are true</div><div class="stack">'+score+'</div></div>';
}

function screenMe(){
  const a=state.active;
  const goals=GOALS.map(g=>'<div class="chip'+(state.profile.goals.includes(g)?' on':'')+'" data-act="goal" data-val="'+esc(g)+'">'+esc(g)+'</div>').join('');
  const prs=PR_LABELS.map((label,i)=>'<div class="field"><div class="cap">'+esc(label)+'</div><input class="input sm" data-pr="'+i+'" value="'+esc(a.prs[i]||'')+'" placeholder="—"></div>').join('');
  const av=state.profile.avatar;
  const _b=storageBytes();
  const storageLine=_b<1024*1024 ? Math.max(1,Math.round(_b/1024))+' KB' : (_b/1048576).toFixed(1)+' MB';
  const avatarBlock='<div class="avatarrow"><div class="avatarprev'+(av?' has':'')+'"><img src="'+(av?esc(av):'assets/shield.png')+'" alt=""></div>'
    +'<div class="avatarbtns"><label class="btn ghost sm"><input type="file" accept="image/*" data-avatar hidden>'+(av?'Change photo':'Add photo')+'</label>'
    +(av?'<button class="btn danger-ghost sm" data-act="rmavatar">Remove photo</button>':'')+'</div></div>';
  return '<div class="kicker">My Baddie Profile</div><h1 class="h1 hdr">Me</h1><div class="sub mb">'+state.history.length+' week'+(state.history.length===1?'':'s')+' in the books</div>'
    +avatarBlock
    +'<div class="fields"><div class="field"><div class="cap">Name</div><input class="input" data-prof="name" value="'+esc(state.profile.name)+'" placeholder="Your name"></div>'
    +'<div class="row"><div class="field"><div class="cap">Week of</div><div class="input sm readonly">'+esc(a.week||currentWeekLabel())+'<span class="autotag">Auto</span></div></div>'
    +'<div class="field"><div class="cap">Bodyweight</div><input class="input sm" data-active="weight" inputmode="decimal" value="'+esc(a.weight)+'" placeholder="—"></div></div></div>'
    +'<div class="mt"><div class="seclbl">My goals — tap all that apply</div><div class="chips">'+goals+'</div></div>'
    +'<div class="mt"><div class="seclbl">Personal Records</div><div class="fields">'+prs+'</div></div>'
    +'<div class="mt"><div class="seclbl">Coach’s Notes</div><textarea class="ta" data-coach rows="3" placeholder="Notes from coach...">'+esc(a.coachNotes)+'</textarea></div>'
    +'<div class="divider"></div><div class="seclbl">End of the week?</div><div class="sub" style="margin-bottom:12px;">Save this week to your <b class="spark">Progress</b> history and start fresh. Your name, goals, records, bodyweight &amp; plan carry over.</div>'
    +'<button class="btn" data-act="finish">✓ Finish Week &amp; Save to Progress</button>'
    +'<button class="btn ghost sm" style="margin-top:10px;" data-act="cleardata">Reset current week (no save)</button>'
    +'<div class="divider"></div><div class="seclbl">Data &amp; backup</div>'
    +'<div class="sub" style="margin-bottom:12px;">Everything is stored privately on this device. Currently using about <b class="spark">'+storageLine+'</b> (browsers allow ~5 MB). Back up so a browser reset can\'t lose your progress.</div>'
    +'<button class="btn ghost sm" data-act="export">Export backup (.json)</button>'
    +'<label class="btn ghost sm" style="margin-top:10px;"><input type="file" accept="application/json,.json" data-import hidden>Import / restore backup</label>';
}

const SCREENS={home:screenHome,workout:screenWorkout,progress:screenProgress,wins:screenWins,me:screenMe};
const NAV=[['home','Home'],['workout','Workout'],['progress','Progress'],['wins','Wins'],['me','Me']];
const TOPSUB={home:'TRAINING JOURNAL',workout:"TODAY'S SESSION",progress:'YOUR PROGRESS',wins:'WEEKLY WINS',me:'MY PROFILE'};

function renderNav(){
  el('nav').innerHTML=NAV.map(function(x){var id=x[0],label=x[1];return '<div class="navitem'+(state.tab===id?' active':'')+'" data-nav="'+id+'"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">'+ICONS[id]+'</svg><div class="nlbl">'+label+'</div></div>';}).join('');
}

/* ================= Library picker overlay ================= */
function pickMatches(){
  const q=(state.ui.q||'').trim().toLowerCase();
  return LIBRARY.map((x,i)=>({x,i})).filter(function(o){var x=o.x;return (state.ui.fBody==='All'||x.b===state.ui.fBody)&&(state.ui.fEquip==='All'||x.e===state.ui.fEquip)&&(!q||x.n.toLowerCase().includes(q));});
}
function renderPickList(){
  const items=pickMatches();
  if(!items.length) return '<div class="empty">No exercises match. Clear a filter or add a custom one below.</div>';
  return items.map(function(o){var x=o.x,i=o.i;return '<div class="pickitem" data-act="pick" data-lib="'+i+'"><div class="pn">'+esc(x.n)+'</div><div class="picktag">'+esc(x.b)+' · '+esc(x.e)+'<br>'+x.f.map(f=>esc(FIELD_LABELS[f])).join('/')+'</div><span class="pickadd">＋</span></div>';}).join('');
}
function renderOverlay(){
  const ov=el('overlay'), p=state.ui.picker;
  if(!p){ ov.className=''; ov.innerHTML=''; return; }
  const bodyChips=['All'].concat(BODY_PARTS).map(b=>'<div class="fchip'+(state.ui.fBody===b?' on':'')+'" data-act="fbody" data-v="'+esc(b)+'">'+esc(b)+'</div>').join('');
  const equipChips=['All'].concat(EQUIP).map(e=>'<div class="fchip'+(state.ui.fEquip===e?' on':'')+'" data-act="fequip" data-v="'+esc(e)+'">'+esc(e)+'</div>').join('');
  const custom=state.ui.custom
    ? '<div class="card mt-s"><div class="cap">Custom exercise name</div><input class="input sm" data-custname value="'+esc(state.ui.customName||'')+'" placeholder="e.g. Sled Drag"><div class="cap mt-s">Track</div><div class="fieldtoggle">'+['wt','reps','time','dist'].map(fk=>'<div class="fchip'+((state.ui.customFields||[]).includes(fk)?' on':'')+'" data-act="custfield" data-fk="'+fk+'">'+esc(FIELD_LABELS[fk])+'</div>').join('')+'</div><button class="btn sm mt-s" data-act="addcustom">Add exercise</button></div>'
    : '<button class="btn ghost sm mt-s" data-act="customtoggle">＋ Add a custom exercise</button>';
  ov.className='overlay';
  ov.innerHTML='<div class="sheet"><div class="sheethead"><div class="st hdr">'+(p.mode==='replace'?'Swap Exercise':'Add Exercise')+'</div><button class="iconbtn" data-act="closepicker">'+I_X+'</button></div>'
    +'<div class="sheetbody"><input class="input sm searchbar" data-search value="'+esc(state.ui.q||'')+'" placeholder="Search exercises..."><div class="filters"><div class="frow">'+bodyChips+'</div><div class="frow">'+equipChips+'</div></div><div class="picklist" id="picklist">'+renderPickList()+'</div>'+custom+'</div></div>';
}

function render(){
  const scr=el('screen'); const keep=scr.scrollTop;
  el('topSub').textContent=TOPSUB[state.tab]||'TRAINING JOURNAL';
  scr.innerHTML='<div class="fade">'+SCREENS[state.tab]()+'</div>';
  scr.scrollTop=(state.tab==='progress'&&state.viewId)?0:keep;
  renderNav(); renderOverlay(); renderBrand();
}
function renderBrand(){
  const bi=el('brandImg'); if(!bi) return;
  const av=state.profile.avatar;
  if(av){ if(bi.getAttribute('src')!==av) bi.src=av; bi.classList.add('avatar'); bi.style.display=''; }
  else { if(bi.getAttribute('src')!=='assets/shield.png') bi.src='assets/shield.png'; bi.classList.remove('avatar'); }
}

/* ================= Rest timer (independent of screen re-renders) ================= */
let rest={total:0,remaining:0,running:false,endAt:0,tickId:null,doneHide:null,done:false};
let audioCtx=null;
function fmtT(s){ s=Math.max(0,s|0); return Math.floor(s/60)+':'+String(s%60).padStart(2,'0'); }
function restLabel(s){ return s<60 ? s+'s' : fmtT(s); }
function timerEl(){ return document.getElementById('timerbar'); }
function buildTimerBar(){
  const el=timerEl(); if(!el||el.dataset.built) return;
  el.dataset.built='1';
  el.innerHTML='<div class="tprog"></div><div class="trow"><div class="tinfo"><div class="tlabel">REST</div><div class="ttime">0:00</div></div>'
    +'<button class="tbtn" data-tact="add">+15s</button><button class="iconbtn" data-tact="pause">'+ICON_PAUSE+'</button><button class="iconbtn" data-tact="close">'+I_X+'</button></div>';
  el.addEventListener('click',function(e){ const b=e.target.closest('[data-tact]'); if(!b)return; const a=b.dataset.tact; if(a==='add')addRest(15); else if(a==='pause')pauseRest(); else if(a==='close')stopRest(); });
}
function ensureAudio(){ try{ audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)(); if(audioCtx.state==='suspended')audioCtx.resume(); }catch(e){} }
function beep(){
  try{ const c=audioCtx; if(c){ const n=c.currentTime; [0,0.26,0.52].forEach(function(t){ const o=c.createOscillator(),g=c.createGain(); o.type='sine'; o.frequency.value=880; g.gain.setValueAtTime(0.0001,n+t); g.gain.exponentialRampToValueAtTime(0.35,n+t+0.02); g.gain.exponentialRampToValueAtTime(0.0001,n+t+0.2); o.connect(g); g.connect(c.destination); o.start(n+t); o.stop(n+t+0.22); }); } }catch(e){}
  try{ if(navigator.vibrate) navigator.vibrate([180,90,180]); }catch(e){}
}
function drawTimer(){
  const el=timerEl(); if(!el||!el.classList.contains('show')) return;
  const tt=el.querySelector('.ttime'); if(tt) tt.textContent=rest.done?'Done':fmtT(rest.remaining);
  const lb=el.querySelector('.tlabel'); if(lb) lb.textContent=rest.done?'REST COMPLETE':(rest.running?'REST':'PAUSED');
  const pr=el.querySelector('.tprog'); if(pr) pr.style.width=(rest.total?Math.max(0,Math.min(100,rest.remaining/rest.total*100)):0)+'%';
  const pb=el.querySelector('[data-tact="pause"]'); if(pb) pb.innerHTML=rest.running?ICON_PAUSE:ICON_PLAY;
}
function startRest(sec){
  buildTimerBar(); ensureAudio();
  rest.total=sec; rest.remaining=sec; rest.running=true; rest.done=false; rest.endAt=Date.now()+sec*1000;
  if(rest.doneHide){ clearTimeout(rest.doneHide); rest.doneHide=null; }
  const el=timerEl(); el.classList.add('show'); el.classList.remove('done');
  clearInterval(rest.tickId); rest.tickId=setInterval(tickRest,200);
  drawTimer();
}
function tickRest(){ if(rest.running){ rest.remaining=Math.max(0,Math.round((rest.endAt-Date.now())/1000)); if(rest.remaining<=0) finishRest(); } drawTimer(); }
function pauseRest(){ if(rest.done)return; if(rest.running){ rest.remaining=Math.max(0,Math.round((rest.endAt-Date.now())/1000)); rest.running=false; } else { rest.running=true; rest.endAt=Date.now()+rest.remaining*1000; } drawTimer(); }
function addRest(sec){ if(rest.done){ startRest(sec); return; } rest.remaining+=sec; rest.total+=sec; if(rest.running) rest.endAt+=sec*1000; drawTimer(); }
function finishRest(){ rest.running=false; rest.done=true; rest.remaining=0; clearInterval(rest.tickId); rest.tickId=null; const el=timerEl(); if(el)el.classList.add('done'); beep(); drawTimer(); rest.doneHide=setTimeout(stopRest,6000); }
function stopRest(){ clearInterval(rest.tickId); rest.tickId=null; if(rest.doneHide){clearTimeout(rest.doneHide);rest.doneHide=null;} rest.running=false; rest.done=false; const el=timerEl(); if(el) el.classList.remove('show','done'); }

/* ================= Workout stopwatch (counts up; separate from rest countdown) ================= */
let wo={running:false, elapsedMs:0, startAt:0, tickId:null};
function woElapsed(){ return wo.running ? (Date.now()-wo.startAt) : wo.elapsedMs; }
function fmtWO(ms){ const s=Math.floor(ms/1000), h=Math.floor(s/3600), m=Math.floor((s%3600)/60), ss=s%60; const mm=String(m).padStart(2,'0'), sc=String(ss).padStart(2,'0'); return h>0 ? (h+':'+mm+':'+sc) : (m+':'+sc); }
function woTick(){ const e=document.querySelector('.wotime'); if(e) e.textContent=fmtWO(woElapsed()); }
function woStart(){ if(wo.running)return; wo.running=true; wo.startAt=Date.now()-wo.elapsedMs; clearInterval(wo.tickId); wo.tickId=setInterval(woTick,500); }
function woPause(){ if(!wo.running)return; wo.elapsedMs=Date.now()-wo.startAt; wo.running=false; clearInterval(wo.tickId); wo.tickId=null; }
function woStop(){
  const ms=woElapsed(); wo.running=false; clearInterval(wo.tickId); wo.tickId=null; wo.elapsedMs=0; wo.startAt=0;
  const day=state.plan.days[state.workoutDay];
  if(day && ms>1500){ dayLog(state.active.log, day.id).duration=Math.round(ms/1000); persist(); }
  render();
}

/* ================= Actions ================= */
function openPicker(dayId,mode,exId){ state.ui.picker={dayId,mode,exId:exId||null}; state.ui.q=''; state.ui.custom=false; state.ui.customName=''; state.ui.customFields=[]; }

// Snapshot the active week to history and start a fresh one. Used by manual
// "Finish Week" and by the automatic end-of-week rollover.
function archiveCurrentWeek(){
  const a=state.active;
  const snap={ id:uid('w'), archivedAt:new Date().toISOString(), week:a.week||currentWeekLabel(), name:state.profile.name, goals:state.profile.goals.slice(),
    plan:JSON.parse(JSON.stringify(state.plan)), log:compactLog(a.log, state.plan),
    weight:a.weight, water:a.water, wins:a.wins.slice(), note:a.note, prs:a.prs.slice(), score:a.score.slice(), coachNotes:a.coachNotes };
  state.history.unshift(snap);
  const fresh=freshActive(); fresh.weight=a.weight; fresh.prs=a.prs.slice(); fresh.week=currentWeekLabel();
  state.active=fresh;
}
function finishWeek(){
  if(!hasActivity(activeView())){ alert('Log a workout or two before finishing the week!'); return; }
  if(!confirm('Finish this week and save it to Progress? Your name, goals, records, bodyweight and plan carry over; the logged week resets.')) return;
  archiveCurrentWeek();
  state.tab='progress'; state.viewId=null;
  persist(); render();
}

/* ================= Event wiring ================= */
el('screen').addEventListener('click',function(e){
  const t=e.target.closest('[data-act]'); if(!t) return;
  const act=t.dataset.act, ds=t.dataset, a=state.active;
  if(act==='water'){ const i=+ds.i; a.water=a.water===i+1?i:i+1; }
  else if(act==='goal'){ const g=ds.val; const h=state.profile.goals.includes(g); state.profile.goals=h?state.profile.goals.filter(x=>x!==g):state.profile.goals.concat([g]); }
  else if(act==='win'){ const v=ds.val; a.wins=a.wins.includes(v)?a.wins.filter(x=>x!==v):a.wins.concat([v]); }
  else if(act==='score'){ const v=ds.val; a.score=a.score.includes(v)?a.score.filter(x=>x!==v):a.score.concat([v]); }
  else if(act==='scale'){ const dl=dayLog(a.log,ds.day),n=+ds.n; dl.scale=dl.scale===n?null:n; }
  else if(act==='rating'){ const dl=dayLog(a.log,ds.day),n=+ds.n; dl.rating=dl.rating===n?0:n; }
  else if(act==='day'){ state.workoutDay=+ds.i; }
  else if(act==='gotoworkout'){ state.tab='workout'; }
  else if(act==='toggleedit'){ state.ui.edit=!state.ui.edit; }
  else if(act==='addday'){ const p=state.plan; p.days.push({id:uid('d'),name:'Day '+(p.days.length+1),focus:'',rounds:3,scaleLabel:"Today's Energy",finisher:'',reflectionFields:[{key:'proud',label:"Something I'm Proud Of Today"}],exercises:[]}); state.workoutDay=p.days.length-1; state.ui.edit=true; }
  else if(act==='delday'){ if(!confirm('Delete this whole day and its exercises?'))return; state.plan.days=state.plan.days.filter(x=>x.id!==ds.dayid); if(state.workoutDay>=state.plan.days.length)state.workoutDay=Math.max(0,state.plan.days.length-1); }
  else if(act==='roundsinc'){ const d=findDay(ds.dayid); if(d&&d.rounds<8)d.rounds++; }
  else if(act==='roundsdec'){ const d=findDay(ds.dayid); if(d&&d.rounds>1)d.rounds--; }
  else if(act==='scaletype'){ const d=findDay(ds.dayid); if(d)d.scaleLabel=ds.t==='confidence'?"Today's Confidence":"Today's Energy"; }
  else if(act==='addex'){ openPicker(ds.day,'add'); }
  else if(act==='exswap'){ openPicker(ds.day,'replace',ds.ex); }
  else if(act==='exup'){ moveEx(ds.day,ds.ex,-1); }
  else if(act==='exdown'){ moveEx(ds.day,ds.ex,1); }
  else if(act==='exdel'){ const d=findDay(ds.day); const ex=d&&d.exercises.find(x=>x.id===ds.ex); if(!ex)return; if(exHasData(ds.day,ds.ex)&&!confirm('Remove "'+ex.name+'"? Logged sets for it this week will be cleared.'))return; d.exercises=d.exercises.filter(x=>x.id!==ds.ex); const dl=a.log[ds.day]; if(dl&&dl.ex)delete dl.ex[ds.ex]; }
  else if(act==='viewweek'){ state.viewId=ds.id; }
  else if(act==='backhist'){ state.viewId=null; }
  else if(act==='delweek'){ if(!confirm("Delete this saved week? This can't be undone."))return; state.history=state.history.filter(w=>w.id!==ds.id); state.viewId=null; }
  else if(act==='finish'){ finishWeek(); return; }
  else if(act==='cleardata'){ if(!confirm("Reset the current week without saving it? This can't be undone."))return; state.active=freshActive(); }
  else if(act==='rmavatar'){ state.profile.avatar=''; }
  else if(act==='export'){ exportData(); return; }
  else if(act==='rest'){ startRest(+ds.sec); return; }
  else if(act==='toggledone'){ const dl=dayLog(a.log,ds.day); dl.done=!dl.done; }
  else if(act==='dupday'){ duplicateDay(ds.dayid); }
  else if(act==='dayleft'){ moveDay(ds.dayid,-1); }
  else if(act==='dayright'){ moveDay(ds.dayid,1); }
  else if(act==='wostart'){ woStart(); render(); return; }
  else if(act==='wopause'){ woPause(); render(); return; }
  else if(act==='wostop'){ woStop(); return; }
  else return;
  persist(); render();
});

el('screen').addEventListener('change',function(e){
  if(e.target.dataset.act==='chartsel'){ state.chartName=e.target.value; persist(); render(); }
  else if(e.target.dataset.avatar!==undefined){ const f=e.target.files&&e.target.files[0]; if(f) loadAvatar(f); }
  else if(e.target.dataset.import!==undefined){ const f=e.target.files&&e.target.files[0]; if(f) importData(f); }
});

el('screen').addEventListener('input',function(e){
  const d=e.target.dataset, v=e.target.value, a=state.active;
  if(d.prof!==undefined) state.profile[d.prof]=v;
  else if(d.active!==undefined) a[d.active]=v;
  else if(d.note!==undefined) a.note=v;
  else if(d.coach!==undefined) a.coachNotes=v;
  else if(d.pr!==undefined) a.prs[+d.pr]=v;
  else if(d.cell!==undefined) setCell(d.day,d.ex,+d.round,d.fk,v);
  else if(d.refl!==undefined){ const dl=dayLog(a.log,d.day); dl.reflections[d.refkey]=v; }
  else if(d.dfield!==undefined){ const day=findDay(d.dayid); if(day){ if(d.dfield==='name')day.name=v; else if(d.dfield==='focus')day.focus=v; else if(d.dfield==='finisher')day.finisher=v; } }
  else return;
  persist();
});

el('overlay').addEventListener('click',function(e){
  const t=e.target.closest('[data-act]'); if(!t) return;
  const act=t.dataset.act, ds=t.dataset, ui=state.ui, p=ui.picker;
  if(act==='closepicker'){ ui.picker=null; }
  else if(act==='fbody'){ ui.fBody=ds.v; }
  else if(act==='fequip'){ ui.fEquip=ds.v; }
  else if(act==='customtoggle'){ ui.custom=true; }
  else if(act==='custfield'){ const f=ds.fk; const s=new Set(ui.customFields||[]); s.has(f)?s.delete(f):s.add(f); ui.customFields=[...s]; }
  else if(act==='pick'){ const x=LIBRARY[+ds.lib]; if(p){ if(p.mode==='replace')replaceExercise(p.dayId,p.exId,x.n,x.f); else addExercise(p.dayId,x.n,x.f); } ui.picker=null; }
  else if(act==='addcustom'){ const name=(ui.customName||'').trim(); if(!name){ alert('Give the exercise a name.'); return; } let f=(ui.customFields||[]).slice(); if(!f.length)f=['reps']; const order=['wt','reps','time','dist']; f.sort((a,b)=>order.indexOf(a)-order.indexOf(b)); if(p){ if(p.mode==='replace')replaceExercise(p.dayId,p.exId,name,f); else addExercise(p.dayId,name,f); } ui.picker=null; }
  else return;
  persist(); render();
});
el('overlay').addEventListener('input',function(e){
  const d=e.target.dataset;
  if(d.search!==undefined){ state.ui.q=e.target.value; const l=el('picklist'); if(l)l.innerHTML=renderPickList(); }
  else if(d.custname!==undefined){ state.ui.customName=e.target.value; }
});

el('nav').addEventListener('click',function(e){
  const t=e.target.closest('[data-nav]'); if(!t) return;
  state.tab=t.dataset.nav; state.viewId=null; state.ui.edit=false; state.ui.picker=null; persist(); render();
});

// Auto week + end-of-week rollover:
//  - If a new calendar week has begun and the previous week has logged data,
//    automatically save it to Progress and start a fresh week (no manual "Finish").
//  - Otherwise just keep the (untouched) current week's label up to date.
let pendingWeekNotice=false;
(function weekRollover(){
  const cur=currentWeekLabel();
  if(hasActivity(activeView())){
    if(state.active.week && state.active.week!==cur){ archiveCurrentWeek(); persist(); pendingWeekNotice=true; }
  } else if(state.active.week!==cur){ state.active.week=cur; persist(); }
})();

render();
if(pendingWeekNotice){ setTimeout(function(){ alert("New week started — last week's workouts were saved to your Progress."); }, 400); }
if('serviceWorker' in navigator){ window.addEventListener('load',function(){ navigator.serviceWorker.register('sw.js').catch(function(){}); }); }
