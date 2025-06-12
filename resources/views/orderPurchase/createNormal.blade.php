@extends('layouts.appAdmin2')

@section('openOrderPurchaseGeneral')
    menu-open
@endsection

@section('activeOrderPurchaseGeneral')
    active
@endsection

@section('activeCreateOrderPurchaseNormal')
    active
@endsection

@section('title')
    Orden de compra normal
@endsection

@section('styles-plugins')
    <link rel="stylesheet" href="{{ asset('admin/plugins/select2/css/select2.min.css') }}">
    <link rel="stylesheet" href="{{ asset('admin/plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css') }}">
    <link rel="stylesheet" href="{{ asset('admin/plugins/icheck-bootstrap/icheck-bootstrap.min.css') }}">
    <link rel="stylesheet" href="{{ asset('admin/plugins/bootstrap-datepicker/css/bootstrap-datepicker.css') }}">
    <link rel="stylesheet" href="{{ asset('admin/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css') }}">
    <link rel="stylesheet" href="{{ asset('admin/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.css') }}">
    <link rel="stylesheet" href="{{ asset('admin/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.standalone.css') }}">
    <link rel="stylesheet" href="{{ asset('admin/plugins/typehead/typeahead.css') }}">

@endsection

@section('styles')
    <style>
        .select2-search__field{
            width: 100% !important;
        }
    </style>
@endsection

@section('page-header')
    <h1 class="page-title">Crear orden de compra normal</h1>
@endsection

@section('page-title')
    <h5 class="card-title">Orden de compra normal</h5>
@endsection

@section('page-breadcrumb')
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item">
            <a href="{{ route('dashboard.principal') }}"><i class="fa fa-home"></i> Dashboard</a>
        </li>
        <li class="breadcrumb-item">
            <a href="{{route('order.purchase.general.indexV2')}}"><i class="fa fa-key"></i> Órdenes de compra</a>
        </li>
        <li class="breadcrumb-item"><i class="fa fa-plus-circle"></i> Crear</li>
    </ol>
@endsection

