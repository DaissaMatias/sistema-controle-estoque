-- 1. Tabela de Fornecedores (Ref: Tela de Cadastro de Fornecedor)
CREATE TABLE fornecedores (
    id SERIAL PRIMARY KEY,
    nome_empresa VARCHAR(150) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    contato_principal VARCHAR(100) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Produtos (Ref: Tela de Cadastro de Produtos)
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    codigo_barras VARCHAR(50) UNIQUE NOT NULL,
    descricao TEXT NOT NULL,
    quantidade_estoque INT NOT NULL DEFAULT 0,
    categoria VARCHAR(50) NOT NULL,
    data_validade DATE,
    imagem_url TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela Associativa (Ref: Tela de Detalhes e Associação)
CREATE TABLE produto_fornecedores (
    id SERIAL PRIMARY KEY,
    produto_id INT NOT NULL,
    fornecedor_id INT NOT NULL,
    associado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Chaves Estrangeiras (Garante integridade referencial)
    CONSTRAINT fk_produto FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
    CONSTRAINT fk_fornecedor FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id) ON DELETE CASCADE,
    
    -- REGRA DE NEGÓCIO (Cenário 2): Impede associar o mesmo fornecedor duas vezes ao mesmo produto
    CONSTRAINT uc_produto_fornecedor UNIQUE (produto_id, fornecedor_id)
);