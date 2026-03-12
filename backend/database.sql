-- =====================================================
-- BASE DE DATOS: MI VAQUITA - SUPABASE POSTGRESQL
-- Ejecutar este SQL en el SQL Editor de Supabase
-- =====================================================

-- ------------------------------------------------------------
-- TABLA: productos
-- ------------------------------------------------------------
CREATE TABLE productos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    imagen TEXT,
    categoria VARCHAR(100) DEFAULT 'general',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------
-- TABLA: pedidos
-- ------------------------------------------------------------
CREATE TABLE pedidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_cliente VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente',
    turno INTEGER,
    total DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------
-- TABLA: pedido_items
-- ------------------------------------------------------------
CREATE TABLE pedido_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id UUID NOT NULL REFERENCES productos(id),
    cantidad INTEGER NOT NULL DEFAULT 1,
    precio DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------
-- TABLA: turnos
-- ------------------------------------------------------------
CREATE TABLE turnos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero INTEGER NOT NULL UNIQUE,
    pedido_id UUID REFERENCES pedidos(id) ON DELETE SET NULL,
    estado VARCHAR(50) DEFAULT 'activo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- ------------------------------------------------------------
CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_productos_activo ON productos(activo);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_pedidos_created_at ON pedidos(created_at);
CREATE INDEX idx_pedido_items_pedido_id ON pedido_items(pedido_id);
CREATE INDEX idx_turnos_estado ON turnos(estado);
CREATE INDEX idx_turnos_numero ON turnos(numero);

-- ------------------------------------------------------------
-- DATOS DE EJEMPLO (SEED)
-- ------------------------------------------------------------

-- Insertar productos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, imagen, categoria) VALUES
('Cupcake de Chocolate', 'Delicioso cupcake de chocolate con cobertura de crema', 6000, 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400', 'cupcakes'),
('Cupcake de Vainilla', 'Cupcake de vainilla con crema de mantequilla', 5500, 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400', 'cupcakes'),
('Cupcake de Fresa', 'Cupcake de fresa con cobertura rosa', 5500, 'https://images.unsplash.com/photo-1486427944544-d2c6128c6229?w=400', 'cupcakes'),
('Cupcake Red Velvet', 'Cupcake Red Velvet con queso crema', 6500, 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400', 'cupcakes'),
('Torta de Chocolate', 'Torta de chocolate capas con ganache', 25000, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', 'tortas'),
('Torta de Vainilla', 'Torta de vainilla con relleno de crema', 22000, 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400', 'tortas'),
('Torta de Red Velvet', 'Torta roja con queso crema', 28000, 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=400', 'tortas'),
('Torta de Zanahoria', 'Torta de zanahoria con nueces', 24000, 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400', 'tortas'),
('Galletas de Chocolate', 'Pack de 6 galletas con chispas de chocolate', 8000, 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400', 'galletas'),
('Galletas de Avena', 'Pack de 6 galletas de avena con pasas', 7500, 'https://images.unsplash.com/photo-1490567674924-0e9567e5e3a3?w=400', 'galletas'),
('Brownie', 'Brownie de chocolate con nueces', 4500, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400', 'otros'),
('Cheesecake', 'Cheesecake de fresa casero', 15000, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400', 'tortas'),
('Donas Glaseadas', 'Pack de 4 donas glaseadas', 10000, 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400', 'otros'),
('Paletas de Chocolate', 'Pack de 4 paletas de chocolate', 12000, 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400', 'otros'),
('Mini Postres', 'Pack de 6 mini postres variados', 18000, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', 'otros');
