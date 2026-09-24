import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import api from '../services/api';

export default function DetalhesProduto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [produto, setProduto] = useState(null);
  const [fornecedoresAssociados, setFornecedoresAssociados] = useState([]);
  const [todosFornecedores, setTodosFornecedores] = useState([]);
  const [fornecedorSelecionadoId, setFornecedorSelecionadoId] = useState('');

  const [carregando, setCarregando] = useState(true);
  const [associando, setAssociando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erroImagem, setErroImagem] = useState(false);
  const [recarregar, setRecarregar] = useState(0);

  const atualizarTela = () => setRecarregar((prev) => prev + 1);

  useEffect(() => {
    let ativo = true;

    const carregarDados = async () => {
      try {
        const [resProduto, resTodosFornecedores] = await Promise.all([
          api.get(`/produtos/${id}`),
          api.get('/fornecedores')
        ]);

        if (ativo) {
          setProduto(resProduto.data.produto);
          setFornecedoresAssociados(resProduto.data.fornecedores_associados || []);

          if (Array.isArray(resTodosFornecedores.data)) {
            setTodosFornecedores(resTodosFornecedores.data);
          }
        }
      } catch (erro) {
        console.error("Erro ao carregar dados do produto:", erro);
        if (ativo) {
          alert("Erro ao carregar as informações do produto.");
          navigate('/');
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    };

    carregarDados();

    return () => {
      ativo = false;
    };
  }, [id, recarregar, navigate]);

  // 1º e 2º Cenário: Associar Fornecedor
  const handleAssociar = async (e) => {
    e.preventDefault();

    if (!fornecedorSelecionadoId) {
      alert("Por favor, selecione um fornecedor na lista.");
      return;
    }

    setAssociando(true);

    try {
      await api.post(`/produtos/${id}/fornecedores`, {
        fornecedor_id: fornecedorSelecionadoId
      });

      alert("Fornecedor associado com sucesso!");
      setFornecedorSelecionadoId('');
      atualizarTela();
    } catch (erro) {
      console.error("Erro ao associar fornecedor:", erro);
      const msg = erro.response?.data?.erro || "Erro ao associar fornecedor.";
      alert(msg);
    } finally {
      setAssociando(false);
    }
  };

  // 3º Cenário: Desassociar Apenas o Fornecedor Selecionado
  const handleDesassociar = async (fornecedorId, nomeFornecedor) => {
    const confirmar = window.confirm(`Deseja remover o vínculo do fornecedor "${nomeFornecedor}" com este produto?`);
    if (!confirmar) return;

    try {
      await api.delete(`/produtos/${id}/fornecedores/${fornecedorId}`);
      alert("Vínculo removido com sucesso!");
      atualizarTela();
    } catch (erro) {
      console.error("Erro ao desassociar fornecedor:", erro);
      alert("Erro ao remover vínculo do fornecedor.");
    }
  };

  // Excluir Produto do Estoque
  const handleExcluirProduto = async () => {
    const confirmar = window.confirm(
      `Tem certeza que deseja EXCLUIR o produto "${produto.nome}" do estoque?\n\nEsta ação removerá o produto e todos os seus vínculos.`
    );
    if (!confirmar) return;

    setExcluindo(true);

    try {
      await api.delete(`/produtos/${id}`);
      alert("Produto excluído com sucesso!");
      navigate('/');
    } catch (erro) {
      console.error("Erro ao excluir produto:", erro);
      alert("Erro ao excluir o produto do banco de dados.");
    } finally {
      setExcluindo(false);
    }
  };

  if (carregando) {
    return (
      <div style={{ backgroundColor: 'var(--fundo-branco)', minHeight: '100vh' }}>
        <Header />
        <p style={{ textAlign: 'center', marginTop: '50px', color: 'var(--texto-preto)' }}>
          Carregando informações do produto...
        </p>
      </div>
    );
  }

  if (!produto) return null;

  return (
    <div style={{ backgroundColor: 'var(--fundo-branco)', minHeight: '100vh' }}>
      <Header />

      <main style={styles.container}>
        <div style={styles.navBar}>
          <button onClick={() => navigate('/')} style={styles.btnVoltar}>
            ← VOLTAR PARA PRODUTOS
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate(`/produtos/${id}/editar`)}
              style={styles.btnEditarProduto}
            >
              ✏️ Editar Produto
            </button>

            <button
              onClick={handleExcluirProduto}
              disabled={excluindo}
              style={styles.btnExcluirProduto}
            >
              {excluindo ? 'EXCLUINDO...' : '🗑️ EXCLUIR PRODUTO'}
            </button>
          </div>
        </div>

        {/* DETALHES DO PRODUTO */}
        <section style={styles.card}>
          <div style={styles.productLayout}>
            <div style={styles.imageContainer}>
              {produto.imagem_url && !erroImagem ? (
                <img
                  src={produto.imagem_url}
                  alt={produto.nome}
                  referrerPolicy="no-referrer"
                  style={styles.productImage}
                  onError={() => setErroImagem(true)}
                />
              ) : (
                <div style={styles.noImagePlaceholder}>
                  <span style={{ fontSize: '2.5rem' }}>🖼️</span>
                  <span style={styles.noImageText}>
                    {produto.imagem_url && erroImagem ? 'Imagem indisponível' : 'Sem imagem cadastrada'}
                  </span>
                </div>
              )}
            </div>

            <div style={styles.productDetails}>
              <div style={styles.productHeader}>
                <h1 style={styles.productTitle}>{produto.nome}</h1>
                <span style={styles.badgeCategory}>{produto.categoria || 'Sem Categoria'}</span>
              </div>

              <div style={styles.infoGrid}>
                <div style={styles.infoBox}>
                  <span style={styles.infoLabel}>CÓDIGO DE BARRAS (EAN)</span>
                  <p style={styles.infoValue}>{produto.codigo_barras}</p>
                </div>

                <div style={styles.infoBox}>
                  <span style={styles.infoLabel}>QUANTIDADE EM ESTOQUE</span>
                  <p style={styles.infoValue}>{produto.quantidade_estoque} un.</p>
                </div>

                <div style={styles.infoBox}>
                  <span style={styles.infoLabel}>DATA DE VALIDADE</span>
                  <p style={styles.infoValue}>
                    {produto.data_validade
                      ? new Date(produto.data_validade).toLocaleDateString('pt-BR')
                      : 'Não aplicável / Não informada'}
                  </p>
                </div>
              </div>

              {produto.descricao && (
                <div style={styles.descBox}>
                  <span style={styles.infoLabel}>DESCRIÇÃO DETALHADA</span>
                  <p style={styles.descText}>{produto.descricao}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ASSOCIAÇÃO N:N */}
        <section style={{ ...styles.card, marginTop: '30px' }}>
          <h2 style={styles.sectionTitle}>GESTÃO DE FORNECEDORES DO PRODUTO</h2>
          <p style={styles.subtitle}>Associe ou remova os parceiros comerciais que fornecem este item.</p>

          <form onSubmit={handleAssociar} style={styles.formAssociar}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>SELECIONE UM FORNECEDOR CADASTRADO</label>
              <select
                value={fornecedorSelecionadoId}
                onChange={(e) => setFornecedorSelecionadoId(e.target.value)}
                style={styles.select}
              >
                <option value="">
                  -- Escolha um fornecedor na lista ({todosFornecedores.length} cadastrados) --
                </option>
                {todosFornecedores.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nome_empresa} (CNPJ: {f.cnpj})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={associando}
              style={styles.btnVincular}
            >
              {associando ? 'VINCULANDO...' : '+ VINCULAR FORNECEDOR'}
            </button>
          </form>

          <div style={{ marginTop: '24px' }}>
            <h3 style={styles.subTableTitle}>
              Fornecedores Vinculados ({fornecedoresAssociados.length})
            </h3>

            {fornecedoresAssociados.length === 0 ? (
              <div style={styles.cardVazio}>
                <p style={{ color: 'var(--texto-preto)', margin: 0 }}>
                  Nenhum fornecedor vinculado a este produto ainda.
                </p>
              </div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr style={styles.trHeader}>
                    <th style={styles.th}>RAZÃO SOCIAL / EMPRESA</th>
                    <th style={styles.th}>CNPJ</th>
                    <th style={styles.thCenter}>AÇÃO</th>
                  </tr>
                </thead>
                <tbody>
                  {fornecedoresAssociados.map((fornecedor) => (
                    <tr key={fornecedor.id} style={styles.tr}>
                      <td style={{ ...styles.td, fontWeight: '600' }}>{fornecedor.nome_empresa}</td>
                      <td style={styles.td}>{fornecedor.cnpj}</td>
                      <td style={styles.tdCenter}>
                        <button
                          type="button"
                          onClick={() => handleDesassociar(fornecedor.id, fornecedor.nome_empresa)}
                          style={styles.btnDesassociar}
                        >
                          ✕ Desvincular
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '30px auto',
    padding: '0 20px'
  },
  navBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  btnVoltar: {
    backgroundColor: 'transparent',
    color: 'var(--azul-claro)',
    border: 'none',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-header-btn)',
    fontWeight: 'bold',
    cursor: 'pointer',
    padding: 0
  },
  btnExcluirProduto: {
    backgroundColor: '#fff1f0',
    color: '#e53e3e',
    border: '1px solid #ffa39e',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-header-btn)',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '32px',
    border: '1px solid var(--input-bg)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  productLayout: {
    display: 'grid',
    gridTemplateColumns: '220px 1fr',
    gap: '30px',
    alignItems: 'start'
  },
  imageContainer: {
    width: '100%',
    height: '220px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '2px solid var(--input-bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    boxSizing: 'border-box'
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  noImagePlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--placeholder-grafite)'
  },
  noImageText: {
    fontSize: '0.8rem',
    fontWeight: '600'
  },
  productDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  productHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid var(--fundo-branco)',
    paddingBottom: '12px'
  },
  productTitle: {
    margin: 0,
    color: 'var(--azul-escuro)',
    fontSize: '1.6rem',
    fontFamily: 'var(--font-header-btn)'
  },
  badgeCategory: {
    backgroundColor: 'var(--input-bg)',
    color: 'var(--texto-preto)',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '600'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '16px'
  },
  infoBox: {
    backgroundColor: 'var(--fundo-branco)',
    padding: '14px',
    borderRadius: '6px'
  },
  infoLabel: {
    display: 'block',
    fontSize: '0.75rem',
    fontFamily: 'var(--font-header-btn)',
    color: 'var(--placeholder-grafite)',
    marginBottom: '4px',
    fontWeight: 'bold'
  },
  infoValue: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--texto-preto)'
  },
  descBox: {
    backgroundColor: 'var(--fundo-branco)',
    padding: '14px',
    borderRadius: '6px'
  },
  descText: {
    margin: 0,
    color: 'var(--texto-preto)',
    fontSize: '0.9rem',
    lineHeight: '1.4'
  },
  sectionTitle: {
    margin: 0,
    color: 'var(--azul-escuro)',
    fontSize: '1.3rem',
    fontFamily: 'var(--font-header-btn)'
  },
  subtitle: {
    margin: '4px 0 20px 0',
    color: 'var(--placeholder-grafite)',
    fontSize: '0.85rem'
  },
  formAssociar: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-end',
    backgroundColor: 'var(--fundo-branco)',
    padding: '20px',
    borderRadius: '8px'
  },
  label: {
    display: 'block',
    color: 'var(--texto-preto)',
    fontSize: '0.85rem',
    fontWeight: '700',
    marginBottom: '6px'
  },
  select: {
    width: '100%',
    backgroundColor: '#ffffff',
    border: '1px solid var(--input-bg)',
    borderRadius: '6px',
    padding: '12px',
    fontSize: '0.95rem',
    color: '#000000',
    outline: 'none'
  },
  btnVincular: {
    backgroundColor: 'var(--azul-claro)',
    color: '#ffffff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-header-btn)',
    fontWeight: 'bold',
    cursor: 'pointer',
    height: '45px'
  },
  subTableTitle: {
    fontSize: '1rem',
    color: 'var(--azul-escuro)',
    marginBottom: '12px',
    fontFamily: 'var(--font-header-btn)'
  },
  cardVazio: {
    backgroundColor: 'var(--fundo-branco)',
    padding: '24px',
    borderRadius: '6px',
    textAlign: 'center'
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
    padding: '14px',
    textAlign: 'left',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-header-btn)'
  },
  thCenter: {
    padding: '14px',
    textAlign: 'center',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-header-btn)'
  },
  tr: {
    borderBottom: '1px solid var(--input-bg)'
  },
  td: {
    padding: '14px',
    color: 'var(--texto-preto)',
    fontSize: '0.9rem'
  },
  tdCenter: {
    padding: '14px',
    textAlign: 'center'
  },
  btnDesassociar: {
    backgroundColor: '#fff1f0',
    color: '#e53e3e',
    border: '1px solid #ffa39e',
    padding: '6px 14px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  btnEditarProduto: {
    backgroundColor: 'var(--fundo-branco)',
    color: 'var(--azul-escuro)',
    border: '1px solid var(--azul-claro)',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-header-btn)',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
};