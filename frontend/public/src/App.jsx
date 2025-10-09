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
import Profile from './pages/Profile';
import MisEventos from './pages/MisEventos';
import Historial from './pages/Historial';

function App() {
  const location = useLocation();
  
  // Páginas que no deben mostrar navbar y footer
  const authPages = ['/registro', '/login'];
  const isAuthPage = authPages.includes(location.pathname);

  return (
    <AuthProvider>
      {!isAuthPage && <Navbar/>}
      <main className={isAuthPage ? 'auth-main' : 'main'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/mis-eventos" element={<MisEventos />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/paquetes" element={<Packages />} />
          <Route path="/categorias" element={<Packages />} />
          <Route path="/productos" element={<Products />} />
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
      {!isAuthPage && <Footer/>}
    </AuthProvider>
  );
}

export default App;