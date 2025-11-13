-- Crear tabla de tarjetas de usuario
USE kabe_rental_system;

CREATE TABLE IF NOT EXISTS tarjetas_usuario (
    tarjeta_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo_tarjeta ENUM('credito', 'debito') NOT NULL,
    marca ENUM('visa', 'mastercard', 'amex', 'otro') NOT NULL,
    ultimos_digitos VARCHAR(4) NOT NULL,
    nombre_titular VARCHAR(200) NOT NULL,
    mes_expiracion INT NOT NULL,
    anio_expiracion INT NOT NULL,
    es_predeterminada BOOLEAN DEFAULT FALSE,
    token_pasarela VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    activa BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_activa (activa),
    INDEX idx_predeterminada (es_predeterminada)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tarjetas guardadas de usuarios';

SELECT 'Tabla tarjetas_usuario creada exitosamente' AS resultado;
