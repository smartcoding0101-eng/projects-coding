<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte de Morosidad - FAPCLAS</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; font-size: 10px; color: #333; margin: 15px; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #991b1b; padding-bottom: 10px; }
        .header h1 { margin: 0; font-size: 16px; color: #991b1b; }
        .header p { margin: 2px 0; font-size: 9px; color: #666; }
        .resumen-item { border: 1px solid #ddd; padding: 8px 12px; margin-right: 10px; border-radius: 4px; text-align: center; display: inline-block; }
        .resumen-item .valor { font-size: 14px; font-weight: bold; color: #991b1b; }
        .resumen-item .label { font-size: 8px; color: #888; text-transform: uppercase; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background-color: #991b1b; color: white; padding: 6px 4px; text-align: left; font-size: 8px; text-transform: uppercase; }
        td { padding: 5px 4px; border-bottom: 1px solid #eee; font-size: 9px; }
        tr:nth-child(even) { background-color: #fff5f5; }
        .text-right { text-align: right; }
        .footer { margin-top: 20px; text-align: center; font-size: 8px; color: #999; border-top: 1px solid #eee; padding-top: 8px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>FAPCLAS R.L.</h1>
        <p>Fondo de Ahorro y Préstamo de Clases Policiales</p>
        <p><strong>REPORTE DE MOROSIDAD</strong></p>
        <p>Generado: {{ $fecha_generacion }}</p>
    </div>

    <div style="margin-bottom: 15px;">
        <div class="resumen-item">
            <div class="valor">{{ $resumen['total_cuotas_atrasadas'] }}</div>
            <div class="label">Cuotas Atrasadas</div>
        </div>
        <div class="resumen-item">
            <div class="valor">{{ $resumen['socios_afectados'] }}</div>
            <div class="label">Socios Afectados</div>
        </div>
        <div class="resumen-item">
            <div class="valor">Bs. {{ number_format($resumen['total_capital_moroso'], 2) }}</div>
            <div class="label">Capital Moroso</div>
        </div>
        <div class="resumen-item">
            <div class="valor">Bs. {{ number_format($resumen['total_mora_acumulada'], 2) }}</div>
            <div class="label">Mora Acumulada</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Crédito</th>
                <th>Socio</th>
                <th>CI</th>
                <th>Grado</th>
                <th>Tipo</th>
                <th>Cuota</th>
                <th>Vencimiento</th>
                <th>Días Mora</th>
                <th class="text-right">Capital</th>
                <th class="text-right">Interés</th>
                <th class="text-right">Mora</th>
                <th class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($cuotas as $c)
            <tr>
                <td>{{ $c['credito_id'] }}</td>
                <td>{{ $c['socio'] }}</td>
                <td>{{ $c['ci'] }}</td>
                <td>{{ $c['grado'] }}</td>
                <td>{{ $c['tipo_credito'] }}</td>
                <td>{{ $c['nro_cuota'] }}</td>
                <td>{{ $c['fecha_vencimiento'] }}</td>
                <td style="color:#991b1b; font-weight:bold;">{{ $c['dias_mora'] }}</td>
                <td class="text-right">Bs. {{ number_format($c['capital'], 2) }}</td>
                <td class="text-right">Bs. {{ number_format($c['interes'], 2) }}</td>
                <td class="text-right" style="color:#991b1b;">Bs. {{ number_format($c['mora'], 2) }}</td>
                <td class="text-right" style="font-weight:bold;">Bs. {{ number_format($c['total'], 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">FAPCLAS R.L. — Documento generado automáticamente — {{ $fecha_generacion }}</div>
</body>
</html>
