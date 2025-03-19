USE pantrack;

-- Tabla de categorías
CREATE TABLE categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de unidades de medida
CREATE TABLE unidades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    simbolo VARCHAR(10) NOT NULL,
    descripcion TEXT,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    categoria_id INT NOT NULL,
    unidad_base_id INT NOT NULL,
    precio_base DECIMAL(10,2) NOT NULL CHECK (precio_base >= 0),
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    FOREIGN KEY (unidad_base_id) REFERENCES unidades(id)
);

-- Tabla de conversiones entre unidades
CREATE TABLE conversion_unidades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    producto_id INT NOT NULL,
    unidad_origen_id INT NOT NULL,
    unidad_destino_id INT NOT NULL,
    factor_conversion DECIMAL(10,4) NOT NULL CHECK (factor_conversion > 0),
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (unidad_origen_id) REFERENCES unidades(id),
    FOREIGN KEY (unidad_destino_id) REFERENCES unidades(id),
    UNIQUE KEY unique_conversion (producto_id, unidad_origen_id, unidad_destino_id)
);

-- Tabla de presentaciones
CREATE TABLE presentaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de relación productos-presentaciones
CREATE TABLE producto_presentacion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    producto_id INT NOT NULL,
    presentacion_id INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (presentacion_id) REFERENCES presentaciones(id),
    UNIQUE KEY unique_producto_presentacion (producto_id, presentacion_id)
);

-- Datos de ejemplo
INSERT INTO categorias (nombre, descripcion) VALUES 
('Panes', 'Productos de panadería básica'),
('Pasteles', 'Productos de pastelería'),
('Repostería', 'Productos de repostería fina');

INSERT INTO unidades (nombre, simbolo, descripcion) VALUES 
('Unidad', 'u', 'Unidad individual'),
('Libra', 'lb', 'Libra de masa'),
('Lata', 'lt', 'Lata de horneo'),
('Arroba', '@', 'Arroba de masa');

-- Insertar producto de ejemplo: Pan Francés
INSERT INTO productos (codigo, nombre, descripcion, categoria_id, unidad_base_id, precio_base) VALUES 
('PF001', 'Pan Francés', 'Pan francés tradicional', 1, 1, 0.25);

-- Insertar conversiones para Pan Francés
INSERT INTO conversion_unidades (producto_id, unidad_origen_id, unidad_destino_id, factor_conversion) VALUES 
(1, 1, 2, 0.05),    -- 1 unidad usa 0.05 libras de masa
(1, 3, 1, 20),      -- 1 lata contiene 20 unidades
(1, 2, 4, 0.04);    -- 1 libra = 0.04 arrobas (25 libras = 1 arroba)

-- Insertar presentaciones
INSERT INTO presentaciones (nombre, descripcion) VALUES 
('Bolsa 4 unidades', 'Bolsa con 4 panes'),
('Bolsa 10 unidades', 'Bolsa con 10 panes'),
('Caja 20 unidades', 'Caja con 20 panes');

-- Relacionar Pan Francés con sus presentaciones
INSERT INTO producto_presentacion (producto_id, presentacion_id, cantidad, precio) VALUES 
(1, 1, 4, 0.90),    -- Bolsa de 4 unidades
(1, 2, 10, 2.20),   -- Bolsa de 10 unidades
(1, 3, 20, 4.00);   -- Caja de 20 unidades