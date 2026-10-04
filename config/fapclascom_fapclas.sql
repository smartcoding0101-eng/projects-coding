-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 04-10-2026 a las 00:12:01
-- Versión del servidor: 11.4.13-MariaDB
-- Versión de PHP: 8.4.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `fapclascom_fapclas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `beneficios`
--

CREATE TABLE `beneficios` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `logo_path` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('fapclas-cache-site_setting.ecommerce_styles', 'a:6:{s:6:\"global\";a:14:{s:17:\"font_family_title\";s:5:\"Inter\";s:16:\"font_family_body\";s:5:\"Inter\";s:17:\"font_weight_title\";i:700;s:16:\"font_weight_body\";i:400;s:13:\"color_primary\";s:7:\"#04752d\";s:12:\"color_accent\";s:7:\"#eab308\";s:10:\"color_text\";s:7:\"#e1e7f0\";s:11:\"color_title\";s:7:\"#0f172a\";s:13:\"color_bg_page\";s:7:\"#f8faf6\";s:12:\"font_size_h1\";s:7:\"2.25rem\";s:12:\"font_size_h2\";s:7:\"1.75rem\";s:12:\"font_size_h3\";s:7:\"1.25rem\";s:14:\"font_size_body\";s:7:\"0.95rem\";s:11:\"line_height\";s:3:\"1.5\";}s:10:\"store_hero\";a:9:{s:17:\"font_family_title\";s:5:\"Inter\";s:17:\"font_weight_title\";i:800;s:15:\"font_size_title\";s:7:\"2.75rem\";s:10:\"text_align\";s:6:\"center\";s:8:\"color_bg\";s:7:\"#004af7\";s:11:\"color_title\";s:7:\"#3b962a\";s:14:\"color_subtitle\";s:7:\"#eab308\";s:14:\"color_badge_bg\";s:7:\"#09d654\";s:16:\"color_badge_text\";s:7:\"#ffffff\";}s:12:\"product_card\";a:19:{s:16:\"font_family_name\";s:5:\"Inter\";s:16:\"font_weight_name\";i:600;s:14:\"font_size_name\";s:4:\"1rem\";s:15:\"font_size_price\";s:7:\"1.25rem\";s:21:\"font_size_description\";s:8:\"0.875rem\";s:8:\"color_bg\";s:7:\"#ffffff\";s:14:\"color_bg_hover\";s:7:\"#f0fdf4\";s:10:\"color_name\";s:7:\"#0f172a\";s:11:\"color_price\";s:7:\"#16a34a\";s:18:\"color_price_credit\";s:7:\"#eab308\";s:17:\"color_description\";s:7:\"#64748b\";s:12:\"color_border\";s:7:\"#e2e8f0\";s:17:\"color_badge_stock\";s:7:\"#dcfce7\";s:13:\"border_radius\";s:4:\"1rem\";s:6:\"btn_bg\";s:7:\"#22c55e\";s:8:\"btn_text\";s:7:\"#ffffff\";s:12:\"btn_bg_hover\";s:7:\"#16a34a\";s:13:\"btn_font_size\";s:8:\"0.875rem\";s:15:\"btn_font_weight\";i:600;}s:14:\"product_detail\";a:9:{s:17:\"font_family_title\";s:5:\"Inter\";s:17:\"font_weight_title\";i:700;s:15:\"font_size_title\";s:8:\"1.875rem\";s:15:\"font_size_price\";s:7:\"3.00rem\";s:11:\"color_title\";s:7:\"#042166\";s:11:\"color_price\";s:7:\"#16a34a\";s:18:\"color_price_credit\";s:7:\"#d97706\";s:8:\"color_bg\";s:7:\"#f2ed63\";s:17:\"color_description\";s:7:\"#475569\";}s:7:\"filters\";a:8:{s:11:\"font_family\";s:5:\"Inter\";s:9:\"font_size\";s:8:\"0.875rem\";s:18:\"font_weight_active\";i:700;s:15:\"color_bg_active\";s:7:\"#22c55e\";s:17:\"color_text_active\";s:7:\"#ffffff\";s:17:\"color_bg_inactive\";s:7:\"#f1f5f9\";s:19:\"color_text_inactive\";s:7:\"#64748b\";s:12:\"color_border\";s:7:\"#e2e8f0\";}s:8:\"checkout\";a:7:{s:11:\"font_family\";s:5:\"Inter\";s:15:\"font_size_title\";s:7:\"1.25rem\";s:14:\"font_size_item\";s:7:\"0.95rem\";s:14:\"color_bg_panel\";s:7:\"#ffffff\";s:11:\"color_total\";s:7:\"#0f172a\";s:21:\"color_btn_checkout_bg\";s:7:\"#22c55e\";s:23:\"color_btn_checkout_text\";s:7:\"#ffffff\";}}', 1791072565),
('fapclas-cache-site_setting.footer', 'a:7:{s:11:\"description\";s:173:\"Soluciones financieras integrales con eficiencia, oportunidad y responsabilidad social diseñadas exclusivamente para el bienestar integral de la familia policial boliviana.\";s:9:\"copyright\";s:63:\"© 2026 Cooperativa FAPCLAS R.L. Todos los derechos reservados.\";s:13:\"copyright_dev\";s:27:\"© copyright SmarCoding SA.\";s:6:\"badges\";a:2:{i:0;a:2:{s:9:\"top_label\";s:18:\"Control Societario\";s:12:\"bottom_label\";s:19:\"Regulada por AFCOOP\";}i:1;a:2:{s:9:\"top_label\";s:23:\"Supervisión Financiera\";s:12:\"bottom_label\";s:20:\"Supervisada por ASFI\";}}s:11:\"quick_links\";a:4:{i:0;a:2:{s:5:\"label\";s:14:\"Caja de Ahorro\";s:3:\"url\";s:7:\"#ahorro\";}i:1;a:2:{s:5:\"label\";s:23:\"Créditos de Emergencia\";s:3:\"url\";s:9:\"#creditos\";}i:2;a:2:{s:5:\"label\";s:21:\"Beneficios Exclusivos\";s:3:\"url\";s:11:\"#beneficios\";}i:3;a:2:{s:5:\"label\";s:17:\"Misión y Visión\";s:3:\"url\";s:14:\"#institucional\";}}s:13:\"contact_links\";a:4:{i:0;a:2:{s:5:\"label\";s:16:\"WhatsApp Directo\";s:3:\"url\";s:21:\"http://wa.link/8yl8ow\";}i:1;a:2:{s:5:\"label\";s:21:\"Síguenos en Facebook\";s:3:\"url\";s:53:\"http://www.facebook.com/profile.php?id=61582603104419\";}i:2;a:2:{s:5:\"label\";s:28:\"Atención Personalizada 24/7\";s:3:\"url\";N;}i:3;a:2:{s:5:\"label\";s:29:\"Nuestras oficias Maps Google \";s:3:\"url\";s:123:\"https://www.google.com/maps/@-17.8561159,-63.0958413,137m/data=!3m1!1e3?entry=ttu&g_ep=EgoyMDI2MDcxMy4wIKXMDSoASAFQAw%3D%3D\";}}s:12:\"social_links\";a:4:{i:0;a:2:{s:8:\"platform\";s:8:\"facebook\";s:3:\"url\";s:1:\"#\";}i:1;a:2:{s:8:\"platform\";s:9:\"instagram\";s:3:\"url\";s:1:\"#\";}i:2;a:2:{s:8:\"platform\";s:6:\"tiktok\";s:3:\"url\";s:1:\"#\";}i:3;a:2:{s:8:\"platform\";s:8:\"linkedin\";s:3:\"url\";s:1:\"#\";}}}', 1791072565),
('fapclas-cache-site_setting.header', 'a:14:{s:7:\"favicon\";s:43:\"site/favicon/01KXMFQQ2QZ9PQG1X6KT2SVHYW.png\";s:5:\"phone\";s:8:\"71634750\";s:10:\"phone_link\";s:8:\"71634750\";s:13:\"whatsapp_link\";s:21:\"http://wa.link/8yl8ow\";s:14:\"whatsapp_label\";s:22:\"WhatsApp Institucional\";s:9:\"logo_text\";s:13:\"Coop. FAPCLAS\";s:11:\"logo_suffix\";s:4:\"R.L.\";s:15:\"cta_portal_text\";s:16:\"Acceso al Portal\";s:15:\"cta_tienda_text\";s:14:\"Tienda Virtual\";s:10:\"meta_title\";s:46:\"Cooperativa de Ahorro y Crédito \"FAPCLAS\" R.L\";s:16:\"meta_description\";s:154:\"FAPCLAS R.L. – Cooperativa de ahorro y crédito de la Familia Policial Boliviana. Soluciones financieras modernas, seguras y con responsabilidad social.\";s:13:\"meta_keywords\";s:44:\"cooperativas, créditos, ahorros, prestamos.\";s:9:\"top_links\";a:2:{i:0;a:2:{s:5:\"label\";s:16:\"Bolsa de Trabajo\";s:3:\"url\";s:1:\"#\";}i:1;a:2:{s:5:\"label\";s:20:\"Preguntas Frecuentes\";s:3:\"url\";s:1:\"#\";}}s:4:\"menu\";a:3:{i:0;a:6:{s:5:\"label\";s:15:\"Nuestra Entidad\";s:8:\"children\";a:2:{i:0;a:5:{s:5:\"label\";s:17:\"Misión y Visión\";s:3:\"url\";s:28:\"/institucional/mision-vision\";s:11:\"description\";s:31:\"Horizonte cooperativo policial.\";s:4:\"icon\";s:4:\"flag\";s:8:\"disabled\";b:0;}i:1;a:5:{s:5:\"label\";s:14:\"Quiénes Somos\";s:3:\"url\";s:27:\"/institucional/constitucion\";s:11:\"description\";s:30:\"Historia e impacto de FAPCLAS.\";s:4:\"icon\";s:5:\"users\";s:8:\"disabled\";b:0;}}s:14:\"featured_image\";s:40:\"site/menu/01KT6T11N2CEX9V6FK78Z99H72.png\";s:14:\"featured_title\";s:21:\"+5,000 socios activos\";s:17:\"featured_subtitle\";s:31:\"Únete a la hermandad policial.\";s:14:\"featured_badge\";s:11:\"Solidaridad\";}i:1;a:6:{s:5:\"label\";s:13:\"Transparencia\";s:8:\"children\";a:2:{i:0;a:5:{s:5:\"label\";s:18:\"Leyes y Normativas\";s:3:\"url\";s:25:\"/institucional/normativas\";s:11:\"description\";s:25:\"Leyes 393, ASFI y AFCOOP.\";s:4:\"icon\";s:9:\"book-open\";s:8:\"disabled\";b:0;}i:1;a:5:{s:5:\"label\";s:22:\"Punto de Reclamo (PRF)\";s:3:\"url\";s:1:\"#\";s:11:\"description\";s:28:\"No disponible temporalmente.\";s:4:\"icon\";s:14:\"message-circle\";s:8:\"disabled\";b:1;}}s:14:\"featured_image\";N;s:14:\"featured_title\";N;s:17:\"featured_subtitle\";N;s:14:\"featured_badge\";N;}i:2;a:6:{s:5:\"label\";s:7:\"Informe\";s:8:\"children\";a:1:{i:0;a:5:{s:5:\"label\";s:8:\"Noticias\";s:3:\"url\";s:23:\"/institucional/noticias\";s:11:\"description\";s:36:\"Actualidad, comunicados y convenios.\";s:4:\"icon\";s:9:\"newspaper\";s:8:\"disabled\";b:0;}}s:14:\"featured_image\";N;s:14:\"featured_title\";N;s:17:\"featured_subtitle\";N;s:14:\"featured_badge\";N;}}}', 1791072463),
('fapclas-cache-site_setting.landing_styles', 'a:9:{s:6:\"global\";a:16:{s:17:\"font_family_title\";s:10:\"Montserrat\";s:16:\"font_family_body\";s:5:\"Inter\";s:17:\"font_weight_title\";i:700;s:16:\"font_weight_body\";i:400;s:13:\"color_primary\";s:7:\"#318c31\";s:15:\"color_secondary\";s:7:\"#eab308\";s:10:\"color_text\";s:7:\"#2a3952\";s:11:\"color_title\";s:7:\"#020e29\";s:13:\"color_bg_page\";s:7:\"#f8faf6\";s:12:\"font_size_h1\";s:7:\"2.75rem\";s:12:\"font_size_h2\";s:4:\"2rem\";s:12:\"font_size_h3\";s:6:\"1.5rem\";s:14:\"font_size_body\";s:4:\"1rem\";s:15:\"font_size_small\";s:8:\"0.875rem\";s:11:\"line_height\";s:4:\"1.65\";s:14:\"letter_spacing\";s:3:\"0em\";}s:4:\"hero\";a:19:{s:17:\"font_family_title\";s:4:\"Lato\";s:17:\"font_weight_title\";i:900;s:20:\"text_transform_title\";s:4:\"none\";s:10:\"text_align\";s:4:\"left\";s:15:\"font_size_title\";s:6:\"3.5rem\";s:18:\"font_size_subtitle\";s:6:\"1.5rem\";s:21:\"font_size_description\";s:8:\"1.125rem\";s:20:\"letter_spacing_title\";s:7:\"-0.02em\";s:17:\"line_height_title\";s:3:\"1.1\";s:11:\"color_title\";s:7:\"#427a42\";s:14:\"color_subtitle\";s:7:\"#fcfcfc\";s:17:\"color_description\";s:7:\"#c5e0ce\";s:13:\"color_overlay\";s:7:\"#ffffff\";s:15:\"overlay_opacity\";s:4:\"0.55\";s:14:\"btn_primary_bg\";s:7:\"#24a152\";s:16:\"btn_primary_text\";s:7:\"#ffffff\";s:16:\"btn_secondary_bg\";s:7:\"#f5ecec\";s:18:\"btn_secondary_text\";s:7:\"#ffffff\";s:17:\"btn_border_radius\";s:6:\"0.5rem\";}s:3:\"nav\";a:12:{s:11:\"font_family\";s:5:\"Inter\";s:11:\"font_weight\";i:500;s:9:\"font_size\";s:6:\"0.9rem\";s:14:\"text_transform\";s:4:\"none\";s:8:\"color_bg\";s:7:\"#254a2b\";s:15:\"color_bg_scroll\";s:7:\"#a9bee0\";s:10:\"color_link\";s:7:\"#f1f5f9\";s:16:\"color_link_hover\";s:7:\"#22c55e\";s:10:\"color_logo\";s:7:\"#ffffff\";s:9:\"topbar_bg\";s:7:\"#166534\";s:11:\"topbar_text\";s:7:\"#dcfce7\";s:16:\"topbar_font_size\";s:6:\"0.8rem\";}s:13:\"section_title\";a:13:{s:11:\"font_family\";s:5:\"Inter\";s:11:\"font_weight\";i:800;s:9:\"font_size\";s:4:\"2rem\";s:14:\"text_transform\";s:4:\"none\";s:10:\"text_align\";s:6:\"center\";s:11:\"color_title\";s:7:\"#0f172a\";s:14:\"color_subtitle\";s:7:\"#64748b\";s:11:\"color_badge\";s:7:\"#22c55e\";s:16:\"color_badge_text\";s:7:\"#ffffff\";s:13:\"margin_bottom\";s:4:\"3rem\";s:18:\"font_size_subtitle\";s:6:\"1.1rem\";s:14:\"letter_spacing\";s:3:\"0em\";s:11:\"line_height\";s:3:\"1.3\";}s:5:\"cards\";a:13:{s:17:\"font_family_title\";s:5:\"Inter\";s:17:\"font_weight_title\";i:700;s:15:\"font_size_title\";s:7:\"1.25rem\";s:14:\"font_size_body\";s:7:\"0.95rem\";s:8:\"color_bg\";s:7:\"#ffffff\";s:14:\"color_bg_hover\";s:7:\"#f0fdf4\";s:11:\"color_title\";s:7:\"#0f172a\";s:10:\"color_body\";s:7:\"#64748b\";s:10:\"color_icon\";s:7:\"#22c55e\";s:12:\"color_border\";s:7:\"#e2e8f0\";s:18:\"color_border_hover\";s:7:\"#22c55e\";s:13:\"border_radius\";s:4:\"1rem\";s:7:\"padding\";s:6:\"1.5rem\";}s:5:\"stats\";a:8:{s:17:\"font_family_value\";s:5:\"Inter\";s:17:\"font_weight_value\";i:800;s:15:\"font_size_value\";s:4:\"3rem\";s:15:\"font_size_label\";s:6:\"0.9rem\";s:8:\"color_bg\";s:7:\"#0f172a\";s:11:\"color_value\";s:7:\"#22c55e\";s:11:\"color_label\";s:7:\"#94a3b8\";s:10:\"color_icon\";s:7:\"#eab308\";}s:12:\"testimonials\";a:9:{s:17:\"font_family_quote\";s:5:\"Inter\";s:16:\"font_style_quote\";s:6:\"italic\";s:15:\"font_size_quote\";s:6:\"1.1rem\";s:16:\"font_size_author\";s:7:\"0.95rem\";s:13:\"color_bg_card\";s:22:\"rgba(255,255,255,0.05)\";s:16:\"color_quote_text\";s:7:\"#e2e8f0\";s:12:\"color_author\";s:7:\"#94a3b8\";s:11:\"color_stars\";s:7:\"#eab308\";s:16:\"color_section_bg\";s:7:\"#0f172a\";}s:6:\"footer\";a:12:{s:11:\"font_family\";s:5:\"Inter\";s:14:\"font_size_body\";s:6:\"0.9rem\";s:15:\"font_size_title\";s:4:\"1rem\";s:17:\"font_weight_title\";i:600;s:8:\"color_bg\";s:7:\"#020617\";s:10:\"color_text\";s:7:\"#94a3b8\";s:11:\"color_title\";s:7:\"#f1f5f9\";s:10:\"color_link\";s:7:\"#94a3b8\";s:16:\"color_link_hover\";s:7:\"#22c55e\";s:12:\"color_border\";s:7:\"#1e293b\";s:18:\"color_copyright_bg\";s:7:\"#000000\";s:20:\"color_copyright_text\";s:7:\"#475569\";}s:7:\"buttons\";a:14:{s:11:\"font_family\";s:5:\"Inter\";s:11:\"font_weight\";i:600;s:9:\"font_size\";s:7:\"0.95rem\";s:14:\"text_transform\";s:4:\"none\";s:10:\"primary_bg\";s:7:\"#22c55e\";s:12:\"primary_text\";s:7:\"#ffffff\";s:16:\"primary_bg_hover\";s:7:\"#16a34a\";s:21:\"primary_border_radius\";s:6:\"0.5rem\";s:15:\"primary_padding\";s:15:\"0.75rem 1.75rem\";s:12:\"secondary_bg\";s:11:\"transparent\";s:14:\"secondary_text\";s:7:\"#22c55e\";s:16:\"secondary_border\";s:7:\"#22c55e\";s:18:\"secondary_bg_hover\";s:7:\"#f0fdf4\";s:23:\"secondary_border_radius\";s:6:\"0.5rem\";}}', 1791072565),
('fapclas-cache-site_setting.promo_popup_ecommerce', 'a:10:{s:7:\"enabled\";b:0;s:4:\"type\";s:11:\"informacion\";s:5:\"image\";s:42:\"site/popups/01KXNP4FPKHZT50J3XTHJJP088.png\";s:5:\"title\";s:31:\"BIENVENIDOS A TU TIENDA VIRTUAL\";s:11:\"description\";s:94:\"Ofertas exclusivas para todos nuestros clientes de la Coop. FAPCLAS R.L. y publico en general.\";s:11:\"button_text\";s:7:\"INGRESA\";s:11:\"button_link\";s:9:\"#catalogo\";s:9:\"show_once\";b:1;s:8:\"delay_ms\";i:800;s:10:\"expires_at\";N;}', 1791072565),
('fapclas-cache-site_setting.promo_popup_landing', 'a:10:{s:7:\"enabled\";b:0;s:4:\"type\";s:6:\"oferta\";s:5:\"image\";s:42:\"site/popups/01KXMMK1X299E0SF0J6KNRGPA8.png\";s:5:\"title\";s:15:\"Oferta Especial\";s:11:\"description\";s:54:\"Aprovecha nuestras promociones exclusivas para socios.\";s:11:\"button_text\";s:8:\"Ver Más\";s:11:\"button_link\";s:11:\"/beneficios\";s:9:\"show_once\";b:1;s:8:\"delay_ms\";i:6000;s:10:\"expires_at\";N;}', 1791072565),
('fapclas-cache-site_setting.splash', 'a:11:{s:7:\"enabled\";b:1;s:9:\"logo_type\";s:4:\"both\";s:9:\"logo_size\";s:2:\"xl\";s:5:\"style\";s:5:\"brand\";s:9:\"animation\";s:8:\"zoom-out\";s:10:\"logo_image\";s:42:\"site/splash/01KSV4PABDZ7QA9ESPA42J6ZCP.png\";s:5:\"title\";s:18:\"Coop. FAPCLAS R.L.\";s:8:\"subtitle\";s:34:\"Tu Cooperativa policial preferida.\";s:7:\"tagline\";s:38:\"Tu futuro seguro · Coop. FAPCLAS R.L.\";s:11:\"duration_ms\";i:5000;s:18:\"show_every_minutes\";i:30;}', 1791072565),
('fapclas-cache-site_setting.whatsapp', 'a:3:{s:7:\"enabled\";b:1;s:3:\"url\";s:22:\"https://wa.link/0nyqcd\";s:7:\"tooltip\";s:29:\"CONTACTANOS...!!! (En línea)\";}', 1791072565),
('fapclas-cache-site_settings_payload', 'a:8:{s:6:\"header\";a:14:{s:7:\"favicon\";s:43:\"site/favicon/01KXMFQQ2QZ9PQG1X6KT2SVHYW.png\";s:5:\"phone\";s:8:\"71634750\";s:10:\"phone_link\";s:8:\"71634750\";s:13:\"whatsapp_link\";s:21:\"http://wa.link/8yl8ow\";s:14:\"whatsapp_label\";s:22:\"WhatsApp Institucional\";s:9:\"logo_text\";s:13:\"Coop. FAPCLAS\";s:11:\"logo_suffix\";s:4:\"R.L.\";s:15:\"cta_portal_text\";s:16:\"Acceso al Portal\";s:15:\"cta_tienda_text\";s:14:\"Tienda Virtual\";s:10:\"meta_title\";s:46:\"Cooperativa de Ahorro y Crédito \"FAPCLAS\" R.L\";s:16:\"meta_description\";s:154:\"FAPCLAS R.L. – Cooperativa de ahorro y crédito de la Familia Policial Boliviana. Soluciones financieras modernas, seguras y con responsabilidad social.\";s:13:\"meta_keywords\";s:44:\"cooperativas, créditos, ahorros, prestamos.\";s:9:\"top_links\";a:2:{i:0;a:2:{s:5:\"label\";s:16:\"Bolsa de Trabajo\";s:3:\"url\";s:1:\"#\";}i:1;a:2:{s:5:\"label\";s:20:\"Preguntas Frecuentes\";s:3:\"url\";s:1:\"#\";}}s:4:\"menu\";a:3:{i:0;a:6:{s:5:\"label\";s:15:\"Nuestra Entidad\";s:8:\"children\";a:2:{i:0;a:5:{s:5:\"label\";s:17:\"Misión y Visión\";s:3:\"url\";s:28:\"/institucional/mision-vision\";s:11:\"description\";s:31:\"Horizonte cooperativo policial.\";s:4:\"icon\";s:4:\"flag\";s:8:\"disabled\";b:0;}i:1;a:5:{s:5:\"label\";s:14:\"Quiénes Somos\";s:3:\"url\";s:27:\"/institucional/constitucion\";s:11:\"description\";s:30:\"Historia e impacto de FAPCLAS.\";s:4:\"icon\";s:5:\"users\";s:8:\"disabled\";b:0;}}s:14:\"featured_image\";s:40:\"site/menu/01KT6T11N2CEX9V6FK78Z99H72.png\";s:14:\"featured_title\";s:21:\"+5,000 socios activos\";s:17:\"featured_subtitle\";s:31:\"Únete a la hermandad policial.\";s:14:\"featured_badge\";s:11:\"Solidaridad\";}i:1;a:6:{s:5:\"label\";s:13:\"Transparencia\";s:8:\"children\";a:2:{i:0;a:5:{s:5:\"label\";s:18:\"Leyes y Normativas\";s:3:\"url\";s:25:\"/institucional/normativas\";s:11:\"description\";s:25:\"Leyes 393, ASFI y AFCOOP.\";s:4:\"icon\";s:9:\"book-open\";s:8:\"disabled\";b:0;}i:1;a:5:{s:5:\"label\";s:22:\"Punto de Reclamo (PRF)\";s:3:\"url\";s:1:\"#\";s:11:\"description\";s:28:\"No disponible temporalmente.\";s:4:\"icon\";s:14:\"message-circle\";s:8:\"disabled\";b:1;}}s:14:\"featured_image\";N;s:14:\"featured_title\";N;s:17:\"featured_subtitle\";N;s:14:\"featured_badge\";N;}i:2;a:6:{s:5:\"label\";s:7:\"Informe\";s:8:\"children\";a:1:{i:0;a:5:{s:5:\"label\";s:8:\"Noticias\";s:3:\"url\";s:23:\"/institucional/noticias\";s:11:\"description\";s:36:\"Actualidad, comunicados y convenios.\";s:4:\"icon\";s:9:\"newspaper\";s:8:\"disabled\";b:0;}}s:14:\"featured_image\";N;s:14:\"featured_title\";N;s:17:\"featured_subtitle\";N;s:14:\"featured_badge\";N;}}}s:6:\"footer\";a:7:{s:11:\"description\";s:173:\"Soluciones financieras integrales con eficiencia, oportunidad y responsabilidad social diseñadas exclusivamente para el bienestar integral de la familia policial boliviana.\";s:9:\"copyright\";s:63:\"© 2026 Cooperativa FAPCLAS R.L. Todos los derechos reservados.\";s:13:\"copyright_dev\";s:27:\"© copyright SmarCoding SA.\";s:6:\"badges\";a:2:{i:0;a:2:{s:9:\"top_label\";s:18:\"Control Societario\";s:12:\"bottom_label\";s:19:\"Regulada por AFCOOP\";}i:1;a:2:{s:9:\"top_label\";s:23:\"Supervisión Financiera\";s:12:\"bottom_label\";s:20:\"Supervisada por ASFI\";}}s:11:\"quick_links\";a:4:{i:0;a:2:{s:5:\"label\";s:14:\"Caja de Ahorro\";s:3:\"url\";s:7:\"#ahorro\";}i:1;a:2:{s:5:\"label\";s:23:\"Créditos de Emergencia\";s:3:\"url\";s:9:\"#creditos\";}i:2;a:2:{s:5:\"label\";s:21:\"Beneficios Exclusivos\";s:3:\"url\";s:11:\"#beneficios\";}i:3;a:2:{s:5:\"label\";s:17:\"Misión y Visión\";s:3:\"url\";s:14:\"#institucional\";}}s:13:\"contact_links\";a:4:{i:0;a:2:{s:5:\"label\";s:16:\"WhatsApp Directo\";s:3:\"url\";s:21:\"http://wa.link/8yl8ow\";}i:1;a:2:{s:5:\"label\";s:21:\"Síguenos en Facebook\";s:3:\"url\";s:53:\"http://www.facebook.com/profile.php?id=61582603104419\";}i:2;a:2:{s:5:\"label\";s:28:\"Atención Personalizada 24/7\";s:3:\"url\";N;}i:3;a:2:{s:5:\"label\";s:29:\"Nuestras oficias Maps Google \";s:3:\"url\";s:123:\"https://www.google.com/maps/@-17.8561159,-63.0958413,137m/data=!3m1!1e3?entry=ttu&g_ep=EgoyMDI2MDcxMy4wIKXMDSoASAFQAw%3D%3D\";}}s:12:\"social_links\";a:4:{i:0;a:2:{s:8:\"platform\";s:8:\"facebook\";s:3:\"url\";s:1:\"#\";}i:1;a:2:{s:8:\"platform\";s:9:\"instagram\";s:3:\"url\";s:1:\"#\";}i:2;a:2:{s:8:\"platform\";s:6:\"tiktok\";s:3:\"url\";s:1:\"#\";}i:3;a:2:{s:8:\"platform\";s:8:\"linkedin\";s:3:\"url\";s:1:\"#\";}}}s:8:\"whatsapp\";a:3:{s:7:\"enabled\";b:1;s:3:\"url\";s:22:\"https://wa.link/0nyqcd\";s:7:\"tooltip\";s:29:\"CONTACTANOS...!!! (En línea)\";}s:19:\"promo_popup_landing\";a:10:{s:7:\"enabled\";b:0;s:4:\"type\";s:6:\"oferta\";s:5:\"image\";s:42:\"site/popups/01KXMMK1X299E0SF0J6KNRGPA8.png\";s:5:\"title\";s:15:\"Oferta Especial\";s:11:\"description\";s:54:\"Aprovecha nuestras promociones exclusivas para socios.\";s:11:\"button_text\";s:8:\"Ver Más\";s:11:\"button_link\";s:11:\"/beneficios\";s:9:\"show_once\";b:1;s:8:\"delay_ms\";i:6000;s:10:\"expires_at\";N;}s:21:\"promo_popup_ecommerce\";a:10:{s:7:\"enabled\";b:0;s:4:\"type\";s:11:\"informacion\";s:5:\"image\";s:42:\"site/popups/01KXNP4FPKHZT50J3XTHJJP088.png\";s:5:\"title\";s:31:\"BIENVENIDOS A TU TIENDA VIRTUAL\";s:11:\"description\";s:94:\"Ofertas exclusivas para todos nuestros clientes de la Coop. FAPCLAS R.L. y publico en general.\";s:11:\"button_text\";s:7:\"INGRESA\";s:11:\"button_link\";s:9:\"#catalogo\";s:9:\"show_once\";b:1;s:8:\"delay_ms\";i:800;s:10:\"expires_at\";N;}s:6:\"splash\";a:11:{s:7:\"enabled\";b:1;s:9:\"logo_type\";s:4:\"both\";s:9:\"logo_size\";s:2:\"xl\";s:5:\"style\";s:5:\"brand\";s:9:\"animation\";s:8:\"zoom-out\";s:10:\"logo_image\";s:42:\"site/splash/01KSV4PABDZ7QA9ESPA42J6ZCP.png\";s:5:\"title\";s:18:\"Coop. FAPCLAS R.L.\";s:8:\"subtitle\";s:34:\"Tu Cooperativa policial preferida.\";s:7:\"tagline\";s:38:\"Tu futuro seguro · Coop. FAPCLAS R.L.\";s:11:\"duration_ms\";i:5000;s:18:\"show_every_minutes\";i:30;}s:14:\"landing_styles\";a:9:{s:6:\"global\";a:16:{s:17:\"font_family_title\";s:10:\"Montserrat\";s:16:\"font_family_body\";s:5:\"Inter\";s:17:\"font_weight_title\";i:700;s:16:\"font_weight_body\";i:400;s:13:\"color_primary\";s:7:\"#318c31\";s:15:\"color_secondary\";s:7:\"#eab308\";s:10:\"color_text\";s:7:\"#2a3952\";s:11:\"color_title\";s:7:\"#020e29\";s:13:\"color_bg_page\";s:7:\"#f8faf6\";s:12:\"font_size_h1\";s:7:\"2.75rem\";s:12:\"font_size_h2\";s:4:\"2rem\";s:12:\"font_size_h3\";s:6:\"1.5rem\";s:14:\"font_size_body\";s:4:\"1rem\";s:15:\"font_size_small\";s:8:\"0.875rem\";s:11:\"line_height\";s:4:\"1.65\";s:14:\"letter_spacing\";s:3:\"0em\";}s:4:\"hero\";a:19:{s:17:\"font_family_title\";s:4:\"Lato\";s:17:\"font_weight_title\";i:900;s:20:\"text_transform_title\";s:4:\"none\";s:10:\"text_align\";s:4:\"left\";s:15:\"font_size_title\";s:6:\"3.5rem\";s:18:\"font_size_subtitle\";s:6:\"1.5rem\";s:21:\"font_size_description\";s:8:\"1.125rem\";s:20:\"letter_spacing_title\";s:7:\"-0.02em\";s:17:\"line_height_title\";s:3:\"1.1\";s:11:\"color_title\";s:7:\"#427a42\";s:14:\"color_subtitle\";s:7:\"#fcfcfc\";s:17:\"color_description\";s:7:\"#c5e0ce\";s:13:\"color_overlay\";s:7:\"#ffffff\";s:15:\"overlay_opacity\";s:4:\"0.55\";s:14:\"btn_primary_bg\";s:7:\"#24a152\";s:16:\"btn_primary_text\";s:7:\"#ffffff\";s:16:\"btn_secondary_bg\";s:7:\"#f5ecec\";s:18:\"btn_secondary_text\";s:7:\"#ffffff\";s:17:\"btn_border_radius\";s:6:\"0.5rem\";}s:3:\"nav\";a:12:{s:11:\"font_family\";s:5:\"Inter\";s:11:\"font_weight\";i:500;s:9:\"font_size\";s:6:\"0.9rem\";s:14:\"text_transform\";s:4:\"none\";s:8:\"color_bg\";s:7:\"#254a2b\";s:15:\"color_bg_scroll\";s:7:\"#a9bee0\";s:10:\"color_link\";s:7:\"#f1f5f9\";s:16:\"color_link_hover\";s:7:\"#22c55e\";s:10:\"color_logo\";s:7:\"#ffffff\";s:9:\"topbar_bg\";s:7:\"#166534\";s:11:\"topbar_text\";s:7:\"#dcfce7\";s:16:\"topbar_font_size\";s:6:\"0.8rem\";}s:13:\"section_title\";a:13:{s:11:\"font_family\";s:5:\"Inter\";s:11:\"font_weight\";i:800;s:9:\"font_size\";s:4:\"2rem\";s:14:\"text_transform\";s:4:\"none\";s:10:\"text_align\";s:6:\"center\";s:11:\"color_title\";s:7:\"#0f172a\";s:14:\"color_subtitle\";s:7:\"#64748b\";s:11:\"color_badge\";s:7:\"#22c55e\";s:16:\"color_badge_text\";s:7:\"#ffffff\";s:13:\"margin_bottom\";s:4:\"3rem\";s:18:\"font_size_subtitle\";s:6:\"1.1rem\";s:14:\"letter_spacing\";s:3:\"0em\";s:11:\"line_height\";s:3:\"1.3\";}s:5:\"cards\";a:13:{s:17:\"font_family_title\";s:5:\"Inter\";s:17:\"font_weight_title\";i:700;s:15:\"font_size_title\";s:7:\"1.25rem\";s:14:\"font_size_body\";s:7:\"0.95rem\";s:8:\"color_bg\";s:7:\"#ffffff\";s:14:\"color_bg_hover\";s:7:\"#f0fdf4\";s:11:\"color_title\";s:7:\"#0f172a\";s:10:\"color_body\";s:7:\"#64748b\";s:10:\"color_icon\";s:7:\"#22c55e\";s:12:\"color_border\";s:7:\"#e2e8f0\";s:18:\"color_border_hover\";s:7:\"#22c55e\";s:13:\"border_radius\";s:4:\"1rem\";s:7:\"padding\";s:6:\"1.5rem\";}s:5:\"stats\";a:8:{s:17:\"font_family_value\";s:5:\"Inter\";s:17:\"font_weight_value\";i:800;s:15:\"font_size_value\";s:4:\"3rem\";s:15:\"font_size_label\";s:6:\"0.9rem\";s:8:\"color_bg\";s:7:\"#0f172a\";s:11:\"color_value\";s:7:\"#22c55e\";s:11:\"color_label\";s:7:\"#94a3b8\";s:10:\"color_icon\";s:7:\"#eab308\";}s:12:\"testimonials\";a:9:{s:17:\"font_family_quote\";s:5:\"Inter\";s:16:\"font_style_quote\";s:6:\"italic\";s:15:\"font_size_quote\";s:6:\"1.1rem\";s:16:\"font_size_author\";s:7:\"0.95rem\";s:13:\"color_bg_card\";s:22:\"rgba(255,255,255,0.05)\";s:16:\"color_quote_text\";s:7:\"#e2e8f0\";s:12:\"color_author\";s:7:\"#94a3b8\";s:11:\"color_stars\";s:7:\"#eab308\";s:16:\"color_section_bg\";s:7:\"#0f172a\";}s:6:\"footer\";a:12:{s:11:\"font_family\";s:5:\"Inter\";s:14:\"font_size_body\";s:6:\"0.9rem\";s:15:\"font_size_title\";s:4:\"1rem\";s:17:\"font_weight_title\";i:600;s:8:\"color_bg\";s:7:\"#020617\";s:10:\"color_text\";s:7:\"#94a3b8\";s:11:\"color_title\";s:7:\"#f1f5f9\";s:10:\"color_link\";s:7:\"#94a3b8\";s:16:\"color_link_hover\";s:7:\"#22c55e\";s:12:\"color_border\";s:7:\"#1e293b\";s:18:\"color_copyright_bg\";s:7:\"#000000\";s:20:\"color_copyright_text\";s:7:\"#475569\";}s:7:\"buttons\";a:14:{s:11:\"font_family\";s:5:\"Inter\";s:11:\"font_weight\";i:600;s:9:\"font_size\";s:7:\"0.95rem\";s:14:\"text_transform\";s:4:\"none\";s:10:\"primary_bg\";s:7:\"#22c55e\";s:12:\"primary_text\";s:7:\"#ffffff\";s:16:\"primary_bg_hover\";s:7:\"#16a34a\";s:21:\"primary_border_radius\";s:6:\"0.5rem\";s:15:\"primary_padding\";s:15:\"0.75rem 1.75rem\";s:12:\"secondary_bg\";s:11:\"transparent\";s:14:\"secondary_text\";s:7:\"#22c55e\";s:16:\"secondary_border\";s:7:\"#22c55e\";s:18:\"secondary_bg_hover\";s:7:\"#f0fdf4\";s:23:\"secondary_border_radius\";s:6:\"0.5rem\";}}s:16:\"ecommerce_styles\";a:6:{s:6:\"global\";a:14:{s:17:\"font_family_title\";s:5:\"Inter\";s:16:\"font_family_body\";s:5:\"Inter\";s:17:\"font_weight_title\";i:700;s:16:\"font_weight_body\";i:400;s:13:\"color_primary\";s:7:\"#04752d\";s:12:\"color_accent\";s:7:\"#eab308\";s:10:\"color_text\";s:7:\"#e1e7f0\";s:11:\"color_title\";s:7:\"#0f172a\";s:13:\"color_bg_page\";s:7:\"#f8faf6\";s:12:\"font_size_h1\";s:7:\"2.25rem\";s:12:\"font_size_h2\";s:7:\"1.75rem\";s:12:\"font_size_h3\";s:7:\"1.25rem\";s:14:\"font_size_body\";s:7:\"0.95rem\";s:11:\"line_height\";s:3:\"1.5\";}s:10:\"store_hero\";a:9:{s:17:\"font_family_title\";s:5:\"Inter\";s:17:\"font_weight_title\";i:800;s:15:\"font_size_title\";s:7:\"2.75rem\";s:10:\"text_align\";s:6:\"center\";s:8:\"color_bg\";s:7:\"#004af7\";s:11:\"color_title\";s:7:\"#3b962a\";s:14:\"color_subtitle\";s:7:\"#eab308\";s:14:\"color_badge_bg\";s:7:\"#09d654\";s:16:\"color_badge_text\";s:7:\"#ffffff\";}s:12:\"product_card\";a:19:{s:16:\"font_family_name\";s:5:\"Inter\";s:16:\"font_weight_name\";i:600;s:14:\"font_size_name\";s:4:\"1rem\";s:15:\"font_size_price\";s:7:\"1.25rem\";s:21:\"font_size_description\";s:8:\"0.875rem\";s:8:\"color_bg\";s:7:\"#ffffff\";s:14:\"color_bg_hover\";s:7:\"#f0fdf4\";s:10:\"color_name\";s:7:\"#0f172a\";s:11:\"color_price\";s:7:\"#16a34a\";s:18:\"color_price_credit\";s:7:\"#eab308\";s:17:\"color_description\";s:7:\"#64748b\";s:12:\"color_border\";s:7:\"#e2e8f0\";s:17:\"color_badge_stock\";s:7:\"#dcfce7\";s:13:\"border_radius\";s:4:\"1rem\";s:6:\"btn_bg\";s:7:\"#22c55e\";s:8:\"btn_text\";s:7:\"#ffffff\";s:12:\"btn_bg_hover\";s:7:\"#16a34a\";s:13:\"btn_font_size\";s:8:\"0.875rem\";s:15:\"btn_font_weight\";i:600;}s:14:\"product_detail\";a:9:{s:17:\"font_family_title\";s:5:\"Inter\";s:17:\"font_weight_title\";i:700;s:15:\"font_size_title\";s:8:\"1.875rem\";s:15:\"font_size_price\";s:7:\"3.00rem\";s:11:\"color_title\";s:7:\"#042166\";s:11:\"color_price\";s:7:\"#16a34a\";s:18:\"color_price_credit\";s:7:\"#d97706\";s:8:\"color_bg\";s:7:\"#f2ed63\";s:17:\"color_description\";s:7:\"#475569\";}s:7:\"filters\";a:8:{s:11:\"font_family\";s:5:\"Inter\";s:9:\"font_size\";s:8:\"0.875rem\";s:18:\"font_weight_active\";i:700;s:15:\"color_bg_active\";s:7:\"#22c55e\";s:17:\"color_text_active\";s:7:\"#ffffff\";s:17:\"color_bg_inactive\";s:7:\"#f1f5f9\";s:19:\"color_text_inactive\";s:7:\"#64748b\";s:12:\"color_border\";s:7:\"#e2e8f0\";}s:8:\"checkout\";a:7:{s:11:\"font_family\";s:5:\"Inter\";s:15:\"font_size_title\";s:7:\"1.25rem\";s:14:\"font_size_item\";s:7:\"0.95rem\";s:14:\"color_bg_panel\";s:7:\"#ffffff\";s:11:\"color_total\";s:7:\"#0f172a\";s:21:\"color_btn_checkout_bg\";s:7:\"#22c55e\";s:23:\"color_btn_checkout_text\";s:7:\"#ffffff\";}}}', 1791072565),
('fapclas-cache-spatie.permission.cache', 'a:3:{s:5:\"alias\";a:4:{s:1:\"a\";s:2:\"id\";s:1:\"b\";s:4:\"name\";s:1:\"c\";s:10:\"guard_name\";s:1:\"r\";s:5:\"roles\";}s:11:\"permissions\";a:32:{i:0;a:4:{s:1:\"a\";i:1;s:1:\"b\";s:18:\"gestionar usuarios\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:1;a:4:{s:1:\"a\";i:2;s:1:\"b\";s:18:\"gestionar creditos\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:2;a:4:{s:1:\"a\";i:3;s:1:\"b\";s:16:\"aprobar creditos\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:3;a:4:{s:1:\"a\";i:4;s:1:\"b\";s:12:\"ver reportes\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:4;a:4:{s:1:\"a\";i:5;s:1:\"b\";s:17:\"ver estado cuenta\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:4:{i:0;i:1;i:1;i:2;i:2;i:3;i:3;i:4;}}i:5;a:4:{s:1:\"a\";i:6;s:1:\"b\";s:14:\"gestionar caja\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:6;a:4:{s:1:\"a\";i:7;s:1:\"b\";s:19:\"gestionar ecommerce\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:7;a:4:{s:1:\"a\";i:8;s:1:\"b\";s:12:\"ver personas\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:4:{i:0;i:1;i:1;i:5;i:2;i:6;i:3;i:7;}}i:8;a:4:{s:1:\"a\";i:9;s:1:\"b\";s:14:\"crear personas\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:5;}}i:9;a:4:{s:1:\"a\";i:10;s:1:\"b\";s:15:\"editar personas\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:5;}}i:10;a:4:{s:1:\"a\";i:11;s:1:\"b\";s:17:\"eliminar personas\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:11;a:4:{s:1:\"a\";i:12;s:1:\"b\";s:24:\"vincular cuentas usuario\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:12;a:4:{s:1:\"a\";i:13;s:1:\"b\";s:12:\"ver creditos\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:4:{i:0;i:1;i:1;i:5;i:2;i:6;i:3;i:7;}}i:13;a:4:{s:1:\"a\";i:14;s:1:\"b\";s:14:\"crear creditos\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:5;}}i:14;a:4:{s:1:\"a\";i:15;s:1:\"b\";s:15:\"editar creditos\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:5;}}i:15;a:4:{s:1:\"a\";i:16;s:1:\"b\";s:16:\"evaluar creditos\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:5;}}i:16;a:4:{s:1:\"a\";i:17;s:1:\"b\";s:17:\"eliminar creditos\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:17;a:4:{s:1:\"a\";i:18;s:1:\"b\";s:22:\"cobrar cuotas creditos\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:6;i:2;i:7;}}i:18;a:4:{s:1:\"a\";i:19;s:1:\"b\";s:16:\"ver libro diario\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:6;i:2;i:7;}}i:19;a:4:{s:1:\"a\";i:20;s:1:\"b\";s:16:\"gestionar diario\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:6;}}i:20;a:4:{s:1:\"a\";i:21;s:1:\"b\";s:18:\"ver kardex general\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:6;}}i:21;a:4:{s:1:\"a\";i:22;s:1:\"b\";s:19:\"exportar kardex pdf\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:6;}}i:22;a:4:{s:1:\"a\";i:23;s:1:\"b\";s:21:\"exportar kardex excel\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:6;}}i:23;a:4:{s:1:\"a\";i:24;s:1:\"b\";s:24:\"ver reportes financieros\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:6;}}i:24;a:4:{s:1:\"a\";i:25;s:1:\"b\";s:25:\"generar reporte morosidad\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:25;a:4:{s:1:\"a\";i:26;s:1:\"b\";s:28:\"generar estado cuenta masivo\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:26;a:4:{s:1:\"a\";i:27;s:1:\"b\";s:20:\"ver dashboard tienda\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:27;a:4:{s:1:\"a\";i:28;s:1:\"b\";s:27:\"gestionar inventario tienda\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:28;a:4:{s:1:\"a\";i:29;s:1:\"b\";s:25:\"evaluar pedidos ecommerce\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:29;a:4:{s:1:\"a\";i:30;s:1:\"b\";s:31:\"modificar catalogos comerciales\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:30;a:4:{s:1:\"a\";i:31;s:1:\"b\";s:26:\"gestionar roles y permisos\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:31;a:4:{s:1:\"a\";i:32;s:1:\"b\";s:30:\"configurar parametros globales\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}}s:5:\"roles\";a:7:{i:0;a:3:{s:1:\"a\";i:1;s:1:\"b\";s:10:\"SuperAdmin\";s:1:\"c\";s:3:\"web\";}i:1;a:3:{s:1:\"a\";i:2;s:1:\"b\";s:16:\"Oficial Crédito\";s:1:\"c\";s:3:\"web\";}i:2;a:3:{s:1:\"a\";i:3;s:1:\"b\";s:6:\"Cajero\";s:1:\"c\";s:3:\"web\";}i:3;a:3:{s:1:\"a\";i:4;s:1:\"b\";s:10:\"Socio Base\";s:1:\"c\";s:3:\"web\";}i:4;a:3:{s:1:\"a\";i:5;s:1:\"b\";s:20:\"Oficial de Créditos\";s:1:\"c\";s:3:\"web\";}i:5;a:3:{s:1:\"a\";i:6;s:1:\"b\";s:8:\"Tesorero\";s:1:\"c\";s:3:\"web\";}i:6;a:3:{s:1:\"a\";i:7;s:1:\"b\";s:16:\"Cajero Operativo\";s:1:\"c\";s:3:\"web\";}}}', 1791155451);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cajas`
--

