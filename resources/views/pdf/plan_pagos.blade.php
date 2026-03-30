<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Plan de Pagos - FAPCLAS</title>
    <style>
        body { font-family: Helvetica, Arial, sans-serif; font-size: 12px; color: #333; margin: 0; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #28361d; padding-bottom: 10px; margin-bottom: 20px; }
        .title { color: #28361d; font-size: 18px; font-weight: bold; margin: 5px 0; }
        .info-grid { width: 100%; margin-bottom: 20px; border-collapse: collapse; }
        .info-grid td { padding: 5px; vertical-align: top; width: 33%; }
        .label { font-weight: bold; color: #555; }
        .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: center; font-size: 11px; }
        .table th { background-color: #f2f6ee; color: #28361d; font-weight: bold; }
        .table tr:nth-child(even) { background-color: #f9fbf7; }
        .total-row { font-weight: bold; background-color: #e9ecef; }
        .footer { margin-top: 40px; text-align: center; font-size: 10px; color: #777; border-top: 1px solid #ddd; padding-top: 10px; }
        .badge { display: inline-block; padding: 3px 6px; border-radius: 4px; font-weight: bold; font-size: 10px; }
        .badge-aprobado { background: #dce8d0; color: #28361d; border: 1px solid #28361d; }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">FAPCLAS R.L.</h1>
        <p style="margin: 0; color: #555;">Fondo de Ahorro y Préstamo de la Clase de Suboficiales y Sargentos</p>
        <h2 style="margin-top: 10px; font-size: 16px;">PLAN DE PAGOS DE CRÉDITO</h2>
        <span class="badge badge-aprobado">ESTADO: {{ strtoupper($credito->estado) }}</span>
    </div>

    <table class="info-grid">
        <tr>
            <td>
                <div><span class="label">Socio:</span> {{ $credito->user->name }}</div>
                <div><span class="label">CI:</span> {{ $credito->user->ci }}</div>
                <div><span class="label">Grado:</span> {{ $credito->user->grado }}</div>
            </td>
            <td>
                <div><span class="label">Crédito N°:</span> {{ str_pad($credito->id, 6, '0', STR_PAD_LEFT) }}</div>
                <div><span class="label">Tipo:</span> {{ $credito->tipoCredito->nombre }}</div>
                <div><span class="label">F. Desembolso:</span> {{ $credito->fecha_desembolso ? \Carbon\Carbon::parse($credito->fecha_desembolso)->format('d/m/Y') : 'Pendiente' }}</div>
            </td>
            <td>
                <div><span class="label">Monto Aprobado:</span> Bs. {{ number_format($credito->monto_aprobado, 2, ',', '.') }}</div>
                <div><span class="label">Plazo:</span> {{ $credito->plazo_meses }} meses</div>
                <div><span class="label">Tasa Anual:</span> {{ number_format($credito->tasa_interes, 2, ',', '.') }}%</div>
            </td>
        </tr>
    </table>

    <table class="table">
        <thead>
            <tr>
                <th>N° Cuota</th>
                <th>F. Vencimiento</th>
                <th>Saldo Capital</th>
                <th>Amortización</th>
                <th>Interés</th>
                <th>Cuota Total</th>
            </tr>
        </thead>
        <tbody>
            @php 
                $saldo = $credito->monto_aprobado; 
                $totalCapital = 0;
                $totalInteres = 0;
                $totalCuotas = 0;
            @endphp
            @foreach($credito->planPagos as $cuota)
                <tr>
                    <td>{{ $cuota->nro_cuota }}</td>
                    <td>{{ \Carbon\Carbon::parse($cuota->fecha_vencimiento)->format('d/m/Y') }}</td>
                    <td>Bs. {{ number_format($saldo, 2, ',', '.') }}</td>
                    <td>Bs. {{ number_format($cuota->capital_amortizado, 2, ',', '.') }}</td>
                    <td>Bs. {{ number_format($cuota->interes_pagado, 2, ',', '.') }}</td>
                    <td style="font-weight: bold;">Bs. {{ number_format($cuota->cuota_total, 2, ',', '.') }}</td>
                </tr>
                @php 
                    $saldo -= $cuota->capital_amortizado; 
                    // Evitar saldos negativos por redondeo en la última cuota
                    if ($saldo < 0.1) $saldo = 0;
                    
                    $totalCapital += $cuota->capital_amortizado;
                    $totalInteres += $cuota->interes_pagado;
                    $totalCuotas += $cuota->cuota_total;
                @endphp
            @endforeach
        </tbody>
        <tfoot>
            <tr class="total-row">
                <td colspan="3" style="text-align: right; padding-right: 15px;">TOTALES PROYECTADOS:</td>
                <td>Bs. {{ number_format($totalCapital, 2, ',', '.') }}</td>
                <td>Bs. {{ number_format($totalInteres, 2, ',', '.') }}</td>
                <td>Bs. {{ number_format($totalCuotas, 2, ',', '.') }}</td>
            </tr>
        </tfoot>
    </table>

    <div class="footer">
        Este documento es un extracto oficial generado por el Sistema ERP FAPCLAS.<br>
        Documento Válido para control interno del Socio.<br>
        Generado el: {{ now()->format('d/m/Y H:i:s') }}
    </div>
</body>
</html>
