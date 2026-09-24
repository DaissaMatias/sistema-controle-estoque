import { useEffect, useState } from 'react';
import Header from '../components/Header';
import api from '../services/api';

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [formData, setFormData] = useState({
    nome_empresa: '',
    cnpj: '',
    endereco: '',
    telefone: '',
    email: '',
    contato_principal: ''
  });

  const carregarFornecedores = async () => {
    try {
      const resposta = await api.get('/fornecedores');
      setFornecedores(resposta.data);
    } catch (erro) {
      console.error("Erro ao carregar fornecedores:", erro);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    let ativo = true;

    const buscarDados = async () => {
      try {
        const resposta = await api.get('/fornecedores');
        if (ativo) {
          setFornecedores(resposta.data);
        }
      } catch (erro) {
        console.error("Erro ao carregar fornecedores:", erro);
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    };

    buscarDados();

    return () => {
      ativo = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Limpa o CNPJ (aceita alfanumérico novo e numérico antigo)
    const cnpjLimpo = formData.cnpj.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const cnpjRegex = /^[A-Z0-9]{12}\d{2}$/;

    if (!cnpjRegex.test(cnpjLimpo)) {
      alert('CNPJ inválido. O CNPJ deve conter 14 caracteres (os 12 primeiros podendo ser letras/números e os 2 últimos obrigatoriamente números).');
      return;
    }

    // 2. Validação de E-mail
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert('Por favor, insira um e-mail válido.');
        return;
      }
    }

    // 3. Validação de Telefone
    if (formData.telefone) {
      const telefoneApenasNumeros = formData.telefone.replace(/\D/g, '');
      if (telefoneApenasNumeros.length < 10 || telefoneApenasNumeros.length > 11) {
        alert('O telefone deve conter DDD + número (10 ou 11 dígitos).');
        return;
      }
    }

    setSalvando(true);

    try {
      await api.post('/fornecedores', {
        nome_empresa: formData.nome_empresa,
        cnpj: cnpjLimpo,
        endereco: formData.endereco || null,
        telefone: formData.telefone || null,
        email: formData.email || null,
        contato_principal: formData.contato_principal || null
      });

      alert('Fornecedor cadastrado com sucesso!');

      setFormData({
        nome_empresa: '',
        cnpj: '',
        endereco: '',
        telefone: '',
        email: '',
        contato_principal: ''
      });

      carregarFornecedores();
    } catch (erro) {
      console.error("Erro ao cadastrar fornecedor:", erro);
      const msg = erro.response?.data?.erro || 'Erro ao cadastrar fornecedor. Verifique se o CNPJ já está cadastrado.';
      alert(msg);
    } finally {
      setSalvando(false);
    }
  };

  // Função para Excluir Fornecedor
  const handleExcluirFornecedor = async (id, nomeEmpresa) => {
    const confirmar = window.confirm(
      `Tem certeza que deseja EXCLUIR o fornecedor "${nomeEmpresa}"?\n\nIsso também desvinculará este fornecedor de qualquer produto associado.`
    );
    if (!confirmar) return;

    try {
      await api.delete(`/fornecedores/${id}`);
      alert('Fornecedor excluído com sucesso!');
      carregarFornecedores(); // Atualiza a tabela
    } catch (erro) {
      console.error('Erro ao excluir fornecedor:', erro);
      alert('Erro ao excluir o fornecedor do banco de dados.');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--fundo-branco)', minHeight: '100vh' }}>
      <Header />

      <main style={styles.container}>
        {/* Bloco 1: Formulário de Cadastro */}
        <section style={styles.card}>
          <div style={styles.headerForm}>
            <h1 style={styles.title}>Cadastrar Novo Fornecedor</h1>
            <p style={styles.subtitle}>Registre os dados do parceiro comercial para vinculá-lo aos produtos.</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.row}>
              <div style={styles.group}>
                <label style={styles.label}>Nome / Razão Social *</label>
                <input
                  type="text"
                  name="nome_empresa"
                  required
                  placeholder="Ex: Tech Distribuidora Ltda"
                  value={formData.nome_empresa}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.group}>
                <label style={styles.label}>CNPJ *</label>
                <input
                  type="text"
                  name="cnpj"
                  required
                  placeholder="00.000.000/0001-00"
                  value={formData.cnpj}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.rowThree}>
              <div style={styles.group}>
                <label style={styles.label}>Telefone</label>
                <input
                  type="text"
                  name="telefone"
                  placeholder="(11) 99999-9999"
                  value={formData.telefone}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.group}>
                <label style={styles.label}>Email de Contato</label>
                <input
                  type="email"
                  name="email"
                  placeholder="contato@fornecedor.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.group}>
                <label style={styles.label}>Contato Principal</label>
                <input
                  type="text"
                  name="contato_principal"
                  placeholder="Ex: Carlos Oliveira"
                  value={formData.contato_principal}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Endereço Completo</label>
              <input
                type="text"
                name="endereco"
                placeholder="Av. Paulista, 1000 - São Paulo/SP"
                value={formData.endereco}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.buttonContainer}>
              <button
                type="submit"
                disabled={salvando}
                style={styles.btnSalvar}
              >
                {salvando ? 'Salvando...' : 'Cadastrar Fornecedor'}
              </button>
            </div>
          </form>
        </section>

        {/* Bloco 2: Lista de Fornecedores */}
        <section style={{ marginTop: '40px' }}>
          <h2 style={{ ...styles.title, marginBottom: '16px' }}>FORNECEDORES CADASTRADOS</h2>

          {carregando ? (
            <p style={{ color: 'var(--texto-preto)' }}>Carregando fornecedores...</p>
          ) : fornecedores.length === 0 ? (
            <div style={styles.cardVazio}>
              <p style={{ color: 'var(--texto-preto)' }}>Nenhum fornecedor cadastrado ainda.</p>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.trHeader}>
                  <th style={styles.th}>EMPRESA</th>
                  <th style={styles.th}>CNPJ</th>
                  <th style={styles.th}>TELEFONE</th>
                  <th style={styles.th}>E-MAIL</th>
                  <th style={styles.th}>CONTATO</th>
                  <th style={styles.thCenter}>AÇÃO</th>
                </tr>
              </thead>
              <tbody>
                {fornecedores.map((fornecedor) => (
                  <tr key={fornecedor.id} style={styles.tr}>
                    <td style={{ ...styles.td, fontWeight: '600' }}>{fornecedor.nome_empresa}</td>
                    <td style={styles.td}>{fornecedor.cnpj}</td>
                    <td style={styles.td}>{fornecedor.telefone || '-'}</td>
                    <td style={styles.td}>{fornecedor.email || '-'}</td>
                    <td style={styles.td}>{fornecedor.contato_principal || '-'}</td>
                    <td style={styles.tdCenter}>
                      <button
                        type="button"
                        onClick={() => handleExcluirFornecedor(fornecedor.id, fornecedor.nome_empresa)}
                        style={styles.btnExcluir}
                      >
                        ✕ Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '40px auto',
    padding: '0 20px'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '32px',
    border: '1px solid var(--input-bg)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  headerForm: {
    marginBottom: '28px',
    borderBottom: '2px solid var(--fundo-branco)',
    paddingBottom: '16px'
  },
  title: {
    margin: 0,
    color: 'var(--azul-escuro)',
    fontSize: '1.5rem',
    fontFamily: 'var(--font-header-btn)',
    letterSpacing: '0.5px'
  },
  subtitle: {
    margin: '6px 0 0 0',
    color: 'var(--placeholder-grafite)',
    fontSize: '0.9rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
  },
  rowThree: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '20px'
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    color: 'var(--texto-preto)',
    fontSize: '0.85rem',
    fontWeight: '700',
    fontFamily: 'var(--font-corpo)'
  },
  input: {
    backgroundColor: 'var(--input-bg)',
    border: 'none',
    borderRadius: '6px',
    padding: '12px 14px',
    fontSize: '0.95rem',
    color: 'var(--texto-preto)',
    outline: 'none'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '8px'
  },
  btnSalvar: {
    backgroundColor: 'var(--azul-claro)',
    color: '#ffffff',
    border: 'none',
    padding: '12px 28px',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-header-btn)',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  cardVazio: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px solid var(--input-bg)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid var(--input-bg)'
  },
  trHeader: {
    backgroundColor: 'var(--azul-medio)',
    color: '#ffffff'
  },
  th: {
    padding: '16px',
    textAlign: 'left',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-header-btn)',
    letterSpacing: '0.5px'
  },
  thCenter: {
    padding: '16px',
    textAlign: 'center',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-header-btn)',
    letterSpacing: '0.5px'
  },
  tr: {
    borderBottom: '1px solid var(--input-bg)'
  },
  td: {
    padding: '16px',
    color: 'var(--texto-preto)',
    fontSize: '0.95rem'
  },
  tdCenter: {
    padding: '16px',
    textAlign: 'center'
  },
  btnExcluir: {
    backgroundColor: '#fff1f0',
    color: '#e53e3e',
    border: '1px solid #ffa39e',
    padding: '6px 14px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};