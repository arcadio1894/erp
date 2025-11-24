<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Guía de Remisión {{ $arrayGuide[0]['code'] }}</title>

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

        .no-border td { border: none !important; }
        .no-border th { border: none !important; }

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
        .label { font-weight:bold; display:inline-block; min-width:110px; }
        .texto { display:inline-flex; margin-left:3px;  font-size:9px}
        .mt-3 {margin-top: 3px}
        .footer {
            margin-top: 20px;
            font-size: 8px;
            border-top: 0.5px solid #999;
            padding-top: 4px;
            text-align: center;
        }

        .page-break { page-break-after: always; }
    </style>
</head>

<body>

{{-- ============================= --}}
{{-- ENCABEZADO TIPO NUBEFACT      --}}
{{-- ============================= --}}

<table class="no-border">
    <tr class="no-border">
        <td class="no-border" style="width:60%; vertical-align:top; padding-right:10px;">
            <img src="{{ asset('/landing/img/logo_pdf.png') }}" style="max-height:60px; margin-bottom:5px;">

            <div class="title-empresa">SERVICIOS METAL MECÁNICOS INDUSTRIALES S.A.C.</div>
            <div class="empresa-linea">Predio el Horcón - Sector el Horcón U.C 02972 - F-Moche</div>
            <div class="empresa-linea">La Libertad - Perú</div>
            <div class="empresa-linea">Teléfono: +51 959 332 205</div>
            <div class="empresa-linea">Email: servicios@sermeind.com.pe</div>
            <div class="empresa-linea">Web: www.sermeind.com.pe</div>
        </td>

        <td class="no-border" style="width:40%; vertical-align:top;">
            <div class="doc-box">
                <div class="doc-ruc">RUC 20540001384</div>
                <div class="doc-tipo">GUÍA DE REMISIÓN</div>
                <div class="doc-serie-num">{{ $arrayGuide[0]['code'] }}</div>
            </div>
        </td>
    </tr>
</table>

<br>

{{-- ============================= --}}
{{-- DATOS DEL EMISOR / GUÍA       --}}
{{-- ============================= --}}

<table>
    <tr>
        {{-- EMISOR --}}
        <td style="width:50%; vertical-align:top; padding:6px;">
            <div class="box-title">DATOS DEL EMISOR</div>

            <div class="mt-3"><span class="label">RAZÓN SOCIAL:</span>
                <span class="texto">SERMEIND FABRICACIONES INDUSTRIALES S.A.C</span>
            </div>
            <div class="mt-3"><span class="label">RUC:</span>
                <span class="texto">20540001384</span>
            </div>
            <div class="mt-3"><span class="label">DOMICILIO FISCAL:</span>
                <span class="texto">Predio el Horcón - Sector el Horcón U.C 02972 - F-Moche - TRUJILLO</span>
            </div>
            <div class="mt-3"><span class="label">TELÉFONO:</span>
                <span class="texto">(+)51 959 332 205</span>
            </div>
        </td>

        {{-- GUÍA --}}
        <td style="width:50%; vertical-align:top; padding:6px;">
            <div class="box-title">DATOS DE LA GUÍA</div>

            <div class="mt-3"><span class="label">CÓDIGO:</span>
                <span class="texto">{{ $arrayGuide[0]['code'] }}</span>
            </div>
            <div class="mt-3"><span class="label">FECHA:</span>
                <span class="texto">{{ $arrayGuide[0]['date_transfer'] }}</span>
            </div>
            <div class="mt-3"><span class="label">RESPONSABLE:</span>
                <span class="texto">{{ $arrayGuide[0]['responsible'] }}</span>
            </div>
            <div class="mt-3"><span class="label">MOTIVO DE TRASLADO:</span>
                <span class="texto">{{ $arrayGuide[0]['reason'] }}</span>
            </div>
            <div class="mt-3"><span class="label">DESTINATARIO:</span>
                <span class="texto">{{ $arrayGuide[0]['destinatario'] }}</span>
            </div>
            <div class="mt-3"><span class="label">PUNTO DE LLEGADA:</span>
                <span class="texto">{{ $arrayGuide[0]['punto_llegada'] }}</span>
            </div>
            <div class="mt-3"><span class="label">DOCUMENTO RELACIONADO:</span>
                <span class="texto">{{ $arrayGuide[0]['documento'] }}</span>
            </div>
        </td>
    </tr>
</table>

<br>

{{-- ============================= --}}
{{-- DETALLE DE BIENES TRANSPORTADOS --}}
{{-- ============================= --}}

<table>
    <thead>
    <tr>
        <th style="width:15%;">CÓDIGO</th>
        <th style="width:55%; text-align:left;">DESCRIPCIÓN</th>
        <th style="width:15%;">UNIDAD</th>
        <th style="width:15%;">CANTIDAD</th>
    </tr>
    </thead>

    <tbody>
    @foreach($arrayGuide[0]['details'] as $detail)
        <tr>
            <td style="text-align:center;">{{ $detail['code'] }}</td>
            <td style="text-align:left;">{{ $detail['description'] }}</td>
            <td style="text-align:center;">{{ $detail['unit'] }}</td>
            <td style="text-align:center;">{{ $detail['quantity'] }}</td>
        </tr>
    @endforeach
    </tbody>
</table>

<br>

{{-- ============================= --}}
{{-- DATOS DEL VEHÍCULO / CONDUCTOR --}}
{{-- ============================= --}}

<table>
    <tr>
        <td style="width:100%; padding:6px;">
            <div class="box-title">DATOS DEL VEHÍCULO Y CONDUCTOR</div>

            <div><span class="label">PLACA DEL VEHÍCULO:</span>
                <span class="texto">{{ $arrayGuide[0]['vehiculo'] }}</span>
            </div>

            <div><span class="label">CONDUCTOR:</span>
                <span class="texto">{{ $arrayGuide[0]['driver'] }}</span>
            </div>

            <div><span class="label">LICENCIA DE CONDUCIR:</span>
                <span class="texto">{{ $arrayGuide[0]['driver_licence'] }}</span>
            </div>
        </td>
    </tr>
</table>

{{-- ============================= --}}
{{-- FOOTER                        --}}
{{-- ============================= --}}

<div class="footer">
    Predio el Horcón - Sector el Horcón U.C 02972 - F-Moche  |  +51 959 332 205
</div>

</body>
</html>