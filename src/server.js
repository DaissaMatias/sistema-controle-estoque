const express = require('express');
const cors = require('cors');

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
app.get('/fornecedores', (req, res) => {
    res.json({ mensagem: "Retorna a lista de fornecedores" });
});

//Cadastrar fornecedor
app.post('/fornecedores', (req, res) => {
    const { nome_empresa, cnpj, endereco, telefone, email, contato_principal } = req.body;
    res.status(201).json({ mensagem: "Fornecedor cadastrado com sucesso!" });
});

//===================================
//ROTAS DE PRODUTOS (tela 1 e tela 2)
//===================================

//Listar todos os produtos (Tela Home)
app.get('/produtos', (req, res) => {
    res.json({ mensagem: "Retorna a lista de produtos" });
});

//Cadastrar produto (tela 2)
app.post('/produtos', (req, res) => {
    const { nome, codigo_barras, descricao, quantidade_estoque, categoria } = req.body;
    res.status(201).json({ mensagem: "Produto cadastrado com sucesso" });
});

//Detalhes do produto + fornecedores associados (tela 4)
app.get('/produtos/:id', (req, res) => {
    const {id} = req.params;
    res.json({mensagem: `Retorna os detalhes e os fornecedores do produto ${id}`});
});

//======================================
//ROTAS DE ASSOCIAÇÃO (Cenários 1, 2, 3)
//======================================

//1° e 2° cenário: Associar fornecedor ao produto
app.post('/produtos/:id/fornecedores', (req, res)=>{
    const {id} = req.params;
    const {fornecedor_id} = req.body;

    //A lógica no controller vai tratar os 2 cenários:
    // - Sucesso: "Fornecedor associado com sucesso ao produto!" (Status 201)
    // - Já associado (erro no banco pela regra Unique): "Fornecedor já está associado a este produto" (status 400)

    res.status(201).json({mensagem: "Fornecedor associado com sucesso ao produto!"});
});

//3° Cenário: Desassociar Fornecedor do Produto
app.delete('/produtos/:id/fornecedores/:fornecedorId', (req, res)=>{
    const {id, fornecedorId} = req.params;
    res.json({mensagem:"Fornecedor desassociado com sucesso!"});
});

//Inicia o servidor na porta 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});