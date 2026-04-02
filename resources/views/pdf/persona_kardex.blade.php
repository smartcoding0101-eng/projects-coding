<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Kardex - {{ $persona->nombres }} {{ $persona->apellidos }}</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 10px; color: #333; margin: 0; padding: 0; }
        .header { width: 100%; border-bottom: 2px solid #1a237e; padding-bottom: 10px; margin-bottom: 20px; }
        .header table { width: 100%; }
        .logo-text { font-size: 18px; font-weight: bold; color: #1a237e; letter-spacing: 2px; }
        .institution-info { text-align: right; font-size: 8px; color: #666; }
        
        .report-title { text-align: center; font-size: 14px; font-weight: bold; text-transform: uppercase; margin-bottom: 20px; background: #f5f5f5; padding: 5px; }
        
        .section-title { font-size: 10px; font-weight: bold; background: #eee; padding: 4px; margin-top: 15px; border-left: 3px solid #1a237e; }
        
        .info-grid { width: 100%; margin-bottom: 20px; border-collapse: collapse; }
        .info-grid td { padding: 4px; border: 1px solid #eee; }
        .label { font-weight: bold; color: #555; width: 100px; }
        
        .kardex-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .kardex-table th { background: #1a237e; color: white; padding: 6px; text-transform: uppercase; font-size: 8px; text-align: left; }
        .kardex-table td { padding: 5px; border-bottom: 1px solid #eee; font-size: 9px; }
        .kardex-table tr:nth-child(even) { background: #fafafa; }
        
        .text-right { text-align: right; }
        .font-mono { font-family: 'Courier', monospace; }
        .font-bold { font-weight: bold; }
        
        .summary-box { width: 250px; margin-left: auto; margin-top: 20px; border: 1px solid #1a237e; }
        .summary-row { padding: 5px; border-bottom: 1px solid #eee; }
        .summary-row:last-child { border-bottom: none; background: #f0f4f8; }
        
        .footer { position: fixed; bottom: 30px; width: 100%; font-size: 8px; color: #999; text-align: center; }
        
        .signatures { margin-top: 80px; width: 100%; }
        .signature-box { width: 45%; text-align: center; border-top: 1px solid #333; padding-top: 10px; display: inline-block; }
        .spacer { width: 10%; display: inline-block; }

        .status-badge { padding: 2px 5px; border-radius: 3px; font-size: 8px; color: white; }
        .bg-success { background: #2e7d32; }
        .bg-danger { background: #c62828; }
    </style>
</head>
<body>
    <div class="header">
        <table>
            <tr>
                <td>
                    <div class="logo-text">FAPCLAS</div>
                    <div style="font-size: 8px;">Fondo de Auxilio Policial y Capacitación</div>
                </td>
                <td class="institution-info">
                    SISTEMA DE GESTIÓN ERP - MÓDULO DE AFILIADOS<br>
                    FECHA DE EMISIÓN: {{ $totales['fecha_reporte'] }}<br>
                    USUARIO: {{ auth()->user()->name }}
                </td>
            </tr>
        </table>
    </div>

    <div class="report-title">Estado de Cuenta Individual (Kardex Maestro)</div>

    <div class="section-title">DATOS DEL AFILIADO / SOCIO</div>
    <table class="info-grid">
        <tr>
            <td class="label">NOMBRES:</td>
            <td>{{ $persona->nombres }}</td>
            <td class="label">APELLIDOS:</td>
            <td>{{ $persona->apellidos }}</td>
        </tr>
        <tr>
            <td class="label">C.I.:</td>
            <td>{{ $persona->ci }} {{ $persona->ext_ci ? '('.$persona->ext_ci.')' : '' }}</td>
            <td class="label">GRADO / ESC.:</td>
            <td>{{ $persona->grado ?? '—' }} / {{ $persona->escalafon ?? '—' }}</td>
        </tr>
        <tr>
            <td class="label">INSTITUCIÓN:</td>
            <td>{{ $persona->institucion }}</td>
            <td class="label">DESTINO:</td>
            <td>{{ $persona->destino ?? '—' }}</td>
        </tr>
    </table>

    <div class="section-title">HISTORIAL DE MOVIMIENTOS FINANCIEROS</div>
    <table class="kardex-table">
        <thead>
            <tr>
                <th width="70">FECHA</th>
                <th width="100">OPERACIÓN</th>
                <th>CONCEPTO / DETALLE</th>
                <th width="70" class="text-right">INGRESO (Bs)</th>
                <th width="70" class="text-right">EGRESO (Bs)</th>
                <th width="80" class="text-right">SALDO (Bs)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($persona->kardex as $mov)
            <tr>
                <td class="font-mono">{{ $mov->fecha->format('d/m/Y') }}</td>
                <td class="font-bold">{{ strtoupper(str_replace('_', ' ', $mov->tipo_movimiento)) }}</td>
                <td style="font-size: 8px; color: #666;">{{ $mov->concepto }}</td>
                <td class="text-right">{{ $mov->ingreso > 0 ? number_format($mov->ingreso, 2) : '—' }}</td>
                <td class="text-right">{{ $mov->egreso > 0 ? number_format($mov->egreso, 2) : '—' }}</td>
                <td class="text-right font-bold">{{ number_format($mov->saldo_acumulado, 2) }}</td>
            </tr>
            @endforeach
            @if($persona->kardex->isEmpty())
            <tr>
                <td colspan="6" style="text-align: center; padding: 20px; color: #999;">No existen registros de movimientos financieros para este socio.</td>
            </tr>
            @endif
        </tbody>
    </table>

    <div class="summary-box">
        <div class="summary-row">
            <table width="100%">
                <tr>
                    <td>TOTAL INGRESOS:</td>
                    <td class="text-right font-bold">{{ number_format($totales['ingresos'], 2) }} Bs.</td>
                </tr>
            </table>
        </div>
        <div class="summary-row">
            <table width="100%">
                <tr>
                    <td>TOTAL EGRESOS:</td>
                    <td class="text-right font-bold">{{ number_format($totales['egresos'], 2) }} Bs.</td>
                </tr>
            </table>
        </div>
        <div class="summary-row">
            <table width="100%">
                <tr>
                    <td class="font-bold">SALDO DISPONIBLE:</td>
                    <td class="text-right font-bold" style="font-size: 11px; color: #1a237e;">{{ number_format($totales['saldo_final'], 2) }} Bs.</td>
                </tr>
            </table>
        </div>
    </div>

    <div class="signatures">
        <div class="signature-box">
            FIRMA DEL AFILIADO / SOCIO<br>
            C.I.: {{ $persona->ci }}
        </div>
        <div class="spacer"></div>
        <div class="signature-box">
            FIRMA RESPONSABLE CONTABLE<br>
            SISTEMA FAPCLAS
        </div>
    </div>

    <div class="footer">
        Este documento es un reporte oficial generado por el sistema ERP de FAPCLAS.<br>
        La alteración de este documento constituye un delito penado por ley.
    </div>
</body>
</html>
