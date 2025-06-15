const API_BASE_URL = '';

let editingMovieId = null;

document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
    loadMoviesTable();

    document.getElementById('movieForm').addEventListener('submit', handleMovieFormSubmit);
    document.getElementById('cancelEditButton').addEventListener('click', resetForm);
    document.getElementById('logoutButtonAdmin').addEventListener('click', () => {
        localStorage.removeItem('token');
        alert('Você foi desconectado do painel de administração.');
        window.location.href = 'index.html';
    });
});

async function checkAdminAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Você não está logado ou sua sessão expirou. Redirecionando para login.');
        window.location.href = 'cadastro_filmes.html';
        return;
    }

    try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        if (decodedPayload.role !== 'admin') {
            alert('Acesso negado. Você não tem permissão de administrador.');
            window.location.href = 'index.html';
            return;
        }
        document.getElementById('logoutButtonAdmin').style.display = 'inline-block';
    } catch (error) {
        console.error('Erro ao verificar token de admin:', error);
        localStorage.removeItem('token');
        alert('Erro na autenticação. Redirecionando para login.');
        window.location.href = 'cadastro_filmes.html';
    }
}

async function loadMoviesTable() {
    const moviesTableBody = document.getElementById('moviesTableBody');
    const loadingMessage = document.getElementById('loadingMoviesMessage');
    loadingMessage.style.display = 'block';
    moviesTableBody.innerHTML = '';

    try {
        const response = await fetch(`${API_BASE_URL}/api/movies`);
        const movies = await response.json();
        loadingMessage.style.display = 'none';

        if (movies.length === 0) {
            moviesTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum filme cadastrado.</td></tr>';
            return;
        }

        movies.forEach(movie => {
            const row = moviesTableBody.insertRow();
            row.innerHTML = `
                <td>${movie.id}</td>
                <td>${movie.titulo}</td>
                <td>${movie.genero}</td>
                <td>${movie.duracao}</td>
                <td>
                    <button class="btn btn-warning btn-sm me-2" onclick="editMovie('${movie.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteMovie('${movie.id}')">Excluir</button>
                </td>
            `;
        });
    } catch (error) {
        console.error('Erro ao carregar filmes para a tabela:', error);
        loadingMessage.textContent = 'Erro ao carregar filmes. Verifique o console.';
    }
}

async function handleMovieFormSubmit(event) {
    event.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const imagem = document.getElementById('imagem').value;
    const trailer = document.getElementById('trailer').value;
    const genero = document.getElementById('genero').value;
    const duracao = document.getElementById('duracao').value;
    const classificacao = document.getElementById('classificacao').value;

    const movieData = {
        titulo,
        descricao,
        imagem,
        trailer,
        genero,
        duracao,
        classificacao
    };

    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    let response;
    let data;

    try {
        if (editingMovieId) {
            response = await fetch(`${API_BASE_URL}/api/movies/${editingMovieId}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(movieData)
            });
        } else {
            movieData.id = require('uuid').v4();
            response = await fetch(`${API_BASE_URL}/api/admin/add-movie`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(movieData)
            });
        }
        
        data = await response.json();

        if (response.ok) {
            alert(data.message);
            resetForm();
            loadMoviesTable();
        } else {
            alert(data.message || 'Erro ao processar o filme.');
            console.error('Resposta do servidor:', response.status, data);
        }
    } catch (error) {
        console.error('Erro de rede ou servidor ao salvar filme:', error);
        alert('Erro de rede ou servidor. Verifique o console.');
    }
}

async function editMovie(id) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE_URL}/api/movies/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const movie = await response.json();

        if (response.ok) {
            document.getElementById('movieId').value = movie.id;
            document.getElementById('titulo').value = movie.titulo;
            document.getElementById('descricao').value = movie.descricao;
            document.getElementById('imagem').value = movie.imagem;
            document.getElementById('trailer').value = movie.trailer;
            document.getElementById('genero').value = movie.genero;
            document.getElementById('duracao').value = movie.duracao;
            document.getElementById('classificacao').value = movie.classificacao;

            editingMovieId = movie.id;
            document.getElementById('formTitle').textContent = 'Editar Filme';
            document.getElementById('submitButton').textContent = 'Salvar Alterações';
            document.getElementById('cancelEditButton').style.display = 'inline-block';

            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            alert(movie.message || 'Filme não encontrado para edição.');
        }
    } catch (error) {
        console.error('Erro ao buscar filme para edição:', error);
        alert('Erro de rede ao buscar filme para edição.');
    }
}

async function deleteMovie(id) {
    if (!confirm('Tem certeza que deseja excluir este filme? Esta ação é irreversível.')) {
        return;
    }

    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE_URL}/api/movies/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            loadMoviesTable();
        } else {
            alert(data.message || 'Erro ao excluir filme.');
        }
    } catch (error) {
        console.error('Erro de rede ao excluir filme:', error);
        alert('Erro de rede ao excluir filme.');
    }
}

function resetForm() {
    document.getElementById('movieForm').reset();
    document.getElementById('movieId').value = '';
    editingMovieId = null;
    document.getElementById('formTitle').textContent = 'Adicionar Novo Filme';
    document.getElementById('submitButton').textContent = 'Adicionar Filme';
    document.getElementById('cancelEditButton').style.display = 'none';
}