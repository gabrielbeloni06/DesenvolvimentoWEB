const filmes = [
  {
    id: 1,
    titulo: "Minecraft: O Filme",
    descricao: "Baseado no famoso jogo.",
    imagem: "img/minecraft.jpg"
  },
  {
    id: 2,
    titulo: "A Presença",
    descricao: "Suspense nacional do ano.",
    imagem: "img/a-presenca.jpg"
  },
  {
    id: 3,
    titulo: "Five Nights at Freddy's",
    descricao: "Uma história de terror baseada no jogo.",
    imagem: "img/outro.jpg"
  },
  {
    id: 4,
    titulo: "Avatar 2",
    descricao: "A continuação da saga de Pandora.",
    imagem: "img/avatar2.jpg"
  },
  {
    id: 5,
    titulo: "Interestelar",
    descricao: "A busca por um novo lar para a humanidade.",
    imagem: "img/interestelar.jpg"
  }
];

const listaFilmes = document.getElementById("lista-filmes");
const destaque = document.getElementById("filme-destaque");
const carouselInner = document.getElementById("carousel-inner");

filmes.forEach((filme, index) => {
  const cardHTML = `
    <article class="card h-100">
      <a href="detalhes.html?id=${filme.id}" class="text-decoration-none text-dark">
        <img src="${filme.imagem}" class="card-img-top" alt="${filme.titulo}">
        <div class="card-body">
          <h5 class="card-title">${filme.titulo}</h5>
          <p class="card-text">${filme.descricao}</p>
        </div>
      </a>
    </article>
  `;

  listaFilmes.innerHTML += `<div class="col-12 col-sm-6 col-md-4 mb-4">${cardHTML}</div>`;
  carouselInner.innerHTML += `
    <div class="carousel-item ${index === 0 ? "active" : ""}">
      <a href="detalhes.html?id=${filme.id}">
        <img src="${filme.imagem}" class="d-block w-100" alt="${filme.titulo}">
      </a>
    </div>
  `;
});

const filmeDestaque = filmes[0];
destaque.innerHTML = `
  <img src="${filmeDestaque.imagem}" class="card-img-top" alt="${filmeDestaque.titulo}">
  <div class="card-body">
    <h5 class="card-title">${filmeDestaque.titulo}</h5>
    <p class="card-text">${filmeDestaque.descricao}</p>
  </div>
`;