@section('content')
    <form id="formCreate" class="form-horizontal" data-url="{{ route('order.purchase.normal.store') }}" enctype="multipart/form-data">
        @csrf
        <div class="row">
            <div class="col-md-12">
                <div class="card card-success">
                    <div class="card-header">
                        <h3 class="card-title">Datos generales</h3>

                        <div class="card-tools">
                            <button type="button" class="btn btn-tool" data-card-widget="collapse" data-toggle="tooltip" title="Collapse">
                                <i class="fas fa-minus"></i></button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="purchase_order">Orden de Compra</label>
                                    <input type="text" id="purchase_order" name="purchase_order" class="form-control" value="{{ $codeOrder }}" readonly>
                                </div>
                                <div class="form-group " id="sandbox-container">
                                    <label for="date_order">Fecha de Orden</label>
                                    <div class="input-daterange" id="datepicker">
                                        <input type="text" class="form-control date-range-filter" id="date_order" name="date_order">
                                    </div>
                                </div>
                                <div class="form-group " id="sandbox-container">
                                    <label for="date_arrival">Fecha de Llegada</label>
                                    <div class="input-daterange" id="datepicker">
                                        <input type="text" class="form-control date-range-filter" id="date_arrival" name="date_arrival">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="observation">Observación </label>
                                    <textarea name="observation" cols="30" class="form-control" style="word-break: break-all;" placeholder="Ingrese observación ...."></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="quote_supplier">Cotización de proveedeor </label>
                                    <input type="text" id="quote_supplier" name="quote_supplier" class="form-control">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="supplier">Proveedor </label>
                                    <select id="supplier" name="supplier_id" class="form-control select2" style="width: 100%;">
                                        <option></option>
                                        @foreach( $suppliers as $supplier )
                                            <option value="{{ $supplier->id }}">{{ $supplier->business_name }}</option>
                                        @endforeach
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="approved_by">Aprobado por: </label>
                                    <select id="approved_by" name="approved_by" class="form-control select2" style="width: 100%;">
                                        <option></option>
                                        @foreach( $users as $user )
                                            <option value="{{ $user->id }}">{{ $user->name }}</option>
                                        @endforeach
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="payment_deadline">Forma de pago </label>
                                    {{--<input type="text" id="purchase_condition" name="purchase_condition" class="form-control">--}}
                                    <select id="payment_deadline" name="payment_deadline_id" class="form-control select2" style="width: 100%;">
                                        <option></option>
                                        @foreach( $payment_deadlines as $payment_deadline )
                                            <option value="{{ $payment_deadline->id }}">{{ $payment_deadline->description }}</option>
                                        @endforeach
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="btn-currency"> Moneda <span class="right badge badge-danger">(*)</span></label> <br>
                                    <input id="btn-currency" type="checkbox" name="currency_order" data-bootstrap-switch data-off-color="primary" data-on-text="SOLES" data-off-text="DOLARES" data-on-color="success" checked>
                                </div>
                                <div class="form-group">
                                    <label for="btn-regularize"> Regularización <span class="right badge badge-danger">(*)</span></label> <br>
                                    <input id="btn-regularize" type="checkbox" name="regularize_order" data-bootstrap-switch data-off-color="primary" data-on-text="SI" data-off-text="NO" data-on-color="success">
                                </div>
                                {{--<div class="form-group">
                                    <label for="quote_id">Cotización </label>
                                    <select id="quote_id" name="quote_id" class="form-control select2" style="width: 100%;">
                                        <option></option>
                                        @foreach( $quotesRaised as $quote )
                                            <option value="{{ $quote->id }}">{{ $quote->code . ' ' . $quote->description_quote }}</option>
                                        @endforeach
                                    </select>
                                </div>--}}
                            </div>
                        </div>

                    </div>
                    <!-- /.card-body -->
                </div>
                <!-- /.card -->
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
                <div class="card card-warning " id="element_loader">
                    <div class="card-header">
                        <h3 class="card-title">Detalles de compra</h3>

                        <div class="card-tools">
                            <button type="button" class="btn btn-tool" data-card-widget="collapse" data-toggle="tooltip" title="Collapse">
                                <i class="fas fa-minus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-body ">
                        <div class="row">
                            <div class="col-md-8">
                                <div class="form-group">
                                    <label for="material_search">Buscar material <span class="right badge badge-danger">(*)</span></label>
                                    <input type="text" id="material_search" class="form-control rounded-0 typeahead">

                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-group">
                                    <label for="quantity">Cantidad <span class="right badge badge-danger">(*)</span></label>
                                    {{--<input type="number" oninput="this.value = this.value.replace(/[^0-9]/g,'');" step="1" id="quantity" class="form-control">--}}
                                    <input type="number" {{--oninput="this.value = this.value.replace(/[^0-9]/g,'');"--}} step="0.01" id="quantity" class="form-control">
                                </div>
                            </div>
                            <div class="col-md-2">
                                <label for="btn-add"> &nbsp; </label>
                                <button type="button" id="btn-add" class="btn btn-block btn-outline-primary">Agregar <i class="fas fa-arrow-circle-right"></i></button>
                            </div>

                        </div>

                        <hr>

                        <div class="row">
                            <div class="col-md-1">
                                <div class="form-group">
                                    <strong>ID</strong>
                                </div>
                            </div>
                            <div class="col-md-1">
                                <div class="form-group">
                                    <strong>Código</strong>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <strong>Material</strong>
                                </div>
                            </div>
                            <div class="col-md-1">
                                <div class="form-group">
                                    <strong>Cantidad</strong>
                                </div>
                            </div>
                            <div class="col-md-1">
                                <div class="form-group">
                                    <strong>Precio C/Igv</strong>
                                </div>
                            </div>
                            <div class="col-md-1">
                                <div class="form-group">
                                    <strong>Precio S/Igv</strong>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-group">
                                    <strong>Total C/Igv</strong>
                                </div>
                            </div>
                            <div class="col-md-1">
                                <div class="form-group">
                                    <strong>Acción</strong>
                                </div>
                            </div>
                        </div>
                        <div id="body-materials">

                        </div>
                    </div>
                    <!-- /.card-body -->
                </div>
                <!-- /.card -->
            </div>
        </div>
        <!-- /.card-footer -->
        <div class="row">
            <!-- accepted payments column -->
            <div class="col-6">

            </div>
            <!-- /.col -->
            <div class="col-6">
                <p class="lead">Resumen de factura</p>

                {{--<div class="table-responsive">
                    <table class="table">
                        <tr>
                            <th style="width:50%">Subtotal: </th>
                            <td ><span class="moneda">USD</span> <span id="subtotal">0.00</span> </td>
                        </tr>
                        <tr>
                            <th>Igv: </th>
                            <td ><span class="moneda">USD</span> <span id="taxes">0.00</span> </td>
                        </tr>
                        <tr>
                            <th>Total: </th>
                            <td ><span class="moneda">USD</span> <span id="total">0.00</span> </td>
                        </tr>
                    </table>
                </div>--}}
                <div class="table-responsive">
                    <table class="table">
                        <tr>
                            <th style="width:50%">Subtotal: </th>
                            <td class="input-group"><span class="moneda">PEN</span> <input type="number" min="0" step="0.01" id="subtotal" data-subtotal class="form-control form-control-sm"> </td>
                        </tr>
                        <tr>
                            <th>Igv: </th>
                            <td class="input-group"><span class="moneda">PEN</span> <input type="number" min="0" step="0.01" id="taxes" data-taxes class="form-control form-control-sm"></td>
                        </tr>
                        <tr>
                            <th>Total: </th>
                            <td class="input-group"><span class="moneda">PEN</span> <input type="number" min="0" step="0.01" id="total" data-totalfinal class="form-control form-control-sm"> </td>
                        </tr>
                    </table>
                </div>
            </div>
            <!-- /.col -->
        </div>
        <div class="row">
            <div class="col-12">
                <a class="btn btn-outline-secondary" href="{{ route('order.purchase.general.index') }}">Regresar</a>
                <button type="button" id="btn-submit" class="btn btn-outline-success float-right">Guardar orden de compra</button>
            </div>
        </div>
    </form>

    <template id="materials-selected">
        <div class="row">
            <div class="col-md-1">
                <div class="form-group">
                    <div class="form-group">
                        <input type="text" onkeyup="mayus(this);" class="form-control form-control-sm" data-id readonly>
                    </div>
                </div>
            </div>
            <div class="col-md-1">
                <div class="form-group">
                    <div class="form-group">
                        <input type="text" onkeyup="mayus(this);" class="form-control form-control-sm" data-code readonly>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <div class="form-group">
                        <input type="text" onkeyup="mayus(this);" class="form-control form-control-sm" data-description readonly>
                    </div>
                </div>
            </div>

            <div class="col-md-1">
                <div class="form-group">
                    <input type="number" class="form-control form-control-sm" oninput="this.value = this.value.replace(/[^0-9]/g,'');calculateTotal(this);" placeholder="0.00" min="0" data-quantity step="1" >
                </div>
            </div>
            <div class="col-md-1">
                <div class="form-group">
                    <input type="number" class="form-control form-control-sm" oninput="calculateTotal2(this);" placeholder="0.00" min="0" data-price step="0.01" pattern="^\d+(?:\.\d{1,2})?$">
                </div>
            </div>
            <div class="col-md-1">
                <div class="form-group">
                    <input type="number" class="form-control form-control-sm" oninput="calculateTotal3(this);" placeholder="0.00" min="0" data-price2 step="0.01" pattern="^\d+(?:\.\d{1,2})?$">
                </div>
            </div>
            <div class="col-md-2">
                <div class="form-group">
                    <input type="number" class="form-control form-control-sm" placeholder="0.00" min="0" data-total step="0.01" pattern="^\d+(?:\.\d{1,2})?$" onblur="
                            this.style.borderColor=/^\d+(?:\.\d{1,2})?$/.test(this.value)?'':'red'
                            " >
                </div>
            </div>
            <div class="col-md-1">
                <button type="button" data-delete class="btn btn-block btn-outline-danger btn-sm"><i class="fas fa-trash"></i> </button>
            </div>
        </div>
    </template>

