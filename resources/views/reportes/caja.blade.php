<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Libro de Caja General - FAPCLAS</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; font-size: 10px; color: #333; margin: 15px; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #1a4731; padding-bottom: 10px; }
        .header h1 { margin: 0; font-size: 16px; color: #1a4731; }
        .header p { margin: 2px 0; font-size: 9px; color: #666; }
        .resumen { margin-bottom: 15px; }
        .resumen-item { border: 1px solid #ddd; padding: 8px 12px; margin-right: 10px; border-radius: 4px; text-align: center; display: inline-block; min-width: 120px; }
        .resumen-item .valor { font-size: 14px; font-weight: bold; color: #1a4731; }
        .resumen-item .label { font-size: 8px; color: #888; text-transform: uppercase; }
        .ingreso { color: #16a34a; font-weight: bold; }
        .egreso { color: #dc2626; font-weight: bold; }
        .saldo-col { background-color: #f0fdf4; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background-color: #1a4731; color: white; padding: 6px 4px; text-align: left; font-size: 8px; text-transform: uppercase; }
        td { padding: 5px 4px; border-bottom: 1px solid #eee; font-size: 9px; }
        tr:nth-child(even) { background-color: #f9fafb; }
        .text-right { text-align: right; }
        .footer { margin-top: 20px; text-align: center; font-size: 8px; color: #999; border-top: 1px solid #eee; padding-top: 8px; }
        .periodo { font-size: 10px; font-weight: bold; color: #1a4731; margin-bottom: 10px; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1>FAPCLAS R.L.</h1>
        <p>Fondo de Ahorro y Préstamo de Clases Policiales</p>
        <p><strong>LIBRO DE CAJA GENERAL</strong></p>
        <p>Generado: {{ $fecha_generacion }}</p>
    </div>

    <div class="periodo">
        Período: {{ $filtros['desde'] }} al {{ $filtros['hasta'] }}
        @if($filtros['cajero'])
            — Cajero: {{ $filtros['cajero'] }}
        @endif
    </div>

    <div class="resumen">
        <div class="resumen-item">
            <div class="valor">Bs. {{ number_format($resumen['saldo_inicial'], 2) }}</div>
            <div class="label">Saldo Inicial</div>
        </div>
        <div class="resumen-item">
            <div class="valor ingreso">+ Bs. {{ number_format($resumen['total_ingresos'], 2) }}</div>
            <div class="label">Total Ingresos</div>
        </div>
        <div class="resumen-item">
            <div class="valor egreso">- Bs. {{ number_format($resumen['total_egresos'], 2) }}</div>
            <div class="label">Total Egresos</div>
        </div>
        <div class="resumen-item">
            <div class="valor" style="font-size: 16px;">Bs. {{ number_format($resumen['saldo_final'], 2) }}</div>
            <div class="label">Saldo Final en Caja</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Concepto</th>
                <th>Socio / Origen</th>
                <th>Cajero</th>
                <th class="text-right">Ingreso (Bs)</th>
                <th class="text-right">Egreso (Bs)</th>
                <th class="text-right" style="background:#166534;">Saldo (Bs)</th>
            </tr>
        </thead>
        <tbody>
            @forelse($movimientos as $m)
            <tr>
                <td>{{ $m['id'] }}</td>
                <td>{{ $m['fecha'] }}</td>
                <td>{{ $m['concepto'] }}</td>
                <td>{{ $m['socio'] }}</td>
                <td>{{ $m['cajero'] }}</td>
                <td class="text-right">
                    @if($m['ingreso'] > 0)
                        <span class="ingreso">{{ number_format($m['ingreso'], 2) }}</span>
                    @else
                        —
                    @endif
                </td>
                <td class="text-right">
                    @if($m['egreso'] > 0)
                        <span class="egreso">{{ number_format($m['egreso'], 2) }}</span>
                    @else
                        —
                    @endif
                </td>
                <td class="text-right saldo-col">{{ number_format($m['saldo'], 2) }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="8" style="text-align:center; padding:20px; color:#999;">No se encontraron movimientos en el período seleccionado.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        FAPCLAS R.L. — Libro de Caja General — Documento generado automáticamente — {{ $fecha_generacion }}
    </div>
</body>
</html>
