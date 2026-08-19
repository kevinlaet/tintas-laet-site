/* Índice de busca do site — usado por search.js.
   Gerado a partir do objeto `produtos` de produto.html. Se adicionar um
   produto novo lá, adicionar a entrada correspondente aqui também
   (id precisa bater com o id usado em produto.html?id=...). O campo
   "aliases" é opcional — nomes/variantes que uma pessoa pode digitar mas
   que não aparecem no nome oficial do produto (ex: tipos de rolo dentro
   de "Rolos de Pintura"). */
const LAET_SEARCH_INDEX = [
  { id: 'emborrachada', nome: 'Tinta Emborrachada', categoria: 'Tintas' },
  { id: 'piso-fachada', nome: 'Tinta Piso e Fachada Premium', categoria: 'Tintas' },
  { id: 'massa-corrida', nome: 'Massa Corrida', categoria: 'Massa Corrida / Acrílica' },
  { id: 'massa-acrilica', nome: 'Massa Acrílica', categoria: 'Massa Corrida / Acrílica' },
  { id: 'grafiato', nome: 'Grafiato', categoria: 'Texturizados' },
  { id: 'textura-lisa', nome: 'Textura Lisa', categoria: 'Texturizados' },
  { id: 'textura-design', nome: 'Textura Design', categoria: 'Texturizados' },
  { id: 'epoxi-base-agua', nome: 'Tinta Epóxi Base Água', categoria: 'Tintas Alta Qualidade' },
  { id: 'efeito-cimento-queimado', nome: 'Efeito Cimento Queimado', categoria: 'Texturizados' },
  { id: 'corante', nome: 'Corante Premium', categoria: 'Complementos' },
  { id: 'super-profissional', nome: 'Tinta Super Profissional', categoria: 'Tintas' },
  { id: 'standard', nome: 'Tinta 1ª Linha Standard', categoria: 'Tintas Alta Qualidade' },
  { id: 'latex-vinil', nome: 'Latex Vinil 18L', categoria: 'Tintas' },
  { id: 'direto-no-gesso', nome: 'Tinta Direto no Gesso', categoria: 'Tintas' },
  { id: 'premium-lavavel', nome: 'Tinta Premium Lavável', categoria: 'Tintas Alta Qualidade' },
  { id: 'kit-pintura', nome: 'Kit Pintura 5 itens', categoria: 'Ferramentas' },
  { id: 'rolos-pintura', nome: 'Rolos de Pintura', categoria: 'Ferramentas', aliases: ['rolo anti-respingo', 'rolo poliéster', 'rolo lã de carneiro', 'rolo espuma pop'] },
  { id: 'rolo-la-super', nome: 'Rolo de Lã Super', categoria: 'Ferramentas' },
  { id: 'cabo-rolo', nome: 'Cabo para Rolo (Reforçado)', categoria: 'Ferramentas' },
  { id: 'lona-preta', nome: 'Lona Preta', categoria: 'Ferramentas' },
  { id: 'papelao-protege-piso', nome: 'Papelão Protege-Piso', categoria: 'Ferramentas' },
  { id: 'trincha', nome: 'Trincha', categoria: 'Ferramentas' },
  { id: 'aguarras', nome: 'Aguarrás', categoria: 'Ferramentas' },
  { id: 'thinner', nome: 'Thinner', categoria: 'Ferramentas' },
  { id: 'spray', nome: 'Tinta Spray', categoria: 'Ferramentas' },
  { id: 'extensor', nome: 'Extensor para Rolo', categoria: 'Ferramentas' },
  { id: 'desempenadeira-aco', nome: 'Desempenadeira de Aço 23cm', categoria: 'Ferramentas' },
  { id: 'desempenadeira-inox', nome: 'Desempenadeira Decorativa INOX', categoria: 'Ferramentas' },
  { id: 'desempenadeira-pvc-grafiato', nome: 'Desempenadeira PVC 23cm (Grafiato)', categoria: 'Ferramentas' },
  { id: 'pad-pintura', nome: 'Pad de Pintura', categoria: 'Ferramentas' },
  { id: 'fita-crepe', nome: 'Fita Crepe', categoria: 'Ferramentas' },
  { id: 'lixa-massa', nome: 'Lixa de Massa (Tatu)', categoria: 'Ferramentas' },
  { id: 'lixa-ferro', nome: 'Lixa de Ferro (Adere)', categoria: 'Ferramentas' },
  { id: 'fundo-preparador', nome: 'Fundo Preparador', categoria: 'Complementos' },
  { id: 'seladora', nome: 'Seladora', categoria: 'Complementos' },
  { id: 'liqui-brilho', nome: 'Liqui-brilho', categoria: 'Complementos' },
  { id: 'espatula-silicone', nome: 'Espátula de Silicone', categoria: 'Ferramentas' },
  { id: 'esmalte-ecologico', nome: 'Tinta Esmalte Ecológico Base Água', categoria: 'Esmaltes' },
];
