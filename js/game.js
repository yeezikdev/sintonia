// ===== Sintonia · gioco (carte, quadrante, logica, schermate della stanza) =====
// ===== Carte (estremo sinistro, estremo destro) =====
const CARDS=[["Freddo","Caldo"],["Brutto","Bello"],["Inutile","Utile"],["Noioso","Divertente"],["Economico","Costoso"],["Facile","Difficile"],["Salato","Dolce"],["Sfigato","Figo"],["Odiato","Amato"],["Comune","Raro"],["Lento","Veloce"],["Piccolo","Enorme"],["Morbido","Duro"],["Silenzioso","Rumoroso"],["Sopravvalutato","Sottovalutato"],["Cringe","Iconico"],["Tamarro","Elegante"],["Puzza","Profuma"],["Sano","Schifezza"],["Mainstream","Di nicchia"],["Da inverno","Da estate"],["Normale","Bizzarro"],["Innocuo","Pericoloso"],["Ruvido","Liscio"],["Da aperitivo","Da club alle 4"],["Canzone triste","Canzone allegra"],["Da primo appuntamento","Da matrimonio"],["Snack","Pasto completo"],["Non è uno sport","È uno sport"],["Talento","Fortuna"],["Pulito","Sporco"],["Pessimo consiglio","Ottimo consiglio"],["Pigro","Produttivo"],["Per niente romantico","Romanticissimo"],["Imbarazzante","Motivo di vanto"],["Peggior regalo","Miglior regalo"],["Dimenticabile","Indimenticabile"],["Rilassante","Stressante"],["Superpotere inutile","Superpotere utile"],["Lavoro facile","Lavoro durissimo"],["Normale in pubblico","Strano in pubblico"],["Film brutto","Capolavoro"],["Da nonno","Da ragazzino"],["Animale da appartamento","Animale selvatico"],["Fantasia","Realtà"],["Vietato sulla pizza","Perfetto sulla pizza"],["Cattivo debole","Cattivo temibile"],["Hobby noioso","Hobby figo"],["Si fa da soli","Si fa in gruppo"],["Passato di moda","Di tendenza"],["Mangiabile","Immangiabile"],["Leggero","Pesante"],["Semplice","Complicato"],["Basso rischio","Alto rischio"],["Look casual","Look elegante"],["Città","Natura"],["Tecnologia vecchia","Tecnologia futuristica"],["Bevanda schifosa","Bevanda buonissima"],["Antipatico","Simpatico"],["Fragile","Indistruttibile"],["Calmo","Caotico"],["Nome da cane","Nome da persona"],["Serio","Ridicolo"],["Colazione","Cena"],["Tutti lo sanno fare","Pochi lo sanno fare"],["Da nascondere","Da postare sui social"],["Mattina presto","Notte fonda"],["Insalata","Non è un'insalata"],["Panino","Non è un panino"],["Infanzia","Vita adulta"],["Pessimo coinquilino","Coinquilino perfetto"],["Ingiusto","Giusto"]];

