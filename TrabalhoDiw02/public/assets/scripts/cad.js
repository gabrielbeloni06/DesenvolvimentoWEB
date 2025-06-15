const API_BASE_URL = '';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.form-section.login form');
    const loginInput = document.getElementById('login-email');
    const loginSenhaInput = document.getElementById('login-senha');
    const mensagemDiv = document.getElementById('mensagem'); 

    if (loginForm) { 
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const loginIdentifier = loginInput.value.trim();
            const senha = loginSenhaInput.value;

            if (!loginIdentifier || !senha) {
                mensagemDiv.textContent = 'Por favor, preencha o login/email e a senha.';
                mensagemDiv.style.color = 'red';
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ login: loginIdentifier, senha: senha }) 
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token); 
                    
                    mensagemDiv.textContent = data.message;
                    mensagemDiv.style.color = 'green';
                    setTimeout(() => { 
                        window.location.href = 'index.html'; 
                    }, 1000);
                } else {
                    mensagemDiv.textContent = data.message || 'Erro desconhecido no login.';
                    mensagemDiv.style.color = 'red';
                }
            } catch (error) {
                console.error('Erro de rede ou servidor no login:', error);
                mensagemDiv.textContent = 'Erro ao conectar com o servidor. Tente novamente mais tarde.';
                mensagemDiv.style.color = 'red';
            }
        });
    }

    const formCadastro = document.getElementById('form-cadastro');
    const nomeInput = document.getElementById('nome');
    const loginCadastroInput = document.getElementById('login');
    const emailCadastroInput = document.getElementById('email');
    const senhaCadastroInput = document.getElementById('senha');
    const confirmarSenhaInput = document.getElementById('confirmar-senha');

    if (formCadastro) { 
        formCadastro.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nome = nomeInput.value.trim();
            const login = loginCadastroInput.value.trim(); 
            const email = emailCadastroInput.value.trim(); 
            const senha = senhaCadastroInput.value;
            const confirmarSenha = confirmarSenhaInput.value;

            if (senha !== confirmarSenha) {
                mensagemDiv.textContent = 'As senhas não coincidem!';
                mensagemDiv.style.color = 'red';
                return;
            }
            if (!nome || !login || !email || !senha) {
                mensagemDiv.textContent = 'Por favor, preencha todos os campos do cadastro.';
                mensagemDiv.style.color = 'red';
                return;
            }

            const novoUsuario = { nome, login, email, senha, role: 'usuario' }; 

            try {
                const response = await fetch(`${API_BASE_URL}/api/register`, { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(novoUsuario)
                });

                const data = await response.json();

                if (response.ok) {
                    mensagemDiv.textContent = data.message + ' Agora você pode fazer login.';
                    mensagemDiv.style.color = 'green';
                    formCadastro.reset(); 
                    loginInput.value = login; 
                } else {
                    mensagemDiv.textContent = data.message || 'Erro ao cadastrar usuário.';
                    mensagemDiv.style.color = 'red';
                    console.error('Resposta do servidor:', response.status, data);
                }
            } catch (err) {
                console.error('Erro de rede ou servidor no cadastro:', err);
                mensagemDiv.textContent = 'Erro ao cadastrar usuário. Verifique sua conexão ou o console para detalhes.';
                mensagemDiv.style.color = 'red';
            }
        });
    }

    if (localStorage.getItem('token')) {
        window.location.href = 'index.html';
    }
});