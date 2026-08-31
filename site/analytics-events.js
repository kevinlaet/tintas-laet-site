/* Eventos customizados do Google Analytics (GA4) — cliques no WhatsApp, cliques em produto e envio de formulário.
   Um único listener delegado cobre a página inteira, então qualquer link/botão/form novo já entra automaticamente. */
(function () {
  function track(name, params) {
    if (typeof gtag !== 'function') return;
    gtag('event', name, Object.assign({ transport_type: 'beacon' }, params || {}));
  }

  document.addEventListener('click', function (e) {
    var waEl = e.target.closest('a[href*="wa.me"], a[href*="api.whatsapp.com"], [onclick*="wa.me"]');
    if (waEl) {
      track('click_whatsapp', {
        link_text: (waEl.textContent || '').trim().slice(0, 100),
        page_path: location.pathname
      });
      return;
    }

    var prodEl = e.target.closest('a[href*="produto.html"]');
    if (prodEl) {
      var href = prodEl.getAttribute('href') || '';
      var match = href.match(/[?&]id=([^&]+)/);
      track('click_produto', {
        produto_id: match ? decodeURIComponent(match[1]) : href,
        link_text: (prodEl.textContent || '').trim().slice(0, 100),
        page_path: location.pathname
      });
    }
  }, true);

  document.addEventListener('submit', function (e) {
    if (!(e.target instanceof HTMLFormElement)) return;
    var form = e.target;
    track('form_submit', {
      form_name: form.getAttribute('name') || form.id || 'sem_nome',
      page_path: location.pathname
    });
  }, true);
})();
