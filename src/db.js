const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

//Teste
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Erro ao ligar à base de dados:', err.message);
    } else {
        console.log('✅ Conectado ao banco de dados PostgreSQL com sucesso!');
    }
});

module.exports = pool;