import re
wa=re.search(r'<svg viewBox="0 0 24 24"><path d="M12 2a10[^"]*"/></svg>',open('/home/user/tintas-laet-site/marketing/stories/2026-11/10-sorteio-dois-ganhadores/story.html').read()).group(0)

CSS='''
@font-face { font-family:'Bebas Neue'; font-weight:400; src:url('fonts/bebas-neue-latin-400-normal.woff2') format('woff2'); }
@font-face { font-family:'Montserrat'; font-weight:700; src:url('fonts/montserrat-latin-700-normal.woff2') format('woff2'); }
@font-face { font-family:'Montserrat'; font-weight:800; src:url('fonts/montserrat-latin-800-normal.woff2') format('woff2'); }
@font-face { font-family:'Poppins'; font-weight:600; src:url('fonts/poppins-latin-600-normal.woff2') format('woff2'); }
@font-face { font-family:'Poppins'; font-weight:700; src:url('fonts/poppins-latin-700-normal.woff2') format('woff2'); }
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { background:#010812; }
.slide { width:1080px; height:1920px; position:relative; overflow:hidden; color:#fff; background:__BG__; }
.grain { position:absolute; inset:0; z-index:30; pointer-events:none; opacity:.09; mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .9 0'/></filter><rect width='220' height='220' filter='url(%23n)'/></svg>"); }
.vig { position:absolute; inset:0; z-index:29; pointer-events:none; background:radial-gradient(ellipse 780px 1100px at 50% 46%, transparent 60%, rgba(0,5,16,.6) 100%); }
#fx { position:absolute; inset:0; z-index:2; } #fx2 { position:absolute; inset:0; z-index:14; pointer-events:none; }
.bk { position:absolute; border-radius:50%; }
.spk { position:absolute; z-index:15; filter:drop-shadow(0 0 10px rgba(255,224,130,.9)); }
.logo { position:absolute; top:128px; left:0; right:0; z-index:10; text-align:center; }
.logo img { height:200px; margin:-48px 0 -42px; object-fit:contain; filter:drop-shadow(0 4px 18px rgba(0,0,0,.4)); }
.chip { position:absolute; top:318px; left:50%; transform:translateX(-50%) rotate(-2deg); z-index:10; white-space:nowrap; background:__CHIP__; color:#fff;
  font:400 46px/1 'Bebas Neue',sans-serif; letter-spacing:.1em; padding:11px 36px 6px; border-radius:10px; box-shadow:0 10px 24px rgba(0,0,0,.4), inset 0 3px 0 rgba(255,255,255,.3); }
.h1 { position:absolute; left:0; right:0; top:384px; padding-top:50px; z-index:10; text-align:center; white-space:nowrap; font:400 __HS__px/.86 'Bebas Neue',sans-serif; letter-spacing:.01em;
  background:linear-gradient(180deg,#FFF3C4 0%,#FFE082 35%,#FFC107 80%); -webkit-background-clip:text; background-clip:text; color:transparent;
  filter:drop-shadow(0 6px 0 #062B63) drop-shadow(0 22px 34px rgba(0,0,0,.55)); }
.masc { position:absolute; left:60px; top:__MT__px; width:1024px; height:1024px; z-index:9; transform:scale(.92); transform-origin:50% 0; filter:drop-shadow(0 30px 34px rgba(0,0,0,.5)); }
.masc img, .masc svg { position:absolute; left:0; top:0; width:1024px; height:1024px; }
.masc .hand { clip-path:inset(438px 130px 520px 733px); }
.cards { position:absolute; left:46px; right:46px; top:1352px; z-index:12; display:flex; gap:22px; }
.cd { flex:1; height:300px; border-radius:26px; padding:22px 26px 0; text-align:center; position:relative; box-shadow:0 26px 46px rgba(0,0,0,.55), inset 0 3px 0 rgba(255,255,255,.45); }
.cd.a { background:linear-gradient(180deg,#FFD54F,#FFC107); color:#062B63; }
.cd.b { background:linear-gradient(180deg,#FFFFFF,#E6EEFB); color:#062B63; }
.cd .w { font:800 29px/1 'Montserrat',sans-serif; letter-spacing:.14em; }
.cd .d { font:400 150px/.95 'Bebas Neue',sans-serif; letter-spacing:.01em; margin-top:2px; }
.cd .t { position:absolute; left:0; right:0; bottom:0; padding:12px 8px 15px; border-radius:0 0 26px 26px; font:800 28px/1 'Montserrat',sans-serif; background:#062B63; color:#fff; }
.cd.a .t b { color:#FFC107; } .cd.b .t b { color:#FFC107; }
.cta { position:absolute; left:50%; top:1676px; transform:translateX(-50%); z-index:12; display:flex; align-items:center; gap:14px; white-space:nowrap;
  background:rgba(2,18,45,.78); border:2px solid rgba(255,224,130,.6); border-radius:60px; padding:14px 34px; font:700 31px/1 'Poppins',sans-serif; box-shadow:0 12px 26px rgba(0,0,0,.5); }
.cta svg { width:38px; height:38px; fill:#FFC107; } .cta b { color:#FFE082; } .cta i { font-style:normal; opacity:.5; }
'''
def build(name, title, bg, chip, chiptxt, h1, hs, mt, deco_css, deco_html, deco_js, masc_over, cards, extra_masc=''):
    css=CSS.replace('__BG__',bg).replace('__CHIP__',chip).replace('__HS__',str(hs)).replace('__MT__',str(mt))
    html=f'''<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080"><title>{title}</title>
<style>{css}{deco_css}</style></head><body>
<div class="slide">
 <div id="fx"></div>{deco_html}
 <div class="logo"><img src="../../../../identidade/logotipo branco-remove-bg-io.png" alt="Tintas Laet"></div>
 <div class="chip">{chiptxt}</div>
 <div class="h1">{h1}</div>
 <div class="masc"><img src="../../../../identidade/mascote-suspense-remove-bg-io.png" alt="Mascote da Laet">{masc_over}</div>
 <div class="cards">{cards}</div>
 <div class="cta">{wa}<span>(11) 97714-0964</span><i>·</i><b>@Tintaslaet</b><i>·</i><span>tintaslaet.com</span></div>
 <div id="fx2"></div><div class="vig"></div><div class="grain"></div>
</div>
<script>
const fx=document.getElementById('fx'),fx2=document.getElementById('fx2'); let s=5; const r=()=>{{s=(s*9301+49297)%233280;return s/233280;}};
const spark=(x,y,sz,c)=>document.querySelector('.slide').insertAdjacentHTML('beforeend',`<svg class="spk" style="left:${{x}}px;top:${{y}}px;width:${{sz}}px;height:${{sz}}px" viewBox="0 0 40 40"><path d="M20 0 C22 14 26 18 40 20 C26 22 22 26 20 40 C18 26 14 22 0 20 C14 18 18 14 20 0Z" fill="${{c}}"/></svg>`);
{deco_js}
</script></body></html>'''
    return html

