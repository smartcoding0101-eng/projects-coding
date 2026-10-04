-- Insertar categoria 6 (TIENDA PAQUITO) en BD local
INSERT IGNORE INTO `categorias` (`id`, `nombre`, `slug`, `descripcion`, `icono`, `color`, `orden`, `activa`, `created_at`, `updated_at`, `deleted_at`)
VALUES (6, 'TIENDA PAQUITO', 'tienda-paquito', 'VARIEDAD DE PRODUCTOS', NULL, NULL, 0, 1, '2026-09-26 17:00:34', '2026-09-26 17:00:48', NULL);

-- Insertar los 6 productos del servidor que faltan en local
INSERT IGNORE INTO `productos` (`id`, `categoria_id`, `codigo_sku`, `nombre`, `slug`, `descripcion`, `descripcion_larga`, `marca`, `modelo`, `serie`, `calibre`, `fecha_vencimiento`, `precio_general`, `precio_asociado`, `precio_credito`, `precio_costo`, `stock_actual`, `stock_minimo`, `imagen_path`, `observacion`, `activo`, `created_at`, `updated_at`, `deleted_at`) VALUES
(15, 6, '03', 'SAPOLIO', '5', 'Ambientador tipo espray sabor jardin de rosas', NULL, NULL, NULL, NULL, NULL, NULL, 17.00, 17.00, 16.00, 15.00, 3, 5, '["tienda/productos/01M3FX0R2Z8KQKG3G1JA5CV56T.jpg"]', NULL, 1, '2026-09-26 17:22:50', '2026-09-26 20:31:11', NULL),
(16, 6, '01', 'PAPEL', 'papel', 'PAPEL MARCA FINI FINESSE 6 ROLLOS DOBLE HOJA', NULL, 'NACIONAL', NULL, NULL, NULL, '2028-01-01', 13.00, 13.00, 13.00, 12.00, 6, 6, '["tienda/productos/01M3G0NA01B484BRCCWPF5MW7A.jpg"]', 'FAMILIAR', 1, '2026-09-26 18:26:29', '2026-09-26 18:26:29', NULL),
(17, 6, '02', 'SERVILLETAS', 'servilletas', 'SERVILLETAS SCOTT', NULL, 'SCOTT', 'BOLIVIANO', NULL, NULL, '2029-02-01', 3.50, 3.50, 4.00, 3.00, 0, 5, '["tienda/productos/01M3G10X178YW93KWJ66MJB8FA.jpg"]', 'SERVILLETAS SUPER ABSORBENTES', 1, '2026-09-26 18:32:49', '2026-09-26 18:32:49', NULL),
(18, 2, '1', 'CONJUNTO DE ROPA DEPORTIVA', 'conjunto-de-ropa-eportiva', 'PANTALON SHORD POLERA GORRA', NULL, NULL, NULL, NULL, NULL, NULL, 100.00, 100.00, 100.00, 100.00, 2, 5, '["tienda/productos/01M3G1M8145CG8Y4JK77FPSP3Y.jpg"]', 'Conjunto de shord polera gorra ropa combinada', 1, '2026-09-26 18:43:23', '2026-09-26 18:43:23', NULL),
(19, 2, '2', 'ROPA DE BARON', 'ropa-de-baron', 'PANTALON POLERA GORRA', NULL, NULL, NULL, NULL, NULL, NULL, 150.00, 150.00, 150.00, 140.00, 2, 5, '["tienda/productos/01M3G21ZMVH03TT961A73J0NXZ.jpg"]', 'CONJUNTO DE ROPA PARA BARON', 1, '2026-09-26 18:50:53', '2026-09-26 20:30:26', NULL),
(20, 6, '04', 'TODO BRILLO', 'todo-brillo', 'LIMPIEZA DE PISOS 4 EN 1', NULL, NULL, NULL, NULL, NULL, NULL, 15.00, 15.00, 15.00, 14.00, 4, 5, '["tienda/productos/01M3G76YJJG4RWT1EV02YM0N4C.jpg"]', 'LIMPIEZA DE PISO TODO BRILLO 4EN1', 1, '2026-09-26 20:20:59', '2026-09-26 20:20:59', NULL);

-- También agregar columnas GPS a pedidos locales (migración pendiente)
ALTER TABLE `pedidos`
    ADD COLUMN IF NOT EXISTS `gps_lat` decimal(10,8) NULL AFTER `direccion_envio`,
    ADD COLUMN IF NOT EXISTS `gps_lng` decimal(11,8) NULL AFTER `gps_lat`;

-- Verificar resultado
FROM productos ORDER BY id;

-- Actualización de colores de la Tienda Virtual (Verde Olivo #2B371D y Títulos Blancos)
UPDATE `site_settings`
SET `value` = JSON_SET(
    JSON_SET(
        JSON_SET(
            JSON_SET(
                JSON_SET(
                    JSON_SET(
                        JSON_SET(
                            `value`,
                            '$.global.color_primary', '#2B371D'
                        ),
                        '$.store_hero.color_title', '#ffffff'
                    ),
                    '$.store_hero.color_badge_bg', '#2B371D'
                ),
                '$.product_card.btn_bg', '#2B371D'
            ),
            '$.product_card.btn_bg_hover', '#1e2814'
        ),
        '$.product_card.color_price', '#2B371D'
    ),
    '$.filters.color_bg_active', '#2B371D'
)
WHERE `key` = 'ecommerce_styles';

