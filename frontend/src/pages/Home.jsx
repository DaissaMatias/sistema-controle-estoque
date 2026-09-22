import { useEffect, useState } from 'react';
import Header from '../components/Header';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const [produtos, setProdutos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const navigate = useNavigate();

    //Busca os produtos na API assim que a tela carrega
    useEffect(()=> {
        let ativo = true; 

        const carregarProdutos = async () => {
        try{
            const resposta = await api.get('/produtos');
            if(ativo) {
                setProdutos(resposta.data);
            }
        } catch (erro) {
            console.error("Erro ao buscar produtos:", erro);
        } finally {
            if(ativo){
                setCarregando(false);
            }
        }
    };

    carregarProdutos();

    return ()=> {
        ativo = false;
    }
}, []);

  return (
    <div style={{backgroundColor: 'var(--fundo-branco)', minHeight: '100vh'}}>
        <Header/>

        <main style={styles.container}>
            <div style={styles.topBar}>
                <div>
                    <h1 style={styles.title}>Produtos Cadastrados</h1>
                    <p style={styles.subtext}>
                        {produtos.length === 1 ? '1 produto cadastrado' : `${produtos.length} produtos cadastrados`}
                    </p>
                </div>

                <button 
                    style={styles.btnNovo}
                    onClick={()=> navigate('/produtos/novo')}
                >
                    + Novo Produto
                </button>
            </div>

            {carregando ? (
                <p style={{textAlign: 'center', marginTop: '40px', color:'var(--texto-preto)'}}>Carregando estoque...</p>
            ) : produtos.length === 0 ? (
                <div style={styles.cardVazio}>
                    <p style={{marginBottom:'20px', color: 'var(--texto-preto)'}}>
                        Nenhum produto cadastrado no banco de dados.</p>
                    <button style={styles.btnNovo} onClick={()=> navigate('/produtos/novo')}>
                        Cadastrar Primeiro Produto
                    </button>
                </div>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.trHeader}>
                            <th style={styles.th}>CÓDIGO (EAN)</th>
                            <th style={styles.th}>NOME DO PRODUTO</th>
                            <th style={styles.th}>CATEGORIA</th>
                            <th style={styles.th}>ESTOQUE (QTD.)</th>
                            <th style={styles.thCenter}>AÇÕES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtos.map((produto)=> (
                            <tr key={produto.id} style={styles.tr}>
                                <td style={styles.td}>{produto.codigo_barras}</td>
                                <td style={{...styles.td, fontWeight: '600'}}>{produto.nome}</td>
                                <td style={styles.td}>{produto.categoria}</td>
                                <td style={styles.td}>{produto.quantidade_estoque}</td>
                                <td style={styles.tdCenter}>
                                    <button
                                        style={styles.btnAssociar}
                                        onClick={() => navigate(`/produtos/${produto.id}`)}
                                    >
                                        ⚙ Associar Fornecedores
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
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
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  title: {
    margin: 0,
    color: 'var(--texto-preto)',
    fontSize: '1.75rem',
    fontFamily: 'var(--font-corpo)',
    fontWeight: '700'
  },
  subtext: {
    margin: '4px 0 0 0',
    color: 'var(--placeholder-grafite)',
    fontSize: '0.9rem'
  },
  btnNovo: {
    backgroundColor: 'var(--azul-claro)',
    color: '#ffffff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    fontSize: '0.95rem',
    fontFamily:'var(--font-header-btn)',
    fontWeight: 'bold',
    cursor: 'pointer',
    letterSpacing:'0.5px',
  },
  cardVazio: {
    backgroundColor: '#ffffff',
    padding: '40px',
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
    border:'1px solid var(--input-bg)'
  },
  trHeader: {
    backgroundColor: 'var(--azul-medio)',
    color:'#ffffff',
    borderBottom: '2px solid #e2e8f0',
  },
  th: {
    padding: '16px',
    textAlign: 'left',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-header-btn)',
    letterSpacing: '0.5px',
  },
  thCenter: {
    padding: '16px',
    textAlign: 'center',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-header-btn)',
    letterSpacing: '0.5px',
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
  btnAssociar: {
    backgroundColor: 'transparent',
    color: 'var(--azul-claro)',
    border: '1.5px solid var(--azul-claro)',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-header-btn)',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};