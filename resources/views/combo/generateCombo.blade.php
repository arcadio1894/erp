@extends('layouts.appAdmin2')

@section('openMaterial')
    menu-open
@endsection

@section('activeMaterial')
    active
@endsection

@section('activeGenerateComboMaterial')
    active
@endsection

@section('title')
    Combos
@endsection

@section('styles-plugins')
    <!-- Datatables -->
    <link rel="stylesheet" href="{{ asset('admin/plugins/datatables-bs4/css/dataTables.bootstrap4.min.css') }}">
    <link rel="stylesheet" href="{{ asset('admin/plugins/datatables-responsive/css/responsive.bootstrap4.min.css') }}">
    <!-- Select2 -->
    <link rel="stylesheet" href="{{ asset('admin/plugins/select2/css/select2.min.css') }}">
    <link rel="stylesheet" href="{{ asset('admin/plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css') }}">
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
    <h1 class="page-title">Generar combos</h1>
@endsection

@section('page-title')
    <h5 class="card-title">Crear combo</h5>
    <a href="{{ route('index.combos') }}" class="btn btn-outline-success btn-sm float-right" > <i class="fa fa-arrow-left font-20"></i> Listado de Combos</a>
@endsection

@section('page-breadcrumb')
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item">
            <a href="{{ route('dashboard.principal') }}"><i class="fa fa-home"></i> Dashboard</a>
        </li>
        <li class="breadcrumb-item">
            <a href="{{ route('index.combos') }}"><i class="fa fa-archive"></i> Combos / Paquetes</a>
        </li>
        <li class="breadcrumb-item"><i class="fa fa-plus-circle"></i> Nuevo</li>
    </ol>
@endsection

@section('content')
    <input type="hidden" id="permissions" value="{{ json_encode($permissions) }}">

    <div class="row">
        <div class="col-md-7">
            <div class="form-group" id="body-materials">
                <div class="row">
                    <div class="col-md-8">
                        <label >Seleccione material <span class="right badge badge-danger">(*)</span></label>
                        <input type="text" class="form-control typeahead materialTypeahead" data-descriptionMaterial>

                    </div>
                    <div class="col-md-3">
                        <label >Cantidad <span class="right badge badge-danger">(*)</span></label>
                        <input type="number" class="form-control" min="0" value="1" data-quantityMaterial>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-1">
            <label >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
            <button type="button" class="btn btn-outline-success btn-block" id="btn-addMaterial"><i class="fas fa-plus-circle"></i></button>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label for="name">Nombre del paquete <span class="right badge badge-danger">(*)</span></label>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text"><i class="far fa-keyboard"></i></span>
                    </div>
                    <input id="name" type="text" class="form-control" name="name" >
                </div>
            </div>
            <div class="form-group">
                <label for="price">Precio del paquete en % descuento. <span class="right badge badge-danger">(*)</span></label>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text"><i class="fas fa-percent"></i></span>
                    </div>
                    <input id="price" type="number" min="0" step="0.01" class="form-control" name="price" >
                </div>
            </div>
            <div class="form-group">
                <label for="total">Precio de venta <span class="right badge badge-danger">(*)</span></label>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text"><i class="fas fa-money-bill-alt"></i></span>
                    </div>
                    <input id="total" type="number" min="0" step="0.01" class="form-control" name="total" readonly>
                </div>
            </div>
        </div>
    </div>


    <div class="text-center">
        <button type="button" id="btn-submit" data-url="{{ route('save.separate.pack') }}" class="btn btn-outline-success">Generar Paquete</button>
        <button type="button" id="btn-reset" class="btn btn-outline-secondary">Cancelar</button>
    </div>

    <template id="template-material">
        <div class="row">
            <div class="col-md-8">
                <label >Seleccione material <span class="right badge badge-danger">(*)</span></label>
                <input type="text" class="form-control typeahead materialTypeahead" data-descriptionMaterial>

            </div>
            <div class="col-md-3">
                <label >Cantidad <span class="right badge badge-danger">(*)</span></label>
                <input type="number" class="form-control" min="0" value="1" data-quantityMaterial>
            </div>
            <div class="col-md-1">
                <label >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                <button type="button" class="btn btn-outline-danger btn-block" data-deleteMaterial><i class="fas fa-times-circle"></i></button>
            </div>
        </div>
    </template>
@endsection

@section('plugins')
    <!-- Datatables -->
    <script src="{{ asset('admin/plugins/datatables/jquery.dataTables.min.js') }}"></script>
    <script src="{{ asset('admin/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js') }}"></script>
    <script src="{{ asset('admin/plugins/datatables-responsive/js/dataTables.responsive.min.js') }}"></script>
    <script src="{{ asset('admin/plugins/datatables-responsive/js/responsive.bootstrap4.min.js') }}"></script>
    <!-- Select2 -->
    <script src="{{ asset('admin/plugins/moment/moment.min.js') }}"></script>
    <script src="{{ asset('admin/plugins/select2/js/select2.full.min.js') }}"></script>
    <script src="{{ asset('admin/plugins/inputmask/min/jquery.inputmask.bundle.min.js') }}"></script>
    <script src="{{asset('admin/plugins/typehead/typeahead.bundle.js')}}"></script>
@endsection

@section('scripts')
    <script src="{{ asset('js/combo/generateCombo.js') }}"></script>
@endsection
