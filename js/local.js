// ===== Sintonia · modalità offline: un solo telefono che passa di mano =====
let L=null,lsetup=null,statsTab='online';
ICON.phone='<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/></svg>';
ICON.swap='<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h11l-3-3M17 17H6l3 3"/></svg>';
const LMODES={solo:{t:'Ognuno per sé',d:'Ognuno sceglie in segreto. Classifica individuale.'},team:{t:'Tutti insieme',d:'Decidete insieme la lancetta. Punteggio di squadra.'}};

function myLocalName(){return profile?profile.username:(guestSaved.raw||'')}
function initSetup(){
  const saved=ls.get('sintonia_local')||{};
  const others=(saved.names||[]).filter(Boolean);
  lsetup={mode:saved.mode==='team'?'team':'solo',laps:[1,2,3].includes(saved.laps)?saved.laps:1,names:[myLocalName()],recent:others.slice(0,20)};
}

// ----- schermata di preparazione -----
SCREENS.localsetup=()=>{
  if(!lsetup)initSetup();
  const S=lsetup,n=S.names.length;
  return`
  <div class="topline"><button type="button" class="iconbtn" data-go="back" aria-label="Indietro">${ICON.back}</button><b class="ttl">Un solo telefono</b><span style="width:44px"></span></div>
  <p class="sub tc">Giocate tutti con questo telefono: ve lo passate a turno quando tocca a voi.</p>
  <h3>Giocatori</h3>
  <div class="flist" id="lnames">${S.names.map((v,i)=>{const col=COLORS[i%COLORS.length];
    if(i===0)return profile?`<div class="frow lname">${av({name:profile.username,color:col})}<div class="fi"><b>${nm(profile)}</b><small>Sei tu</small></div></div>`
      :`<div class="frow lname">${av({name:v||'?',color:col})}<input class="lnin" data-i="0" maxlength="14" placeholder="Il tuo nome" value="${esc(v)}" autocomplete="off" aria-label="Il tuo nome"><small class="youtag">tu</small></div>`;
    return`<div class="frow lname">${av({name:v,color:col})}<div class="fi"><b>${esc(v)}</b></div><button type="button" class="iconbtn sm" data-go="l-del" data-i="${i}" aria-label="Togli ${esc(v)}">${ICON.x}</button></div>`}).join('')}</div>
  ${n<2?'<p class="hint" style="margin:10px 0 0">Aggiungi almeno un altro giocatore per iniziare</p>':''}
  ${n<12?`<button type="button" class="btn ghost big addp" data-go="l-add">${ICON.plus}Aggiungi giocatore</button>`:''}
  <h3>Modalità</h3>
  <div class="modes">${Object.entries(LMODES).map(([k,m])=>`<button type="button" class="mode ${S.mode===k?'on':''}" data-go="l-mode" data-m="${k}"><b>${m.t}</b><small>${m.d}</small></button>`).join('')}</div>
  <div class="setting"><span>Volte che ognuno fa il Sensitivo</span><div class="seg">${[1,2,3].map(v=>`<button type="button" data-go="l-laps" data-v="${v}" class="${S.laps===v?'on':''}">${v}×</button>`).join('')}</div></div>
  <button type="button" class="btn primary big" data-go="l-start">Inizia la partita</button>
  <p class="hint" style="margin-top:12px">Le partite su un solo telefono non vengono salvate nelle statistiche.</p>`;
};
BIND.localsetup=()=>{document.querySelectorAll('.lnin').forEach(i=>{i.oninput=()=>{lsetup.names[+i.dataset.i]=i.value;const a=i.parentElement.querySelector('.av');if(a)a.textContent=(i.value||String(+i.dataset.i+1))[0].toUpperCase()}})};

