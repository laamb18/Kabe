import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/pages/ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const loadProducto = async () => {
      try {
        setLoading(true);
        setImageLoaded(false);
        // Llamar directamente a la API para obtener el producto con imagen en base64
        const response = await fetch(
          `http://localhost:8001/api/v1/productos/${id}`
        );

        if (!response.ok) {
          throw new Error("Error al cargar el producto");
        }

        const data = await response.json();
        console.log("📦 Producto cargado:", data.nombre);
        console.log("🖼️  Tiene imagen_url:", data.imagen_url ? "SÍ" : "NO");
        if (data.imagen_url) {
          console.log(
            "📏 Longitud imagen_url:",
            data.imagen_url.length,
            "caracteres"
          );
          console.log(
            "🔍 Primeros 50 chars:",
            data.imagen_url.substring(0, 50)
          );
        }
        console.log("📂 Categoria:", data.categoria_nombre);
        setProducto(data);
      } catch (err) {
        setError("Error al cargar el producto");
        console.error("Error loading producto:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProducto();
    }
  }, [id]);

  const handleGoBack = () => {
    navigate("/productos");
  };

  const handleRentar = () => {
    if (isAuthenticated()) {
      // Si está autenticado, proceder con la renta
      // TODO: Implementar lógica de renta
      console.log("Proceder con renta");
    } else {
      // Si no está autenticado, mostrar modal
      setShowLoginModal(true);
    }
  };

  const handleAddToFavorites = () => {
    if (isAuthenticated()) {
      // Si está autenticado, agregar a favoritos
      // TODO: Implementar lógica de favoritos
      console.log("Agregar a favoritos");
    } else {
      // Si no está autenticado, mostrar modal
      setShowLoginModal(true);
    }
  };

  const handleContactForQuote = () => {
    // Navegar a la sección de cotización
    navigate("/", { state: { scrollTo: "contact-section" } });
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  const handleGoToRegister = () => {
    navigate("/registro");
  };

  const handleImageLoad = () => {
    console.log("✅ Imagen cargada correctamente");
    setImageLoaded(true);
  };

  const handleImageError = (e) => {
    console.error("❌ Error cargando imagen, usando respaldo");
    e.target.src = "/images/silla.jpg"; // Imagen de respaldo
    setImageLoaded(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-container">
          <div className="product-detail-loading">
            <div className="product-detail-spinner"></div>
            <p>Cargando producto...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-container">
          <div className="product-detail-error">
            <h2>Producto no encontrado</h2>
            <p>
              {error ||
                "El producto que buscas no existe o no está disponible."}
            </p>
            <button className="product-detail-back-btn" onClick={handleGoBack}>
              Volver a Productos
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isOutOfStock = producto.stock_disponible === 0;
  const hasDeposit = producto.requiere_deposito && producto.deposito_cantidad;

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Breadcrumb */}
        <nav className="product-breadcrumb">
          <button onClick={handleGoBack} className="breadcrumb-link">
            Productos
          </button>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{producto.nombre}</span>
        </nav>

        <div className="product-detail-content">
          {/* Imagen del producto */}
          <div className="product-detail-image-container">
            {producto.imagen_url ? (
              <img
                src={producto.imagen_url}
                alt={producto.nombre}
                className={`product-detail-image ${
                  imageLoaded ? "loaded" : ""
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            ) : (
              <div className="product-detail-no-image">
                <div className="no-image-icon">📷</div>
                <p>Sin imagen disponible</p>
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="product-detail-info">
            <div className="product-detail-header">
              <span className="product-detail-category">
                {producto.categoria_nombre || "PRODUCTO"}
              </span>
              <h1 className="product-detail-title">{producto.nombre}</h1>
              <p className="product-detail-code">
                Código: {producto.codigo_producto}
              </p>
            </div>

            <div className="product-detail-description">
              <h3>Descripción</h3>
              <p>{producto.descripcion || "Sin descripción disponible"}</p>
            </div>

            <div className="product-detail-pricing">
              <h3>Precio</h3>
              <div className="pricing-info">
                <span className="final-price">
                  {formatPrice(producto.precio_por_dia)}
                </span>
                <span className="price-period">/día</span>
              </div>
              {hasDeposit && (
                <p className="deposit-info">
                  Requiere depósito: {formatPrice(producto.deposito_cantidad)}
                </p>
              )}
            </div>

            {/* Especificaciones */}
            {(producto.dimensiones ||
              producto.peso ||
              producto.especificaciones) && (
              <div className="product-detail-specs">
                <h3>Especificaciones</h3>
                <div className="specs-grid">
                  {producto.dimensiones && (
                    <div className="spec-item">
                      <span className="spec-label">Dimensiones:</span>
                      <span className="spec-value">{producto.dimensiones}</span>
                    </div>
                  )}
                  {producto.peso && (
                    <div className="spec-item">
                      <span className="spec-label">Peso:</span>
                      <span className="spec-value">{producto.peso} kg</span>
                    </div>
                  )}
                  {producto.especificaciones && (
                    <div className="spec-item full-width">
                      <span className="spec-label">Detalles:</span>
                      <span className="spec-value">
                        {producto.especificaciones}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stock */}
            <div className="product-detail-stock">
              <h3>Disponibilidad</h3>
              <div className="stock-info">
                <span
                  className={`stock-badge ${
                    isOutOfStock ? "out-of-stock" : "in-stock"
                  }`}
                >
                  {isOutOfStock
                    ? "Sin stock"
                    : `${producto.stock_disponible} disponibles`}
                </span>
                <span className="stock-total">
                  Stock total: {producto.stock_total}
                </span>
              </div>
            </div>

            <div className="product-detail-actions">
              <button
                className="product-detail-btn primary"
                onClick={handleRentar}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? "No Disponible" : "Rentar Ahora"}
              </button>
              <button
                className="product-detail-btn secondary"
                onClick={handleAddToFavorites}
                disabled={isOutOfStock}
              >
                ❤️ Agregar a Favoritos
              </button>
              <button
                className="product-detail-btn outline"
                onClick={handleContactForQuote}
              >
                📞 Contactar para más info
              </button>
            </div>

            {/* Información adicional */}
            <div className="product-detail-metadata">
              <p className="product-status">
                Estado:{" "}
                <span
                  className={
                    producto.estado === "disponible" ? "active" : "inactive"
                  }
                >
                  {producto.estado === "disponible"
                    ? "Disponible"
                    : producto.estado}
                </span>
              </p>
              {producto.fecha_creacion && (
                <p className="product-created">
                  Disponible desde:{" "}
                  {new Date(producto.fecha_creacion).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Login */}
      {showLoginModal && (
        <div className="login-modal-overlay" onClick={handleCloseModal}>
          <div
            className="login-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="login-modal-close" onClick={handleCloseModal}>
              ✕
            </button>

            <h2 className="login-modal-title">Inicia Sesión</h2>
            <p className="login-modal-message">
              Para realizar esta acción necesitas iniciar sesión primero
            </p>

            <div className="login-modal-actions">
              <button
                className="login-modal-btn primary"
                onClick={handleGoToLogin}
              >
                Iniciar Sesión
              </button>
              <button
                className="login-modal-btn secondary"
                onClick={handleGoToRegister}
              >
                Crear Cuenta
              </button>
            </div>

            <button className="login-modal-cancel" onClick={handleCloseModal}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
