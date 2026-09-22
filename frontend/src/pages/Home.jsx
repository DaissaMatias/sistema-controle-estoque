import { useEffect, useState } from 'react';
import Header from '../components/Header';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const [produtos, setProdutos] = useState([]);
    const [carregando, setCarrengando] = useState(true);
    const navigate = useNavigate();

    //Busca os produtos na API assim que a tela carrega
    useEffect(()=> {
        carregarProdutos();
    }, []);

    const carregarProdutos = async () => {
        try{
            const resposta = await api.get('/produtos');
            setProdutos(resposta.data);
        } catch (erro) {
            console.error("Erro ao buscar produtos:", erro);
            alert("Erro ao conectar com a API. Certifique-se que o backend está rodando!");
        } finally {
            setCarrengando(false);
        }
    };

  return (
    <div style={{backgroundColor: '#f4f6f8', minHeight: '100vh'}}>
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
                <p style={{textAlign: 'center', marginTop: '40px'}}>Carregando estoque...</p>
            ) : produtos.length === 0 ? (
                <div style={styles.cardVazio}>
                    <p>Nenhum produto cadastrado no banco de dados.</p>
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
                                <td style={{...styles.td, fontWeight: 'bold'}}>{produto.nome}</td>
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
    marginBottom: '20px'
  },
  title: {
    margin: 0,
    color: '#1a202c',
    fontSize: '1.8rem'
  },
  subtext: {
    margin: '5px 0 0 0',
    color: '#718096',
    fontSize: '0.9rem'
  },
  btnNovo: {
    backgroundColor: '#1B85CC',
    color: '#ffffff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  cardVazio: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  trHeader: {
    backgroundColor: '#edf2f7',
    borderBottom: '2px solid #e2e8f0'
  },
  th: {
    padding: '15px',
    textAlign: 'left',
    fontSize: '0.85rem',
    color: '#4a5568',
    fontWeight: 'bold'
  },
  thCenter: {
    padding: '15px',
    textAlign: 'center',
    fontSize: '0.85rem',
    color: '#4a5568',
    fontWeight: 'bold'
  },
  tr: {
    borderBottom: '1px solid #e2e8f0'
  },
  td: {
    padding: '15px',
    color: '#2d3748',
    fontSize: '0.95rem'
  },
  tdCenter: {
    padding: '15px',
    textAlign: 'center'
  },
  btnAssociar: {
    backgroundColor: 'transparent',
    color: '#1B85CC',
    border: '1px solid #1B85CC',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};