function addLocalName(raw,fromChip){
  const n=String(raw||'').trim().slice(0,14);
  if(!n){toast('Scrivi un nome');return false}
  if(lsetup.names.some(x=>x.trim().toLowerCase()===n.toLowerCase())){toast(`${n} è già in partita`);return false}
  if(lsetup.names.length>=12){toast('Massimo 12 giocatori');return false}
  lsetup.names.push(n);buzz(12);if(typeof SFX!=='undefined')SFX.tap();
  if(view==='localsetup')refresh();
  const m=document.querySelector('.modal.addp-m');if(m)drawAddPlayer(m);
  return true;
}
function drawAddPlayer(m){
  const added=lsetup.names.slice(1).filter(Boolean),recent=(lsetup.recent||[]).filter(r=>!lsetup.names.some(x=>x.toLowerCase()===r.toLowerCase())).slice(0,8);
  m.querySelector('#addlist').innerHTML=(added.length?`<div class="chips left" style="margin:0 0 12px">${added.map((x,i)=>`<span class="chip done">${av({name:x,color:COLORS[(i+1)%COLORS.length]},'sm')}${esc(x)}</span>`).join('')}</div>`:'')
    +(recent.length?`<p class="lbl" style="margin:14px 0 8px">Hanno già giocato</p><div class="chips left" style="margin:0">${recent.map(r=>`<button type="button" class="sugchip" data-go="l-quick" data-n="${esc(r)}">+ ${esc(r)}</button>`).join('')}</div>`:'');
}
function openAddPlayer(){
  if(lsetup.names.length>=12){toast('Massimo 12 giocatori');return}
  const m=document.createElement('div');m.className='modal addp-m';
  m.innerHTML=`<div class="sheet" role="dialog" aria-label="Aggiungi giocatore"><div class="grab"></div>
    <h2 style="text-align:left;margin:4px 0 4px">Aggiungi un giocatore</h2>
    <p class="hint" style="text-align:left;margin:0 0 14px">Scrivi il nome e premi Aggiungi. Puoi aggiungerne quanti vuoi, poi tocca Fatto.</p>
    <form id="addform"><input id="addname" maxlength="14" placeholder="Nome del giocatore" autocomplete="off" autocapitalize="words">
    <button type="submit" class="btn primary big" style="margin-top:12px">${ICON.plus}Aggiungi</button></form>
    <div id="addlist" style="margin-top:14px"></div>
    <button type="button" class="btn ghost big close" style="margin-top:12px">Fatto</button></div>`;
  const close=()=>{m.classList.add('closing');setTimeout(()=>m.remove(),200)};
  m.addEventListener('click',e=>{if(e.target===m||e.target.closest('.close'))close()});
  const i=m.querySelector('#addname');
  m.querySelector('#addform').onsubmit=e=>{e.preventDefault();if(addLocalName(i.value)){i.value='';i.focus()}};
  document.body.appendChild(m);drawAddPlayer(m);setTimeout(()=>i.focus(),300);
}
function startLocal(){
  const S=lsetup;
  const names=S.names.map(x=>x.trim()).filter(Boolean);
  if(names.length<2){toast('Servono almeno 2 giocatori');return}
  const low=names.map(x=>x.toLowerCase());
  if(new Set(low).size!==low.length){toast('Ci sono due giocatori con lo stesso nome');return}
  ls.set('sintonia_local',{mode:S.mode,laps:S.laps,names:names.slice(profile?1:0)});
  if(!profile&&names[0]){guestSaved.raw=guestSaved.raw||names[0];ls.set('sintonia_guest',guestSaved)}
  const meFirst=!!profile&&S.names[0]===profile.username;
  L={mode:S.mode,players:names.map((n,i)=>({id:'p'+i,name:n,color:COLORS[i%COLORS.length],score:0,me:meFirst&&i===0,uid:meFirst&&i===0?profile.id:null})),
     order:shuffle(names.map((_,i)=>i)),laps:S.laps,round:0,team:0,used:[],history:[],matchId:uuid(),saved:false};
  L.total=L.players.length*L.laps;
  startLocalRound();show('local');buzz(30);
}
function startLocalRound(){
  const n=L.players.length;L.psy=L.order[L.round%n];
  if(L.used.length>=CARDS.length)L.used=[];let k;do{k=Math.floor(Math.random()*CARDS.length)}while(L.used.includes(k));L.used.push(k);
  L.card=CARDS[k];L.target=Math.round(3+Math.random()*94);L.clue='';L.guesses={};L.pts={};
  L.queue=L.mode==='team'?['team']:shuffle(L.players.map((_,i)=>i).filter(i=>i!==L.psy));
  L.phase='pass-psy';
}
const LP=i=>L.players[i];
function lReveal(){
  L.pts={};
  if(L.mode==='team'){const p=scoreFor(Math.abs(L.guesses.team-L.target));L.pts.team=p;L.team+=p}
  else{let sum=0,c=0;for(const [i,v] of Object.entries(L.guesses)){const p=scoreFor(Math.abs(v-L.target));L.pts[i]=p;LP(+i).score+=p;sum+=p;c++}const ps=c?Math.round(sum/c):0;L.pts.psy=ps;LP(L.psy).score+=ps}
  L.history.push({psy:L.psy,clue:L.clue,card:L.card.join(' ↔ '),target:L.target,guesses:{...L.guesses},pts:{...L.pts}});
  L.phase='reveal';
}

