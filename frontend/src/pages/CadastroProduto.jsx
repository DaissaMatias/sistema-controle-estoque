import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import api from '../services/api';

export default function CadastroProduto() {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    codigo_barras: '',
    categoria: '',
    quantidade_estoque: '',
    data_validade: '',
    imagem_url: '',
    descricao: '',
  });

  const handleChange = (e)=> {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Validação de EAN-13 (Exatamente 13 números)
    const eanRegex = /^\d{13}$/;
    if(!eanRegex.test(formData.codigo_barras)) {
      alert('O Código de Barras deve conter exatamente 13 dígitos numéricos (padrão EAN-13).');
      return;
    }
    
    setCarregando(true);

    try{
      await api.post('/produtos', {
        ...formData,
        quantidade_estoque: Number(formData.quantidade_estoque) || 0,
        //Converte string vazia para null para não quebrar o tipo DATE do Postgree
        data_validade: formData.data_validade ? formData.data_validade : null,
        categoria: formData.categoria ? formData.categoria : null,
        imagem_url: formData.imagem_url ? formData.imagem_url : null,
        //descricao: formData.descricao ? formData.descricao : null
      });

      alert('Produto cadastrado com sucesso');
      navigate('/');
    } catch (erro) {
      console.error("Erro ao cadastrar produto:", erro);
      const msg = erro.respoonse?.data?.erro || 'Erro ao cadastrar o produto. Tente novamente.';
      alert(msg);
    }finally{
      setCarregando(false);
    }
  };


  return (
    <div style={{backgroundColor:'var(--fundo-branco)', minHeight:'100vh'}}>
      <Header/>

      <main style={styles.container}>
        <div style={styles.card}>
          <div style={styles.headerForm}>
            <h1 style={styles.title}>Cadastrar Novo Produto</h1>
            <p style={styles.subtitle}>Preencha os campos abaixo para adicionar o item ao estoque</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/*Linha 1: Nome e código de Barras*/}
            <div style={styles.row}>
              <div style={styles.group}>  
                <label style={styles.label}>Nome do Produto *</label>
                <input 
                  type="text"
                  name='nome'
                  required
                  placeholder='Insira o nome do produto'
                  value={formData.nome}
                  onChange={handleChange}
                  style={styles.input} 
                />
              </div>

              <div style={styles.group}>  
                <label style={styles.label}>Código de Barras *</label>
                <input 
                  type="text"
                  name='codigo_barras'
                  required
                  placeholder='Insira o código de barras'
                  value={formData.codigo_barras}
                  onChange={handleChange}
                  style={styles.input} 
                />
              </div>
            </div>

            {/*Linha 2: Categoria, estoque e validade*/}
            <div style={styles.rowThree}>
              <div style={styles.group}>  
                <label style={styles.label}>Categoria</label>
                <input 
                  type="text"
                  name='categoria'
                  placeholder='Ex: Periféricos'
                  value={formData.categoria}
                  onChange={handleChange}
                  style={styles.input} 
                />
              </div>

              <div style={styles.group}>  
                <label style={styles.label}>Quantidade em Estoque *</label>
                <input 
                  type="number"
                  name='quantidade_estoque'
                  required
                  min="0"
                  placeholder='Quantidade disponível'
                  value={formData.quantidade_estoque}
                  onChange={handleChange}
                  style={styles.input} 
                />
              </div>

              <div style={styles.group}>  
                <label style={styles.label}>Data de Validade</label>
                <input 
                  type="date"
                  name='data_validade'
                  value={formData.data_validade}
                  onChange={handleChange}
                  style={styles.input} 
                />
              </div>
            </div>

            {/*Linha 3: URL da Imagem*/}
            <div style={styles.group}>  
                <label style={styles.label}>Imagem do Produto</label>
                <input 
                  type="url"
                  name='imagem_url'
                  placeholder='Imagem do Produto'
                  value={formData.imagem_url}
                  onChange={handleChange}
                  style={styles.input} 
                />
              </div>

              {/*Linha 4: Descrição*/}
              <div style={styles.group}>  
                <label style={styles.label}>Descrição *</label>
                <textarea 
                  name='descricao'
                  rows="3"
                  required
                  placeholder='Descreva brevemento o produto'
                  value={formData.descricao}
                  onChange={handleChange}
                  style={{...styles.input, resize: 'vertical'}} 
                />
              </div>

              {/*Botôes de Ação*/}
              <div style={styles.buttonContainer}>
                <button
                  type='button'
                  onClick={()=> navigate('/')}
                  style={styles.btnCancelar}
                >
                  Cancelar
                </button>

                <button
                  type='submit'
                  disabled={carregando}
                  style={styles.btnSalvar}
                >
                  {carregando ? 'Salvando...' : 'Salvar Produto'}
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