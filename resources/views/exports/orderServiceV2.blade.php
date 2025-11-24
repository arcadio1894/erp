<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Orden de Servicio {{ $service_order->code }}</title>

    <style>
        @page { margin: 20mm 15mm; }

        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11px;
            color: #000;
        }

        table { border-collapse: collapse; width: 100%; }
        th, td { border: 0.5px solid #999; padding: 4px 3px; font-size: 10px; }
        thead th { background: #e5e5e5; font-size: 10px; }

        .no-border td, .no-border th { border: none !important; }

        .title-empresa { font-weight: bold; font-size: 12px; }
        .empresa-linea { font-size: 10px; }

        .doc-box {
            border: 2px solid #333;
            padding: 8px 10px;
            text-align: center;
        }
        .doc-ruc { font-size: 14px; font-weight: bold; }
        .doc-tipo { font-size: 13px; font-weight: bold; margin: 4px 0; }
        .doc-serie-num { font-size: 14px; font-weight: bold; }

        .box-title { font-weight:bold; font-size:11px; margin-bottom:4px; }
        .label { font-weight:bold; display:inline-block; min-width:115px; }
        .texto { display:inline-block; margin-left:3px; }

        .footer {
            margin-top: 20px;
            font-size: 8px;
            border-top: 0.5px solid #999;
            padding-top: 4px;
            text-align: center;
        }
    </style>
</head>

<body>

{{-- ============================= --}}
{{-- ENCABEZADO GENERAL            --}}
{{-- ============================= --}}

<table class="no-border">
    <tr class="no-border">

        {{-- Datos empresa --}}
        <td class="no-border" style="width:60%; padding-right:10px; vertical-align:top;">
            <img src="{{ asset('/landing/img/logo_pdf.png') }}" style="max-height:60px; margin-bottom:5px;">

            <div class="title-empresa">SERVICIOS METAL MECÁNICOS INDUSTRIALES S.A.C.</div>
            <div class="empresa-linea">Predio el Horcón - Sector el Horcón U.C 02972 - F-Moche</div>
            <div class="empresa-linea">La Libertad - Perú</div>
            <div class="empresa-linea">Teléfono: +51 959 332 205</div>
            <div class="empresa-linea">Email: servicios@sermeind.com.pe</div>
            <div class="empresa-linea">Web: www.sermeind.com.pe</div>
        </td>

        {{-- Caja del documento --}}
        <td class="no-border" style="width:40%; vertical-align:top;">
            <div class="doc-box">
                <div class="doc-ruc">RUC 20540001384</div>
                <div class="doc-tipo">ORDEN DE SERVICIO</div>
                <div class="doc-serie-num">{{ $service_order->code }}</div>
            </div>
        </td>

    </tr>
</table>

<br>

{{-- ============================= --}}
{{-- DATOS DE LA ORDEN / EMISOR    --}}
{{-- ============================= --}}

<table>
    <tr>

        {{-- Datos de la Orden --}}
        <td style="width:50%; padding:6px; vertical-align:top;">
            <div class="box-title">DATOS DE LA ORDEN</div>

            <div><span class="label">CÓDIGO:</span>
                <span class="texto">{{ $service_order->code }}</span>
            </div>
            <div><span class="label">FECHA:</span>
                <span class="texto">{{ date('d/m/Y', strtotime($service_order->date_order)) }}</span>
            </div>
            <div><span class="label">APROBADO POR:</span>
                <span class="texto">
                    {{ $service_order->approved_user->name ?? 'No tiene aprobador' }}
                </span>
            </div>
            <div><span class="label">CONDICIÓN DE PAGO:</span>
                <span class="texto">{{ $service_order->deadline->description ?? 'No tiene condición' }}</span>
            </div>
            <div><span class="label">MONEDA:</span>
                <span class="texto">{{ $service_order->currency_order === 'USD' ? 'DÓLARES' : 'SOLES' }}</span>
            </div>
        </td>

        {{-- Datos del Emisor --}}
        <td style="width:50%; padding:6px; vertical-align:top;">
            <div class="box-title">DATOS DEL EMISOR</div>

            <div><span class="label">RAZÓN SOCIAL:</span>
                <span class="texto">SERMEIND FABRICACIONES INDUSTRIALES S.A.C</span>
            </div>
            <div><span class="label">RUC:</span>
                <span class="texto">20540001384</span>
            </div>
            <div><span class="label">DOMICILIO:</span>
                <span class="texto">Predio el Horcón - Sector el Horcón U.C 02972- F-Moche - TRUJILLO</span>
            </div>
            <div><span class="label">TELÉFONO:</span>
                <span class="texto">(+51) 959 332 205</span>
            </div>
            <div><span class="label">CORREO:</span>
                <span class="texto">KPAREDES@SERMEIND.COM</span>
            </div>
        </td>

    </tr>
</table>

<br>

{{-- ============================= --}}
{{-- DATOS DEL PROVEEDOR          --}}
{{-- ============================= --}}

<table>
    <tr>
        <td style="padding:6px;">
            <div class="box-title">EMITIDO A (PROVEEDOR)</div>

            @php
                $supplier = $service_order->supplier;
            @endphp

            <div><span class="label">RAZÓN SOCIAL:</span>
                <span class="texto">{{ $supplier->business_name ?? 'No tiene proveedor' }}</span>
            </div>
            <div><span class="label">RUC:</span>
                <span class="texto">{{ $supplier->RUC ?? 'No tiene RUC' }}</span>
            </div>
            <div><span class="label">DOMICILIO:</span>
                <span class="texto">{{ $supplier->address ?? 'No tiene localización' }}</span>
            </div>

            <div><span class="label">CUENTAS BANC.:</span>
                <span class="texto">
                    @if(count($accounts) > 0)
                        @foreach($accounts as $index => $account)
                            {{ $account->bank->short_name }}
                            - {{ $account->currency == 'PEN' ? 'Soles' : 'Dólares' }}
                            - {{ $account->number_account }}
                            @if($index < count($accounts) - 1)
                                <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            @endif
                        @endforeach
                    @else
                        —
                    @endif
                </span>
            </div>

            <div><span class="label">TELÉFONO:</span>
                <span class="texto">{{ $supplier->phone ?? 'No tiene teléfono' }}</span>
            </div>
            <div><span class="label">CORREO:</span>
                <span class="texto">{{ $supplier->email ?? 'No tiene email' }}</span>
            </div>
            <div><span class="label">COTIZACIÓN:</span>
                <span class="texto">{{ $service_order->quote_supplier ?? 'No tiene cotización' }}</span>
            </div>
            <div><span class="label">OBSERVACIÓN:</span>
                <span class="texto">{{ $service_order->observation ?? 'No tiene observación' }}</span>
            </div>
        </td>
    </tr>
</table>

<br>

{{-- ============================= --}}
{{-- DETALLE DE SERVICIOS         --}}
{{-- ============================= --}}

<table>
    <thead>
    <tr>
        <th style="width:40%; text-align:left;">DESCRIPCIÓN</th>
        <th style="width:10%;">UND</th>
        <th style="width:10%;">CANT.</th>
        <th style="width:13%;">PRECIO S/IGV</th>
        <th style="width:13%;">SUBTOTAL S/IGV</th>
        <th style="width:7%;">IGV</th>
        <th style="width:13%;">SUBTOTAL C/IGV</th>
    </tr>
    </thead>

    <tbody>
    @foreach($service_order->details as $detail)
        @php
            $precioSinIgv = $detail->price / 1.18;
            $subtotalSinIgv = $precioSinIgv * $detail->quantity;
            $igvLinea = $subtotalSinIgv * 0.18;
            $totalLinea = $detail->price * $detail->quantity;
        @endphp

        <tr>
            <td style="text-align:left;">{{ $detail->service }}</td>
            <td style="text-align:center;">{{ $detail->unit }}</td>
            <td style="text-align:center;">{{ $detail->quantity }}</td>

            <td style="text-align:right;">{{ number_format($precioSinIgv, 2) }}</td>
            <td style="text-align:right;">{{ number_format($subtotalSinIgv, 2) }}</td>
            <td style="text-align:right;">{{ number_format($igvLinea, 2) }}</td>
            <td style="text-align:right;">{{ number_format($totalLinea, 2) }}</td>
        </tr>
    @endforeach
    </tbody>
</table>

<br>

{{-- ============================= --}}
{{-- TOTALES                      --}}
{{-- ============================= --}}

<table style="width:40%; float:right;">
    <tr>
        <td class="label" style="text-align:right;">SUBTOTAL</td>
        <td style="text-align:right;">
            {{ $service_order->currency_order }}
            {{ number_format($service_order->total - $service_order->igv, 2) }}
        </td>
    </tr>
    <tr>
        <td class="label" style="text-align:right;">IGV</td>
        <td style="text-align:right;">
            {{ $service_order->currency_order }}
            {{ number_format($service_order->igv, 2) }}
        </td>
    </tr>
    <tr>
        <td class="label" style="text-align:right;"><strong>TOTAL</strong></td>
        <td style="text-align:right;">
            <strong>
                {{ $service_order->currency_order }}
                {{ number_format($service_order->total, 2) }}
            </strong>
        </td>
    </tr>
</table>

<br><br><br>

{{-- ============================= --}}
{{-- FOOTER                       --}}
{{-- ============================= --}}

<div class="footer">
    Predio el Horcón - Sector el Horcón U.C 02972- F-Moche  |  +51 959 332 205
</div>

</body>
</html>