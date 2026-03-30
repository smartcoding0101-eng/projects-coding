<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Planilla de Descuento - FAPCLAS</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; font-size: 10px; color: #333; margin: 15px; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #1a4731; padding-bottom: 10px; }
        .header h1 { margin: 0; font-size: 16px; color: #1a4731; }
        .header p { margin: 2px 0; font-size: 9px; color: #666; }
        .periodo { font-size: 13px; font-weight: bold; color: #1a4731; text-transform: uppercase; }
        .resumen-item { border: 1px solid #ddd; padding: 8px 12px; margin-right: 10px; border-radius: 4px; text-align: center; display: inline-block; }
        .resumen-item .valor { font-size: 14px; font-weight: bold; color: #1a4731; }
        .resumen-item .label { font-size: 8px; color: #888; text-transform: uppercase; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background-color: #1a4731; color: white; padding: 6px 4px; text-align: left; font-size: 8px; text-transform: uppercase; }
        td { padding: 5px 4px; border-bottom: 1px solid #eee; font-size: 9px; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .text-right { text-align: right; }
        .total-row { background-color: #1a4731 !important; color: white; font-weight: bold; }
        .footer { margin-top: 30px; }
        .firma { display: inline-block; width: 200px; text-align: center; border-top: 1px solid #333; padding-top: 5px; margin: 0 30px; font-size: 9px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $cooperativa }}</h1>
        <p>Fondo de Ahorro y Préstamo de Clases Policiales</p>
        <p><strong>{{ $titulo }}</strong></p>
        <p class="periodo">Período: {{ $periodo }}</p>
        <p>Generado: {{ $fecha_generacion }}</p>
    </div>

    <div style="margin-bottom: 15px;">
        <div class="resumen-item">
            <div class="valor">{{ $total_socios }}</div>
            <div class="label">Socios</div>
        </div>
        <div class="resumen-item">
            <div class="valor">{{ $total_cuotas }}</div>
            <div class="label">Cuotas</div>
        </div>
        <div class="resumen-item">
            <div class="valor">Bs. {{ number_format($total_general, 2) }}</div>
            <div class="label">Total a Descontar</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Socio</th>
                <th>CI</th>
                <th>Grado</th>
                <th>Destino</th>
                <th>Escalafón</th>
                <th>Crédito</th>
                <th>Tipo</th>
                <th>Cuota</th>
                <th class="text-right">Capital</th>
                <th class="text-right">Interés</th>
                <th class="text-right">Mora</th>
                <th class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $item)
            <tr>
                <td>{{ $item['socio_nombre'] }}</td>
                <td>{{ $item['socio_ci'] }}</td>
                <td>{{ $item['socio_grado'] }}</td>
                <td>{{ $item['socio_destino'] }}</td>
                <td>{{ $item['socio_escalafon'] }}</td>
                <td>#{{ $item['credito_id'] }}</td>
                <td>{{ $item['tipo_credito'] }}</td>
                <td>{{ $item['nro_cuota'] }}</td>
                <td class="text-right">Bs. {{ number_format($item['capital'], 2) }}</td>
                <td class="text-right">Bs. {{ number_format($item['interes'], 2) }}</td>
                <td class="text-right">Bs. {{ number_format($item['mora'], 2) }}</td>
                <td class="text-right" style="font-weight:bold;">Bs. {{ number_format($item['total_descontar'], 2) }}</td>
            </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="11" class="text-right">TOTAL GENERAL</td>
                <td class="text-right">Bs. {{ number_format($total_general, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <div class="footer" style="text-align: center; margin-top: 40px;">
        <div class="firma">Elaborado por</div>
        <div class="firma">Revisado por</div>
        <div class="firma">Aprobado por</div>
    </div>

    <div style="text-align: center; margin-top: 20px; font-size: 8px; color: #999;">
        FAPCLAS R.L. — Documento generado automáticamente — {{ $fecha_generacion }}
    </div>
</body>
</html>
