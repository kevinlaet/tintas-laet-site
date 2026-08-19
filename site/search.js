/* Busca de produtos do site — ícone na navbar, abre um painel com sugestões
   que vai filtrando conforme a pessoa digita. Depende de `LAET_SEARCH_INDEX`
   (site/search-data.js), que precisa ser carregado ANTES deste script. */
(function () {
  function normalize(str) {
    return String(str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function matches(entry, query) {
    if (normalize(entry.nome).includes(query)) return true;
    if (entry.aliases && entry.aliases.some(a => normalize(a).includes(query))) return true;
    return false;
  }

  function search(query) {
    const q = normalize(query).trim();
    if (!q) return [];
    const index = (typeof LAET_SEARCH_INDEX !== 'undefined') ? LAET_SEARCH_INDEX : [];
    return index.filter(entry => matches(entry, q)).slice(0, 8);
  }

  function injectStyles() {
    const css = `
      .navbar-search-btn { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,.14); flex-shrink: 0; box-shadow: none; cursor: pointer; transition: background .2s; border: none; margin-left: 4px; }
      .navbar-search-btn:hover { background: rgba(255,255,255,.26); }
      .navbar-search-btn svg { width: 20px; height: 20px; stroke: #fff; fill: none; stroke-width: 2; }
      #laet-search-overlay { position: fixed; inset: 0; z-index: 500; background: rgba(6,43,99,.55); opacity: 0; visibility: hidden; transition: opacity .2s; }
      #laet-search-overlay.open { opacity: 1; visibility: visible; }
      #laet-search-panel { background: #fff; max-width: 620px; margin: 0 auto; border-radius: 0 0 16px 16px; overflow: hidden; transform: translateY(-16px); opacity: 0; transition: transform .25s ease, opacity .25s ease; box-shadow: 0 16px 48px rgba(0,0,0,.25); }
      #laet-search-overlay.open #laet-search-panel { transform: translateY(0); opacity: 1; }
      #laet-search-inputrow { display: flex; align-items: center; gap: 10px; padding: 18px 20px; border-bottom: 1px solid #EEF1F6; }
      #laet-search-inputrow svg { width: 20px; height: 20px; stroke: #999; fill: none; stroke-width: 2; flex-shrink: 0; }
      #laet-search-input { flex: 1; border: none; outline: none; font-family: 'Poppins', sans-serif; font-size: 15px; color: #212529; }
      #laet-search-input::placeholder { color: #aaa; }
      #laet-search-close { background: none; border: none; color: #999; font-size: 18px; cursor: pointer; line-height: 1; padding: 4px; flex-shrink: 0; }
      #laet-search-close:hover { color: #555; }
      #laet-search-results { max-height: 60vh; overflow-y: auto; }
      .laet-search-hint { padding: 22px 20px; text-align: center; color: #999; font-size: 13.5px; line-height: 1.6; }
      .laet-search-item { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 13px 20px; cursor: pointer; transition: background .15s; border-bottom: 1px solid #F5F6F9; }
      .laet-search-item:last-child { border-bottom: none; }
      .laet-search-item:hover, .laet-search-item.active { background: #F0F4FF; }
      .laet-search-item-nome { font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 14px; color: #212529; }
      .laet-search-item-cat { font-size: 11px; color: #999; background: #F0F2F5; padding: 3px 9px; border-radius: 100px; flex-shrink: 0; }
      .laet-search-empty { padding: 26px 20px; text-align: center; }
      .laet-search-empty p { color: #777; font-size: 13.5px; margin-bottom: 14px; line-height: 1.6; }
      .laet-search-empty a { display: inline-flex; align-items: center; gap: 6px; background: #25D366; color: #fff; font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 13px; padding: 10px 18px; border-radius: 100px; }
      @media (max-width: 640px) { #laet-search-panel { max-width: 100%; border-radius: 0; } }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function injectButton() {
    const btnHtml = `
      <button id="laet-search-nav-btn" class="navbar-search-btn" aria-label="Buscar produto">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </button>`;
    const cartBtn = document.querySelector('.navbar-cart-btn');
    const navToggle = document.querySelector('.navbar-toggle');
    const navWa = document.querySelector('.navbar-wa');
    if (cartBtn) cartBtn.insertAdjacentHTML('beforebegin', btnHtml);
    else if (navToggle) navToggle.insertAdjacentHTML('beforebegin', btnHtml);
    else if (navWa) navWa.insertAdjacentHTML('afterend', btnHtml);
    else document.querySelector('.navbar-inner')?.insertAdjacentHTML('beforeend', btnHtml);
  }

  function injectPanel() {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <div id="laet-search-overlay" onclick="if(event.target===this) LaetSearch.close()">
        <div id="laet-search-panel">
          <div id="laet-search-inputrow">
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input id="laet-search-input" type="text" placeholder="Buscar produto... (ex: emborrachada, rolo, corante)" autocomplete="off">
            <button id="laet-search-close" onclick="LaetSearch.close()">✕</button>
          </div>
          <div id="laet-search-results"></div>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);
  }

  function render(query) {
    const results = document.getElementById('laet-search-results');
    if (!results) return;
    const q = query.trim();
    if (!q) {
      results.innerHTML = '<div class="laet-search-hint">Digite o nome do produto que você procura.</div>';
      return;
    }
    const found = search(q);
    if (found.length === 0) {
      const msg = encodeURIComponent('Olá! Procurei "' + q + '" no site e não encontrei — vocês têm?');
      results.innerHTML = `
        <div class="laet-search-empty">
          <p>Não achei nada com "${q}" no catálogo do site — mas pode ser que a gente tenha na loja.</p>
          <a href="https://wa.me/5511977140964?text=${msg}" target="_blank" rel="noopener">💬 Perguntar no WhatsApp</a>
        </div>`;
      return;
    }
    results.innerHTML = found.map(function (entry, i) {
      return `<div class="laet-search-item${i === 0 ? ' active' : ''}" data-id="${entry.id}" onclick="LaetSearch.go('${entry.id}')">
        <span class="laet-search-item-nome">${entry.nome}</span>
        <span class="laet-search-item-cat">${entry.categoria}</span>
      </div>`;
    }).join('');
  }

  function open() {
    const overlay = document.getElementById('laet-search-overlay');
    if (!overlay) return;
    overlay.classList.add('open');
    const input = document.getElementById('laet-search-input');
    input.value = '';
    render('');
    setTimeout(function () { input.focus(); }, 50);
  }

  function close() {
    const overlay = document.getElementById('laet-search-overlay');
    if (overlay) overlay.classList.remove('open');
  }

  function go(id) {
    window.location.href = 'produto.html?id=' + id;
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'Enter') {
      const first = document.querySelector('.laet-search-item');
      if (first) go(first.getAttribute('data-id'));
    }
  }

  window.LaetSearch = { open, close, go };

  document.addEventListener('DOMContentLoaded', function () {
    injectStyles();
    injectButton();
    injectPanel();
    document.getElementById('laet-search-nav-btn')?.addEventListener('click', open);
    document.getElementById('laet-search-input')?.addEventListener('input', function (e) { render(e.target.value); });
    document.getElementById('laet-search-input')?.addEventListener('keydown', handleKeydown);
  });
})();