CREATE TABLE `cajas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `fecha_apertura` datetime NOT NULL,
  `fecha_cierre` datetime DEFAULT NULL,
  `saldo_inicial_bob` decimal(12,2) NOT NULL DEFAULT 0.00,
  `saldo_inicial_usd` decimal(12,2) NOT NULL DEFAULT 0.00,
  `saldo_final_bob` decimal(12,2) DEFAULT NULL,
  `saldo_final_usd` decimal(12,2) DEFAULT NULL,
  `estado` enum('abierta','cerrada') NOT NULL DEFAULT 'abierta',
  `observaciones_apertura` text DEFAULT NULL,
  `observaciones_cierre` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `caja_denominaciones`
--

CREATE TABLE `caja_denominaciones` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `caja_id` bigint(20) UNSIGNED NOT NULL,
  `tipo` enum('apertura','cierre') NOT NULL,
  `moneda` enum('BOB','USD') NOT NULL,
  `denominacion` decimal(8,2) NOT NULL COMMENT 'Valor facial del billete/moneda',
  `cantidad` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `subtotal` decimal(12,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `caja_denominaciones`
--

INSERT INTO `caja_denominaciones` (`id`, `caja_id`, `tipo`, `moneda`, `denominacion`, `cantidad`, `subtotal`, `created_at`, `updated_at`) VALUES
(1, 1, 'apertura', 'BOB', 200.00, 2, 400.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(2, 1, 'apertura', 'BOB', 100.00, 4, 400.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(3, 1, 'apertura', 'BOB', 50.00, 3, 150.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(4, 1, 'apertura', 'BOB', 20.00, 10, 200.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(5, 1, 'apertura', 'BOB', 10.00, 9, 90.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(6, 1, 'apertura', 'BOB', 5.00, 4, 20.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(7, 1, 'cierre', 'BOB', 200.00, 2, 400.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(8, 1, 'cierre', 'BOB', 100.00, 3, 300.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(9, 1, 'cierre', 'BOB', 50.00, 7, 350.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(10, 1, 'cierre', 'BOB', 20.00, 11, 220.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(11, 1, 'cierre', 'BOB', 10.00, 6, 60.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(12, 1, 'cierre', 'BOB', 5.00, 6, 30.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(13, 2, 'apertura', 'BOB', 200.00, 2, 400.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(14, 2, 'apertura', 'BOB', 100.00, 6, 600.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(15, 2, 'apertura', 'BOB', 50.00, 4, 200.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(16, 2, 'apertura', 'BOB', 20.00, 12, 240.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(17, 2, 'apertura', 'BOB', 10.00, 8, 80.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(18, 2, 'apertura', 'BOB', 5.00, 5, 25.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(19, 2, 'cierre', 'BOB', 200.00, 1, 200.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(20, 2, 'cierre', 'BOB', 100.00, 2, 200.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(21, 2, 'cierre', 'BOB', 50.00, 6, 300.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(22, 2, 'cierre', 'BOB', 20.00, 15, 300.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(23, 2, 'cierre', 'BOB', 10.00, 11, 110.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(24, 2, 'cierre', 'BOB', 5.00, 5, 25.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(25, 3, 'apertura', 'BOB', 200.00, 1, 200.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(26, 3, 'apertura', 'BOB', 100.00, 3, 300.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(27, 3, 'apertura', 'BOB', 50.00, 7, 350.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(28, 3, 'apertura', 'BOB', 20.00, 6, 120.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(29, 3, 'apertura', 'BOB', 10.00, 9, 90.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(30, 3, 'apertura', 'BOB', 5.00, 3, 15.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(31, 3, 'cierre', 'BOB', 200.00, 1, 200.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(32, 3, 'cierre', 'BOB', 100.00, 5, 500.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(33, 3, 'cierre', 'BOB', 50.00, 9, 450.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(34, 3, 'cierre', 'BOB', 20.00, 13, 260.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(35, 3, 'cierre', 'BOB', 10.00, 6, 60.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(36, 4, 'apertura', 'BOB', 200.00, 3, 600.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(37, 4, 'apertura', 'BOB', 100.00, 2, 200.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(38, 4, 'apertura', 'BOB', 50.00, 5, 250.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(39, 4, 'apertura', 'BOB', 20.00, 12, 240.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(40, 4, 'apertura', 'BOB', 10.00, 5, 50.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(41, 4, 'apertura', 'BOB', 5.00, 5, 25.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(42, 4, 'cierre', 'BOB', 200.00, 3, 600.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(43, 4, 'cierre', 'BOB', 100.00, 5, 500.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(44, 4, 'cierre', 'BOB', 50.00, 3, 150.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(45, 4, 'cierre', 'BOB', 20.00, 14, 280.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(46, 4, 'cierre', 'BOB', 10.00, 9, 90.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(47, 4, 'cierre', 'BOB', 5.00, 6, 30.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(48, 5, 'apertura', 'BOB', 200.00, 3, 600.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(49, 5, 'apertura', 'BOB', 100.00, 5, 500.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(50, 5, 'apertura', 'BOB', 50.00, 8, 400.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(51, 5, 'apertura', 'BOB', 20.00, 7, 140.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(52, 5, 'apertura', 'BOB', 10.00, 9, 90.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(53, 5, 'apertura', 'BOB', 5.00, 5, 25.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(54, 5, 'cierre', 'BOB', 200.00, 3, 600.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(55, 5, 'cierre', 'BOB', 100.00, 3, 300.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(56, 5, 'cierre', 'BOB', 50.00, 9, 450.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(57, 5, 'cierre', 'BOB', 20.00, 18, 360.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(58, 5, 'cierre', 'BOB', 10.00, 6, 60.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(59, 5, 'cierre', 'BOB', 5.00, 1, 5.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(60, 6, 'apertura', 'BOB', 200.00, 3, 600.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(61, 6, 'apertura', 'BOB', 100.00, 4, 400.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(62, 6, 'apertura', 'BOB', 50.00, 6, 300.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(63, 6, 'apertura', 'BOB', 20.00, 12, 240.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(64, 6, 'apertura', 'BOB', 10.00, 6, 60.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(65, 6, 'apertura', 'BOB', 5.00, 5, 25.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(66, 6, 'cierre', 'BOB', 200.00, 1, 200.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(67, 6, 'cierre', 'BOB', 100.00, 3, 300.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(68, 6, 'cierre', 'BOB', 50.00, 10, 500.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(69, 6, 'cierre', 'BOB', 20.00, 13, 260.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(70, 6, 'cierre', 'BOB', 10.00, 9, 90.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(71, 6, 'cierre', 'BOB', 5.00, 2, 10.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(72, 7, 'apertura', 'BOB', 200.00, 2, 400.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(73, 7, 'apertura', 'BOB', 100.00, 6, 600.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(74, 7, 'apertura', 'BOB', 50.00, 6, 300.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(75, 7, 'apertura', 'BOB', 20.00, 13, 260.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(76, 7, 'apertura', 'BOB', 10.00, 7, 70.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(77, 7, 'cierre', 'BOB', 200.00, 2, 400.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(78, 7, 'cierre', 'BOB', 100.00, 5, 500.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(79, 7, 'cierre', 'BOB', 50.00, 3, 150.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(80, 7, 'cierre', 'BOB', 20.00, 6, 120.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(81, 7, 'cierre', 'BOB', 10.00, 7, 70.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05'),
(82, 7, 'cierre', 'BOB', 5.00, 3, 15.00, '2026-05-28 19:22:05', '2026-05-28 19:22:05');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `caja_movimientos`
--

CREATE TABLE `caja_movimientos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `caja_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `fecha` datetime NOT NULL,
  `tipo` enum('ingreso','egreso') NOT NULL,
  `concepto` varchar(255) NOT NULL,
  `categoria` varchar(255) NOT NULL COMMENT 'venta_ecommerce, pago_credito, aporte, desembolso, gasto, deposito_banco, retiro, otro',
  `monto_bob` decimal(12,2) NOT NULL DEFAULT 0.00,
  `monto_usd` decimal(12,2) NOT NULL DEFAULT 0.00,
  `metodo_pago` enum('efectivo','qr_banco','transferencia') NOT NULL DEFAULT 'efectivo',
  `referencia_tipo` varchar(255) DEFAULT NULL COMMENT 'Modelo origen: Pedido, Credito, PlanPago',
  `referencia_id` bigint(20) UNSIGNED DEFAULT NULL,
  `numero_comprobante` varchar(255) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `icono` varchar(50) DEFAULT NULL,
  `color` varchar(20) DEFAULT NULL,
  `orden` int(11) NOT NULL DEFAULT 0,
  `activa` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `slug`, `descripcion`, `icono`, `color`, `orden`, `activa`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Medico', 'medico', 'Equipamiento médico y primeros auxilios para el personal policial.', NULL, NULL, 0, 1, '2026-05-28 19:20:56', '2026-06-03 00:59:03', NULL),
(2, 'Ropa', 'ropa', 'Indumentaria táctica y uniformes institucionales de alta calidad.', NULL, NULL, 0, 1, '2026-05-28 19:20:56', '2026-05-28 19:22:02', NULL),
(3, 'Bebidas', 'bebidas', 'Bebidas naturales y artesanales de producción nacional boliviana.', NULL, NULL, 0, 1, '2026-05-28 19:20:56', '2026-05-28 19:22:02', NULL),
(4, 'Libros', 'libros', 'Publicaciones de desarrollo profesional, jurídico y personal.', NULL, NULL, 0, 1, '2026-05-28 19:20:56', '2026-05-28 19:22:02', NULL),
(5, 'Farmacos', 'farmacos', 'Fármacos y productos naturales para nuestros clientes', NULL, '#c41f1f', 5, 1, '2026-06-03 00:59:46', '2026-06-03 00:59:46', NULL),
(6, 'TIENDA PAQUITO', 'tienda-paquito', 'VARIEDAD DE PRODUCTOS ', NULL, NULL, 0, 1, '2026-09-26 17:00:34', '2026-09-26 17:00:48', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compras_convenio`
--

