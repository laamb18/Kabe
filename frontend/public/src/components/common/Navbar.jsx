import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/components/common/Navbar.css';

    const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [cartCount] = useState(0); // TODO: conectar con Context
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const profileMenuRef = useRef(null);

    // Cerrar menú móvil al cambiar de ruta
    useEffect(() => {
        setIsMenuOpen(false);
        setIsProfileMenuOpen(false);
    }, [location]);

    // Cerrar menú de perfil al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const navItems = [
        { path: '/', label: 'Inicio', type: 'home' },
        { path: '/paquetes', label: 'Paquetes', type: 'link' },
        { path: '/productos', label: 'Productos', type: 'link' },
        { path: '#contact', label: 'Cotización', type: 'scroll' },
        { path: '#contact', label: 'Contacto', type: 'scroll' }
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        setIsProfileMenuOpen(false);
    };

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
    };

    const isActiveLink = (path) => {
        return location.pathname === path;
    };

    const handleAuth = () => {
        if (isAuthenticated()) {
            // Logout logic
            logout();
            console.log('Sesión cerrada');
            navigate('/');
            setIsProfileMenuOpen(false);
        } else {
            // Redirect to login
            navigate('/login');
        }
    };

    const handleProfileNavigation = (path) => {
        navigate(path);
        setIsProfileMenuOpen(false);
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                </button>
            </form>

            {/* Actions */}
            <div className="navbar-actions">
                {/* Carrito */}
                <Link to="/carrito" className="navbar-cart" title="Ver carrito">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="8" cy="21" r="1"></circle>
                    <circle cx="19" cy="21" r="1"></circle>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57L20.16 9H5.12"></path>
                </svg>
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </Link>

                {/* User Profile o Auth Buttons */}
                {isAuthenticated() ? (
                <div className="user-profile-container" ref={profileMenuRef}>
                    <button 
                        className="user-profile-button" 
                        onClick={toggleProfileMenu}
                        title={`${user?.nombre} ${user?.apellido}`}
                    >
                        <div className="user-avatar">
                            <svg className="avatar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className={`profile-dropdown ${isProfileMenuOpen ? 'active' : ''}`}>
                        <div className="profile-header">
                            <div className="profile-avatar-large">
                                <svg className="avatar-icon-large" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>
                            <div className="profile-info">
                                <h3>{user?.nombre} {user?.apellido}</h3>
                                <p>{user?.email}</p>
                            </div>
                        </div>
                        
                        <div className="profile-menu">
                            <button 
                                className="profile-menu-item"
                                onClick={() => handleProfileNavigation('/perfil')}
                            >
                                <span className="menu-icon">�</span>
                                Mi Perfil
                            </button>
                            
                            <button 
                                className="profile-menu-item"
                                onClick={() => handleProfileNavigation('/mis-eventos')}
                            >
                                <span className="menu-icon">🎉</span>
                                Mis Eventos
                            </button>
                            
                            <button 
                                className="profile-menu-item"
                                onClick={() => handleProfileNavigation('/historial')}
                            >
                                <span className="menu-icon">�</span>
                                Historial
                            </button>
                            
                            <div className="profile-divider"></div>
                            
                            <button 
                                className="profile-menu-item logout-item"
                                onClick={handleAuth}
                            >
                                <span className="menu-icon">🚪</span>
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
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
            
            <li className="mobile-divider"></li>
            
            {/* Carrito */}
            <li className="mobile-item">
                <Link to="/carrito" className="mobile-link" onClick={closeMenu}>
                🛒 Carrito ({cartCount})
                </Link>
            </li>
            
            {/* Auth Actions */}
            {isAuthenticated() ? (
                <>
                <li className="mobile-item">
                    <div className="mobile-user-info">
                    👤 {`${user?.nombre} ${user?.apellido}` || 'Usuario'}
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