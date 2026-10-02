/* Dados das 6 lojas — fonte única pra "Loja mais perto" (Home e lojas.html).
   lat/lng: coordenada exata da porta da loja (Google Maps → segurar o dedo no pin → copiar os números).
   Enquanto uma loja estiver sem coordenada, ela aparece normal, só sem a distância.
   Se TODAS estiverem sem coordenada, o botão "Usar minha localização" nem aparece. */
window.LAET_LOJAS = [
  { n: 1, nome: 'São Paulo — Vila Bela',          lat: null, lng: null },
  { n: 2, nome: 'Mauá — Jardim São João',         lat: null, lng: null },
  { n: 3, nome: 'Mauá — Santa Cecília',           lat: null, lng: null },
  { n: 4, nome: 'Santo André — Vila Luzita',      lat: null, lng: null },
  { n: 5, nome: 'Mauá — Jardim Itapark',          lat: null, lng: null },
  { n: 6, nome: 'São Bernardo — Santa Terezinha', lat: null, lng: null }
];
