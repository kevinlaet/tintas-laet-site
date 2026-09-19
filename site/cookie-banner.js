// Aviso de cookies — só informa, não bloqueia nada (o Google Analytics
// continua rodando normal). Aparece uma vez por navegador; some ao clicar em
// "Entendi" e não volta mais (guardado em localStorage, não expira sozinho).
(function () {
  var CHAVE = "laet_cookies_aceito";
  if (localStorage.getItem(CHAVE)) return;

  var estilo = document.createElement("style");
  estilo.textContent =
    "#aviso-cookies{position:fixed;left:0;right:0;bottom:0;z-index:999;" +
    "background:#062B63;color:#fff;font-family:'Poppins',sans-serif;font-size:13px;" +
    "line-height:1.5;padding:16px 20px;display:flex;align-items:center;justify-content:center;" +
    "gap:18px;flex-wrap:wrap;box-shadow:0 -2px 20px rgba(0,0,0,.25)}" +
    "#aviso-cookies a{color:#FFC107;text-decoration:underline}" +
    "#aviso-cookies button{flex-shrink:0;background:#FFC107;color:#212529;border:none;" +
    "font-family:'Montserrat',sans-serif;font-weight:700;font-size:13px;padding:10px 22px;" +
    "border-radius:8px;cursor:pointer}" +
    "#aviso-cookies button:hover{box-shadow:0 4px 14px rgba(255,193,7,.4)}" +
    "#aviso-cookies p{margin:0;max-width:640px}";
  document.head.appendChild(estilo);

  var aviso = document.createElement("div");
  aviso.id = "aviso-cookies";
  aviso.innerHTML =
    '<p>🍪 Este site usa cookies para funcionar melhor. ' +
    'Ver mais na <a href="/privacidade.html">Política de Privacidade</a>.</p>' +
    "<button type=\"button\">Entendi</button>";
  document.body.appendChild(aviso);

  // Nas páginas com botão flutuante de WhatsApp/chat (fixos no rodapé),
  // empurra eles pra cima da altura do aviso — sem isso o aviso cobre esses
  // botões enquanto estiver na tela.
  var flutuantes = document.querySelectorAll(".wa-float, .chat-fab, .chat-panel, .back-to-top");
  function ajustarFlutuantes() {
    var altura = aviso.offsetHeight;
    flutuantes.forEach(function (el) {
      el.style.transition = "bottom .2s";
      el.style.bottom = "calc(" + getComputedStyle(el).bottom + " + " + altura + "px)";
    });
  }
  if (flutuantes.length) ajustarFlutuantes();

  aviso.querySelector("button").addEventListener("click", function () {
    localStorage.setItem(CHAVE, "1");
    flutuantes.forEach(function (el) {
      el.style.bottom = "";
    });
    aviso.remove();
  });
})();
