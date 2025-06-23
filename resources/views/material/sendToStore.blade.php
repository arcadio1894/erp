@extends('layouts.appAdmin2')

@section('openMaterial')
    menu-open
@endsection

@section('activeMaterial')
    active
@endsection

@section('activeListMaterial')
    active
@endsection

@section('title')
    Materiales
@endsection

@section('styles-plugins')
    <link rel="stylesheet" href="{{ asset('admin/plugins/select2/css/select2.min.css') }}">
    <link rel="stylesheet" href="{{ asset('admin/plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css') }}">
    <link rel="stylesheet" href="{{ asset('admin/plugins/icheck-bootstrap/icheck-bootstrap.min.css') }}">

@endsection

@section('styles')
    <style>
        .select2-search__field{
            width: 100% !important;
        }
        .shelf-name {
            margin-bottom: 10px;
            font-weight: bold;
        }
        .shelf-grid {
            display: flex;
            flex-direction: column;
        }
        .cell {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 35px;
            height: 35px;
        }
        .circle-btn {
            width: 25px;
            height: 25px;
            border-radius: 50%;
            border: 1px solid #1e3a8a;
            background-color: white;
            cursor: pointer;
        }
        .circle-btn.active {
            background-color: #4CAF50; /* verde */
        }

        .circle-btn.inactive {
            background-color: #ccc; /* gris claro */
            opacity: 0.5;
        }

        .selected-position {
            background-color: orange !important;
            border-color: orange !important;
            color: white !important;
        }

        .circle-btn.black {
            background-color: #000000; /* negro */
        }
        .circle-btn.yellow {
            background-color: #FFD700; /* amarillo */
        }
        .circle-btn.green {
            background-color: #28a745; /* verde */
        }
        .circle-btn.gray {
            background-color: #6c757d; /* plomo/inactivo */
        }
    </style>
@endsection

@section('page-header')
    <h1 class="page-title">Materiales</h1>
@endsection

@section('page-title')
    <h5 class="card-title">Enviar materiales a Tienda</h5>
@endsection

@section('page-breadcrumb')
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item">
            <a href="{{ route('dashboard.principal') }}"><i class="fa fa-home"></i> Dashboard</a>
        </li>
        <li class="breadcrumb-item">
            <a href="{{ route('material.indexV2') }}"><i class="fa fa-archive"></i> Materiales</a>
        </li>
        <li class="breadcrumb-item"><i class="fa fa-plus-circle"></i> Enviar</li>
    </ol>
@endsection

