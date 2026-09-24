import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import CadastroProduto from './pages/CadastroProduto';
import Fornecedores from './pages/Fornecedores';
import DetalhesProduto from './pages/DetalhesProduto';
import EdicaoProduto from './pages/EdicaoProduto';

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/produtos/novo' element={<CadastroProduto/>}/>
        <Route path='/produtos/:id' element={<DetalhesProduto/>}/>
        <Route path='/produtos/:id/editar' element={<EdicaoProduto/>}/>
        <Route path='/fornecedores' element={<Fornecedores/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App
