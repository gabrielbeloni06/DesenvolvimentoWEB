# Trabalho Prático DIW - Trabalho 02

## Informações do trabalho
- Nome:Gabriel Egídio Santos Beloni
- Proposta de projeto escolhida:Catálago de filmes
- Breve descrição sobre seu projeto:A ideia do projeto se da com forma em um site para catalogar filmes de diversos gêneros, idade, público e fama. Neste site o objetivo é organizar com destaques e sugestões de novidades do cinema, tal site vai ser dividido em categorias específicas, ou uma home-page geral, com isso na página principal, o propósito é dividir em um filme destaque, novidades e abaixo indicações de filmes de diversos gêneros.

### LEIA
Olá! Sou o Gabriel e vou te passar alguns detalhes do projeto.

Estas são as instruções para configurar e testar o projeto do site de filmes.

Passo 1: Preparação do Ambiente
Instale o Node.js: Se você ainda não tem o Node.js instalado em sua máquina, por favor, baixe e instale a versão mais recente em nodejs.org.

Descompacte o Projeto: Extraia o conteúdo do arquivo .zip para uma pasta de sua preferência.

Passo 2: Configuração e Inicialização
Abra o Terminal/Prompt de Comando: Navegue até a pasta raiz do projeto que você descompactou (onde se encontra o arquivo server.js e a pasta package.json).

Instale as Dependências: No terminal, execute o seguinte comando para instalar todas as bibliotecas necessárias para o projeto:

npm install

Isso instalará express, bcryptjs, jsonwebtoken, cors e uuid.

Hasheie as Senhas dos Usuários: Por segurança, as senhas de teste no db.json precisam ser hasheadas. Execute este comando NO TERMINAL UMA ÚNICA VEZ:

node hash_passwords.js

Você verá mensagens no terminal indicando que as senhas foram hasheadas no arquivo db/db.json.

Inicie o Servidor: Após a instalação das dependências e o hash das senhas, inicie o servidor do projeto:

node server.js

Você deverá ver uma mensagem no terminal indicando que o servidor está rodando em uma porta, geralmente: Servidor rodando em http://localhost:3000.

E pronto, o traabalho estará totalmente configurado.

Para testar todas as funcionalidades você deve estar logado, basta fazer o cadastro com os dados necessários (não precisam ser dados pessoais e reais) e depois é so logar e testar o desejado.

Conta de Usuario:
usuario:usuario
senha:123

Caso queira testar como adm, segue uma conta cadastrada como administrador ou altere a conta desejada para "role:admin" no db.json;

Conta de Administrador:
usuario:admin
senha:123

Bom teste!