SANTA='''<svg viewBox="0 0 1024 1024"><defs>
<linearGradient id="red" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E84242"/><stop offset=".55" stop-color="#C62828"/><stop offset="1" stop-color="#8E1313"/></linearGradient>
<radialGradient id="fur" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".7" stop-color="#F1F1F4"/><stop offset="1" stop-color="#C9CED8"/></radialGradient>
<filter id="sh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="#000" flood-opacity=".35"/></filter></defs>
<g filter="url(#sh)">
<path d="M312,282 C290,170 330,90 420,45 C500,10 590,20 660,60 C730,100 770,170 800,262 C770,252 744,238 716,214 L690,214 L662,220 L638,202 L624,178 L520,176 L424,214 L404,262 L372,284 L318,282 Z" fill="url(#red)"/>
<path d="M400,70 C470,30 560,32 620,70 C570,62 500,66 430,100 Z" fill="#fff" opacity=".18"/>
<circle cx="812" cy="282" r="46" fill="url(#fur)"/>
<g transform="rotate(-15 510 135)"><rect x="285" y="102" width="450" height="72" rx="36" fill="url(#fur)"/><circle cx="312" cy="138" r="40" fill="url(#fur)"/><circle cx="712" cy="138" r="40" fill="url(#fur)"/></g>
</g></svg>'''

