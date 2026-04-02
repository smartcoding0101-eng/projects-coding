<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Comprobante de Pedido - {{ $pedido->numero_orden }}</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: #2c3e50;
            line-height: 1.5;
            margin: 0;
            padding: 0;
            font-size: 11px;
            background-color: #ffffff;
        }
        .container {
            padding: 30px;
        }
        .header-table {
            width: 100%;
            margin-bottom: 25px;
            border-bottom: 3px solid #1a2312;
            padding-bottom: 15px;
        }
        .logo-container {
            width: 50%;
            vertical-align: middle;
        }
        .logo-container img {
            max-height: 65px;
            max-width: 200px;
            object-fit: contain;
        }
        .logo-text {
            font-size: 30px;
            font-weight: 900;
            color: #1a2312;
            letter-spacing: -1px;
            margin: 0;
        }
        .logo-text-sub {
            color: #618541;
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        .company-details {
            width: 50%;
            text-align: right;
            vertical-align: bottom;
            font-size: 10px;
            color: #555;
        }
        
        .title-box {
            background-color: #f7fbfa;
            border-left: 5px solid #618541;
            padding: 15px 20px;
            margin-bottom: 25px;
        }
        .title-box h1 {
            margin: 0 0 5px 0;
            color: #1a2312;
            font-size: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .title-box p {
            margin: 0;
            font-size: 12px;
            font-weight: bold;
            color: #666;
        }
        
        .info-grid {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
        }
        .info-grid td {
            width: 50%;
            vertical-align: top;
            padding: 0;
        }
        .info-panel {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 12px 15px;
            margin-right: 10px;
            min-height: 80px;
        }
        .info-panel.right {
            margin-right: 0;
            margin-left: 10px;
        }
        .panel-title {
            font-size: 10px;
            text-transform: uppercase;
            color: #94a3b8;
            font-weight: 900;
            margin-bottom: 8px;
            letter-spacing: 1px;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 4px;
        }
        .info-value {
            font-size: 12px;
            font-weight: bold;
            color: #1a2312;
            margin-bottom: 3px;
        }
        .info-sub {
            font-size: 10px;
            color: #64748b;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .items-table th {
            background-color: #1a2312;
            color: #ffffff;
            text-align: left;
            padding: 10px;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            border: 1px solid #1a2312;
        }
        .items-table td {
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
            border-left: 1px solid #e2e8f0;
            border-right: 1px solid #e2e8f0;
            vertical-align: top;
            font-size: 11px;
        }
        .items-table tr.stripe {
            background-color: #f8fafc;
        }
        .item-name {
            font-weight: bold;
            color: #1a2312;
            font-size: 11px;
        }
        .item-sku {
            font-size: 9px;
            color: #94a3b8;
        }

        .summary-wrapper {
            width: 100%;
            margin-top: 20px;
        }
        .terms-box {
            width: 60%;
            float: left;
            font-size: 9px;
            color: #64748b;
            padding-right: 20px;
            text-align: justify;
        }
        .terms-title {
            font-weight: bold;
            color: #1a2312;
            margin-bottom: 5px;
            text-transform: uppercase;
        }
        .totals-table {
            width: 35%;
            float: right;
            border-collapse: collapse;
        }
        .totals-table td {
            padding: 6px 10px;
            font-size: 11px;
            color: #475569;
        }
        .totals-table td.label {
            text-align: right;
            font-weight: bold;
        }
        .totals-table td.value {
            text-align: right;
            border-left: 1px solid #e2e8f0;
        }
        .total-final-row {
            background-color: #618541;
            color: white;
            font-weight: 900;
        }
        .total-final-row td {
            color: white;
            font-size: 14px;
            border: none;
            padding: 10px;
        }

        .clearfix {
            clear: both;
        }

        .footer {
            margin-top: 40px;
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
            text-align: center;
        }
        .barcode {
            font-family: 'Courier New', Courier, monospace;
            font-size: 12px;
            letter-spacing: 4px;
            font-weight: bold;
            color: #94a3b8;
            margin-bottom: 5px;
        }
        .footer-text {
            font-size: 9px;
            color: #cbd5e1;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
    </style>
</head>
<body>
    <div class="container">
        
        <!-- HEADER -->
        <table class="header-table">
            <tr>
                <td class="logo-container">
                    @if(isset($base64Logo) && $base64Logo)
                        <img src="{{ $base64Logo }}" alt="Logo Corporativo">
                    @else
                        <h1 class="logo-text">FAPCLAS</h1>
                        <div class="logo-text-sub">Fondo de Ayuda Policial</div>
                    @endif
                </td>
                <td class="company-details">
                    <strong>FAPCLAS R.L.</strong><br>
                    Cooperativa de Servicios Cop. SRL<br>
                    Av. Principal, Zona Central. La Paz - Bolivia<br>
                    Telf: +591 2 2110022 | NIT: 1020304050
                </td>
            </tr>
        </table>

        <!-- TÍTULO -->
        <div class="title-box">
            <h1>Constancia de Pedido Electrónico</h1>
            <p>ORDEN NO: <span style="font-family: monospace; font-size: 14px; color: #1a2312;">{{ $pedido->numero_orden }}</span></p>
        </div>

        <!-- INFO GRID -->
        <table class="info-grid">
            <tr>
                <td>
                    <div class="info-panel">
                        <div class="panel-title">Información del Cliente</div>
                        <div class="info-value">{{ strtoupper($pedido->nombre_cliente) }}</div>
                        <div class="info-sub"><strong>DOC/CI:</strong> {{ $pedido->ci_cliente ?: 'Consumidor Final' }}</div>
                        <div class="info-sub"><strong>TELF:</strong> {{ $pedido->telefono_contacto ?: 'No Registrado' }}</div>
                    </div>
                </td>
                <td>
                    <div class="info-panel right">
                        <div class="panel-title">Detalles de Operación</div>
                        <div class="info-value">Emisión: {{ $pedido->created_at->format('d/m/Y') }}</div>
                        <div class="info-sub"><strong>MÉTODO DE PAGO:</strong> {{ strtoupper(str_replace('_', ' ', $pedido->tipo_pago)) }}</div>
                        <div class="info-sub" style="color: #059669; font-weight: bold;">
                            <strong>ESTADO:</strong> {{ strtoupper(str_replace('_', ' ', $pedido->estado_entregado ?? 'PAGADO')) }}
                        </div>
                    </div>
                </td>
            </tr>
        </table>

        <!-- ITEMS -->
        <table class="items-table">
            <thead>
                <tr>
                    <th width="8%" style="text-align: center;">CANT</th>
                    <th width="47%">DESCRIPCIÓN DE BIENES O SERVICIOS</th>
                    <th width="20%" style="text-align: right;">PRECIO UNIT.</th>
                    <th width="25%" style="text-align: right;">SUBTOTAL</th>
                </tr>
            </thead>
            <tbody>
                @php $subtotalMercaderia = 0; @endphp
                @foreach($pedido->detalles as $index => $detalle)
                    @php $subtotalMercaderia += $detalle->subtotal; @endphp
                    <tr class="{{ $index % 2 == 1 ? 'stripe' : '' }}">
                        <td style="text-align: center; font-weight: bold;">{{ $detalle->cantidad }}</td>
                        <td>
                            <div class="item-name">{{ $detalle->producto->nombre }}</div>
                            <div class="item-sku">SKU: {{ $detalle->producto->codigo_sku }}</div>
                        </td>
                        <td style="text-align: right;">Bs. {{ number_format($detalle->precio_unitario, 2) }}</td>
                        <td style="text-align: right; font-weight: bold;">Bs. {{ number_format($detalle->subtotal, 2) }}</td>
                    </tr>
                @endforeach
                
                @if($pedido->costo_envio > 0)
                    <tr class="stripe">
                        <td style="text-align: center; font-weight: bold;">1</td>
                        <td>
                            <div class="item-name">Servicio de Logística de Envío</div>
                            <div class="item-sku">Destino: {{ $pedido->direccion_envio }}</div>
                        </td>
                        <td style="text-align: right;">Bs. {{ number_format($pedido->costo_envio, 2) }}</td>
                        <td style="text-align: right; font-weight: bold;">Bs. {{ number_format($pedido->costo_envio, 2) }}</td>
                    </tr>
                @endif
            </tbody>
        </table>

        <!-- SUMMARY (TERMS AND TOTALS) -->
        <div class="summary-wrapper">
            <div class="terms-box">
                <div class="terms-title">Resoluciones y Condiciones</div>
                @if(isset($settings['app_terminos_recibo']) && !empty($settings['app_terminos_recibo']))
                    {!! nl2br(e($settings['app_terminos_recibo'])) !!}
                @else
                    Este documento constituye un comprobante formal de operación. Por favor conserve este comprobante. Todo cambio o devolución está sujeto a las políticas internas vigentes reportadas en ventanilla y en los estatutos corporativos. Agradecemos su preferencia y confianza.
                @endif
            </div>
            
            <table class="totals-table">
                <tr>
                    <td class="label">Total Mercadería:</td>
                    <td class="value">Bs. {{ number_format($subtotalMercaderia, 2) }}</td>
                </tr>
                @if($pedido->costo_envio > 0)
                <tr>
                    <td class="label">Despacho / Envío:</td>
                    <td class="value">Bs. {{ number_format($pedido->costo_envio, 2) }}</td>
                </tr>
                @endif
                <tr class="total-final-row">
                    <td class="label">TOTAL PAGADO:</td>
                    <td class="value">Bs. {{ number_format($pedido->total, 2) }}</td>
                </tr>
            </table>

            <div class="clearfix"></div>
        </div>

        <!-- FOOTER & BARCODE -->
        <div class="footer">
            <div class="barcode">
                | || | |||| || || | |||| || | || | ||| ||
                <br>
                {{ str_pad(preg_replace('/[^0-9]/', '', $pedido->numero_orden) ?: $pedido->id, 12, '0', STR_PAD_LEFT) }}
            </div>
            <div class="footer-text">
                DOCUMENTO GENERADO CENTRALIZADAMENTE POR EL ERP FAPCLAS R.L. &copy; {{ date('Y') }}
            </div>
        </div>
    </div>
</body>
</html>
