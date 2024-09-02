<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 0;
            padding: 0;
            width: 100%;
            text-align: center;
            box-sizing: border-box;
        }

        .ticket {
            width: 240px;
            max-width: 240px;
            margin: 0 auto;
        }

        .centered {
            text-align: center;
            align-content: center;
        }

        .ticket td,
        .ticket th {
            padding: 5px 0;
            border-bottom: 1px solid #ddd;
            text-align: left;
        }

        .ticket .total {
            border-top: 1px dashed black;
            font-weight: bold;
            text-align: right;
        }

        .ticket .header {
            font-weight: bold;
            margin-bottom: 10px;
        }

        .ticket .item {
            margin-bottom: 5px;
        }

        .ticket .right {
            text-align: right;
        }

        .ticket .separator {
            border-top: 1px dashed black;
            margin: 10px 0;
        }

        .full-width {
            width: 100%;
        }

        .table-operations {
            width: 100%;
            border-collapse: collapse;
        }

        .table-operations td {
            border: none;
            padding: 2px 0;
        }

        /* Nueva clase para asegurar que la tabla de detalles esté centrada y ocupe todo el ancho */
        .details-table {
            width: 100%;
           /* margin: 0 auto;*/
            border-collapse: collapse; /* Elimina los espacios entre celdas */
        }
    </style>
</head>
<body>
<div class="ticket">
    <p class="centered header">MAYORSA S.A.<br>
        R.U.C.: 20108730294<br>
        BOLETA DE VENTA ELECTRÓNICA</p>
    <p class="centered">AV. EL POLO 670, SANTIAGO DE SURCO, LIMA</p>
    <p><span class="bold">Fecha Emisión:</span> {{ \Carbon\Carbon::parse($sale->date_sale)->format('d/m/y') }}</p>
    <p><span class="bold">Hora:</span> {{ \Carbon\Carbon::parse($sale->date_sale)->format('H:i') }}</p>
    <p><span class="bold">Serie:</span> {{ $sale->serie }}</p>
    <p><span class="bold">Cajero:</span> {{ $sale->worker->first_name." ".$sale->worker->last_name}}</p>
    <p><span class="bold">Local:</span> {{--{{ $sale->local }}--}}4</p>
    <p><span class="bold">Caja:</span> {{--{{ $sale->caja }}--}}1</p>
    <p><span class="bold">Transacción nro.:</span> {{ $sale->serie }}</p>

    <table class="details-table">
        <thead>
        <tr>
            <th>Código</th>
            <th>Descripción</th>
            <th class="right">Valor</th>
        </tr>
        </thead>
        <tbody>
        @foreach($sale->details as $detail)
            <tr class="item">
                <td>{{ $detail->material->code }}</td>
                <td>{{ $detail->material->full_name }}</td>
                <td class="right">S/. {{ number_format($detail->total, 2) }}</td>
            </tr>
            <tr>
                <td>{{ $detail->quantity }} x {{ $detail->material->unitMeasure->description }}</td>
                <td></td>
                <td class="right">c/u</td>
            </tr>
        @endforeach
        </tbody>
    </table>

    <div class="separator"></div>

    {{--<p class="right">SON: {{ strtoupper(NumeroALetras::convertir($sale->total)) }} SOLES</p>--}}

    <div class="separator"></div>

    <table class="table-operations full-width">
        <tr>
            <td>OP. EXONERADA</td>
            <td class="right">S/. {{ number_format($sale->op_exonerada, 2) }}</td>
        </tr>
        <tr>
            <td>OP. INAFECTA</td>
            <td class="right">S/. {{ number_format($sale->op_inafecta, 2) }}</td>
        </tr>
        <tr>
            <td>OP. GRAVADA</td>
            <td class="right">S/. {{ number_format($sale->op_gravada, 2) }}</td>
        </tr>
        <tr>
            <td>I.G.V.</td>
            <td class="right">S/. {{ number_format($sale->igv, 2) }}</td>
        </tr>
        <tr>
            <td>TOTAL DESCUENTOS</td>
            <td class="right">S/. {{ number_format($sale->total_descuentos, 2) }}</td>
        </tr>
        <tr>
            <td class="total">TOTAL A PAGAR</td>
            <td class="total right">S/. {{ number_format($sale->importe_total, 2) }}</td>
        </tr>
    </table>

    <div class="separator"></div>

    <p><span class="bold">Detalle de Pago:</span> {{ strtoupper($sale->tipoPago->descripcion) }}</p>

    <div class="separator"></div>

    <p class="bold right">Pago con: S/. {{ number_format($sale->importe_total+$sale->vuelto, 2) }}</p>
    <p class="bold right">Vuelto: S/. {{ number_format($sale->vuelto, 2) }}</p>

    <div class="separator"></div>

    <p class="centered">Atendido por: {{ $sale->worker->first_name." ".$sale->worker->last_name }}</p>
</div>
</body>
</html>
