USE pantrack;

-- Tabla de pedidos
CREATE TABLE pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id INT NOT NULL,
    sucursal_id INT DEFAULT NULL,
    usuario_id INT NOT NULL,
    fecha DATE NOT NULL,
    estado ENUM('solicitado', 'listo para entregar a ruta', 'en ruta', 'entregado') DEFAULT 'solicitado',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (sucursal_id) REFERENCES sucursales(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla de detalle de pedidos
CREATE TABLE pedido_detalle (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    presentacion_id INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (presentacion_id) REFERENCES presentaciones(id)
);

-- Datos de ejemplo
INSERT INTO pedidos (cliente_id, usuario_id, fecha, observaciones) 
VALUES (1, 2, CURDATE(), 'Pedido de prueba');

INSERT INTO pedido_detalle (pedido_id, producto_id, presentacion_id, cantidad)
VALUES (1, 1, 1, 2);