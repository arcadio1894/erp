<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Cotización</title>
    <style>
        .clearfix:after {
            content: "";
            display: table;
            clear: both;
        }

        a {
            color: #5D6975;
            text-decoration: underline;
        }

        body {
            color: #001028;
            background: #FFFFFF;
            font-family: Arial, sans-serif;
            font-size: 12px;
        }

        header {
            padding: 10px 0;
            margin-bottom: 30px;
        }

        #logo {
            text-align: left;
            margin-bottom: 5px;
        }

        #logo img {
            width: 250px;
            height: 150px;
        }

        h1 {
            border-top: 1px solid  #5D6975;
            border-bottom: 1px solid  #5D6975;
            color: #ffffff;
            font-size: 2.4em;
            line-height: 1.4em;
            font-weight: normal;
            text-align: center;
            margin: 0 0 20px 0;
            background: #1c3c80;
        }

        #project {
            float: left;
        }

        #project span {
            color: #5D6975;
            text-align: left;
            width: 80px;
            margin-right: 10px;
            display: inline-block;
            font-size: 0.8em;
        }

        #company2 {
            float: right;
            width: 300px;
        }

        #company3 {
            float: right;
        }

        #project div,
        #company div {
            white-space: nowrap;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            border-spacing: 0;
            margin-bottom: 5px;
        }

        table tr:nth-child(2n-1) td {
            background: #F5F5F5;
        }

        table th,
        table td {
            text-align: center;
        }

        table th {
            padding: 5px 10px;
            color: #ffffff;
            border-bottom: 1px solid #C1CED9;
            white-space: nowrap;
            font-weight: bold;
            background-color: #1c3c80;
            font-size: 1.2em;
        }

        table .desc {
            text-align: left;
        }

        table .total {
            text-align: right;
        }

        table td {
            padding: 5px;
            text-align: center;
        }

        table td.desc {
            vertical-align: top;
        }

        table td.unit,
        table td.qty,
        table td.total {
            font-size: 1em;
        }

        #sumary td {
            text-align: right;
        }

        #notices .notice {
            color: #5D6975;
            font-size: 1.2em;
        }

        footer {
            color: #ffffff;
            width: 100%;
            height: 30px;
            position: absolute;
            bottom: 0;
            border-top: 1px solid #C1CED9;
            padding: 8px 0;
            text-align: center;
            background-color: #1c3c80;
        }
        .center {
            text-align: center;
        }
        .page-break {
            page-break-after: always;
        }

        .plano {
            width: auto;
            height: 250px;
            max-width: 720px;
        }

        .fill {
            object-fit: fill;
        }

        .contain {
            object-fit: contain;
        }

        .cover {
            object-fit: cover;
        }

        .scale-down {
            object-fit: scale-down;
        }
    </style>
</head>
<body>
<header class="clearfix">
    <div id="logo">
        <img src="{{ asset('/landing/img/logo_pdf.png') }}">
        <div id="company3" class="clearfix">
            <div>RUC 20540001384</div>
            <div>Predio el Horcón - Sector el Horcón U.C 02972- F-Moche</div>
            {{--<div>La Esperanza, Trujillo, Perú</div>--}}
            <div>Sitio Web: www.sermeind.com.pe</div>
            <div>Teléfono: +51 959 332 205</div>
            <div>Cotizado por: </div>
        </div>
    </div>

    <h1>COTIZACIÓN: {{ $proforma->code }}</h1>

    <div id="company2" class="clearfix">
        <div>CLIENTE</div>
        <div>{{ ($proforma->customer !== null) ? $proforma->customer->business_name : 'No tiene cliente' }}</div>
        <div>{{ ($proforma->contact !== null) ? $proforma->contact->name : 'No tiene contacto' }}</div>
        <div>{{ ($proforma->customer !== null) ? $proforma->customer->address : 'No tiene dirección' }}</div>
        <div>{{ ($proforma->customer !== null) ? $proforma->customer->location : 'No tiene localización' }}</div>
    </div>

    <div id="project">
        <div><span>COTIZACIÓN #</span>: {{ $proforma->id }}</div>
        <div><span>FECHA</span>: {{ date( "d/m/Y", strtotime( $proforma->date_quote )) }}</div>
        <div><span>CLIENTE ID</span>: {{ ($proforma->customer !== null) ? $proforma->customer_id : 'No tiene localización'}}</div>
        <div><span>VALIDO HASTA</span>: {{ date( "d/m/Y", strtotime( $proforma->date_validate )) }} </div>

    </div>

</header>

<div id="notices">
    <div>Nos es grato dirigirnos a ustedes para hacerles llegar la presente cotización de acuerdo a nuestra conversación.</div>
</div>
<br><br>

