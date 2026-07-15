import { Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Login from '@/pages/auth/Login';
import RecuperarPassword from '@/pages/auth/RecuperarPassword';
import Register from '@/pages/auth/Register';
import Cart from '@/pages/Cart';
import Catalogo from '@/pages/Catalogo';
import Categorias from '@/pages/Categorias';
import Checkout from '@/pages/Checkout';
import NotFound from '@/pages/NotFound';
import OrderDetail from '@/pages/OrderDetail';
import ProductDetail from '@/pages/ProductDetail';
import { ProtectedRoute } from '@/routes/ProtectedRoute';

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
        <Route
          path="carrito"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="pedidos/:id"
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
