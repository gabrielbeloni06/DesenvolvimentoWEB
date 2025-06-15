const API_BASE_URL = '';

let userFavoriteMovieIds = [];

document.addEventListener('DOMContentLoaded', () => {
    checkAuthAndRenderUI();
    
    const campoBusca = document.getElementById('campoBusca');
    const botaoBusca = document.getElementById('botaoBusca');

    if (botaoBusca) {
        botaoBusca.addEventListener('click', () => {
            if (campoBusca) {
                console.log('Frontend: Botão de busca clicado. Termo:', campoBusca.value);
                loadAllMovies(campoBusca.value);
            }
        });
    }

    if (campoBusca) {
        campoBusca.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                console.log('Frontend: Enter pressionado. Termo:', campoBusca.value);
                loadAllMovies(campoBusca.value);
            }
        });
    }
});

async function checkAuthAndRenderUI() {
    const token = localStorage.getItem('token');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const logoutButton = document.getElementById('logoutButton');
    const loginButton = document.getElementById('loginButton');
    const favoritesDropdownContainer = document.getElementById('favoritesDropdownContainer');
    const adminAddMovieLink = document.getElementById('adminAddMovieLink');
    const adminSection = document.getElementById('adminSection');

    if (token) {
        try {
            const payloadBase64 = token.split('.')[1];
            const decodedPayload = JSON.parse(atob(payloadBase64));
            const userRole = decodedPayload.role;
            const userName = decodedPayload.nome || decodedPayload.email;

            if (welcomeMessage) welcomeMessage.textContent = `Olá, ${userName}!`;
            if (logoutButton) logoutButton.style.display = 'inline-block';
            if (loginButton) loginButton.style.display = 'none';
            if (favoritesDropdownContainer) favoritesDropdownContainer.style.display = 'block';

            if (userRole === 'admin') {
                if (adminAddMovieLink) adminAddMovieLink.style.display = 'inline-block';
                if (adminSection) adminSection.style.display = 'block';
            } else {
                if (adminAddMovieLink) adminAddMovieLink.style.display = 'none';
                if (adminSection) adminSection.style.display = 'none';
            }

            await loadUserFavoritesForDropdown();
            loadAllMovies();
        } catch (error) {
            console.error('Erro ao decodificar token ou verificar autenticação:', error);
            localStorage.removeItem('token');
            if (welcomeMessage) welcomeMessage.textContent = '';
            if (logoutButton) logoutButton.style.display = 'none';
            if (loginButton) loginButton.style.display = 'inline-block';
            if (favoritesDropdownContainer) favoritesDropdownContainer.style.display = 'none';
            if (adminAddMovieLink) adminAddMovieLink.style.display = 'none';
            if (adminSection) adminSection.style.display = 'none';
            loadAllMovies();
        }
    } else {
        if (welcomeMessage) welcomeMessage.textContent = '';
        if (logoutButton) logoutButton.style.display = 'none';
        if (loginButton) loginButton.style.display = 'inline-block';
        if (favoritesDropdownContainer) favoritesDropdownContainer.style.display = 'none';
        if (adminAddMovieLink) adminAddMovieLink.style.display = 'none';
        if (adminSection) adminSection.style.display = 'none';
        loadAllMovies();
    }
}

document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('token');
    userFavoriteMovieIds = [];
    alert('Você foi desconectado.');
    checkAuthAndRenderUI(); 
});