<main>

    <table>
        <thead>
        <tr>
            <th class="desc">DESCRIPCIÓN</th>
            <th>PRECIO UNIT. </th>
            <th>CANT.</th>
            <th>TOTAL</th>
        </tr>
        </thead>
        <tbody>
        @foreach( $proforma->equipments as $equipment )
        <tr>
            <td class="desc">{{ $equipment->description }}</td>
            <td class="unit">{{ $proforma->currency }} {{ ($proforma->currency == 'PEN') ? number_format( ((float)($equipment->total_equipment_utility) / $equipment->quantity), 0) : number_format( ((float)($equipment->total_equipment_utility/1.18) / $equipment->quantity), 0) }}</td>
            <td class="qty">{{ $equipment->quantity }}</td>
            <td class="total">{{ $proforma->currency }} {{ ($proforma->currency == 'PEN') ? number_format( (float)($equipment->total_equipment_utility), 0) : number_format( (float)($equipment->total_equipment_utility/1.18), 0) }}</td>
        </tr>
        @endforeach
        </tbody>
    </table>
    <br><br><br><br>
    <table id="sumary">
        <tbody>
        <tr>
            <td class=""></td>
            <td class=""></td>
            <td class="qty">TOTAL</td>
            <td class="total">{{ $proforma->currency }} {{ ($proforma->currency == 'PEN') ? number_format( (float)($proforma->total_proforma), 0) : number_format( (float)($proforma->total_proforma/1.18), 0) }}.00</td>
        </tr>
        </tbody>
    </table>
    <div id="notices">
        <div>TÉRMINOS Y CONDICIONES:</div>
        <div class="notice">FORMA DE PAGO: {{ ($proforma->deadline !== null) ? $proforma->deadline->description : 'No tiene forma de pago' }} </div>
        <div class="notice">TIEMPO DE ENTREGA: {{ ($proforma->time_delivery == null || $proforma->time_delivery == "") ? $proforma->time_delivery: $proforma->time_delivery . " DÍAS" }}</div>
        @if( $proforma->currency === 'USD' )
            <div class="notice">PRECIO NO INCLUYE IGV, EL PRECIO ESTA EXPRESADO EN {{ ( $proforma->currency === 'USD' ) ? 'DÓLARES AMERICANOS':'SOLES' }} </div>
        @else
            <div class="notice">PRECIO INCLUYE IGV, EL PRECIO ESTA EXPRESADO EN {{ ( $proforma->currency === 'USD' ) ? 'DÓLARES AMERICANOS':'SOLES' }} </div>
        @endif
        <br>
        <div>OBSERVACIONES:</div>
        <div class="notice">{!! nl2br($proforma->observations) !!}</div>
    </div>
    <br><br>
    <div id="notices">
        <div class="center">Los equipos cotizados cumplen con los estándares de fabricación de equipos para plantas de alimentos (diseño
            sanitarios) , adecuado uso de recursos (estándares de ahorro energético, emisiones).</div>
        <br><br>
        <div class="notice">Sin otro particular, quedamos de usted.</div>
        <div class="notice">Atentamente</div>
    </div>
</main>
<div class="page-break"></div>
<header class="clearfix">
    <div id="logo">
        <img src="{{ asset('/landing/img/logo_pdf.png') }}">
        <div id="company3" class="clearfix">
            <div>RUC 20540001384</div>
            <div>Predio el Horcón - Sector el Horcón U.C 02972- F-Moche</div>
            {{--<div>La Esperanza, Trujillo, Perú</div>--}}
            <div>Sitio Web: www.sermeind.com.pe</div>
            <div>Teléfono: +51 959 332 205</div>
            <div>Cotizado por: </div>
        </div>
    </div>

    <h1>COTIZACIÓN: {{ $proforma->code }}</h1>

    <div id="company2" class="clearfix">
        <div>CLIENTE</div>
        <div>{{ ($proforma->customer !== null) ? $proforma->customer->business_name : 'No tiene cliente' }}</div>
        <div>{{ ($proforma->contact !== null) ? $proforma->contact->name : 'No tiene contacto' }}</div>
        <div>{{ ($proforma->customer !== null) ? $proforma->customer->address : 'No tiene dirección' }}</div>
        <div>{{ ($proforma->customer !== null) ? $proforma->customer->location : 'No tiene localización' }}</div>
    </div>

    <div id="project">
        <div><span>COTIZACIÓN #</span>: {{ $proforma->id }}</div>
        <div><span>FECHA</span>: {{ date( "d/m/Y", strtotime( $proforma->date_quote )) }}</div>
        <div><span>CLIENTE ID</span>: {{ ($proforma->customer !== null) ? $proforma->customer_id : 'No tiene localización'}}</div>
        <div><span>VALIDO HASTA</span>: {{ date( "d/m/Y", strtotime( $proforma->date_validate )) }} </div>

    </div>

</header>
<div id="notices">

    @foreach( $proforma->equipments as $equipment )
        <div class="notice"><strong>{{ $equipment->description }}</strong> </div>
        <div class="notice">{!! nl2br($equipment->detail) !!}</div><br>
    @endforeach
</div>

<footer>
    Predio el Horcón - Sector el Horcón U.C 02972- F-Moche  |  +51 959 332 205
</footer>
</body>
</html>