CREATE TABLE `compras_convenio` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `persona_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `beneficio_id` bigint(20) UNSIGNED NOT NULL,
  `monto_total` decimal(10,2) NOT NULL,
  `metodo_pago` varchar(255) NOT NULL DEFAULT 'QR' COMMENT 'Oficial: QR',
  `estado_pago` varchar(255) NOT NULL DEFAULT 'Pendiente' COMMENT 'Pendiente, Pagado, Rechazado',
  `codigo_transaccion_qr` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `configuraciones`
--

CREATE TABLE `configuraciones` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `configuraciones`
--

INSERT INTO `configuraciones` (`id`, `key`, `value`, `description`, `created_at`, `updated_at`) VALUES
(1, 'ecommerce_mostrar_precios', 'si', 'Mostrar precios a todos los usuarios (si/no)', '2026-04-03 17:31:24', '2026-06-03 02:19:24'),
(2, 'ecommerce_mostrar_stock', 'si', 'Mostrar cantidad de stock en tienda (si/no)', '2026-04-03 17:31:25', '2026-06-03 02:27:18'),
(3, 'ecommerce_habilitar_invitados', 'si', 'Permitir compras a usuarios no asociados (si/no)', '2026-04-03 17:31:25', '2026-04-14 20:19:58'),
(4, 'ecommerce_descuento_socios_global', '0', 'Descuento porcentual extra para socios en toda la tienda', '2026-04-03 17:31:25', '2026-07-10 14:40:19'),
(5, 'ecommerce_qr_pago', 'ecommerce/01KXHXHFEQVJ6W17B6GNZJ62GY.png', 'URL o base64 de la imagen QR para pagos', '2026-04-03 17:31:25', '2026-07-14 21:36:16'),
(6, 'ecommerce_limite_credito_default', '7000', 'Límite de crédito por defecto si no está definido en el socio', '2026-04-03 17:31:25', '2026-07-13 08:00:06'),
(7, 'ecommerce_pago_exige_caja', '0', 'Exigir que el administrador tenga una caja abierta para validar pagos de e-commerce.', '2026-04-03 17:31:27', '2026-04-14 20:19:58'),
(8, 'whatsapp_soporte', '59170000000', 'Número de WhatsApp de soporte para Servicios y E-commerce (formato internacional, ej: 59170000000)', '2026-04-03 17:31:28', '2026-04-03 22:19:58'),
(9, 'ecommerce_titulo_hero', 'Tienda de Beneficios', 'Título principal del hero de la tienda', '2026-04-03 17:31:28', '2026-04-14 20:19:58'),
(10, 'ecommerce_subtitulo_hero', 'FAPCLAS', 'Subtítulo o marca del hero de la tienda', '2026-04-03 17:31:28', '2026-04-14 20:19:58'),
(11, 'ecommerce_descripcion_hero', 'Equipamiento táctico, víveres y servicios con precios exclusivos para nuestros asociados. Abierto al público general.', 'Descripción del hero de la tienda', '2026-04-03 17:31:28', '2026-04-14 20:19:58'),
(12, 'ecommerce_badge_hero', 'BENEFICIOS EXCLUSIVOS', 'Badge del hero de la tienda', '2026-04-03 17:31:28', '2026-04-14 20:19:58'),
(13, 'ecommerce_mostrar_precio_venta', 'si', 'Mostrar precio de venta directa', '2026-04-03 17:31:28', '2026-04-14 20:19:58'),
(14, 'ecommerce_mostrar_precio_credito', 'si', 'Mostrar opción de crédito asociado', '2026-04-03 17:31:28', '2026-04-14 20:19:58'),
(15, 'ecommerce_modo_mantenimiento', 'no', 'Activar modo mantenimiento en la tienda', '2026-04-03 17:31:28', '2026-04-14 20:19:58'),
(16, 'ecommerce_nota_legal', 'Los precios pueden variar sin previo aviso. Sujeto a disponibilidad de stock.', 'Nota legal visible en la tienda', '2026-04-03 17:31:28', '2026-04-14 20:19:58'),
(17, 'ecommerce_horario_atencion', 'Lunes a Viernes 08:00 - 18:00', 'Horario de atención para recojo de productos', '2026-04-03 17:31:28', '2026-04-14 20:19:58'),
(18, 'ecommerce_direccion_tienda', 'Av. Principal #123, La Paz - Bolivia', 'Dirección de la tienda física', '2026-04-03 17:31:28', '2026-04-14 20:19:58'),
(19, 'ecommerce_telefono_tienda', '71634750', 'Teléfono de contacto de la tienda', '2026-04-03 17:31:28', '2026-07-10 14:40:19'),
(20, 'ecommerce_whatsapp_tienda', '', 'Link directo de WhatsApp para consultas', '2026-04-03 17:31:28', '2026-07-10 14:40:19'),
(21, 'backup_auto_enabled', '0', 'Activa el programador automático', '2026-04-03 22:17:21', '2026-04-03 22:19:57'),
(22, 'backup_days', '[]', 'Días de la semana para backup (0=Dom)', '2026-04-03 22:17:21', '2026-07-16 09:31:37'),
(23, 'backup_time_start', '08:00', 'Hora límite inicial', '2026-04-03 22:17:21', '2026-04-03 22:19:57'),
(24, 'backup_time_end', '18:00', 'Hora límite final', '2026-04-03 22:17:21', '2026-04-03 22:19:57'),
(25, 'backup_interval', 'daily', 'Frecuencia (daily, hourly, etc)', '2026-04-03 22:17:21', '2026-04-03 22:19:57'),
(26, 'ecommerce_hero_slides', '[{\"title\":\"Tu salud, nuestra prioridad\",\"subtitle\":\"Atenci\\u00f3n 24\\/7\",\"description\":\"Encuentra medicamentos, cuidado personal y asesor\\u00eda confiable en un solo lugar.\",\"button_text\":\"Comprar ahora\",\"button_link\":null,\"image\":\"ecommerce\\/hero\\/01KXNRVYT2FT02B2V0DCWT8QDS.png\"},{\"title\":\"Viste tu estilo\",\"subtitle\":\"Nueva colecci\\u00f3n\",\"description\":\"Descubre prendas modernas y c\\u00f3modas que realzan tu personalidad.\",\"button_text\":\"Explorar cat\\u00e1logo\",\"button_link\":null,\"image\":\"ecommerce\\/hero\\/01KXHVXXVCSTV2QVSB7FTYNPYH.png\"},{\"title\":\"Refresca tus momentos\",\"subtitle\":\"Promos de temporada\",\"description\":\"Desde energizantes, gaseosa, agua, tenemos la bebida perfecta para cada ocasi\\u00f3n.\",\"button_text\":\"Ver promociones\",\"button_link\":null,\"image\":\"ecommerce\\/hero\\/01KXHVYK8H85DXEY9V50NYJQJZ.png\"},{\"title\":\"Historias que inspiran\",\"subtitle\":\"Novedades literarias\",\"description\":\"Libros, revistas y material educativo para alimentar tu curiosidad y conocimiento.\",\"button_text\":\"Comprar libros\",\"button_link\":null,\"image\":\"ecommerce\\/hero\\/01KXHVYK8N9WE5J3WZB2HDXKQV.png\"}]', 'Diapositivas del carrusel Hero de Beneficios (JSON)', '2026-04-07 18:37:34', '2026-07-16 09:31:34'),
(27, 'app_logo_pdf', '', 'Logotipo Institucional para PDFs y Recibos', '2026-04-14 23:36:43', '2026-04-14 23:36:43'),
(28, 'app_terminos_recibo', '', 'Términos y Condiciones Legales en Recibos (Texto)', '2026-04-14 23:36:43', '2026-04-14 23:36:43'),
(29, 'ecommerce_envio_domicilio_activo', 'no', 'Habilitar o deshabilitar opción de Envíos a Domicilio en Checkout', '2026-06-03 05:24:38', '2026-06-03 05:27:38'),
(30, 'ecommerce_envio_domicilio_precio', '15.00', 'Precio/Costo del Envío a Domicilio', '2026-06-03 05:24:38', '2026-06-03 05:24:38'),
(31, 'user_theme', '', NULL, '2026-07-10 14:40:19', '2026-07-12 22:28:42'),
(32, 'backup_filename', '', NULL, '2026-07-10 14:40:19', '2026-07-10 14:40:19'),
(33, 'backup_cron_status', '', NULL, '2026-07-10 14:40:19', '2026-07-10 14:40:19'),
(34, 'backup_hora_inicio', '', NULL, '2026-07-10 14:40:19', '2026-07-10 14:40:19'),
(35, 'backup_hora_cierre', '', NULL, '2026-07-10 14:40:19', '2026-07-10 14:40:19'),
(36, 'backup_repeticion', '', NULL, '2026-07-10 14:40:19', '2026-07-10 14:40:19'),
(37, 'ecommerce_exigir_comprobante', 'si', NULL, '2026-07-14 21:08:07', '2026-07-14 21:36:16'),
(38, 'ecommerce_admin_sonido_pedido_tipo', 'personalizado', NULL, '2026-07-14 21:08:07', '2026-07-16 08:54:47'),
(39, 'ecommerce_pasarela_texto_comprobante', '', NULL, '2026-07-14 21:08:07', '2026-07-14 21:08:07'),
(40, 'ecommerce_pasarela_btn_confirmar', '', NULL, '2026-07-14 21:08:07', '2026-07-14 21:08:07'),
(41, 'ecommerce_admin_sonido_pedido_custom', 'ecommerce/sounds/01KXNPRJVP01JWPSTMKRVW7Y0K.wav', NULL, '2026-07-16 08:54:47', '2026-07-16 08:54:47');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `creditos`
--

CREATE TABLE `creditos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `persona_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `tipo_credito_id` bigint(20) UNSIGNED DEFAULT NULL,
  `monto_aprobado` decimal(15,2) NOT NULL,
  `saldo_capital` decimal(15,2) DEFAULT NULL COMMENT 'Saldo vivo del capital pendiente',
  `tasa_interes` decimal(5,2) NOT NULL COMMENT 'Porcentaje anual',
  `plazo_meses` int(11) NOT NULL,
  `estado` varchar(50) NOT NULL DEFAULT 'Solicitado' COMMENT 'Solicitado, Aprobado, Desembolsado, Pagado, En Mora',
  `metodo_descuento` varchar(255) NOT NULL DEFAULT 'Planilla' COMMENT 'Planilla, Pago Directo',
  `observaciones` text DEFAULT NULL,
  `aprobado_por` bigint(20) UNSIGNED DEFAULT NULL,
  `fecha_desembolso` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuentas_aportacion`
--