// ===== Quadrante =====
const VW=220,VH=124,CX=110,CY=110,R=92;
function pt(v,r){const a=Math.PI*(1-v/100);return[+(CX+r*Math.cos(a)).toFixed(2),+(CY-r*Math.sin(a)).toFixed(2)]}
const rot=v=>((v-50)*1.8).toFixed(2);
function wedge(a,b,r){a=Math.max(0,a);b=Math.min(100,b);if(b<=a)return'';const p1=pt(a,r),p2=pt(b,r);return`M${CX} ${CY} L${p1[0]} ${p1[1]} A${r} ${r} 0 0 1 ${p2[0]} ${p2[1]} Z`}
const arc=r=>`M${CX-r} ${CY} A${r} ${r} 0 0 1 ${CX+r} ${CY}`;
let dialN=0;
// o: {zones,target,needle,color,guesses,cover:'closed'|'opening',interactive,cls,grow}
function dial(o={}){
  const id='d'+(++dialN),face=`${arc(R)} Z`;
  let s=`<svg class="dial${o.interactive?' live':''}${o.cls?' '+o.cls:''}" viewBox="0 0 ${VW} ${VH}" aria-hidden="true"><defs>
    <radialGradient id="${id}f" cx="50%" cy="100%" r="100%"><stop offset="0" stop-color="#43308c"/><stop offset=".65" stop-color="#241a4d"/><stop offset="1" stop-color="#170f33"/></radialGradient>
    <linearGradient id="${id}r" x1="0" x2="1"><stop offset="0" stop-color="#4dd6ff"/><stop offset=".5" stop-color="#ff5c8a"/><stop offset="1" stop-color="#ffd23f"/></linearGradient>
    <linearGradient id="${id}c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#33276a"/><stop offset="1" stop-color="#1b1440"/></linearGradient>
    <radialGradient id="${id}h" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="#d8d2ff"/><stop offset="1" stop-color="#6d62a8"/></radialGradient>
    <clipPath id="${id}k"><path d="${face}"/></clipPath>
    <filter id="${id}g" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4"/></filter>
  </defs>`;
  // cornice luminosa
  s+=`<path d="${arc(R+6)}" fill="none" stroke="url(#${id}r)" stroke-width="7" stroke-linecap="round" opacity=".45" filter="url(#${id}g)"/>`;
  s+=`<path d="${arc(R+6)}" fill="none" stroke="url(#${id}r)" stroke-width="3.4" stroke-linecap="round"/>`;
  s+=`<path d="${face}" fill="url(#${id}f)"/>`;
  s+=`<g clip-path="url(#${id}k)">`;
  for(let v=0;v<=100;v+=5){const e=pt(v,R);s+=`<line x1="${CX}" y1="${CY}" x2="${e[0]}" y2="${e[1]}" stroke="rgba(255,255,255,.035)" stroke-width=".8"/>`}
  [34,58,80].forEach(r=>s+=`<path d="${arc(r)}" fill="none" stroke="rgba(255,255,255,.05)" stroke-width=".7"/>`);
  if(o.zones){
    const t=o.target;
    s+=`<g class="zones${o.grow?' grow':''}"><path d="${wedge(t-17,t+17,R)}" fill="#ffd23f"/><path d="${wedge(t-10,t+10,R)}" fill="#ff9f43"/><path d="${wedge(t-4,t+4,R)}" fill="#ff5c8a"/>`;
    [-17,-10,-4,4,10,17].forEach(d=>{const v=t+d;if(v<=0||v>=100)return;const e=pt(v,R);s+=`<line x1="${CX}" y1="${CY}" x2="${e[0]}" y2="${e[1]}" stroke="rgba(18,15,31,.35)" stroke-width=".8"/>`});
    [[t-13.5,2],[t-7,3],[t,4],[t+7,3],[t+13.5,2]].forEach(([v,n])=>{if(v<1.5||v>98.5)return;const p=pt(v,R-13);s+=`<text x="${p[0]}" y="${p[1]+3}" text-anchor="middle" font-family="Rubik,sans-serif" font-size="9" font-weight="900" fill="#120f1f" opacity=".85">${n}</text>`});
    s+=`</g>`;
  }
  if(o.cover){
    s+=`<g class="cover${o.cover==='opening'?' opening':''}"><path d="${face}" fill="url(#${id}c)"/>`;
    for(let r=14;r<R;r+=10)s+=`<path d="${arc(r)}" fill="none" stroke="rgba(255,255,255,.045)" stroke-width="3"/>`;
    s+=`<text x="${CX}" y="${CY-40}" text-anchor="middle" font-family="Rubik,sans-serif" font-size="34" font-weight="900" fill="rgba(255,255,255,.1)">?</text>`;
    s+=`<line x1="${CX-R}" y1="${CY}" x2="${CX+R}" y2="${CY}" stroke="rgba(255,255,255,.15)" stroke-width="1"/></g>`;
  }
  s+=`</g>`;
  for(let v=0;v<=100;v+=5){const big=v%10===0,a=pt(v,R-1),b=pt(v,R-(big?8:4.5));s+=`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="rgba(255,255,255,${big?.5:.25})" stroke-width="${big?1.1:.7}" stroke-linecap="round"/>`}
  // base
  s+=`<rect x="${CX-R-10}" y="${CY-1}" width="${2*R+20}" height="11" rx="5.5" fill="#211a40" stroke="rgba(255,255,255,.08)"/>`;
  // lancette dei giocatori
  if(o.guesses)o.guesses.forEach((g,i)=>{
    const tipY=CY-R+10,r=rot(g.v);
    s+=`<g class="gn" style="--d:${(1.25+i*.16).toFixed(2)}s;transform:rotate(${r}deg)"><polygon points="${CX-2.2},${CY} ${CX},${tipY} ${CX+2.2},${CY}" fill="${g.color}" opacity=".95"/><g style="transform-box:view-box;transform-origin:${CX}px ${tipY}px;transform:rotate(${-r}deg)"><circle cx="${CX}" cy="${tipY}" r="6.5" fill="${g.color}" stroke="#120f1f" stroke-width="1.4"/><text x="${CX}" y="${tipY+3}" text-anchor="middle" font-family="Rubik,sans-serif" font-size="8" font-weight="900" fill="#120f1f">${esc((g.name||'?')[0].toUpperCase())}</text></g></g>`;
  });
  // lancette in tempo reale (solo per il Sensitivo)
  if(o.live)o.live.forEach(p=>{
    const tipY=CY-R+10;
    s+=`<g class="ln pending" id="ln-${p.id}" style="opacity:0"><polygon points="${CX-2.2},${CY} ${CX},${tipY} ${CX+2.2},${CY}" fill="${p.color}"/><g class="lnt" style="transform-box:view-box;transform-origin:${CX}px ${tipY}px"><circle cx="${CX}" cy="${tipY}" r="6.5" fill="${p.color}" stroke="#120f1f" stroke-width="1.4"/><text x="${CX}" y="${tipY+3}" text-anchor="middle" font-family="Rubik,sans-serif" font-size="8" font-weight="900" fill="#120f1f">${esc((p.name||'?')[0].toUpperCase())}</text><circle class="ok" cx="${CX+6}" cy="${tipY-6}" r="3.6" fill="#7cff6b" stroke="#120f1f" stroke-width="1"/></g></g>`;
  });
  // lancetta principale
  if(o.needle!=null){
    const c=o.color||'#ff5c8a',tipY=CY-R+7;
    s+=`<g class="needle" style="transform:rotate(${rot(o.needle)}deg)"><polygon points="${CX-4},${CY} ${CX},${tipY} ${CX+4},${CY}" fill="${c}" opacity=".55" filter="url(#${id}g)"/><polygon points="${CX-3.2},${CY} ${CX},${tipY} ${CX+3.2},${CY}" fill="#fff"/><circle class="tipglow" cx="${CX}" cy="${tipY+2}" r="7" fill="${c}" opacity=".5" filter="url(#${id}g)"/><circle cx="${CX}" cy="${tipY+2}" r="4.5" fill="${c}" stroke="#fff" stroke-width="1.6"/></g>`;
  }
  s+=`<circle cx="${CX}" cy="${CY}" r="10" fill="url(#${id}h)" stroke="#120f1f" stroke-width="1.5"/><circle cx="${CX}" cy="${CY}" r="3.2" fill="#2a2152"/></svg>`;
  return s;
}
function sendLive(){
  if(!channel||!state||state.phase!=='guess'||state.psychicId===me.id)return;
  const go=()=>{lastLive=Date.now();liveTimer=null;try{channel.send({type:'broadcast',event:'live',payload:{from:me.id,v:myGuess,r:state.round}})}catch(e){}};
  const wait=90-(Date.now()-lastLive);
  if(wait<=0)go();else if(!liveTimer)liveTimer=setTimeout(go,wait);
}
function paintLive(){
  const S=state;if(!S||S.phase!=='guess'||S.psychicId!==me.id)return;
  S.players.forEach(p=>{
    const el=document.getElementById('ln-'+p.id);if(!el)return;
    const done=S.guesses[p.id]!=null,v=done?S.guesses[p.id]:liveMap[p.id];
    if(v==null){el.style.opacity=0;return}
    const r=rot(v);el.style.transform=`rotate(${r}deg)`;el.style.opacity=done?1:.75;
    el.classList.toggle('pending',!done);el.classList.toggle('done',done);
    const t=el.querySelector('.lnt');if(t)t.style.transform=`rotate(${-r}deg)`;
  });
}
function setNeedle(v){const n=document.querySelector('.dial.live .needle');if(n)n.style.transform=`rotate(${rot(v)}deg)`}
function bindDial(){
  const svg=document.querySelector('.dial.live');if(!svg)return;let drag=false,last=-1;
  const upd=e=>{const r=svg.getBoundingClientRect();const x=(e.clientX-r.left)/r.width*VW,y=(e.clientY-r.top)/r.height*VH;let a=Math.atan2(CY-y,x-CX);if(a<0)a=x<CX?Math.PI:0;myGuess=Math.round((1-a/Math.PI)*100);if(myGuess!==bindDial._v){bindDial._v=myGuess;SFX.tick()}setNeedle(myGuess);sendLive();const b=Math.floor(myGuess/10);if(b!==last){if(last>=0)buzz(4);last=b}};
  svg.addEventListener('pointerdown',e=>{drag=true;svg.classList.add('dragging');try{svg.setPointerCapture(e.pointerId)}catch(_){}upd(e)});
  svg.addEventListener('pointermove',e=>{if(drag)upd(e)});
  ['pointerup','pointercancel'].forEach(t=>svg.addEventListener(t,()=>{drag=false;svg.classList.remove('dragging')}));
}

