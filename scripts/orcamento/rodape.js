// Rodapé padrão (CTA) das peças de atendimento: Instagram + WhatsApp + site, sempre os três.
// Regra do Kevin (09/10/2026): WhatsApp padrão final 0964; só muda em peça de uma loja específica.
module.exports = {
  css: `
.rodape{background:var(--azesc);color:#fff;padding:40px 56px;text-align:center}
.rodape .cta{display:inline-block;background:var(--am);color:var(--graf);font:800 38px Montserrat,sans-serif;padding:16px 40px;border-radius:8px;margin-bottom:22px}
.rodape .w{font:400 66px 'Bebas Neue',sans-serif;letter-spacing:2px;line-height:1}
.rodape .redes{display:flex;justify-content:center;gap:14px;margin-top:20px;flex-wrap:wrap}
.rodape .redes span{border:2px solid rgba(255,255,255,.35);border-radius:8px;padding:10px 24px;font:600 26px Poppins,sans-serif}
.rodape .redes span b{color:var(--am);font-weight:600}
.rodape p{font-size:22px;opacity:.9;margin-top:18px}`,
  html: (cta, whatsapp) => `<div class="rodape"><div class="cta">${cta}</div><div class="w">${whatsapp}</div>
  <div class="redes"><span><b>Instagram</b> @Tintaslaet</span><span><b>Site</b> tintaslaet.com</span></div>
  <p>Atenciosamente, Tintas Laet</p></div>`,
};
