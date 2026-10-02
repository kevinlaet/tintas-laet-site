/* Camada "Laet Tech": barra de progresso da rolagem, luz que segue o mouse nos cards
   e etiqueta "Loja N" nas fotos das lojas. Só visual; se falhar, o site segue igual. */
(function () {
  function iniciar() {
    // Barra de progresso
    var bar = document.createElement('div');
    bar.id = 'tech-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    var pend = false;
    function prog() {
      pend = false;
      var h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')';
    }
    addEventListener('scroll', function () { if (!pend) { pend = true; requestAnimationFrame(prog); } }, { passive: true });
    prog();

    // Etiqueta "Loja N" (usa data-loja, então continua certa quando "Loja mais perto" reordena)
    document.querySelectorAll('.location-card[data-loja] .location-photo').forEach(function (ph) {
      if (ph.querySelector('.loja-tag')) return;
      var t = document.createElement('span');
      t.className = 'loja-tag';
      t.textContent = 'Loja ' + ph.closest('.location-card').getAttribute('data-loja');
      ph.appendChild(t);
    });

    // Luz que segue o mouse (só em quem tem mouse)
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var sel = '.seller-card, .surface-card, .review-card, .location-card, .pickup-card, .help-card, .social-channel, .why-item';
    document.querySelectorAll(sel).forEach(function (card) {
      var s = document.createElement('span');
      s.className = 'tech-spot' + (card.closest('.why, .social') ? ' dark' : '');
      s.setAttribute('aria-hidden', 'true');
      card.appendChild(s);
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        s.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        s.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
