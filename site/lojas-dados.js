/* Dados das 6 lojas — fonte única pra "Loja mais perto" (Home e lojas.html), carrinho e lista.html.
   lat/lng: coordenada exata da porta da loja (Google Maps → segurar o dedo no pin → copiar os números).
   Enquanto uma loja estiver sem coordenada, ela aparece normal, só sem a distância.
   Se TODAS estiverem sem coordenada, o botão "Usar minha localização" nem aparece.
   rotulo: texto exato usado no seletor do carrinho (não mudar sem mudar lá também).
   wa: WhatsApp oficial da loja (mesma lista de canais-oficiais.js). */
window.LAET_LOJAS = [
  { n: 1, nome: 'São Paulo — Vila Bela',          rotulo: 'São Paulo — Vila Bela (Av. Sapopemba, 25.723)',             wa: '5511980820686', mapa: 'https://maps.app.goo.gl/QAoyVXbj8rTRw6nZ7', lat: null, lng: null },
  { n: 2, nome: 'Mauá — Jardim São João',         rotulo: 'Mauá — Jardim São João (Rua do Britador, 2)',               wa: '5511977504434', mapa: 'https://maps.app.goo.gl/Ak3hXJcCwoBhKdSS7', lat: null, lng: null },
  { n: 3, nome: 'Mauá — Santa Cecília',           rotulo: 'Mauá — Santa Cecília (Av. Ayrton Senna da Silva, 235)',     wa: '5511977498813', mapa: 'https://maps.app.goo.gl/Qr5esPEq1s5kbZt7A', lat: null, lng: null },
  { n: 4, nome: 'Santo André — Vila Luzita',      rotulo: 'Santo André — Vila Luzita (Av. São Bernardo do Campo, 757)', wa: '5511948551977', mapa: 'https://maps.app.goo.gl/sxP6HDJ4aVjyzYss9', lat: null, lng: null },
  { n: 5, nome: 'Mauá — Jardim Itapark',          rotulo: 'Mauá — Jardim Itapark (Av. Itapark, 4377)',                 wa: '5511914334875', mapa: 'https://maps.app.goo.gl/rnU1ho73iJRRC2aM7', lat: null, lng: null },
  { n: 6, nome: 'São Bernardo — Santa Terezinha', rotulo: 'São Bernardo — Santa Terezinha (Av. Luís Pequini, 899)',    wa: '5511918755095', mapa: 'https://maps.app.goo.gl/mXn9ybPDVcPU1BHG8', lat: null, lng: null }
];
