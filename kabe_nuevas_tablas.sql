-- ============================================
-- NUEVAS TABLAS PARA K'ABÉ RENTAL SYSTEM
-- Sistema de Eventos, Carritos y Métodos de Pago
-- ============================================

USE kabe_rental_system;

-- ============================================
-- 1. TABLA: eventos
-- Gestión de eventos de usuarios
-- ============================================
CREATE TABLE IF NOT EXISTS eventos (
    evento_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    nombre_evento VARCHAR(200) NOT NULL,
    tipo_evento VARCHAR(100) COMMENT 'Boda, Cumpleaños, Corporativo, etc.',
    fecha_evento DATE NOT NULL,
    hora_inicio TIME,
    hora_fin TIME,
    ubicacion VARCHAR(300),
    direccion_evento TEXT,
    numero_personas INT,
    descripcion TEXT,
    estado ENUM('borrador', 'confirmado', 'en_proceso', 'completado', 'cancelado') DEFAULT 'borrador',
    notas_especiales TEXT,
    presupuesto_estimado DECIMAL(12,2),
    total_final DECIMAL(12,2),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    INDEX idx_usuario (usuario_id),
    INDEX idx_fecha_evento (fecha_evento),
    INDEX idx_estado (estado),
    INDEX idx_tipo_evento (tipo_evento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Eventos programados por usuarios';

-- ============================================
-- 2. TABLA: evento_productos
-- Productos asociados a eventos
-- ============================================
CREATE TABLE IF NOT EXISTS evento_productos (
    evento_producto_id INT PRIMARY KEY AUTO_INCREMENT,
    evento_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    fecha_inicio_renta DATE,
    fecha_fin_renta DATE,
    dias_renta INT,
    
    FOREIGN KEY (evento_id) REFERENCES eventos(evento_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(producto_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    INDEX idx_evento (evento_id),
    INDEX idx_producto (producto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Productos incluidos en eventos';

-- ============================================
-- 3. TABLA: evento_paquetes
-- Paquetes asociados a eventos
-- ============================================
CREATE TABLE IF NOT EXISTS evento_paquetes (
    evento_paquete_id INT PRIMARY KEY AUTO_INCREMENT,
    evento_id INT NOT NULL,
    paquete_id INT NOT NULL,
    cantidad INT DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL,
    descuento_aplicado DECIMAL(5,2),
    subtotal DECIMAL(12,2) NOT NULL,
    fecha_inicio_renta DATE,
    fecha_fin_renta DATE,
    dias_renta INT,
    
    FOREIGN KEY (evento_id) REFERENCES eventos(evento_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (paquete_id) REFERENCES paquetes(paquete_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    INDEX idx_evento (evento_id),
    INDEX idx_paquete (paquete_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Paquetes incluidos en eventos';

-- ============================================
-- 4. TABLA: carritos
-- Carrito de compras por usuario
-- ============================================
CREATE TABLE IF NOT EXISTS carritos (
    carrito_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    sesion_id VARCHAR(100) COMMENT 'Para usuarios no autenticados',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP COMMENT 'Carritos expiran después de X días',
    estado ENUM('activo', 'convertido', 'abandonado', 'expirado') DEFAULT 'activo',
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    INDEX idx_usuario (usuario_id),
    INDEX idx_sesion (sesion_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha_expiracion (fecha_expiracion),
    UNIQUE KEY unique_user_active_cart (usuario_id, estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Carritos de compra de usuarios';

-- ============================================
-- 5. TABLA: carrito_items
-- Items en el carrito
-- ============================================
CREATE TABLE IF NOT EXISTS carrito_items (
    carrito_item_id INT PRIMARY KEY AUTO_INCREMENT,
    carrito_id INT NOT NULL,
    producto_id INT,
    paquete_id INT,
    cantidad INT NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL,
    fecha_inicio_renta DATE,
    fecha_fin_renta DATE,
    dias_renta INT,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (carrito_id) REFERENCES carritos(carrito_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(producto_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (paquete_id) REFERENCES paquetes(paquete_id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    CHECK (producto_id IS NOT NULL OR paquete_id IS NOT NULL),
    
    INDEX idx_carrito (carrito_id),
    INDEX idx_producto (producto_id),
    INDEX idx_paquete (paquete_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Items individuales en carritos';

-- ============================================
-- 6. TABLA: metodos_pago
-- Métodos de pago guardados por usuario
-- ============================================
CREATE TABLE IF NOT EXISTS metodos_pago (
    metodo_pago_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo_metodo ENUM('tarjeta_credito', 'tarjeta_debito', 'transferencia', 'efectivo', 'otro') NOT NULL,
    nombre_titular VARCHAR(200),
    ultimos_4_digitos VARCHAR(4) COMMENT 'Solo últimos 4 dígitos por seguridad',
    marca_tarjeta VARCHAR(50) COMMENT 'Visa, Mastercard, etc.',
    mes_expiracion INT,
    anio_expiracion INT,
    es_predeterminado BOOLEAN DEFAULT FALSE,
    token_pasarela VARCHAR(255) COMMENT 'Token de la pasarela de pagos (NO guardar datos completos)',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    INDEX idx_usuario (usuario_id),
    INDEX idx_activo (activo),
    INDEX idx_predeterminado (es_predeterminado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Métodos de pago guardados de usuarios';

-- ============================================
-- 7. TABLA: historial_usuario
-- Actividad del usuario
-- ============================================
CREATE TABLE IF NOT EXISTS historial_usuario (
    historial_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo_actividad ENUM(
        'evento_creado', 'evento_modificado', 'evento_cancelado', 
        'pago_realizado', 'pago_rechazado', 'carrito_creado', 
        'producto_agregado', 'producto_removido', 'reserva_confirmada',
        'devolucion_realizada', 'perfil_actualizado'
    ) NOT NULL,
    descripcion TEXT,
    evento_id INT,
    pago_id INT,
    carrito_id INT,
    solicitud_id INT,
    monto DECIMAL(12,2),
    metadata JSON COMMENT 'Datos adicionales en formato JSON',
    fecha_actividad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (evento_id) REFERENCES eventos(evento_id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (pago_id) REFERENCES pagos(pago_id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (carrito_id) REFERENCES carritos(carrito_id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (solicitud_id) REFERENCES solicitudes(solicitud_id) ON DELETE SET NULL ON UPDATE CASCADE,
    
    INDEX idx_usuario_fecha (usuario_id, fecha_actividad),
    INDEX idx_tipo_actividad (tipo_actividad),
    INDEX idx_fecha (fecha_actividad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Historial de actividades de usuarios';

-- ============================================
-- 8. TABLA: notificaciones
-- Notificaciones para usuarios
-- ============================================
CREATE TABLE IF NOT EXISTS notificaciones (
    notificacion_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo ENUM('evento', 'pago', 'recordatorio', 'sistema', 'promocion') NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    evento_id INT,
    pago_id INT,
    leida BOOLEAN DEFAULT FALSE,
    fecha_leida TIMESTAMP NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (evento_id) REFERENCES eventos(evento_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (pago_id) REFERENCES pagos(pago_id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    INDEX idx_usuario_leida (usuario_id, leida),
    INDEX idx_tipo (tipo),
    INDEX idx_fecha (fecha_creacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Notificaciones para usuarios';

-- ============================================
-- MODIFICACIONES A TABLAS EXISTENTES
-- ============================================

-- Agregar columnas a la tabla pagos
ALTER TABLE pagos 
ADD COLUMN IF NOT EXISTS referencia_externa VARCHAR(200) COMMENT 'ID de transacción de pasarela de pagos',
ADD COLUMN IF NOT EXISTS comprobante_url VARCHAR(500) COMMENT 'URL del comprobante de pago',
ADD COLUMN IF NOT EXISTS ip_origen VARCHAR(50) COMMENT 'IP desde donde se realizó el pago',
ADD COLUMN IF NOT EXISTS notas_pago TEXT COMMENT 'Notas adicionales del pago',
ADD COLUMN IF NOT EXISTS metodo_pago_guardado_id INT COMMENT 'Referencia al método de pago guardado',
ADD COLUMN IF NOT EXISTS evento_id INT COMMENT 'Evento asociado al pago',
ADD COLUMN IF NOT EXISTS carrito_id INT COMMENT 'Carrito asociado al pago';

-- Agregar índices a pagos
ALTER TABLE pagos
ADD INDEX IF NOT EXISTS idx_referencia_externa (referencia_externa),
ADD INDEX IF NOT EXISTS idx_metodo_pago_guardado (metodo_pago_guardado_id),
ADD INDEX IF NOT EXISTS idx_evento (evento_id),
ADD INDEX IF NOT EXISTS idx_carrito (carrito_id);

-- Agregar foreign keys a pagos
ALTER TABLE pagos
ADD CONSTRAINT fk_pagos_metodo_pago FOREIGN KEY (metodo_pago_guardado_id) 
    REFERENCES metodos_pago(metodo_pago_id) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT fk_pagos_evento FOREIGN KEY (evento_id) 
    REFERENCES eventos(evento_id) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT fk_pagos_carrito FOREIGN KEY (carrito_id) 
    REFERENCES carritos(carrito_id) ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- ============================================

-- Ejemplo de evento
INSERT INTO eventos (usuario_id, nombre_evento, tipo_evento, fecha_evento, hora_inicio, numero_personas, estado)
VALUES (1, 'Boda de María y Juan', 'Boda', '2025-12-15', '18:00:00', 150, 'confirmado');

-- Ejemplo de notificación
INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje)
VALUES (1, 'sistema', 'Bienvenido a K\'abé', 'Gracias por registrarte en nuestro sistema de renta de eventos.');

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

SELECT 'Tablas creadas exitosamente' AS resultado;
