@extends('layouts.appAdmin2')

@section('openPaySlips')
    menu-open
@endsection

@section('activePaySlips')
    active
@endsection

@section('activeCreatePaySlip')
    active
@endsection

@section('title')
    Boletas de pago
@endsection

@section('styles-plugins')
    <link rel="stylesheet" href="{{ asset('admin/plugins/select2/css/select2.min.css') }}">
    <link rel="stylesheet" href="{{ asset('admin/plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css') }}">
    <link rel="stylesheet" href="{{ asset('admin/plugins/bootstrap-datepicker/css/bootstrap-datepicker.css') }}">
    <link rel="stylesheet" href="{{ asset('admin/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css') }}">
    <link rel="stylesheet" href="{{ asset('admin/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.css') }}">
    <link rel="stylesheet" href="{{ asset('admin/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.standalone.css') }}">
    <!-- VDialog -->
    <link rel="stylesheet" href="{{ asset('admin/plugins/vdialog/css/vdialog.css') }}">

@endsection

@section('styles')
    <style>
        .select2-search__field{
            width: 100% !important;
        }

        nav > .nav.nav-tabs{
            border: none;
            color:#fff;
            background:#001028;
            border-radius:0;
        }
        nav > div a.nav-item.nav-link
        {
            border: none;
            color:#fff;
            background:#001028;
            border-radius:0;
        }

        nav > div a.nav-item.nav-link.active:after
        {
            content: "";
            position: relative;
            bottom: -60px;
            left: -10%;
            border: 15px solid transparent;
            border-top-color: #fcbc23;
        }
        .tab-content{
            background: #fdfdfd;
            line-height: 25px;
            border: 1px solid #ddd;
            border-top:5px solid #fcbc23;
            border-bottom:5px solid #fcbc23;
            padding:30px 25px;
        }

        nav > div a.nav-item.nav-link:hover,
        nav > div a.nav-item.nav-link:focus,
        nav > div a.nav-item.nav-link.active
        {
            border: none;
            background: #fcbc23;
            color:#000000;
            border-radius:0;
            transition:background 0.20s linear;
        }
        .table {
            border-radius: 0.2rem;
            width: 100%;
            padding-bottom: 1rem;
            color: #212529;
            margin-bottom: 0;
        }
        .table td {
            white-space: nowrap;
        }
        .table-wrapper {
            max-height: 500px;
            overflow: auto;
            width: 100%;
        }
        table,
        thead,
        tr,
        tbody,
        th,
        td {
            text-align: center;
        }

        .table td {
            text-align: center;
        }
        .datepicker {
            z-index: 10000 !important;
        }
        .tg  {
            border-collapse: separate;
            border-spacing:0;
        }
        .tg td{
            border-color:black;
            border-style:solid;
            border-width:0.5px;
            font-family:Arial, sans-serif;
            font-size:12px;
            padding:5px 5px;
            word-break:normal;
        }
        .tg th{
            border-color:black;
            border-style:solid;
            border-width:1px;
            font-family:Arial, sans-serif;
            font-size:12px;
            font-weight:normal;
            padding:5px 5px;
            word-break:normal;
            border-collapse: separate;
        }
        .tg .tg-0pky{
            text-align:left;
            vertical-align:top;
            border-collapse: separate;
        }

        .tg1  {
            border-collapse:collapse;
            border-spacing:0;
        }
        .tg1 td{
            border-color:black;
            border-style:solid;
            border-width:1px;
            font-family:Arial,sans-serif;
            font-size:13px;
            overflow:hidden;
            padding:3px 3px;
            word-break:normal;
        }
        .tg1 th{
            border-color:black;
            border-style:solid;
            border-width:1px;
            font-family:Arial, sans-serif;
            font-size:13px;
            font-weight:normal;
            overflow:hidden;
            padding:3px 3px;
            word-break:normal;
        }
        .tg1 .tg-tur51{
            background-color:#c3d9fa;
        }

        .tg1 .tg-tur5{
            background-color:#c3d9fa;
            border-color:inherit;
            text-align:left;
            vertical-align:top
        }
        .tg1 .tg-c3ow{
            border-color:inherit;
            text-align:center;
            vertical-align:top
        }
        .tg1 .tg-0lax{
            text-align:left;
            vertical-align:top
        }
        .tg1 .tg-3e71{
            background-color:#c3d9fa;
            border-color:inherit;
            text-align:center;
            vertical-align:top
        }
        .tg1 .tg-0pky{
            border-color:inherit;
            text-align:left;
            vertical-align:top
        }
        .tg1 .tg-dvpl{
            border-color:inherit;
            text-align:right;
            vertical-align:top
        }
        .center {
            margin-left: auto;
            margin-right: auto;
        }
    </style>