FLUTE='''<svg viewBox="0 0 1024 1024" style="transform:translate(0,24px)"><defs>
<linearGradient id="gl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".35" stop-color="#DCEBFF" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity=".55"/></linearGradient>
<linearGradient id="champ" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF0A8"/><stop offset="1" stop-color="#F2B705"/></linearGradient></defs>
<g>
 <path d="M772,228 L842,228 C846,318 832,362 807,372 C782,362 768,318 772,228 Z" fill="url(#champ)" opacity=".95"/>
 <path d="M772,228 L842,228 L841,252 L773,252 Z" fill="#FFF8D2"/>
 <path d="M772,222 L842,222 C848,320 832,368 807,378 C782,368 766,320 772,222 Z" fill="url(#gl)" stroke="#fff" stroke-opacity=".8" stroke-width="3"/>
 <path d="M783,236 C781,300 788,340 799,360" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".85"/>
 <rect x="802" y="376" width="10" height="70" rx="4" fill="url(#gl)" stroke="#fff" stroke-opacity=".8" stroke-width="2"/>
 <ellipse cx="807" cy="450" rx="38" ry="10" fill="url(#gl)" stroke="#fff" stroke-opacity=".8" stroke-width="3"/>
 <g fill="#fff" opacity=".9"><circle cx="797" cy="330" r="4"/><circle cx="815" cy="310" r="3.5"/><circle cx="805" cy="285" r="4.5"/><circle cx="822" cy="262" r="3"/><circle cx="792" cy="268" r="3"/><circle cx="810" cy="345" r="3"/></g>
 <g fill="#FFE082"><circle cx="800" cy="196" r="6"/><circle cx="824" cy="178" r="4"/><circle cx="786" cy="170" r="3.5"/></g>
</g></svg>'''

card=lambda cls,w,d,t:f'<div class="cd {cls}"><div class="w">{w}</div><div class="d">{d}</div><div class="t">{t}</div></div>'