// ===== Logica di gioco (eseguita dall'host) =====
function newState(){return{phase:'lobby',hostId:me.id,players:[{id:me.id,name:me.name,score:0,color:me.color||COLORS[0],uid:me.uid||null}],order:[],laps:1,round:0,total:0,psychicId:null,card:null,target:50,clue:'',guesses:{},pts:{},used:[],matchId:null,history:[]}}
function pickColor(S,want){const used=new Set(S.players.map(p=>p.color));if(want&&/^#[0-9a-fA-F]{6}$/.test(want)&&!used.has(want))return want;return COLORS.find(c=>!used.has(c))||COLORS[S.players.length%COLORS.length]}
function ensureMe(){const p=state.players.find(x=>x.id===me.id);if(p){p.name=me.name;p.uid=me.uid||null}else state.players.push({id:me.id,name:me.name,score:0,color:pickColor(state,me.color),uid:me.uid||null});state.hostId=me.id;if(!state.history)state.history=[]}
function pickCard(){const S=state;if(S.used.length>=CARDS.length)S.used=[];let i;do{i=Math.floor(Math.random()*CARDS.length)}while(S.used.includes(i));S.used.push(i);return CARDS[i]}
function startRound(){const S=state;if(!S.order.length){S.phase='lobby';return}S.psychicId=S.order[S.round%S.order.length];S.card=pickCard();S.target=Math.round(3+Math.random()*94);S.clue='';S.guesses={};S.pts={};S.phase='clue'}
function doRematch(){
  const S=state;
  S.players=S.players.filter(p=>online.has(p.id)||p.id===S.hostId);
  S.rematch=[];
  if(S.players.length<2){S.phase='lobby';S.players.forEach(x=>x.score=0);return}
  S.players.forEach(x=>x.score=0);S.order=shuffle(S.players.map(x=>x.id));S.total=S.order.length*S.laps;S.round=0;S.matchId=uuid();S.history=[];startRound();
}
function nextRound(){const S=state;S.round++;if(S.round>=S.total||!S.order.length)S.phase='end';else startRound()}
const scoreFor=d=>d<=4?4:d<=10?3:d<=17?2:0;
function reveal(){
  const S=state;S.pts={};let sum=0,n=0;
  for(const [id,v] of Object.entries(S.guesses)){const p=S.players.find(x=>x.id===id);if(!p)continue;const pt_=scoreFor(Math.abs(v-S.target));S.pts[id]=pt_;p.score+=pt_;sum+=pt_;n++}
  const ps=n?Math.round(sum/n):0;S.pts[S.psychicId]=ps;const pp=S.players.find(x=>x.id===S.psychicId);if(pp)pp.score+=ps;
  if(!S.history)S.history=[];
  S.history.push({round:S.round,psychicId:S.psychicId,clue:S.clue,card:(S.card||[]).join(' ↔ '),target:S.target,guesses:{...S.guesses},pts:{...S.pts}});
  S.phase='reveal';
}
const guessers=()=>state.players.filter(p=>p.id!==state.psychicId&&online.has(p.id)).map(p=>p.id);
function autoReveal(){const S=state;if(!S||S.phase!=='guess')return;const gs=guessers();if(gs.length&&gs.every(id=>S.guesses[id]!=null))reveal()}

function handle(a){
  const S=state;if(!S)return;const p=S.players.find(x=>x.id===a.from),isH=a.from===S.hostId;
  switch(a.type){
    case 'join':{const name=String(a.name||'?').trim().slice(0,22)||'?';const uid=typeof a.uid==='string'&&/^[0-9a-f-]{36}$/.test(a.uid)?a.uid:null;if(p){p.name=name;p.uid=uid}else{S.players.push({id:a.from,name,score:0,color:pickColor(S,a.color),uid});if(S.phase!=='lobby'&&S.phase!=='end')S.order.push(a.from)}break}
    case 'laps':if(isH&&S.phase==='lobby')S.laps=Math.max(1,Math.min(3,a.v|0));break;
    case 'start':if(isH&&S.phase==='lobby'&&S.players.length>=2){S.players.forEach(x=>x.score=0);S.order=shuffle(S.players.map(x=>x.id));S.total=S.order.length*S.laps;S.round=0;S.matchId=uuid();S.history=[];startRound()}break;
    case 'reroll':if(S.phase==='clue'&&a.from===S.psychicId)S.card=pickCard();break;
    case 'clue':if(S.phase==='clue'&&a.from===S.psychicId){const c=String(a.clue||'').trim().slice(0,60);if(c){S.clue=c;S.guesses={};S.phase='guess'}}break;
    case 'guess':if(S.phase==='guess'&&a.from!==S.psychicId&&p){S.guesses[a.from]=Math.max(0,Math.min(100,Math.round(+a.v||0)));autoReveal()}break;
    case 'unguess':if(S.phase==='guess')delete S.guesses[a.from];break;
    case 'reveal':if(isH&&S.phase==='guess')reveal();break;
    case 'next':if(isH&&S.phase==='reveal')nextRound();break;
    case 'skip':if(isH&&(S.phase==='clue'||S.phase==='guess'))nextRound();break;
    case 'kick':if(isH&&a.id!==S.hostId){S.players=S.players.filter(x=>x.id!==a.id);S.order=S.order.filter(x=>x!==a.id);delete S.guesses[a.id];if(S.psychicId===a.id&&(S.phase==='clue'||S.phase==='guess')){S.round--;nextRound()}else autoReveal()}break;
    case 'again':if(isH&&S.phase==='end'){S.phase='lobby';S.rematch=[];S.players.forEach(x=>x.score=0)}break;
    case 'rematch':if(S.phase==='end'&&p){S.rematch=S.rematch||[];if(!S.rematch.includes(a.from))S.rematch.push(a.from);
      const here=S.players.filter(x=>online.has(x.id)).map(x=>x.id);
      if(isH||(here.length>=2&&here.every(id=>S.rematch.includes(id))))doRematch()}break;
    default:return;
  }
  push();
}

// ===== Rete =====
function push(){if(!isHost||!state)return;ls.set('sintonia_host',{code,state,at:Date.now()});if(channel)channel.send({type:'broadcast',event:'state',payload:state});render()}
function send(a){a.from=me.id;if(isHost)handle(a);else if(channel)channel.send({type:'broadcast',event:'action',payload:a})}
async function enterRoom(c,host){
  try{await enterRoomInner(c,host)}catch(e){console.error(e);leave();state=null;goHome('Impossibile collegarsi: '+(e&&e.message||e))}
}
async function enterRoomInner(c,host){
  const client=getClient();
  code=c;isHost=host;online=new Set();lastKey='';prevScores={};bumpSet=new Set();seenPlayers=new Set();
  $('#tabs').innerHTML='';document.body.classList.remove('has-tabs');
  if(window.onEnteredRoom)onEnteredRoom(c);
  setUrl('?r='+c);
  if(channel){try{await client.removeChannel(channel)}catch(e){}}
  $('#top').innerHTML='';
  $('#app').className='';
  $('#app').innerHTML=`<div class="center"><div class="spin"></div>Connessione alla stanza ${esc(c)}…</div>`;lastKey='connecting';
  if(!host)state=null;
  channel=client.channel('sintonia-'+c,{config:{broadcast:{self:false},presence:{key:me.id}}});
  channel
    .on('broadcast',{event:'state'},({payload})=>{
      if(isHost)return;clearTimeout(joinTimer);state=payload;
      if(!state.players.find(p=>p.id===me.id)&&Date.now()-lastJoin>2000){lastJoin=Date.now();send({type:'join',name:me.name,uid:me.uid,color:me.color})}
      render();
    })
    .on('broadcast',{event:'action'},({payload})=>{if(isHost)handle(payload)})
    .on('broadcast',{event:'hello'},()=>{if(isHost)push()})
    .on('broadcast',{event:'live'},({payload})=>{if(!state||!payload||payload.r!==state.round)return;liveMap[payload.from]=payload.v;paintLive()})
    .on('presence',{event:'sync'},()=>{online=new Set(Object.keys(channel.presenceState()));if(isHost&&state){autoReveal();push()}else render()})
    .subscribe(async st=>{
      if(st==='SUBSCRIBED'){
        await channel.track({name:me.name});
        if(isHost){ensureMe();push()}
        else{
          lastJoin=Date.now();send({type:'join',name:me.name,uid:me.uid,color:me.color});
          channel.send({type:'broadcast',event:'hello',payload:{}});
          clearTimeout(joinTimer);
          joinTimer=setTimeout(()=>{if(!state){leave();goHome(`Stanza ${c} non trovata. Controlla il codice: chi l'ha creata deve avere la pagina aperta.`)}},6000);
        }
      }else if(st==='CHANNEL_ERROR'||st==='TIMED_OUT'){toast('Connessione instabile, riprovo…')}
    });
  if(host){clearTimeout(joinTimer);joinTimer=setTimeout(()=>{if(lastKey==='connecting'){leave();state=null;goHome("Il server di gioco non risponde. Apri il gioco dal suo link online (GitHub Pages) e non dall'anteprima o dal file sul computer, poi riprova.")}},9000)}
}
function leave(){clearTimeout(joinTimer);if(channel&&sbc){try{sbc.removeChannel(channel)}catch(e){}}channel=null;state=null;code=null;isHost=false;online=new Set();setUrl(location.pathname);if(window.onLeftRoom)onLeftRoom()}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&channel){try{channel.track({name:me.name})}catch(e){}if(!isHost)channel.send({type:'broadcast',event:'hello',payload:{}})}});


