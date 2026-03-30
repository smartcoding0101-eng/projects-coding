<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Estado de Cuenta - FAPCLAS</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; font-size: 10px; color: #333; margin: 15px; }
        .header { text-align: center; margin-bottom: 15px; border-bottom: 2px solid #1a4731; padding-bottom: 10px; }
        .header h1 { margin: 0; font-size: 16px; color: #1a4731; }
        .header p { margin: 2px 0; font-size: 9px; color: #666; }
        .socio-info { background: #f0fdf4; border: 1px solid #86efac; padding: 10px; border-radius: 4px; margin-bottom: 15px; }
        .socio-info td { padding: 3px 10px; font-size: 10px; }
        .section { margin-top: 15px; }
        .section h3 { font-size: 12px; color: #1a4731; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
        table { width: 100%; border-collapse: collapse; margin-top: 5px; }
        th { background-color: #1a4731; color: white; padding: 5px 4px; text-align: left; font-size: 8px; text-transform: uppercase; }
        td { padding: 4px; border-bottom: 1px solid #eee; font-size: 9px; }
        .text-right { text-align: right; }
        .ingreso { color: #16a34a; }
        .egreso { color: #dc2626; }
        .footer { margin-top: 20px; text-align: center; font-size: 8px; color: #999; border-top: 1px solid #eee; padding-top: 8px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>FAPCLAS R.L.</h1>
        <p>Fondo de Ahorro y Préstamo de Clases Policiales</p>
        <p><strong>ESTADO DE CUENTA DEL SOCIO</strong></p>
        <p>Generado: {{ $fecha_generacion }}</p>
    </div>

    <div class="socio-info">
        <table>
            <tr>
                <td><strong>Nombre:</strong> {{ $socio['nombre'] }}</td>
                <td><strong>CI:</strong> {{ $socio['ci'] }}</td>
                <td><strong>Grado:</strong> {{ $socio['grado'] }}</td>
            </tr>
            <tr>
                <td><strong>Destino:</strong> {{ $socio['destino'] }}</td>
                <td><strong>Escalafón:</strong> {{ $socio['escalafon'] }}</td>
                <td><strong>Saldo:</strong> Bs. {{ number_format($resumen['saldo_kardex'], 2) }}</td>
            </tr>
        </table>
    </div>

    @if(count($creditos) > 0)
    <div class="section">
        <h3>Créditos</h3>
        <table>
            <thead>
                <tr>
                    <th>#</th><th>Tipo</th><th class="text-right">Monto</th><th class="text-right">Saldo</th>
                    <th>Estado</th><th>Plazo</th><th>Pagadas</th><th>Pendientes</th>
                </tr>
            </thead>
            <tbody>
                @foreach($creditos as $c)
                <tr>
                    <td>{{ $c['id'] }}</td>
                    <td>{{ $c['tipo'] }}</td>
                    <td class="text-right">Bs. {{ number_format($c['monto_aprobado'], 2) }}</td>
                    <td class="text-right">Bs. {{ number_format($c['saldo_capital'], 2) }}</td>
                    <td>{{ $c['estado'] }}</td>
                    <td>{{ $c['plazo'] }}m</td>
                    <td>{{ $c['cuotas_pagadas'] }}</td>
                    <td>{{ $c['cuotas_pendientes'] }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    @if(count($movimientos) > 0)
    <div class="section">
        <h3>Últimos Movimientos (Kardex)</h3>
        <table>
            <thead>
                <tr>
                    <th>Fecha</th><th>Tipo</th><th>Concepto</th>
                    <th class="text-right">Ingreso</th><th class="text-right">Egreso</th><th class="text-right">Saldo</th>
                </tr>
            </thead>
            <tbody>
                @foreach($movimientos as $m)
                <tr>
                    <td>{{ $m['fecha'] }}</td>
                    <td>{{ $m['tipo'] }}</td>
                    <td>{{ $m['concepto'] }}</td>
                    <td class="text-right ingreso">{{ $m['ingreso'] > 0 ? 'Bs. '.number_format($m['ingreso'], 2) : '—' }}</td>
                    <td class="text-right egreso">{{ $m['egreso'] > 0 ? 'Bs. '.number_format($m['egreso'], 2) : '—' }}</td>
                    <td class="text-right" style="font-weight:bold;">Bs. {{ number_format($m['saldo'], 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    <div class="footer">FAPCLAS R.L. — Documento generado automáticamente — {{ $fecha_generacion }}</div>
</body>
</html>