async function loadAllMovies(searchTerm = '') {
    const moviesContainer = document.getElementById('lista-filmes');
    const carouselInner = document.getElementById('carousel-inner');
    const carouselSection = document.getElementById('carouselFilmes');
    const destaqueSection = document.getElementById('filme-destaque');
    const catalogoTitulo = document.querySelector('.container.my-5 h2');

    let url = `${API_BASE_URL}/api/movies`;
    if (searchTerm) {
        url += `?q=${encodeURIComponent(searchTerm)}`;
        if (carouselSection) carouselSection.style.display = 'none';
        if (destaqueSection) destaqueSection.style.display = 'none';
        if (catalogoTitulo) catalogoTitulo.textContent = `Resultados da Busca por "${searchTerm}"`;
        console.log('Frontend: URL de busca:', url);
    } else {
        if (carouselSection) carouselSection.style.display = 'block';
        if (destaqueSection) destaqueSection.style.display = 'block';
        if (catalogoTitulo) catalogoTitulo.textContent = 'Catálogo de Filmes';
        console.log('Frontend: Carregando todos os filmes. URL:', url);
    }

    try {
        const response = await fetch(url);
        const filmes = await response.json();
        if (moviesContainer) moviesContainer.innerHTML = '';
        
        if (!searchTerm && carouselInner) {
            carouselInner.innerHTML = ''; 
            filmes.forEach((filme, index) => {
                const carouselItem = document.createElement('div');
                carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
                carouselItem.innerHTML = `
                    <a href="detalhes.html?id=${filme.id}">
                        <img src="${filme.imagem}" class="d-block w-100" alt="${filme.titulo}">
                    </a>
                `;
                carouselInner.appendChild(carouselItem);
            });

            if (carouselSection && filmes.length > 0 && typeof bootstrap !== 'undefined' && bootstrap.Carousel) {
                const existingCarousel = bootstrap.Carousel.getInstance(carouselSection);
                if (existingCarousel) {
                    existingCarousel.dispose();
                }
                const bsCarousel = new bootstrap.Carousel(carouselSection);
                bsCarousel.to(0);
                bsCarousel.cycle();
            }
        } else if (searchTerm && carouselInner) { 
            carouselInner.innerHTML = ''; 
        }


        if (filmes.length === 0 && moviesContainer) {
            moviesContainer.innerHTML = '<p class="text-white">Nenhum filme encontrado para a sua busca.</p>';
        }

        filmes.forEach((filme) => {
            const movieCard = createMovieCard(filme);
            if (moviesContainer) moviesContainer.appendChild(movieCard);
        });

        if (destaqueSection && filmes.length > 0 && !searchTerm) {
            const primeiro = filmes[0];
            destaqueSection.innerHTML = `
                <img src="${primeiro.imagem}" class="card-img-top" alt="${primeiro.titulo}">
                <div class="card-body">
                    <h5 class="card-title text-white">${primeiro.titulo}</h5>
                    <p class="card-text text-muted">${primeiro.descricao}</p>
                </div>
            `;
        } else if (destaqueSection && searchTerm) {
            destaqueSection.innerHTML = '';
        }

    } catch (error) {
        console.error('Erro ao carregar filmes:', error);
        if (moviesContainer) moviesContainer.innerHTML = '<p class="text-danger">Erro ao carregar filmes. Tente novamente mais tarde.</p>';
    }
}

function createMovieCard(movie) {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-md-4 mb-4';

    const isFavorited = userFavoriteMovieIds.includes(movie.id);
    const token = localStorage.getItem('token');
    const showFavoriteButtons = !!token;

    let favoriteButtonHtml = '';
    if (showFavoriteButtons) {
        favoriteButtonHtml = `
            <button class="btn btn-link p-0 text-decoration-none favorite-icon-btn" 
                    data-movie-id="${movie.id}" data-favorited="${isFavorited ? 'true' : 'false'}"
                    aria-label="${isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
                <i class="bi ${isFavorited ? 'bi-heart-fill text-danger' : 'bi-heart text-white'} fs-4"></i>
            </button>
        `;
    }

    col.innerHTML = `
        <article class="card h-100">
            <a href="detalhes.html?id=${movie.id}" class="text-decoration-none text-dark">
                <img src="${movie.imagem}" class="card-img-top" alt="${movie.titulo}">
                <div class="card-body">
                    <h5 class="card-title text-white">${movie.titulo}</h5>
                    <p class="card-text text-muted">${movie.descricao}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">${movie.genero}</small>
                        ${favoriteButtonHtml}
                    </div>
                </div>
            </a>
        </article>
    `;
    
    if (showFavoriteButtons) {
        const favoriteButtonElement = col.querySelector('.favorite-icon-btn');
        if (favoriteButtonElement) {
            favoriteButtonElement.addEventListener('click', (event) => {
                event.preventDefault(); 
                event.stopPropagation(); 
                const movieId = favoriteButtonElement.dataset.movieId;
                const isCurrentlyFavorited = favoriteButtonElement.dataset.favorited === 'true'; 
                toggleFavorite(movieId, !isCurrentlyFavorited);
            });
        }
    }
    return col;
}