@section('content')
    <div class="row">
        <div class="col-md-12">
            <div class="card card-success">
                <div class="card-header">
                    <h3 class="card-title">Datos del material</h3>

                    <div class="card-tools">
                        <button type="button" class="btn btn-tool" data-card-widget="collapse" data-toggle="tooltip" title="Collapse">
                            <i class="fas fa-minus"></i></button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="form-group row">
                        <div class="col-md-8">
                            <label for="description">Material</label>
                            <input type="text" id="description" name="description" class="form-control" value="{{ $material->full_name }}" readonly>
                        </div>

                        <div class="col-md-2">
                            <label for="quantityAlmacen">Cantidad en Almacen </label>
                            <input type="text" id="quantityAlmacen" name="quantityAlmacen" class="form-control" value="{{ $material->stock_current }}" readonly>

                        </div>

                        <div class="col-md-2">
                            <label for="quantityStore">Cantidad en Tienda </label>
                            <input type="text" id="quantityStore" name="quantityStore" class="form-control" value="{{ $material->stock_store }}" readonly>

                        </div>
                    </div>

                </div>
                <!-- /.card-body -->
            </div>
            <!-- /.card -->
        </div>
        <div class="col-md-12">
            <div class="card card-success">
                <div class="card-header">
                    <h3 class="card-title">Datos del traslado</h3>

                    <div class="card-tools">
                        <button type="button" class="btn btn-tool" data-card-widget="collapse" data-toggle="tooltip" title="Collapse">
                            <i class="fas fa-minus"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <input type="hidden" id="material_id" value="{{ $material->id }}">
                    <input type="hidden" id="material_perecible" value="{{ ($material->perecible == null) ? 'n': $material->perecible }}">
                    <div class="form-group row">
                        <div class="col-md-3">
                            <div class="col-md-12 mb-2">
                                <label>Cantidad a trasladar<span class="right badge badge-danger">(*)</span></label>
                                <input type="number" min="0" data-quantitySend name="description" class="form-control">

                            </div>
                            <div class="col-md-12 mb-2">
                                <label>Precio Unitario<span class="right badge badge-danger">(*)</span></label>
                                <input type="number" value="{{ $material->price_final }}" data-priceUnitSend name="description" class="form-control" readonly>

                            </div>
                            <div class="col-md-12">
                                <div class="d-flex justify-content-between align-items-center">
                                    <label for="quantityStore" class="mb-0">Fechas de vencimiento</label>
                                    <button type="button" id="addDateBtn" class="btn btn-sm btn-primary"><i class="fas fa-plus"></i></button>
                                </div>
                                <!-- Contenedor de inputs de fecha -->
                                <div id="datesContainer" class="mt-2">
                                    <!-- Inputs se agregarán aquí -->
                                </div>
                            </div>
                        </div>
                        <div class="col-md-9">
                            <label>Ubicación </label>
                            <input type="text" data-locationSend id="locationSend" data-position_id name="description" class="form-control col-md-3" readonly>
                            <br>
                            <div class="row">
                                @foreach($shelves as $shelf)
                                    <div class="col-sm-3">
                                        <div class="shelf-name">{{ $shelf->name }}</div>
                                        <div class="shelf-grid">
                                            @foreach($shelf->levels as $level)
                                                <div class="row">
                                                    {{-- Etiqueta de fila (Nivel A, B, etc) --}}
                                                    <div class="label"></div>

                                                    {{-- Recorremos contenedores como columnas --}}
                                                    @foreach($level->containers as $container)
                                                        <div class="cell">
                                                            @foreach($container->positions as $position)
                                                                @php
                                                                    $isSameMaterial = in_array($position->id, $positionIds);
                                                                    $isOtherMaterial = in_array($position->id, $positionIdsNotMaterial);
                                                                @endphp

                                                                @php
                                                                    if ($isOtherMaterial) {
                                                                        $colorClass = 'black'; // Posición ocupada con otro material
                                                                    } elseif ($isSameMaterial) {
                                                                        $colorClass = 'yellow'; // Posición ocupada con el mismo material
                                                                    } elseif ($position->status === 'active') {
                                                                        $colorClass = 'green'; // Vacío, activo
                                                                    } else {
                                                                        $colorClass = 'gray'; // Vacío, inactivo
                                                                    }
                                                                @endphp
                                                                <button
                                                                        class="circle-btn {{ $colorClass }}"
                                                                        data-position-id="{{ $position->id }}"
                                                                        data-position-name="{{ $position->name }}"
                                                                        data-position-status="{{ $position->status }}"
                                                                        title="{{ $position->name }}"
                                                                ></button>
                                                            @endforeach
                                                        </div>
                                                    @endforeach
                                                </div>
                                            @endforeach
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    </div>


                </div>
                <!-- /.card-body -->
            </div>
            <!-- /.card -->
        </div>

        <div class="col-12">
            <button type="reset" class="btn btn-outline-secondary">Cancelar</button>
            <button type="button" id="sendDataBtn" class="btn btn-outline-success float-right">Guardar traslado</button>
        </div>

    </div>
@endsection

@section('plugins')
    <!-- Select2 -->
    <script src="{{ asset('admin/plugins/select2/js/select2.full.min.js') }}"></script>
    <script src="{{ asset('admin/plugins/bootstrap-switch/js/bootstrap-switch.min.js') }}"></script>
@endsection

@section('scripts')
    <script>
        $(function () {
            $('#tipo_venta').select2({
                placeholder: "Seleccione Tipo Venta",
                allowClear: true,
            });

        })
    </script>
    <script src="{{ asset('js/material/sendToStore.js') }}?v={{ time() }}"></script>
@endsection
