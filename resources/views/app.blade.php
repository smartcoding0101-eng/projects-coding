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
    @endphp
    <link rel="icon" href="{{ $faviconUrl }}" />
    <meta name="description" content="{{ $metaDescription }}" />
    <meta name="keywords" content="{{ $metaKeywords }}" />
    <!-- Google Fonts: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    @routes
    @viteReactRefresh
    @vite('resources/js/app.jsx')
    @inertiaHead
  </head>
  <body class="font-sans antialiased text-gray-900" style="background-color: #f8faf6; font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;">
    @inertia
  </body>
</html>
