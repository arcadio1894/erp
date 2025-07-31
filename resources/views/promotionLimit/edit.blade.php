@extends('layouts.appAdmin2')

@section('openPromotions')
    menu-open
@endsection

@section('activePromotions')
    active
@endsection

@section('activePromotionLimit')
    active
@endsection

@section('title')
    Promociones por Limites
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
    <h1 class="page-title">Promociones por lÍmite</h1>
@endsection

@section('page-title')
    <h5 class="card-title">Modificar promoción</h5>
@endsection

@section('page-breadcrumb')
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item">
            <a href="{{ route('dashboard.principal') }}"><i class="fa fa-home"></i> Dashboard</a>
        </li>
        <li class="breadcrumb-item">
            <a href="{{ route('promotionLimit.index') }}"><i class="fa fa-key"></i> Promociones por Limite</a>
        </li>
        <li class="breadcrumb-item"><i class="fa fa-plus-circle"></i> Modificar</li>
    </ol>
@endsection

@section('content')
    <input type="hidden" id="permissions" value="{{ json_encode($permissions) }}">

    <form id="formCreate" class="form-horizontal" data-url="{{ route('promotionLimit.update') }}" enctype="multipart/form-data">
        @csrf
        <div class="row">
            <div class="col-md-12">
                <div class="card card-success">
                    <div class="card-header">
                        <h3 class="card-title">DATOS GENERALES DE LA PROMOCIÓN</h3>

                        <div class="card-tools">
                            <button type="button" class="btn btn-tool" data-card-widget="collapse" data-toggle="tooltip" title="Collapse">
                                <i class="fas fa-minus"></i></button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="form-group row">
                            <div class="col-md-6">
                                <label for="material_search">Seleccione material </label>
                                <input type="text" class="form-control" value="{{ $promotion->material->full_name }}" readonly>
                                <input type="hidden" name="promotion_id" id="promotion_id" value="{{ $promotion->id }}">
                                <input type="hidden" class="form-control" value="{{ $promotion->material_id }}" name="material_id" id="material_id">
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-md-4">
                                <label for="material_search">Ingrese cantidad límite </label>
                                <input type="number" id="cantidadLimite" class="form-control" placeholder="0.00" min="0" value="{{ $promotion->limit_quantity }}" step="0.01" pattern="^\d+(?:\.\d{1,2})?$" onblur="
                                    this.style.borderColor=/^\d+(?:\.\d{1,2})?$/.test(this.value)?'':'red'
                                    ">
                            </div>
                            <div class="col-md-4">
                                <label>Tipo de límite:</label><br>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="applies_to" id="porTrabajador" value="worker" {{ ($promotion->applies_to == 'worker') ? 'checked':'' }} >
                                    <label class="form-check-label" for="porTrabajador">
                                        Por Trabajador
                                    </label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="applies_to" id="global" value="global" {{ ($promotion->applies_to == 'global') ? 'checked':'' }}>
                                    <label class="form-check-label" for="global">
                                        Global
                                    </label>
                                </div>

                            </div>
                            <div class="col-md-4">
                                <label>Tipo de precio:</label>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="price_type" id="fijado" value="fixed" {{ ($promotion->price_type == 'fixed') ? 'checked':'' }}>
                                    <label class="form-check-label" for="fijado">
                                        Fijado
                                    </label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="price_type" id="porcentaje" value="percentage" {{ ($promotion->price_type == 'percentage') ? 'checked':'' }}>
                                    <label class="form-check-label" for="porcentaje">
                                        Porcentaje
                                    </label>
                                </div>
                                <br>
                                <input type="number" id="tipoPrecio" class="form-control" placeholder="0.00" min="0" value="{{ $promotion->percentage }}" step="0.01" pattern="^\d+(?:\.\d{1,2})?$" onblur="
                                    this.style.borderColor=/^\d+(?:\.\d{1,2})?$/.test(this.value)?'':'red'
                                    ">

                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-md-4">
                                <label for="material_search">Precio original </label>
                                <input type="number" id="precioOriginal" class="form-control" placeholder="0.00" min="0" value="{{ $promotion->original_price }}" step="0.01" pattern="^\d+(?:\.\d{1,2})?$" onblur="
                                    this.style.borderColor=/^\d+(?:\.\d{1,2})?$/.test(this.value)?'':'red'
                                    ">
                            </div>
                            <div class="col-md-4">
                                <label for="material_search">Precio promoción </label>
                                <input type="number" id="precioPromocion" class="form-control" placeholder="0.00" min="0" value="{{ $promotion->promo_price }}" step="0.01" pattern="^\d+(?:\.\d{1,2})?$" onblur="
                                    this.style.borderColor=/^\d+(?:\.\d{1,2})?$/.test(this.value)?'':'red'
                                    ">
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-md-4">
                                <label for="start_date">Fecha de inicio</label>
                                <input type="date" id="start_date" class="form-control" name="start_date" value="{{ optional($promotion->start_date)->format('Y-m-d') }}">
                            </div>
                            <div class="col-md-4">
                                <label for="end_date">Fecha de fin</label>
                                <input type="date" id="end_date" class="form-control" name="end_date" value="{{ optional($promotion->end_date)->format('Y-m-d') }}">
                            </div>
                        </div>
                    </div>
                    <!-- /.card-body -->
                </div>
                <!-- /.card -->
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <button type="reset" class="btn btn-outline-secondary">Cancelar</button>
                <button type="button" id="btn-submit" class="btn btn-outline-success float-right">Guardar promoción</button>
            </div>
        </div>
        <!-- /.card-footer -->
    </form>

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

            //Initialize Select2 Elements
            $('#customer_id').select2({
                placeholder: "Selecione cliente",
            });
            $('#contact_id').select2({
                placeholder: "Selecione contacto",
            });
            $('#paymentQuote').select2({
                placeholder: "Selecione forma de pago",
            });

            $('.unitMeasure').select2({
                placeholder: "Seleccione unidad",
            });

            $('#date_quote').attr("value", moment().format('DD/MM/YYYY'));

            $('#date_validate').attr("value", moment().add(5, 'days').format('DD/MM/YYYY'));

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

    <script src="{{ asset('js/promotionLimit/edit.js') }}?v={{ time() }}"></script>
@endsection
