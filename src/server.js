const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

//Rota de teste
app.get('/', (req, res) => {
    res.json({ mensagem: "API de Controle de Estoque rodando com sucesso!" });
});

//==============================
//ROTAS DE FORNECEDORES (tela 3)
//==============================

//Listar fornecedores
app.get('/fornecedores', async (req, res) => {
    try {
        const resultado = await db.query('SELECT * FROM fornecedores ORDER BY id DESC');
        res.json(resultado.rows);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao buscar fornecedores" });
    }

});

//Cadastrar fornecedor
app.post('/fornecedores', async (req, res) => {
    const { nome_empresa, cnpj, endereco, telefone, email, contato_principal } = req.body;
    try {
        const novoFornecedor = await db.query(
            `INSERT INTO fornecedores (nome_empresa, cnpj, endereco, telefone, email, contato_principal) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [nome_empresa, cnpj, endereco, telefone, email, contato_principal]
        );
        res.status(201).json(novoFornecedor.rows[0]);
    } catch (erro) {
        res.status(400).json({ erro: "Erro aao cadastrar fornecedor. Verifique se o CNPJ já existe" });
    }
});

//=======================================
//ROTAS DE PRODUTOS (tela 1 e tela 2 e 4)
//=======================================

//Listar todos os produtos (Tela Home)
app.get('/produtos', async (req, res) => {
    try {
        const resultado = await db.query('SELECT * FROM produtos ORDER BY id DESC');
        res.json(resultado.rows);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao buscar produtos." });
    }
});

//Cadastrar produto (tela 2)
app.post('/produtos', async (req, res) => {
    const { nome, codigo_barras, descricao, quantidade_estoque, categoria, data_validade, imagem_url } = req.body;
    try {
        const novoProduto = await db.query(
            `INSERT INTO produtos (nome, codigo_barras, descricao, quantidade_estoque, categoria, data_validade, imagem_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [nome, codigo_barras, descricao, quantidade_estoque, categoria, data_validade, imagem_url]
        )
        res.status(201).json(novoProduto.rows[0]);
    } catch (erro) {
        res.status(400).json({ erro: "Erro ao cadastrar produto. Verifique se o Código de Barras já existe." })
    }
});

//Detalhes do produto + fornecedores associados (tela 4)
app.get('/produtos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const produtoRes = await db.query('SELECT * FROM produtos WHERE id = $1', [id]);
        if (produtoRes.rows.length === 0) {
            return res.status(404).json({ erro: "Produto não encontrado." });
        }
        const fornecedoresRes = await db.query(
            `SELECT f.id, f.nome_empresa, f.cnpj 
            FROM fornecedores f
            JOIN produto_fornecedores pf ON f.id = pf.fornecedor_id
            WHERE pf.produto_id = $1`, [id]
        );

        res.json({
            produto: produtoRes.rows[0],
            fornecedores_associados: fornecedoresRes.rows
        });
    } catch (erro) {
        console.error("Erro no backend ao buscar produto:", erro)
        res.status(500).json({ erro: "Erro ao buscar detalhes do produto." });
    }
});

//======================================
//ROTAS DE ASSOCIAÇÃO (Cenários 1, 2, 3)
//======================================

//1° e 2° cenário: Associar fornecedor ao produto
app.post('/produtos/:id/fornecedores', async (req, res) => {
    const { id } = req.params;
    const { fornecedor_id } = req.body;

    try {
        await db.query(
            'INSERT INTO produto_fornecedores (produto_id, fornecedor_id) VALUES ($1, $2)',
            [id, fornecedor_id]
        );
        res.status(201).json({ mensagem: "Fornecedor associado com sucesso ao produto!" });
    } catch (erro) {
        if (erro.code === '23505') {
            return res.status(400).json({ erro: "Fornecedor já associado a este produto!" });
        }
        res.status(500).json({ erro: "Erro ao associar fornecedor ao produto." })
    }
});

//3° Cenário: Desassociar Fornecedor do Produto (Apenas apaga a linha na tabela N:N)
app.delete('/produtos/:id/fornecedores/:fornecedorId', async (req, res) => {
    const { id, fornecedorId } = req.params;
    try {
        const resultado = await db.query(
            'DELETE FROM produto_fornecedores WHERE produto_id = $1 AND fornecedor_id = $2',
            [id, fornecedorId]
        );

        if (resultado.rowCount === 0) {
            return res.status(404).json({ erro: "Associação não encontrada." });
        }

        res.json({ mensagem: "Fornecedor desassociado com sucesso!" });
    } catch (erro) {
        console.error("Erro ao excluir produto:", erro);
        res.status(500).json({ erro: "Erro ao excluir produto do banco de dados." });
    }
});

// Excluir PRODUTO completo (Apaga vínculos primeiro e depois o produto)
app.delete('/produtos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // 1. Apaga os vínculos da tabela N:N para não violar a FK
        await db.query('DELETE FROM produto_fornecedores WHERE produto_id = $1', [id]);

        // 2. Apaga o produto
        const resultado = await db.query('DELETE FROM produtos WHERE id = $1', [id]);

        if (resultado.rowCount === 0) {
            return res.status(404).json({ erro: "Produto não encontrado." });
        }

        res.json({ mensagem: "Produto excluído com sucesso!" });
    } catch (erro) {
        console.error("Erro ao excluir produto:", erro);
        res.status(500).json({ erro: "Erro interno ao excluir produto do banco de dados." });
    }
});

//Inicia o servidor na porta 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});