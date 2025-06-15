const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db', 'db.json');

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

async function updatePasswordsInDb() {
    try {
        const dbData = fs.readFileSync(DB_PATH, 'utf8');
        const db = JSON.parse(dbData);

        for (const user of db.usuarios) {
            if (!user.senha.startsWith('$2a$') && !user.senha.startsWith('$2b$')) {
                console.log(`Hasheando senha para o usuário: ${user.login}`);
                user.senha = await hashPassword(user.senha);
            } else {
                console.log(`Senha do usuário ${user.login} já parece estar hasheada.`);
            }
        }

        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
        console.log('db.json atualizado com sucesso! Senhas hasheadas.');

    } catch (error) {
        console.error('Erro ao processar as senhas:', error);
    }
}

updatePasswordsInDb();
