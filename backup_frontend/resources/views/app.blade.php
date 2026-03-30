<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <title inertia>{{ config('app.name', 'FAPCLAS R.L.') }}</title>
    @viteReactRefresh
    @vite('resources/js/app.jsx')
    @inertiaHead
  </head>
  <body class="font-sans antialiased text-gray-900 bg-[#f9faf7]">
    @inertia
  </body>
</html>