// ===== Schermate =====
const nameOf=id=>{const p=state.players.find(x=>x.id===id);return p?p.name:'?'};
const playerOf=id=>state.players.find(x=>x.id===id)||{name:'?',color:'#fff'};
const VIEWS={
  lobby:()=>`
    <div class="card share"><div class="lbl">Codice stanza</div><div class="bigcode">${[...code].map((ch,i)=>`<span style="--i:${i}">${esc(ch)}</span>`).join('')}</div><div id="qr" class="qr"></div><button class="btn ghost sm" data-a="copy">Condividi link d'invito</button></div>
    <h3>Giocatori</h3>
    <div id="plist" class="plist"></div>
    <div id="invfr"></div>
    ${isHost?`<div class="setting"><span>Volte che ognuno fa il Sensitivo</span><div class="seg" id="laps"></div></div><button class="btn primary big" data-a="start" id="startBtn">Inizia la partita</button>`:`<p class="wait">In attesa che l'host avvii la partita…</p>`}`,
  clue:()=>{
    const S=state;
    if(S.psychicId===me.id)return`
      <div class="role psy">Sei il Sensitivo 🔮</div>
      <p class="hint">Il bersaglio è nella zona colorata. Scrivi un indizio per far capire agli altri dove si trova tra i due estremi.</p>
      ${dial({zones:true,target:S.target,cover:'opening'})}
      <div id="ends"></div>
      <input id="clue" maxlength="60" placeholder="Il tuo indizio…" value="${esc(clueDraft)}" autocomplete="off">
      <div class="row"><button class="btn ghost" data-a="reroll">🔄 Cambia carta</button><button class="btn primary" data-a="clue">Invia indizio</button></div>
      <div id="hostbar"></div>`;
    return`
      <div class="role">${nm(playerOf(S.psychicId))} è il Sensitivo</div>
      <div class="orb"><div class="ring"></div><div class="ring r2"></div><span>🔮</span></div>
      <p class="hint">Sta guardando il bersaglio e pensando all'indizio…</p>
      ${dial({cover:'closed'})}
      <div id="ends"></div>
      <div id="hostbar"></div>`;
  },
  guess:()=>{
    const S=state,psy=S.psychicId===me.id,mine=S.guesses[me.id];
    const cb=`<div class="cluebox"><div class="lbl">${psy?'Il tuo indizio':'Indizio di '+nm(playerOf(S.psychicId))}</div><div class="clue">“${esc(S.clue)}”</div></div>`;
    if(psy)return`${cb}<div style="text-align:center"><span class="livelab">IN DIRETTA</span></div>${dial({zones:true,target:S.target,live:S.players.filter(p=>p.id!==S.psychicId)})}<div id="ends"></div><p class="hint">Guarda le lancette degli altri muoversi in tempo reale: sono sfumate finché non confermano. Niente suggerimenti! 🤐</p><div id="status"></div><div id="hostbar"></div>`;
    const col=playerOf(me.id).color;
    if(mine!=null)return`${cb}${dial({cover:'closed',needle:mine,color:col})}<div id="ends"></div><p class="okmsg">Risposta inviata ✓</p><button class="btn ghost big" data-a="unguess">Cambia risposta</button><div id="status"></div><div id="hostbar"></div>`;
    return`${cb}${dial({cover:'closed',interactive:true,needle:myGuess,color:col})}<div id="ends"></div>
      <div class="row"><button class="btn ghost sq" data-a="m" aria-label="Sposta a sinistra">‹</button><button class="btn primary" data-a="guess">Conferma</button><button class="btn ghost sq" data-a="p" aria-label="Sposta a destra">›</button></div>
      <div id="status"></div><div id="hostbar"></div>`;
  },
  reveal:()=>{
    const S=state;
    const gs=Object.entries(S.guesses).map(([id,v])=>{const p=playerOf(id);return{id,v,name:p.name,uid:p.uid,color:p.color||'#fff'}});
    const sorted=[...gs].sort((a,b)=>(S.pts[b.id]||0)-(S.pts[a.id]||0)||Math.abs(a.v-S.target)-Math.abs(b.v-S.target));
    const bulls=sorted.filter(g=>S.pts[g.id]===4).map(g=>esc(g.name));
    const rows=sorted.map((g,i)=>`<div class="ri anim ${S.pts[g.id]?'':'zero'} ${S.pts[g.id]===4?'top':''}" style="animation-delay:${(1.7+i*.12).toFixed(2)}s">${av(g)}<div>${nm(g)}<br><span class="m">${Math.abs(g.v-S.target)} di distanza</span></div><b class="pts">+${S.pts[g.id]||0}</b></div>`).join('');
    const pp=playerOf(S.psychicId),last=S.round+1>=S.total,dl=(1.7+sorted.length*.12).toFixed(2);
    return`<div class="cluebox"><div class="lbl">Indizio di ${nm(pp)}</div><div class="clue">“${esc(S.clue)}”</div></div>
      ${dial({zones:true,target:S.target,guesses:gs,cover:'opening'})}
      <div id="ends"></div>
      ${bulls.length?`<div class="bull">🎯 Centro${bulls.length>1?'':' di '+bulls[0]}!</div>`:''}
      <div class="res">${rows||'<p class="hint">Nessuno ha risposto.</p>'}<div class="ri anim psyrow" style="animation-delay:${dl}s">${av(pp)}<div>${nm(pp)}<br><span class="m">Sensitivo · media del gruppo</span></div><b class="pts">+${S.pts[S.psychicId]||0}</b></div></div>
      ${isHost?`<button class="btn primary big" data-a="next">${last?'Vedi la classifica 🏆':'Prossimo round →'}</button>`:`<p class="wait">In attesa dell'host…</p>`}`;
  },
  end:()=>{
    const S=state,sorted=[...S.players].sort((a,b)=>b.score-a.score);
    const top=[sorted[1],sorted[0],sorted[2]],cls=['p2','p1','p3'],delay=[.9,1.4,.5],medal=['🥈','🥇','🥉'];
    const pod=top.map((p,i)=>p?`<div class="pod ${cls[i]}" style="--d:${delay[i]}s">${i===1?'<div class="crown">👑</div>':''}${av(p,'lg')}<div class="nm">${nm(p)}</div><div class="col"><small>${medal[i]}</small>${p.score}</div></div>`:'').join('');
    const rest=sorted.slice(3).map((p,i)=>`<div class="ri" style="animation-delay:${(1.8+i*.1).toFixed(2)}s"><span class="pos">${i+4}</span>${av(p)}${nm(p)}<b>${p.score}</b></div>`).join('');
    return`<h2>Classifica finale</h2><p class="hint">Chi è più in sintonia con il gruppo?</p><div class="podium">${pod}</div>${rest?`<div class="res rest">${rest}</div>`:''}
      <button class="btn big sharebtn" data-go="share">📸 Condividi il risultato</button>
      <button class="btn primary big" data-a="rematch" id="rematchBtn" style="margin-top:10px">🔁 Rivincita</button>
      <div id="rematchst"></div>
      ${isHost?`<button class="btn ghost big" data-a="again" style="margin-top:10px">Cambia giocatori o regole</button>`:''}
      <button class="btn ghost big" data-a="exit-end" style="margin-top:10px">Torna alla home</button>`;
  }
};

