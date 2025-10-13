import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './styles/App.css';
import Navbar from './components/common/Navbar'; 
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Products from './pages/Products';
import Packages from './pages/Packages';
import PackageDetail from './pages/PackageDetail';
import Profile from './pages/Profile';
import MisEventos from './pages/MisEventos';
import Historial from './pages/Historial';
// Importaciones para administradores
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminPackages from './pages/admin/AdminPackages';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
  const location = useLocation();
  
  // Páginas que no deben mostrar navbar y footer
  const authPages = ['/registro', '/login'];
  const adminPages = ['/admin/login', '/admin/dashboard', '/admin/productos', '/admin/categorias', '/admin/paquetes', '/admin/usuarios'];
  const isAuthPage = authPages.includes(location.pathname);
  const isAdminPage = adminPages.some(page => location.pathname.startsWith(page.split('/').slice(0, 3).join('/')));

  return (
    <AuthProvider>
      {!isAuthPage && !isAdminPage && <Navbar/>}
      <main className={isAuthPage || isAdminPage ? 'auth-main' : 'main'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/mis-eventos" element={<MisEventos />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/paquetes" element={<Packages />} />
          <Route path="/paquetes/:id" element={<PackageDetail />} />
          <Route path="/categorias" element={<Packages />} />
          <Route path="/productos" element={<Products />} />
          
          {/* Rutas de administrador */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/productos" element={<AdminProducts />} />
          <Route path="/admin/categorias" element={<AdminCategories />} />
          <Route path="/admin/paquetes" element={<AdminPackages />} />
          <Route path="/admin/usuarios" element={<AdminUsers />} />
          
          {/* Rutas adicionales que puedes agregar después */}
          <Route path="/carrito" element={
            <div className="coming-soon">
              <h1>Carrito de Compras</h1>
              <p>Próximamente disponible</p>
            </div>
          } />
          {/* Ruta 404 */}
          <Route path="*" element={
            <div className="coming-soon">
              <h1>Página no encontrada</h1>
              <p>La página que buscas no existe</p>
            </div>
          } />
        </Routes>
      </main>
      {!isAuthPage && !isAdminPage && <Footer/>}
    </AuthProvider>
  );
}

export default App;