// ----- schermate di gioco -----
const passScreen=(p,line,btn)=>`<div class="pass">
  <div class="passicon">${ICON.swap}</div>
  <p class="lbl tc">Passa il telefono a</p>
  ${av(p,'xl')}
  <h1 class="headline tc">${nm(p)}</h1>
  <p class="sub tc">${line}</p>
  <button type="button" class="btn primary big" data-go="l-next">${btn}</button>
  <p class="hint">Gli altri non devono guardare lo schermo 🙈</p></div>`;
const lEnds=()=>`<div id="ends"><span>${esc(L.card[0])}</span><span>${esc(L.card[1])}</span></div>`;
const lClue=()=>`<div class="cluebox"><div class="lbl">Indizio di ${nm(LP(L.psy))}</div><div class="clue">${L.clue?`“${esc(L.clue)}”`:'<span class="voice">Detto a voce</span>'}</div></div>`;
const L_VIEWS={
  'pass-psy':()=>passScreen(LP(L.psy),'è il Sensitivo di questo round: solo lui deve vedere il bersaglio.','Sono io, mostra il bersaglio'),
  psy:()=>`<div class="role psy">${nm(LP(L.psy))}, sei il Sensitivo 🔮</div>
    <p class="hint">Il bersaglio è nella zona colorata. Scrivi un indizio, oppure dillo a voce agli altri.</p>
    ${dial({zones:true,target:L.target,cover:'opening'})}${lEnds()}
    <input id="lclue" maxlength="60" placeholder="Il tuo indizio (facoltativo)" value="${esc(L.clue)}" autocomplete="off">
    <div class="row"><button type="button" class="btn ghost" data-go="l-reroll">🔄 Cambia carta</button><button type="button" class="btn primary" data-go="l-clue">Nascondi e passa</button></div>`,
  'pass-g':()=>passScreen(LP(L.queue[0]),'tocca a te indovinare dove si trova il bersaglio.','Sono io, fammi indovinare'),
  'pass-team':()=>`<div class="pass"><div class="passicon">${ICON.swap}</div><p class="lbl tc">Ora tocca alla squadra</p><h1 class="headline tc">Mettete il telefono<br>al centro</h1><p class="sub tc">Discutete e decidete insieme dove sta il bersaglio. Il Sensitivo può solo guardare, senza suggerire!</p><button type="button" class="btn primary big" data-go="l-next">Pronti</button></div>`,
  guess:()=>{const team=L.queue[0]==='team',p=team?null:LP(L.queue[0]);
    return`${lClue()}<p class="role">${team?'Dove sta il bersaglio?':nm(p)+', dove sta?'}</p>
    ${dial({cover:'closed',interactive:true,needle:myGuess,color:team?'#ffd23f':p.color})}${lEnds()}
    <div class="row"><button type="button" class="btn ghost sq" data-a="m" aria-label="Sposta a sinistra">‹</button><button type="button" class="btn primary" data-go="l-guess">Conferma</button><button type="button" class="btn ghost sq" data-a="p" aria-label="Sposta a destra">›</button></div>
    ${team?'':`<p class="hint" style="margin-top:12px">Ancora ${L.queue.length-1} ${L.queue.length-1===1?'giocatore':'giocatori'} dopo di te</p>`}`},
  'pass-reveal':()=>`<div class="pass"><div class="passicon">${ICON.swap}</div><p class="lbl tc">Hanno risposto tutti</p><h1 class="headline tc">Riunitevi tutti<br>intorno al telefono</h1><p class="sub tc">Ora si scopre dove stava il bersaglio.</p><button type="button" class="btn primary big" data-go="l-reveal">Rivela il bersaglio</button></div>`,
  reveal:()=>{
    const last=L.round+1>=L.total;
    if(L.mode==='team'){const v=L.guesses.team,p=L.pts.team;
      return`${lClue()}${dial({zones:true,target:L.target,guesses:[{v,name:'S',color:'#ffd23f'}],cover:'opening'})}${lEnds()}
      ${p===4?'<div class="bull">🎯 Centro pieno!</div>':''}
      <div class="res"><div class="ri anim ${p?'':'zero'} ${p===4?'top':''}" style="animation-delay:1.7s"><span class="av" style="--c:#ffd23f">★</span><div>La squadra<br><span class="m">${Math.abs(v-L.target)} di distanza</span></div><b class="pts">+${p}</b></div></div>
      <button type="button" class="btn primary big" data-go="l-nextround">${last?'Vedi il risultato 🏆':'Prossimo round →'}</button>`}
    const gs=Object.entries(L.guesses).map(([i,v])=>({i:+i,v,...LP(+i)})).sort((a,b)=>(L.pts[b.i]||0)-(L.pts[a.i]||0)||Math.abs(a.v-L.target)-Math.abs(b.v-L.target));
    const bulls=gs.filter(g=>L.pts[g.i]===4);
    return`${lClue()}${dial({zones:true,target:L.target,guesses:gs,cover:'opening'})}${lEnds()}
      ${bulls.length?`<div class="bull">🎯 Centro${bulls.length>1?'':' di '+nm(bulls[0])}!</div>`:''}
      <div class="res">${gs.map((g,k)=>`<div class="ri anim ${L.pts[g.i]?'':'zero'} ${L.pts[g.i]===4?'top':''}" style="animation-delay:${(1.7+k*.12).toFixed(2)}s">${av(g)}<div>${nm(g)}<br><span class="m">${Math.abs(g.v-L.target)} di distanza</span></div><b class="pts">+${L.pts[g.i]||0}</b></div>`).join('')}
      <div class="ri anim psyrow" style="animation-delay:${(1.7+gs.length*.12).toFixed(2)}s">${av(LP(L.psy))}<div>${nm(LP(L.psy))}<br><span class="m">Sensitivo · media del gruppo</span></div><b class="pts">+${L.pts.psy||0}</b></div></div>
      <button type="button" class="btn primary big" data-go="l-nextround">${last?'Vedi la classifica 🏆':'Prossimo round →'}</button>`},
  end:()=>{
    const again=`<button type="button" class="btn big sharebtn" data-go="share">📸 Condividi il risultato</button><button type="button" class="btn primary big" data-go="l-again" style="margin-top:10px">🔁 Rivincita</button><button type="button" class="btn ghost big" data-go="l-home" style="margin-top:10px">Torna alla home</button>`;
    if(L.mode==='team'){const max=L.total*4,pct=Math.round(L.team/max*100);
      const verdict=pct>=75?'Mente alveare! 🧠':pct>=55?'Ottima sintonia!':pct>=35?'Non male, ci siete quasi':'Serve più allenamento 😅';
      return`<h2>Risultato della squadra</h2><p class="hint">${verdict}</p>
        <div class="teamscore"><b>${L.team}</b><span>su ${max} punti</span><div class="lvbar big"><span style="width:${pct}%"></span></div></div>
        <div class="chips" style="margin-bottom:22px">${L.players.map(p=>`<span class="chip">${av(p,'sm')}${nm(p)}</span>`).join('')}</div>${again}`}
    const sorted=[...L.players].sort((a,b)=>b.score-a.score);
    const top=[sorted[1],sorted[0],sorted[2]],cls=['p2','p1','p3'],delay=[.9,1.4,.5],medal=['🥈','🥇','🥉'];
    const pod=top.map((p,i)=>p?`<div class="pod ${cls[i]}" style="--d:${delay[i]}s">${i===1?'<div class="crown">👑</div>':''}${av(p,'lg')}<div class="nm">${nm(p)}</div><div class="col"><small>${medal[i]}</small>${p.score}</div></div>`:'').join('');
    const rest=sorted.slice(3).map((p,i)=>`<div class="ri" style="animation-delay:${(1.8+i*.1).toFixed(2)}s"><span class="pos">${i+4}</span>${av(p)}${nm(p)}<b>${p.score}</b></div>`).join('');
    return`<h2>Classifica finale</h2><p class="hint">Chi è più in sintonia con il gruppo?</p><div class="podium">${pod}</div>${rest?`<div class="res rest">${rest}</div>`:''}${again}`}
};
SCREENS.local=()=>L?L_VIEWS[L.phase]():'';
BIND.local=()=>{
  if(!L)return goHome();
  const S=L,pct=Math.min(100,(S.round+1)/S.total*100);
  const scores=S.mode==='team'?`<span class="sc"><span class="av sm" style="--c:#ffd23f">★</span>Squadra <b>${S.team}</b></span>`:[...S.players].sort((a,b)=>b.score-a.score).map(p=>`<span class="sc ${S.players.indexOf(p)===S.psy&&S.phase!=='end'?'psy':''}">${av(p,'sm')}${nm(p)} <b>${p.score}</b></span>`).join('');
  $('#top').innerHTML=`<div class="bar"><span class="codechip">${ICON.phone.replace('width="28" height="28"','width="16" height="16"')} Offline</span>${S.phase!=='end'?`<span class="rnd">Round ${Math.min(S.round+1,S.total)}/${S.total}<span class="prog"><span style="width:${pct}%"></span></span></span>`:''}${soundBtn('iconbtn sm sndb')}<button class="exit" data-go="l-exit" aria-label="Esci dalla partita"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>Esci</button></div><div class="scores">${scores}</div>`;
  bindDial();
  const ci=$('#lclue');if(ci){ci.oninput=()=>{L.clue=ci.value};ci.onkeydown=e=>{if(e.key==='Enter')go('l-clue')}}
  if(S.phase==='reveal'){SFX.reveal(S.mode==='team'?1:Object.keys(S.guesses).length,S.mode==='team'?S.pts.team===4:Object.entries(S.pts).some(([k,v])=>k!=='psy'&&v===4));buzz([20,60,20]);if(Object.values(S.pts).includes(4)&&(S.mode==='team'?S.pts.team===4:Object.entries(S.pts).some(([k,v])=>k!=='psy'&&v===4)))confetti(150,1900)}
  if(S.phase==='end'){confetti(200,1200);SFX.fanfare(1)}
  if(/^pass/.test(S.phase))SFX.whoosh();
};
function lgo(phase){L.phase=phase;$('#app').innerHTML=SCREENS.local();enterAnim();BIND.local();window.scrollTo(0,0)}

