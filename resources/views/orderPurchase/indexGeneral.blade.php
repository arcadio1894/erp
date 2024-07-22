@extends('layouts.appAdmin2')

@section('openOrderPurchaseGeneral')
    menu-open
@endsection

@section('activeOrderPurchaseGeneral')
    active
@endsection

@section('activeListOrderPurchaseGeneral')
    active
@endsection

@section('title')
    Ordenes de compra express
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

@section('page-title')
    <h5 class="card-title">Listado de Ordenes de compras general</h5>
    @can('create_orderPurchaseNormal')
        <a href="{{ route('order.purchase.normal.create') }}" class="btn btn-outline-primary btn-sm float-right" > <i class="fa fa-plus font-20"></i> Nueva orden normal </a>
    @endcan
    @can('create_orderPurchaseExpress')
         <a href="{{ route('order.purchase.express.create') }}" class="btn btn-outline-success btn-sm float-right" > <i class="fa fa-plus font-20"></i> Nueva orden express </a>
    @endcan

@endsection

@section('page-breadcrumb')
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item">
            <a href="{{ route('dashboard.principal') }}"><i class="fa fa-home"></i> Dashboard</a>
        </li>
        <li class="breadcrumb-item">
            <a href="{{route('order.purchase.general.index')}}"><i class="fa fa-archive"></i> Ordenes de compra general</a>
        </li>
        <li class="breadcrumb-item"><i class="fa fa-plus-circle"></i> Listado</li>
    </ol>
@endsection

@section('content')
    <input type="hidden" id="permissions" value="{{ json_encode($permissions) }}">
    <div class="row">

        <div class="col-sm-3">
            <label for="filtroEstadoExterno">Filtrar por Estado:</label>
            <select id="filtroEstadoExterno" class="form-control select2" style="width: 100%;">
                <option value="">TODOS</option>
                <option value="stand_by">PENDIENTE</option>
                <option value="send">ENVIADO</option>
                <option value="pick_up">RECOGIDO</option>
            </select>
        </div>

    </div>

    <hr>

    <div class="table-responsive">
        <table class="table table-bordered table-hover" id="dynamic-table">
            <thead>
            <tr>
                <th>ID</th>
                <th>Código</th>
                <th>Fecha Orden</th>
                <th>Fecha Llegada</th>
                <th>Observación</th>
                <th>Proveedor</th>
                <th>Aprobado por</th>
                <th>Moneda</th>
                <th>Total</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th></th>
            </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
    </div>
    @can('destroy_quote')
    <div id="modalDelete" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Confirmar eliminación</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <form id="formDelete" data-url="{{ route('subcategory.destroy') }}">
                    @csrf
                    <div class="modal-body">
                        <input type="hidden" id="subcategory_id" name="subcategory_id">
                        <strong>¿Está seguro de eliminar esta subcategoría?</strong>
                        <p id="name"></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-danger">Eliminar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    @endcan
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
    <script src="{{ asset('admin/plugins/moment/moment.min.js') }}"></script>
    <script>
        $(function () {
            $('#filtroEstadoExterno').select2({
                placeholder: "Seleccione"
            });

        })
    </script>
    <script src="{{ asset('js/orderPurchase/indexGeneral.js') }}"></script>
@endsection