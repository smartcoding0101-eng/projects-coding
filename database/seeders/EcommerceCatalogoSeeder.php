<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Categoria;
use App\Models\Producto;

class EcommerceCatalogoSeeder extends Seeder
{
    public function run(): void
    {
        $categorias = [
            [
                'nombre' => 'Médicos',
                'slug' => 'medicos',
                'descripcion' => 'Equipamiento médico y primeros auxilios para el personal policial.',
                'activa' => true,
                'productos' => [
                    [
                        'codigo_sku' => 'MED-001',
                        'nombre' => 'Estetoscopio Profesional',
                        'slug' => 'estetoscopio-profesional',
                        'descripcion' => 'Estetoscopio de doble campana de alta precisión para auscultación cardíaca y pulmonar. Acero inoxidable, olivas suaves.',
                        'precio_general' => 185.00,
                        'precio_asociado' => 155.00,
                        'stock_actual' => 25,
                        'stock_minimo' => 5,
                        'imagen_path' => 'productos/medicos_estetoscopio.png',
                        'activo' => true,
                    ],
                    [
                        'codigo_sku' => 'MED-002',
                        'nombre' => 'Tensiómetro Digital',
                        'slug' => 'tensiometro-digital',
                        'descripcion' => 'Monitor de presión arterial digital de brazo con pantalla LCD grande. Detección de arritmia, memoria para 2 usuarios.',
                        'precio_general' => 220.00,
                        'precio_asociado' => 180.00,
                        'stock_actual' => 18,
                        'stock_minimo' => 3,
                        'imagen_path' => 'productos/medicos_tensiometro.png',
                        'activo' => true,
                    ],
                    [
                        'codigo_sku' => 'MED-003',
                        'nombre' => 'Botiquín de Emergencia',
                        'slug' => 'botiquin-emergencia',
                        'descripcion' => 'Kit completo de primeros auxilios con 120 piezas: vendas, gasas, antisépticos, tijeras, pinzas y guía de emergencia.',
                        'precio_general' => 150.00,
                        'precio_asociado' => 120.00,
                        'stock_actual' => 30,
                        'stock_minimo' => 8,
                        'imagen_path' => 'productos/medicos_botiquin.png',
                        'activo' => true,
                    ],
                ],
            ],
            [
                'nombre' => 'Ropa',
                'slug' => 'ropa',
                'descripcion' => 'Indumentaria táctica y uniformes institucionales de alta calidad.',
                'activa' => true,
                'productos' => [
                    [
                        'codigo_sku' => 'ROP-001',
                        'nombre' => 'Chaqueta Táctica Ripstop',
                        'slug' => 'chaqueta-tactica-ripstop',
                        'descripcion' => 'Chaqueta táctica en tela Ripstop reforzada, múltiples bolsillos, resistente al agua. Color verde olivo.',
                        'precio_general' => 350.00,
                        'precio_asociado' => 285.00,
                        'stock_actual' => 40,
                        'stock_minimo' => 10,
                        'imagen_path' => 'productos/ropa_chaqueta_tactica.png',
                        'activo' => true,
                    ],
                    [
                        'codigo_sku' => 'ROP-002',
                        'nombre' => 'Botas de Combate',
                        'slug' => 'botas-combate',
                        'descripcion' => 'Botas tácticas negras de cuero genuino con suela antideslizante, soporte de tobillo reforzado. Impermeable.',
                        'precio_general' => 420.00,
                        'precio_asociado' => 350.00,
                        'stock_actual' => 22,
                        'stock_minimo' => 5,
                        'imagen_path' => 'productos/ropa_botas_combate.png',
                        'activo' => true,
                    ],
                    [
                        'codigo_sku' => 'ROP-003',
                        'nombre' => 'Polo Institucional FAPCLAS',
                        'slug' => 'polo-institucional-fapclas',
                        'descripcion' => 'Polo de algodón piqué 100% con logo FAPCLAS bordado. Verde oscuro. Tallas S a XXL.',
                        'precio_general' => 95.00,
                        'precio_asociado' => 75.00,
                        'stock_actual' => 60,
                        'stock_minimo' => 15,
                        'imagen_path' => 'productos/ropa_polo_institucional.png',
                        'activo' => true,
                    ],
                ],
            ],
            [
                'nombre' => 'Bebidas',
                'slug' => 'bebidas',
                'descripcion' => 'Bebidas naturales y artesanales de producción nacional boliviana.',
                'activa' => true,
                'productos' => [
                    [
                        'codigo_sku' => 'BEB-001',
                        'nombre' => 'Café Premium Boliviano',
                        'slug' => 'cafe-premium-boliviano',
                        'descripcion' => 'Café de altura de los Yungas, tostado medio, grano seleccionado. Bolsa 500g. Notas chocolate y frutos rojos.',
                        'precio_general' => 65.00,
                        'precio_asociado' => 50.00,
                        'stock_actual' => 80,
                        'stock_minimo' => 20,
                        'imagen_path' => 'productos/bebidas_cafe_premium.png',
                        'activo' => true,
                    ],
                    [
                        'codigo_sku' => 'BEB-002',
                        'nombre' => 'Té de Hierbas Andinas',
                        'slug' => 'te-hierbas-andinas',
                        'descripcion' => 'Infusión de hierbas medicinales del altiplano: muña, manzanilla y cedrón. Caja de 25 sobres. Relajante natural.',
                        'precio_general' => 28.00,
                        'precio_asociado' => 22.00,
                        'stock_actual' => 100,
                        'stock_minimo' => 25,
                        'imagen_path' => 'productos/bebidas_te_hierbas.png',
                        'activo' => true,
                    ],
                    [
                        'codigo_sku' => 'BEB-003',
                        'nombre' => 'Jugo Natural Tropical',
                        'slug' => 'jugo-natural-tropical',
                        'descripcion' => 'Jugo 100% natural de frutas tropicales: mango, naranja y maracuyá. Botella de vidrio 750ml. Sin conservantes.',
                        'precio_general' => 18.00,
                        'precio_asociado' => 14.00,
                        'stock_actual' => 120,
                        'stock_minimo' => 30,
                        'imagen_path' => 'productos/bebidas_jugo_natural.png',
                        'activo' => true,
                    ],
                ],
            ],
            [
                'nombre' => 'Libros',
                'slug' => 'libros',
                'descripcion' => 'Publicaciones de desarrollo profesional, jurídico y personal.',
                'activa' => true,
                'productos' => [
                    [
                        'codigo_sku' => 'LIB-001',
                        'nombre' => 'Derecho Policial Boliviano',
                        'slug' => 'derecho-policial-boliviano',
                        'descripcion' => 'Manual jurídico actualizado sobre la normativa policial boliviana. Incluye Ley Orgánica de la Policía y reglamentos vigentes.',
                        'precio_general' => 120.00,
                        'precio_asociado' => 90.00,
                        'stock_actual' => 35,
                        'stock_minimo' => 8,
                        'imagen_path' => 'productos/libros_derecho_policial.png',
                        'activo' => true,
                    ],
                    [
                        'codigo_sku' => 'LIB-002',
                        'nombre' => 'Finanzas Personales para Policías',
                        'slug' => 'finanzas-personales-policias',
                        'descripcion' => 'Guía práctica de administración financiera, ahorro e inversión orientada al personal policial y sus familias.',
                        'precio_general' => 85.00,
                        'precio_asociado' => 65.00,
                        'stock_actual' => 45,
                        'stock_minimo' => 10,
                        'imagen_path' => 'productos/libros_finanzas.png',
                        'activo' => true,
                    ],
                    [
                        'codigo_sku' => 'LIB-003',
                        'nombre' => 'Liderazgo y Mando Policial',
                        'slug' => 'liderazgo-mando-policial',
                        'descripcion' => 'Estrategias de liderazgo, gestión de equipos y toma de decisiones bajo presión para mandos policiales.',
                        'precio_general' => 98.00,
                        'precio_asociado' => 78.00,
                        'stock_actual' => 28,
                        'stock_minimo' => 5,
                        'imagen_path' => 'productos/libros_liderazgo.png',
                        'activo' => true,
                    ],
                ],
            ],
        ];

        foreach ($categorias as $catData) {
            $productos = $catData['productos'];
            unset($catData['productos']);

            $categoria = Categoria::updateOrCreate(
                ['slug' => $catData['slug']],
                $catData
            );

            foreach ($productos as $prodData) {
                Producto::updateOrCreate(
                    ['codigo_sku' => $prodData['codigo_sku']],
                    array_merge($prodData, ['categoria_id' => $categoria->id])
                );
            }
        }

        $this->command->info('✅ 4 categorías y 12 productos creados con imágenes.');
    }
}