// ----- azioni -----
const LOCAL_GO={
  local:()=>{initSetup();show('localsetup')},
  'l-add':()=>openAddPlayer(),
  'l-quick':el=>{addLocalName(el.dataset.n,true)},
  'l-del':el=>{lsetup.names.splice(+el.dataset.i,1);refresh()},
  'l-mode':el=>{lsetup.mode=el.dataset.m;refresh()},
  'l-laps':el=>{lsetup.laps=+el.dataset.v;refresh()},
  'l-start':()=>startLocal(),
  'l-next':()=>{if(L.phase==='pass-psy')lgo('psy');else{myGuess=50;lgo('guess')}},
  'l-reroll':()=>{let k;do{k=Math.floor(Math.random()*CARDS.length)}while(L.used.includes(k));L.used.push(k);L.card=CARDS[k];const e=$('#ends');if(e){e.innerHTML=`<span>${esc(L.card[0])}</span><span>${esc(L.card[1])}</span>`;e.classList.remove('swap');void e.offsetWidth;e.classList.add('swap')}},
  'l-clue':()=>{const ci=$('#lclue');L.clue=ci?ci.value.trim().slice(0,60):'';buzz(20);lgo(L.mode==='team'?'pass-team':'pass-g')},
  'l-guess':()=>{buzz(25);SFX.pop();L.guesses[L.queue[0]]=myGuess;L.queue.shift();lgo(L.queue.length?'pass-g':'pass-reveal')},
  'l-reveal':()=>{lReveal();lgo('reveal')},
  'l-nextround':()=>{L.round++;if(L.round>=L.total)lgo('end');else{startLocalRound();lgo('pass-psy')}},
  'l-again':()=>{const names=L.players.map(p=>p.name);lsetup={mode:L.mode,laps:L.laps,names};startLocal()},
  'l-home':()=>{L=null;goHome()},
  'l-exit':()=>{if(L.phase==='end'||confirm('Uscire dalla partita? I punti di questa partita andranno persi.')){L=null;goHome()}},
  stab:el=>{statsTab=el.dataset.t;refresh()}
};
function localGuard(){
  if(view==='local'&&L&&L.phase!=='end'){
    if(confirm('Uscire dalla partita? I punti di questa partita andranno persi.')){L=null;return false}
    return true;
  }
  return false;
}

