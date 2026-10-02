/* "Loja mais perto de você": pede a localização do celular (só com permissão do cliente),
   calcula a distância até cada loja AQUI MESMO no aparelho e reordena os cards.
   A localização não é enviada pra lugar nenhum nem guardada.
   Uso no HTML: um botão [data-perto] com data-alvo="<seletor do container>", e os cards com data-loja="1..6". */
(function () {
  function rad(x) { return x * Math.PI / 180; }
  function km(a, b) {
    var R = 6371, dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function fmt(d) {
    if (d < 1) return Math.max(100, Math.round(d * 10) * 100) + ' m';
    return (d < 10 ? d.toFixed(1) : Math.round(d)).toString().replace('.', ',') + ' km';
  }
  function iniciar() {
    var lojas = (window.LAET_LOJAS || []).filter(function (l) { return typeof l.lat === 'number' && typeof l.lng === 'number'; });
    var botoes = document.querySelectorAll('[data-perto]');
    if (!botoes.length) return;
    if (!lojas.length || !('geolocation' in navigator)) {
      botoes.forEach(function (b) { b.hidden = true; });
      return;
    }
    var porN = {};
    lojas.forEach(function (l) { porN[l.n] = l; });

    botoes.forEach(function (btn) {
      btn.hidden = false;
      var original = btn.innerHTML;
      var aviso = document.getElementById(btn.getAttribute('data-aviso') || '');
      function msg(t) { if (aviso) { aviso.textContent = t; aviso.hidden = !t; } }
      btn.addEventListener('click', function () {
        var alvo = document.querySelector(btn.getAttribute('data-alvo'));
        if (!alvo) return;
        btn.disabled = true;
        btn.textContent = 'Procurando você…';
        msg('');
        navigator.geolocation.getCurrentPosition(function (pos) {
          var eu = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          var cards = Array.prototype.slice.call(alvo.querySelectorAll('[data-loja]'));
          cards.forEach(function (c) {
            var l = porN[c.getAttribute('data-loja')];
            c._dist = l ? km(eu, l) : Infinity;
            var tag = c.querySelector('.dist-tag');
            if (!tag) {
              tag = document.createElement('span');
              tag.className = 'dist-tag';
              var onde = c.querySelector('[data-dist-slot]') || c;
              onde.appendChild(tag);
            }
            tag.textContent = isFinite(c._dist) ? '📍 ' + fmt(c._dist) + ' de você' : '';
            tag.hidden = !isFinite(c._dist);
            c.classList.remove('mais-perto');
          });
          cards.sort(function (a, b) { return a._dist - b._dist; });
          cards.forEach(function (c) { alvo.appendChild(c); });
          if (cards[0] && isFinite(cards[0]._dist)) {
            cards[0].classList.add('mais-perto');
            var t = cards[0].querySelector('.dist-tag');
            if (t) t.textContent = '⭐ Mais perto · ' + fmt(cards[0]._dist);
            cards[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          btn.disabled = false;
          btn.innerHTML = original;
          msg('Pronto! As lojas estão na ordem da mais perto pra mais longe.');
          if (typeof gtag === 'function') gtag('event', 'loja_mais_perto', { page_path: location.pathname });
        }, function (err) {
          btn.disabled = false;
          btn.innerHTML = original;
          msg(err && err.code === 1
            ? 'Sem permissão de localização. Tudo bem: escolha a loja pela cidade ou pelo endereço.'
            : 'Não deu pra achar sua localização agora. Tente de novo ou escolha pela cidade.');
        }, { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 });
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
