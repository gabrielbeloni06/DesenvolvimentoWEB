const API_BASE_URL = '';

let currentMovieId = null;

document.addEventListener('DOMContentLoaded', () => {
    checkAuthForDetailsPage();
    const urlParams = new URLSearchParams(window.location.search);
    currentMovieId = urlParams.get('id');

    if (currentMovieId) {
        loadMovieDetails(currentMovieId);
    } else {
        const loadingMessage = document.getElementById('loadingMessage');
        const errorMessage = document.getElementById('errorMessage');
        if (loadingMessage) loadingMessage.style.display = 'none';
        if (errorMessage) {
            errorMessage.textContent = 'ID do filme não fornecido na URL.';
            errorMessage.style.display = 'block';
        }
    }
});

async function checkAuthForDetailsPage() {
    const token = localStorage.getItem('token');
    const welcomeMessage = document.getElementById('welcomeMessageDetalhes');
    const logoutButton = document.getElementById('logoutButtonDetalhes');
    const favoriteButton = document.getElementById('favoriteButton');
    const unfavoriteButton = document.getElementById('unfavoriteButton');

    if (token) {
        try {
            const payloadBase64 = token.split('.')[1];
            const decodedPayload = JSON.parse(atob(payloadBase64));
            const userName = decodedPayload.nome || decodedPayload.email;

            if (welcomeMessage) welcomeMessage.textContent = `Olá, ${userName}!`;
            if (logoutButton) logoutButton.style.display = 'inline-block';
            
            checkFavoriteStatus(currentMovieId);

        } catch (error) {
            console.error('Erro ao decodificar token ou verificar autenticação:', error);
            localStorage.removeItem('token');
            window.location.href = 'cadastro_filmes.html';
        }
    } else {
        if (welcomeMessage) welcomeMessage.textContent = '';
        if (logoutButton) logoutButton.style.display = 'none';
        if (favoriteButton) favoriteButton.style.display = 'none';
        if (unfavoriteButton) unfavoriteButton.style.display = 'none';
    }
}

document.getElementById('logoutButtonDetalhes').addEventListener('click', () => {
    localStorage.removeItem('token');
    alert('Você foi desconectado.');
    window.location.href = 'cadastro_filmes.html';
});

async function loadMovieDetails(movieId) {
    const loadingMessage = document.getElementById('loadingMessage');
    const movieContent = document.getElementById('movieContent');
    const errorMessage = document.getElementById('errorMessage');

    if (loadingMessage) loadingMessage.style.display = 'block';
    if (movieContent) movieContent.style.display = 'none';
    if (errorMessage) errorMessage.style.display = 'none';

    try {
        const response = await fetch(`${API_BASE_URL}/api/movies/${movieId}`);
        const movie = await response.json();

        if (loadingMessage) loadingMessage.style.display = 'none';

        if (response.ok) {
            if (document.getElementById('movieTitlePage')) document.getElementById('movieTitlePage').textContent = movie.titulo;
            if (document.getElementById('movieDetailsTitle')) document.getElementById('movieDetailsTitle').textContent = movie.titulo;
            if (document.getElementById('movieDetailsImage')) {
                document.getElementById('movieDetailsImage').src = movie.imagem;
                document.getElementById('movieDetailsImage').alt = movie.titulo;
            }
            if (document.getElementById('movieDetailsGenre')) document.getElementById('movieDetailsGenre').textContent = movie.genero;
            if (document.getElementById('movieDetailsDuration')) document.getElementById('movieDetailsDuration').textContent = movie.duracao;
            if (document.getElementById('movieDetailsClassification')) document.getElementById('movieDetailsClassification').textContent = movie.classificacao;
            if (document.getElementById('movieDetailsDescription')) document.getElementById('movieDetailsDescription').textContent = movie.descricao;
            
            const trailerIframe = document.getElementById('movieDetailsTrailer');
            if (trailerIframe) {
                trailerIframe.src = movie.trailer;
            }
            
            if (movieContent) movieContent.style.display = 'block';
            checkFavoriteStatus(movieId);
        } else {
            if (errorMessage) {
                errorMessage.textContent = movie.message || 'Filme não encontrado.';
                errorMessage.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Erro ao carregar detalhes do filme:', error);
        if (loadingMessage) loadingMessage.style.display = 'none';
        if (errorMessage) {
            errorMessage.textContent = 'Erro de rede ao carregar detalhes do filme.';
            errorMessage.style.display = 'block';
        }
    }
}

async function checkFavoriteStatus(movieId) {
    const token = localStorage.getItem('token');
    const favoriteButton = document.getElementById('favoriteButton');
    const unfavoriteButton = document.getElementById('unfavoriteButton');

    if (!token || !movieId) {
        if (favoriteButton) favoriteButton.style.display = 'none';
        if (unfavoriteButton) unfavoriteButton.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/favorites`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (response.ok && data.movieIds.includes(movieId)) {
            if (favoriteButton) favoriteButton.style.display = 'none';
            if (unfavoriteButton) unfavoriteButton.style.display = 'inline-block';
        } else {
            if (favoriteButton) favoriteButton.style.display = 'inline-block';
            if (unfavoriteButton) unfavoriteButton.style.display = 'none';
        }
    } catch (error) {
        console.error('Erro ao verificar status de favorito:', error);
        if (favoriteButton) favoriteButton.style.display = 'inline-block';
        if (unfavoriteButton) unfavoriteButton.style.display = 'none';
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
            checkFavoriteStatus(movieId);
            if (typeof window.loadUserFavoritesForDropdown === 'function') {
                window.loadUserFavoritesForDropdown();
            }
            if (typeof window.updateAllHeartIcons === 'function') {
                window.updateAllHeartIcons(movieId, shouldFavorite);
            }
        } else {
            alert(data.message || `Erro ao ${actionText} filme dos favoritos.`);
        }
    } catch (error) {
        console.error(`Erro de rede ao ${actionText} favorito:`, error);
        alert(`Erro ao ${actionText} favorito.`);
    }
}

document.getElementById('favoriteButton').addEventListener('click', () => {
    toggleFavorite(currentMovieId, true);
});

document.getElementById('unfavoriteButton').addEventListener('click', () => {
    toggleFavorite(currentMovieId, false);
});