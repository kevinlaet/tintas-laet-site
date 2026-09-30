/* Bloco "Canais oficiais" do rodapé — fonte única dos números e redes da Tintas Laet.
   Injetado em todo <footer> do site. Pra mudar/incluir um número, é só editar aqui.
   (O "guardião" do site confere se algum número diferente destes aparece nas páginas.) */
(function () {
  var NUMEROS = [
    ['Loja virtual', '(11) 97714-0964'],
    ['Loja 1', '(11) 98082-0686'],
    ['Loja 2', '(11) 97750-4434'],
    ['Loja 3', '(11) 97749-8813'],
    ['Loja 4', '(11) 94855-1977'],
    ['Loja 5', '(11) 91433-4875'],
    ['Loja 6', '(11) 91875-5095'],
    ['SAC', '(11) 94848-5925'],
    ['SAC', '(11) 95318-9216'],
    ['SAC', '(11) 94891-0470']
  ];
  var REDES = [
    ['Instagram', '@tintaslaet', 'https://www.instagram.com/tintaslaet'],
    ['Facebook', 'Tintaslaetme', 'https://www.facebook.com/Tintaslaetme'],
    ['TikTok', '@tintaslaet', 'https://www.tiktok.com/@tintaslaet'],
    ['Site oficial', 'tintaslaet.com', 'https://tintaslaet.com']
  ];

  function tel(n) { return 'tel:+55' + n.replace(/\D/g, ''); }

  var css = '.laet-oficial{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:16px;padding:22px 20px;margin:0 0 30px;color:#fff;font-family:Poppins,sans-serif;text-align:left}' +
    '.laet-oficial h3{font-family:Montserrat,sans-serif;font-weight:800;font-size:15px;margin:0 0 6px;color:#fff}' +
    '.laet-oficial h3 span{color:#FFC107}' +
    '.laet-oficial p.lo-aviso{font-size:12.5px;line-height:1.6;color:rgba(255,255,255,.75);margin:0 0 16px;max-width:640px}' +
    '.lo-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:8px 18px;list-style:none;margin:0 0 16px;padding:0}' +
    '.lo-grid li{display:flex;justify-content:space-between;gap:10px;font-size:13px;border-bottom:1px dashed rgba(255,255,255,.12);padding:5px 0}' +
    '.lo-grid li span{color:rgba(255,255,255,.6)}' +
    '.lo-grid a{color:#fff;font-weight:600;white-space:nowrap}.lo-grid a:hover{color:#FFC107}' +
    '.lo-redes{display:flex;flex-wrap:wrap;gap:8px}' +
    '.lo-redes a{background:rgba(255,255,255,.1);color:#fff;font-size:12.5px;font-weight:600;padding:7px 13px;border-radius:100px;transition:background .2s}' +
    '.lo-redes a:hover{background:#FFC107;color:#1a1000}' +
    '.lo-redes small{opacity:.65;font-weight:500;margin-left:4px}';

  function montar() {
    var footer = document.querySelector('footer');
    if (!footer || footer.querySelector('.laet-oficial')) return;
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);

    var box = document.createElement('section');
    box.className = 'laet-oficial';
    box.setAttribute('aria-label', 'Canais oficiais da Tintas Laet');

    var h = document.createElement('h3');
    h.innerHTML = '🔒 Nossos <span>canais oficiais</span>';
    box.appendChild(h);

    var aviso = document.createElement('p');
    aviso.className = 'lo-aviso';
    aviso.textContent = 'Fique atento e confirme sempre pelos números e canais oficiais da Tintas Laet. Desconfie de ofertas e contatos não oficiais. Em caso de dúvida, fale com a nossa equipe por um dos canais abaixo.';
    box.appendChild(aviso);

    var ul = document.createElement('ul');
    ul.className = 'lo-grid';
    NUMEROS.forEach(function (n) {
      var li = document.createElement('li');
      var s = document.createElement('span');
      s.textContent = n[0];
      var a = document.createElement('a');
      a.href = tel(n[1]);
      a.textContent = n[1];
      li.appendChild(s);
      li.appendChild(a);
      ul.appendChild(li);
    });
    box.appendChild(ul);

    var redes = document.createElement('div');
    redes.className = 'lo-redes';
    REDES.forEach(function (r) {
      var a = document.createElement('a');
      a.href = r[2];
      a.target = '_blank';
      a.rel = 'noopener';
      a.appendChild(document.createTextNode(r[0]));
      var sm = document.createElement('small');
      sm.textContent = r[1];
      a.appendChild(sm);
      redes.appendChild(a);
    });
    box.appendChild(redes);

    var alvo = footer.querySelector('.footer-bottom');
    var pai = (alvo && alvo.parentNode) || footer;
    if (alvo) pai.insertBefore(box, alvo); else pai.appendChild(box);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar);
  else montar();
})();
