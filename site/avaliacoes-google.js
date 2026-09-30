/* Avaliações do Google — fonte única da nota e do total exibidos no site.
   Nota geral = média ponderada pelo nº de avaliações de cada loja.
   Pra atualizar: edite os números abaixo (cada loja no seu Google Meu Negócio) e publique.
   Os elementos marcados com data-google-nota / data-google-qtd são preenchidos sozinhos. */
(function () {
  var LOJAS = [
    { loja: 'Loja 1 — Vila Bela (Sapopemba)', nota: 4.9, qtd: 38 }
    // { loja: 'Loja 2 — Jardim São João (Mauá)', nota: 0, qtd: 0 },
    // { loja: 'Loja 3 — Santa Cecília (Mauá)', nota: 0, qtd: 0 },
    // { loja: 'Loja 4 — Vila Luzita (Santo André)', nota: 0, qtd: 0 },
    // { loja: 'Loja 5 — Jardim Itapark (Mauá)', nota: 0, qtd: 0 },
    // { loja: 'Loja 6 — Santa Terezinha (São Bernardo)', nota: 0, qtd: 0 }
  ];

  var total = 0, soma = 0;
  LOJAS.forEach(function (l) { if (l.qtd > 0) { total += l.qtd; soma += l.nota * l.qtd; } });
  if (!total) return;
  var media = Math.round((soma / total) * 10) / 10;
  var mediaTxt = String(media.toFixed(1)).replace('.', ',');

  function preencher() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-google-nota]'), function (el) {
      el.dataset.target = String(media);
      el.dataset.decimals = '1';
      el.textContent = mediaTxt;
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-google-qtd]'), function (el) {
      el.dataset.target = String(total);
      el.textContent = String(total);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', preencher);
  else preencher();
})();
