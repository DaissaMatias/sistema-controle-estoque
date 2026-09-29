const { Pool } = require('pg');
require('dotenv').config();

// Se houver DATABASE_URL (nuvem), usa a string de conexão com SSL habilitado.
// Se não, usa as variáveis locais individuais.
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
      }
);

// Teste de Conexão
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Erro ao ligar à base de dados:', err.message);
  } else {
    console.log('✅ Conectado ao banco de dados PostgreSQL com sucesso!');
  }
});

module.exports = pool;