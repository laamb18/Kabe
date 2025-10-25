// Utilidad para mostrar notificaciones de éxito
export const showSuccessMessage = (message) => {
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.className = 'success-notification';
  notification.innerHTML = `
    <div class="success-content">
      <span class="success-icon">✅</span>
      <span class="success-text">${message}</span>
    </div>
  `;
  
  // Agregar estilos
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);
    z-index: 10000;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
    max-width: 400px;
    word-wrap: break-word;
  `;
  
  // Agregar al DOM
  document.body.appendChild(notification);
  
  // Mostrar con animación
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remover después de 4 segundos
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 4000);
};

// Utilidad para mostrar notificaciones de error
export const showErrorMessage = (message) => {
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.className = 'error-notification';
  notification.innerHTML = `
    <div class="error-content">
      <span class="error-icon">❌</span>
      <span class="error-text">${message}</span>
    </div>
  `;
  
  // Agregar estilos
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #f44336, #d32f2f);
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(244, 67, 54, 0.3);
    z-index: 10000;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
    max-width: 400px;
    word-wrap: break-word;
  `;
  
  // Agregar al DOM
  document.body.appendChild(notification);
  
  // Mostrar con animación
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remover después de 5 segundos
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 5000);
};

// Alias para compatibilidad
export const showSuccessNotification = showSuccessMessage;
export const showErrorNotification = showErrorMessage;
