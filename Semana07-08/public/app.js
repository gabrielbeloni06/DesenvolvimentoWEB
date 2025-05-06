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
    }
  ];
  const listaFilmes = document.getElementById("lista-filmes");
  const recomendacoes = document.getElementById("recomendacoes");
  const destaque = document.getElementById("filme-destaque");
  filmes.forEach(filme => {
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
    recomendacoes.innerHTML += `<div class="col-12 col-sm-6 col-md-3 mb-4">${cardHTML}</div>`;
  });
  const filmeDestaque = filmes[0];
  destaque.innerHTML = `
    <img src="${filmeDestaque.imagem}" class="card-img-top" alt="${filmeDestaque.titulo}">
    <div class="card-body">
      <h5 class="card-title">${filmeDestaque.titulo}</h5>
      <p class="card-text">${filmeDestaque.descricao}</p>
    </div>
  `;