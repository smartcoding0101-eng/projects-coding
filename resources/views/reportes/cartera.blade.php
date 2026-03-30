<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte de Cartera - FAPCLAS</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; font-size: 10px; color: #333; margin: 15px; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #1a4731; padding-bottom: 10px; }
        .header h1 { margin: 0; font-size: 16px; color: #1a4731; }
        .header p { margin: 2px 0; font-size: 9px; color: #666; }
        .resumen { display: flex; margin-bottom: 15px; }
        .resumen-item { border: 1px solid #ddd; padding: 8px 12px; margin-right: 10px; border-radius: 4px; text-align: center; display: inline-block; }
        .resumen-item .valor { font-size: 14px; font-weight: bold; color: #1a4731; }
        .resumen-item .label { font-size: 8px; color: #888; text-transform: uppercase; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background-color: #1a4731; color: white; padding: 6px 4px; text-align: left; font-size: 8px; text-transform: uppercase; }
        td { padding: 5px 4px; border-bottom: 1px solid #eee; font-size: 9px; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .estado-desembolsado { color: #2563eb; font-weight: bold; }
        .estado-mora { color: #dc2626; font-weight: bold; }
        .estado-pagado { color: #16a34a; font-weight: bold; }
        .text-right { text-align: right; }
        .footer { margin-top: 20px; text-align: center; font-size: 8px; color: #999; border-top: 1px solid #eee; padding-top: 8px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>FAPCLAS R.L.</h1>
        <p>Fondo de Ahorro y Préstamo de Clases Policiales</p>
        <p><strong>REPORTE DE CARTERA DE CRÉDITOS</strong></p>
        <p>Generado: {{ $fecha_generacion }}</p>
    </div>

    <div class="resumen">
        <div class="resumen-item">
            <div class="valor">{{ $resumen['total_creditos'] }}</div>
            <div class="label">Total Créditos</div>
        </div>
        <div class="resumen-item">
            <div class="valor">{{ $resumen['vigentes'] }}</div>
            <div class="label">Vigentes</div>
        </div>
        <div class="resumen-item">
            <div class="valor" style="color:#dc2626">{{ $resumen['en_mora'] }}</div>
            <div class="label">En Mora</div>
        </div>
        <div class="resumen-item">
            <div class="valor" style="color:#16a34a">{{ $resumen['pagados'] }}</div>
            <div class="label">Pagados</div>
        </div>
        <div class="resumen-item">
            <div class="valor">Bs. {{ number_format($resumen['monto_total_otorgado'], 2) }}</div>
            <div class="label">Monto Otorgado</div>
        </div>
        <div class="resumen-item">
            <div class="valor">Bs. {{ number_format($resumen['monto_vigente'], 2) }}</div>
            <div class="label">Saldo Vigente</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Socio</th>
                <th>CI</th>
                <th>Grado</th>
                <th>Tipo Crédito</th>
                <th class="text-right">Monto Aprobado</th>
                <th class="text-right">Saldo Capital</th>
                <th>Tasa</th>
                <th>Plazo</th>
                <th>Estado</th>
                <th>Desembolso</th>
            </tr>
        </thead>
        <tbody>
            @foreach($creditos as $c)
            <tr>
                <td>{{ $c['id'] }}</td>
                <td>{{ $c['socio'] }}</td>
                <td>{{ $c['ci'] }}</td>
                <td>{{ $c['grado'] }}</td>
                <td>{{ $c['tipo'] }}</td>
                <td class="text-right">Bs. {{ number_format($c['monto_aprobado'], 2) }}</td>
                <td class="text-right">Bs. {{ number_format($c['saldo_capital'], 2) }}</td>
                <td>{{ $c['tasa'] }}%</td>
                <td>{{ $c['plazo'] }}m</td>
                <td class="{{ $c['estado'] === 'En Mora' ? 'estado-mora' : ($c['estado'] === 'Pagado' ? 'estado-pagado' : 'estado-desembolsado') }}">
                    {{ $c['estado'] }}
                </td>
                <td>{{ $c['fecha_desembolso'] }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        FAPCLAS R.L. — Documento generado automáticamente — {{ $fecha_generacion }}
    </div>
</body>
</html>