# ---------- NATAL
natal_bg="radial-gradient(ellipse 900px 640px at 50% 34%, rgba(52,132,255,.55) 0%, rgba(13,71,161,0) 72%),radial-gradient(ellipse 800px 500px at 50% 80%, rgba(198,40,40,.22) 0%, rgba(198,40,40,0) 70%),linear-gradient(180deg,#0D47A1 0%,#0A3C88 24%,#062B63 56%,#041F4A 80%,#02122D 100%)"
natal_js='''
for(let i=0,n=0;n<14&&i<500;i++){const x=r()*1080,y=200+r()*1400,d=30+r()*70; const b=document.createElement('div'); b.className='bk'; Object.assign(b.style,{left:x+'px',top:y+'px',width:d+'px',height:d+'px',background:r()<.5?'rgba(255,224,130,.15)':'rgba(255,255,255,.12)',filter:`blur(${8+r()*10}px)`}); fx.appendChild(b); n++;}
for(let i=0;i<70;i++){const x=r()*1080,y=r()*1700; if(y<300&&x>380&&x<720) continue; const _=0; const dd=0; ;const d=5+r()*14,bl=r()<.3?3:0; const f=document.createElement('div'); Object.assign(f.style,{position:'absolute',left:x+'px',top:y+'px',width:d+'px',height:d+'px',borderRadius:'50%',background:'#fff',opacity:.5+r()*.5,filter:bl?`blur(${bl}px)`:'none',boxShadow:'0 0 8px rgba(255,255,255,.7)'}); (r()<.7?fx:fx2).appendChild(f);}
// pisca-pisca
const cols=['#FFC107','#E84242','#FFFFFF','#5B9BF0'];let g='<svg style="position:absolute;left:0;top:0;z-index:11" width="1080" height="200" viewBox="0 0 1080 200"><path id="fio" d="M-20,40 C180,130 360,130 540,50 C720,-30 900,-20 1100,70" fill="none" stroke="#0a1f44" stroke-width="5"/>';
const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d','M-20,40 C180,130 360,130 540,50 C720,-30 900,-20 1100,70');
for(let i=0;i<=15;i++){const L=path.getTotalLength?0:0;}
document.querySelector('.slide').insertAdjacentHTML('beforeend','<div id="lights"></div>');
const holder=document.createElementNS('http://www.w3.org/2000/svg','svg');holder.setAttribute('style','position:absolute;left:0;top:0;z-index:11');holder.setAttribute('width','1080');holder.setAttribute('height','220');
const p2=document.createElementNS('http://www.w3.org/2000/svg','path');p2.setAttribute('d','M-20,40 C180,130 360,130 540,50 C720,-30 900,-20 1100,70');p2.setAttribute('fill','none');p2.setAttribute('stroke','#07162f');p2.setAttribute('stroke-width','5');holder.appendChild(p2);
const len=p2.getTotalLength();
for(let i=1;i<18;i++){const pt=p2.getPointAtLength(len*i/18);const c=cols[i%4];
 const gl=document.createElementNS('http://www.w3.org/2000/svg','circle');gl.setAttribute('cx',pt.x);gl.setAttribute('cy',pt.y+18);gl.setAttribute('r',34);gl.setAttribute('fill',c);gl.setAttribute('opacity','.22');holder.appendChild(gl);
 const b=document.createElementNS('http://www.w3.org/2000/svg','ellipse');b.setAttribute('cx',pt.x);b.setAttribute('cy',pt.y+20);b.setAttribute('rx',11);b.setAttribute('ry',16);b.setAttribute('fill',c);holder.appendChild(b);
 const cap=document.createElementNS('http://www.w3.org/2000/svg','rect');cap.setAttribute('x',pt.x-5);cap.setAttribute('y',pt.y+1);cap.setAttribute('width',10);cap.setAttribute('height',9);cap.setAttribute('fill','#8a8f99');holder.appendChild(cap);}
document.querySelector('.slide').appendChild(holder);
spark(70,520,52,'#FFFFFF'); spark(960,480,40,'#FFE082'); spark(980,900,56,'#FFFFFF'); spark(50,1000,34,'#FFE082'); spark(900,1290,34,'#FFFFFF');
'''
natal=build('natal','Tintas Laet — Aviso de horário de Natal',natal_bg,'#C62828','AVISO DE HORÁRIO · NATAL','FELIZ NATAL',215,575,'','',natal_js,SANTA,
  card('a','QUINTA-FEIRA','24/12','Abrimos <b>até o meio-dia</b>')+card('b','SEGUNDA-FEIRA','28/12','Voltamos em <b>horário normal</b>'))
open('/home/user/tintas-laet-site/marketing/stories/2026-12/aviso-natal/story.html','w').write(natal)

