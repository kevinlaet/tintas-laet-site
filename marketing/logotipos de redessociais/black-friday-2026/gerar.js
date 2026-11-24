// Foto de perfil temática Black Friday (Instagram e WhatsApp das lojas) · 1080x1080, pensada pro corte redondo:
// tudo que importa fica dentro do círculo; fundo preto, borda amarela, logo branco oficial no centro.
// A = borda lisa · B = borda com "BLACK FRIDAY LAET" escrito (mesmo DNA das fitas do carrossel).
const { chromium } = require("playwright"); const fs = require("fs"), path = require("path");
const uri = (p) => "data:image/png;base64," + fs.readFileSync(p).toString("base64");
const LOGO = uri("/home/user/tintas-laet-site/marketing/conteudo/black-friday-carrossel-2026-11-24/emb/logo.png"); // logotipo branco oficial (recortado, sem distorcer)
const GRAO = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;
const base = (anel) => `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap" rel="stylesheet"><style>
*{margin:0;padding:0;box-sizing:border-box}html,body{width:1080px;height:1080px;overflow:hidden;background:#0A0A0F}
.c{position:absolute;inset:0;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 50%,#1A1A22 0%,#0D0D13 55%,#07070B 100%)}
.glow{position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,rgba(245,184,0,.20) 0%,rgba(245,184,0,.06) 38%,transparent 62%)}
.raios{position:absolute;inset:0;background:repeating-conic-gradient(from 0deg at 50% 50%,rgba(245,184,0,.07) 0deg 5deg,transparent 5deg 15deg);-webkit-mask-image:radial-gradient(circle,#000 0,transparent 70%);mask-image:radial-gradient(circle,#000 0,transparent 70%)}
.grao{position:absolute;inset:0;background-image:${GRAO};opacity:.08;mix-blend-mode:overlay}
.logo{position:absolute;left:50%;top:50%;width:${anel === "B" ? 600 : 640}px;transform:translate(-50%,-50%);filter:drop-shadow(0 10px 24px rgba(0,0,0,.65))}
</style></head><body><div class="c"><div class="glow"></div><div class="raios"></div><div class="grao"></div></div>
${anel === "A" ? `<svg width="1080" height="1080" style="position:absolute;inset:0">
  <circle cx="540" cy="540" r="517" fill="none" stroke="#F5B800" stroke-width="48"/>
  <circle cx="540" cy="540" r="476" fill="none" stroke="#F5B800" stroke-opacity=".45" stroke-width="4"/></svg>` : `<svg width="1080" height="1080" style="position:absolute;inset:0">
  <defs><path id="p" d="M540,540 m-492,0 a492,492 0 1,1 984,0 a492,492 0 1,1 -984,0"/></defs>
  <circle cx="540" cy="540" r="495" fill="none" stroke="#F5B800" stroke-width="92"/>
  <circle cx="540" cy="540" r="434" fill="none" stroke="#F5B800" stroke-opacity=".45" stroke-width="4"/>
  <text font-family="Montserrat" font-weight="900" font-size="50" letter-spacing="9" fill="#0A0A0F" dominant-baseline="middle">
    <textPath href="#p" startOffset="0" textLength="3060" lengthAdjust="spacing">BLACK FRIDAY • TINTAS LAET • BLACK FRIDAY • TINTAS LAET •</textPath></text></svg>`}
<img class="logo" src="${LOGO}"></body></html>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1080 } });
  for (const v of ["A", "B"]) {
    await p.setContent(base(v), { waitUntil: "networkidle" }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: path.join(__dirname, `perfil-black-friday-${v === "A" ? "borda-lisa" : "borda-escrita"}.png`) });
  }
  await b.close(); console.log("ok");
})();
