(function () {
  const STORAGE_KEY = 'laet_cart_v1';
  const ADDR_KEY = 'laet_cart_addr_v1';
  const WHATSAPP_NUMBER = '5511977140964';

  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
  function loadCart() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch (e) { return []; }
  }
  function saveCart(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    renderBadge();
  }
  function loadAddr() {
    // Só guardamos a loja de retirada; CEP/endereço de versões antigas são descartados (menos dado pessoal no aparelho).
    try { const a = JSON.parse(localStorage.getItem(ADDR_KEY)) || {}; return { loja: typeof a.loja === 'string' ? a.loja : '', uber: !!a.uber }; } catch (e) { return {}; }
  }
  function saveAddr(addr) {
    localStorage.setItem(ADDR_KEY, JSON.stringify(addr));
  }

  function parsePrice(str) {
    if (!str) return 0;
    const n = String(str).replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(n) || 0;
  }
  function formatPrice(n) {
    return 'R$ ' + n.toFixed(2).replace('.', ',');
  }

  function addItem(item) {
    const items = loadCart();
    const existing = items.find(i => i.produtoId === item.produtoId && i.tamanho === item.tamanho && i.cor === item.cor);
    if (existing) existing.qty += item.qty;
    else items.push(item);
    saveCart(items);
    openDrawer();
    const btn = document.getElementById('laet-cart-nav-btn');
    if (btn) {
      btn.classList.remove('pulse');
      void btn.offsetWidth;
      btn.classList.add('pulse');
    }
  }
  function removeItem(idx) {
    const items = loadCart();
    items.splice(idx, 1);
    saveCart(items);
    renderDrawer();
  }
  function updateQty(idx, qty) {
    const items = loadCart();
    if (qty <= 0) items.splice(idx, 1);
    else items[idx].qty = qty;
    saveCart(items);
    renderDrawer();
  }
  function clearCart() {
    if (confirm('Limpar todo o carrinho?')) { saveCart([]); renderDrawer(); }
  }

  function totalCount() { return loadCart().reduce((s, i) => s + i.qty, 0); }
  function totalValue() { return loadCart().reduce((s, i) => s + parsePrice(i.valor) * i.qty, 0); }

  function injectStyles() {
    const css = `
      .navbar-cart-btn { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,.14); flex-shrink: 0; box-shadow: none; cursor: pointer; transition: background .2s; border: none; margin-left: 4px; }
      .navbar-cart-btn:hover { background: rgba(255,255,255,.26); }
      @keyframes laet-cart-pulse { 0% { transform: scale(1); } 30% { transform: scale(1.25); } 100% { transform: scale(1); } }
      .navbar-cart-btn.pulse { animation: laet-cart-pulse .5s ease; }
      .navbar-cart-btn svg { width: 20px; height: 20px; stroke: #fff; fill: none; stroke-width: 2; }
      #laet-cart-badge { position: absolute; top: -3px; right: -3px; background: #FFC107; color: #212529; font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 10px; min-width: 18px; height: 18px; border-radius: 9px; display: none; align-items: center; justify-content: center; padding: 0 4px; }
      #laet-cart-overlay { position: fixed; inset: 0; z-index: 400; background: rgba(6,43,99,.55); opacity: 0; visibility: hidden; transition: opacity .25s; }
      #laet-cart-overlay.open { opacity: 1; visibility: visible; }
      #laet-cart-panel { position: absolute; top: 0; right: 0; height: 100%; width: 100%; max-width: 400px; background: #fff; display: flex; flex-direction: column; transform: translateX(100%); transition: transform .3s ease; font-family: 'Poppins', sans-serif; }
      #laet-cart-overlay.open #laet-cart-panel { transform: translateX(0); }
      .laet-cart-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 22px; background: #062B63; color: #fff; }
      .laet-cart-header h3 { font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 16px; margin: 0; }
      .laet-cart-close { background: none; border: none; color: #fff; font-size: 22px; cursor: pointer; line-height: 1; opacity: .8; }
      .laet-cart-close:hover { opacity: 1; }
      #laet-cart-body { flex: 1; overflow-y: auto; padding: 18px 22px; }
      .laet-cart-empty { color: #777; font-size: 14px; text-align: center; margin-top: 40px; line-height: 1.6; }
      .laet-cart-item { display: flex; align-items: flex-start; gap: 10px; padding: 14px 0; border-bottom: 1px solid #EEF1F6; }
      .laet-cart-item-info { flex: 1; min-width: 0; }
      .laet-cart-item-nome { font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 13px; color: #212529; margin-bottom: 2px; }
      .laet-cart-item-detalhe { font-size: 12px; color: #777; margin-bottom: 4px; }
      .laet-cart-item-preco { font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 13px; color: #0D47A1; }
      .laet-cart-item-qty { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
      .laet-cart-item-qty button { width: 24px; height: 24px; border-radius: 6px; border: 1px solid #DCE1EA; background: #F0F2F5; font-size: 14px; cursor: pointer; line-height: 1; }
      .laet-cart-item-qty span { font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 13px; min-width: 16px; text-align: center; }
      .laet-cart-item-remove { background: none; border: none; color: #C62828; font-size: 14px; cursor: pointer; flex-shrink: 0; padding: 2px; }
      .laet-cart-section-title { font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 13px; color: #0D47A1; margin: 18px 0 10px; text-transform: uppercase; letter-spacing: .5px; }
      .laet-cart-field { margin-bottom: 10px; }
      .laet-cart-field label { display: block; font-size: 12px; color: #555; margin-bottom: 4px; font-weight: 600; }
      .laet-cart-field input { width: 100%; padding: 9px 10px; border: 1.5px solid #DCE1EA; border-radius: 7px; font-size: 13px; font-family: 'Poppins', sans-serif; }
      .laet-cart-field input:focus { outline: none; border-color: #0D47A1; }
      .laet-endereco-resultado { font-size: 12px; color: #555; margin-top: 4px; line-height: 1.5; }
      .laet-cart-row { display: flex; gap: 10px; }
      .laet-cart-row > div { flex: 1; }
      #laet-cart-footer { padding: 16px 22px 20px; border-top: 1px solid #EEF1F6; }
      .laet-cart-total { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-family: 'Montserrat', sans-serif; }
      .laet-cart-total span:first-child { font-size: 13px; color: #555; font-weight: 600; }
      .laet-cart-total span:last-child { font-size: 18px; color: #0D47A1; font-weight: 800; }
      .laet-cart-checkout { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; background: #25D366; color: #fff; font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 14px; padding: 13px; border-radius: 8px; border: none; cursor: pointer; transition: filter .2s; }
      .laet-cart-checkout:hover { filter: brightness(1.08); }
      .laet-cart-clear { display: block; width: 100%; text-align: center; background: none; border: none; color: #999; font-size: 12px; margin-top: 10px; cursor: pointer; }
      @media (max-width: 480px) { #laet-cart-panel { max-width: 100%; } }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function injectCartButton() {
    const btnHtml = `
      <button id="laet-cart-nav-btn" class="navbar-cart-btn" onclick="LaetCart.openDrawer()" aria-label="Carrinho">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
        <span id="laet-cart-badge">0</span>
      </button>`;
    const navToggle = document.querySelector('.navbar-toggle');
    const navWa = document.querySelector('.navbar-wa');
    if (navToggle) navToggle.insertAdjacentHTML('beforebegin', btnHtml);
    else if (navWa) navWa.insertAdjacentHTML('afterend', btnHtml);
    else document.querySelector('.navbar-inner')?.insertAdjacentHTML('beforeend', btnHtml);
  }

  function injectMarkup() {
    injectCartButton();
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <div id="laet-cart-overlay" onclick="if(event.target===this) LaetCart.closeDrawer()">
        <div id="laet-cart-panel">
          <div class="laet-cart-header">
            <h3>Sua lista de compras</h3>
            <button class="laet-cart-close" onclick="LaetCart.closeDrawer()">✕</button>
          </div>
          <div id="laet-cart-body"></div>
          <div id="laet-cart-footer">
            <div class="laet-cart-section-title">Em qual loja você vai retirar?</div>
            <div class="laet-cart-field">
              <select id="laet-loja" onchange="LaetCart.saveAddrField('loja', this.value)" style="width:100%;padding:9px 10px;border:1.5px solid #DCE1EA;border-radius:7px;font-size:13px;font-family:'Poppins',sans-serif;background:#fff">
                <option value="">Escolha a loja mais perto de você</option>
                <option>São Paulo — Vila Bela (Av. Sapopemba, 25.723)</option>
                <option>Mauá — Jardim São João (Rua do Britador, 2)</option>
                <option>Mauá — Santa Cecília (Av. Ayrton Senna da Silva, 235)</option>
                <option>Santo André — Vila Luzita (Av. São Bernardo do Campo, 757)</option>
                <option>Mauá — Jardim Itapark (Av. Itapark, 4377)</option>
                <option>São Bernardo — Santa Terezinha (Av. Luís Pequini, 899)</option>
              </select>
            </div>
            <div class="laet-endereco-resultado" id="laet-endereco-resultado"><a href="index.html#enderecos" style="color:#0D47A1;font-weight:600">📍 Ver endereços e mapa das lojas</a></div>
            <label style="display:flex;gap:8px;align-items:flex-start;font-size:12px;color:#555;margin:10px 0 4px;line-height:1.4"><input type="checkbox" id="laet-uber" onchange="LaetCart.saveAddrField('uber', this.checked)" style="margin-top:2px"> Vou pedir um Uber ou Lalamove pra retirar (a corrida é por minha conta)</label>
            <div class="laet-cart-total">
              <span>Total estimado</span>
              <span id="laet-cart-total">R$ 0,00</span>
            </div>
            <button class="laet-cart-checkout" onclick="LaetCart.checkout()">
              💬 Confirmar no WhatsApp
            </button>
            <button class="laet-cart-clear" onclick="LaetCart.clearCart()">Limpar carrinho</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);
  }

  function renderBadge() {
    const badge = document.getElementById('laet-cart-badge');
    if (!badge) return;
    const count = totalCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }

  function renderDrawer() {
    const body = document.getElementById('laet-cart-body');
    if (!body) return;
    const items = loadCart();
    if (items.length === 0) {
      body.innerHTML = '<p class="laet-cart-empty">Seu carrinho está vazio.<br>Escolha um produto e adicione aqui.</p>';
    } else {
      body.innerHTML = items.map((it, idx) => `
        <div class="laet-cart-item">
          <div class="laet-cart-item-info">
            <div class="laet-cart-item-nome">${esc(it.nome)}</div>
            <div class="laet-cart-item-detalhe">${esc(it.tamanho)}${it.cor ? ' · Cor: ' + esc(it.cor) : ''}</div>
            <div class="laet-cart-item-preco">${esc(it.valor)}</div>
          </div>
          <div class="laet-cart-item-qty">
            <button onclick="LaetCart.updateQty(${idx}, ${Number(it.qty) - 1})">−</button>
            <span>${Number(it.qty)}</span>
            <button onclick="LaetCart.updateQty(${idx}, ${Number(it.qty) + 1})">+</button>
          </div>
          <button class="laet-cart-item-remove" onclick="LaetCart.removeItem(${idx})" title="Remover">✕</button>
        </div>
      `).join('');
    }
    const totalEl = document.getElementById('laet-cart-total');
    if (totalEl) totalEl.textContent = formatPrice(totalValue());
    renderBadge();
  }

  function renderAddrFields() {
    const addr = loadAddr();
    const lojaSel = document.getElementById('laet-loja');
    const uber = document.getElementById('laet-uber');
    if (lojaSel) lojaSel.value = addr.loja || '';
    if (uber) uber.checked = !!addr.uber;
  }

  function openDrawer() {
    const overlay = document.getElementById('laet-cart-overlay');
    if (!overlay) return;
    overlay.classList.add('open');
    renderDrawer();
    renderAddrFields();
  }
  function closeDrawer() {
    const overlay = document.getElementById('laet-cart-overlay');
    if (overlay) overlay.classList.remove('open');
  }

  function saveAddrField(field, value) {
    const addr = loadAddr();
    addr[field] = value;
    saveAddr(addr);
  }

  function checkout() {
    const items = loadCart();
    if (items.length === 0) { alert('Seu carrinho está vazio. Adicione produtos antes de finalizar.'); return; }
    const addr = loadAddr();
    let msg = 'Olá! Quero confirmar se vocês têm estes produtos:\n\n';
    items.forEach((it, idx) => {
      msg += `${idx + 1}. ${it.nome} — ${it.tamanho}`;
      if (it.cor) msg += ` — Cor: ${it.cor}`;
      msg += ` — Qtd: ${it.qty} — ${it.valor}\n`;
    });
    msg += `\nTotal estimado: ${formatPrice(totalValue())}\n`;
    if (addr.loja) msg += `\n📍 Loja de retirada: ${addr.loja}\n`;
    else msg += '\n📍 Ainda não escolhi a loja — qual fica mais perto de mim?\n';
    if (addr.uber) msg += '🚗 Vou pedir um Uber/Lalamove pra retirar (corrida por minha conta).\n';
    msg += '\nPode confirmar disponibilidade e forma de pagamento? Obrigado!';
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }

  window.LaetCart = {
    add: addItem,
    removeItem,
    updateQty,
    clearCart,
    openDrawer,
    closeDrawer,
    saveAddrField,
    checkout
  };

  document.addEventListener('DOMContentLoaded', function () {
    injectStyles();
    injectMarkup();
    renderBadge();
  });
})();
