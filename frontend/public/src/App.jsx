import { Routes, Route, useLocation } from 'react-router-dom';
import './styles/App.css';
import Navbar from './components/common/Navbar'; 
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Products from './pages/Products';

function App() {
  const location = useLocation();
  
  // Páginas que no deben mostrar navbar y footer
  const authPages = ['/registro', '/login'];
  const isAuthPage = authPages.includes(location.pathname);

  return (
    <>
      {!isAuthPage && <Navbar/>}
      <main className={isAuthPage ? 'auth-main' : 'main'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* Rutas adicionales que puedes agregar después */}
          <Route path="/paquetes" element={
            <div className="coming-soon">
              <h1>Nuestros Paquetes</h1>
              <p>Próximamente disponible</p>
            </div>
          } />
          <Route path="/productos" element={<Products />} />
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
    </>
  );
}

export default App;