function renderTop(){
  const S=state,sorted=[...S.players].sort((a,b)=>b.score-a.score),inGame=S.phase!=='lobby';
  const changed=S.players.filter(p=>prevScores[p.id]!=null&&p.score>prevScores[p.id]).map(p=>p.id);
  if(changed.length){bumpSet=new Set(changed);bumpPhase=S.phase}else if(S.phase!==bumpPhase)bumpSet=new Set();
  prevScores=Object.fromEntries(S.players.map(p=>[p.id,p.score]));
  const pct=S.total?Math.min(100,(S.round+1)/S.total*100):0;
  $('#top').innerHTML=`<div class="bar g3"><button class="exit" data-a="exit" aria-label="Esci dalla partita"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>Esci</button><button class="codechip" data-a="copy" aria-label="Condividi il codice ${esc(code)}">🔗 ${esc(code)}</button>${soundBtn('iconbtn sm sndb')}</div>${inGame&&S.phase!=='end'?`<div class="rndrow"><span class="rnd">Round ${Math.min(S.round+1,S.total)}/${S.total}<span class="prog"><span style="width:${pct}%"></span></span></span></div>`:''}
  ${inGame?`<div class="scores">${sorted.map(p=>`<span class="sc ${online.has(p.id)?'':'off'} ${p.id===S.psychicId&&S.phase!=='end'?'psy':''} ${bumpSet.has(p.id)?'bump':''}">${av(p,'sm')}${nm(p)} <b>${p.score}</b></span>`).join('')}</div>`:''}`;
}
function render(){
  if(!state||!code)return;
  const S=state;
  if($('#tabs').innerHTML){$('#tabs').innerHTML='';document.body.classList.remove('has-tabs')}
  if(guessRound!==S.round){myGuess=50;clueDraft='';guessRound=S.round;liveMap={}}
  renderTop();
  const psy=S.psychicId===me.id,confirmed=S.guesses&&S.guesses[me.id]!=null;
  const key=[S.phase,S.round,psy?'P':'G',isHost?'H':'',S.phase==='clue'&&psy?S.card.join('|'):'',S.phase==='guess'&&!psy?confirmed:''].join('#');
  if(key!==lastKey){
    const prevPhase=lastKey.split('#')[0];
    lastKey=key;
    $('#app').innerHTML=(VIEWS[S.phase]||VIEWS.lobby)();
    enterAnim();lastCard='';
    bindDial();
    const ci=$('#clue');if(ci){ci.oninput=e=>clueDraft=e.target.value;ci.onkeydown=e=>{if(e.key==='Enter')act('clue')}}
    const qr=$('#qr');if(qr&&window.QRCode){try{new QRCode(qr,{text:inviteLink(),width:150,height:150,colorDark:'#120f1f',colorLight:'#ffffff'})}catch(e){}}
    if(S.phase==='reveal'&&prevPhase!=='reveal'){buzz([20,60,20]);const anyBull=Object.values(S.guesses).some(v=>scoreFor(Math.abs(v-S.target))===4);SFX.reveal(Object.keys(S.guesses).length,anyBull);if(anyBull)confetti(150,1900)}
    if(S.phase==='end'&&prevPhase!=='end'){confetti(200,1500);SFX.fanfare(1.2);setTimeout(()=>confetti(120),2600);if(window.recordMatch)recordMatch()}
    if(S.phase==='clue'&&psy&&prevPhase!=='clue'){buzz(30);SFX.chime()}
  }
  updateDyn();
}
function updateDyn(){
  const S=state;
  const ends=$('#ends');if(ends&&S.card){const k=S.card.join('|');ends.innerHTML=`<span>${esc(S.card[0])}</span><span>${esc(S.card[1])}</span>`;if(lastCard&&lastCard!==k){ends.classList.remove('swap');void ends.offsetWidth;ends.classList.add('swap')}lastCard=k}
  const pl=$('#plist');if(pl){pl.innerHTML=S.players.map(p=>{const isNew=!seenPlayers.has(p.id);return`<div class="pl ${online.has(p.id)?'':'off'} ${isNew?'new':''}">${av(p)}<span>${nm(p)}</span>${p.id===S.hostId?'<em>host</em>':''}${p.id===me.id?'<em>tu</em>':''}${isHost&&!online.has(p.id)&&p.id!==S.hostId?`<button class="x" data-a="kick" data-id="${p.id}">rimuovi</button>`:''}</div>`}).join('');if(seenPlayers.size&&S.players.some(p=>!seenPlayers.has(p.id)&&p.id!==me.id))SFX.join();S.players.forEach(p=>seenPlayers.add(p.id))}
  const lp=$('#laps');if(lp)lp.innerHTML=[1,2,3].map(v=>`<button data-a="laps" data-v="${v}" class="${S.laps===v?'on':''}">${v}×</button>`).join('');
  const rb=$('#rematchBtn');if(rb){const votes=(S.rematch||[]).filter(id=>S.players.some(p=>p.id===id)),mine=votes.includes(me.id);
    rb.disabled=!isHost&&mine;rb.textContent=isHost?(votes.filter(v=>v!==me.id).length?(n=>`🔁 Rivincita · ${n} ${n===1?'pronto':'pronti'}`)(votes.filter(v=>v!==me.id).length):'🔁 Rivincita'):mine?'Pronto! Aspetto gli altri…':'🔁 Rivincita';
    const rs=$('#rematchst');if(rs)rs.innerHTML=votes.length?`<p class="hint" style="margin:10px 0 0">Vogliono la rivincita:</p><div class="chips" style="margin-top:6px">${votes.map(id=>{const p=playerOf(id);return`<span class="chip done">${av(p,'sm')}${nm(p)}</span>`}).join('')}</div>${isHost?'':'<p class="hint" style="margin-top:6px">Si riparte quando sono pronti tutti o quando l\'host conferma</p>'}`:''}
  const startB=$('#startBtn');if(startB){const few=S.players.length<2;startB.disabled=few;startB.textContent=few?'Servono almeno 2 giocatori':`Inizia la partita (${S.players.length} giocatori)`}
  const st=$('#status');if(st){const gs=S.players.filter(p=>p.id!==S.psychicId);st.innerHTML=`<div class="chips">${gs.map(p=>{const d=S.guesses[p.id]!=null;return`<span class="chip ${d?'done':''} ${online.has(p.id)?'':'off'}">${av(p,'sm')}${nm(p)} <span class="st">${d?'✅':'⏳'}</span></span>`}).join('')}</div>`}
  paintLive();
  if(window.renderInviteFriends)renderInviteFriends();
  const hb=$('#hostbar');if(hb)hb.innerHTML=isHost?`${S.phase==='guess'&&Object.keys(S.guesses).length?'<button class="btn ghost sm" data-a="reveal">Rivela ora</button>':''}<button class="btn ghost sm" data-a="skip">Salta round</button>`:'';
}

