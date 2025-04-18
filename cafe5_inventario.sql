-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-04-2025 a las 06:27:31
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `cafe5_inventario`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `granos`
--

CREATE TABLE `granos` (
  `id_grano` int(11) NOT NULL,
  `origen` varchar(100) NOT NULL,
  `cantidad_kg` decimal(10,2) NOT NULL,
  `fecha_despacho` date NOT NULL,
  `fecha_caducidad` date NOT NULL,
  `id_proveedor` int(11) NOT NULL,
  `lote_pagado` tinyint(1) NOT NULL DEFAULT 0,
  `metodo_pago` varchar(50) NOT NULL DEFAULT 'Pago Pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `granos`
--

INSERT INTO `granos` (`id_grano`, `origen`, `cantidad_kg`, `fecha_despacho`, `fecha_caducidad`, `id_proveedor`, `lote_pagado`, `metodo_pago`) VALUES
(6, 'Caracas', 0.00, '2024-02-29', '2024-08-31', 1, 1, 'Transferencia Bancaria'),
(11, 'Caracas', 0.00, '2025-03-25', '2025-12-31', 1, 0, 'Pago Pendiente'),
(12, 'Valencia', 0.00, '2025-03-25', '2025-07-31', 2, 0, 'Efectivo'),
(13, 'Valencia', 20.00, '2025-03-31', '2025-06-30', 2, 0, 'Pagp Pendiente'),
(14, 'Trujillo', 50.00, '2025-03-31', '2025-03-31', 5, 0, 'Pago Pendiente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lotesmolido`
--

CREATE TABLE `lotesmolido` (
  `id_lote_molido` int(11) NOT NULL,
  `tipo_molido` varchar(20) NOT NULL CHECK (`tipo_molido` in ('fino','medio','grueso')),
  `cantidad_procesada_kg` decimal(10,2) NOT NULL,
  `fecha` date NOT NULL,
  `tiempo_produccion` time NOT NULL,
  `id_lote_tostado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `lotesmolido`
--

INSERT INTO `lotesmolido` (`id_lote_molido`, `tipo_molido`, `cantidad_procesada_kg`, `fecha`, `tiempo_produccion`, `id_lote_tostado`) VALUES
(3, 'medio', 0.00, '2025-03-25', '01:30:00', 7),
(4, 'medio', 0.00, '2025-03-25', '01:30:00', 7),
(5, 'medio', 10.00, '2025-04-06', '14:00:00', 6),
(6, 'medio', 40.00, '2025-04-06', '01:27:00', 8);

--
-- Disparadores `lotesmolido`
--
DELIMITER $$
CREATE TRIGGER `before_lotesmolido_insert` BEFORE INSERT ON `lotesmolido` FOR EACH ROW BEGIN
    DECLARE stock_tostado DECIMAL(10,2);

    -- Obtener stock del lote tostado
    SELECT cantidad_disponible_kg 
    INTO stock_tostado
    FROM lotestostado 
    WHERE id_lote_tostado = NEW.id_lote_tostado;

    -- Validar stock suficiente
    IF stock_tostado < NEW.cantidad_procesada_kg THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Stock insuficiente en lote tostado para este molido';
    END IF;

    -- Actualizar stock de lote tostado
    UPDATE lotestostado 
    SET cantidad_disponible_kg = cantidad_disponible_kg - NEW.cantidad_procesada_kg
    WHERE id_lote_tostado = NEW.id_lote_tostado;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lotestostado`
--

CREATE TABLE `lotestostado` (
  `id_lote_tostado` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `temperatura` decimal(10,2) NOT NULL,
  `peso_inicial_kg` decimal(10,2) NOT NULL,
  `perdida_peso` decimal(10,2) GENERATED ALWAYS AS (`peso_inicial_kg` - `peso_final_kg`) VIRTUAL,
  `peso_final_kg` decimal(10,2) NOT NULL,
  `cantidad_disponible_kg` decimal(10,2) NOT NULL,
  `fecha_caducidad` date NOT NULL,
  `id_grano` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `lotestostado`
--

INSERT INTO `lotestostado` (`id_lote_tostado`, `fecha`, `temperatura`, `peso_inicial_kg`, `peso_final_kg`, `cantidad_disponible_kg`, `fecha_caducidad`, `id_grano`) VALUES
(6, '2025-03-25', 200.00, 80.00, 45.00, 35.00, '2024-08-31', 6),
(7, '2025-03-25', 200.00, 100.00, 80.00, 10.00, '2025-12-31', 11),
(8, '2025-03-25', 200.00, 50.00, 45.00, 5.00, '2024-08-31', 6);

--
-- Disparadores `lotestostado`
--
DELIMITER $$
CREATE TRIGGER `after_lotestostado_insert` BEFORE INSERT ON `lotestostado` FOR EACH ROW BEGIN
    DECLARE stock_grano DECIMAL(10,2);
    DECLARE fecha_cad_grano DATE;

    -- Obtener stock y fecha de caducidad del grano
    SELECT cantidad_kg, fecha_caducidad 
    INTO stock_grano, fecha_cad_grano
    FROM granos 
    WHERE id_grano = NEW.id_grano;

    -- Validar stock suficiente
    IF stock_grano < NEW.peso_inicial_kg THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Stock insuficiente en granos para este lote tostado';
    END IF;

    -- Establecer valores automáticos
    SET NEW.fecha_caducidad = COALESCE(fecha_cad_grano, CURDATE() + INTERVAL 1 YEAR);
    SET NEW.cantidad_disponible_kg = NEW.peso_final_kg;
    
    -- Actualizar stock de granos
    UPDATE granos 
    SET cantidad_kg = cantidad_kg - NEW.peso_inicial_kg
    WHERE id_grano = NEW.id_grano;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id_pedido` int(11) NOT NULL,
  `fecha_pedido` date NOT NULL,
  `fecha_entrega` date NOT NULL,
  `cantidad_paquetes` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `estado_pago` enum('pendiente','cobrado') NOT NULL DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id_pedido`, `fecha_pedido`, `fecha_entrega`, `cantidad_paquetes`, `id_producto`, `estado_pago`) VALUES
(2, '2025-04-06', '2025-04-09', 5, 2, 'pendiente'),
(3, '2025-04-07', '2025-04-08', 2, 1, 'pendiente'),
(4, '2025-04-07', '2025-04-09', 2, 9, 'cobrado'),
(5, '2025-04-07', '2025-04-09', 8, 1, 'cobrado');

--
-- Disparadores `pedidos`
--
DELIMITER $$
CREATE TRIGGER `before_pedido_insert` BEFORE INSERT ON `pedidos` FOR EACH ROW BEGIN
    DECLARE stock_paquetes INT;
    DECLARE producto_existente BOOLEAN;

    -- Verificar si el producto existe
    SELECT EXISTS (
        SELECT 1 
        FROM productosterminados 
        WHERE id_producto = NEW.id_producto
    ) INTO producto_existente;

    IF NOT producto_existente THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: El producto no existe en inventario';
    END IF;

    -- Obtener stock actual del producto (y bloquear la fila para evitar concurrencia)
    SELECT cantidad_paquetes 
    INTO stock_paquetes
    FROM productosterminados 
    WHERE id_producto = NEW.id_producto
    FOR UPDATE;

    -- Validar stock suficiente
    IF stock_paquetes < NEW.cantidad_paquetes THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Stock insuficiente';
    END IF;

    -- Restar paquetes del producto terminado
    UPDATE productosterminados 
    SET cantidad_paquetes = cantidad_paquetes - NEW.cantidad_paquetes 
    WHERE id_producto = NEW.id_producto;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productosterminados`
--

CREATE TABLE `productosterminados` (
  `id_producto` int(11) NOT NULL,
  `id_lote_molido` int(11) NOT NULL,
  `presentacion` enum('0.25','0.5','1') NOT NULL,
  `cantidad_paquetes` int(11) NOT NULL,
  `fecha_vencimiento` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productosterminados`
--

INSERT INTO `productosterminados` (`id_producto`, `id_lote_molido`, `presentacion`, `cantidad_paquetes`, `fecha_vencimiento`) VALUES
(1, 3, '0.5', 0, '2025-12-31'),
(2, 4, '0.5', 0, '2025-12-31'),
(4, 4, '0.5', 10, '2025-12-31'),
(5, 4, '0.5', 10, '2025-12-31'),
(6, 4, '0.5', 10, '2025-12-31'),
(8, 4, '0.25', 4, '2025-12-31'),
(9, 4, '1', 2, '2025-12-31');

--
-- Disparadores `productosterminados`
--
DELIMITER $$
CREATE TRIGGER `before_productoterminado_insert` BEFORE INSERT ON `productosterminados` FOR EACH ROW BEGIN
    DECLARE kg_necesarios DECIMAL(10,2);
    DECLARE stock_actual DECIMAL(10,2);
    DECLARE fecha_caducidad_tostado DATE;
    DECLARE valor_presentacion DECIMAL(3,2);

    -- Obtener el valor decimal real del ENUM
    SET valor_presentacion = 
        CASE NEW.presentacion
            WHEN '0.25' THEN 0.25
            WHEN '0.5' THEN 0.50
            WHEN '1' THEN 1.00
        END;

    -- Obtener fecha de caducidad del lote tostado
    SELECT lt.fecha_caducidad 
    INTO fecha_caducidad_tostado
    FROM lotesmolido lm
    JOIN lotestostado lt ON lm.id_lote_tostado = lt.id_lote_tostado
    WHERE lm.id_lote_molido = NEW.id_lote_molido;

    -- Establecer fecha de vencimiento
    SET NEW.fecha_vencimiento = COALESCE(fecha_caducidad_tostado, DATE_ADD(CURDATE(), INTERVAL 6 MONTH));

    -- Calcular kg necesarios usando el valor real
    SET kg_necesarios = NEW.cantidad_paquetes * valor_presentacion;

    -- Obtener stock actual del lote molido
    SELECT cantidad_procesada_kg 
    INTO stock_actual 
    FROM lotesmolido 
    WHERE id_lote_molido = NEW.id_lote_molido;

    -- Validar stock
    IF stock_actual < kg_necesarios THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Stock insuficiente en lote molido';
    END IF;

    -- Actualizar stock
    UPDATE lotesmolido 
    SET cantidad_procesada_kg = cantidad_procesada_kg - kg_necesarios
    WHERE id_lote_molido = NEW.id_lote_molido;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id_proveedor` int(11) NOT NULL,
  `nombre_empresa` varchar(100) NOT NULL,
  `documento` varchar(20) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `ubicacion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`id_proveedor`, `nombre_empresa`, `documento`, `correo`, `telefono`, `ubicacion`) VALUES
(1, 'Cafe Caracas', 'J-123456789', 'CAFE@CARACAS.COM', '4125551234', 'Caracas, Venezuela'),
(2, 'Cafe Valencia', 'J-987654321', 'info@electroparts.com', '4245556789', 'Valencia, Venezuela'),
(5, 'Cafe Trujillo', 'J-1231521', 'Cafe@trujillo.com', '4125551234', 'Trujillo, Venezuela'),
(7, 'Cafe Trujillo', 'J-123456', 'cafe@trujillo.com', '66357744232', 'Trujillo'),
(8, 'Valera Cafe', 'J-3435343', 'valera@cafe.com', '04143254234', 'Valera');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `rol` enum('operario','supervisor','gerente') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `email`, `contrasena`, `rol`) VALUES
(9, 'Admin', 'admin@admin.com', '$2b$10$lnr9rBJESnXCOJE9BZ7Xu.JpzVr.OVCtrZcj3MBAbICZXKSVwEJ/C', 'gerente');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `granos`
--
ALTER TABLE `granos`
  ADD PRIMARY KEY (`id_grano`),
  ADD KEY `id_proveedor` (`id_proveedor`);

--
-- Indices de la tabla `lotesmolido`
--
ALTER TABLE `lotesmolido`
  ADD PRIMARY KEY (`id_lote_molido`),
  ADD KEY `id_lote_tostado` (`id_lote_tostado`);

--
-- Indices de la tabla `lotestostado`
--
ALTER TABLE `lotestostado`
  ADD PRIMARY KEY (`id_lote_tostado`),
  ADD KEY `id_grano` (`id_grano`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `pedidos_ibfk_1` (`id_producto`);

--
-- Indices de la tabla `productosterminados`
--
ALTER TABLE `productosterminados`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `id_lote_molido` (`id_lote_molido`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id_proveedor`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `granos`
--
ALTER TABLE `granos`
  MODIFY `id_grano` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `lotesmolido`
--
ALTER TABLE `lotesmolido`
  MODIFY `id_lote_molido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `lotestostado`
--
ALTER TABLE `lotestostado`
  MODIFY `id_lote_tostado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `productosterminados`
--
ALTER TABLE `productosterminados`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id_proveedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `granos`
--
ALTER TABLE `granos`
  ADD CONSTRAINT `granos_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`) ON DELETE CASCADE;

--
-- Filtros para la tabla `lotesmolido`
--
ALTER TABLE `lotesmolido`
  ADD CONSTRAINT `lotesmolido_ibfk_1` FOREIGN KEY (`id_lote_tostado`) REFERENCES `lotestostado` (`id_lote_tostado`);

--
-- Filtros para la tabla `lotestostado`
--
ALTER TABLE `lotestostado`
  ADD CONSTRAINT `lotestostado_ibfk_1` FOREIGN KEY (`id_grano`) REFERENCES `granos` (`id_grano`);

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productosterminados` (`id_producto`) ON DELETE CASCADE;

--
-- Filtros para la tabla `productosterminados`
--
ALTER TABLE `productosterminados`
  ADD CONSTRAINT `productosterminados_ibfk_1` FOREIGN KEY (`id_lote_molido`) REFERENCES `lotesmolido` (`id_lote_molido`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
