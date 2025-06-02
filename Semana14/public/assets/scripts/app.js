const API_URL = 'http://localhost:3000/filmes';

// Função para carregar lista de filmes na página inicial
async function carregarLista() {
  try {
    const res = await fetch(API_URL);
    const filmes = await res.json();

    const listaFilmes = document.getElementById('lista-filmes');
    const carouselInner = document.getElementById('carousel-inner');

    filmes.forEach((filme, index) => {
      // Card do filme
      const col = document.createElement('div');
      col.className = 'col-12 col-sm-6 col-md-4 mb-4';

      col.innerHTML = `
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
      listaFilmes.appendChild(col);

      // Item do carrossel
      const carouselItem = document.createElement('div');
      carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
      carouselItem.innerHTML = `
        <a href="detalhes.html?id=${filme.id}">
          <img src="${filme.imagem}" class="d-block w-100" alt="${filme.titulo}">
        </a>
      `;
      carouselInner.appendChild(carouselItem);
    });

    // Destaque
    if (filmes.length) {
      const destaque = document.getElementById('filme-destaque');
      const primeiro = filmes[0];
      destaque.innerHTML = `
        <img src="${primeiro.imagem}" class="card-img-top" alt="${primeiro.titulo}">
        <div class="card-body">
          <h5 class="card-title">${primeiro.titulo}</h5>
          <p class="card-text">${primeiro.descricao}</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Erro ao carregar filmes:', error);
  }
}

// Função para carregar os detalhes de um filme específico
async function carregarDetalhes() {
  const urlParams = new URLSearchParams(window.location.search);
  const filmeId = urlParams.get('id');

  try {
    const res = await fetch(`${API_URL}/${filmeId}`);
    if (!res.ok) throw new Error("Filme não encontrado");

    const filme = await res.json();

    document.getElementById("imagemFilme").src = filme.imagem;
    document.getElementById("tituloFilme").textContent = filme.titulo;
    document.getElementById("descricaoFilme").textContent = filme.descricao;
    document.getElementById("generoFilme").textContent = filme.genero;
    document.getElementById("duracaoFilme").textContent = filme.duracao;
    document.getElementById("classificacaoFilme").textContent = filme.classificacao;

    const iframe = document.createElement('iframe');
    iframe.width = "100%";
    iframe.height = "400";
    iframe.src = filme.trailer;
    iframe.frameBorder = "0";
    iframe.allowFullscreen = true;
    document.getElementById("filme-individual").appendChild(iframe);

    // Botões de curtir/não curtir
    document.getElementById("btnCurtir").addEventListener("click", () => {
      alert("Você curtiu o filme!");
    });

    document.getElementById("btnNaoCurtir").addEventListener("click", () => {
      alert("Você não curtiu o filme.");
    });

  } catch (error) {
    console.error('Erro ao carregar detalhes do filme:', error);
    document.getElementById("tituloFilme").textContent = "Filme não encontrado";
    document.getElementById("descricaoFilme").textContent = "Desculpe, não conseguimos encontrar os detalhes desse filme.";
  }
}

// Inicialização da página correta
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  if (path.endsWith('index.html') || path === '/' || path.endsWith('/public')) {
    carregarLista();
  } else if (path.endsWith('detalhes.html')) {
    carregarDetalhes();
  }
});