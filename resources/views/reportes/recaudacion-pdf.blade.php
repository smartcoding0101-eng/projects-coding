<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reporte de Recaudación - FAPCLAS</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; font-size: 10px; color: #333; margin: 0; padding: 0; }
        .header { text-align: center; border-bottom: 2px solid #1e293b; padding-bottom: 10px; margin-bottom: 20px; }
        .title { font-size: 16px; font-weight: bold; text-transform: uppercase; margin: 0; color: #0f172a; }
        .subtitle { font-size: 10px; color: #64748b; margin-top: 5px; }
        
        .kpi-container { margin-bottom: 20px; width: 100%; border-spacing: 10px 0; }
        .kpi-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; text-align: center; border-radius: 8px; }
        .kpi-label { font-size: 8px; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 4px; }
        .kpi-value { font-size: 14px; font-weight: bold; color: #1e293b; }

        .section-title { font-size: 11px; font-weight: bold; text-transform: uppercase; background: #1e293b; color: white; padding: 5px 10px; margin-bottom: 10px; border-radius: 4px; }
        
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background: #f1f5f9; color: #475569; font-weight: bold; text-transform: uppercase; font-size: 8px; padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        td { padding: 8px; border-bottom: 1px solid #f1f5f9; font-size: 9px; }
        .text-right { text-align: right; }
        .footer { position: fixed; bottom: -30px; width: 100%; text-align: center; font-size: 8px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 5px; }
        .bold { font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">Reporte de Recaudación y Colocación</h1>
        <div class="subtitle">Periodo: {{ date('d/m/Y', strtotime($filtros['desde'])) }} al {{ date('d/m/Y', strtotime($filtros['hasta'])) }} | Generado: {{ $fecha_reporte }}</div>
    </div>

    <table class="kpi-container">
        <tr>
            <td class="kpi-card" width="33%">
                <div class="kpi-label">Total Recaudado</div>
                <div class="kpi-value">Bs. {{ number_format($resumen['total_recaudado'], 2) }}</div>
            </td>
            <td class="kpi-card" width="33%">
                <div class="kpi-label">Total Colocado</div>
                <div class="kpi-value">Bs. {{ number_format($resumen['total_colocado'], 2) }}</div>
            </td>
            <td class="kpi-card" width="33%">
                <div class="kpi-label">Índice Recuperación</div>
                <div class="kpi-value">{{ $resumen['recuperacion_ratio'] }}%</div>
            </td>
        </tr>
    </table>

    <div class="section-title">Desglose de Recaudación (Pagos Recibidos)</div>
    <table>
        <thead>
            <tr>
                <th>Fecha</th>
                <th>Socio</th>
                <th>Crédito</th>
                <th>Cuota</th>
                <th class="text-right">Capital</th>
                <th class="text-right">Interés</th>
                <th class="text-right">Total</th>
                <th>Método</th>
            </tr>
        </thead>
        <tbody>
            @foreach($detalle_pagos as $p)
            <tr>
                <td>{{ $p['fecha'] }}</td>
                <td>{{ $p['socio'] }}</td>
                <td>#{{ $p['credito_id'] }}</td>
                <td>{{ $p['cuota'] }}</td>
                <td class="text-right">{{ number_format($p['capital'], 2) }}</td>
                <td class="text-right">{{ number_format($p['interes'], 2) }}</td>
                <td class="text-right bold">{{ number_format($p['total'], 2) }}</td>
                <td>{{ $p['metodo'] }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="section-title">Desglose de Colocación (Créditos Desembolsados)</div>
    <table>
        <thead>
            <tr>
                <th>Fecha</th>
                <th>Socio</th>
                <th>Tipo de Crédito</th>
                <th class="text-right">Monto Desembolsado</th>
                <th>Tasa</th>
            </tr>
        </thead>
        <tbody>
            @foreach($detalle_colocaciones as $c)
            <tr>
                <td>{{ $c['fecha'] }}</td>
                <td>{{ $c['socio'] }}</td>
                <td>{{ $c['tipo'] }}</td>
                <td class="text-right bold">{{ number_format($c['monto'], 2) }}</td>
                <td>{{ $c['tasa'] }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        FAPCLAS v3.5 - Sistema de Gestión de Cartera de Créditos | Acceso Auditado
    </div>
</body>
</html>
