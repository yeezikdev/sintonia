// ===== Sintonia · suoni ed effetti (sintetizzati, nessun file audio) =====
const SFX=(()=>{
  let ctx=null,master=null,on=ls.get('sintonia_sound')!==false,lastTick=0;
  const ensure=()=>{
    if(!on)return null;
    try{
      if(!ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;ctx=new C();master=ctx.createGain();master.gain.value=.55;master.connect(ctx.destination)}
      if(ctx.state==='suspended')ctx.resume();
      return ctx;
    }catch(e){return null}
  };
  // sblocco audio su iPhone al primo tocco
  ['pointerdown','touchstart','keydown'].forEach(ev=>window.addEventListener(ev,()=>{ensure()},{once:true,passive:true}));
  const tone=(freq,{t=0,dur=.12,type='sine',vol=.3,slide=0,attack=.005}={})=>{
    const c=ensure();if(!c)return;const s=c.currentTime+t;
    const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(freq,s);
    if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,freq*slide),s+dur);
    g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(vol,s+attack);g.gain.exponentialRampToValueAtTime(.0001,s+dur);
    o.connect(g);g.connect(master);o.start(s);o.stop(s+dur+.05);
  };
  const noise=({t=0,dur=.3,vol=.2,from=800,to=3000,q=.8}={})=>{
    const c=ensure();if(!c)return;const s=c.currentTime+t,n=Math.floor(c.sampleRate*dur);
    const b=c.createBuffer(1,n,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;
    const src=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();src.buffer=b;f.type='bandpass';f.Q.value=q;
    f.frequency.setValueAtTime(from,s);f.frequency.exponentialRampToValueAtTime(to,s+dur);
    g.gain.setValueAtTime(vol,s);g.gain.exponentialRampToValueAtTime(.0001,s+dur);
    src.connect(f);f.connect(g);g.connect(master);src.start(s);src.stop(s+dur);
  };
  const notes=[523.25,659.25,783.99,1046.5,1318.5];
  return{
    get on(){return on},
    toggle(){on=!on;ls.set('sintonia_sound',on);if(on){ensure();this.pop()}return on},
    tick(){const now=performance.now();if(now-lastTick<28)return;lastTick=now;tone(2400,{dur:.025,type:'square',vol:.05})},
    tap(){tone(660,{dur:.06,type:'triangle',vol:.12})},
    pop(){tone(520,{dur:.12,type:'sine',vol:.28,slide:1.9})},
    whoosh(){noise({dur:.35,vol:.18,from:400,to:4000})},
    join(){tone(587,{dur:.1,vol:.2});tone(880,{t:.08,dur:.16,vol:.2})},
    chime(){tone(880,{dur:.25,type:'triangle',vol:.22});tone(1318.5,{t:.12,dur:.4,type:'triangle',vol:.18})},
    drum(t=0,dur=1){for(let i=0,n=Math.round(dur*22);i<n;i++)noise({t:t+i/22,dur:.06,vol:.05+.12*(i/n),from:180,to:120,q:.5});tone(90,{t:t+dur,dur:.3,vol:.35,slide:.5})},
    ding(i=0,t=0){tone(notes[i%notes.length],{t,dur:.35,type:'triangle',vol:.22})},
    bull(t=0){[0,4,7,12].forEach((s,i)=>tone(523.25*Math.pow(2,s/12),{t:t+i*.09,dur:.5,type:'triangle',vol:.25}));noise({t:t+.3,dur:.6,vol:.08,from:3000,to:8000,q:.3})},
    fanfare(t=0){[[0,.0],[4,.14],[7,.28],[12,.42],[7,.62],[12,.76]].forEach(([s,d],i)=>tone(392*Math.pow(2,s/12),{t:t+d,dur:i===5?.9:.22,type:'sawtooth',vol:.09}));[0,4,7].forEach(s=>tone(392*Math.pow(2,(s+12)/12),{t:t+.76,dur:1.1,type:'triangle',vol:.12}))},
    // sequenza completa della rivelazione: tamburo mentre si apre lo sportello, un ding per ogni lancetta, festa se c'è un centro
    reveal(n,bull){this.drum(.2,1);for(let i=0;i<n;i++)this.ding(i,1.25+i*.16);if(bull)this.bull(1.9)}
  };
})();
const soundIcon=()=>SFX.on
  ?'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>'
  :'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M22 9l-6 6M16 9l6 6"/></svg>';
const soundBtn=(cls='iconbtn')=>`<button type="button" class="${cls} sndbtn" data-go="sound" aria-label="${SFX.on?'Disattiva i suoni':'Attiva i suoni'}">${soundIcon()}</button>`;