@endsection

@section('plugins')
    <!-- Select2 -->
    <script src="{{ asset('admin/plugins/select2/js/select2.full.min.js') }}"></script>
    <script src="{{ asset('admin/plugins/bootstrap-switch/js/bootstrap-switch.min.js') }}"></script>
    <script src="{{ asset('admin/plugins/moment/moment.min.js') }}"></script>
    <script src="{{ asset('admin/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js') }}"></script>
    <script src="{{ asset('admin/plugins/bootstrap-datepicker/locales/bootstrap-datepicker.es.min.js') }}"></script>
    <script src="{{asset('admin/plugins/typehead/typeahead.bundle.js')}}"></script>
@endsection

@section('scripts')
    <script src="{{asset('admin/plugins/jquery_loading/loadingoverlay.min.js')}}"></script>

    <script>
        $(function () {
            //Initialize Select2 Elements
            $('#date_order').attr("value", moment().format('DD/MM/YYYY'));
            $('#date_arrival').attr("value", moment().format('DD/MM/YYYY'));

            $('#sandbox-container .input-daterange').datepicker({
                todayBtn: "linked",
                clearBtn: true,
                language: "es",
                multidate: false,
                autoclose: true,
                todayHighlight: true,
                defaultViewDate: moment().format('L')
            });

            $("input[data-bootstrap-switch]").each(function(){
                $(this).bootstrapSwitch();
            });
            $('#supplier').select2({
                placeholder: "Seleccione un proveedor",
            });
            $('#approved_by').select2({
                placeholder: "Seleccione un usuario",
            });
            $('#customer_id').select2({
                placeholder: "Selecione cliente",
            });
            $('#payment_deadline').select2({
                placeholder: "Selecione plazo",
            });

            $('.unitMeasure').select2({
                placeholder: "Seleccione unidad",
            });
            $('#quote_id').select2({
                placeholder: "Selecione trabajo",
                allowClear: true
            });

        })
    </script>

    <script src="{{ asset('js/orderPurchase/createNormal.js') }}"></script>
@endsection
