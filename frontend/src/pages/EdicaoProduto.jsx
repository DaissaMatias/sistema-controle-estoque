import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import api from '../services/api';

export default function EdicaoProduto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    codigo_barras: '',
    categoria: '',
    quantidade_estoque: '',
    data_validade: '',
    imagem_url: '',
    descricao: ''
  });

  useEffect(() => {
    let ativo = true;

    const carregarProduto = async () => {
      try {
        const resposta = await api.get(`/produtos/${id}`);
        const prod = resposta.data.produto;

        if (ativo && prod) {
          // Formata a data para aaaa-mm-dd para ser aceita pelo <input type="date">
          let dataFormatada = '';
          if (prod.data_validade) {
            dataFormatada = new Date(prod.data_validade).toISOString().split('T')[0];
          }

          setFormData({
            nome: prod.nome || '',
            codigo_barras: prod.codigo_barras || '',
            categoria: prod.categoria || '',
            quantidade_estoque: prod.quantidade_estoque || '0',
            data_validade: dataFormatada,
            imagem_url: prod.imagem_url || '',
            descricao: prod.descricao || ''
          });
        }
      } catch (erro) {
        console.error("Erro ao carregar produto para edição:", erro);
        if (ativo) {
          alert("Erro ao buscar dados do produto.");
          navigate('/');
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    };

    carregarProduto();

    return () => {
      ativo = false;
    };
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação de EAN-13 (Exatamente 13 números)
    const eanRegex = /^\d{13}$/;
    if (!eanRegex.test(formData.codigo_barras)) {
      alert('O Código de Barras deve conter exatamente 13 dígitos numéricos (padrão EAN-13).');
      return;
    }

    setSalvando(true);

    try {
      await api.put(`/produtos/${id}`, {
        ...formData,
        quantidade_estoque: Number(formData.quantidade_estoque) || 0,
        data_validade: formData.data_validade ? formData.data_validade : null,
        categoria: formData.categoria ? formData.categoria : null,
        imagem_url: formData.imagem_url ? formData.imagem_url : null,
        descricao: formData.descricao ? formData.descricao : null
      });

      alert('Produto atualizado com sucesso!');
      navigate(`/produtos/${id}`); // Retorna para os detalhes do produto
    } catch (erro) {
      console.error("Erro ao atualizar produto:", erro);
      const msg = erro.response?.data?.erro || 'Erro ao atualizar o produto.';
      alert(msg);
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <div style={{ backgroundColor: 'var(--fundo-branco)', minHeight: '100vh' }}>
        <Header />
        <p style={{ textAlign: 'center', marginTop: '50px', color: 'var(--texto-preto)' }}>
          Carregando dados para edição...
        </p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--fundo-branco)', minHeight: '100vh' }}>
      <Header />

      <main style={styles.container}>
        <div style={styles.card}>
          <div style={styles.headerForm}>
            <h1 style={styles.title}>EDITAR PRODUTO</h1>
            <p style={styles.subtitle}>Altere as informações necessárias e clique em Salvar.</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Linha 1: Nome e Código de Barras */}
            <div style={styles.row}>
              <div style={styles.group}>
                <label style={styles.label}>NOME DO PRODUTO *</label>
                <input
                  type="text"
                  name="nome"
                  required
                  value={formData.nome}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.group}>
                <label style={styles.label}>CÓDIGO DE BARRAS (EAN) *</label>
                <input
                  type="text"
                  name="codigo_barras"
                  required
                  value={formData.codigo_barras}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>

            {/* Linha 2: Categoria, Estoque e Validade */}
            <div style={styles.rowThree}>
              <div style={styles.group}>
                <label style={styles.label}>CATEGORIA</label>
                <input
                  type="text"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.group}>
                <label style={styles.label}>QUANTIDADE EM ESTOQUE *</label>
                <input
                  type="number"
                  name="quantidade_estoque"
                  required
                  min="0"
                  value={formData.quantidade_estoque}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.group}>
                <label style={styles.label}>DATA DE VALIDADE</label>
                <input
                  type="date"
                  name="data_validade"
                  value={formData.data_validade}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>

            {/* Linha 3: URL da Imagem */}
            <div style={styles.group}>
              <label style={styles.label}>URL DA IMAGEM DO PRODUTO</label>
              <input
                type="url"
                name="imagem_url"
                value={formData.imagem_url}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            {/* Linha 4: Descrição */}
            <div style={styles.group}>
              <label style={styles.label}>DESCRIÇÃO DETALHADA</label>
              <textarea
                name="descricao"
                rows="3"
                value={formData.descricao}
                onChange={handleChange}
                style={{ ...styles.input, resize: 'vertical' }}
              />
            </div>

            {/* Botões */}
            <div style={styles.buttonContainer}>
              <button
                type="button"
                onClick={() => navigate(`/produtos/${id}`)}
                style={styles.btnCancelar}
              >
                CANCELAR
              </button>

              <button
                type="submit"
                disabled={salvando}
                style={styles.btnSalvar}
              >
                {salvando ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
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
    gap: '16px',
    marginTop: '12px'
  },
  btnCancelar: {
    backgroundColor: 'transparent',
    color: 'var(--placeholder-grafite)',
    border: '1px solid var(--placeholder-grafite)',
    padding: '12px 24px',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-header-btn)',
    fontWeight: 'bold',
    cursor: 'pointer'
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
  }
};