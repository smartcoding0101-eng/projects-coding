<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Certificado Histórico de Crédito</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; font-size: 11px; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #059669; padding-bottom: 10px; }
        .title { font-size: 18px; font-weight: bold; color: #059669; text-transform: uppercase; }
        .socio-info { margin-bottom: 20px; background: #f9fafb; padding: 15px; border-radius: 8px; }
        .socio-info table { width: 100%; }
        .label { font-weight: bold; color: #6b7280; width: 120px; }
        .value { font-weight: bold; }
        
        .summary-grid { margin-bottom: 20px; width: 100%; border-collapse: collapse; }
        .summary-item { padding: 10px; border: 1px solid #e5e7eb; text-align: center; width: 25%; }
        .summary-label { font-size: 9px; color: #6b7280; text-transform: uppercase; display: block; margin-bottom: 4px; }
        .summary-value { font-size: 14px; font-weight: bold; color: #111827; }

        .section-title { font-size: 12px; font-weight: bold; margin-bottom: 10px; border-left: 4px solid #059669; padding-left: 8px; background: #ecfdf5; padding-top: 4px; padding-bottom: 4px; }
        
        table.data { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table.data th { background: #f3f4f6; padding: 8px; text-align: left; border-bottom: 1px solid #d1d5db; font-size: 9px; text-transform: uppercase; }
        table.data td { padding: 8px; border-bottom: 1px solid #e5e7eb; }
        
        .status { border-radius: 4px; padding: 2px 6px; font-size: 9px; font-weight: bold; text-transform: uppercase; }
        .status-pagado { background: #d1fae5; color: #065f46; }
        .status-pendiente { background: #dbeafe; color: #1e40af; }
        .status-mora { background: #fee2e2; color: #991b1b; }
        
        .footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 9px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">Certificado de Histórico Crediticio</div>
        <div style="font-size: 10px; margin-top: 5px;">Cooperativa de Ahorro y Crédito FAPCLAS</div>
    </div>

    <div class="socio-info">
        <table>
            <tr>
                <td class="label">Afiliado:</td>
                <td class="value">{{ $socio_seleccionado->name }}</td>
                <td class="label">Identificación:</td>
                <td class="value">{{ $socio_seleccionado->ci ?? 'N/D' }}</td>
            </tr>
            <tr>
                <td class="label">Grado/Cargo:</td>
                <td class="value">{{ $socio_seleccionado->grado ?? 'Socio' }}</td>
                <td class="label">Fecha Reporte:</td>
                <td class="value">{{ now()->format('d/m/Y H:i') }}</td>
            </tr>
        </table>
    </div>

    <table class="summary-grid">
        <tr>
            <td class="summary-item">
                <span class="summary-label">Créditos Totales</span>
                <span class="summary-value">{{ $metricas['creditos_totales'] }}</span>
            </td>
            <td class="summary-item">
                <span class="summary-label">Capital Aprobado</span>
                <span class="summary-value">Bs {{ number_format($metricas['monto_total_aprobado'], 2) }}</span>
            </td>
            <td class="summary-item">
                <span class="summary-label">Capital Amortizado</span>
                <span class="summary-value">Bs {{ number_format($metricas['capital_pagado_total'], 2) }}</span>
            </td>
            <td class="summary-item">
                <span class="summary-label">Eventos de Mora</span>
                <span class="summary-value" style="color: #b91c1c;">{{ $metricas['cuotas_mora_historicas'] }}</span>
            </td>
        </tr>
    </table>

    <div class="section-title">Expedientes de Crédito Solicitados</div>
    <table class="data">
        <thead>
            <tr>
                <th>ID</th>
                <th>Tipo de Crédito</th>
                <th>Fecha Solicitud</th>
                <th style="text-align: right;">Monto Aprobado</th>
                <th style="text-align: center;">Estado</th>
            </tr>
        </thead>
        <tbody>
            @foreach($historial_creditos as $c)
                <tr>
                    <td>#{{ $c->id }}</td>
                    <td>{{ $c->tipo_credito->nombre ?? 'General' }}</td>
                    <td>{{ $c->created_at->format('d/m/Y') }}</td>
                    <td style="text-align: right; font-weight: bold;">Bs {{ number_format($c->monto_aprobado, 2) }}</td>
                    <td style="text-align: center;">
                        <span class="status {{ $c->estado == 'Pagado' ? 'status-pagado' : ($c->estado == 'En Mora' ? 'status-mora' : 'status-pendiente') }}">
                            {{ $c->estado }}
                        </span>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="section-title">Historial de Amortización y Pagos</div>
    <table class="data">
        <thead>
            <tr>
                <th>Vencimiento</th>
                <th>Crédito</th>
                <th>Cuota</th>
                <th style="text-align: right;">Monto Total</th>
                <th style="text-align: center;">Estado</th>
                <th>Fecha de Pago</th>
            </tr>
        </thead>
        <tbody>
            @foreach($historial_pagos as $p)
                <tr>
                    <td>{{ $p['vencimiento'] }}</td>
                    <td>{{ $p['credito'] }}</td>
                    <td>{{ $p['cuota'] }}</td>
                    <td style="text-align: right;">Bs {{ number_format($p['total'], 2) }}</td>
                    <td style="text-align: center;">
                        <span class="status {{ $p['estado'] == 'Pagada' ? 'status-pagado' : 'status-mora' }}">
                            {{ $p['estado'] }}
                        </span>
                    </td>
                    <td>{{ $p['fecha_pago'] ?? '---' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Este documento es un reporte interno informativo generado digitalmente para uso exclusivo de FAPCLAS. 
        Página 1 de 1
    </div>
</body>
</html>