@endsection

@section('page-header')
    <h1 class="page-title">Generar Boletas de Pago</h1>
@endsection

@section('page-title')
    <h5 class="card-title">Boletas de pago</h5>
    <a href="{{ route('paySlip.index') }}" class="btn btn-outline-primary btn-sm float-right" > <i class="fa fa-arrow-left font-20"></i> Listado de boletas</a>&nbsp;

@endsection

@section('page-breadcrumb')
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item">
            <a href="{{ route('dashboard.principal') }}"><i class="fa fa-home"></i> Dashboard</a>
        </li>
        <li class="breadcrumb-item">
            <a href="{{ route('paySlip.index') }}"><i class="fa fa-archive"></i> Boletas de pago</a>
        </li>
        <li class="breadcrumb-item"><i class="fa fa-plus-circle"></i> Generar boleta</li>
    </ol>
@endsection

@section('content')
    <input type="hidden" id="permissions" value="{{ json_encode($permissions) }}">

    <div class="row">
        <div class="col-md-3">
            <div class="form-group">
                <label for="worker">Trabajador <span class="right badge badge-danger">(*)</span></label>
                <select id="worker" name="worker" class="form-control select2" style="width: 100%;">
                    <option></option>
                    @foreach( $workers as $worker )
                        <option value="{{ $worker->id }}">{{ $worker->first_name .' '.$worker->last_name }}</option>
                    @endforeach
                </select>
            </div>
        </div>

        <div class="col-md-2">
            <label for="type">Tipo de boleta <span class="right badge badge-danger">(*)</span></label>

            <select id="type" name="type" class="form-control select2" style="width: 100%;">
                <option></option>
                @foreach( $types as $type )
                    <option value="{{ $type['id'] }}" {{ ($type['id'] == 1) ? 'selected':'' }}>{{ $type['name'] }}</option>
                @endforeach
            </select>
        </div>

        <div class="col-md-2" id="cboYears">
            <label for="year">Año <span class="right badge badge-danger">(*)</span></label>

            <select id="year" name="year" class="form-control select2" style="width: 100%;">
                <option></option>
                @foreach( $years as $year )
                    <option value="{{ $year->year }}">{{ $year->year}}</option>
                @endforeach
            </select>
        </div>

        <div class="col-md-2" id="cboMonths">
            <label for="month">Mes <span class="right badge badge-danger">(*)</span></label>

            <select id="month" name="month" class="form-control select2" style="width: 100%;">
                <option></option>

            </select>
        </div>

        <div class="col-md-2" id="cboWeeks">
            <label for="week">Semana <span class="right badge badge-danger">(*)</span></label>

            <select id="week" name="week" class="form-control select2" style="width: 100%;">
                <option></option>

            </select>
        </div>

        <div class="col-md-1">
            <label for="btn-outputs">&nbsp;</label><br>
            <button type="button" id="btn-generate" class="btn  btn-outline-success btn-block"> <i class="fas fa-arrow-circle-right"></i></button>
        </div>

    </div>
    <br>
    <div id="boleta-semanal" style="display: none">

        <div class="card card-outline card-primary">
            <div class="card-header">
                <h3 class="card-title">Boleta Semanal</h3>

                <div class="card-tools">
                    <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i>
                    </button>
                    <a id="btn-save-week" class="btn btn-outline-primary btn-sm float-left" > <i class="fas fa-file-pdf fa-spin font-20 mr-2"></i>  Guardar boleta</a>&nbsp;

                </div>
                <!-- /.card-tools -->
            </div>
            <!-- /.card-header -->
            <div class="card-body">
                <div class="row justify-content-center">
                    <div class="table-responsive align-center">
                        <table class="tg center" style="table-layout: fixed; width: 764px">
                            <colgroup>
                                <col style="width: 121px">
                                <col style="width: 95px">
                                <col style="width: 101px">
                                <col style="width: 22px">
                                <col style="width: 101px">
                                <col style="width: 101px">
                                <col style="width: 21px">
                                <col style="width: 101px">
                                <col style="width: 101px">
                            </colgroup>
                            <tbody>
                            <tr>
                                <td class="tg-0pky" colspan="6"></td>
                                <td class="tg-0pky" colspan="3" rowspan="4"><br><img src="{{ asset('admin/dist/img/Logo.svg') }}" alt=""></td>
                            </tr>
                            <tr>
                                <td class="tg-0pky" colspan="6" id="empresa">Empresa: </td>
                            </tr>
                            <tr>
                                <td class="tg-0pky" colspan="6" id="ruc">RUC: </td>
                            </tr>
                            <tr>
                                <td class="tg-0pky" colspan="6"></td>
                            </tr>
                            <tr>
                                <td class="tg-0pky" colspan="3" id="codigo">Código: </td>
                                <td class="tg-0pky" colspan="6" id="semana">Semana: </td>
                            </tr>
                            <tr>
                                <td class="tg-0pky" colspan="3" id="nombre">Nombre: </td>
                                <td class="tg-0pky" colspan="6" id="fecha">Fecha: </td>
                            </tr>
                            <tr>
                                <td class="tg-0pky" colspan="3" id="cargo">Cargo: </td>
                                <td class="tg-0pky" colspan="6"></td>
                            </tr>
                            <tr>
                                <td class="tg-0pky" colspan="3"></td>
                                <td class="tg-0pky" colspan="6" style="border-bottom-color: #ffffff"></td>
                            </tr>
                            <tr>
                                <td class="tg-0pky" colspan="3">INGRESOS</td>
                                <td class="tg-0pky" rowspan="7" style="border-color: #ffffff"></td>
                                <td class="tg-0pky">DESCUENTOS</td>
                                <td class="tg-0pky"></td>
                                <td class="tg-0pky" rowspan="2" style="border-color: #ffffff"></td>
                                <td class="tg-0pky">APORTE</td>
                                <td class="tg-0pky"></td>
                            </tr>
                            <tr>
                                <td class="tg-0pky">PAGO x DIA</td>
                                <td class="tg-0pky" id="pagoxdia">0.00</td>
                                <td class="tg-0pky"></td>
                                <td class="tg-0pky" id="sistemaPension">0.00</td>
                                <td class="tg-0pky" id="montoSistemaPension">0.00</td>
                                <td class="tg-0pky">ESSALUD</td>
                                <td class="tg-0pky" id="essalud">0.00</td>
                            </tr>
                            <tr>
                                <td class="tg-0pky">PAGO x HORA</td>
                                <td class="tg-0pky" id="pagoXHora">0.00</td>
                                <td class="tg-0pky"></td>
                                <td class="tg-0pky">RENTA 5° CAT</td>
                                <td class="tg-0pky" id="rentaQuintaCat">0.00</td>
                                <td class="tg-0pky" colspan="3" rowspan="5" style="border-bottom-color: #ffffff;border-top-color: #ffffff;border-left-color: #ffffff"></td>
                            </tr>
                            <tr>
                                <td class="tg-0pky">DIAS TRAB.</td>
                                <td class="tg-0pky" id="diasTrabajados">0.00</td>
                                <td class="tg-0pky"></td>
                                <td class="tg-0pky">PENSION</td>
                                <td class="tg-0pky" id="pensionDeAlimentos">0.00</td>
                            </tr>
                            <tr>
                                <td class="tg-0pky">ASIG. FAMILIAR</td>
                                <td class="tg-0pky" id="asignacionFamiliarDiaria">0.00</td>
                                <td class="tg-0pky" id="asignacionFamiliarSemanal">0.00</td>
                                <td class="tg-0pky">PRÉSTAMOS</td>
                                <td class="tg-0pky" id="prestamo">0.00</td>
                            </tr>
                            <tr>
                                <td class="tg-0pky">H. ORDINAR</td>
                                <td class="tg-0pky" id="horasOrdinarias">0.00</td>
                                <td class="tg-0pky" id="montoHorasOrdinarias">0.00</td>
                                <td class="tg-0pky">OTROS</td>
                                <td class="tg-0pky" id="otros">0.00</td>
                            </tr>
                            <tr>
                                <td class="tg-0pky">H. AL 25%</td>
                                <td class="tg-0pky" id="horasAl25">0.00</td>
                                <td class="tg-0pky" id="montoHorasAl25">0.00</td>
                                <td class="tg-0pky">TOTAL DESC</td>
                                <td class="tg-0pky" id="totalDescuentos">0.00</td>
                            </tr>
                            <tr>
                                <td class="tg-0pky">H. AL 35%</td>
                                <td class="tg-0pky" id="horasAl35">0.00</td>
                                <td class="tg-0pky" id="montoHorasAl35">0.00</td>
                                <td class="tg-0pky" colspan="6" rowspan="3" style="border-top-color: #ffffff;border-left-color: #ffffff;border-bottom-color: #ffffff"></td>
                            </tr>
                            <tr>
                                <td class="tg-0pky">H. AL 100%</td>
                                <td class="tg-0pky" id="horasAl100">0.00</td>
                                <td class="tg-0pky" id="montoHorasAl100">0.00</td>
                            </tr>
                            <tr>
                                <td class="tg-0pky">DOMINICAL</td>
                                <td class="tg-0pky" id="dominical">0.00</td>
                                <td class="tg-0pky" id="montoDominical">0.00</td>
                            </tr>
                            <tr>
                                <td class="tg-0pky">BONO ESPECIAL</td>
                                <td class="tg-0pky"></td>
                                <td class="tg-0pky" id="montoBono">0.00</td>
                                <td class="tg-0pky" rowspan="8" style="border-color: #ffffff"></td>
                                <td class="tg-0pky" colspan="4" style="border: 1px solid black;">RESUMEN</td>
                                <td class="tg-0pky" rowspan="8" style="border-top-color: #ffffff;border-bottom-color: #ffffff;border-left-color: #ffffff"></td>
                            </tr>
                            <tr>
                                <td class="tg-0pky">VACACIONES</td>
                                <td class="tg-0pky" id="vacaciones">0.00</td>
                                <td class="tg-0pky" id="montoVacaciones">0.00</td>
                                <td class="tg-0pky" colspan="2">TOTAL INGRESOS</td>
                                <td class="tg-0pky" colspan="2" id="totalIngresos1">0.00</td>
                            </tr>
                            <tr>
                                <td class="tg-0pky">REINTEGRO</td>
                                <td class="tg-0pky"></td>
                                <td class="tg-0pky" id="reintegro">0.00</td>
                                <td class="tg-0pky" colspan="2">TOTAL DESCUENTOS</td>
                                <td class="tg-0pky" colspan="2" id="totalDescuentos1">0.00</td>
                            </tr>
                            <tr>
                                <td class="tg-0pky">GRATIFICACIÓN</td>
                                <td class="tg-0pky"></td>
                                <td class="tg-0pky" id="gratificaciones">0.00</td>
                                <td class="tg-0pky" colspan="4" rowspan="4"></td>
                            </tr>
                            <tr>
                                <td class="tg-0pky" colspan="3"></td>
                            </tr>
                            <tr>
                                <td class="tg-0pky" colspan="3" id="totalIngresos">TOTAL INGRESOS: 0.00</td>
                            </tr>
                            <tr>
                                <td class="tg-0pky" colspan="3" rowspan="2"></td>
                            </tr>
                            <tr>
                                <td class="tg-0pky" colspan="2">NETO A  PAGAR</td>
                                <td class="tg-0pky" colspan="2" id="totalNetoPagar">0.00</td>
                            </tr>
                            <tr>
                                <td class="tg-0pky" colspan="9" rowspan="11" style="border-top-color: #ffffff"></td>
                            </tr>
                            <tr>
                                <td class="tg-0pky"></td>
                            </tr>
                            <tr>
                                <td class="tg-0pky"></td>
                            </tr>
                            <tr>
                                <td class="tg-0pky"></td>
                            </tr>
                            <tr>
                                <td class="tg-0pky"></td>
                            </tr>
                            <tr>
                                <td class="tg-0pky"></td>
                            </tr>
                            <tr>
                                <td class="tg-0pky"></td>
                            </tr>
                            <tr>
                                <td class="tg-0pky"></td>
                            </tr>
                            <tr>
                                <td class="tg-0pky"></td>
                            </tr>
                            <tr>
                                <td class="tg-0pky"></td>
                            </tr>
                            <tr>
                                <td class="tg-0pky"></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <!-- /.card-body -->
        </div>

    </div>

    <div id="boleta-mensual" style="display: none">
        <div class="card card-outline card-primary">
            <div class="card-header">
                <h3 class="card-title">Boleta Mensual</h3>

                <div class="card-tools">
                    <button id="btn-save-month" class="btn btn-outline-primary btn-sm float-left" > <i class="fas fa-file-pdf fa-spin font-20 mr-2"></i> Guardar y descargar</button>&nbsp;

                    <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i>
                    </button>

                </div>
                <!-- /.card-tools -->
            </div>
            <!-- /.card-header -->
            <div class="card-body">
                <div class="row justify-content-center">
                    <div class="table-responsive align-center">
                        <table class="tg1 center" style="table-layout: fixed; width: 835px">
                    <colgroup>
                        <col style="width: 100px">
                        <col style="width: 100px">
                        <col style="width: 100px">
                        <col style="width: 100px">
                        <col style="width: 100px">
                        <col style="width: 100px">
                        <col style="width: 100px">
                        <col style="width: 100px">
                    </colgroup>
                    <thead>
                    <tr>
                        <th class="tg-tur5" colspan="8" id="ruc_m"></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td class="tg-tur5" colspan="8" id="empleador_m"></td>
                    </tr>
                    <tr>
                        <td class="tg-tur5" colspan="8" id="periodo_m"></td>
                    </tr>
                    <tr>
                        <td class="tg-tur5" colspan="8">PDT Planilla Electrónica - PLAME            Número de Orden :</td>
                    </tr>
                    <tr>
                        <td class="tg-0lax" colspan="8"></td>
                    </tr>
                    <tr>
                        <td class="tg-3e71" colspan="2">Documento de Identidad</td>
                        <td class="tg-3e71" colspan="4" rowspan="2">Nombre y Apellidos</td>
                        <td class="tg-3e71" colspan="2" rowspan="2">Situación</td>
                    </tr>
                    <tr>
                        <td class="tg-3e71">Tipo</td>
                        <td class="tg-3e71">Número</td>
                    </tr>
                    <tr>
                        <td class="tg-c3ow" id="tipo_m"></td>
                        <td class="tg-c3ow" id="dni_m"></td>
                        <td class="tg-c3ow" colspan="4" id="empleado_m"></td>
                        <td class="tg-c3ow" colspan="2" id="situacion_m"></td>
                    </tr>
                    <tr>
                        <td class="tg-3e71" colspan="2">Fecha Ingreso</td>
                        <td class="tg-3e71" colspan="2">Tipo de Trabajador</td>
                        <td class="tg-3e71" colspan="2">Regimen Pensionario</td>
                        <td class="tg-3e71" colspan="2">CUSPP</td>
                    </tr>
                    <tr>
                        <td class="tg-c3ow" colspan="2" id="fecha_ingreso_m"></td>
                        <td class="tg-c3ow" colspan="2" id="tipo_trabajador_m"></td>
                        <td class="tg-c3ow" colspan="2" id="sistema_pensionario_m"></td>
                        <td class="tg-c3ow" colspan="2" id="cuspp_m"></td>
                    </tr>
                    <tr>
                        <td class="tg-3e71" rowspan="2">Días Laborados</td>
                        <td class="tg-3e71" rowspan="2">Días No Laborados</td>
                        <td class="tg-3e71" rowspan="2">Días Subsidiados</td>
                        <td class="tg-3e71" rowspan="2">Condición</td>
                        <td class="tg-3e71" colspan="2">Jornada Ordinaria</td>
                        <td class="tg-3e71" colspan="2">SobreTiempo</td>
                    </tr>
                    <tr>
                        <td class="tg-3e71">Total Horas</td>
                        <td class="tg-3e71">Minutos</td>
                        <td class="tg-3e71">Total Horas</td>
                        <td class="tg-3e71">Minutos</td>
                    </tr>
                    <tr>
                        <td class="tg-c3ow" id="dias_laborados_m">00.00</td>
                        <td class="tg-c3ow" id="dias_no_laborados_m">00.00</td>
                        <td class="tg-c3ow" id="dias_subsidiados_m">00.00</td>
                        <td class="tg-c3ow" id="condicion_m"></td>
                        <td class="tg-c3ow" id="jornada_ordinaria_m">00.00</td>
                        <td class="tg-c3ow"></td>
                        <td class="tg-c3ow" id="sobretiempo_m">00.00</td>
                        <td class="tg-c3ow"></td>
                    </tr>
                    <tr>
                        <td class="tg-3e71" colspan="6">Motivo de Suspensión de Labores</td>
                        <td class="tg-3e71" colspan="2" rowspan="2">Otros Empleadores por Rentas de Quinta Categoría</td>
                    </tr>
                    <tr>
                        <td class="tg-3e71">Tipo</td>
                        <td class="tg-3e71" colspan="4">Motivo</td>
                        <td class="tg-3e71">N° de Días</td>
                    </tr>
                    <tr>
                        <td class="tg-c3ow">07</td>
                        <td class="tg-c3ow" colspan="4">S.P. FALTA NO JUSTIFICADA</td>
                        <td class="tg-c3ow">1</td>
                        <td class="tg-c3ow" colspan="2">No tiene</td>
                    </tr>
                    <tr>
                        <td class="tg-0pky" colspan="8"></td>
                    </tr>
                    <tr>
                        <td class="tg-3e71">Código</td>
                        <td class="tg-3e71" colspan="4">Conceptos</td>
                        <td class="tg-3e71">Ingresos S/.</td>
                        <td class="tg-3e71">Descuentos S/.</td>
                        <td class="tg-3e71">Neto S/.</td>
                    </tr>
                    <tr>
                        <td class="tg-tur5" colspan="8">Ingresos</td>
                    </tr>
                    <tr>
                        <td class="tg-c3ow">0105</td>
                        <td class="tg-0pky" colspan="4">TRABAJO SOBRETIEMPO (H. EXTRAS 25%)</td>
                        <td class="tg-dvpl" id="trabajo_sobretiempo_25_m">00.00</td>
                        <td class="tg-0pky"></td>
                        <td class="tg-0pky"></td>
                    </tr>
                    <tr>
                        <td class="tg-c3ow">0106</td>
                        <td class="tg-0pky" colspan="4">TRABAJO SOBRETIEMPO (H. EXTRAS 35%)</td>
                        <td class="tg-dvpl" id="trabajo_sobretiempo_35_m">00.00</td>
                        <td class="tg-0pky"></td>
                        <td class="tg-0pky"></td>
                    </tr>
                    <tr>
                        <td class="tg-c3ow">0107</td>
                        <td class="tg-0pky" colspan="4">TRABAJO EN FERIADO O DÍA DESCANSO</td>
                        <td class="tg-dvpl" id="trabajo_en_feriado_m">00.00</td>
                        <td class="tg-0pky"></td>
                        <td class="tg-0pky"></td>
                    </tr>
                    <tr>
                        <td class="tg-c3ow">0121</td>
                        <td class="tg-0pky" colspan="4">REMUNERACIÓN O JORNAL BÁSICO</td>
                        <td class="tg-dvpl" id="remuneracion_jornal_basico_m">00.00</td>
                        <td class="tg-0pky"></td>
                        <td class="tg-0pky"></td>
                    </tr>
                    <tr>
                        <td class="tg-c3ow">0312</td>
                        <td class="tg-0pky" colspan="4">BONIF. EXTRAORD. TEMPORAL LEY 29351 y 30334</td>
                        <td class="tg-dvpl" id="bonificacion_extraordinaria_temporal_m">00.00</td>
                        <td class="tg-0pky"></td>
                        <td class="tg-0pky"></td>
                    </tr>
                    <tr>
                        <td class="tg-c3ow">0406</td>
                        <td class="tg-0pky" colspan="4">GRATIF. F.PATRIAS NAVIDAD LEY 29351 Y 30334</td>
                        <td class="tg-dvpl" id="gratificacion_m">00.00</td>
                        <td class="tg-0pky"></td>
                        <td class="tg-0pky"></td>
                    </tr>
                    <tr>
                        <td class="tg-tur5" colspan="8">Descuentos</td>
                    </tr>
                    <tr>
                        <td class="tg-tur5" colspan="8">Aportes del Trabajador</td>
                    </tr>
                    <tr>
                        <td class="tg-c3ow">0601</td>
                        <td class="tg-0pky" colspan="4">COMISIÓN AFP PORCENTUAL</td>
                        <td class="tg-0pky"></td>
                        <td class="tg-dvpl" id="comision_afp_porcentual_m">00.00</td>
                        <td class="tg-0pky"></td>
                    </tr>
                    <tr>
                        <td class="tg-c3ow">0605</td>
                        <td class="tg-0pky" colspan="4">RENTA QUINTA CATEGORÍA RETENCIONES</td>
                        <td class="tg-0pky"></td>
                        <td class="tg-dvpl" id="renta_quinta_categoria_m">00.00</td>
                        <td class="tg-0pky"></td>
                    </tr>
                    <tr>
                        <td class="tg-c3ow">0606</td>
                        <td class="tg-0pky" colspan="4">PRIMA DE SEGURO AFP</td>
                        <td class="tg-0pky"></td>
                        <td class="tg-dvpl" id="prima_seguro_afp_m">00.00</td>
                        <td class="tg-0pky"></td>
                    </tr>
                    <tr>
                        <td class="tg-c3ow">0608</td>
                        <td class="tg-0pky" colspan="4">SPP - APORTACIÓN OBLIGATORIA</td>
                        <td class="tg-0pky"></td>
                        <td class="tg-dvpl" id="aportacion_obligatoria_m">00.00</td>
                        <td class="tg-0pky"></td>
                    </tr>
                    <tr>
                        <td class="tg-tur5" colspan="7">Neto a pagar</td>
                        <td class="tg-tur51 tg-dvpl" id="neto_pagar_m">00.00</td>
                    </tr>
                    <tr>
                        <td class="tg-0pky" colspan="8"></td>
                    </tr>
                    <tr>
                        <td class="tg-tur5" colspan="8">Aportes de Empleador</td>
                    </tr>
                    <tr>
                        <td class="tg-c3ow">0804</td>
                        <td class="tg-0pky" colspan="4">ESSALUD(REGULAR CBSSP AGRAR/AC)TRAB</td>
                        <td class="tg-0pky"></td>
                        <td class="tg-0pky"></td>
                        <td class="tg-dvpl" id="essalud_m">00.00</td>
                    </tr>

                    <tr>


                    </tr>
                    <tr></tr>
                    <tr></tr>
                    <tr></tr>
                    <tr></tr>
                    <tr></tr>
                    <tr></tr>
                    <tr></tr>
                    <tr></tr>
                    <tr></tr>
                    <tr></tr>
                    <tr></tr>
                    <tr></tr>
                    <tr></tr>
                    <tr></tr>
                    <tr></tr>
                    </tbody>
                </table>
                    </div>
                </div>
            </div>
            <!-- /.card-body -->
        </div>
    </div>

@endsection

@section('plugins')
    <!-- Select2 -->
    <script src="{{ asset('admin/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js') }}"></script>
    <script src="{{ asset('admin/plugins/bootstrap-datepicker/locales/bootstrap-datepicker.es.min.js') }}"></script>

    <script src="{{ asset('admin/plugins/select2/js/select2.full.min.js') }}"></script>
    <!-- InputMask -->
    <script src="{{ asset('admin/plugins/moment/moment.min.js') }}"></script>
    <!-- Vdialog -->
    <script src="{{ asset('admin/plugins/vdialog/js/lib/vdialog.js') }}"></script>

    <script src="{{asset('admin/plugins/jquery_loading/loadingoverlay.min.js')}}"></script>

@endsection

@section('scripts')
    <script>
        $(function () {
            $('#worker').select2({
                placeholder: "Trabajador",
            });
            $('#type').select2({
                placeholder: "Tipo",
            });
            $('#year').select2({
                placeholder: "Año",
            });
            $('#month').select2({
                placeholder: "Mes",
            });
            $('#week').select2({
                placeholder: "Semana",
            });
        })
    </script>
    <script src="{{ asset('js/boleta/createByWorker.js') }}"></script>
@endsection




