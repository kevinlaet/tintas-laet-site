import re,sys
wa=re.search(r'<svg viewBox="0 0 24 24"><path d="M12 2a10[^"]*"/></svg>',open('/home/user/tintas-laet-site/marketing/stories/2026-11/10-sorteio-dois-ganhadores/story.html').read()).group(0)
clock='<svg viewBox="0 0 24 24" fill="none" stroke="#FFC107" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9.5"/><path d="M12 6.5V12l3.8 2.4"/></svg>'
door='<svg viewBox="0 0 24 24" fill="none" stroke="#FFC107" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21h16M6 21V4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21"/><circle cx="14.5" cy="12.5" r="1" fill="#FFC107"/></svg>'

def page(title,bg,h1,hs,label,masc,mw,mtop,r1,r2,deco_html,deco_js,glow):
    return f'''<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080"><title>{title}</title>
<style>
@font-face {{ font-family:'Bebas Neue'; src:url('fonts/bebas-neue-latin-400-normal.woff2') format('woff2'); }}
@font-face {{ font-family:'Montserrat'; font-weight:700; src:url('fonts/montserrat-latin-700-normal.woff2') format('woff2'); }}
@font-face {{ font-family:'Montserrat'; font-weight:800; src:url('fonts/montserrat-latin-800-normal.woff2') format('woff2'); }}
@font-face {{ font-family:'Poppins'; font-weight:600; src:url('fonts/poppins-latin-600-normal.woff2') format('woff2'); }}
@font-face {{ font-family:'Poppins'; font-weight:700; src:url('fonts/poppins-latin-700-normal.woff2') format('woff2'); }}
*,*::before,*::after {{ margin:0; padding:0; box-sizing:border-box; }}
body {{ background:#010812; }}
.slide {{ width:1080px; height:1920px; position:relative; overflow:hidden; color:#fff; background:{bg}; }}
.grain {{ position:absolute; inset:0; z-index:40; pointer-events:none; opacity:.08; mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .9 0'/></filter><rect width='220' height='220' filter='url(%23n)'/></svg>"); }}
.vig {{ position:absolute; inset:0; z-index:39; pointer-events:none; background:radial-gradient(ellipse 760px 1150px at 50% 45%, transparent 60%, rgba(0,4,14,.6) 100%); }}
.frame {{ position:absolute; inset:34px; z-index:38; border:2px solid rgba(255,224,130,.42); border-radius:40px; pointer-events:none; }}
.frame::after {{ content:''; position:absolute; inset:10px; border:1px solid rgba(255,224,130,.18); border-radius:32px; }}
#fx {{ position:absolute; inset:0; z-index:2; }} #fx2 {{ position:absolute; inset:0; z-index:30; pointer-events:none; }}
.bk {{ position:absolute; border-radius:50%; }}
.spk {{ position:absolute; z-index:31; filter:drop-shadow(0 0 12px rgba(255,224,130,.95)); }}
.logo {{ position:absolute; top:118px; left:0; right:0; z-index:10; text-align:center; }}
.logo img {{ height:196px; margin:-48px 0 -42px; object-fit:contain; filter:drop-shadow(0 4px 18px rgba(0,0,0,.45)); }}
.lbl {{ position:absolute; top:322px; left:0; right:0; z-index:10; display:flex; align-items:center; justify-content:center; gap:22px;
  font:700 27px/1 'Montserrat',sans-serif; letter-spacing:.34em; color:#FFE082; padding-left:.34em; }}
.lbl::before,.lbl::after {{ content:''; width:96px; height:2px; background:linear-gradient(90deg,rgba(255,224,130,0),#FFE082); }}
.lbl::after {{ transform:scaleX(-1); }}
.h1 {{ position:absolute; left:0; right:0; top:350px; padding-top:30px; z-index:10; text-align:center; white-space:nowrap; font:400 {hs}px/.9 'Bebas Neue',sans-serif; letter-spacing:.02em;
  background:linear-gradient(180deg,#FFFBEA 0%,#FFE9A6 30%,#FFD24D 60%,#F2B200 100%); -webkit-background-clip:text; background-clip:text; color:transparent;
  filter:drop-shadow(0 4px 0 #062B63) drop-shadow(0 18px 30px rgba(0,0,0,.55)); }}
.glow {{ position:absolute; left:50%; top:{glow}px; width:820px; height:820px; transform:translateX(-50%); z-index:3; border-radius:50%;
  background:radial-gradient(circle, rgba(255,214,90,.30) 0%, rgba(255,193,7,.10) 38%, rgba(255,193,7,0) 68%); }}
.floor {{ position:absolute; left:50%; top:1230px; width:640px; height:90px; transform:translateX(-50%); z-index:4; border-radius:50%;
  background:radial-gradient(ellipse, rgba(0,0,0,.55) 0%, rgba(0,0,0,0) 70%); }}
.masc {{ position:absolute; left:50%; top:{mtop}px; width:{mw}px; transform:translateX(-50%); z-index:8; filter:drop-shadow(0 28px 34px rgba(0,0,0,.5)); clip-path:inset(0 0 {mw*1.5-(1260-mtop)}px 0); }}
.panel {{ position:absolute; left:64px; right:64px; top:1222px; z-index:20; border-radius:34px; padding:22px 40px 22px;
  background:linear-gradient(180deg,rgba(9,40,96,.86),rgba(3,20,52,.92)); border:2px solid rgba(255,224,130,.55);
  box-shadow:0 30px 60px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.25); backdrop-filter:blur(6px); }}
.panel .hd {{ text-align:center; font:800 26px/1 'Montserrat',sans-serif; letter-spacing:.3em; color:#FFE082; padding-left:.3em; }}
.panel .hd small {{ display:block; margin-top:9px; font:600 24px/1 'Poppins',sans-serif; letter-spacing:.02em; color:rgba(255,255,255,.75); }}
.row {{ display:flex; align-items:center; gap:26px; margin-top:16px; padding-top:16px; border-top:1px solid rgba(255,224,130,.22); }}
.row .ic {{ flex:none; width:74px; height:74px; border-radius:50%; background:rgba(255,193,7,.12); border:2px solid rgba(255,193,7,.55); display:flex; align-items:center; justify-content:center; }}
.row .ic svg {{ width:40px; height:40px; }}
.row .dt {{ flex:none; width:250px; }}
.row .dt b {{ display:block; font:400 90px/.86 'Bebas Neue',sans-serif; color:#fff; letter-spacing:.01em; padding-top:6px; }}
.row .dt span {{ display:block; font:700 22px/1 'Montserrat',sans-serif; letter-spacing:.2em; color:#FFE082; margin-top:6px; }}
  .row .tx {{ font:700 34px/1.18 'Poppins',sans-serif; }}
.row .tx em {{ font-style:normal; color:#FFC107; }}
.cta {{ position:absolute; left:50%; top:1660px; transform:translateX(-50%); z-index:20; display:flex; align-items:center; gap:16px; white-space:nowrap;
  background:linear-gradient(180deg,#FFD54F,#FFC107); color:#062B63; font:800 40px/1 'Montserrat',sans-serif; padding:18px 46px; border-radius:60px;
  box-shadow:0 14px 30px rgba(0,0,0,.5), 0 0 0 6px rgba(255,193,7,.16), inset 0 2px 0 rgba(255,255,255,.5); }}
.cta svg {{ width:44px; height:44px; fill:#062B63; }}
.sub {{ position:absolute; left:0; right:0; top:1752px; z-index:20; text-align:center; font:700 28px/1 'Poppins',sans-serif; }}
.sub b {{ color:#FFE082; }}
</style></head><body>
<div class="slide">
 <div id="fx"></div>{deco_html}
 <div class="logo"><img src="../../../../identidade/logotipo branco-remove-bg-io.png" alt="Tintas Laet"></div>
 <div class="lbl">{label}</div>
 <div class="h1">{h1}</div>
 <div class="glow"></div><div class="floor"></div>
 <img class="masc" src="{masc}" alt="Laetinho, mascote da Tintas Laet">
 <div class="panel">
  <div class="hd">HORÁRIO DAS LOJAS<small>Vale para todas as unidades Tintas Laet</small></div>
  <div class="row"><div class="ic">{clock}</div><div class="dt"><b>{r1[0]}</b><span>{r1[1]}</span></div><div class="tx">{r1[2]}</div></div>
  <div class="row"><div class="ic">{door}</div><div class="dt"><b>{r2[0]}</b><span>{r2[1]}</span></div><div class="tx">{r2[2]}</div></div>
 </div>
 <div class="cta">{wa}(11) 97714-0964</div>
 <div class="sub"><b>@Tintaslaet</b> · tintaslaet.com</div>
 <div id="fx2"></div><div class="vig"></div><div class="frame"></div><div class="grain"></div>
</div>
<script>
const fx=document.getElementById('fx'),fx2=document.getElementById('fx2'); let s=9; const r=()=>{{s=(s*9301+49297)%233280;return s/233280;}};
const spark=(x,y,sz,c)=>document.querySelector('.slide').insertAdjacentHTML('beforeend',`<svg class="spk" style="left:${{x}}px;top:${{y}}px;width:${{sz}}px;height:${{sz}}px" viewBox="0 0 40 40"><path d="M20 0 C21.5 14 26 18.5 40 20 C26 21.5 21.5 26 20 40 C18.5 26 14 21.5 0 20 C14 18.5 18.5 14 20 0Z" fill="${{c}}"/></svg>`);
for(let i=0;i<22;i++){{const x=r()*1080,y=r()*1300,d=24+r()*90; const b=document.createElement('div'); b.className='bk'; Object.assign(b.style,{{left:x+'px',top:y+'px',width:d+'px',height:d+'px',background:r()<.6?'rgba(255,214,90,.16)':'rgba(140,190,255,.14)',filter:`blur(${{6+r()*14}}px)`}}); fx.appendChild(b);}}
{deco_js}
</script></body></html>'''