CREATE TABLE `cuentas_aportacion` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `persona_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `saldo_actual` decimal(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Fondo solidario total ahorrado',
  `estado` varchar(50) NOT NULL DEFAULT 'Activo' COMMENT 'Activo, Congelado, Cerrado',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `kardex`
--

CREATE TABLE `kardex` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `persona_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `fecha` date NOT NULL,
  `tipo_movimiento` varchar(50) NOT NULL COMMENT 'aporte, retiro, desembolso_credito, pago_cuota, interes_ganado, compra_convenio, ajuste, mora',
  `concepto` varchar(255) NOT NULL,
  `ingreso` decimal(15,2) NOT NULL DEFAULT 0.00,
  `egreso` decimal(15,2) NOT NULL DEFAULT 0.00,
  `saldo_acumulado` decimal(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Saldo corriente del socio después de este movimiento',
  `referencia_tipo` varchar(50) DEFAULT NULL COMMENT 'credito, plan_pago, compra_convenio, cuenta_aportacion, etc.',
  `referencia_id` bigint(20) UNSIGNED DEFAULT NULL COMMENT 'ID del registro que originó el movimiento',
  `metodo` varchar(50) DEFAULT NULL COMMENT 'Planilla, QR, Efectivo, Automático',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `kardex_productos`
--

CREATE TABLE `kardex_productos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `producto_id` bigint(20) UNSIGNED NOT NULL,
  `tipo_movimiento` enum('ingreso','egreso','ajuste') NOT NULL,
  `cantidad` int(11) NOT NULL,
  `saldo_stock` int(11) NOT NULL,
  `costo_unitario` decimal(10,2) DEFAULT NULL,
  `concepto` varchar(255) NOT NULL,
  `usuario_admin_id` bigint(20) UNSIGNED DEFAULT NULL,
  `notas` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `kardex_productos`
--

INSERT INTO `kardex_productos` (`id`, `producto_id`, `tipo_movimiento`, `cantidad`, `saldo_stock`, `costo_unitario`, `concepto`, `usuario_admin_id`, `notas`, `created_at`, `updated_at`) VALUES
(1, 8, 'egreso', 1, 74, 28.00, 'Venta - Pedido #ORD-00001', 1, 'Entrega de pedido #ORD-00001 al cliente Jose Ernesto', '2026-06-03 00:19:22', '2026-06-03 00:19:22'),
(2, 12, 'egreso', 1, 40, 98.00, 'Venta - Pedido #ORD-00002', 1, 'Entrega de pedido #ORD-00002 al cliente Jose Miguel Lopez', '2026-06-03 00:31:03', '2026-06-03 00:31:03'),
(3, 14, 'egreso', 1, 9, 15.00, 'Venta - Pedido #ORD-00003', 1, 'Entrega de pedido #ORD-00003 al cliente Comandante Root', '2026-06-22 17:22:15', '2026-06-22 17:22:15'),
(4, 12, 'egreso', 1, 39, 98.00, 'Venta - Pedido #ORD-00014', 1, 'Entrega de pedido #ORD-00014 al cliente Emilio Contreras SerranO', '2026-07-13 11:54:35', '2026-07-13 11:54:35'),
(5, 14, 'egreso', 1, 8, 15.00, 'Venta - Pedido #ORD-00020', 1, 'Entrega de pedido #ORD-00020 al cliente Jesus Romero Callau', '2026-07-14 08:36:31', '2026-07-14 08:36:31'),
(6, 13, 'ingreso', 1, 101, 3.00, 'Devolución por Anulación - Pedido #ORD-00018', 1, 'Pedido anulado/rechazado. Stock reintegrado al inventario.', '2026-07-14 08:36:44', '2026-07-14 08:36:44'),
(7, 13, 'ingreso', 1, 102, 3.00, 'Devolución por Anulación - Pedido #ORD-00007', 1, 'Pedido anulado/rechazado. Stock reintegrado al inventario.', '2026-07-14 21:39:03', '2026-07-14 21:39:03'),
(8, 13, 'ingreso', 1, 103, 3.00, 'Devolución por Anulación - Pedido #ORD-00006', 1, 'Pedido anulado/rechazado. Stock reintegrado al inventario.', '2026-07-14 21:39:07', '2026-07-14 21:39:07'),
(9, 4, 'ingreso', 1, 58, 350.00, 'Devolución por Anulación - Pedido #ORD-00005', 1, 'Pedido anulado/rechazado. Stock reintegrado al inventario.', '2026-07-14 21:39:10', '2026-07-14 21:39:10'),
(10, 13, 'ingreso', 2, 105, 3.00, 'Devolución por Anulación - Pedido #ORD-00026', 1, 'Pedido anulado/rechazado. Stock reintegrado al inventario.', '2026-07-15 22:22:00', '2026-07-15 22:22:00'),
(11, 14, 'egreso', 1, 7, 15.00, 'Venta - Pedido #ORD-00032', 1, 'Entrega de pedido #ORD-00032 al cliente tolen', '2026-08-16 19:01:43', '2026-08-16 19:01:43');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libro_diarios`
--

CREATE TABLE `libro_diarios` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `cajero_id` bigint(20) UNSIGNED DEFAULT NULL,
  `fecha` date NOT NULL,
  `concepto` varchar(255) NOT NULL,
  `ingreso` decimal(12,2) NOT NULL DEFAULT 0.00,
  `egreso` decimal(12,2) NOT NULL DEFAULT 0.00,
  `saldo` decimal(12,2) NOT NULL DEFAULT 0.00,
  `tipo_transaccion` varchar(255) NOT NULL,
  `referencia_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `libro_diarios`
--

INSERT INTO `libro_diarios` (`id`, `user_id`, `cajero_id`, `fecha`, `concepto`, `ingreso`, `egreso`, `saldo`, `tipo_transaccion`, `referencia_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2026-06-22', 'Pago E-commerce - Pedido #ORD-00003', 15.00, 0.00, 0.00, 'venta_ecommerce', 3, '2026-06-22 17:22:03', '2026-06-22 17:22:03'),
(2, NULL, 1, '2026-07-14', 'Pago E-commerce - Pedido #ORD-00024', 15.00, 0.00, 0.00, 'venta_ecommerce', 24, '2026-07-14 21:38:26', '2026-07-14 21:38:26'),
(3, NULL, 1, '2026-07-14', 'Pago E-commerce - Pedido #ORD-00023', 220.00, 0.00, 0.00, 'venta_ecommerce', 23, '2026-07-14 21:38:29', '2026-07-14 21:38:29'),
(4, 1, 1, '2026-07-14', 'Pago E-commerce - Pedido #ORD-00022', 18.00, 0.00, 0.00, 'venta_ecommerce', 22, '2026-07-14 21:38:38', '2026-07-14 21:38:38'),
(5, NULL, 1, '2026-07-14', 'Pago E-commerce - Pedido #ORD-00016', 350.00, 0.00, 0.00, 'venta_ecommerce', 16, '2026-07-14 21:38:43', '2026-07-14 21:38:43'),
(6, 1, 1, '2026-07-14', 'Pago E-commerce - Pedido #ORD-00012', 220.00, 0.00, 0.00, 'venta_ecommerce', 12, '2026-07-14 21:38:50', '2026-07-14 21:38:50'),
(7, 1, 1, '2026-07-14', 'Pago E-commerce - Pedido #ORD-00010', 350.00, 0.00, 0.00, 'venta_ecommerce', 10, '2026-07-14 21:38:53', '2026-07-14 21:38:53'),
(8, 1, 1, '2026-07-14', 'Pago E-commerce - Pedido #ORD-00009', 3.00, 0.00, 0.00, 'venta_ecommerce', 9, '2026-07-14 21:38:56', '2026-07-14 21:38:56'),
(9, 1, 1, '2026-07-14', 'Pago E-commerce - Pedido #ORD-00008', 350.00, 0.00, 0.00, 'venta_ecommerce', 8, '2026-07-14 21:38:58', '2026-07-14 21:38:58'),
(10, NULL, 1, '2026-07-14', 'Pago E-commerce - Pedido #ORD-00004', 350.00, 0.00, 0.00, 'venta_ecommerce', 4, '2026-07-14 21:39:16', '2026-07-14 21:39:16'),
(11, NULL, 1, '2026-07-14', 'Pago E-commerce - Pedido #ORD-00025', 3.00, 0.00, 0.00, 'venta_ecommerce', 25, '2026-07-14 21:40:55', '2026-07-14 21:40:55'),
(12, 1, 1, '2026-07-16', 'Pago E-commerce - Pedido #ORD-00027', 150.00, 0.00, 0.00, 'venta_ecommerce', 27, '2026-07-15 22:22:04', '2026-07-15 22:22:04'),
(13, NULL, 1, '2026-07-16', 'Pago E-commerce - Pedido #ORD-00028', 15.00, 0.00, 0.00, 'venta_ecommerce', 28, '2026-07-16 08:56:40', '2026-07-16 08:56:40'),
(14, NULL, 1, '2026-08-16', 'Pago E-commerce - Pedido #ORD-00032', 15.00, 0.00, 0.00, 'venta_ecommerce', 32, '2026-08-16 18:58:20', '2026-08-16 18:58:20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_03_20_033854_alter_users_table_for_police', 1),
(6, '2026_03_20_033937_create_creditos_table', 1),
(9, '2026_03_20_034350_create_permission_tables', 1),
(12, '2026_03_23_004145_add_v3_fields_to_creditos_and_pagos', 1),
(15, '2026_03_23_011455_create_configuracions_table', 1),
(16, '2026_03_23_025300_create_tipos_credito_table', 1),
(17, '2026_03_23_025301_add_tipo_credito_fields_to_creditos', 1),
(21, '2026_03_23_141628_create_productos_table', 1),
(23, '2026_03_23_141630_create_pedidos_table', 1),
(25, '2026_03_23_143358_add_ecommerce_settings_to_configuraciones_table', 1),
(26, '2026_03_23_182533_add_logistics_to_pedidos_table', 1),
(27, '2026_03_24_193502_add_whatsapp_to_users_table', 1),
(29, '2026_03_27_132742_add_theme_preference_to_users_table', 1),
(30, '2026_03_28_020712_add_preguntas_secretas_to_users_table', 1),
(33, '2026_03_31_134432_alter_users_table_for_personas', 1),
(36, '2026_03_31_150212_migrate_financial_entities_to_persona_centric', 1),
(41, '2026_04_01_155715_add_persona_id_to_pedidos_table', 1),
(42, '2026_04_01_220000_add_extended_fields_to_productos_table', 1),
(44, '2026_04_02_134227_insert_ecommerce_pago_exige_caja_into_configuraciones', 1),
(47, '2026_04_17_143800_fix_pedidos_tipo_entrega_enum', 3),
(48, '2026_04_17_150000_add_performance_indexes', 4),
(49, '2026_03_20_033936_create_cuentas_aportacion_table', 5),
(50, '2026_03_20_033937_create_movimientos_aportacion_table', 5),
(51, '2026_03_20_033938_create_plan_pagos_table', 5),
(52, '2026_03_23_000038_create_libro_diarios_table', 5),
(53, '2026_03_23_000950_create_notifications_table', 5),
(54, '2026_03_23_004146_create_beneficios_table', 5),
(55, '2026_03_23_004146_create_compras_convenio_table', 5),
(56, '2026_03_23_025302_add_mora_to_plan_pagos', 5),
(57, '2026_03_23_025303_create_kardex_table', 5),
(58, '2026_03_23_141627_create_categorias_table', 5),
(59, '2026_03_23_141629_create_kardex_productos_table', 5),
(60, '2026_03_23_141631_create_pedido_detalles_table', 5),
(61, '2026_03_25_003011_create_pages_table', 5),
(62, '2026_03_30_101800_create_noticias_table', 5),
(63, '2026_03_31_134410_create_personas_table', 5),
(64, '2026_03_31_142120_add_extended_work_fields_to_personas_table', 5),
(65, '2026_03_31_144453_add_security_and_family_fields_to_personas_table', 5),
(66, '2026_03_31_191615_add_cajero_to_libro_diarios', 5),
(67, '2026_03_31_200001_create_cajas_table', 5),
(68, '2026_03_31_200002_create_caja_denominaciones_table', 5),
(69, '2026_03_31_200003_create_caja_movimientos_table', 5),
(70, '2026_04_01_220001_add_extra_fields_to_categorias_table', 5),
(71, '2026_04_02_183600_create_site_settings_table', 5),
(72, '2026_04_15_190000_create_servicios_table', 5),
(73, '2026_05_29_000001_add_promo_popup_to_site_settings', 6),
(74, '2026_05_29_141802_fix_missing_persona_id_in_financial_tables', 7),
(75, '2026_05_29_180000_add_softdeletes_to_compras_convenio_table', 8),
(76, '2026_06_03_000001_expand_tipo_pago_enum_in_pedidos', 9),
(77, '2026_06_22_103423_change_imagen_path_to_json_in_productos_table', 10),
(78, '2026_07_10_095616_add_style_settings_to_site_settings_table', 11);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(1, 'App\\Models\\User', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos_aportacion`
--

CREATE TABLE `movimientos_aportacion` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cuenta_aportacion_id` bigint(20) UNSIGNED NOT NULL,
  `tipo` varchar(50) NOT NULL COMMENT 'Ingreso, Retiro, Interés',
  `monto` decimal(15,2) NOT NULL COMMENT 'Valor transaccionado',
  `descripcion` varchar(255) DEFAULT NULL,
  `fecha_movimiento` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `noticias`
--

CREATE TABLE `noticias` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `categoria` varchar(255) NOT NULL DEFAULT 'Institucional',
  `fecha` date NOT NULL,
  `resumen` text DEFAULT NULL,
  `contenido` longtext DEFAULT NULL,
  `imagen_path` varchar(255) DEFAULT NULL,
  `color_accent` varchar(255) NOT NULL DEFAULT 'primary',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `noticias`
--

INSERT INTO `noticias` (`id`, `titulo`, `slug`, `categoria`, `fecha`, `resumen`, `contenido`, `imagen_path`, `color_accent`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Nueva Campaña de Crédito de Vivienda Policial 2026', 'nueva-campana-credito-vivienda-policial-2026', 'Créditos', '2026-03-20', 'Conoce los nuevos requisitos flexibilizados para acceder a tu primera vivienda propia con las tasas más competitivas del sector solidario.', '<p>Nos complace anunciar el lanzamiento de nuestra nueva campa&ntilde;a de cr&eacute;dito orientada a la <strong>Vivienda Policial</strong> para la gesti&oacute;n 2026. Esta iniciativa busca facilitar el acceso a la vivienda propia para todos nuestros socios con condiciones preferenciales.</p><h3>Beneficios Principales:</h3><ul><li>Tasas de inter&eacute;s competitivas.</li><li>Plazos extendidos hasta 30 a&ntilde;os.</li><li>Requisitos simplificados para socios activos.</li></ul><p>Para m&aacute;s informaci&oacute;n, puedes visitarnos en nuestras oficinas centrales o solicitar una cita con un asesor financiero.</p>', NULL, 'blue', 1, '2026-05-28 19:20:56', '2026-05-28 19:20:56'),
(2, 'Asamblea Anual Ordinaria Reguladora AFCOOP', 'asamblea-anual-ordinaria-reguladora-afcoop', 'Institucional', '2026-03-15', 'FAPCLAS R.L. rinde cuentas de la gestión financiera. Transparencia corporativa comprobada y nuevos hitos patrimoniales alcanzados.', '<p>En cumplimiento con las normativas vigentes de la <strong>AFCOOP</strong>, se llev&oacute; a cabo la Asamblea Anual Ordinaria donde se presentaron los estados financieros de la gesti&oacute;n pasada.</p><blockquote>&quot;La transparencia es el pilar fundamental de nuestra cooperativa, y los resultados de este a&ntilde;o demuestran la solidez de nuestro patrimonio.&quot;</blockquote><p>Agradecemos a todos los delegados y socios por su participaci&oacute;n activa en la toma de decisiones para el futuro de FAPCLAS R.L.</p>', NULL, 'primary', 1, '2026-05-28 19:20:56', '2026-05-28 19:20:56'),
(3, 'Convenio Médico Estratégico: Red Nacional de Salud', 'convenio-medico-estrategico-red-nacional-salud', 'Beneficios', '2026-03-10', 'Ampliamos nuestra cobertura de convenios hospitalarios para todos los socios policiales activos y sus familias directas en todo Bolivia.', '<p>FAPCLAS R.L. ha firmado un acuerdo hist&oacute;rico con la <strong>Red Nacional de Salud</strong> para brindar cobertura m&eacute;dica de alta calidad a todos nuestros socios.</p><ul><li>Descuentos en consultas de especialidad.</li><li>Cobertura en hospitalizaci&oacute;n programada.</li><li>Acceso a farmacias con precios preferenciales.</li></ul><p>Este beneficio ya est&aacute; disponible presentando tu carnet de socio en los centros autorizados a nivel nacional.</p>', NULL, 'emerald', 1, '2026-05-28 19:20:56', '2026-05-28 19:20:56');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notifications`
--

CREATE TABLE `notifications` (
  `id` char(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `notifiable_type` varchar(255) NOT NULL,
  `notifiable_id` bigint(20) UNSIGNED NOT NULL,
  `data` text NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `notifications`
--

INSERT INTO `notifications` (`id`, `type`, `notifiable_type`, `notifiable_id`, `data`, `read_at`, `created_at`, `updated_at`) VALUES
('2ce96b8c-3797-41fc-a668-e7459a0b8ced', 'App\\Notifications\\NotificacionPedido', 'App\\Models\\User', 1, '{\"pedido_id\":17,\"numero_orden\":\"ORD-00017\",\"estado_pago\":\"pagado\",\"estado_entrega\":\"por_recoger\",\"mensaje\":\"Tu pedido #ORD-00017 ha sido actualizado. Pago: pagado. Entrega: por_recoger.\"}', NULL, '2026-07-13 17:12:02', '2026-07-13 17:12:02'),
('3820731d-be16-4ed5-92ad-d7bc1ba5bbd5', 'App\\Notifications\\NotificacionPedido', 'App\\Models\\User', 1, '{\"pedido_id\":27,\"numero_orden\":\"ORD-00027\",\"estado_pago\":\"pendiente_validacion\",\"estado_entrega\":\"por_recoger\",\"mensaje\":\"Tu pedido #ORD-00027 ha sido actualizado. Pago: pendiente_validacion. Entrega: por_recoger.\"}', NULL, '2026-07-15 22:21:03', '2026-07-15 22:21:03'),
('471ae06e-2037-4b21-a02e-2fb73666d906', 'App\\Notifications\\NotificacionPedido', 'App\\Models\\User', 1, '{\"pedido_id\":1,\"numero_orden\":\"ORD-00001\",\"estado_pago\":\"pagado\",\"estado_entrega\":\"por_recoger\",\"mensaje\":\"Tu pedido #ORD-00001 ha sido actualizado. Pago: pagado. Entrega: por_recoger.\"}', NULL, '2026-06-02 23:56:28', '2026-06-02 23:56:28'),
('59a3f113-1b30-4104-b965-9a2e6b108129', 'App\\Notifications\\NotificacionPedido', 'App\\Models\\User', 1, '{\"pedido_id\":8,\"numero_orden\":\"ORD-00008\",\"estado_pago\":\"pagado\",\"estado_entrega\":\"por_recoger\",\"mensaje\":\"Tu pedido #ORD-00008 ha sido actualizado. Pago: pagado. Entrega: por_recoger.\"}', NULL, '2026-05-29 02:47:40', '2026-05-29 02:47:40'),
('8b4f1f9f-a4a4-46ad-9575-edef1c431c9a', 'App\\Notifications\\NotificacionPedido', 'App\\Models\\User', 1, '{\"pedido_id\":13,\"numero_orden\":\"ORD-00013\",\"estado_pago\":\"pagado\",\"estado_entrega\":\"por_recoger\",\"mensaje\":\"Tu pedido #ORD-00013 ha sido actualizado. Pago: pagado. Entrega: por_recoger.\"}', NULL, '2026-07-13 09:47:38', '2026-07-13 09:47:38'),
('d3b7ebcb-82f9-4b51-bc39-3271d94aa35f', 'App\\Notifications\\NotificacionPedido', 'App\\Models\\User', 1, '{\"pedido_id\":11,\"numero_orden\":\"ORD-00011\",\"estado_pago\":\"pagado\",\"estado_entrega\":\"por_recoger\",\"mensaje\":\"Tu pedido #ORD-00011 ha sido actualizado. Pago: pagado. Entrega: por_recoger.\"}', NULL, '2026-07-13 08:03:03', '2026-07-13 08:03:03'),
('e6e47d84-e71e-4285-beec-e85ce8f8860f', 'App\\Notifications\\NotificacionPedido', 'App\\Models\\User', 1, '{\"pedido_id\":34,\"numero_orden\":\"ORD-00034\",\"estado_pago\":\"pendiente_validacion\",\"estado_entrega\":\"por_recoger\",\"mensaje\":\"Tu pedido #ORD-00034 ha sido actualizado. Pago: pendiente_validacion. Entrega: por_recoger.\"}', NULL, '2026-09-26 20:54:53', '2026-09-26 20:54:53'),
('ee12599d-6ef6-42bb-818c-411b4bc720b5', 'App\\Notifications\\NotificacionPedido', 'App\\Models\\User', 1, '{\"pedido_id\":2,\"numero_orden\":\"ORD-00002\",\"estado_pago\":\"pagado\",\"estado_entrega\":\"por_recoger\",\"mensaje\":\"Tu pedido #ORD-00002 ha sido actualizado. Pago: pagado. Entrega: por_recoger.\"}', NULL, '2026-06-03 00:27:14', '2026-06-03 00:27:14');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pages`
--

CREATE TABLE `pages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`content`)),
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pages`
--

INSERT INTO `pages` (`id`, `title`, `slug`, `content`, `is_active`, `metadata`, `created_at`, `updated_at`) VALUES
(1, 'FAPCLAS R.L. - Tu Futuro Seguro', 'fapclas-rl-tu-futuro-seguro', '[{\"type\":\"hero\",\"data\":{\"title\":\"FAPCLAS R.L.\",\"subtitle\":\"Tu Futuro Seguro. Instituci\\u00f3n l\\u00edder en bienestar social y financiero para el personal policial.\",\"cta_text\":\"Ver Beneficios\",\"cta_link\":\"\\/beneficios\",\"slides\":[{\"title\":\"Cooperativa FAPCLAS R.L.\",\"subtitle\":\"Cr\\u00e9ditos seguros y f\\u00e1cil de solicitar\",\"description\":\"Cr\\u00e9ditos, ahorro y servicios exclusivos para la familia policial. Sin burocracia, sin filas.\",\"cta_text\":\"Conoce tus beneficios\",\"cta_link\":\"\\/beneficios\",\"image\":\"pages\\/heros\\/01KXMJ9ZBVJ2XG0AG6G24FBG4K.png\"},{\"title\":\"Tu esfuerzo\",\"subtitle\":\"merece crecer.\",\"description\":\"Cuentas de ahorro con 5% de rentabilidad anual. Seguridad garantizada para tu familia.\",\"cta_text\":\"Abre tu cuenta hoy\",\"cta_link\":\"\\/beneficios\",\"image\":\"pages\\/heros\\/01KXMJ9ZBZAPT52HBEBW41YY87.png\"},{\"title\":\"\\u00bfNecesitas un pr\\u00e9stamo?\",\"subtitle\":\"Lo tienes.\",\"description\":\"Aprobaci\\u00f3n r\\u00e1pida, tasas justas y descuento directo por planilla. Sin estr\\u00e9s.\",\"cta_text\":\"Simula tu cr\\u00e9dito\",\"cta_link\":\"\\/creditos\\/solicitar\",\"image\":\"pages\\/heros\\/01KXMJ9ZC08MN5NDRH56BT6SGJ.png\"},{\"title\":\"FAPCLAS R.L.\",\"subtitle\":\"Tu Futuro Seguro\",\"description\":\"Instituci\\u00f3n l\\u00edder en bienestar social y financiero para el personal policial boliviano.\",\"cta_text\":\"Ver Servicios\",\"cta_link\":\"\\/beneficios\",\"image\":\"pages\\/heros\\/01KXMJ9ZC1VV0JPT4ZTEMW5YXF.png\"}]}},{\"type\":\"stats\",\"data\":{\"title\":\"Nuestra Identidad\",\"items\":[{\"label\":\"S\\u00e9nior\",\"value\":\"15k\",\"icon\":\"UserCheck\"},{\"label\":\"Proyectos\",\"value\":\"120+\",\"icon\":\"Briefcase\"},{\"label\":\"A\\u00f1os\",\"value\":\"25+\",\"icon\":\"Calendar\"},{\"label\":\"Oficinas\",\"value\":\"9\",\"icon\":\"MapPin\"}]}},{\"type\":\"video\",\"data\":{\"title\":\"Fapclas en Movimiento\",\"video_url\":\"https:\\/\\/www.youtube.com\\/watch?v=dQw4w9WgXcQ\",\"local_video_file\":null,\"main_thumbnail\":null,\"gallery\":[],\"subtitle\":\"Servicios Funerarios \",\"main_title\":\"SERVCIOS FUNERARIOS \",\"main_subtitle\":\"Bienvenidos a Jardines del Sur \",\"main_url\":null}},{\"type\":\"identity\",\"data\":{\"title\":\"Nacimos para Crecer, Servir y Transformar\",\"description\":\"Queridos socios y miembros de la familia policial boliviana, es un honor ser el sustento econ\\u00f3mico que respalda cada jornada de servicio. La transparencia, ayuda mutua y solidaridad no son solo ideales, sino el pilar en nuestra cooperativa.\",\"mission\":\"Somos una instituci\\u00f3n que brinda servicios financieros con calidad, calidez y eficiencia satisfaciendo las necesidad de todos nuestros asociados desarrollando estrategias modernas para garantizar la estabilidad econ\\u00f3mica, financiero mediante un sistema de ahorro y cr\\u00e9dito confiable y seguro, con un alcance a nivel nacional de toda nuestra familia policial.\",\"vision\":\"Ser una instituci\\u00f3n l\\u00edder en la atenci\\u00f3n a nuestros asociados brindando servicios competitivos con seguridad y solvencia en el mercado financiero enfocado a mejorar la calidad de vida de nuestra comunidad con responsabilidad social.\",\"counter_value\":3000,\"counter_label\":\"Socios Activos\",\"images\":[\"pages\\/identity\\/01KT6WBHF6S17MZ0M8TRDPCRT3.png\",\"pages\\/identity\\/01KT6WBHFGWZQ3QVJ5PDNYQC51.png\",\"pages\\/identity\\/01KT6WBHFY057C85AHZN50ARA3.png\"]}},{\"type\":\"video\",\"data\":{\"title\":\"Fapclas en Movimiento\",\"subtitle\":\"Nuestras oportunidades y crecimiento\",\"main_title\":\"Ayuda social con Medidamentos\",\"main_subtitle\":\"Farmacia Paquito.\",\"main_url\":null,\"local_video_file\":\"pages\\/videos_locales\\/01KT7FHTMAAQMY34R5QRXQ565Z.mp4\",\"main_thumbnail\":null,\"gallery\":[{\"title\":\"Ayuda social\",\"subtitle\":\"Ayuda social de Famarcia Paquito\",\"url\":null,\"local_video_file\":\"pages\\/videos_locales\\/01KT7HXTATYGB130DD5RX3NM8R.mp4\",\"thumbnail\":null},{\"title\":\"Ayuda Social\",\"subtitle\":\"Ayuda Social de Farmacia Paquito\",\"url\":null,\"local_video_file\":\"pages\\/videos_locales\\/01KT7J2T536ZG9RY9M37G07WSG.mp4\",\"thumbnail\":null},{\"title\":\"Apoyo Policial\",\"subtitle\":\"Apoyo Policial\",\"url\":null,\"local_video_file\":\"pages\\/videos_locales\\/01KT7JJSNHF200ZP2VQJEMHYGJ.mp4\",\"thumbnail\":null},{\"title\":\"Servicios Funerarios \",\"subtitle\":\"Servicios Funerarios\",\"url\":null,\"local_video_file\":null,\"thumbnail\":null}]}},{\"type\":\"services\",\"data\":{\"title\":\"Nuestros Beneficios Din\\u00e1micos\",\"subtitle\":\"Accede a cr\\u00e9ditos, tienda virtual y servicios exclusivos dise\\u00f1ados para tu crecimiento.\"}},{\"type\":\"gallery\",\"data\":{\"title\":\"NUESTRA FAMILIA POLICIAL Y LA SOCIEDAD\",\"subtitle\":\"Trabajamos para nuestros socios por el futuro de nuetras familias.\",\"items\":[{\"caption\":\"FAMILIA \",\"image\":\"pages\\/galleries\\/01KXMJVZANPGJC6T3A4024HQX1.jpg\"},{\"caption\":\"SOCIOS \",\"image\":\"pages\\/galleries\\/01KXMJRYHW9P0SSM0RSKQF6J34.jpg\"},{\"caption\":\"CAMARADAS\",\"image\":\"pages\\/galleries\\/01KXMJRYJ01VZVR6WY0BZA56EZ.jpg\"}]}}]', 1, '{\"seo_title\":\"Cooperativa de Ahorro y Cr\\u00e9dito \\\"FAPCLAS\\\" R.L\",\"seo_description\":\"FAPCLAS R.L. \\u2013 Cooperativa de ahorro y cr\\u00e9dito de la amilia Policial Boliviana. Soluciones financieras modernas, seguras y con responsabilidad social.\",\"og_image\":null}', '2026-05-28 19:20:56', '2026-07-16 09:59:52'),
(2, 'Leyes y Normativas', 'normativas', '[{\"type\":\"normativas\",\"data\":{\"title\":\"Repositorio Normativo Boliviano\",\"subtitle\":\"Regulados y respaldados oficialmente por el Estado Plurinacional de Bolivia para brindarte total seguridad t\\u00e9cnica y financiera.\",\"items\":[{\"name\":\"Ley de Servicios Financieros N\\u00b0 393\",\"label\":\"Fiscalizaci\\u00f3n Estatal\",\"description\":\"Normativa soberana aprobada en 2013 que regula de forma estricta las actividades plenas de intermediaci\\u00f3n financiera. FAPCLAS acata irrevocablemente el cumplimiento de los reglamentos determinados por ASFI.\",\"icon\":\"Library\",\"color\":\"blue\",\"file\":\"pages\\/normativas\\/ley-393.pdf\",\"button_text\":\"Descargar Ley 393 PDF\"},{\"name\":\"Ley General de Cooperativas N\\u00b0 356\",\"label\":\"Supervisi\\u00f3n Cooperativa\",\"description\":\"Establece categ\\u00f3ricamente el marco normativo vinculante para la constituci\\u00f3n org\\u00e1nica, funcionamiento asambleario y disoluci\\u00f3n del sector cooperativo bajo supervigilancia absoluta de AFCOOP.\",\"icon\":\"ShieldCheck\",\"color\":\"emerald\",\"file\":\"pages\\/normativas\\/ley-356.pdf\",\"button_text\":\"Descargar Ley 356 PDF\"},{\"name\":\"Estatuto Org\\u00e1nico Vigente\",\"label\":\"Gobernanza Interna\",\"description\":\"Nuestro instrumento regidor interno supremo que define sim\\u00e9tricamente los derechos irrenunciables, obligaciones institucionales y reg\\u00edmenes jer\\u00e1rquicos de beneficio para nuestros socios.\",\"icon\":\"FileText\",\"color\":\"primary\",\"file\":\"pages\\/normativas\\/estatuto.pdf\",\"button_text\":\"Ver Documento en Linea\"},{\"name\":\"Punto de Reclamo (PRF)\",\"label\":\"Protecci\\u00f3n al Socio\",\"description\":\"\\u00bfTienes una consulta t\\u00e9cnica o necesitas presentar tu disconformidad sobre los servicios? Accede al registro oficial PRF, respaldado inquebrantablemente por lineamientos de protecci\\u00f3n ASFI.\",\"icon\":\"MessageSquare\",\"color\":\"gold\",\"file\":\"pages\\/normativas\\/prf.pdf\",\"button_text\":\"Formulario Electr\\u00f3nico\"}]}}]', 1, NULL, '2026-05-28 19:20:56', '2026-05-28 19:20:56');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `numero_orden` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `persona_id` bigint(20) UNSIGNED DEFAULT NULL,
  `nombre_cliente` varchar(255) DEFAULT NULL,
  `ci_cliente` varchar(255) DEFAULT NULL,
  `telefono_contacto` varchar(255) DEFAULT NULL,
  `tipo_pago` enum('qr','credito_asociado','efectivo','transferencia') NOT NULL,
  `tipo_entrega` enum('recojo_tienda','envio_domicilio') DEFAULT 'recojo_tienda',
  `direccion_envio` text DEFAULT NULL,
  `costo_envio` decimal(10,2) NOT NULL DEFAULT 0.00,
  `estado_pago` enum('pendiente_validacion','pagado','rechazado') NOT NULL,
  `estado_entrega` enum('por_recoger','entregado') NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `comprobante_qr_path` varchar(255) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id`, `numero_orden`, `user_id`, `persona_id`, `nombre_cliente`, `ci_cliente`, `telefono_contacto`, `tipo_pago`, `tipo_entrega`, `direccion_envio`, `costo_envio`, `estado_pago`, `estado_entrega`, `total`, `comprobante_qr_path`, `observaciones`, `created_at`, `updated_at`) VALUES
(1, 'ORD-00001', 1, 1, 'Jose Ernesto', '78945621', '66332255', 'efectivo', 'recojo_tienda', NULL, 0.00, 'pagado', 'entregado', 28.00, NULL, 'Pago en Efectivo', '2026-06-02 23:56:18', '2026-06-03 00:19:22'),
(2, 'ORD-00002', 1, 1, 'Jose Miguel Lopez', '5252555', '78945612', 'qr', 'recojo_tienda', NULL, 0.00, 'pagado', 'entregado', 98.00, NULL, NULL, '2026-06-03 00:25:08', '2026-06-03 00:31:03'),
(3, 'ORD-00003', 1, 1, 'Comandante Root', 'Andres', '78945612', 'efectivo', 'recojo_tienda', NULL, 0.00, 'pagado', 'entregado', 15.00, NULL, NULL, '2026-06-22 17:20:33', '2026-06-22 17:22:15'),
(4, 'ORD-00004', NULL, 6, 'ghg', 'ghg', 'ghgh', 'qr', 'recojo_tienda', NULL, 0.00, 'pagado', 'por_recoger', 350.00, NULL, NULL, '2026-07-10 13:42:19', '2026-07-14 21:39:16'),
(5, 'ORD-00005', NULL, 6, 'ghg', 'ghg', 'ghgh', 'qr', 'recojo_tienda', NULL, 0.00, 'rechazado', 'por_recoger', 350.00, NULL, '[AUDITORÍA 2026-07-14 23:39:10] Pedido anulado por Comandante Root. Stock devuelto al inventario.', '2026-07-10 13:42:22', '2026-07-14 21:39:10'),
(6, 'ORD-00006', 1, 1, 'Comandante Root', '43', '34', 'qr', 'recojo_tienda', NULL, 0.00, 'rechazado', 'por_recoger', 3.00, NULL, '[AUDITORÍA 2026-07-14 23:39:07] Pedido anulado por Comandante Root. Stock devuelto al inventario.', '2026-07-12 22:26:04', '2026-07-14 21:39:07'),
(7, 'ORD-00007', 1, 1, 'Comandante Root', '43', '34', 'qr', 'recojo_tienda', NULL, 0.00, 'rechazado', 'por_recoger', 3.00, NULL, '[AUDITORÍA 2026-07-14 23:39:03] Pedido anulado por Comandante Root. Stock devuelto al inventario.', '2026-07-12 22:26:05', '2026-07-14 21:39:03'),
(8, 'ORD-00008', 1, 1, 'Comandante Root', 'dd', '3434', 'qr', 'recojo_tienda', NULL, 0.00, 'pagado', 'por_recoger', 350.00, NULL, NULL, '2026-07-12 22:35:26', '2026-07-14 21:38:58'),
(9, 'ORD-00009', 1, 1, 'Comandante Root', '45', '45', 'qr', 'recojo_tienda', NULL, 0.00, 'pagado', 'por_recoger', 3.00, NULL, NULL, '2026-07-12 22:39:00', '2026-07-14 21:38:56'),
(10, 'ORD-00010', 1, 1, 'Comandante Root', '434', '343', 'qr', 'recojo_tienda', NULL, 0.00, 'pagado', 'por_recoger', 350.00, NULL, NULL, '2026-07-12 22:53:09', '2026-07-14 21:38:53'),
(11, 'ORD-00011', 1, 1, 'Rogelio Quispe Ramos', '32569745', '74586965', 'qr', 'recojo_tienda', NULL, 0.00, 'pagado', 'por_recoger', 770.00, NULL, NULL, '2026-07-13 07:35:16', '2026-07-13 08:03:02'),
(12, 'ORD-00012', 1, 1, 'Rolando Chirino Calle', '12548692', '71025684', 'qr', 'recojo_tienda', NULL, 0.00, 'pagado', 'por_recoger', 220.00, NULL, NULL, '2026-07-13 08:03:45', '2026-07-14 21:38:50'),
(13, 'ORD-00013', 1, 1, 'JUAN SILES CARDONA', '7845568', '78542411', 'qr', 'recojo_tienda', NULL, 0.00, 'pagado', 'por_recoger', 15.00, NULL, NULL, '2026-07-13 09:02:11', '2026-07-13 09:47:38'),
(14, 'ORD-00014', NULL, 7, 'Emilio Contreras SerranO', '36545566', '63502145', 'qr', 'recojo_tienda', NULL, 0.00, 'pagado', 'entregado', 98.00, NULL, NULL, '2026-07-13 11:21:11', '2026-07-13 11:54:35'),
(15, 'ORD-00015', NULL, 8, 'Tolentino', '6119109', '72143047', 'transferencia', 'recojo_tienda', NULL, 0.00, 'rechazado', 'entregado', 85.00, NULL, NULL, '2026-07-13 13:39:20', '2026-07-13 17:12:57'),
(16, 'ORD-00016', NULL, 9, 'bnbj', 'hjh', 'hjhj', 'qr', 'recojo_tienda', NULL, 0.00, 'pagado', 'por_recoger', 350.00, NULL, NULL, '2026-07-13 15:26:40', '2026-07-14 21:38:43'),
(17, 'ORD-00017', 1, 1, 'PERLA ANTONIA SERRANO QUISBERT', '26546654', '71245876', 'qr', 'recojo_tienda', NULL, 0.00, 'pagado', 'por_recoger', 163.00, NULL, NULL, '2026-07-13 17:11:44', '2026-07-13 17:12:02'),
(18, 'ORD-00018', 1, 1, 'Comandante ewfwfwe', '546516', '64564654', 'qr', 'recojo_tienda', NULL, 0.00, 'rechazado', 'por_recoger', 3.00, NULL, '[AUDITORÍA 2026-07-14 10:36:44] Pedido anulado por Comandante Root. Stock devuelto al inventario.', '2026-07-13 17:31:46', '2026-07-14 08:36:44'),
(19, 'ORD-00019', NULL, 10, 'Gabriel Quispe Callau', '2344828', '73737828', 'qr', 'recojo_tienda', NULL, 0.00, 'pagado', 'por_recoger', 925.00, NULL, NULL, '2026-07-14 06:03:58', '2026-07-14 06:04:29'),
(20, 'ORD-00020', NULL, 11, 'Jesus Romero Callau', '1273828', '77463889', 'qr', 'recojo_tienda', NULL, 0.00, 'pagado', 'entregado', 15.00, NULL, NULL, '2026-07-14 08:02:35', '2026-07-14 08:36:31'),
(21, 'ORD-00021', NULL, 12, 'Antonio Manasilla', '56132135', '63502451', 'qr', 'recojo_tienda', NULL, 0.00, 'pagado', 'por_recoger', 350.00, NULL, NULL, '2026-07-14 19:27:14', '2026-07-14 19:27:21'),
(22, 'ORD-00022', 1, 1, 'Comandante Root', '323', '2323', 'qr', 'recojo_tienda', NULL, 0.00, 'pagado', 'por_recoger', 18.00, NULL, NULL, '2026-07-14 21:05:36', '2026-07-14 21:38:38'),
(23, 'ORD-00023', NULL, 13, 'Ronald Alvaro Vargas', '8370225', '63604744', 'qr', 'recojo_tienda', NULL, 0.00, 'pagado', 'por_recoger', 220.00, 'comprobantes/dX51ZzisO8hiYllDYW7eF7i2MHSnXxCe3MZj3on8.jpg', NULL, '2026-07-14 21:29:27', '2026-07-14 21:38:29'),
(24, 'ORD-00024', NULL, 14, 'Julio Antonio ribera', '18372728', '77272779', 'qr', 'recojo_tienda', NULL, 0.00, 'pagado', 'por_recoger', 15.00, 'comprobantes/0tEoE5YYwFoTJIBzSbimUq4iQ0YiFigTJ9h6kw2Y.jpg', NULL, '2026-07-14 21:37:15', '2026-07-14 21:38:26'),
(25, 'ORD-00025', NULL, 15, 'Ricardo argollo tuni', '28373838', '77667278', 'qr', 'recojo_tienda', NULL, 0.00, 'pagado', 'por_recoger', 3.00, 'comprobantes/aM1pigiOvEzGZFWbXsc1xsDx7EtU93xILDABasFH.jpg', NULL, '2026-07-14 21:40:23', '2026-07-14 21:40:55'),
(26, 'ORD-00026', NULL, 16, 'Dd', '33', '333', 'qr', 'recojo_tienda', NULL, 0.00, 'rechazado', 'por_recoger', 6.00, 'comprobantes/lOXPM7N00YbJgD6i9cQyd0QSHZSnMoBWw4HCuhys.jpg', '[AUDITORÍA 2026-07-16 00:22:00] Pedido anulado por Comandante Root. Stock devuelto al inventario.', '2026-07-14 21:57:55', '2026-07-15 22:22:00'),
(27, 'ORD-00027', 1, 1, 'Selena Gomes Ramirez', '65484657', '78545874', 'qr', 'recojo_tienda', NULL, 0.00, 'pagado', 'por_recoger', 150.00, 'comprobantes/4A03nkTRd7vZkGWoPpOSjpL2sLEMSnqZhYtnV51M.jpg', NULL, '2026-07-15 22:20:38', '2026-07-15 22:22:04'),
(28, 'ORD-00028', NULL, 17, 'JUAN QUISPE TEJERINA', '18383782', '76543672', 'qr', 'recojo_tienda', NULL, 0.00, 'pagado', 'por_recoger', 15.00, 'comprobantes/x9v5TYaIWjEFcakKZUOcCOiDkOLu81cteQr3B8rY.jpg', NULL, '2026-07-16 08:56:05', '2026-07-16 08:56:40'),
(29, 'ORD-00029', NULL, 18, 'Tolentino', '12345678', '98765432', 'qr', 'recojo_tienda', NULL, 0.00, 'pendiente_validacion', 'por_recoger', 28.00, 'comprobantes/J6k6tlx6FlzKdGJAU9lIlxdyLf0WX6NT2MGqG7Qm.png', NULL, '2026-07-18 18:13:29', '2026-07-18 18:14:35'),
(30, 'ORD-00030', NULL, 8, 'ROQUE', '6119109', '72143049', 'qr', 'recojo_tienda', NULL, 0.00, 'pendiente_validacion', 'por_recoger', 420.00, NULL, NULL, '2026-07-18 19:09:35', '2026-07-18 19:09:35'),
(31, 'ORD-00031', NULL, 19, 'Olivia', '6418196', '72625178', 'qr', 'recojo_tienda', NULL, 0.00, 'pendiente_validacion', 'por_recoger', 700.00, 'comprobantes/61acXowuXHkYuu89K2yrJmJBZDMvP9utAw0MlQCL.jpg', NULL, '2026-07-25 11:19:04', '2026-07-25 11:19:38'),
(32, 'ORD-00032', NULL, 20, 'tolen', '6119119', '72143047', 'qr', 'recojo_tienda', NULL, 0.00, 'pagado', 'entregado', 15.00, 'comprobantes/hII9Faw4pzUqOrzEHjye741ofPMckZ2vOvg9f60L.jpg', NULL, '2026-08-16 18:39:30', '2026-08-16 19:01:43'),
(33, 'ORD-00033', NULL, 21, 'dsdsd', '2323', '2323', 'qr', 'recojo_tienda', NULL, 0.00, 'pendiente_validacion', 'por_recoger', 15.00, NULL, NULL, '2026-08-16 18:39:40', '2026-08-16 18:39:40'),
(34, 'ORD-00034', 1, 1, 'TOLE', '6119109', '72143047', 'qr', 'recojo_tienda', NULL, 0.00, 'pendiente_validacion', 'por_recoger', 15.00, 'comprobantes/3vIKOVVlMZyNxVh15z4H03fsR2uZBQYfSqbVVrqr.jpg', NULL, '2026-09-26 20:52:01', '2026-09-26 20:54:53'),
(35, 'ORD-00035', NULL, 22, 'Roqui', '6119108', '72149304', 'qr', 'recojo_tienda', NULL, 0.00, 'pendiente_validacion', 'por_recoger', 150.00, 'comprobantes/SbhSDXCpbls7MIi2HOC1wPVkUO0DA70jCWVnvrNY.jpg', NULL, '2026-09-26 22:11:02', '2026-09-26 22:11:31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido_detalles`
--

CREATE TABLE `pedido_detalles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `pedido_id` bigint(20) UNSIGNED NOT NULL,
  `producto_id` bigint(20) UNSIGNED NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pedido_detalles`
--

INSERT INTO `pedido_detalles` (`id`, `pedido_id`, `producto_id`, `cantidad`, `precio_unitario`, `subtotal`, `created_at`, `updated_at`) VALUES
(1, 1, 8, 1, 28.00, 28.00, '2026-06-02 23:56:18', '2026-06-02 23:56:18'),
(2, 2, 12, 1, 98.00, 98.00, '2026-06-03 00:25:08', '2026-06-03 00:25:08'),
(3, 3, 14, 1, 15.00, 15.00, '2026-06-22 17:20:33', '2026-06-22 17:20:33'),
(4, 4, 4, 1, 350.00, 350.00, '2026-07-10 13:42:19', '2026-07-10 13:42:19'),
(5, 5, 4, 1, 350.00, 350.00, '2026-07-10 13:42:22', '2026-07-10 13:42:22'),
(6, 6, 13, 1, 3.00, 3.00, '2026-07-12 22:26:04', '2026-07-12 22:26:04'),
(7, 7, 13, 1, 3.00, 3.00, '2026-07-12 22:26:05', '2026-07-12 22:26:05'),
(8, 8, 4, 1, 350.00, 350.00, '2026-07-12 22:35:26', '2026-07-12 22:35:26'),
(9, 9, 13, 1, 3.00, 3.00, '2026-07-12 22:39:00', '2026-07-12 22:39:00'),
(10, 10, 4, 1, 350.00, 350.00, '2026-07-12 22:53:09', '2026-07-12 22:53:09'),
(11, 11, 4, 1, 350.00, 350.00, '2026-07-13 07:35:16', '2026-07-13 07:35:16'),
(12, 11, 5, 1, 420.00, 420.00, '2026-07-13 07:35:16', '2026-07-13 07:35:16'),
(13, 12, 2, 1, 220.00, 220.00, '2026-07-13 08:03:45', '2026-07-13 08:03:45'),
(14, 13, 14, 1, 15.00, 15.00, '2026-07-13 09:02:11', '2026-07-13 09:02:11'),
(15, 14, 12, 1, 98.00, 98.00, '2026-07-13 11:21:11', '2026-07-13 11:21:11'),
(16, 15, 11, 1, 85.00, 85.00, '2026-07-13 13:39:20', '2026-07-13 13:39:20'),
(17, 16, 4, 1, 350.00, 350.00, '2026-07-13 15:26:40', '2026-07-13 15:26:40'),
(18, 17, 7, 1, 65.00, 65.00, '2026-07-13 17:11:44', '2026-07-13 17:11:44'),
(19, 17, 12, 1, 98.00, 98.00, '2026-07-13 17:11:44', '2026-07-13 17:11:44'),
(20, 18, 13, 1, 3.00, 3.00, '2026-07-13 17:31:46', '2026-07-13 17:31:46'),
(21, 19, 1, 1, 185.00, 185.00, '2026-07-14 06:03:58', '2026-07-14 06:03:58'),
(22, 19, 2, 2, 220.00, 440.00, '2026-07-14 06:03:58', '2026-07-14 06:03:58'),
(23, 19, 3, 2, 150.00, 300.00, '2026-07-14 06:03:58', '2026-07-14 06:03:58'),
(24, 20, 14, 1, 15.00, 15.00, '2026-07-14 08:02:35', '2026-07-14 08:02:35'),
(25, 21, 4, 1, 350.00, 350.00, '2026-07-14 19:27:14', '2026-07-14 19:27:14'),
(26, 22, 9, 1, 18.00, 18.00, '2026-07-14 21:05:36', '2026-07-14 21:05:36'),
(27, 23, 2, 1, 220.00, 220.00, '2026-07-14 21:29:27', '2026-07-14 21:29:27'),
(28, 24, 14, 1, 15.00, 15.00, '2026-07-14 21:37:15', '2026-07-14 21:37:15'),
(29, 25, 13, 1, 3.00, 3.00, '2026-07-14 21:40:23', '2026-07-14 21:40:23'),
(30, 26, 13, 2, 3.00, 6.00, '2026-07-14 21:57:55', '2026-07-14 21:57:55'),
(31, 27, 3, 1, 150.00, 150.00, '2026-07-15 22:20:38', '2026-07-15 22:20:38'),
(32, 28, 14, 1, 15.00, 15.00, '2026-07-16 08:56:05', '2026-07-16 08:56:05'),
(33, 29, 8, 1, 28.00, 28.00, '2026-07-18 18:13:29', '2026-07-18 18:13:29'),
(34, 30, 5, 1, 420.00, 420.00, '2026-07-18 19:09:35', '2026-07-18 19:09:35'),
(35, 31, 4, 2, 350.00, 700.00, '2026-07-25 11:19:04', '2026-07-25 11:19:04'),
(36, 32, 14, 1, 15.00, 15.00, '2026-08-16 18:39:30', '2026-08-16 18:39:30'),
(37, 33, 14, 1, 15.00, 15.00, '2026-08-16 18:39:40', '2026-08-16 18:39:40'),
(38, 34, 20, 1, 15.00, 15.00, '2026-09-26 20:52:01', '2026-09-26 20:52:01'),
(39, 35, 19, 1, 150.00, 150.00, '2026-09-26 22:11:02', '2026-09-26 22:11:02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'gestionar usuarios', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(2, 'gestionar creditos', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(3, 'aprobar creditos', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(4, 'ver reportes', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(5, 'ver estado cuenta', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(6, 'gestionar caja', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(7, 'gestionar ecommerce', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(8, 'ver personas', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(9, 'crear personas', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(10, 'editar personas', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(11, 'eliminar personas', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(12, 'vincular cuentas usuario', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(13, 'ver creditos', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(14, 'crear creditos', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(15, 'editar creditos', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(16, 'evaluar creditos', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(17, 'eliminar creditos', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(18, 'cobrar cuotas creditos', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(19, 'ver libro diario', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(20, 'gestionar diario', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(21, 'ver kardex general', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(22, 'exportar kardex pdf', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(23, 'exportar kardex excel', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(24, 'ver reportes financieros', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(25, 'generar reporte morosidad', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(26, 'generar estado cuenta masivo', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(27, 'ver dashboard tienda', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(28, 'gestionar inventario tienda', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(29, 'evaluar pedidos ecommerce', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(30, 'modificar catalogos comerciales', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(31, 'gestionar roles y permisos', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(32, 'configurar parametros globales', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personas`
--

CREATE TABLE `personas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombres` varchar(255) NOT NULL,
  `apellidos` varchar(255) NOT NULL,
  `ci` varchar(20) NOT NULL,
  `ext_ci` varchar(5) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `genero` enum('MASCULINO','FEMENINO','OTRO') DEFAULT NULL,
  `estado_civil` varchar(20) DEFAULT NULL,
  `celular` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `direccion_domicilio` text DEFAULT NULL,
  `institucion` varchar(50) NOT NULL,
  `grado` varchar(50) DEFAULT NULL,
  `escalafon` varchar(50) DEFAULT NULL,
  `destino` varchar(100) DEFAULT NULL,
  `sueldo_neto` decimal(12,2) DEFAULT NULL,
  `fecha_ingreso_inst` date DEFAULT NULL,
  `situacion_laboral` varchar(50) DEFAULT NULL,
  `especialidad` varchar(100) DEFAULT NULL,
  `unidad_dependencia` varchar(100) DEFAULT NULL,
  `tipo_afiliacion` varchar(255) NOT NULL DEFAULT 'SOCIO',
  `contacto_emergencia_nom` varchar(255) DEFAULT NULL,
  `contacto_emergencia_tel` varchar(255) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `grado_instruccion` varchar(255) DEFAULT NULL,
  `profesion` varchar(255) DEFAULT NULL,
  `conyuge_nombre` varchar(255) DEFAULT NULL,
  `conyuge_celular` varchar(20) DEFAULT NULL,
  `numero_hijos` int(11) NOT NULL DEFAULT 0,
  `garantia_tipo` varchar(50) NOT NULL,
  `garantia_vehiculo_modelo` varchar(255) DEFAULT NULL,
  `garantia_vehiculo_placa` varchar(255) DEFAULT NULL,
  `garantia_inmueble_folio` varchar(255) DEFAULT NULL,
  `garantia_inmueble_dir` text DEFAULT NULL,
  `garantia_monto_valorado` decimal(15,2) DEFAULT NULL,
  `garantia_codigo` varchar(50) DEFAULT NULL,
  `garantia_estado` varchar(20) NOT NULL DEFAULT 'VIGENTE',
  `garantia_detalle` text DEFAULT NULL,
  `garantia_fecha_constitucion` date DEFAULT NULL,
  `garantia_ubicacion_docs` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `personas`
--

INSERT INTO `personas` (`id`, `nombres`, `apellidos`, `ci`, `ext_ci`, `fecha_nacimiento`, `genero`, `estado_civil`, `celular`, `email`, `direccion_domicilio`, `institucion`, `grado`, `escalafon`, `destino`, `sueldo_neto`, `fecha_ingreso_inst`, `situacion_laboral`, `especialidad`, `unidad_dependencia`, `tipo_afiliacion`, `contacto_emergencia_nom`, `contacto_emergencia_tel`, `observaciones`, `grado_instruccion`, `profesion`, `conyuge_nombre`, `conyuge_celular`, `numero_hijos`, `garantia_tipo`, `garantia_vehiculo_modelo`, `garantia_vehiculo_placa`, `garantia_inmueble_folio`, `garantia_inmueble_dir`, `garantia_monto_valorado`, `garantia_codigo`, `garantia_estado`, `garantia_detalle`, `garantia_fecha_constitucion`, `garantia_ubicacion_docs`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'Fapclas', '1234567', NULL, NULL, NULL, NULL, NULL, 'admin@fapclas.com', NULL, 'Policía Boliviana', 'Cnl. DESP.', 'ADMIN-001', 'Central FAPCLAS', NULL, NULL, NULL, NULL, NULL, 'SOCIO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Ninguna', NULL, NULL, NULL, NULL, NULL, NULL, 'VIGENTE', NULL, NULL, NULL, '2026-05-28 19:20:54', '2026-05-29 18:56:37'),
(6, 'ghg', '(CLIENTE EXTERNO)', 'ghg', NULL, NULL, 'OTRO', NULL, 'ghgh', NULL, NULL, 'EXTERNO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EXTERNO', NULL, NULL, 'Creado automáticamente vía Ecommerce Checkout.', NULL, NULL, NULL, NULL, 0, 'NINGUNA', NULL, NULL, NULL, NULL, NULL, NULL, 'VIGENTE', NULL, NULL, NULL, '2026-07-10 13:42:19', '2026-07-10 13:42:19'),
(7, 'Emilio Contreras SerranO', '(CLIENTE EXTERNO)', '36545566', NULL, NULL, 'OTRO', NULL, '63502145', NULL, NULL, 'EXTERNO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EXTERNO', NULL, NULL, 'Creado automáticamente vía Ecommerce Checkout.', NULL, NULL, NULL, NULL, 0, 'NINGUNA', NULL, NULL, NULL, NULL, NULL, NULL, 'VIGENTE', NULL, NULL, NULL, '2026-07-13 11:21:10', '2026-07-13 11:21:10'),
(8, 'Tolentino', '(CLIENTE EXTERNO)', '6119109', NULL, NULL, 'OTRO', NULL, '72143047', NULL, NULL, 'EXTERNO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EXTERNO', NULL, NULL, 'Creado automáticamente vía Ecommerce Checkout.', NULL, NULL, NULL, NULL, 0, 'NINGUNA', NULL, NULL, NULL, NULL, NULL, NULL, 'VIGENTE', NULL, NULL, NULL, '2026-07-13 13:39:20', '2026-07-13 13:39:20'),
(9, 'bnbj', '(CLIENTE EXTERNO)', 'hjh', NULL, NULL, 'OTRO', NULL, 'hjhj', NULL, NULL, 'EXTERNO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EXTERNO', NULL, NULL, 'Creado automáticamente vía Ecommerce Checkout.', NULL, NULL, NULL, NULL, 0, 'NINGUNA', NULL, NULL, NULL, NULL, NULL, NULL, 'VIGENTE', NULL, NULL, NULL, '2026-07-13 15:26:40', '2026-07-13 15:26:40'),
(10, 'Gabriel Quispe Callau', '(CLIENTE EXTERNO)', '2344828', NULL, NULL, 'OTRO', NULL, '73737828', NULL, NULL, 'EXTERNO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EXTERNO', NULL, NULL, 'Creado automáticamente vía Ecommerce Checkout.', NULL, NULL, NULL, NULL, 0, 'NINGUNA', NULL, NULL, NULL, NULL, NULL, NULL, 'VIGENTE', NULL, NULL, NULL, '2026-07-14 06:03:58', '2026-07-14 06:03:58'),
(11, 'Jesus Romero Callau', '(CLIENTE EXTERNO)', '1273828', NULL, NULL, 'OTRO', NULL, '77463889', NULL, NULL, 'EXTERNO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EXTERNO', NULL, NULL, 'Creado automáticamente vía Ecommerce Checkout.', NULL, NULL, NULL, NULL, 0, 'NINGUNA', NULL, NULL, NULL, NULL, NULL, NULL, 'VIGENTE', NULL, NULL, NULL, '2026-07-14 08:02:35', '2026-07-14 08:02:35'),
(12, 'Antonio Manasilla', '(CLIENTE EXTERNO)', '56132135', NULL, NULL, 'OTRO', NULL, '63502451', NULL, NULL, 'EXTERNO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EXTERNO', NULL, NULL, 'Creado automáticamente vía Ecommerce Checkout.', NULL, NULL, NULL, NULL, 0, 'NINGUNA', NULL, NULL, NULL, NULL, NULL, NULL, 'VIGENTE', NULL, NULL, NULL, '2026-07-14 19:27:14', '2026-07-14 19:27:14'),
(13, 'Ronald Alvaro Vargas', '(CLIENTE EXTERNO)', '8370225', NULL, NULL, 'OTRO', NULL, '63604744', NULL, NULL, 'EXTERNO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EXTERNO', NULL, NULL, 'Creado automáticamente vía Ecommerce Checkout.', NULL, NULL, NULL, NULL, 0, 'NINGUNA', NULL, NULL, NULL, NULL, NULL, NULL, 'VIGENTE', NULL, NULL, NULL, '2026-07-14 21:29:27', '2026-07-14 21:29:27'),
(14, 'Julio Antonio ribera', '(CLIENTE EXTERNO)', '18372728', NULL, NULL, 'OTRO', NULL, '77272779', NULL, NULL, 'EXTERNO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EXTERNO', NULL, NULL, 'Creado automáticamente vía Ecommerce Checkout.', NULL, NULL, NULL, NULL, 0, 'NINGUNA', NULL, NULL, NULL, NULL, NULL, NULL, 'VIGENTE', NULL, NULL, NULL, '2026-07-14 21:37:15', '2026-07-14 21:37:15'),
(15, 'Ricardo argollo tuni', '(CLIENTE EXTERNO)', '28373838', NULL, NULL, 'OTRO', NULL, '77667278', NULL, NULL, 'EXTERNO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EXTERNO', NULL, NULL, 'Creado automáticamente vía Ecommerce Checkout.', NULL, NULL, NULL, NULL, 0, 'NINGUNA', NULL, NULL, NULL, NULL, NULL, NULL, 'VIGENTE', NULL, NULL, NULL, '2026-07-14 21:40:23', '2026-07-14 21:40:23'),
(16, 'Dd', '(CLIENTE EXTERNO)', '33', NULL, NULL, 'OTRO', NULL, '333', NULL, NULL, 'EXTERNO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EXTERNO', NULL, NULL, 'Creado automáticamente vía Ecommerce Checkout.', NULL, NULL, NULL, NULL, 0, 'NINGUNA', NULL, NULL, NULL, NULL, NULL, NULL, 'VIGENTE', NULL, NULL, NULL, '2026-07-14 21:57:55', '2026-07-14 21:57:55'),
(17, 'JUAN QUISPE TEJERINA', '(CLIENTE EXTERNO)', '18383782', NULL, NULL, 'OTRO', NULL, '76543672', NULL, NULL, 'EXTERNO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EXTERNO', NULL, NULL, 'Creado automáticamente vía Ecommerce Checkout.', NULL, NULL, NULL, NULL, 0, 'NINGUNA', NULL, NULL, NULL, NULL, NULL, NULL, 'VIGENTE', NULL, NULL, NULL, '2026-07-16 08:56:05', '2026-07-16 08:56:05'),
(18, 'Tolentino', '(CLIENTE EXTERNO)', '12345678', NULL, NULL, 'OTRO', NULL, '98765432', NULL, NULL, 'EXTERNO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EXTERNO', NULL, NULL, 'Creado automáticamente vía Ecommerce Checkout.', NULL, NULL, NULL, NULL, 0, 'NINGUNA', NULL, NULL, NULL, NULL, NULL, NULL, 'VIGENTE', NULL, NULL, NULL, '2026-07-18 18:13:29', '2026-07-18 18:13:29'),
(19, 'Olivia', '(CLIENTE EXTERNO)', '6418196', NULL, NULL, 'OTRO', NULL, '72625178', NULL, NULL, 'EXTERNO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EXTERNO', NULL, NULL, 'Creado automáticamente vía Ecommerce Checkout.', NULL, NULL, NULL, NULL, 0, 'NINGUNA', NULL, NULL, NULL, NULL, NULL, NULL, 'VIGENTE', NULL, NULL, NULL, '2026-07-25 11:19:04', '2026-07-25 11:19:04'),
(20, 'tolen', '(CLIENTE EXTERNO)', '6119119', NULL, NULL, 'OTRO', NULL, '72143047', NULL, NULL, 'EXTERNO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EXTERNO', NULL, NULL, 'Creado automáticamente vía Ecommerce Checkout.', NULL, NULL, NULL, NULL, 0, 'NINGUNA', NULL, NULL, NULL, NULL, NULL, NULL, 'VIGENTE', NULL, NULL, NULL, '2026-08-16 18:39:30', '2026-08-16 18:39:30'),
(21, 'dsdsd', '(CLIENTE EXTERNO)', '2323', NULL, NULL, 'OTRO', NULL, '2323', NULL, NULL, 'EXTERNO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EXTERNO', NULL, NULL, 'Creado automáticamente vía Ecommerce Checkout.', NULL, NULL, NULL, NULL, 0, 'NINGUNA', NULL, NULL, NULL, NULL, NULL, NULL, 'VIGENTE', NULL, NULL, NULL, '2026-08-16 18:39:40', '2026-08-16 18:39:40'),
(22, 'Roqui', '(CLIENTE EXTERNO)', '6119108', NULL, NULL, 'OTRO', NULL, '72149304', NULL, NULL, 'EXTERNO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EXTERNO', NULL, NULL, 'Creado automáticamente vía Ecommerce Checkout.', NULL, NULL, NULL, NULL, 0, 'NINGUNA', NULL, NULL, NULL, NULL, NULL, NULL, 'VIGENTE', NULL, NULL, NULL, '2026-09-26 22:11:02', '2026-09-26 22:11:02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `plan_pagos`
--

CREATE TABLE `plan_pagos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `credito_id` bigint(20) UNSIGNED NOT NULL,
  `nro_cuota` int(11) NOT NULL,
  `cuota_total` decimal(15,2) NOT NULL,
  `capital_amortizado` decimal(15,2) NOT NULL,
  `interes_pagado` decimal(15,2) NOT NULL,
  `monto_mora` decimal(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Interés moratorio calculado por retraso',
  `fecha_vencimiento` date NOT NULL,
  `fecha_pago_real` date DEFAULT NULL,
  `estado` varchar(50) NOT NULL DEFAULT 'Pendiente' COMMENT 'Pendiente, Pagada, Retrasada',
  `metodo_pago` varchar(255) DEFAULT NULL COMMENT 'Planilla, QR, Efectivo',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `categoria_id` bigint(20) UNSIGNED NOT NULL,
  `codigo_sku` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `descripcion_larga` text DEFAULT NULL,
  `marca` varchar(100) DEFAULT NULL,
  `modelo` varchar(100) DEFAULT NULL,
  `serie` varchar(100) DEFAULT NULL,
  `calibre` varchar(50) DEFAULT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `precio_general` decimal(10,2) NOT NULL,
  `precio_asociado` decimal(10,2) NOT NULL,
  `precio_credito` decimal(10,2) DEFAULT NULL,
  `precio_costo` decimal(10,2) DEFAULT NULL,
  `stock_actual` int(11) NOT NULL DEFAULT 0,
  `stock_minimo` int(11) NOT NULL DEFAULT 5,
  `imagen_path` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`imagen_path`)),
  `observacion` text DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `categoria_id`, `codigo_sku`, `nombre`, `slug`, `descripcion`, `descripcion_larga`, `marca`, `modelo`, `serie`, `calibre`, `fecha_vencimiento`, `precio_general`, `precio_asociado`, `precio_credito`, `precio_costo`, `stock_actual`, `stock_minimo`, `imagen_path`, `observacion`, `activo`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'MED-001', 'Estetoscopio Profesional', 'estetoscopio-profesional', 'Estetoscopio de doble campana de alta precisión para auscultación cardíaca y pulmonar. Acero inoxidable, olivas suaves.', NULL, NULL, NULL, NULL, NULL, NULL, 185.00, 155.00, NULL, NULL, 63, 5, '[\"productos\\/medicos_estetoscopio.png\"]', NULL, 1, '2026-04-03 17:31:28', '2026-05-28 19:22:06', NULL),
(2, 1, 'MED-002', 'Tensiómetro Digital', 'tensiometro-digital', 'Monitor de presión arterial digital de brazo con pantalla LCD grande. Detección de arritmia, memoria para 2 usuarios.', NULL, NULL, NULL, NULL, NULL, NULL, 220.00, 180.00, NULL, NULL, 61, 3, '[\"productos\\/medicos_tensiometro.png\"]', NULL, 1, '2026-04-03 17:31:28', '2026-05-28 19:22:02', NULL),
(3, 1, 'MED-003', 'Botiquín de Emergencia', 'botiquin-emergencia', 'Kit completo de primeros auxilios con 120 piezas: vendas, gasas, antisépticos, tijeras, pinzas y guía de emergencia.', NULL, NULL, NULL, NULL, NULL, NULL, 150.00, 120.00, NULL, NULL, 56, 8, '[\"productos\\/medicos_botiquin.png\"]', NULL, 1, '2026-04-03 17:31:28', '2026-05-28 19:22:06', NULL),
(4, 2, 'ROP-001', 'Chaqueta Táctica Ripstop', 'chaqueta-tactica-ripstop', 'Chaqueta táctica en tela Ripstop reforzada, múltiples bolsillos, resistente al agua. Color verde olivo.', NULL, NULL, NULL, NULL, NULL, NULL, 350.00, 285.00, NULL, NULL, 58, 10, '[\"productos\\/ropa_chaqueta_tactica.png\"]', NULL, 1, '2026-04-03 17:31:28', '2026-09-26 20:34:56', '2026-09-26 20:34:56'),
(5, 2, 'ROP-002', 'Botas de Combate', 'botas-combate', 'Botas tácticas negras de cuero genuino con suela antideslizante, soporte de tobillo reforzado. Impermeable.', NULL, NULL, NULL, NULL, NULL, NULL, 420.00, 350.00, NULL, NULL, 25, 5, '[\"productos\\/ropa_botas_combate.png\"]', NULL, 1, '2026-04-03 17:31:28', '2026-05-28 19:22:06', NULL),
(6, 2, 'ROP-003', 'Polo Institucional FAPCLAS', 'polo-institucional-fapclas', 'Polo de algodón piqué 100% con logo FAPCLAS bordado. Verde oscuro. Tallas S a XXL.', NULL, NULL, NULL, NULL, NULL, NULL, 95.00, 75.00, NULL, NULL, 57, 15, '[\"productos\\/ropa_polo_institucional.png\"]', NULL, 1, '2026-04-03 17:31:28', '2026-05-28 19:22:06', NULL),
(7, 3, 'BEB-001', 'Café Premium Boliviano', 'cafe-premium-boliviano', 'Café de altura de los Yungas, tostado medio, grano seleccionado. Bolsa 500g. Notas chocolate y frutos rojos.', NULL, NULL, NULL, NULL, NULL, NULL, 65.00, 50.00, NULL, NULL, 49, 20, '[\"productos\\/bebidas_cafe_premium.png\"]', NULL, 1, '2026-04-03 17:31:28', '2026-05-28 19:22:06', NULL),
(8, 3, 'BEB-002', 'Té de Hierbas Andinas', 'te-hierbas-andinas', 'Infusión de hierbas medicinales del altiplano: muña, manzanilla y cedrón. Caja de 25 sobres. Relajante natural.', NULL, NULL, NULL, NULL, NULL, NULL, 28.00, 22.00, NULL, NULL, 74, 25, '[\"productos\\/bebidas_te_hierbas.png\"]', NULL, 1, '2026-04-03 17:31:28', '2026-06-03 00:19:22', NULL),
(9, 3, 'BEB-003', 'Jugo Natural Tropical', 'jugo-natural-tropical', 'Jugo 100% natural de frutas tropicales: mango, naranja y maracuyá. Botella de vidrio 750ml. Sin conservantes.', NULL, NULL, NULL, NULL, NULL, NULL, 18.00, 14.00, NULL, NULL, 72, 30, '[\"productos\\/bebidas_jugo_natural.png\"]', NULL, 1, '2026-04-03 17:31:28', '2026-05-28 19:22:02', NULL),
(10, 4, 'LIB-001', 'Derecho Policial Boliviano', 'derecho-policial-boliviano', 'Manual jurídico actualizado sobre la normativa policial boliviana. Incluye Ley Orgánica de la Policía y reglamentos vigentes.', NULL, NULL, NULL, NULL, NULL, NULL, 120.00, 90.00, NULL, NULL, 51, 8, '[\"productos\\/libros_derecho_policial.png\"]', NULL, 1, '2026-04-03 17:31:28', '2026-05-28 19:22:02', NULL),
(11, 4, 'LIB-002', 'Finanzas Personales para Policías', 'finanzas-personales-policias', 'Guía práctica de administración financiera, ahorro e inversión orientada al personal policial y sus familias.', NULL, NULL, NULL, NULL, NULL, NULL, 85.00, 65.00, NULL, NULL, 77, 10, '[\"productos\\/libros_finanzas.png\"]', NULL, 1, '2026-04-03 17:31:28', '2026-05-28 19:22:02', NULL),
(12, 4, 'LIB-003', 'Liderazgo y Mando Policial', 'liderazgo-mando-policial', 'Estrategias de liderazgo, gestión de equipos y toma de decisiones bajo presión para mandos policiales.', NULL, NULL, NULL, NULL, NULL, NULL, 98.00, 78.00, NULL, NULL, 39, 5, '[\"productos\\/libros_liderazgo.png\"]', NULL, 1, '2026-04-03 17:31:28', '2026-07-13 11:54:35', NULL),
(13, 5, 'Farm-01', 'Losartan de 50gr', 'losartan-de-50gr', 'Medicamento antihipertensivo (antagonista del receptor de la angiotensina II) que relaja los vasos sanguíneos.', '<p>El Losartan de 50 mg <strong><mark>es un medicamento antihipertensivo (antagonista del receptor de la angiotensina II) que relaja los vasos sanguíneos</mark></strong>. Se prescribe principalmente para <strong>tratar la presión arterial alta</strong>, <strong>proteger los riñones</strong> y <strong>reducir el riesgo de accidentes cerebrovasculares</strong>.</p>', 'Laboratorio Chile.', 'Potasico 50gr', '123456', 'ninguno', '2028-06-02', 3.00, 2.80, 3.50, 2.00, 105, 20, '[\"tienda\\/productos\\/01KT5G9Y0F8CSXZB3H434YQ9GM.jpg\"]', 'Medicamento cardiovascular.', 1, '2026-06-03 01:06:59', '2026-07-15 22:22:00', NULL),
(14, 5, 'Farm-100', 'Alcohol Etílico al 96%.', 'alcohol-etilico-al-96', 'Alcohol Etílico al 96% Producto Nacional.', '<p>Alcohol Etílico al 96% Producto Nacional de la marca Santa Cecilia.</p>', NULL, NULL, NULL, NULL, NULL, 15.00, 12.00, 18.00, 10.00, 7, 5, '[\"tienda\\/productos\\/01KVR5EP6CE63HCR7BE09FQX72.png\",\"tienda\\/productos\\/01KVR5EP6K9FBEZBJS4SJV5QCM.png\"]', 'Ninguna', 1, '2026-06-22 14:28:00', '2026-08-16 19:01:43', NULL),
(15, 6, '03', 'SAPOLIO ', '5', 'Ambientador tipo espray sabor jardin de rosas ', NULL, NULL, NULL, NULL, NULL, NULL, 17.00, 17.00, 16.00, 15.00, 3, 5, '[\"tienda\\/productos\\/01M3FX0R2Z8KQKG3G1JA5CV56T.jpg\"]', NULL, 1, '2026-09-26 17:22:50', '2026-09-26 20:31:11', NULL),
(16, 6, '01', 'PAPEL ', 'papel', 'PAPEL MARCA FINI FINESSE 6 ROLLOS DOBLE HOJA', NULL, 'NACIONAL', NULL, NULL, NULL, '2028-01-01', 13.00, 13.00, 13.00, 12.00, 6, 6, '[\"tienda\\/productos\\/01M3G0NA01B484BRCCWPF5MW7A.jpg\"]', 'FAMILIAR', 1, '2026-09-26 18:26:29', '2026-09-26 18:26:29', NULL),
(17, 6, '02', 'SERVILLETAS', 'servilletas', 'SERVILLETAS', NULL, 'SCOTT', 'BOLIVIANO', NULL, NULL, '2029-02-01', 3.50, 3.50, 4.00, 3.00, 0, 5, '[\"tienda\\/productos\\/01M3G10X178YW93KWJ66MJB8FA.jpg\"]', 'SERVILLETAS SÚPER ABSORBENTES', 1, '2026-09-26 18:32:49', '2026-09-26 18:32:49', NULL),
(18, 2, '1', 'CONJUNTO DE ROPA EPORTIVA', 'conjunto-de-ropa-eportiva', 'PANTALÓN SHORD POLERA GORRA', NULL, NULL, NULL, NULL, NULL, NULL, 100.00, 100.00, 100.00, 100.00, 2, 5, '[\"tienda\\/productos\\/01M3G1M8145CG8Y4JK77FPSP3Y.jpg\"]', 'Conjunto de shord, polera, gorra , ropa combinada ', 1, '2026-09-26 18:43:23', '2026-09-26 18:43:23', NULL),
(19, 2, '2', 'ROPA DE BARON ', 'ropa-de-baron', 'PANTALÓN, POLERA GORRA ', NULL, NULL, NULL, NULL, NULL, NULL, 150.00, 150.00, 150.00, 140.00, 2, 5, '[\"tienda\\/productos\\/01M3G21ZMVH03TT961A73J0NXZ.jpg\"]', 'CONJUNTO DE DE ROPA PARA BARRÓN PANTALÓN JHEN POLERA GORRA A LA MODA  ', 1, '2026-09-26 18:50:53', '2026-09-26 20:30:26', NULL),
(20, 6, '04', 'TODO BRILLO ', 'todo-brillo', 'LIMPIEZA DE PISOS 4 EN 1', NULL, NULL, NULL, NULL, NULL, NULL, 15.00, 15.00, 15.00, 14.00, 4, 5, '[\"tienda\\/productos\\/01M3G76YJJG4RWT1EV02YM0N4C.jpg\"]', 'LIMPIEZA DE PISO TODO BRILLO 4EN 1 LIMPIEZA Y DESINFECCIÓN CAMPOS DE ABANA ', 1, '2026-09-26 20:20:59', '2026-09-26 20:20:59', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'SuperAdmin', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(2, 'Oficial Crédito', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(3, 'Cajero', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(4, 'Socio Base', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(5, 'Oficial de Créditos', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(6, 'Tesorero', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27'),
(7, 'Cajero Operativo', 'web', '2026-04-03 17:31:27', '2026-04-03 17:31:27');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `role_has_permissions`
--

INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 1),
(11, 1),
(12, 1),
(13, 1),
(14, 1),
(15, 1),
(16, 1),
(17, 1),
(18, 1),
(19, 1),
(20, 1),
(21, 1),
(22, 1),
(23, 1),
(24, 1),
(25, 1),
(26, 1),
(27, 1),
(28, 1),
(29, 1),
(30, 1),
(31, 1),
(32, 1),
(2, 2),
(3, 2),
(4, 2),
(5, 2),
(4, 3),
(5, 3),
(6, 3),
(7, 3),
(5, 4),
(8, 5),
(9, 5),
(10, 5),
(13, 5),
(14, 5),
(15, 5),
(16, 5),
(8, 6),
(13, 6),
(18, 6),
(19, 6),
(20, 6),
(21, 6),
(22, 6),
(23, 6),
(24, 6),
(8, 7),
(13, 7),
(18, 7),
(19, 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `icono` varchar(255) NOT NULL DEFAULT 'Shield',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `secciones` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`secciones`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `servicios`
--

INSERT INTO `servicios` (`id`, `nombre`, `slug`, `descripcion`, `imagen`, `icono`, `is_active`, `is_featured`, `sort_order`, `secciones`, `created_at`, `updated_at`) VALUES
(1, 'Préstamo Policial', 'prestamo-policial', 'Tu respaldo financiero inmediato con las tasas más bajas del mercado cooperativo.', '/images/servicios/prestamo.png', 'Banknote', 1, 1, 1, '[{\"titulo\":\"Aprobaci\\u00f3n en Tiempo R\\u00e9cord\",\"contenido\":\"Entendemos las urgencias de la familia policial. Por eso, hemos optimizado nuestros procesos para que tu cr\\u00e9dito sea aprobado en menos de 24 horas.\",\"items\":[\"Sin garantes externos\",\"Descuento planilla\",\"Tr\\u00e1mite 100% digital\",\"Tasa social\"]},{\"titulo\":\"Tasas que Cuidan tu Futuro\",\"contenido\":\"A diferencia de la banca tradicional, nuestras tasas est\\u00e1n dise\\u00f1adas para el beneficio del socio, permiti\\u00e9ndote crecer sin asfixiar tu econom\\u00eda.\",\"items\":[\"Inter\\u00e9s sobre saldo\",\"Seguro de desgravamen\",\"Sin comisiones ocultas\"]}]', '2026-05-28 19:22:07', '2026-05-28 19:22:07'),
(2, 'Tienda Virtual', 'tienda-virtual', 'Equipamiento, tecnología y hogar a un clic de distancia.', '/images/servicios/tienda.png', 'ShoppingBag', 1, 0, 2, '[{\"titulo\":\"Compra Hoy, Paga Despu\\u00e9s\",\"contenido\":\"Accede a miles de productos con la facilidad del descuento por planilla. Sin aprobaciones lentas ni papeleo innecesario.\",\"items\":[\"Cr\\u00e9dito inmediato\",\"Cuotas flexibles\",\"Precios de convenio\"]},{\"titulo\":\"Calidad Garantizada\",\"contenido\":\"Trabajamos con las mejores marcas nacionales e internacionales para asegurar que cada compra sea una inversi\\u00f3n duradera.\",\"items\":[\"Garant\\u00eda de f\\u00e1brica\",\"Env\\u00edo a unidades policiales\",\"Soporte t\\u00e9cnico\"]}]', '2026-05-28 19:22:07', '2026-05-28 19:22:07'),
(3, 'Lavado de Ropa', 'lavanderia', 'Servicio profesional de limpieza ejecutiva para tu uniforme e indumentaria civil.', '/images/servicios/lavanderia.png', 'Sparkles', 1, 0, 3, '[{\"titulo\":\"Pulcritud Institucional\",\"contenido\":\"Tu uniforme es tu identidad. Utilizamos tecnolog\\u00eda de lavado industrial que protege las fibras y mantiene los colores originales por m\\u00e1s tiempo.\",\"items\":[\"Lavado en seco profesional\",\"Planchado de alta definici\\u00f3n\",\"Tratamiento de manchas\"]},{\"titulo\":\"Rapidez y Comodidad\",\"contenido\":\"Sabemos que tu tiempo es valioso. Ofrecemos tiempos de entrega preferenciales para que nunca te falte tu indumentaria operativa.\",\"items\":[\"Entrega en 24h disponible\",\"Recojo en unidad (Bajo pedido)\",\"Precios sociales para el socio\"]}]', '2026-05-28 19:22:07', '2026-05-28 19:22:07'),
(4, 'Bordados Digitalizados', 'bordados', 'Precisión milimétrica en cada hilo para resaltar tu grado y distinción.', '/images/servicios/bordados.png', 'Paintbrush', 1, 0, 4, '[{\"titulo\":\"Tecnolog\\u00eda de Punta\",\"contenido\":\"Contamos con m\\u00e1quinas de bordado digital de \\u00faltima generaci\\u00f3n que garantizan una densidad de puntada perfecta y durabilidad extrema.\",\"items\":[\"Grados y nombres\",\"Escudos institucionales\",\"Parches personalizados\",\"Hilos de alta resistencia\"]},{\"titulo\":\"Distinci\\u00f3n en cada Detalle\",\"contenido\":\"Nuestros dise\\u00f1os cumplen estrictamente con el reglamento de uniformes, asegurando que tu presentaci\\u00f3n sea siempre impecable.\",\"items\":[\"Dise\\u00f1o digitalizado propio\",\"Acabados premium\",\"Entrega inmediata\"]}]', '2026-05-28 19:22:07', '2026-05-28 19:22:07'),
(5, 'Salón de Belleza', 'salon-belleza', 'Tu espacio de cuidado personal y bienestar familiar con atención de primer nivel.', '/images/servicios/salon.png', 'Smile', 1, 0, 5, '[{\"titulo\":\"Estilo que Inspira\",\"contenido\":\"Desde cortes cl\\u00e1sicos hasta tratamientos modernos, nuestros profesionales est\\u00e1n capacitados para brindar el mejor servicio a damas y caballeros.\",\"items\":[\"Corte de cabello masculino\\/femenino\",\"Tratamientos capilares\",\"Peinados y tintes\"]},{\"titulo\":\"Bienestar para la Familia\",\"contenido\":\"FAPCLAS R.L. se preocupa por tu familia. Los precios sociales se extienden a tus seres queridos para que todos luzcan bien.\",\"items\":[\"Atenci\\u00f3n preferencial\",\"Ambiente relajante\",\"Insumos de alta calidad\"]}]', '2026-05-28 19:22:07', '2026-05-28 19:22:07'),
(6, 'Librería Celeste', 'libreria', 'Todo el soporte académico y de oficina en un solo lugar.', '/images/servicios/libreria.png', 'BookOpen', 0, 0, 6, '[{\"titulo\":\"Aliado en tu Formaci\\u00f3n\",\"contenido\":\"Accede a textos universitarios, leyes y reglamentos esenciales para tu carrera policial y el estudio de tus hijos.\",\"items\":[\"Libros especializados\",\"Material escolar completo\",\"Papeler\\u00eda de oficina\"]},{\"titulo\":\"Servicios Complementarios\",\"contenido\":\"No solo vendemos papel; ofrecemos soluciones para tus tr\\u00e1mites y presentaciones diarias.\",\"items\":[\"Fotocopias e impresiones\",\"Anillados y empastados\",\"Descuentos por mayor\"]}]', '2026-05-28 19:22:07', '2026-07-15 22:35:46'),
(7, 'Conductor Asignado', 'conductor', 'Seguridad y tranquilidad en tus desplazamientos, en cualquier momento.', '/images/servicios/conductor.png', 'Car', 0, 0, 7, '[{\"titulo\":\"Confianza en el Camino\",\"contenido\":\"Nuestros conductores asignados son profesionales verificados, garantizando un traslado seguro para ti y tu veh\\u00edculo.\",\"items\":[\"Disponible 24\\/7\",\"Choferes capacitados\",\"Monitoreo GPS constante\"]},{\"titulo\":\"Servicio Institucional\",\"contenido\":\"Ideal para eventos, traslados urbanos o cuando simplemente necesitas un conductor de confianza que entienda tu labor.\",\"items\":[\"Tarifas fijas y justas\",\"Solicitud r\\u00e1pida inal\\u00e1mbrica\",\"Seguro de viaje\"]}]', '2026-05-28 19:22:07', '2026-07-15 22:35:50'),
(8, 'Farmacia Paquito', 'farmacia-paquito', 'La Farmacia Paquito es un emprendimiento en expansión que forma parte de la Cooperativa Fapclas, ofreciendo medicamentos y productos de salud tanto a socios como al público en general.', 'servicios/01KT71YPZ2AN170EY26XZECN51.png', 'Shield', 1, 0, 1, '[{\"titulo\":\"Farmcial Paquito\",\"contenido\":\"La Farmacia Paquito es un emprendimiento en expansi\\u00f3n que forma parte de la Cooperativa Fapclas, ofreciendo medicamentos y productos de salud tanto a socios como al p\\u00fablico en general.\",\"items\":[{\"item\":\"Destacado\"}]}]', '2026-06-03 15:13:23', '2026-06-03 15:34:40');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('4UEYiHwwZailmpiIYptpd14bjw9qOTC35K6Qt9CH', NULL, '181.114.108.130', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN0FDS2x4TXU3ZDhpalNrbDhVUFh2ZXNUUlp2NDNOcWZqcjNKY1Q3MiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vZmFwY2xhcy5jb20uYm8iO3M6NToicm91dGUiO3M6Nzoid2VsY29tZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1791040262),
('ANtvQ1mpT57U4i3R59Jteo0EsdXxbXCFo66gEeyF', NULL, '181.115.132.5', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZDZaNkZNQlo3M25oNG1ub1VXcFcyUVdnaUJ6dEltbzhuUGwyZFFGNyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDk6Imh0dHBzOi8vd3d3LmZhcGNsYXMuY29tLmJvL2JlbmVmaWNpb3MvcHJvZHVjdG8vMTkiO3M6NToicm91dGUiO3M6MTU6ImJlbmVmaWNpb3Muc2hvdyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1791049546),
('bnc8M5GkFPZkAxCHyYXlGV5CogLcKt3ACOMSDbtD', NULL, '43.159.143.190', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMGU2ME5jMmdGYk5haGNHTkZmNlJlWlNOSTBjWHF1TWNVWkdOZkFlbyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vZmFwY2xhcy5jb20uYm8iO3M6NToicm91dGUiO3M6Nzoid2VsY29tZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1791025997),
('cL29jHtLLw9XMUECXcDgnBbpPf0KmT4pEpkfNmQS', NULL, '66.249.69.68', 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.52 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTUdIdmlmcFVxQkQwbTIwSXZNeXc2NWdMVkM4cEdMbnBjR3p2U0pPWiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTA6Imh0dHBzOi8vZmFwY2xhcy5jb20uYm8vaW5zdGl0dWNpb25hbC9taXNpb24tdmlzaW9uIjtzOjU6InJvdXRlIjtzOjE4OiJpbnN0aXR1Y2lvbmFsLnNob3ciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1791066506),
('dqZJ0Jv6f1Qjcmqy4hrPKCYtW9RBlE3AcaT3ibhY', NULL, '43.165.67.31', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieDN0cWRrU3BnQVlDcGVaM0swTWRkUVNtUTVXZ2xqN3plQXpxZzhvQyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vZmFwY2xhcy5jb20uYm8iO3M6NToicm91dGUiO3M6Nzoid2VsY29tZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1791041583),
('hlW0mOWWN1Bx5AfWna9nb3ZJxanFSSbghAiShwYC', NULL, '43.134.56.214', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUVJZTjR3NDViTXdaM29XeXozRk9lUXU2dnQ3N3dsdlhXYmlPQlJPZiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vZmFwY2xhcy5jb20uYm8iO3M6NToicm91dGUiO3M6Nzoid2VsY29tZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1791061291),
('huCF2YQ674bqeVoxlYtlnRkjJoGFgYsFmiBQId1k', NULL, '16.216.88.212', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Reflectionbot/1.0; +https://reflection.ai/bot) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT0NiUFVEdjhpRTltZFJzdVNZYlJ6REJFTXlwR09lbVdlanZrYkpGUiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vd3d3LmZhcGNsYXMuY29tLmJvL2luc3RpdHVjaW9uYWwvbm9ybWF0aXZhcyI7czo1OiJyb3V0ZSI7czoxODoiaW5zdGl0dWNpb25hbC5zaG93Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1791066776),
('J3SXAoPrNMJqj70LhXf3hgzgYYFT8k2OxpL28TGT', NULL, '143.198.136.77', 'Mozilla/5.0 (X11; Linux x86_64; rv:153.0) Gecko/20100101 Firefox/153.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidHZoZ2c3QnA1OVAzR09lOTJYcnB6TnhsU2V5dzR3ellvdjZDRUZVZiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vZmFwY2xhcy5jb20uYm8iO3M6NToicm91dGUiO3M6Nzoid2VsY29tZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1791062033),
('JdEcjKQPFUR4PLuqkC9bhvwmkteUNAiWXbnDAgBu', NULL, '205.210.31.57', 'Hello from Palo Alto Networks, find out more about our scans in https://docs-cortex.paloaltonetworks.com/r/1/Cortex-Xpanse/Scanning-activity', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoid2YwMVZkRmpKVkhCRGZqYXdwQ3NqT0ZrU290bldPODlPUXc0WWt4UCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vZmFwY2xhcy5jb20uYm8iO3M6NToicm91dGUiO3M6Nzoid2VsY29tZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1791032703),
('Juu7kUnxWrVyfZqmCDI5z6HbKvf01DEmDSi5hRIi', NULL, '43.164.3.23', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV2htR2pTZlZnQnBVMWZQWHp5d0lYWWRGdVNraE1vYnBiZlg2dDZLaSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjY6Imh0dHBzOi8vd3d3LmZhcGNsYXMuY29tLmJvIjtzOjU6InJvdXRlIjtzOjc6IndlbGNvbWUiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1791044845),
('k86QSgTOd8RizZsyYA9mOhLgudxwKhtYcnWCXXWm', NULL, '52.167.144.170', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/116.0.1938.76 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZmo0dmpEdXFHc2VwZTR1WktOQ3ROdlBSZ250UVhFc2pMV0JWMTNRNiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vZmFwY2xhcy5jb20uYm8iO3M6NToicm91dGUiO3M6Nzoid2VsY29tZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1791030263),
('koHWOQOxWQ0bhBqE8051oUW8vJTDdllrnyDqiPVs', NULL, '52.167.144.199', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/116.0.1938.76 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoia1Z2Tm9EdTJ6MEt0V0dXd096czZsUlJoYkMybk5kQlRudnZpOU1QRiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vZmFwY2xhcy5jb20uYm8iO3M6NToicm91dGUiO3M6Nzoid2VsY29tZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1791041643),
('lbX5j4DSgsOGhmQuY3IMQF9EvqjWjKMWR2BMcygU', NULL, '34.55.191.113', 'Mozilla/5.0 (compatible; CMS-Checker/1.0; +https://example.com)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVWhpbkx0Z0RaR2NxRGk3Rk52c3hqc3hjak55NU05dGlEdGcxZVpvUCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vZmFwY2xhcy5jb20uYm8iO3M6NToicm91dGUiO3M6Nzoid2VsY29tZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1791026681),
('m33i2DOH0KYyo3Fij0qy24HrW8NN1v4oiLLcVwv0', NULL, '35.238.193.248', 'Mozilla/5.0 (compatible; CMS-Checker/1.0; +https://example.com)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZGdkMTQ4cWxnaDJNdUR2TFR1S2FWcUMzZ2REakU1Z1c0MENNMmhJYiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vZmFwY2xhcy5jb20uYm8iO3M6NToicm91dGUiO3M6Nzoid2VsY29tZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1791055474),
('MfE4QiOhX85Hrg93UdTOP31sVya2rCC5bWIAVYdo', NULL, '16.216.88.59', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Reflectionbot/1.0; +https://reflection.ai/bot) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiS21KTlM5ZmlNSGhyRDZUSnFzUVBSTXcxZGVoQ0pCTHdDbEZDdlg1QSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTE6Imh0dHBzOi8vd3d3LmZhcGNsYXMuY29tLmJvL2luc3RpdHVjaW9uYWwvbm9ybWF0aXZhcyI7czo1OiJyb3V0ZSI7czoxODoiaW5zdGl0dWNpb25hbC5zaG93Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1791066775),
('OqIaRDCjwGmlI9UllUktFdLWE2FwYdBOdzjfBpoy', NULL, '43.153.27.244', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOG5GNkhFUGZvOUdCbGZidm55dzNsTzdyck1jMFFLZDBtOEZ0NDhvaSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjY6Imh0dHBzOi8vd3d3LmZhcGNsYXMuY29tLmJvIjtzOjU6InJvdXRlIjtzOjc6IndlbGNvbWUiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1791029039),
('pWFUgvq8N1NLYQSUz7bgsH0SEoVmD4Xq0ivatCxW', NULL, '129.211.172.249', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiODBzdmRxVFhNNXNmT3A2R1B1VUh3QVJOc0xGdlIyVmQ0NnNoUkI4dSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjY6Imh0dHBzOi8vd3d3LmZhcGNsYXMuY29tLmJvIjtzOjU6InJvdXRlIjtzOjc6IndlbGNvbWUiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1791048690),
('pZxslTn9K5pQiEkfQaNWqy2oLteTHF9qnQ296LLZ', NULL, '52.167.144.232', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/116.0.1938.76 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoia1JEeVNVMm1od2x4cmRSeFdSazd3SlQ0Rkt4dXc4RURBVWNjZ2VhbSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTA6Imh0dHBzOi8vZmFwY2xhcy5jb20uYm8vc2VydmljaW9zL3ByZXN0YW1vLXBvbGljaWFsIjtzOjU6InJvdXRlIjtzOjE0OiJzZXJ2aWNpb3Muc2hvdyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1791027635),
('rN139rrwaRBkf0hfu3wzNBTifHOkCB8R6tcmQPFL', 1, '181.114.108.130', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiVW40OHRmSW1wOFZvZXhZQlR5eG51Z1ZlUWJoRmF5WWo4OEtnVlhTZiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjg6Imh0dHBzOi8vZmFwY2xhcy5jb20uYm8vYWRtaW4iO3M6NToicm91dGUiO3M6MzA6ImZpbGFtZW50LmFkbWluLnBhZ2VzLmRhc2hib2FyZCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjE7czoxNzoicGFzc3dvcmRfaGFzaF93ZWIiO3M6NjQ6ImJkZGE2OGNjNWRiYTdjNWFkNmFmMzBhZGQ4YWY1NWZhY2JhMjFjMWZiNGY0OTg2M2JhOGFiNGMyNzI4NWM1YTYiO30=', 1791069051),
('u0zP09WXtvBG3Nzafept4w2ND7sZxUUY42BrdxKX', NULL, '57.131.131.18', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoia1lPSTF0NnMwRjdzSTZlbnNDenBiUGxOMVRrYTdHaG5WS3hoUXMxaCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vZmFwY2xhcy5jb20uYm8iO3M6NToicm91dGUiO3M6Nzoid2VsY29tZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1791058921),
('U32rr0rnN2J3YEMjVHjDqstDxbZaO9SLVcFZ3zjz', NULL, '167.94.146.60', 'Mozilla/5.0 (compatible; CensysInspect/1.1; +https://about.censys.io/)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQTd3a3NTU2o5RWo5VWd5WnVVQ3NSNXJYNENKZWZNZDEwanFONlFCbyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vZmFwY2xhcy5jb20uYm8iO3M6NToicm91dGUiO3M6Nzoid2VsY29tZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1791059491),
('uMjUHx0xQdhoUUpiVkwmwcq4Z1qoQ4wKwCWVz1it', NULL, '35.189.238.225', 'Mozilla/5.0 (compatible; CMS-Checker/1.0; +https://example.com)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieXBsRUljdThHdmdHeGc0Z0dpbXl1Mzc1ME00Qm9oSUtnSHhYNFR6eCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vZmFwY2xhcy5jb20uYm8iO3M6NToicm91dGUiO3M6Nzoid2VsY29tZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1791040323),
('VcFjQSiS0qeO74jqZSzoKox6chuorKFTDuURBtPR', NULL, '43.135.115.233', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicHJmUUFpVUlpV3BvUmxzRE1VaXpmdUphRVVHelBHOHhuQWZudVNKNCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjY6Imh0dHBzOi8vd3d3LmZhcGNsYXMuY29tLmJvIjtzOjU6InJvdXRlIjtzOjc6IndlbGNvbWUiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1791064721);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `site_settings`
--

CREATE TABLE `site_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`value`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `site_settings`
--

INSERT INTO `site_settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES
(1, 'header', '{\"favicon\":\"site\\/favicon\\/01KXMFQQ2QZ9PQG1X6KT2SVHYW.png\",\"phone\":\"71634750\",\"phone_link\":\"71634750\",\"whatsapp_link\":\"http:\\/\\/wa.link\\/8yl8ow\",\"whatsapp_label\":\"WhatsApp Institucional\",\"logo_text\":\"Coop. FAPCLAS\",\"logo_suffix\":\"R.L.\",\"cta_portal_text\":\"Acceso al Portal\",\"cta_tienda_text\":\"Tienda Virtual\",\"meta_title\":\"Cooperativa de Ahorro y Cr\\u00e9dito \\\"FAPCLAS\\\" R.L\",\"meta_description\":\"FAPCLAS R.L. \\u2013 Cooperativa de ahorro y cr\\u00e9dito de la Familia Policial Boliviana. Soluciones financieras modernas, seguras y con responsabilidad social.\",\"meta_keywords\":\"cooperativas, cr\\u00e9ditos, ahorros, prestamos.\",\"top_links\":[{\"label\":\"Bolsa de Trabajo\",\"url\":\"#\"},{\"label\":\"Preguntas Frecuentes\",\"url\":\"#\"}],\"menu\":[{\"label\":\"Nuestra Entidad\",\"children\":[{\"label\":\"Misi\\u00f3n y Visi\\u00f3n\",\"url\":\"\\/institucional\\/mision-vision\",\"description\":\"Horizonte cooperativo policial.\",\"icon\":\"flag\",\"disabled\":false},{\"label\":\"Qui\\u00e9nes Somos\",\"url\":\"\\/institucional\\/constitucion\",\"description\":\"Historia e impacto de FAPCLAS.\",\"icon\":\"users\",\"disabled\":false}],\"featured_image\":\"site\\/menu\\/01KT6T11N2CEX9V6FK78Z99H72.png\",\"featured_title\":\"+5,000 socios activos\",\"featured_subtitle\":\"\\u00danete a la hermandad policial.\",\"featured_badge\":\"Solidaridad\"},{\"label\":\"Transparencia\",\"children\":[{\"label\":\"Leyes y Normativas\",\"url\":\"\\/institucional\\/normativas\",\"description\":\"Leyes 393, ASFI y AFCOOP.\",\"icon\":\"book-open\",\"disabled\":false},{\"label\":\"Punto de Reclamo (PRF)\",\"url\":\"#\",\"description\":\"No disponible temporalmente.\",\"icon\":\"message-circle\",\"disabled\":true}],\"featured_image\":null,\"featured_title\":null,\"featured_subtitle\":null,\"featured_badge\":null},{\"label\":\"Informe\",\"children\":[{\"label\":\"Noticias\",\"url\":\"\\/institucional\\/noticias\",\"description\":\"Actualidad, comunicados y convenios.\",\"icon\":\"newspaper\",\"disabled\":false}],\"featured_image\":null,\"featured_title\":null,\"featured_subtitle\":null,\"featured_badge\":null}]}', '2026-05-28 19:14:33', '2026-07-15 21:32:44'),
(2, 'footer', '{\"description\":\"Soluciones financieras integrales con eficiencia, oportunidad y responsabilidad social dise\\u00f1adas exclusivamente para el bienestar integral de la familia policial boliviana.\",\"copyright\":\"\\u00a9 2026 Cooperativa FAPCLAS R.L. Todos los derechos reservados.\",\"copyright_dev\":\"\\u00a9 copyright SmarCoding SA.\",\"badges\":[{\"top_label\":\"Control Societario\",\"bottom_label\":\"Regulada por AFCOOP\"},{\"top_label\":\"Supervisi\\u00f3n Financiera\",\"bottom_label\":\"Supervisada por ASFI\"}],\"quick_links\":[{\"label\":\"Caja de Ahorro\",\"url\":\"#ahorro\"},{\"label\":\"Cr\\u00e9ditos de Emergencia\",\"url\":\"#creditos\"},{\"label\":\"Beneficios Exclusivos\",\"url\":\"#beneficios\"},{\"label\":\"Misi\\u00f3n y Visi\\u00f3n\",\"url\":\"#institucional\"}],\"contact_links\":[{\"label\":\"WhatsApp Directo\",\"url\":\"http:\\/\\/wa.link\\/8yl8ow\"},{\"label\":\"S\\u00edguenos en Facebook\",\"url\":\"http:\\/\\/www.facebook.com\\/profile.php?id=61582603104419\"},{\"label\":\"Atenci\\u00f3n Personalizada 24\\/7\",\"url\":null},{\"label\":\"Nuestras oficias Maps Google \",\"url\":\"https:\\/\\/www.google.com\\/maps\\/@-17.8561159,-63.0958413,137m\\/data=!3m1!1e3?entry=ttu&g_ep=EgoyMDI2MDcxMy4wIKXMDSoASAFQAw%3D%3D\"}],\"social_links\":[{\"platform\":\"facebook\",\"url\":\"#\"},{\"platform\":\"instagram\",\"url\":\"#\"},{\"platform\":\"tiktok\",\"url\":\"#\"},{\"platform\":\"linkedin\",\"url\":\"#\"}]}', '2026-05-28 19:14:33', '2026-07-15 22:39:14'),
(3, 'whatsapp', '{\"enabled\":true,\"url\":\"https:\\/\\/wa.link\\/0nyqcd\",\"tooltip\":\"CONTACTANOS...!!! (En l\\u00ednea)\"}', '2026-05-28 19:14:33', '2026-07-13 10:22:35'),
(4, 'splash', '{\"enabled\":true,\"logo_type\":\"both\",\"logo_size\":\"xl\",\"style\":\"brand\",\"animation\":\"zoom-out\",\"logo_image\":\"site\\/splash\\/01KSV4PABDZ7QA9ESPA42J6ZCP.png\",\"title\":\"Coop. FAPCLAS R.L.\",\"subtitle\":\"Tu Cooperativa policial preferida.\",\"tagline\":\"Tu futuro seguro \\u00b7 Coop. FAPCLAS R.L.\",\"duration_ms\":5000,\"show_every_minutes\":30}', '2026-05-29 02:10:38', '2026-07-15 21:36:14'),
(5, 'promo_popup_landing', '{\"enabled\":false,\"type\":\"oferta\",\"image\":\"site\\/popups\\/01KXMMK1X299E0SF0J6KNRGPA8.png\",\"title\":\"Oferta Especial\",\"description\":\"Aprovecha nuestras promociones exclusivas para socios.\",\"button_text\":\"Ver M\\u00e1s\",\"button_link\":\"\\/beneficios\",\"show_once\":true,\"delay_ms\":6000,\"expires_at\":null}', '2026-05-29 11:52:20', '2026-08-21 08:49:04'),
(6, 'promo_popup_ecommerce', '{\"enabled\":false,\"type\":\"informacion\",\"image\":\"site\\/popups\\/01KXNP4FPKHZT50J3XTHJJP088.png\",\"title\":\"BIENVENIDOS A TU TIENDA VIRTUAL\",\"description\":\"Ofertas exclusivas para todos nuestros clientes de la Coop. FAPCLAS R.L. y publico en general.\",\"button_text\":\"INGRESA\",\"button_link\":\"#catalogo\",\"show_once\":true,\"delay_ms\":800,\"expires_at\":null}', '2026-05-29 11:52:20', '2026-08-21 08:49:18'),
(7, 'landing_styles', '{\"global\":{\"font_family_title\":\"Montserrat\",\"font_family_body\":\"Inter\",\"font_weight_title\":700,\"font_weight_body\":400,\"color_primary\":\"#318c31\",\"color_secondary\":\"#eab308\",\"color_text\":\"#2a3952\",\"color_title\":\"#020e29\",\"color_bg_page\":\"#f8faf6\",\"font_size_h1\":\"2.75rem\",\"font_size_h2\":\"2rem\",\"font_size_h3\":\"1.5rem\",\"font_size_body\":\"1rem\",\"font_size_small\":\"0.875rem\",\"line_height\":\"1.65\",\"letter_spacing\":\"0em\"},\"hero\":{\"font_family_title\":\"Lato\",\"font_weight_title\":900,\"text_transform_title\":\"none\",\"text_align\":\"left\",\"font_size_title\":\"3.5rem\",\"font_size_subtitle\":\"1.5rem\",\"font_size_description\":\"1.125rem\",\"letter_spacing_title\":\"-0.02em\",\"line_height_title\":\"1.1\",\"color_title\":\"#427a42\",\"color_subtitle\":\"#fcfcfc\",\"color_description\":\"#c5e0ce\",\"color_overlay\":\"#ffffff\",\"overlay_opacity\":\"0.55\",\"btn_primary_bg\":\"#24a152\",\"btn_primary_text\":\"#ffffff\",\"btn_secondary_bg\":\"#f5ecec\",\"btn_secondary_text\":\"#ffffff\",\"btn_border_radius\":\"0.5rem\"},\"nav\":{\"font_family\":\"Inter\",\"font_weight\":500,\"font_size\":\"0.9rem\",\"text_transform\":\"none\",\"color_bg\":\"#254a2b\",\"color_bg_scroll\":\"#a9bee0\",\"color_link\":\"#f1f5f9\",\"color_link_hover\":\"#22c55e\",\"color_logo\":\"#ffffff\",\"topbar_bg\":\"#166534\",\"topbar_text\":\"#dcfce7\",\"topbar_font_size\":\"0.8rem\"},\"section_title\":{\"font_family\":\"Inter\",\"font_weight\":800,\"font_size\":\"2rem\",\"text_transform\":\"none\",\"text_align\":\"center\",\"color_title\":\"#0f172a\",\"color_subtitle\":\"#64748b\",\"color_badge\":\"#22c55e\",\"color_badge_text\":\"#ffffff\",\"margin_bottom\":\"3rem\",\"font_size_subtitle\":\"1.1rem\",\"letter_spacing\":\"0em\",\"line_height\":\"1.3\"},\"cards\":{\"font_family_title\":\"Inter\",\"font_weight_title\":700,\"font_size_title\":\"1.25rem\",\"font_size_body\":\"0.95rem\",\"color_bg\":\"#ffffff\",\"color_bg_hover\":\"#f0fdf4\",\"color_title\":\"#0f172a\",\"color_body\":\"#64748b\",\"color_icon\":\"#22c55e\",\"color_border\":\"#e2e8f0\",\"color_border_hover\":\"#22c55e\",\"border_radius\":\"1rem\",\"padding\":\"1.5rem\"},\"stats\":{\"font_family_value\":\"Inter\",\"font_weight_value\":800,\"font_size_value\":\"3rem\",\"font_size_label\":\"0.9rem\",\"color_bg\":\"#0f172a\",\"color_value\":\"#22c55e\",\"color_label\":\"#94a3b8\",\"color_icon\":\"#eab308\"},\"testimonials\":{\"font_family_quote\":\"Inter\",\"font_style_quote\":\"italic\",\"font_size_quote\":\"1.1rem\",\"font_size_author\":\"0.95rem\",\"color_bg_card\":\"rgba(255,255,255,0.05)\",\"color_quote_text\":\"#e2e8f0\",\"color_author\":\"#94a3b8\",\"color_stars\":\"#eab308\",\"color_section_bg\":\"#0f172a\"},\"footer\":{\"font_family\":\"Inter\",\"font_size_body\":\"0.9rem\",\"font_size_title\":\"1rem\",\"font_weight_title\":600,\"color_bg\":\"#020617\",\"color_text\":\"#94a3b8\",\"color_title\":\"#f1f5f9\",\"color_link\":\"#94a3b8\",\"color_link_hover\":\"#22c55e\",\"color_border\":\"#1e293b\",\"color_copyright_bg\":\"#000000\",\"color_copyright_text\":\"#475569\"},\"buttons\":{\"font_family\":\"Inter\",\"font_weight\":600,\"font_size\":\"0.95rem\",\"text_transform\":\"none\",\"primary_bg\":\"#22c55e\",\"primary_text\":\"#ffffff\",\"primary_bg_hover\":\"#16a34a\",\"primary_border_radius\":\"0.5rem\",\"primary_padding\":\"0.75rem 1.75rem\",\"secondary_bg\":\"transparent\",\"secondary_text\":\"#22c55e\",\"secondary_border\":\"#22c55e\",\"secondary_bg_hover\":\"#f0fdf4\",\"secondary_border_radius\":\"0.5rem\"}}', '2026-07-10 14:06:54', '2026-07-16 09:45:13'),
(8, 'ecommerce_styles', '{\"global\":{\"font_family_title\":\"Inter\",\"font_family_body\":\"Inter\",\"font_weight_title\":700,\"font_weight_body\":400,\"color_primary\":\"#04752d\",\"color_accent\":\"#eab308\",\"color_text\":\"#e1e7f0\",\"color_title\":\"#0f172a\",\"color_bg_page\":\"#f8faf6\",\"font_size_h1\":\"2.25rem\",\"font_size_h2\":\"1.75rem\",\"font_size_h3\":\"1.25rem\",\"font_size_body\":\"0.95rem\",\"line_height\":\"1.5\"},\"store_hero\":{\"font_family_title\":\"Inter\",\"font_weight_title\":800,\"font_size_title\":\"2.75rem\",\"text_align\":\"center\",\"color_bg\":\"#004af7\",\"color_title\":\"#3b962a\",\"color_subtitle\":\"#eab308\",\"color_badge_bg\":\"#09d654\",\"color_badge_text\":\"#ffffff\"},\"product_card\":{\"font_family_name\":\"Inter\",\"font_weight_name\":600,\"font_size_name\":\"1rem\",\"font_size_price\":\"1.25rem\",\"font_size_description\":\"0.875rem\",\"color_bg\":\"#ffffff\",\"color_bg_hover\":\"#f0fdf4\",\"color_name\":\"#0f172a\",\"color_price\":\"#16a34a\",\"color_price_credit\":\"#eab308\",\"color_description\":\"#64748b\",\"color_border\":\"#e2e8f0\",\"color_badge_stock\":\"#dcfce7\",\"border_radius\":\"1rem\",\"btn_bg\":\"#22c55e\",\"btn_text\":\"#ffffff\",\"btn_bg_hover\":\"#16a34a\",\"btn_font_size\":\"0.875rem\",\"btn_font_weight\":600},\"product_detail\":{\"font_family_title\":\"Inter\",\"font_weight_title\":700,\"font_size_title\":\"1.875rem\",\"font_size_price\":\"3.00rem\",\"color_title\":\"#042166\",\"color_price\":\"#16a34a\",\"color_price_credit\":\"#d97706\",\"color_bg\":\"#f2ed63\",\"color_description\":\"#475569\"},\"filters\":{\"font_family\":\"Inter\",\"font_size\":\"0.875rem\",\"font_weight_active\":700,\"color_bg_active\":\"#22c55e\",\"color_text_active\":\"#ffffff\",\"color_bg_inactive\":\"#f1f5f9\",\"color_text_inactive\":\"#64748b\",\"color_border\":\"#e2e8f0\"},\"checkout\":{\"font_family\":\"Inter\",\"font_size_title\":\"1.25rem\",\"font_size_item\":\"0.95rem\",\"color_bg_panel\":\"#ffffff\",\"color_total\":\"#0f172a\",\"color_btn_checkout_bg\":\"#22c55e\",\"color_btn_checkout_text\":\"#ffffff\"}}', '2026-07-10 14:06:54', '2026-07-15 21:19:17');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_credito`
--

CREATE TABLE `tipos_credito` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL COMMENT 'Consumo, Emergencia, Vivienda, Anticipo Sueldo',
  `descripcion` text DEFAULT NULL,
  `tasa_interes` decimal(5,2) NOT NULL COMMENT 'Tasa de interés anual %',
  `plazo_min_meses` int(11) NOT NULL DEFAULT 1,
  `plazo_max_meses` int(11) NOT NULL DEFAULT 60,
  `monto_min` decimal(15,2) NOT NULL DEFAULT 100.00,
  `monto_max` decimal(15,2) NOT NULL DEFAULT 100000.00,
  `tasa_mora` decimal(5,2) NOT NULL DEFAULT 3.00 COMMENT 'Interés moratorio anual adicional %',
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tipos_credito`
--

INSERT INTO `tipos_credito` (`id`, `nombre`, `descripcion`, `tasa_interes`, `plazo_min_meses`, `plazo_max_meses`, `monto_min`, `monto_max`, `tasa_mora`, `activo`, `created_at`, `updated_at`) VALUES
(1, 'Crédito de Consumo', 'Crédito para gastos personales y familiares del socio policial.', 12.00, 1, 48, 500.00, 50000.00, 3.00, 1, '2026-04-03 17:31:28', '2026-04-03 17:31:28'),
(2, 'Crédito de Emergencia', 'Crédito de desembolso rápido para situaciones de urgencia.', 10.00, 1, 12, 100.00, 10000.00, 2.00, 1, '2026-04-03 17:31:28', '2026-04-03 17:31:28'),
(3, 'Crédito de Vivienda', 'Crédito a largo plazo para adquisición, construcción o mejora de vivienda.', 8.00, 12, 120, 10000.00, 200000.00, 3.00, 1, '2026-04-03 17:31:28', '2026-04-03 17:31:28'),
(4, 'Anticipo de Sueldo', 'Anticipo sobre haberes mensuales del socio policial.', 6.00, 1, 3, 100.00, 5000.00, 1.50, 1, '2026-04-03 17:31:28', '2026-04-03 17:31:28'),
(5, 'Crédito Educativo', 'Crédito para formación académica del socio o hijos del socio policial.', 7.00, 6, 60, 1000.00, 30000.00, 2.00, 1, '2026-04-03 17:31:28', '2026-04-03 17:31:28');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `persona_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `theme_preference` varchar(255) NOT NULL DEFAULT 'premium-olive',
  `whatsapp` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `pregunta_secreta` varchar(255) DEFAULT NULL,
  `respuesta_secreta` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `persona_id`, `name`, `email`, `theme_preference`, `whatsapp`, `email_verified_at`, `password`, `pregunta_secreta`, `respuesta_secreta`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 1, 'Comandante Root', 'admin@fapclas.com', 'premium-olive', NULL, NULL, '$2y$12$er3QgPU2wnqGpZAeT.Y4MeZGCUf/PraSdpL71hnv15NsOhzY87DwK', NULL, NULL, 'ON1OSeMsPCmhfMfAdkktpLyOeMKBiFRh2eenTUDO0LvPd3X9UKkNlqgZonGT', '2026-04-03 17:31:27', '2026-06-22 19:40:31');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `beneficios`
--
ALTER TABLE `beneficios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indices de la tabla `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indices de la tabla `cajas`
--
ALTER TABLE `cajas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cajas_user_id_foreign` (`user_id`),
  ADD KEY `cajas_estado_index` (`estado`);

--
-- Indices de la tabla `caja_denominaciones`
--
ALTER TABLE `caja_denominaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `caja_denominaciones_caja_id_foreign` (`caja_id`),
  ADD KEY `caja_denominaciones_tipo_index` (`tipo`),
  ADD KEY `caja_denominaciones_moneda_index` (`moneda`);

--
-- Indices de la tabla `caja_movimientos`
--
ALTER TABLE `caja_movimientos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `caja_movimientos_caja_id_foreign` (`caja_id`),
  ADD KEY `caja_movimientos_user_id_foreign` (`user_id`),
  ADD KEY `caja_movimientos_referencia_tipo_referencia_id_index` (`referencia_tipo`,`referencia_id`),
  ADD KEY `caja_movimientos_tipo_index` (`tipo`),
  ADD KEY `caja_movimientos_categoria_index` (`categoria`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categorias_slug_unique` (`slug`);

--
-- Indices de la tabla `compras_convenio`
--
ALTER TABLE `compras_convenio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `compras_convenio_user_id_foreign` (`user_id`),
  ADD KEY `compras_convenio_beneficio_id_foreign` (`beneficio_id`),
  ADD KEY `compras_convenio_persona_id_foreign` (`persona_id`);

--
-- Indices de la tabla `configuraciones`
--
ALTER TABLE `configuraciones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `configuraciones_key_unique` (`key`);

--
-- Indices de la tabla `creditos`
--
ALTER TABLE `creditos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `creditos_user_id_foreign` (`user_id`),
  ADD KEY `creditos_tipo_credito_id_foreign` (`tipo_credito_id`),
  ADD KEY `creditos_aprobado_por_foreign` (`aprobado_por`),
  ADD KEY `creditos_persona_id_foreign` (`persona_id`),
  ADD KEY `idx_creditos_estado` (`estado`);

--
-- Indices de la tabla `cuentas_aportacion`
--
ALTER TABLE `cuentas_aportacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cuentas_aportacion_user_id_foreign` (`user_id`),
  ADD KEY `cuentas_aportacion_persona_id_foreign` (`persona_id`);

--
-- Indices de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indices de la tabla `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indices de la tabla `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `kardex`
--
ALTER TABLE `kardex`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kardex_user_fecha_idx` (`user_id`,`fecha`),
  ADD KEY `kardex_tipo_idx` (`tipo_movimiento`),
  ADD KEY `kardex_persona_id_foreign` (`persona_id`);

--
-- Indices de la tabla `kardex_productos`
--
ALTER TABLE `kardex_productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kardex_productos_producto_id_foreign` (`producto_id`),
  ADD KEY `kardex_productos_usuario_admin_id_foreign` (`usuario_admin_id`);

--
-- Indices de la tabla `libro_diarios`
--
ALTER TABLE `libro_diarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `libro_diarios_user_id_foreign` (`user_id`),
  ADD KEY `libro_diarios_tipo_transaccion_index` (`tipo_transaccion`),
  ADD KEY `libro_diarios_referencia_id_index` (`referencia_id`),
  ADD KEY `libro_diarios_cajero_id_foreign` (`cajero_id`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  ADD KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indices de la tabla `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  ADD KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indices de la tabla `movimientos_aportacion`
--
ALTER TABLE `movimientos_aportacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `movimientos_aportacion_cuenta_aportacion_id_foreign` (`cuenta_aportacion_id`);

--
-- Indices de la tabla `noticias`
--
ALTER TABLE `noticias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `noticias_slug_unique` (`slug`);

--
-- Indices de la tabla `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`);

--
-- Indices de la tabla `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pages_slug_unique` (`slug`);

--
-- Indices de la tabla `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pedidos_numero_orden_unique` (`numero_orden`),
  ADD KEY `pedidos_user_id_foreign` (`user_id`),
  ADD KEY `pedidos_persona_id_foreign` (`persona_id`),
  ADD KEY `idx_pedidos_estado_pago` (`estado_pago`),
  ADD KEY `idx_pedidos_estado_entrega` (`estado_entrega`);

--
-- Indices de la tabla `pedido_detalles`
--
ALTER TABLE `pedido_detalles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pedido_detalles_pedido_id_foreign` (`pedido_id`),
  ADD KEY `pedido_detalles_producto_id_foreign` (`producto_id`);

--
-- Indices de la tabla `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indices de la tabla `personas`
--
ALTER TABLE `personas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personas_ci_unique` (`ci`);

--
-- Indices de la tabla `plan_pagos`
--
ALTER TABLE `plan_pagos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `plan_pagos_credito_id_foreign` (`credito_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `productos_codigo_sku_unique` (`codigo_sku`),
  ADD UNIQUE KEY `productos_slug_unique` (`slug`),
  ADD KEY `productos_categoria_id_foreign` (`categoria_id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indices de la tabla `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_has_permissions_role_id_foreign` (`role_id`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `servicios_slug_unique` (`slug`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indices de la tabla `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `site_settings_key_unique` (`key`);

--
-- Indices de la tabla `tipos_credito`
--
ALTER TABLE `tipos_credito`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_persona_id_foreign` (`persona_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `beneficios`
--
ALTER TABLE `beneficios`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cajas`
--
ALTER TABLE `cajas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `caja_denominaciones`
--
ALTER TABLE `caja_denominaciones`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT de la tabla `caja_movimientos`
--
ALTER TABLE `caja_movimientos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `compras_convenio`
--
ALTER TABLE `compras_convenio`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `configuraciones`
--
ALTER TABLE `configuraciones`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT de la tabla `creditos`
--
ALTER TABLE `creditos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cuentas_aportacion`
--
ALTER TABLE `cuentas_aportacion`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `kardex`
--
ALTER TABLE `kardex`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `kardex_productos`
--
ALTER TABLE `kardex_productos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `libro_diarios`
--
ALTER TABLE `libro_diarios`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT de la tabla `movimientos_aportacion`
--
ALTER TABLE `movimientos_aportacion`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `noticias`
--
ALTER TABLE `noticias`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `pages`
--
ALTER TABLE `pages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT de la tabla `pedido_detalles`
--
ALTER TABLE `pedido_detalles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT de la tabla `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de la tabla `personas`
--
ALTER TABLE `personas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `plan_pagos`
--
ALTER TABLE `plan_pagos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `servicios`
--
ALTER TABLE `servicios`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `site_settings`
--
ALTER TABLE `site_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `tipos_credito`
--
ALTER TABLE `tipos_credito`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cajas`
--
ALTER TABLE `cajas`
  ADD CONSTRAINT `cajas_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `caja_denominaciones`
--
ALTER TABLE `caja_denominaciones`
  ADD CONSTRAINT `caja_denominaciones_caja_id_foreign` FOREIGN KEY (`caja_id`) REFERENCES `cajas` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `caja_movimientos`
--
ALTER TABLE `caja_movimientos`
  ADD CONSTRAINT `caja_movimientos_caja_id_foreign` FOREIGN KEY (`caja_id`) REFERENCES `cajas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `caja_movimientos_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `compras_convenio`
--
ALTER TABLE `compras_convenio`
  ADD CONSTRAINT `compras_convenio_beneficio_id_foreign` FOREIGN KEY (`beneficio_id`) REFERENCES `beneficios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `compras_convenio_persona_id_foreign` FOREIGN KEY (`persona_id`) REFERENCES `personas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `compras_convenio_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `creditos`
--
ALTER TABLE `creditos`
  ADD CONSTRAINT `creditos_aprobado_por_foreign` FOREIGN KEY (`aprobado_por`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `creditos_persona_id_foreign` FOREIGN KEY (`persona_id`) REFERENCES `personas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `creditos_tipo_credito_id_foreign` FOREIGN KEY (`tipo_credito_id`) REFERENCES `tipos_credito` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `creditos_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `cuentas_aportacion`
--
ALTER TABLE `cuentas_aportacion`
  ADD CONSTRAINT `cuentas_aportacion_persona_id_foreign` FOREIGN KEY (`persona_id`) REFERENCES `personas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cuentas_aportacion_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `kardex`
--
ALTER TABLE `kardex`
  ADD CONSTRAINT `kardex_persona_id_foreign` FOREIGN KEY (`persona_id`) REFERENCES `personas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `kardex_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `kardex_productos`
--
ALTER TABLE `kardex_productos`
  ADD CONSTRAINT `kardex_productos_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `kardex_productos_usuario_admin_id_foreign` FOREIGN KEY (`usuario_admin_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `libro_diarios`
--
ALTER TABLE `libro_diarios`
  ADD CONSTRAINT `libro_diarios_cajero_id_foreign` FOREIGN KEY (`cajero_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `libro_diarios_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `movimientos_aportacion`
--
ALTER TABLE `movimientos_aportacion`
  ADD CONSTRAINT `movimientos_aportacion_cuenta_aportacion_id_foreign` FOREIGN KEY (`cuenta_aportacion_id`) REFERENCES `cuentas_aportacion` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_persona_id_foreign` FOREIGN KEY (`persona_id`) REFERENCES `personas` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `pedidos_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `pedido_detalles`
--
ALTER TABLE `pedido_detalles`
  ADD CONSTRAINT `pedido_detalles_pedido_id_foreign` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pedido_detalles_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `plan_pagos`
--
ALTER TABLE `plan_pagos`
  ADD CONSTRAINT `plan_pagos_credito_id_foreign` FOREIGN KEY (`credito_id`) REFERENCES `creditos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_categoria_id_foreign` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`);

--
-- Filtros para la tabla `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_persona_id_foreign` FOREIGN KEY (`persona_id`) REFERENCES `personas` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
