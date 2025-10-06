    import { useState, useEffect } from 'react';
    import { Link, useLocation, useNavigate } from 'react-router-dom';
    import '../../styles/components/common/Navbar.css';

    const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [cartCount] = useState(0); // TODO: conectar con Context
    const [isLoggedIn] = useState(false); // TODO: conectar con AuthContext
    const [user] = useState(null); // TODO: conectar con AuthContext
    const location = useLocation();
    const navigate = useNavigate();

    // Cerrar menú móvil al cambiar de ruta
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const navItems = [
        { path: '/', label: 'Inicio', type: 'home' },
        { path: '/paquetes', label: 'Paquetes', type: 'link' },
        { path: '/productos', label: 'Productos', type: 'link' },
        { path: '#contact', label: 'Cotización', type: 'scroll' },
        { path: '#contact', label: 'Contacto', type: 'scroll' }
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

    const handleNavClick = (item) => {
        if (item.type === 'scroll') {
            // Si no estamos en la página principal, navegar primero
            if (location.pathname !== '/') {
                navigate('/');
                // Esperar a que se cargue la página y luego hacer scroll
                setTimeout(() => {
                    scrollToContact();
                }, 100);
            } else {
                scrollToContact();
            }
        } else if (item.type === 'home') {
            // Si no estamos en home, navegar a home
            if (location.pathname !== '/') {
                navigate('/');
            } else {
                // Si ya estamos en home, hacer scroll al top
                scrollToTop();
            }
        }
        closeMenu();
    };

    const scrollToContact = () => {
        const contactSection = document.getElementById('contact-section');
        if (contactSection) {
            contactSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // TODO: Implementar lógica de búsqueda
            console.log('Buscando:', searchQuery);
            // Aquí puedes redirigir a una página de resultados o filtrar productos
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <nav className="navbar">
        <div className="navbar-container">
            {/* Logo */}
            <button 
                className="navbar-logo"
                onClick={() => {
                    if (location.pathname !== '/') {
                        navigate('/');
                    } else {
                        scrollToTop();
                    }
                }}
            >
                <span>K´abé</span>
            </button>

            {/* Desktop Navigation */}
            <div className="navbar-menu">
            <ul className="navbar-nav">
                {navItems.map((item) => (
                <li key={item.label} className="navbar-item">
                    {item.type === 'scroll' || item.type === 'home' ? (
                        <button
                            className="navbar-link navbar-scroll-btn"
                            onClick={() => handleNavClick(item)}
                        >
                            {item.label}
                        </button>
                    ) : (
                        <Link
                            to={item.path}
                            className="navbar-link"
                        >
                            {item.label}
                        </Link>
                    )}
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

            {/* Barra de búsqueda */}
            <form className="navbar-search" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-input"
                />
                <button type="submit" className="search-btn" title="Buscar">
                    🔍
                </button>
            </form>

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
                <li key={item.label} className="mobile-item">
                {item.type === 'scroll' || item.type === 'home' ? (
                    <button
                        className="mobile-link mobile-scroll-btn"
                        onClick={() => handleNavClick(item)}
                    >
                        {item.label}
                    </button>
                ) : (
                    <Link
                        to={item.path}
                        className="mobile-link"
                        onClick={closeMenu}
                    >
                        {item.label}
                    </Link>
                )}
                </li>
            ))}
            
            {/* Búsqueda móvil */}
            <li className="mobile-item">
                <form className="mobile-search" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="mobile-search-input"
                    />
                    <button type="submit" className="mobile-search-btn">
                        🔍 Buscar
                    </button>
                </form>
            </li>
            
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