NATAL_BG="radial-gradient(ellipse 900px 700px at 50% 42%, rgba(48,120,240,.55) 0%, rgba(13,71,161,0) 70%),linear-gradient(180deg,#0B3E8F 0%,#08367F 22%,#062B63 52%,#041F4A 78%,#021430 100%)"
NY_BG="radial-gradient(ellipse 900px 700px at 50% 40%, rgba(40,100,220,.45) 0%, rgba(13,71,161,0) 70%),linear-gradient(180deg,#05285C 0%,#041F4A 30%,#03183D 60%,#010B1E 100%)"

# enfeites de Natal pendurados (bolas)
def bola(x,len_,r,c1,c2):
    return f'''<svg style="position:absolute;left:{x-r-6}px;top:34px;z-index:12;overflow:visible" width="{2*r+12}" height="{len_+2*r+30}">
<defs><radialGradient id="b{x}" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".18" stop-color="{c1}"/><stop offset="1" stop-color="{c2}"/></radialGradient></defs>
<line x1="{r+6}" y1="0" x2="{r+6}" y2="{len_}" stroke="#FFE082" stroke-width="2" opacity=".8"/>
<rect x="{r-6}" y="{len_-4}" width="24" height="16" rx="3" fill="#D9A400"/>
<circle cx="{r+6}" cy="{len_+12+r}" r="{r}" fill="url(#b{x})"/>
<path d="M{r+6-r*.7},{len_+12+r} A{r*.7},{r*.25} 0 0 0 {r+6+r*.7},{len_+12+r}" stroke="#FFE082" stroke-width="3" fill="none" opacity=".7"/>
</svg>'''
natal_deco=bola(118,150,46,'#FF5252','#9E1414')+bola(214,70,32,'#FFD54F','#B88600')+bola(880,90,36,'#64A8FF','#0D47A1')+bola(968,180,48,'#FFD54F','#B88600')
natal_js='''
for(let i=0;i<90;i++){const x=r()*1080,y=r()*1880; if(y>1225&&y<1800&&x>40&&x<1040) continue; const d=4+r()*12,bl=r()<.35?2.5:0; const f=document.createElement('div'); Object.assign(f.style,{position:'absolute',left:x+'px',top:y+'px',width:d+'px',height:d+'px',borderRadius:'50%',background:'#fff',opacity:.45+r()*.5,filter:bl?`blur(${bl}px)`:'none',boxShadow:'0 0 10px rgba(255,255,255,.6)'}); (r()<.75?fx:fx2).appendChild(f);}
spark(86,560,46,'#FFFFFF'); spark(960,520,36,'#FFE082'); spark(140,940,30,'#FFE082'); spark(930,1000,50,'#FFFFFF'); spark(870,740,26,'#FFFFFF');
'''
ny_js='''
const burst=(cx,cy,R,c,n,op)=>{let h=`<svg style="position:absolute;left:0;top:0;opacity:${op}" width="1080" height="1920"><defs><linearGradient id="g${cx}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c}" stop-opacity="0"/><stop offset="1" stop-color="${c}"/></linearGradient></defs>`;
 for(let i=0;i<n;i++){const a=i/n*Math.PI*2+.1,r1=R*.18,r2=R*(.75+.25*((i*7)%5)/4);const x1=cx+Math.cos(a)*r1,y1=cy+Math.sin(a)*r1,x2=cx+Math.cos(a)*r2,y2=cy+Math.sin(a)*r2;
 h+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="2.6" stroke-linecap="round" opacity=".85"/><circle cx="${x2}" cy="${y2}" r="4.5" fill="#fff"/><circle cx="${cx+Math.cos(a)*R*1.08}" cy="${cy+Math.sin(a)*R*1.08}" r="2.5" fill="${c}"/>`;}
 h+=`<circle cx="${cx}" cy="${cy}" r="${R*.08}" fill="#fff" opacity=".9"/></svg>`; fx.insertAdjacentHTML('beforeend',h);};
burst(170,700,150,'#FFD24D',28,.9); burst(910,640,180,'#FFE9A6',32,.85); burst(960,1080,110,'#FFFFFF',22,.7); burst(110,1110,90,'#FFC107',18,.75);
const cores=['#FFC107','#FFE082','#FFFFFF','#FFD24D'];
for(let i=0,n=0;n<70&&i<6000;i++){const x=r()*1060,y=40+r()*1800; if(y>1225&&y<1800&&x>40&&x<1040) continue;
 const d=document.createElement('div'); const w=8+r()*16,hh=w*(r()<.55?.38:1),bl=r()<.3?2.5:0; Object.assign(d.style,{position:'absolute',left:x+'px',top:y+'px',width:w+'px',height:hh+'px',background:cores[n%4],transform:`rotate(${r()*180}deg)`,opacity:.55+r()*.45,borderRadius:r()<.25?'50%':'2px',filter:bl?`blur(${bl}px)`:'none'}); (r()<.75?fx:fx2).appendChild(d); n++;}
spark(90,520,46,'#FFFFFF'); spark(970,460,36,'#FFE082'); spark(150,950,30,'#FFE082'); spark(940,900,52,'#FFFFFF');
'''
which=sys.argv[1]; masc=sys.argv[2]; mw=int(sys.argv[3]); mtop=int(sys.argv[4])
if which=='natal':
    out=page('Tintas Laet — Horário de Natal',NATAL_BG,'FELIZ NATAL',196,'AVISO DE NATAL',masc,mw,mtop,('24/12','QUINTA-FEIRA','Abrimos<br><em>até o meio-dia</em>'),('28/12','SEGUNDA-FEIRA','Voltamos em<br><em>horário normal</em>'),natal_deco,natal_js,560)
    open('/home/user/tintas-laet-site/marketing/stories/2026-12/aviso-natal/story.html','w').write(out)
else:
    out=page('Tintas Laet — Horário de Ano Novo',NY_BG,'FELIZ 2027',230,'AVISO DE FIM DE ANO',masc,mw,mtop,('31/12','QUINTA-FEIRA','Abrimos<br><em>até o meio-dia</em>'),('04/01','SEGUNDA-FEIRA','Voltamos em<br><em>horário normal</em>'),'',ny_js,540)
    open('/home/user/tintas-laet-site/marketing/stories/2026-12/aviso-ano-novo/story.html','w').write(out)
