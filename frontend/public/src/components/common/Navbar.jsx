    import { useState, useEffect } from 'react';
    import { Link, useLocation } from 'react-router-dom';
    import '../../styles/components/common/Navbar.css';

    const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [cartCount] = useState(0); // TODO: conectar con Context
    const [isLoggedIn] = useState(false); // TODO: conectar con AuthContext
    const [user] = useState(null); // TODO: conectar con AuthContext
    const location = useLocation();

    // Cerrar menú móvil al cambiar de ruta
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const navItems = [
        { path: '/', label: 'Inicio' },
        { path: '/paquetes', label: 'Paquetes' },
        { path: '/personalizado', label: 'Arma tu Evento' },
        { path: '/cotizacion', label: 'Cotización' },
        { path: '/contacto', label: 'Contacto' }
    ];

    const userMenuItems = isLoggedIn ? [
        { path: '/perfil', label: 'Mi Perfil' },
        { path: '/mis-eventos', label: 'Mis Eventos' },
        { path: '/historial', label: 'Historial' }
    ] : [];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const isActiveLink = (path) => {
        return location.pathname === path;
    };

    const handleAuth = () => {
        // TODO: Implementar lógica de login/logout
        if (isLoggedIn) {
            // Logout logic
            console.log('Cerrando sesión...');
        } else {
            // Redirect to login
            console.log('Redirigiendo a login...');
        }
    };

    return (
        <nav className="navbar">
        <div className="navbar-container">
            {/* Logo */}
            <Link to="/" className="navbar-logo">
            <span>K´abé</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="navbar-menu">
            <ul className="navbar-nav">
                {navItems.map((item) => (
                <li key={item.path} className="navbar-item">
                    <Link
                    to={item.path}
                    className={`navbar-link ${isActiveLink(item.path) ? 'active' : ''}`}
                    >
                    {item.label}
                    </Link>
                </li>
                ))}
                
                {/* User menu items (solo si está logueado) */}
                {isLoggedIn && userMenuItems.length > 0 && (
                <>
                    <li className="navbar-divider"></li>
                    {userMenuItems.map((item) => (
                    <li key={item.path} className="navbar-item">
                        <Link
                        to={item.path}
                        className={`navbar-link user-link ${isActiveLink(item.path) ? 'active' : ''}`}
                        >
                        {item.label}
                        </Link>
                    </li>
                    ))}
                </>
                )}
            </ul>

            {/* Actions */}
            <div className="navbar-actions">
                {/* Carrito */}
                <Link to="/carrito" className="navbar-cart" title="Ver carrito">
                <span className="cart-icon">🛒</span>
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </Link>

                {/* User Profile o Auth Buttons */}
                {isLoggedIn ? (
                <div className="user-menu">
                    <div className="user-avatar" title={user?.name || 'Usuario'}>
                    <span className="avatar-icon">👤</span>
                    </div>
                    <button 
                    className="navbar-auth-btn logout-btn" 
                    onClick={handleAuth}
                    title="Cerrar sesión"
                    >
                    Cerrar Sesión
                    </button>
                </div>
                ) : (
                <div className="auth-buttons">
                    <Link to="/login" className="navbar-auth-btn login-btn">
                    Iniciar Sesión
                    </Link>
                    <Link to="/registro" className="navbar-auth-btn register-btn">
                    Registrarse
                    </Link>
                </div>
                )}
            </div>
            </div>

            {/* Mobile Hamburger */}
            <div className="navbar-toggle" onClick={toggleMenu}>
            <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
            <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
            <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
            </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
            <ul className="mobile-nav">
            {/* Navigation Items */}
            {navItems.map((item) => (
                <li key={item.path} className="mobile-item">
                <Link
                    to={item.path}
                    className={`mobile-link ${isActiveLink(item.path) ? 'active' : ''}`}
                    onClick={closeMenu}
                >
                    {item.label}
                </Link>
                </li>
            ))}
            
            {/* User Menu Items (si está logueado) */}
            {isLoggedIn && userMenuItems.length > 0 && (
                <>
                <li className="mobile-divider"></li>
                {userMenuItems.map((item) => (
                    <li key={item.path} className="mobile-item">
                    <Link
                        to={item.path}
                        className={`mobile-link user-link ${isActiveLink(item.path) ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        {item.label}
                    </Link>
                    </li>
                ))}
                </>
            )}
            
            <li className="mobile-divider"></li>
            
            {/* Carrito */}
            <li className="mobile-item">
                <Link to="/carrito" className="mobile-link" onClick={closeMenu}>
                🛒 Carrito ({cartCount})
                </Link>
            </li>
            
            {/* Auth Actions */}
            {isLoggedIn ? (
                <>
                <li className="mobile-item">
                    <div className="mobile-user-info">
                    👤 {user?.name || 'Usuario'}
                    </div>
                </li>
                <li className="mobile-item">
                    <button className="mobile-auth-btn logout-btn" onClick={handleAuth}>
                    Cerrar Sesión
                    </button>
                </li>
                </>
            ) : (
                <>
                <li className="mobile-item">
                    <Link to="/login" className="mobile-auth-btn login-btn" onClick={closeMenu}>
                    Iniciar Sesión
                    </Link>
                </li>
                <li className="mobile-item">
                    <Link to="/registro" className="mobile-auth-btn register-btn" onClick={closeMenu}>
                    Registrarse
                    </Link>
                </li>
                </>
            )}
            </ul>
        </div>
        </nav>
    );
    };

    export default Navbar;