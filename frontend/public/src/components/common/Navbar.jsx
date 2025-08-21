    import React, { useState } from 'react';
    import { Link, useLocation } from 'react-router-dom';
    import '../../styles/components/common/Navbar.css';

    const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [cartCount] = useState(0); // Simulado - conectar con Context después
    const [isAdmin] = useState(false); // Simulado - conectar con AuthContext después
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Inicio' },
        { path: '/paquetes', label: 'Paquetes' },
        { path: '/personalizado', label: 'Arma tu Evento' },
        { path: '/cotizacion', label: 'Cotización' },
        { path: '/contacto', label: 'Contacto' }
    ];

    const adminNavItems = [
        { path: '/admin', label: 'Dashboard' },
        { path: '/admin/productos', label: 'Productos' },
        { path: '/admin/rentas', label: 'Rentas' }
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const isActiveLink = (path) => {
        return location.pathname === path;
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
                
                {/* Admin menu items (solo si es admin) */}
                {isAdmin && (
                <>
                    <li className="navbar-divider"></li>
                    {adminNavItems.map((item) => (
                    <li key={item.path} className="navbar-item">
                        <Link
                        to={item.path}
                        className={`navbar-link admin-link ${isActiveLink(item.path) ? 'active' : ''}`}
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
                <Link to="/carrito" className="navbar-cart">
                <span className="cart-icon">🛒</span>
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </Link>

                {/* Login/Logout */}
                <button className="navbar-auth-btn">
                {isAdmin ? 'Cerrar Sesión' : 'Admin'}
                </button>
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
            {navItems.map((item) => (
                <li key={item.path} className="mobile-item">
                <Link
                    to={item.path}
                    className={`mobile-link ${isActiveLink(item.path) ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                >
                    {item.label}
                </Link>
                </li>
            ))}
            
            {isAdmin && (
                <>
                <li className="mobile-divider"></li>
                {adminNavItems.map((item) => (
                    <li key={item.path} className="mobile-item">
                    <Link
                        to={item.path}
                        className={`mobile-link admin-link ${isActiveLink(item.path) ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {item.label}
                    </Link>
                    </li>
                ))}
                </>
            )}
            
            <li className="mobile-divider"></li>
            <li className="mobile-item">
                <Link to="/carrito" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                🛒 Carrito ({cartCount})
                </Link>
            </li>
            <li className="mobile-item">
                <button className="mobile-auth-btn">
                {isAdmin ? 'Cerrar Sesión' : 'Admin Login'}
                </button>
            </li>
            </ul>
        </div>
        </nav>
    );
    };

    export default Navbar;