async function loadUserFavoritesForDropdown() {
    const token = localStorage.getItem('token');
    const favoriteDropdownMenu = document.getElementById('favoriteDropdownMenu');
    const noFavoritesDropdownMessage = document.getElementById('noFavoritesDropdownMessage');
    
    if (favoriteDropdownMenu) favoriteDropdownMenu.innerHTML = '';
    if (noFavoritesDropdownMessage) noFavoritesDropdownMessage.style.display = 'block';

    userFavoriteMovieIds = [];

    if (!token) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/favorites`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            userFavoriteMovieIds = data.movieIds || [];

            if (userFavoriteMovieIds.length > 0) {
                if (noFavoritesDropdownMessage) noFavoritesDropdownMessage.style.display = 'none';
                
                const moviePromises = userFavoriteMovieIds.map(movieId =>
                    fetch(`${API_BASE_URL}/api/movies/${movieId}`).then(res => res.json())
                );
                const favoriteMovieDetails = await Promise.all(moviePromises);

                favoriteMovieDetails.forEach(movie => {
                    if (movie && movie.id && favoriteDropdownMenu) {
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `
                            <div class="d-flex justify-content-between align-items-center px-3 py-2">
                                <a href="detalhes.html?id=${movie.id}" class="dropdown-item text-white p-0 flex-grow-1">${movie.titulo}</a>
                                <button class="btn btn-danger btn-sm ms-2" 
                                        onclick="toggleFavorite('${movie.id}', false); event.stopPropagation();">
                                    <i class="bi bi-x-lg"></i>
                                </button>
                            </div>
                        `;
                        favoriteDropdownMenu.appendChild(listItem);
                    }
                });
            } else {
                if (noFavoritesDropdownMessage) noFavoritesDropdownMessage.style.display = 'block';
            }
        } else {
            console.error('Erro ao carregar favoritos para o dropdown:', data.message);
            if (noFavoritesDropdownMessage) noFavoritesDropdownMessage.textContent = 'Erro ao carregar favoritos.';
            if (noFavoritesDropdownMessage) noFavoritesDropdownMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Erro de rede ao carregar favoritos para o dropdown:', error);
        if (noFavoritesDropdownMessage) noFavoritesDropdownMessage.textContent = 'Erro de rede.';
        if (noFavoritesDropdownMessage) noFavoritesDropdownMessage.style.display = 'block';
    }
}


async function toggleFavorite(movieId, shouldFavorite) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Você precisa estar logado para favoritar/desfavoritar filmes.');
        window.location.href = 'cadastro_filmes.html';
        return;
    }

    const endpoint = shouldFavorite ? '/api/favorites/add' : '/api/favorites/remove';
    const actionText = shouldFavorite ? 'adicionar' : 'remover';

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ movieId })
        });
        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            if (shouldFavorite) {
                if (!userFavoriteMovieIds.includes(movieId)) {
                    userFavoriteMovieIds.push(movieId);
                }
            } else {
                userFavoriteMovieIds = userFavoriteMovieIds.filter(id => id !== movieId);
            }
            updateAllHeartIcons(movieId, shouldFavorite);
            loadUserFavoritesForDropdown();
        } else {
            alert(data.message || `Erro ao ${actionText} filme dos favoritos.`);
        }
    } catch (error) {
        console.error(`Erro de rede ao ${actionText} favorito:`, error);
        alert(`Erro ao ${actionText} favorito.`);
    }
}

function updateAllHeartIcons(movieId, isFavorited) {
    document.querySelectorAll(`.favorite-icon-btn[data-movie-id="${movieId}"]`).forEach(button => {
        const icon = button.querySelector('i.bi');
        if (icon) {
            if (isFavorited) {
                icon.classList.remove('bi-heart', 'text-white');
                icon.classList.add('bi-heart-fill', 'text-danger');
                button.dataset.favorited = 'true';
            } else {
                icon.classList.remove('bi-heart-fill', 'text-danger');
                icon.classList.add('bi-heart', 'text-white');
                button.dataset.favorited = 'false';
            }
        }
    });
}