@extends('layouts.appAdmin2')

@section('openConfig')
    menu-open
@endsection

@section('activeConfig')
    active
@endsection

@section('openSubcategory')
    menu-open
@endsection

@section('activeSubcategory')

@endsection

@section('activeCreateSubcategory')
    active
@endsection

@section('title')
    Subcategorías
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
    <h1 class="page-title">Subcategorías</h1>
@endsection

@section('page-title')
    <h5 class="card-title">Crear nueva subcategoría</h5>
    <a href="{{ route('subcategory.index') }}" class="btn btn-outline-success btn-sm float-right" > <i class="fa fa-arrow-left font-20"></i> Listado de Subcategorías </a>
@endsection

@section('page-breadcrumb')
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item">
            <a href="{{ route('dashboard.principal') }}"><i class="fa fa-home"></i> Dashboard</a>
        </li>
        <li class="breadcrumb-item">
            <a href="{{ route('subcategory.index') }}"><i class="fa fa-archive"></i> Subcategorías</a>
        </li>
        <li class="breadcrumb-item"><i class="fa fa-plus-circle"></i> Nuevo</li>
    </ol>
@endsection

@section('content')
    <form id="formCreate" class="form-horizontal" data-url="{{ route('subcategory.store') }}" enctype="multipart/form-data">
        @csrf
        <div class="form-group row">
            <div class="col-md-6">
                <label class="col-form-label">Seleccione Categoría <span class="right badge badge-danger">(*)</span></label>
                <select id="category_id" name="category_id" class="form-control select2" style="width: 100%;">
                    <option></option>
                    @foreach($categories as $category)
                        <option value="{{ $category->id }}">{{ $category->name }}</option>
                    @endforeach
                </select>
            </div>
        </div>

        <div id="subcategory-container">
            <div class="form-group row subcategory-group">
                <div class="col-md-5">
                    <input type="text" class="form-control" name="subcategories[0][name]" placeholder="Nombre Subcategoría" onkeyup="mayus(this);">
                </div>
                <div class="col-md-5">
                    <input type="text" class="form-control" name="subcategories[0][description]" placeholder="Descripción" onkeyup="mayus(this);">
                </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-danger remove-subcategory">X</button>
                </div>
            </div>
        </div>

        <div class="form-group text-center">
            <button type="button" id="add-subcategory" class="btn btn-outline-primary mb-2">Agregar otra subcategoría</button>
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
    <script src="{{ asset('admin/plugins/select2/js/select2.full.min.js') }}"></script>
@endsection

@section('scripts')
    <script src="{{ asset('js/subcategory/create.js') }}"></script>
@endsection
