# 📦 Sistema de Controle de Estoque & Gestão de Fornecedores

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

Uma aplicação full-stack moderna desenvolvida para gestão eficiente de inventário e relacionamento com fornecedores. O sistema permite o acompanhamento do estoque, validações rigorosas de dados (EAN-13, CNPJ alfanumérico e numérico) e gerenciamento de associações de muitos-para-muitos (N:N) entre produtos e fornecedores.

---

## 🎓 Contexto Acadêmico

Este projeto foi desenvolvido como parte integrante das atividades práticas do curso de **Análise e Desenvolvimento de Sistemas (ADS)** da **Gran Faculdade**, aplicando conceitos fundamentais de desenvolvimento web full-stack, modelagem de banco de dados relacional e consumo de APIs RESTful.

---

## 🚀 Funcionalidades

### 🔹 Gestão de Produtos (CRUD Completo)
- **Listagem & Busca em Tempo Real:** Filtro instantâneo na página principal (*Home*) por nome ou código de barras.
- **Cadastro Inteligente:**
  - **EAN-13 Condicional:** Validação do padrão EAN-13 (13 dígitos numéricos) acionada apenas quando o campo é preenchido, convertendo entradas vazias para `NULL` sem violar a restrição `UNIQUE` do banco de dados.
  - Controle de validade, quantidade em estoque, categoria, descrição e URL da imagem.
- **Detalhes do Produto:** Visualização expandida das informações do item com moldura proporcional (`object-fit: contain`) para exibição ideal de imagens sem cortes.
- **Edição & Exclusão:** Atualização completa dos dados do produto e remoção segura com limpeza prévia de dependências.

---

### 🔹 Gestão de Fornecedores & Relacionamento N:N
- **Cadastro Completo:** Registro de Razão Social, CNPJ, Telefone, E-mail, Contato Principal e Endereço Completo.
- **Suporte ao Novo CNPJ:** Validação preparada para os formatos numérico clássico e alfanumérico (14 caracteres).
- **Associação Dinâmica (N:N):**
  - Vinculação e desvinculação em tempo real de fornecedores a produtos na página de detalhes.
  - Remoção em cascata tratada via código para garantir integridade referencial no PostgreSQL.

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **React.js** (criado com **Vite**)
- **React Router DOM** (gerenciamento de rotas e navegação SPA)
- **Axios** (requisições HTTP para a API)
- **CSS Variables & Design System Personalizado** (tipografia com fontes *Jura* e *Inter*)

### **Backend & Banco de Dados**
- **Node.js** com **Express.js** (API RESTful)
- **PostgreSQL** (banco de dados relacional)
- **`pg` (node-postgres)** (driver de conexão com o banco)
- **CORS** (políticas de compartilhamento de recursos)

---

## 🗄️ Estrutura do Banco de Dados

O banco relacional é composto por três tabelas conectadas:

```sql
-- 1. Tabela de Produtos
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    codigo_barras VARCHAR(13) UNIQUE,
    descricao TEXT,
    quantidade_estoque INT NOT NULL DEFAULT 0,
    categoria VARCHAR(100),
    data_validade DATE,
    imagem_url TEXT
);

-- 2. Tabela de Fornecedores
CREATE TABLE fornecedores (
    id SERIAL PRIMARY KEY,
    nome_empresa VARCHAR(150) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100),
    contato_principal VARCHAR(100),
    endereco TEXT
);

-- 3. Tabela N:N (Muitos-para-Muitos)
CREATE TABLE produto_fornecedores (
    produto_id INT REFERENCES produtos(id) ON DELETE CASCADE,
    fornecedor_id INT REFERENCES fornecedores(id) ON DELETE CASCADE,
    PRIMARY KEY (produto_id, fornecedor_id)
);

## ⚙️ Como Executar o Projeto

### Pré-requisitos
 - Node.js (v18 ou superior)
 - PostgreSQL configurado e em execução.

### 1️⃣ Clonar o Repositório

 ```bash

 git clone [https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git](https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git)
 cd NOME_DO_REPOSITORIO

```
### 2️⃣ Configurar o Backend

```bash

# Navegue até a pasta do servidor
cd backend

# Instale as dependências
npm install

# Inicie o servidor Node.js
npm start

```
> Nota: Certifique-se de configurar suas credenciais do PostgreSQL no arquivo de conexão do banco (db.js ou arquivo .env).

### 3️⃣ Configurar o Frontend

```bash

# Em outro terminal, navegue até a pasta do frontend
cd frontend

# Instale as dependências
npm install

# Execute a aplicação em modo de desenvolvimento
npm run dev

```
>Acesse a aplicação no seu navegador através do endereço exibido no terminal (geralmente http://localhost:5173).

### ✒️ Autora
***Daissa Matias Figueredo***, *Estudante de Análise e Desenvolvimento de Sistemas (ADS) — Gran Faculdade.*