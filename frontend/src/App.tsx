import { Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Login from '@/pages/auth/Login';
import RecuperarPassword from '@/pages/auth/RecuperarPassword';
import Register from '@/pages/auth/Register';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Register />} />
        <Route path="recuperar-password" element={<RecuperarPassword />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
