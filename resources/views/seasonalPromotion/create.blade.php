@extends('layouts.appAdmin2')

@section('openPromotions')
    menu-open
@endsection

@section('activePromotions')
    active
@endsection

@section('activePromotionsSeasonal')
    active
@endsection

@section('title')
    Crear promociones por temporada
@endsection

@section('styles-plugins')
    <!-- Datatables -->
    <link rel="stylesheet" href="{{ asset('admin/plugins/datatables-bs4/css/dataTables.bootstrap4.min.css') }}">
    <link rel="stylesheet" href="{{ asset('admin/plugins/datatables-responsive/css/responsive.bootstrap4.min.css') }}">
    <!-- Select2 -->
    <link rel="stylesheet" href="{{ asset('admin/plugins/select2/css/select2.min.css') }}">
    <link rel="stylesheet" href="{{ asset('admin/plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css') }}">
@endsection

@section('styles')
    <style>
        .select2-search__field{
            width: 100% !important;
        }
    </style>
@endsection

@section('page-header')
    <h1 class="page-title">Crear promociones</h1>
@endsection

@section('page-title')
    <h5 class="card-title">Crear promoción</h5>
    <a href="{{ route('promotion.seasonal.index') }}" class="btn btn-outline-success btn-sm float-right" > <i class="fa fa-arrow-left font-20"></i> Listado de Promociones por temporada</a>
@endsection

@section('page-breadcrumb')
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item">
            <a href="{{ route('dashboard.principal') }}"><i class="fa fa-home"></i> Dashboard</a>
        </li>
        <li class="breadcrumb-item">
            <a href="{{ route('promotion.seasonal.index') }}"><i class="fa fa-archive"></i> Promociones por temporada</a>
        </li>
        <li class="breadcrumb-item"><i class="fa fa-plus-circle"></i> Nuevo</li>
    </ol>
@endsection

@section('content')
    <form id="formCreate" class="form-horizontal" data-url="{{ route('promotion.seasonal.store') }}" enctype="multipart/form-data">
        @csrf
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label for="description" class="col-12 col-form-label">Descripción <span class="right badge badge-danger">(*)</span></label>
                    <input type="text" class="form-control" name="description" id="description">
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label for="category_id" class="col-12 col-form-label">Seleccione Categoría <span class="right badge badge-danger">(*)</span></label>
                    <div class="col-sm-12">
                        <select id="category_id" name="category_id" class="form-control select2" style="width: 100%;">
                            <option></option>
                            @foreach( $categories as $category )
                                <option value="{{ $category->id }}">{{ $category->name }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>

            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label for="start_date">Fecha de Inicio: <span class="right badge badge-danger">(*)</span></label>
                    <input type="date" id="start_date" name="start_date" class="form-control" required>
                </div>
            </div>

            <div class="col-md-6">
                <div class="form-group">
                    <label for="end_date">Fecha de Finalización: <span class="right badge badge-danger">(*)</span></label>
                    <input type="date" id="end_date" name="end_date" class="form-control" required>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label for="discount_percentage">Porcentaje de Descuento (%): <span class="right badge badge-danger">(*)</span></label>
                    <input type="number" id="discount_percentage" step="0.01" name="discount_percentage" class="form-control" required min="0" max="100">
                </div>
            </div>
        </div>

        <div class="text-center">
            <button type="button" id="btn-submit" class="btn btn-outline-success">Guardar</button>
            <button type="reset" class="btn btn-outline-secondary">Cancelar</button>
        </div>
        <!-- /.card-footer -->
    </form>
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

@endsection

@section('scripts')
    <script>
        $(function () {
            $('#category_id').select2({
                placeholder: "Seleccione",
                allowClear: true
            });

        })
    </script>
    <script src="{{ asset('js/civilStatus/create.js') }}"></script>
@endsection
