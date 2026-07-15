import { Route, Routes } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Layout } from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Login from '@/pages/auth/Login';
import RecuperarPassword from '@/pages/auth/RecuperarPassword';
import Register from '@/pages/auth/Register';
import Brands from '@/pages/admin/Brands';
import Categories from '@/pages/admin/Categories';
import Coupons from '@/pages/admin/Coupons';
import Dashboard from '@/pages/admin/Dashboard';
import OrdersAdmin from '@/pages/admin/Orders';
import Products from '@/pages/admin/Products';
import Reports from '@/pages/admin/Reports';
import UsersAdmin from '@/pages/admin/Users';
import Cart from '@/pages/Cart';
import Catalogo from '@/pages/Catalogo';
import Categorias from '@/pages/Categorias';
import Checkout from '@/pages/Checkout';
import Favorites from '@/pages/Favorites';
import Devoluciones from '@/pages/legal/Devoluciones';
import Privacidad from '@/pages/legal/Privacidad';
import Terminos from '@/pages/legal/Terminos';
import NotFound from '@/pages/NotFound';
import OrderDetail from '@/pages/OrderDetail';
import Orders from '@/pages/Orders';
import ProductDetail from '@/pages/ProductDetail';
import Profile from '@/pages/Profile';
import { AdminRoute, ProtectedRoute } from '@/routes/ProtectedRoute';
import { useAnalyticsPageview } from '@/hooks/useAnalyticsPageview';

function App() {
  useAnalyticsPageview();

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
        <Route path="terminos" element={<Terminos />} />
        <Route path="privacidad" element={<Privacidad />} />
        <Route path="devoluciones" element={<Devoluciones />} />
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
          path="pedidos"
          element={
            <ProtectedRoute>
              <Orders />
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
        <Route
          path="perfil"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="favoritos"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="productos" element={<Products />} />
          <Route path="categorias" element={<Categories />} />
          <Route path="marcas" element={<Brands />} />
          <Route path="cupones" element={<Coupons />} />
          <Route path="pedidos" element={<OrdersAdmin />} />
          <Route path="usuarios" element={<UsersAdmin />} />
          <Route path="reportes" element={<Reports />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
