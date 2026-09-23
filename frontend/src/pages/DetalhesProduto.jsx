import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import api from "../services/api";
import { useEffect, useState } from "react";


export default function DetalhesProduto() {
  const {id} = useParams();
  const navigate = useNavigate();

  const [produto, setProduto] = useState(null);
  const [fornecedoresAssociados, setFornecedoresAssociados] = useState([]);
  const [todosFornecedores, setTodosFornecedores] = useState([]);
  const [fornecedorSelecionadoId, setFornecedorSelecionadoId] = useState('');

  const [carregando, setCarregando] = useState(true);
  const [associando, setAssociando] = useState(false);

  //Carrega dados do produto, seus fornecedores vinculados e a lista geral de fornecedores
  const carregarDadosGerais = async () => {
    try {
      const [resProduto, resTodosFornecedores] = await Promise.all([
        api.get(`/produtos/${id}`),
        api.get('/fornecedores')
      ]);

      setProduto(resProduto.data.produto);
      setFornecedoresAssociados(resProduto.data.fornecedores_associados);
      setTodosFornecedores(resTodosFornecedores.data);
    } catch (erro) {
      console.error("Erro ao carregar detalhes do produto:", erro);
      alert("Produto não encontrado ou erro na API");
      navigate('/');
    }finally {
      setCarregando(false);
    }
  };

  useEffect(()=> {
    let ativo = true;

    const inicializar = async () => {
      try{
        const [resProduto, resTodosFornecedores] = await Promise.all([
          api.get(`/produtos/${id}`),
          api.get('/fornecedores')
        ]);

        if(ativo) {
          setProduto(resProduto.data.produto);
          setFornecedoresAssociados(resProduto.data.fornecedores_associados);
          setTodosFornecedores(resTodosFornecedores.data);
        }
      } catch (erro) {
        console.error("Erro ao carregar detalhes do produto:", erro);
        if(ativo){
          alert("Produto não encontrado ou erro na API");
          navigate('/');
        }
      } finally {
        if(ativo) {
          setCarregando(false);
        }
      }
    };

    inicializar();

    return ()=> {
      ativo = false;
    };
  }, [id, navigate]);

  //Cenário 1 e 2: Associar Fornecedor ao Produto
  const handleAssociar = async (e) => {
    e.preventDefault();

    if(!fornecedorSelecionadoId) {
      alert("Por favor, selecione um fornecedor na lista.");
      return;
    }

    setAssociando(true);

    try{
      await api.post(`/produtos/${id}/fornecedores`, {
        fornecedor_id: fornecedorSelecionadoId
      });

      alert("Fornecedor associado com sucesso!");
      setFornecedorSelecionadoId('');
      carregarDadosGerais(); // Atualiza a lista na tela
    } catch (erro) {
      console.error("Erro ao associar fornecedor:", erro);
      const msg = erro.response?.data?.erro || "Erro ao associar fornecedor.";
      alert(msg);
    } finally {
      setAssociando(false);
    }
  };

  //Cenário 3: Desassociar Fornecedor do Produto
  const handleDesassociar = async (fornecedorId, nomeFornecedor) => {
    const confirmar = window.confirm(`Deseja realmente remover o vínculo com "${nomeFornecedor}"?`);
    if(!confirmar) return;

    try {
      await api.delete(`/produtos/${id}/fornecedores/${fornecedorId}`);
      alert("Vínculo removido com sucesso!");
      carregarDadosGerais(); //Atualiza a lista na tela
    } catch (erro) {
      console.error("Erro ao desassociar fornecedor:", erro);
      alert("Erro ao remover vínculo do fornecedor.");
    }
  };

  if(carregando) {
    return (
      <div style={{backgroundColor: 'var(--fundo-branco)', minHeight: '100vh'}}>
        <Header/>
        <p style={{textAlign: 'center', marginTop: '50px', color: 'var(--texto-preto)'}}>
          Carregando informações do produto...
        </p>
      </div>
    );
  }

  return (
    <div style={{backgroundColor: 'var(--fundo-branco)', mindHeight: '100vh'}}>
      <Header/>

      <main style={styles.container}>
        <button onClick={() => navigate('/')} style={styles.btnVoltar}>
          ← Voltar para Produtos
        </button>

        {/*BLOCO 1: DETALHES DO PRODUTO*/}
        
      </main>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '30px auto',
    padding: '0 20px'
  },
  btnVoltar: {
    backgroundColor: 'transparent',
    color: 'var(--azul-claro)',
    border: 'none',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-header-btn)',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '20px',
    padding: 0
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '32px',
    border: '1px solid var(--input-bg)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  productHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '2px solid var(--fundo-branco)',
    paddingBottom: '20px',
    marginBottom: '24px'
  },
  productTitle: {
    margin: '0 0 8px 0',
    color: 'var(--azul-escuro)',
    fontSize: '1.8rem',
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
  productImage: {
    width: '90px',
    height: '90px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '1px solid var(--input-bg)'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '20px',
    marginBottom: '20px'
  },
  infoBox: {
    backgroundColor: 'var(--fundo-branco)',
    padding: '16px',
    borderRadius: '6px'
  },
  infoLabel: {
    display: 'block',
    fontSize: '0.75rem',
    fontFamily: 'var(--font-header-btn)',
    color: 'var(--placeholder-grafite)',
    marginBottom: '6px',
    fontWeight: 'bold'
  },
  infoValue: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'var(--texto-preto)'
  },
  descBox: {
    backgroundColor: 'var(--fundo-branco)',
    padding: '16px',
    borderRadius: '6px',
    marginTop: '10px'
  },
  descText: {
    margin: 0,
    color: 'var(--texto-preto)',
    fontSize: '0.95rem',
    lineHeight: '1.5'
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
    color: 'var(--texto-preto)',
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
  }
};