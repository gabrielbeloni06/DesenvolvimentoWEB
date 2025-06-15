const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'uma_chave_secreta_muito_forte_e_aleatoria_para_jwt';

app.use(express.json());
app.use(cors());

const DB_PATH = path.join(__dirname, 'db', 'db.json');

const readDb = () => {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao ler db.json:', error);
        return { usuarios: [], filmes: [], favoritos: [] };
    }
};

const writeDb = (data) => {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Erro ao escrever no db.json:', error);
    }
};

app.post('/api/register', async (req, res) => {
    const { login, senha, nome, email, role = 'usuario' } = req.body;
    const db = readDb();

    if (!login || !senha || !nome || !email) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const existingUser = db.usuarios.find(u => u.login === login || u.email === email);
    if (existingUser) {
        return res.status(409).json({ message: 'Login ou email já cadastrado.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);
        const newUser = {
            id: require('uuid').v4(),
            login,
            senha: hashedPassword,
            nome,
            email,
            role
        };
        db.usuarios.push(newUser);
        writeDb(db);

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao registrar usuário.' });
    }
});

app.post('/api/login', async (req, res) => {
    const { login, senha } = req.body;
    const db = readDb();

    if (!login || !senha) {
        return res.status(400).json({ message: 'Login e senha são obrigatórios.' });
    }

    const user = db.usuarios.find(u => u.login === login || u.email === login);
    if (!user) {
        return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
        return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
        { userId: user.id, role: user.role, email: user.email, nome: user.nome },
        SECRET_KEY,
        { expiresIn: '1h' }
    );

    res.json({ token, message: 'Login bem-sucedido!' });
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'Acesso negado: Token não fornecido.' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.error('Erro de verificação do token:', err);
            return res.status(403).json({ message: 'Acesso negado: Token inválido ou expirado.' });
        }
        req.user = user;
        next();
    });
};

const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        if (req.user && req.user.role === requiredRole) {
            next();
        } else {
            res.status(403).json({ message: 'Acesso negado: Você não tem permissão para esta ação.' });
        }
    };
};

app.get('/api/movies', (req, res) => {
    const db = readDb();
    let filmes = db.filmes;
    const searchTerm = req.query.q;

    console.log('Backend: Requisição para /api/movies recebida.');
    console.log('Backend: Termo de busca (req.query.q):', searchTerm);


    if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        filmes = filmes.filter(movie => 
            (movie.titulo && movie.titulo.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (movie.descricao && movie.descricao.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (movie.genero && movie.genero.toLowerCase().includes(lowerCaseSearchTerm))
        );
        console.log('Backend: Filmes filtrados:', filmes.map(f => f.titulo));
    } else {
        console.log('Backend: Nenhum termo de busca, retornando todos os filmes.');
    }
    res.json(filmes);
});

app.get('/api/movies/:id', (req, res) => {
    const db = readDb();
    const movie = db.filmes.find(m => m.id === req.params.id);
    if (movie) {
        res.json(movie);
    } else {
        res.status(404).json({ message: 'Filme não encontrado.' });
    }
});

app.put('/api/movies/:id', authenticateToken, authorizeRole('admin'), (req, res) => {
    const movieId = req.params.id;
    const updatedMovieData = req.body;
    const db = readDb();

    let movieIndex = db.filmes.findIndex(m => m.id === movieId);

    if (movieIndex !== -1) {
        updatedMovieData.id = movieId; 
        db.filmes[movieIndex] = { ...db.filmes[movieIndex], ...updatedMovieData };
        writeDb(db);
        res.json({ message: 'Filme atualizado com sucesso!', movie: db.filmes[movieIndex] });
    } else {
        res.status(404).json({ message: 'Filme não encontrado para atualização.' });
    }
});

app.delete('/api/movies/:id', authenticateToken, authorizeRole('admin'), (req, res) => {
    const movieId = req.params.id;
    const db = readDb();

    const initialLength = db.filmes.length;
    db.filmes = db.filmes.filter(m => m.id !== movieId);

    if (db.filmes.length < initialLength) {
        db.favoritos.forEach(userFavs => {
            userFavs.movieIds = userFavs.movieIds.filter(id => id !== movieId);
        });
        writeDb(db);
        res.json({ message: 'Filme excluído com sucesso!' });
    } else {
        res.status(404).json({ message: 'Filme não encontrado para exclusão.' });
    }
});

app.get('/api/favorites', authenticateToken, (req, res) => {
    const db = readDb();
    const userFavorites = db.favoritos.find(fav => fav.userId === req.user.userId);
    if (userFavorites) {
        res.json({ movieIds: userFavorites.movieIds });
    } else {
        res.json({ movieIds: [] });
    }
});

app.post('/api/favorites/add', authenticateToken, (req, res) => {
    const { movieId } = req.body;
    const userId = req.user.userId;
    const db = readDb();

    if (!movieId) {
        return res.status(400).json({ message: 'O ID do filme é obrigatório.' });
    }

    let userFavorites = db.favoritos.find(fav => fav.userId === userId);

    if (!userFavorites) {
        userFavorites = { userId, movieIds: [] };
        db.favoritos.push(userFavorites);
    }

    if (!userFavorites.movieIds.includes(movieId)) {
        userFavorites.movieIds.push(movieId);
        writeDb(db);
        return res.status(200).json({ message: 'Filme adicionado aos favoritos com sucesso!' });
    } else {
        return res.status(409).json({ message: 'Filme já está nos favoritos.' });
    }
});

app.post('/api/favorites/remove', authenticateToken, (req, res) => {
    const { movieId } = req.body;
    const userId = req.user.userId;
    const db = readDb();

    if (!movieId) {
        return res.status(400).json({ message: 'O ID do filme é obrigatório.' });
    }

    let userFavorites = db.favoritos.find(fav => fav.userId === userId);

    if (userFavorites) {
        const initialLength = userFavorites.movieIds.length;
        userFavorites.movieIds = userFavorites.movieIds.filter(id => id !== movieId);

        if (userFavorites.movieIds.length < initialLength) {
            writeDb(db);
            return res.status(200).json({ message: 'Filme removido dos favoritos com sucesso!' });
        } else {
            return res.status(404).json({ message: 'Filme não encontrado nos favoritos do usuário.' });
        }
    } else {
        return res.status(404).json({ message: 'Usuário não tem favoritos para remover.' });
    }
});

app.post('/api/admin/add-movie', authenticateToken, authorizeRole('admin'), (req, res) => {
    const { id, titulo, descricao, imagem, trailer, genero, duracao, classificacao } = req.body;
    const db = readDb();

    if (!id || !titulo) {
        return res.status(400).json({ message: 'ID e título do filme são obrigatórios.' });
    }
    if (db.filmes.some(movie => movie.id === id)) {
        return res.status(409).json({ message: 'Filme com este ID já existe.' });
    }

    const newMovie = { id, titulo, descricao, imagem, trailer, genero, duracao, classificacao };
    db.filmes.push(newMovie);
    writeDb(db);
    res.status(201).json({ message: 'Filme adicionado com sucesso pelo admin!', movie: newMovie });
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Abra http://localhost:${PORT} no seu navegador.`);
});
