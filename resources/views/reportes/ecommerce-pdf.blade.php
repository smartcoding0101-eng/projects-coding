<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reporte E-commerce - FAPCLAS</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; font-size: 10px; color: #333; margin: 0; padding: 0; }
        .header { text-align: center; border-bottom: 2px solid #f97316; padding-bottom: 10px; margin-bottom: 20px; }
        .title { font-size: 16px; font-weight: bold; text-transform: uppercase; margin: 0; color: #ea580c; }
        .subtitle { font-size: 10px; color: #64748b; margin-top: 5px; }
        
        .kpi-container { margin-bottom: 20px; width: 100%; border-spacing: 10px 0; }
        .kpi-card { background: #fff7ed; border: 1px solid #ffedd5; padding: 12px; text-align: center; border-radius: 12px; }
        .kpi-label { font-size: 8px; text-transform: uppercase; color: #9a3412; font-weight: bold; margin-bottom: 4px; }
        .kpi-value { font-size: 14px; font-weight: bold; color: #ea580c; }

        .section-title { font-size: 11px; font-weight: bold; text-transform: uppercase; background: #ea580c; color: white; padding: 6px 12px; margin-bottom: 12px; border-radius: 6px; }
        
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background: #fff7ed; color: #9a3412; font-weight: bold; text-transform: uppercase; font-size: 8px; padding: 10px; text-align: left; border-bottom: 2px solid #ffedd5; }
        td { padding: 10px; border-bottom: 1px solid #fff7ed; font-size: 9px; }
        .text-right { text-align: right; }
        .footer { position: fixed; bottom: -30px; width: 100%; text-align: center; font-size: 8px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 8px; }
        .bold { font-weight: bold; }
        .status { padding: 2px 6px; border-radius: 4px; font-size: 8px; text-transform: uppercase; font-weight: bold; }
        .status-pagado { background: #dcfce7; color: #166534; }
        .status-pendiente { background: #fef9c3; color: #854d0e; }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">Inteligencia Comercial E-Commerce</h1>
        <div class="subtitle">Analítica del: {{ date('d/m/Y', strtotime($filtros['desde'])) }} al {{ date('d/m/Y', strtotime($filtros['hasta'])) }} | Generado: {{ $fecha_reporte }}</div>
    </div>

    <table class="kpi-container">
        <tr>
            <td class="kpi-card" width="25%">
                <div class="kpi-label">Ventas Periodo</div>
                <div class="kpi-value">Bs. {{ number_format($kpis['ventas_periodo'], 2) }}</div>
            </td>
            <td class="kpi-card" width="25%">
                <div class="kpi-label">Pedidos Totales</div>
                <div class="kpi-value">{{ $kpis['pedidos_total'] }}</div>
            </td>
            <td class="kpi-card" width="25%">
                <div class="kpi-label">Ticket Promedio</div>
                <div class="kpi-value">Bs. {{ number_format($kpis['ticket_promedio'], 2) }}</div>
            </td>
            <td class="kpi-card" width="25%">
                <div class="kpi-label">Stock Valorizado</div>
                <div class="kpi-value">Bs. {{ number_format($kpis['stock_valorizado'], 2) }}</div>
            </td>
        </tr>
    </table>

    <div class="section-title">Top 5 Productos Estratégicos</div>
    <table>
        <thead>
            <tr>
                <th>Producto</th>
                <th class="text-right">Unidades Vendidas</th>
                <th class="text-right">Recaudado (Bs)</th>
                <th class="text-right">Impacto</th>
            </tr>
        </thead>
        <tbody>
            @foreach($top_productos as $i => $item)
            <tr>
                <td class="bold">#{{ $i+1 }} {{ $item->nombre }}</td>
                <td class="text-right">{{ $item->total_vendido }}</td>
                <td class="text-right bold">{{ number_format($item->recaudado, 2) }}</td>
                <td class="text-right" style="color: #ea580c">ALTO</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="section-title">Historial Reciente de Pedidos</div>
    <table>
        <thead>
            <tr>
                <th>Nro Orden</th>
                <th>Cliente</th>
                <th>Método</th>
                <th>Estado</th>
                <th class="text-right">Total Bs.</th>
                <th>Fecha</th>
            </tr>
        </thead>
        <tbody>
            @foreach($recientes as $p)
            <tr>
                <td class="bold">{{ $p['orden'] }}</td>
                <td>{{ $p['cliente'] }}</td>
                <td>{{ strtoupper($p['metodo']) }}</td>
                <td>
                    <span class="status status-{{ $p['estado'] }}">
                        {{ $p['estado'] }}
                    </span>
                </td>
                <td class="text-right bold">{{ number_format($p['total'], 2) }}</td>
                <td>{{ $p['fecha'] }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        FAPCLAS BI System v3.5 | Reporte de Inteligencia Comercial y Transaccional
    </div>
</body>
</html>
