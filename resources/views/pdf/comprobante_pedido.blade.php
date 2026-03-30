<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Comprobante de Pedido - {{ $pedido->numero_orden }}</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }
        .container {
            padding: 40px;
        }
        .header {
            border-bottom: 2px solid #1a2312;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header table {
            width: 100%;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #1a2312;
            letter-spacing: -1px;
        }
        .logo span {
            color: #999;
            font-size: 16px;
            font-weight: normal;
        }
        .institutional-info {
            text-align: right;
            font-size: 11px;
            color: #666;
        }
        .title-section {
            text-align: center;
            margin-bottom: 30px;
        }
        .title-section h1 {
            margin: 0;
            font-size: 20px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .info-grid {
            width: 100%;
            margin-bottom: 30px;
        }
        .info-box {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 10px;
        }
        .info-label {
            font-size: 10px;
            text-transform: uppercase;
            color: #999;
            font-weight: bold;
            display: block;
            margin-bottom: 2px;
        }
        .info-value {
            font-size: 13px;
            font-weight: bold;
            color: #1a2312;
        }
        table.items {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        table.items th {
            background: #1a2312;
            color: #ffffff;
            text-align: left;
            padding: 12px;
            font-size: 11px;
            text-transform: uppercase;
        }
        table.items td {
            padding: 12px;
            border-bottom: 1px solid #eee;
            font-size: 12px;
        }
        .total-section {
            float: right;
            width: 250px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
        }
        .total-final {
            background: #1a2312;
            color: #fff;
            padding: 10px;
            border-radius: 5px;
            margin-top: 10px;
            font-size: 16px;
            font-weight: bold;
            text-align: right;
        }
        .footer {
            position: fixed;
            bottom: 30px;
            left: 40px;
            right: 40px;
            text-align: center;
            font-size: 10px;
            color: #999;
            border-top: 1px solid #eee;
            padding-top: 10px;
        }
        .qr-code {
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <table>
                <tr>
                    <td>
                        <div class="logo">FAPCLAS <span>R.L.</span></div>
                    </td>
                    <td class="institutional-info">
                        <strong>FAPCLAS R.L. - Cooperativa de Servicios</strong><br>
                        Av. Principal No. 123, Zona Central<br>
                        La Paz - Bolivia<br>
                        NIT: 1020304050
                    </td>
                </tr>
            </table>
        </div>

        <div class="title-section">
            <h1>Comprobante de Pedido</h1>
            <p style="font-size: 12px; color: #666;">Orden No: <strong>{{ $pedido->numero_orden }}</strong></p>
        </div>

        <table class="info-grid">
            <tr>
                <td width="50%" style="padding-right: 10px;">
                    <div class="info-box">
                        <span class="info-label">Datos del Cliente</span>
                        <div class="info-value">{{ $pedido->nombre_cliente }}</div>
                        <div style="font-size: 11px; color: #666;">C.I.: {{ $pedido->ci_cliente ?: 'N/A' }}</div>
                        <div style="font-size: 11px; color: #666;">Telf: {{ $pedido->telefono_contacto ?: 'N/A' }}</div>
                    </div>
                </td>
                <td width="50%" style="padding-left: 10px;">
                    <div class="info-box">
                        <span class="info-label">Detalles de Emisión</span>
                        <div class="info-value">Fecha: {{ $pedido->created_at->format('d/m/Y') }}</div>
                        <div style="font-size: 11px; color: #666;">Hora: {{ $pedido->created_at->format('H:i:s') }}</div>
                        <div style="font-size: 11px; color: #666;">Estado: {{ strtoupper(str_replace('_', ' ', $pedido->estado_pago)) }}</div>
                    </div>
                </td>
            </tr>
        </table>

        <table class="items">
            <thead>
                <tr>
                    <th>Descripción del Producto</th>
                    <th width="15%" style="text-align: center;">Cant.</th>
                    <th width="20%" style="text-align: right;">Precio Unit.</th>
                    <th width="20%" style="text-align: right;">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($pedido->detalles as $detalle)
                <tr>
                    <td>
                        <strong>{{ $detalle->producto->nombre }}</strong><br>
                        <span style="font-size: 10px; color: #999;">SKU: {{ $detalle->producto->codigo_sku }}</span>
                    </td>
                    <td style="text-align: center;">{{ $detalle->cantidad }}</td>
                    <td style="text-align: right;">{{ number_format($detalle->precio_unitario, 2) }} Bs.</td>
                    <td style="text-align: right;">{{ number_format($detalle->subtotal, 2) }} Bs.</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="total-section">
            <div style="text-align: right; font-size: 12px;">
                <span style="color: #999;">Monto Total:</span>
                <div class="total-final">
                    Bs. {{ number_format($pedido->total, 2) }}
                </div>
            </div>
        </div>

        <div style="clear: both;"></div>

        <div style="margin-top: 50px; border: 1px dashed #ddd; padding: 15px; border-radius: 10px; font-size: 11px; color: #666; text-align: center;">
            <p><strong>Nota:</strong> Este es un comprobante digital de su pedido. Los valores son referenciales y sujetos a validación física al momento del recojo. Para cualquier consulta, por favor cite su número de orden.</p>
        </div>

        <div class="footer">
            Generado digitalmente por el Sistema ERP FAPCLAS R.L. &copy; {{ date('Y') }} - La Paz, Bolivia
        </div>
    </div>
</body>
</html>
