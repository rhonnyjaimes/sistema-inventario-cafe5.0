-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-02-2025 a las 20:31:27
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
-- Estructura de tabla para la tabla `alertas`
--

CREATE TABLE `alertas` (
  `id_alerta` int(11) NOT NULL,
  `tipo` enum('stock_bajo','caducidad_proxima') NOT NULL,
  `mensaje` text NOT NULL,
  `fecha` date NOT NULL,
  `resuelta` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `contacto` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empaques`
--

CREATE TABLE `empaques` (
  `id_empaque` int(11) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `material` varchar(50) NOT NULL,
  `stock` int(11) NOT NULL,
  `stock_minimo` int(11) NOT NULL,
  `id_proveedor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Disparadores `empaques`
--
DELIMITER $$
CREATE TRIGGER `alerta_stock_bajo` AFTER UPDATE ON `empaques` FOR EACH ROW BEGIN
  IF NEW.stock < NEW.stock_minimo THEN
    INSERT INTO Alertas (tipo, mensaje, fecha)
    VALUES ('stock_bajo', CONCAT('¡Stock crítico en empaque ', NEW.id_empaque, '! Contactar al proveedor.'), CURDATE());
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `granos`
--

CREATE TABLE `granos` (
  `id_grano` int(11) NOT NULL,
  `origen` varchar(50) NOT NULL,
  `variedad` varchar(50) NOT NULL,
  `cantidad_kg` decimal(10,2) NOT NULL,
  `fecha_caducidad` date NOT NULL,
  `id_proveedor` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lotesmolido`
--

CREATE TABLE `lotesmolido` (
  `id_lote_molido` int(11) NOT NULL,
  `tipo_molido` enum('fino','medio','grueso') NOT NULL,
  `cantidad_procesada_kg` decimal(10,2) NOT NULL,
  `fecha` date NOT NULL,
  `id_lote_tostado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lotestostado`
--

CREATE TABLE `lotestostado` (
  `id_lote_tostado` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `temperatura` decimal(5,2) NOT NULL,
  `perdida_peso` decimal(5,2) NOT NULL,
  `peso_inicial_kg` decimal(10,2) NOT NULL,
  `peso_final_kg` decimal(10,2) GENERATED ALWAYS AS (`peso_inicial_kg` * (1 - `perdida_peso` / 100)) STORED,
  `id_grano` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id_pedido` int(11) NOT NULL,
  `fecha_pedido` date NOT NULL,
  `fecha_entrega` date NOT NULL,
  `cantidad` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productosterminados`
--

CREATE TABLE `productosterminados` (
  `id_producto` int(11) NOT NULL,
  `presentacion` enum('250g','500g','1kg') NOT NULL,
  `cantidad_paquetes` int(11) NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `id_lote_molido` int(11) NOT NULL,
  `id_empaque` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id_proveedor` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `contacto` varchar(100) NOT NULL,
  `historial_compras` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 'Juan Pérez', 'juan@example.com', '$2b$10$SPM3KORUQVQfZlc55bS5ue4vh7.PhaGAi.n2WxeUu/mNPSBEodZFO', 'operario'),
(2, 'Prueba', 'prueba@gmail.com', '$2b$10$Prf12PMXUNQLBJYZT10qRuYxQWSoFiC1N94nL/AeqXsZxuVkMTxVi', 'supervisor'),
(4, 'Prueba', 'rhonnyjaimes2002@gmail.com', '$2b$10$K7r8QmTAA.pUvlvY8wO/leGvMFJWFXAbse5w6LBCIRPybUcA0142i', 'operario'),
(5, 'PRUEBAAA', 'pruebAAAAAa@gmail.com', '$2b$10$t002etZog2DRZaphKpim7./FOGkEpFFrGPMYyILw8siVKC6OK6ROy', 'supervisor');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alertas`
--
ALTER TABLE `alertas`
  ADD PRIMARY KEY (`id_alerta`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`);

--
-- Indices de la tabla `empaques`
--
ALTER TABLE `empaques`
  ADD PRIMARY KEY (`id_empaque`),
  ADD KEY `id_proveedor` (`id_proveedor`);

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
  ADD KEY `id_cliente` (`id_cliente`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `productosterminados`
--
ALTER TABLE `productosterminados`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `id_lote_molido` (`id_lote_molido`),
  ADD KEY `id_empaque` (`id_empaque`);

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
-- AUTO_INCREMENT de la tabla `alertas`
--
ALTER TABLE `alertas`
  MODIFY `id_alerta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `empaques`
--
ALTER TABLE `empaques`
  MODIFY `id_empaque` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `granos`
--
ALTER TABLE `granos`
  MODIFY `id_grano` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `lotesmolido`
--
ALTER TABLE `lotesmolido`
  MODIFY `id_lote_molido` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `lotestostado`
--
ALTER TABLE `lotestostado`
  MODIFY `id_lote_tostado` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productosterminados`
--
ALTER TABLE `productosterminados`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id_proveedor` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `empaques`
--
ALTER TABLE `empaques`
  ADD CONSTRAINT `empaques_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`);

--
-- Filtros para la tabla `granos`
--
ALTER TABLE `granos`
  ADD CONSTRAINT `granos_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`);

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
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  ADD CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productosterminados` (`id_producto`);

--
-- Filtros para la tabla `productosterminados`
--
ALTER TABLE `productosterminados`
  ADD CONSTRAINT `productosterminados_ibfk_1` FOREIGN KEY (`id_lote_molido`) REFERENCES `lotesmolido` (`id_lote_molido`),
  ADD CONSTRAINT `productosterminados_ibfk_2` FOREIGN KEY (`id_empaque`) REFERENCES `empaques` (`id_empaque`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
