import { Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Login from '@/pages/auth/Login';
import RecuperarPassword from '@/pages/auth/RecuperarPassword';
import Register from '@/pages/auth/Register';
import Catalogo from '@/pages/Catalogo';
import Categorias from '@/pages/Categorias';
import NotFound from '@/pages/NotFound';
import ProductDetail from '@/pages/ProductDetail';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="catalogo" element={<Catalogo />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="productos/:slug" element={<ProductDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Register />} />
        <Route path="recuperar-password" element={<RecuperarPassword />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
