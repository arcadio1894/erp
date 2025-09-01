@extends('layouts.appAdmin2')

@section('openQuote')
    menu-open
@endsection

@section('activeQuote')
    active
@endsection

@section('activeCreateQuote')
    active
@endsection

@section('title')
    Cotizaciones
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
    <!-- summernote -->
    <link rel="stylesheet" href="{{ asset('admin/plugins/summernote/summernote-bs4.css') }}">
    <!-- Images -->
@endsection

@section('styles')
    <style>
        .select2-search__field{
            width: 100% !important;
        }
    </style>
@endsection

@section('page-header')
    <h1 class="page-title">Cotizaciones</h1>
@endsection

@section('page-title')
    <h5 class="card-title">Crear nuevo cotización</h5>
@endsection

@section('page-breadcrumb')
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item">
            <a href="{{ route('dashboard.principal') }}"><i class="fa fa-home"></i> Dashboard</a>
        </li>
        <li class="breadcrumb-item">
            <a href="{{ route('quoteSale.index') }}"><i class="fa fa-key"></i> Cotizaciones</a>
        </li>
        <li class="breadcrumb-item"><i class="fa fa-plus-circle"></i> Nuevo</li>
    </ol>
@endsection

@section('content')
    <input type="hidden" id="permissions" value="{{ json_encode($permissions) }}">

    <form id="formCreate" class="form-horizontal" data-url="{{ route('quoteSale.store') }}" enctype="multipart/form-data">
        @csrf
        <div class="row">
            <div class="col-md-12">
                <div class="card card-success">
                    <div class="card-header">
                        <h3 class="card-title">DATOS GENERALES</h3>

                        <div class="card-tools">
                            <button type="button" class="btn btn-tool" data-card-widget="collapse" data-toggle="tooltip" title="Collapse">
                                <i class="fas fa-minus"></i></button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="form-group row">

                            <input type="hidden" id="quote_id" name="quote_id">

                            <div class="col-md-2">
                                <label for="typeComprobante">Tipo de comprobante </label>
                                <input type="text" id="typeComprobante" name="typeComprobante" value="{{ $typeComprobante }}" class="form-control form-control-sm" readonly>
                            </div>
                            <div class="col-md-2">
                                <label for="numDocumento">Documento </label>
                                <input type="text" id="numDocumento" name="numDocumento" class="form-control form-control-sm">
                            </div>
                            <div class="col-md-2">
                                <label for="moneda">Moneda </label>
                                <input type="text" id="moneda" name="moneda" value="{{ ($currency == 'pen') ? 'SOLES':'DOLARES' }}" class="form-control form-control-sm" readonly>
                            </div>
                            <div class="col-md-2">
                                <label for="fechaDocumento">Fecha <span class="right badge badge-danger">(*)</span></label>
                                <input type="date"
                                       id="fechaDocumento"
                                       name="fechaDocumento"
                                       class="form-control form-control-sm"
                                       value="{{ \Carbon\Carbon::now()->format('Y-m-d') }}">
                            </div>
                            <div class="col-md-2">
                                <label for="tipoPago">Tipo Pago <span class="right badge badge-danger">(*)</span></label>
                                <select id="tipoPago" name="tipoPago" class="form-control form-control-sm select2" style="width: 100%;">
                                    <option></option>
                                    @foreach( $tipoPagos as $tipoPago )
                                        <option value="{{ $tipoPago->id }}">{{ $tipoPago->description }}</option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="col-md-2 text-center">
                                <label for="fechaDocumento">&nbsp;</label>
                                <button type="button" class="btn btn-warning btn-block btn-sm" data-toggle="modal" data-target="#modalBuscarComprobante">
                                    RECUPERAR COMPROBANTE
                                </button>
                            </div>
                        </div>
                        @if ( $typeComprobante == 'Boleta' || $typeComprobante == 'Ticket' )
                            <div class="form-group row" id="datosBoleta">
                                <div class="col-md-4">
                                    <label for="nameCliente">Nombre cliente <span class="right badge badge-danger">(*)</span></label>
                                    <input type="text" id="nameCliente" name="nameCliente" value="" class="form-control form-control-sm">
                                </div>
                                <div class="col-md-4">
                                    <label for="dniCliente">DNI <span class="right badge badge-danger">(*)</span></label>
                                    <input type="text" id="dniCliente" name="dniCliente" class="form-control form-control-sm">
                                </div>
                                <div class="col-md-4">
                                    <label for="emailCliente">Email (opcional)</label>
                                    <input type="text" id="emailCliente" name="emailCliente" class="form-control form-control-sm">
                                </div>
                            </div>
                        @elseif( $typeComprobante == 'Factura' )
                            <div class="form-group row" id="datosFactura">
                                <div class="col-md-3">
                                    <label for="rucCliente">RUC <span class="right badge badge-danger">(*)</span></label>
                                    <input type="text" id="rucCliente" name="rucCliente" value="" class="form-control form-control-sm">
                                </div>
                                <div class="col-md-3">
                                    <label for="razonCliente">Razón Social <span class="right badge badge-danger">(*)</span></label>
                                    <input type="text" id="razonCliente" name="razonCliente" class="form-control form-control-sm">
                                </div>
                                <div class="col-md-3">
                                    <label for="direccionCliente">Dirección Fiscal <span class="right badge badge-danger">(*)</span></label>
                                    <input type="text" id="direccionCliente" name="direccionCliente" class="form-control form-control-sm">
                                </div>
                                <div class="col-md-3">
                                    <label for="emailCliente">Email (opcional)</label>
                                    <input type="text" id="emailCliente" name="emailCliente" class="form-control form-control-sm">
                                </div>
                            </div>
                        @endif
                        <div class="form-group row">
                            <div class="col-md-12">
                                <label for="descriptionQuote">Descripción general de cotización </label>
                                <input type="text" id="descriptionQuote" onkeyup="mayus(this);" name="code_description" class="form-control form-control-sm" readonly>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-md-4">
                                <label for="description">Código de cotización </label>
                                <input type="text" id="codeQuote" readonly value="" onkeyup="mayus(this);" name="code_quote" class="form-control form-control-sm">
                            </div>
                            @hasanyrole('logistic|admin|principal|quote_single')
                            <div class="col-md-4">
                                <label for="date_quote">Fecha de cotización </label>
                                <input type="text" class="form-control form-control-sm" id="date_quote" name="date_quote" readonly>
                            </div>
                            <div class="col-md-4">
                                <label for="date_validate">Válido hasta </label>
                                <input type="text" class="form-control form-control-sm" id="date_validate" name="date_validate" readonly>
                            </div>
                            @endhasanyrole

                            @hasanyrole('logistic|admin|principal|quote_single')
                            <div class="col-md-4">
                                <label for="paymentQuote">Forma de pago </label>
                                <input type="text" id="paymentQuote" name="payment_deadline" class="form-control form-control-sm" readonly>

                            </div>
                            @endhasanyrole
                            <div class="col-md-4">
                                <label for="description">Tiempo de entrega </label>
                                <div class="input-group input-group-sm mb-3">
                                    <input type="number" id="timeQuote" step="1" min="0" name="delivery_time" class="form-control form-control-sm" readonly>
                                    <div class="input-group-append">
                                        <span class="input-group-text" id="basic-addon2"> DIAS</span>
                                    </div>
                                </div>

                            </div>
                            <div class="col-md-4">
                                <label for="customer_id">Cliente </label>
                                <input type="text" id="customer_id" name="customer_id" class="form-control form-control-sm" readonly>
                            </div>
                            <div class="col-md-4">
                                <label for="contact_id">Contacto </label>
                                <input type="text" id="contact_id" name="contact_id" class="form-control form-control-sm" readonly>

                            </div>
                            <div class="col-md-8">
                                <label for="observations">Observaciones </label>
                                <textarea class="textarea_observations" id="observations" name="observations" placeholder="Place some text here"
                                          style="width: 100%; height: 200px; font-size: 14px; line-height: 18px; border: 1px solid #dddddd; padding: 10px;"></textarea>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <div class="row" id="body-equipment">
            <div class="col-md-12">
                <div class="card card-success" data-equip="asd">
                    <div class="card-header">
                        <h3 class="card-title">COTIZACIÓN</h3>

                        <div class="card-tools">
                            <button type="button" class="btn btn-tool" data-card-widget="collapse" data-toggle="tooltip" title="Collapse">
                                <i class="fas fa-minus"></i>
                            </button>

                        </div>
                    </div>
                    <div class="card-body">
                        <div class="form-group row">

                            <div class="col-md-12">
                                <label for="description">Detalles de la cotización</label>
                                <textarea class="textarea_edit" data-detailequipment placeholder="Place some text here"
                                          style="width: 100%; height: 200px; font-size: 14px; line-height: 18px; border: 1px solid #dddddd; padding: 10px;"></textarea>
                            </div>
                        </div>

                        <div class="card card-warning">
                            <div class="card-header">
                                <h3 class="card-title">PRODUCTOS</h3>

                                <div class="card-tools">
                                    <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="card-body">
                                <div data-bodyConsumable>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <strong>Descripción</strong>
                                            </div>
                                        </div>
                                        <div class="col-md-1">
                                            <div class="form-group">
                                                <strong>Unidad</strong>
                                            </div>
                                        </div>
                                        <div class="col-md-1">
                                            <div class="form-group">
                                                <strong>Cantidad</strong>
                                            </div>
                                        </div>
                                        <div class="col-md-1">
                                            <div class="form-group">
                                                <strong>V/U</strong>
                                            </div>
                                        </div>
                                        <div class="col-md-1">
                                            <div class="form-group">
                                                <strong>P/U</strong>
                                            </div>
                                        </div>
                                        <div class="col-md-2">
                                            <div class="form-group">
                                                <strong>IMPORTE</strong>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>

                        <!-- /.card -->
                    </div>
                    <!-- /.card-body -->
                </div>
                <!-- /.card -->
            </div>
        </div>

        @can('showPrices_quote')
        <div class="row">
            <!-- accepted payments column -->
            <div class="col-6">

            </div>
            <!-- /.col -->
            <div class="col-6">
                <p class="lead">Resumen de Cotización</p>

                <div class="table-responsive">
                    <table class="table">
                        <tr>
                            <th style="width:50%">DESCUENTO (-): </th>
                            <td>{{ ($currency == 'pen') ?'PEN' : 'USD' }} <span id="descuento" class="align-right">0.00</span></td>
                        </tr>
                        <tr>
                            <th style="width:50%">GRAVADA: </th>
                            <td>{{ ($currency == 'pen') ?'PEN' : 'USD' }} <span id="gravada" class="align-right">0.00</span></td>
                        </tr>
                        <tr>
                            <th style="width:50%">IGV {{ $igv }}%: </th>
                            <td>{{ ($currency == 'pen') ?'PEN' : 'USD' }} <span id="igv_total" class="align-right">0.00</span></td>
                        </tr>
                        <tr>
                            <th style="width:50%">TOTAL: </th>
                            <td>{{ ($currency == 'pen') ?'PEN' : 'USD' }} <span id="total_importe" class="align-right">0.00</span></td>
                        </tr>
                    </table>
                </div>

            </div>
            <!-- /.col -->
        </div>
        @endcan

        <div class="row">
            <div class="col-12">
                <button type="button" id="btn-submit" class="btn btn-outline-success float-right">Guardar comprobante</button>
            </div>
        </div>
        <!-- /.card-footer -->
    </form>

    <template id="template-consumable">
        <div class="row" data-consumable-row>
            {{-- Descripcion --}}
            <div class="col-md-6">
                <div class="form-group">
                    <input type="text" onkeyup="mayus(this);" class="form-control form-control-sm" data-consumableDescription readonly>
                    <input type="hidden" data-consumableId>
                    <input type="hidden" data-descuento>
                    <input type="hidden" data-type_promotion>
                </div>
            </div>
            {{-- Unidad --}}
            <div class="col-md-1">
                <div class="form-group">
                    <div class="form-group">
                        <input type="text" onkeyup="mayus(this);" class="form-control form-control-sm" data-consumableUnit readonly>
                    </div>
                </div>
            </div>
            {{-- Cantidad --}}
            <div class="col-md-1">
                <div class="form-group">
                    <input type="number" readonly class="form-control form-control-sm" placeholder="0.00" min="0" oninput="calculateTotalC(this);" data-consumableQuantity step="0.01" pattern="^\d+(?:\.\d{1,2})?$" onblur="
                            this.style.borderColor=/^\d+(?:\.\d{1,2})?$/.test(this.value)?'':'red'
                            ">
                </div>
            </div>
            {{-- Valor Unitario --}}
            <div class="col-md-1">
                <div class="form-group">
                    <input type="number" class="form-control form-control-sm" placeholder="0.00" min="0" data-consumableValor step="0.01" pattern="^\d+(?:\.\d{1,2})?$" onblur="
                            this.style.borderColor=/^\d+(?:\.\d{1,2})?$/.test(this.value)?'':'red'
                            " readonly>
                </div>
            </div>
            {{-- Precio Unitario --}}
            <div class="col-md-1">
                <div class="form-group">
                    <input type="number" class="form-control form-control-sm" placeholder="0.00" min="0" data-consumablePrice step="0.01" pattern="^\d+(?:\.\d{1,2})?$" onblur="
                            this.style.borderColor=/^\d+(?:\.\d{1,2})?$/.test(this.value)?'':'red'
                            " readonly>
                </div>
            </div>
            {{-- Importe --}}
            <div class="col-md-2">
                <div class="form-group">
                    <input type="number" class="form-control form-control-sm" placeholder="0.00" min="0" data-consumableImporte step="0.01" pattern="^\d+(?:\.\d{1,2})?$" onblur="
                            this.style.borderColor=/^\d+(?:\.\d{1,2})?$/.test(this.value)?'':'red'
                            " readonly>
                </div>
            </div>
        </div>
    </template>

    <!-- Modal -->
    <div class="modal fade" id="promotionModal" tabindex="-1" role="dialog" aria-labelledby="promotionModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Promociones disponibles</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" id="promotion-content">
                    <!-- Aquí se cargan dinámicamente -->
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="modalBuscarComprobante" tabindex="-1" role="dialog" aria-labelledby="modalBuscarComprobanteLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title" id="modalBuscarComprobanteLabel">Buscar Cotización</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="modal-body">
                    <div class="form-row">
                        <div class="col-md-5">
                            <label for="codigoBusqueda">Código</label>
                            <input type="text" id="codigoBusqueda" class="form-control form-control-sm">
                        </div>
                        <div class="col-md-5">
                            <label for="nombreBusqueda">Nombre</label>
                            <input type="text" id="nombreBusqueda" class="form-control form-control-sm">
                        </div>
                        <div class="col-md-2">
                            <label for="btnBuscarCotizacion">&nbsp;</label><br>
                            <button type="button" data-url="{{ route('quotes.buscar') }}" class="btn btn-primary btn-block btn-sm" id="btnBuscarCotizacion">Buscar</button>
                        </div>
                    </div>


                    <hr>
                    <div id="resultadosCotizacion">
                        <!-- Aquí se pintan los resultados por AJAX -->
                    </div>
                </div>

            </div>
        </div>
    </div>

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
    <script src="{{asset('admin/plugins/typehead/typeahead.bundle.js')}}"></script>
    <script src="{{asset('admin/plugins/summernote/summernote-bs4.min.js')}}"></script>
    <script src="{{asset('admin/plugins/summernote/lang/summernote-es-ES.js')}}"></script>
    <script>
        $(function () {

            $('.textarea_observations').summernote({
                lang: 'es-ES',
                placeholder: 'Ingrese los detalles',
                tabsize: 2,
                height: 120,
                toolbar: [
                    ['style', ['bold', 'italic', 'underline', 'clear']],
                    ['fontname', ['fontname']],
                    ['para', ['ul', 'ol']],
                    ['insert', ['link']],
                    ['view', ['codeview', 'help']]
                ]
            });
            $('.textarea_edit').summernote({
                lang: 'es-ES',
                placeholder: 'Ingrese los detalles',
                tabsize: 2,
                height: 120,
                toolbar: [
                    ['style', ['bold', 'italic', 'underline', 'clear']],
                    ['fontname', ['fontname']],
                    ['para', ['ul', 'ol']],
                    ['insert', ['link']],
                    ['view', ['codeview', 'help']]
                ]
            });


            $('#tipoPago').select2({
                placeholder: "Seleccione Tipo",
            });

            $('#sandbox-container .input-daterange').datepicker({
                todayBtn: "linked",
                clearBtn: true,
                language: "es",
                multidate: false,
                autoclose: true
            });
            $("input[data-bootstrap-switch]").each(function(){
                $(this).bootstrapSwitch();
            });
        })
    </script>

    <script src="{{ asset('js/quoteSale/registrarComprobante.js') }}?v={{ time() }}"></script>
@endsection
