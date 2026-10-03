<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <title inertia>{{ config('app.name', 'FAPCLAS R.L.') }}</title>
    
    @php
        $headerSettings = \App\Models\SiteSetting::get('header', []);
        $faviconPath = $headerSettings['favicon'] ?? null;
        $faviconUrl = $faviconPath ? asset('storage/' . $faviconPath) : asset('favicon.ico');
        $metaDescription = $headerSettings['meta_description'] ?? 'FAPCLAS R.L. - Cooperativa de Ahorro y Crédito Solidaria.';
        $metaKeywords = $headerSettings['meta_keywords'] ?? 'cooperativa, ahorro, creditos, fapclas';

        // Estilos dinámicos independientes por sección
        $isEcommerce = request()->is('beneficios*');
        $s = $isEcommerce
            ? \App\Models\SiteSetting::get('ecommerce_styles', [])
            : \App\Models\SiteSetting::get('landing_styles', []);

        // Acceso a sub-bloques con fallback
        $g  = $s['global']        ?? [];
        $hero = $s['hero']        ?? [];
        $nav  = $s['nav']         ?? [];
        $st   = $s['section_title'] ?? [];
        $cards = $s['cards']      ?? [];
        $stats = $s['stats']      ?? [];
        $testimonials = $s['testimonials'] ?? [];
        $footer = $s['footer']    ?? [];
        $btns = $s['buttons']     ?? [];
        // Ecommerce-specific blocks
        $sh  = $s['store_hero']    ?? [];
        $pc  = $s['product_card']  ?? [];
        $pd  = $s['product_detail'] ?? [];
        $fil = $s['filters']       ?? [];
        $chk = $s['checkout']      ?? [];

        // Colectar fuentes únicas para Google Fonts
        $fontsUsed = array_unique(array_filter([
            $g['font_family_title']        ?? 'Inter',
            $g['font_family_body']         ?? 'Inter',
            $hero['font_family_title']     ?? null,
            $nav['font_family']            ?? null,
            $st['font_family']             ?? null,
            $cards['font_family_title']    ?? null,
            $footer['font_family']         ?? null,
            $btns['font_family']           ?? null,
            $sh['font_family_title']       ?? null,
            $pc['font_family_name']        ?? null,
            $pd['font_family_title']       ?? null,
        ]));

        $systemFonts = ['Arial', 'Georgia', 'Times New Roman', 'Calibri'];
        $webFonts = array_diff($fontsUsed, $systemFonts);
        $googleFontsQuery = implode('&', array_map(
            fn($f) => 'family=' . urlencode($f) . ':wght@100;200;300;400;500;600;700;800;900',
            $webFonts
        ));
    @endphp

    <link rel="icon" href="{{ $faviconUrl }}" />
    <link rel="shortcut icon" href="{{ $faviconUrl }}" type="image/x-icon" />
    <link rel="apple-touch-icon" href="{{ $faviconUrl }}" />
    <meta name="description" content="{{ $metaDescription }}" />
    <meta name="keywords" content="{{ $metaKeywords }}" />
    
    <!-- Google Fonts dinámicos (solo fuentes web) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    @if(!empty($googleFontsQuery))
        <link href="https://fonts.googleapis.com/css2?{{ $googleFontsQuery }}&display=swap" rel="stylesheet">
    @endif

    <style>
        /* ============================================================
         * Variables CSS por Bloque — generadas dinámicamente desde BD
         * ============================================================ */
        :root {
            /* ── GLOBAL ─────────────────────────────────────── */
            --font-title:        '{{ $g['font_family_title'] ?? 'Inter' }}', ui-sans-serif, system-ui, sans-serif;
            --font-body:         '{{ $g['font_family_body']  ?? 'Inter' }}', ui-sans-serif, system-ui, sans-serif;
            --font-weight-title: {{ $g['font_weight_title'] ?? '700' }};
            --font-weight-body:  {{ $g['font_weight_body']  ?? '400' }};
            --color-primary:     {{ $g['color_primary']     ?? '#22c55e' }};
            --color-secondary:   {{ $g['color_secondary'] ?? $g['color_accent'] ?? '#eab308' }};
            --color-text:        {{ $g['color_text']         ?? '#1e293b' }};
            --color-title:       {{ $g['color_title']        ?? '#0f172a' }};
            --color-bg-page:     {{ $g['color_bg_page']      ?? '#f8faf6' }};
            --size-h1:           {{ $g['font_size_h1']       ?? '2.5rem' }};
            --size-h2:           {{ $g['font_size_h2']       ?? '2rem' }};
            --size-h3:           {{ $g['font_size_h3']       ?? '1.5rem' }};
            --size-body:         {{ $g['font_size_body']     ?? '1rem' }};
            --size-small:        {{ $g['font_size_small']    ?? '0.875rem' }};
            --line-height:       {{ $g['line_height']        ?? '1.65' }};
            --letter-spacing:    {{ $g['letter_spacing']     ?? '0em' }};

            /* ── HERO ────────────────────────────────────────── */
            --hero-font-title:        '{{ $hero['font_family_title'] ?? $g['font_family_title'] ?? 'Inter' }}', ui-sans-serif, sans-serif;
            --hero-font-weight-title: {{ $hero['font_weight_title']    ?? '900' }};
            --hero-text-transform:    {{ $hero['text_transform_title'] ?? 'none' }};
            --hero-text-align:        {{ $hero['text_align']           ?? 'left' }};
            --hero-size-title:        {{ $hero['font_size_title']      ?? '3.5rem' }};
            --hero-size-subtitle:     {{ $hero['font_size_subtitle']   ?? '1.5rem' }};
            --hero-size-desc:         {{ $hero['font_size_description'] ?? '1.125rem' }};
            --hero-letter-spacing:    {{ $hero['letter_spacing_title'] ?? '-0.02em' }};
            --hero-line-height:       {{ $hero['line_height_title']    ?? '1.1' }};
            --hero-color-title:       {{ $hero['color_title']          ?? '#ffffff' }};
            --hero-color-subtitle:    {{ $hero['color_subtitle']       ?? '#eab308' }};
            --hero-color-desc:        {{ $hero['color_description']    ?? '#cbd5e1' }};
            --hero-overlay:           {{ $hero['color_overlay']        ?? '#0f172a' }};
            --hero-overlay-opacity:   {{ $hero['overlay_opacity']      ?? '0.55' }};
            --hero-btn-primary-bg:    {{ $hero['btn_primary_bg']       ?? '#22c55e' }};
            --hero-btn-primary-text:  {{ $hero['btn_primary_text']     ?? '#ffffff' }};
            --hero-btn-secondary-bg:  {{ $hero['btn_secondary_bg']     ?? 'transparent' }};
            --hero-btn-secondary-text:{{ $hero['btn_secondary_text']   ?? '#ffffff' }};
            --hero-btn-radius:        {{ $hero['btn_border_radius']    ?? '0.5rem' }};

            /* ── NAVEGACIÓN ──────────────────────────────────── */
            --nav-font:         '{{ $nav['font_family']    ?? $g['font_family_body'] ?? 'Inter' }}', sans-serif;
            --nav-font-weight:  {{ $nav['font_weight']     ?? '500' }};
            --nav-font-size:    {{ $nav['font_size']       ?? '0.9rem' }};
            --nav-transform:    {{ $nav['text_transform']  ?? 'none' }};
            --nav-bg:           {{ $nav['color_bg']        ?? '#0f172a' }};
            --nav-bg-scroll:    {{ $nav['color_bg_scroll'] ?? '#1e293b' }};
            --nav-link:         {{ $nav['color_link']      ?? '#f1f5f9' }};
            --nav-link-hover:   {{ $nav['color_link_hover'] ?? '#22c55e' }};
            --nav-logo:         {{ $nav['color_logo']      ?? '#ffffff' }};
            --topbar-bg:        {{ $nav['topbar_bg']       ?? '#166534' }};
            --topbar-text:      {{ $nav['topbar_text']     ?? '#dcfce7' }};
            --topbar-size:      {{ $nav['topbar_font_size'] ?? '0.8rem' }};

            /* ── TÍTULOS DE SECCIÓN ──────────────────────────── */
            --st-font:         '{{ $st['font_family']    ?? $g['font_family_title'] ?? 'Inter' }}', sans-serif;
            --st-weight:       {{ $st['font_weight']      ?? '800' }};
            --st-size:         {{ $st['font_size']        ?? '2rem' }};
            --st-transform:    {{ $st['text_transform']   ?? 'none' }};
            --st-align:        {{ $st['text_align']       ?? 'center' }};
            --st-color:        {{ $st['color_title']      ?? '#0f172a' }};
            --st-subtitle-color: {{ $st['color_subtitle'] ?? '#64748b' }};
            --st-badge-bg:     {{ $st['color_badge']      ?? '#22c55e' }};
            --st-badge-text:   {{ $st['color_badge_text'] ?? '#ffffff' }};
            --st-margin-bottom:{{ $st['margin_bottom']   ?? '3rem' }};
            --st-subtitle-size:{{ $st['font_size_subtitle'] ?? '1.1rem' }};
            --st-letter-spacing:{{ $st['letter_spacing']  ?? '0em' }};
            --st-line-height:  {{ $st['line_height']      ?? '1.3' }};

            /* ── TARJETAS ─────────────────────────────────────── */
            --card-font:          '{{ $cards['font_family_title'] ?? $g['font_family_title'] ?? 'Inter' }}', sans-serif;
            --card-weight-title:  {{ $cards['font_weight_title']  ?? '700' }};
            --card-size-title:    {{ $cards['font_size_title']    ?? '1.25rem' }};
            --card-size-body:     {{ $cards['font_size_body']     ?? '0.95rem' }};
            --card-bg:            {{ $cards['color_bg']           ?? '#ffffff' }};
            --card-bg-hover:      {{ $cards['color_bg_hover']     ?? '#f0fdf4' }};
            --card-color-title:   {{ $cards['color_title']        ?? '#0f172a' }};
            --card-color-body:    {{ $cards['color_body']         ?? '#64748b' }};
            --card-color-icon:    {{ $cards['color_icon']         ?? '#22c55e' }};
            --card-border:        {{ $cards['color_border']       ?? '#e2e8f0' }};
            --card-border-hover:  {{ $cards['color_border_hover'] ?? '#22c55e' }};
            --card-radius:        {{ $cards['border_radius']      ?? '1rem' }};
            --card-padding:       {{ $cards['padding']            ?? '1.5rem' }};

            /* ── ESTADÍSTICAS ────────────────────────────────── */
            --stats-font:         '{{ $stats['font_family_value'] ?? $g['font_family_title'] ?? 'Inter' }}', sans-serif;
            --stats-weight:       {{ $stats['font_weight_value']  ?? '800' }};
            --stats-size-value:   {{ $stats['font_size_value']    ?? '3rem' }};
            --stats-size-label:   {{ $stats['font_size_label']    ?? '0.9rem' }};
            --stats-bg:           {{ $stats['color_bg']           ?? '#0f172a' }};
            --stats-color-value:  {{ $stats['color_value']        ?? '#22c55e' }};
            --stats-color-label:  {{ $stats['color_label']        ?? '#94a3b8' }};
            --stats-color-icon:   {{ $stats['color_icon']         ?? '#eab308' }};

            /* ── TESTIMONIOS ─────────────────────────────────── */
            --test-font:         '{{ $testimonials['font_family_quote'] ?? $g['font_family_body'] ?? 'Inter' }}', sans-serif;
            --test-style:        {{ $testimonials['font_style_quote']   ?? 'italic' }};
            --test-size-quote:   {{ $testimonials['font_size_quote']    ?? '1.1rem' }};
            --test-size-author:  {{ $testimonials['font_size_author']   ?? '0.95rem' }};
            --test-card-bg:      {{ $testimonials['color_bg_card']      ?? 'rgba(255,255,255,0.05)' }};
            --test-color-text:   {{ $testimonials['color_quote_text']   ?? '#e2e8f0' }};
            --test-color-author: {{ $testimonials['color_author']       ?? '#94a3b8' }};
            --test-color-stars:  {{ $testimonials['color_stars']        ?? '#eab308' }};
            --test-section-bg:   {{ $testimonials['color_section_bg']  ?? '#0f172a' }};

            /* ── FOOTER ──────────────────────────────────────── */
            --footer-font:          '{{ $footer['font_family']       ?? $g['font_family_body'] ?? 'Inter' }}', sans-serif;
            --footer-size-body:     {{ $footer['font_size_body']      ?? '0.9rem' }};
            --footer-size-title:    {{ $footer['font_size_title']     ?? '1rem' }};
            --footer-weight-title:  {{ $footer['font_weight_title']   ?? '600' }};
            --footer-bg:            {{ $footer['color_bg']            ?? '#020617' }};
            --footer-color-text:    {{ $footer['color_text']          ?? '#94a3b8' }};
            --footer-color-title:   {{ $footer['color_title']         ?? '#f1f5f9' }};
            --footer-color-link:    {{ $footer['color_link']          ?? '#94a3b8' }};
            --footer-color-hover:   {{ $footer['color_link_hover']    ?? '#22c55e' }};
            --footer-border:        {{ $footer['color_border']        ?? '#1e293b' }};
            --footer-copy-bg:       {{ $footer['color_copyright_bg']  ?? '#000000' }};
            --footer-copy-text:     {{ $footer['color_copyright_text'] ?? '#475569' }};

            /* ── BOTONES ─────────────────────────────────────── */
            --btn-font:            '{{ $btns['font_family']           ?? $g['font_family_body'] ?? 'Inter' }}', sans-serif;
            --btn-weight:          {{ $btns['font_weight']             ?? '600' }};
            --btn-size:            {{ $btns['font_size']               ?? '0.95rem' }};
            --btn-transform:       {{ $btns['text_transform']          ?? 'none' }};
            --btn-primary-bg:      {{ $btns['primary_bg']              ?? '#22c55e' }};
            --btn-primary-text:    {{ $btns['primary_text']            ?? '#ffffff' }};
            --btn-primary-hover:   {{ $btns['primary_bg_hover']        ?? '#16a34a' }};
            --btn-primary-radius:  {{ $btns['primary_border_radius']   ?? '0.5rem' }};
            --btn-secondary-bg:    {{ $btns['secondary_bg']            ?? 'transparent' }};
            --btn-secondary-text:  {{ $btns['secondary_text']          ?? '#22c55e' }};
            --btn-secondary-border:{{ $btns['secondary_border']        ?? '#22c55e' }};
            --btn-secondary-hover: {{ $btns['secondary_bg_hover']      ?? '#f0fdf4' }};
            --btn-secondary-radius:{{ $btns['secondary_border_radius'] ?? '0.5rem' }};

            /* ── E-COMMERCE: HERO TIENDA ─────────────────────── */
            --sh-font:         '{{ $sh['font_family_title'] ?? $g['font_family_title'] ?? 'Inter' }}', sans-serif;
            --sh-weight:       {{ $sh['font_weight_title']  ?? '800' }};
            --sh-size-title:   {{ $sh['font_size_title']    ?? '2.75rem' }};
            --sh-align:        {{ $sh['text_align']         ?? 'center' }};
            --sh-bg:           {{ $sh['color_bg']           ?? '#0f172a' }};
            --sh-color-title:  {{ $sh['color_title']        ?? '#ffffff' }};
            --sh-color-sub:    {{ $sh['color_subtitle']     ?? '#eab308' }};
            --sh-badge-bg:     {{ $sh['color_badge_bg']     ?? '#22c55e' }};
            --sh-badge-text:   {{ $sh['color_badge_text']   ?? '#ffffff' }};

            /* ── E-COMMERCE: TARJETA PRODUCTO ────────────────── */
            --pc-font:            '{{ $pc['font_family_name']    ?? $g['font_family_body'] ?? 'Inter' }}', sans-serif;
            --pc-weight-name:     {{ $pc['font_weight_name']      ?? '600' }};
            --pc-size-name:       {{ $pc['font_size_name']        ?? '1rem' }};
            --pc-size-price:      {{ $pc['font_size_price']       ?? '1.25rem' }};
            --pc-size-desc:       {{ $pc['font_size_description'] ?? '0.875rem' }};
            --pc-bg:              {{ $pc['color_bg']              ?? '#ffffff' }};
            --pc-bg-hover:        {{ $pc['color_bg_hover']        ?? '#f0fdf4' }};
            --pc-color-name:      {{ $pc['color_name']            ?? '#0f172a' }};
            --pc-color-price:     {{ $pc['color_price']           ?? '#16a34a' }};
            --pc-color-credit:    {{ $pc['color_price_credit']    ?? '#eab308' }};
            --pc-color-desc:      {{ $pc['color_description']     ?? '#64748b' }};
            --pc-border:          {{ $pc['color_border']          ?? '#e2e8f0' }};
            --pc-radius:          {{ $pc['border_radius']         ?? '1rem' }};
            --pc-btn-bg:          {{ $pc['btn_bg']                ?? '#22c55e' }};
            --pc-btn-text:        {{ $pc['btn_text']              ?? '#ffffff' }};
            --pc-btn-hover:       {{ $pc['btn_bg_hover']          ?? '#16a34a' }};

            /* ── E-COMMERCE: DETALLE PRODUCTO ────────────────── */
            --pd-font:         '{{ $pd['font_family_title'] ?? $g['font_family_title'] ?? 'Inter' }}', sans-serif;
            --pd-weight:       {{ $pd['font_weight_title']  ?? '700' }};
            --pd-size-title:   {{ $pd['font_size_title']    ?? '1.875rem' }};
            --pd-size-price:   {{ $pd['font_size_price']    ?? '1.75rem' }};
            --pd-color-title:  {{ $pd['color_title']        ?? '#0f172a' }};
            --pd-color-price:  {{ $pd['color_price']        ?? '#16a34a' }};
            --pd-color-credit: {{ $pd['color_price_credit'] ?? '#d97706' }};
            --pd-bg:           {{ $pd['color_bg']           ?? '#f8faf6' }};
            --pd-color-desc:   {{ $pd['color_description']  ?? '#475569' }};

            /* ── E-COMMERCE: FILTROS ─────────────────────────── */
            --fil-font:          '{{ $fil['font_family']          ?? $g['font_family_body'] ?? 'Inter' }}', sans-serif;
            --fil-size:          {{ $fil['font_size']              ?? '0.875rem' }};
            --fil-weight-active: {{ $fil['font_weight_active']     ?? '700' }};
            --fil-active-bg:     {{ $fil['color_bg_active']        ?? '#22c55e' }};
            --fil-active-text:   {{ $fil['color_text_active']      ?? '#ffffff' }};
            --fil-inactive-bg:   {{ $fil['color_bg_inactive']      ?? '#f1f5f9' }};
            --fil-inactive-text: {{ $fil['color_text_inactive']    ?? '#64748b' }};
            --fil-border:        {{ $fil['color_border']           ?? '#e2e8f0' }};

            /* ── E-COMMERCE: CHECKOUT ────────────────────────── */
            --chk-font:       '{{ $chk['font_family']           ?? $g['font_family_body'] ?? 'Inter' }}', sans-serif;
            --chk-size-title: {{ $chk['font_size_title']         ?? '1.25rem' }};
            --chk-size-item:  {{ $chk['font_size_item']          ?? '0.95rem' }};
            --chk-panel-bg:   {{ $chk['color_bg_panel']          ?? '#ffffff' }};
            --chk-total:      {{ $chk['color_total']             ?? '#0f172a' }};
            --chk-btn-bg:     {{ $chk['color_btn_checkout_bg']   ?? '#22c55e' }};
            --chk-btn-text:   {{ $chk['color_btn_checkout_text'] ?? '#ffffff' }};
        }

        /* ── Estilos base aplicados ─────────────────────────────── */
        body {
            font-family: var(--font-body) !important;
            color: var(--color-text) !important;
            line-height: var(--line-height) !important;
            font-size: var(--size-body) !important;
            background-color: var(--color-bg-page) !important;
            font-weight: var(--font-weight-body) !important;
        }
        /* Títulos globales base (sin !important en color para permitir sobrescrituras locales y de Tailwind) */
        h1, h2, h3, h4, h5, h6, .font-title {
            font-family: var(--font-title);
            color: var(--color-title);
            font-weight: var(--font-weight-title);
        }
        h1 { font-size: var(--size-h1); }
        h2 { font-size: var(--size-h2); }
        h3 { font-size: var(--size-h3); }
        small, .text-sm { font-size: var(--size-small); }

        /* Títulos de sección configurables desde Filament (Pestaña "Secciones / Títulos") */
        .section-title, [data-section-title], h2.section-title {
            font-family: var(--st-font, var(--font-title)) !important;
            color: var(--st-color, #0f172a) !important;
            font-weight: var(--st-weight, 800) !important;
            text-transform: var(--st-transform, none) !important;
            letter-spacing: var(--st-letter-spacing, 0em) !important;
            line-height: var(--st-line-height, 1.3) !important;
        }

        /* Títulos de tarjetas configurables desde Filament (Pestaña "Tarjetas") */
        .card-title, [data-card-title] {
            font-family: var(--card-font, var(--font-title)) !important;
            color: var(--card-color-title, #0f172a) !important;
            font-weight: var(--card-weight-title, 700) !important;
            font-size: var(--card-size-title, 1.25rem) !important;
        }

        /* Cuando una tarjeta es destacada o tiene fondo oscuro, su texto siempre debe mantenerse visible */
        .card-title-white, .is-destacado .card-title, .bg-primary h4, .bg-primary .card-title {
            color: #ffffff !important;
        }

        /* Sección de Testimonios (Fondo verde oscuro / bg-primary): Títulos y textos blancos */
        #testimonios h2, #testimonios h3, #testimonios .text-secondary, #testimonios [data-text-type] {
            color: #ffffff !important;
        }
        #testimonios h2 {
            color: #ffffff !important;
            opacity: 0.95;
        }
        #testimonios h3 {
            color: #ffffff !important;
        }

        /* Footer: Títulos de columnas (Accesos Rápidos, Contáctanos, etc.) en color blanco */
        footer h4, footer .font-bold.text-white, footer [data-footer-title] {
            color: var(--footer-color-title, #ffffff) !important;
        }

        /* Login / Auth banner: Título sobre fondo oscuro siempre blanco */
        .text-white, h1.text-white, h2.text-white, h3.text-white, h4.text-white {
            color: #ffffff !important;
        }
    </style>
    
    @routes
    @viteReactRefresh
    @vite('resources/js/app.jsx')
    @inertiaHead
  </head>
  <body class="font-sans antialiased text-gray-900">
    @inertia
  </body>
</html>
