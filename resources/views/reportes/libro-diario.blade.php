<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Libro Diario - FAPCLAS</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; font-size: 10px; color: #333; margin: 15px; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #1a4731; padding-bottom: 10px; }
        .header h1 { margin: 0; font-size: 16px; color: #1a4731; }
        .header p { margin: 2px 0; font-size: 9px; color: #666; }
        .resumen { margin-bottom: 15px; }
        .resumen-item { border: 1px solid #ddd; padding: 8px 12px; margin-right: 8px; border-radius: 4px; text-align: center; display: inline-block; min-width: 100px; }
        .resumen-item .valor { font-size: 13px; font-weight: bold; color: #1a4731; }
        .resumen-item .label { font-size: 7px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
        .filtros { background: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 4px; padding: 6px 10px; margin-bottom: 12px; font-size: 8px; color: #666; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background-color: #1a4731; color: white; padding: 6px 4px; text-align: left; font-size: 8px; text-transform: uppercase; letter-spacing: 0.3px; }
        td { padding: 5px 4px; border-bottom: 1px solid #eee; font-size: 9px; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .ingreso { color: #16a34a; font-weight: bold; }
        .egreso { color: #dc2626; font-weight: bold; }
        .tipo-badge { display: inline-block; padding: 1px 6px; border-radius: 8px; font-size: 7px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.3px; }
        .tipo-venta_ecommerce { background: #d1fae5; color: #065f46; }
        .tipo-desembolso_credito { background: #fef3c7; color: #92400e; }
        .tipo-pago_cuota { background: #ede9fe; color: #5b21b6; }
        .tipo-mora { background: #fee2e2; color: #991b1b; }
        .tipo-aporte { background: #dbeafe; color: #1e40af; }
        .tipo-default { background: #f3f4f6; color: #4b5563; }
        .totales td { border-top: 2px solid #1a4731; font-weight: bold; font-size: 10px; background: #f0fdf4; }
        .footer { margin-top: 20px; text-align: center; font-size: 8px; color: #999; border-top: 1px solid #eee; padding-top: 8px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>FAPCLAS R.L.</h1>
        <p>Fondo de Ahorro y Préstamo de Clases Policiales</p>
        <p><strong>LIBRO DIARIO MAYOR — REGISTRO CENTRAL CONTABLE</strong></p>
        <p>Generado: {{ $fecha_generacion }}</p>
    </div>

    @if(!empty($filtros_texto))
    <div class="filtros">
        <strong>Filtros aplicados:</strong> {{ $filtros_texto }}
    </div>
    @endif

    <div class="resumen">
        <div class="resumen-item">
            <div class="valor">{{ $totales['asientos'] }}</div>
            <div class="label">Total Asientos</div>
        </div>
        <div class="resumen-item">
            <div class="valor ingreso">Bs. {{ number_format($totales['debe'], 2) }}</div>
            <div class="label">Total Debe (Ingresos)</div>
        </div>
        <div class="resumen-item">
            <div class="valor egreso">Bs. {{ number_format($totales['haber'], 2) }}</div>
            <div class="label">Total Haber (Egresos)</div>
        </div>
        <div class="resumen-item">
            <div class="valor" style="color: {{ $totales['balance'] >= 0 ? '#16a34a' : '#dc2626' }}">Bs. {{ number_format($totales['balance'], 2) }}</div>
            <div class="label">Balance Neto</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width:12%">Fecha</th>
                <th style="width:6%">ID</th>
                <th style="width:18%">Socio</th>
                <th>Concepto</th>
                <th style="width:10%">Tipo</th>
                <th style="width:10%" class="text-right">Cajero</th>
                <th style="width:12%" class="text-right">Debe (Bs.)</th>
                <th style="width:12%" class="text-right">Haber (Bs.)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($asientos as $a)
            <tr>
                <td>{{ \Carbon\Carbon::parse($a->fecha)->format('d/m/Y') }}</td>
                <td>#{{ str_pad($a->id, 6, '0', STR_PAD_LEFT) }}</td>
                <td>
                    @if($a->user)
                        {{ $a->user->name }}
                        @if($a->user->persona)
                            <br><span style="font-size:7px; color:#888;">CI: {{ $a->user->persona->ci }}</span>
                        @endif
                    @else
                        <em>Cuenta Institucional</em>
                    @endif
                </td>
                <td>{{ $a->concepto }}</td>
                <td>
                    @php
                        $tipoClass = match($a->tipo_transaccion) {
                            'venta_ecommerce' => 'tipo-venta_ecommerce',
                            'desembolso_credito' => 'tipo-desembolso_credito',
                            'pago_cuota' => 'tipo-pago_cuota',
                            'mora' => 'tipo-mora',
                            'aporte' => 'tipo-aporte',
                            default => 'tipo-default',
                        };
                    @endphp
                    <span class="tipo-badge {{ $tipoClass }}">{{ str_replace('_', ' ', $a->tipo_transaccion) }}</span>
                </td>
                <td class="text-right" style="font-size:7px; color:#888;">{{ $a->cajero?->name ?? '—' }}</td>
                <td class="text-right">
                    @if($a->ingreso > 0)
                        <span class="ingreso">{{ number_format($a->ingreso, 2) }}</span>
                    @else
                        —
                    @endif
                </td>
                <td class="text-right">
                    @if($a->egreso > 0)
                        <span class="egreso">{{ number_format($a->egreso, 2) }}</span>
                    @else
                        —
                    @endif
                </td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr class="totales">
                <td colspan="6" class="text-right"><strong>TOTALES GENERALES:</strong></td>
                <td class="text-right ingreso">Bs. {{ number_format($totales['debe'], 2) }}</td>
                <td class="text-right egreso">Bs. {{ number_format($totales['haber'], 2) }}</td>
            </tr>
        </tfoot>
    </table>

    <div class="footer">
        FAPCLAS R.L. — Libro Diario Mayor — Documento generado automáticamente — {{ $fecha_generacion }}
    </div>
</body>
</html>