// ===== Azioni UI =====
async function copyLink(){const link=inviteLink();if(navigator.share){try{await navigator.share({title:'Sintonia',text:'Entra nella mia stanza di Sintonia: '+code,url:link});return}catch(e){if(e&&e.name==='AbortError')return}}try{await navigator.clipboard.writeText(link);toast('Link copiato!')}catch(e){prompt('Copia il link:',link)}}
function act(a,el){
  switch(a){
    case 'copy':copyLink();break;
    case 'exit':if(confirm(isHost?"Sei l'host: se esci la partita si ferma per tutti (potrai riprenderla dalla home). Uscire?":'Uscire dalla stanza?')){leave();goHome()}break;
    case 'start':buzz(30);send({type:'start'});break;
    case 'laps':send({type:'laps',v:+el.dataset.v});break;
    case 'kick':send({type:'kick',id:el.dataset.id});break;
    case 'reroll':send({type:'reroll'});break;
    case 'clue':{const ci=$('#clue');const c=ci?ci.value.trim():'';if(!c){toast('Scrivi un indizio');return}buzz(20);SFX.whoosh();send({type:'clue',clue:c});break}
    case 'm':myGuess=Math.max(0,myGuess-1);SFX.tick();setNeedle(myGuess);sendLive();break;
    case 'p':myGuess=Math.min(100,myGuess+1);SFX.tick();setNeedle(myGuess);sendLive();break;
    case 'guess':buzz(25);SFX.pop();send({type:'guess',v:myGuess});break;
    case 'unguess':send({type:'unguess'});break;
    case 'reveal':send({type:'reveal'});break;
    case 'skip':if(confirm('Saltare questo round? Nessuno prende punti.'))send({type:'skip'});break;
    case 'next':send({type:'next'});break;
    case 'again':send({type:'again'});break;
    case 'rematch':buzz(20);SFX.pop();send({type:'rematch'});break;
    case 'exit-end':leave();goHome();break;
  }
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(b&&!b.disabled)act(b.dataset.a,b)});
document.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b&&!b.disabled&&window.go)go(b.dataset.go,b)});