# ---------- ANO NOVO
ny_bg="radial-gradient(ellipse 900px 640px at 50% 32%, rgba(40,100,220,.5) 0%, rgba(13,71,161,0) 72%),radial-gradient(ellipse 900px 600px at 50% 78%, rgba(255,193,7,.20) 0%, rgba(255,193,7,0) 70%),linear-gradient(180deg,#062B63 0%,#041F4A 30%,#031637 62%,#010B1E 100%)"
ny_js='''
for(let i=0,n=0;n<14&&i<500;i++){const x=r()*1080,y=200+r()*1400,d=30+r()*80; const b=document.createElement('div'); b.className='bk'; Object.assign(b.style,{left:x+'px',top:y+'px',width:d+'px',height:d+'px',background:r()<.6?'rgba(255,193,7,.14)':'rgba(120,180,255,.13)',filter:`blur(${8+r()*12}px)`}); fx.appendChild(b); n++;}
// fogos
const burst=(cx,cy,R,c,n)=>{let h='<svg style="position:absolute;left:0;top:0" width="1080" height="1920">';for(let i=0;i<n;i++){const a=i/n*Math.PI*2,r1=R*.35,r2=R*(.8+.2*((i%3)/2));const x1=cx+Math.cos(a)*r1,y1=cy+Math.sin(a)*r1,x2=cx+Math.cos(a)*r2,y2=cy+Math.sin(a)*r2;
 h+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${i%2?4:6}" stroke-linecap="round" opacity=".85"/><circle cx="${cx+Math.cos(a)*R*1.12}" cy="${cy+Math.sin(a)*R*1.12}" r="${i%2?4:6}" fill="#fff" opacity=".9"/>`;}
 h+=`<circle cx="${cx}" cy="${cy}" r="${R*.14}" fill="${c}" opacity=".9"/></svg>`;fx.insertAdjacentHTML('beforeend',h);};
burst(110,800,110,'#FFC107',16); burst(985,720,90,'#FFE082',14); burst(900,980,90,'#FFFFFF',14); burst(110,1010,70,'#FFE082',12);
const cores=['#FFC107','#FFE082','#FFFFFF','#5B9BF0'];
for(let i=0,n=0;n<60&&i<5000;i++){const x=r()*1060,y=40+r()*1700; if(y>1330&&y<1640) continue; if(y>380&&y<640&&x>60&&x<1020) continue; if(y>650&&y<1330&&x>300&&x<760) continue;
 const d=document.createElement('div'); const w=8+r()*16,h=w*(r()<.55?.4:1),bl=r()<.3?2.5:0; Object.assign(d.style,{position:'absolute',left:x+'px',top:y+'px',width:w+'px',height:h+'px',background:cores[n%4],transform:`rotate(${r()*180}deg)`,opacity:.6+r()*.4,borderRadius:r()<.25?'50%':'2px',filter:bl?`blur(${bl}px)`:'none'}); fx.appendChild(d); n++;}
// bolhas subindo da taça
for(let i=0;i<9;i++){const d=document.createElement('div');const sz=8+r()*16; Object.assign(d.style,{position:'absolute',left:(867+r()*70-35)+'px',top:(690+r()*90)+'px',width:sz+'px',height:sz+'px',borderRadius:'50%',border:'2px solid rgba(255,255,255,.8)',background:'rgba(255,224,130,.25)'}); fx2.appendChild(d);}
spark(80,470,52,'#FFFFFF'); spark(990,420,40,'#FFE082'); spark(870,820,60,'#FFFFFF'); spark(60,1160,34,'#FFE082'); spark(960,1250,34,'#FFFFFF'); spark(760,560,36,'#FFE082');
'''
ny=build('ny','Tintas Laet — Aviso de horário de Ano Novo',ny_bg,'#FFC107','AVISO DE HORÁRIO · FIM DE ANO','FELIZ 2027',250,575,'','',ny_js,FLUTE+'<img class="hand" src="../../../../identidade/mascote-suspense-remove-bg-io.png" alt="">',
  card('a','QUINTA-FEIRA','31/12','Abrimos <b>até o meio-dia</b>')+card('b','SEGUNDA-FEIRA','04/01','Voltamos em <b>horário normal</b>'))
ny=ny.replace('.chip { position:absolute;','.chip { color:#062B63 !important; position:absolute;',1) if False else ny
open('/home/user/tintas-laet-site/marketing/stories/2026-12/aviso-ano-novo/story.html','w').write(ny)
