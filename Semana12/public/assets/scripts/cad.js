const API_URL = 'http://localhost:3000/usuarios';

document.addEventListener('DOMContentLoaded', () => {
  const formCadastro = document.querySelector('.cadastro form');
  const tabela = document.querySelector('#tabela-usuarios tbody');

  // Função para carregar usuários e atualizar a tabela
  async function carregarUsuarios() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Erro ao buscar usuários');
      const usuarios = await res.json();

      tabela.innerHTML = '';

      usuarios.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${user.nome}</td>
          <td>${user.login}</td>
          <td>${user.email}</td>
          <td>
            <button onclick="editarUsuario('${user.id}')">Editar</button>
            <button onclick="deletarUsuario('${user.id}')">Excluir</button>
          </td>
        `;
        tabela.appendChild(tr);
      });
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
    }
  }

  // Evento submit para cadastro
  formCadastro.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const login = document.getElementById('login').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    if (!nome || !login || !email || !senha) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const novoUsuario = {
      id: crypto.randomUUID(),
      nome,
      login,
      email,
      senha
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoUsuario)
      });

      if (response.ok) {
        alert('Usuário cadastrado!');
        formCadastro.reset();
        carregarUsuarios();
      } else {
        alert('Erro ao cadastrar usuário.');
        console.error('Resposta do servidor:', response.status, await response.text());
      }
    } catch (err) {
      console.error('Erro ao cadastrar:', err);
      alert('Erro ao cadastrar usuário. Veja o console.');
    }
  });

  carregarUsuarios();
});

// Função global para deletar usuário
async function deletarUsuario(id) {
  if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      alert('Usuário excluído!');
      location.reload();
    } else {
      alert('Erro ao excluir usuário.');
    }
  } catch (err) {
    console.error('Erro ao excluir usuário:', err);
  }
}

// Função global para editar usuário
async function editarUsuario(id) {
  const novoNome = prompt('Digite o novo nome:');
  if (!novoNome) return alert('Nome inválido.');

  const novoLogin = prompt('Digite o novo login:');
  if (!novoLogin) return alert('Login inválido.');

  const novoEmail = prompt('Digite o novo email:');
  if (!novoEmail) return alert('Email inválido.');

  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      alert('Usuário não encontrado para edição.');
      return;
    }
    const usuarioAtual = await response.json();

    // Atualiza somente os campos alterados
    const usuarioAtualizado = {
      ...usuarioAtual,
      nome: novoNome,
      login: novoLogin,
      email: novoEmail
      // senha permanece a mesma
    };

    const resPut = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuarioAtualizado)
    });

    if (resPut.ok) {
      alert('Usuário atualizado!');
      location.reload();
    } else {
      alert('Erro ao atualizar usuário.');
    }
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err);
  }
}