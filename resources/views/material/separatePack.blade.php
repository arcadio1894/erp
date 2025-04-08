@extends('layouts.appAdmin2')

@section('openMaterial')
    menu-open
@endsection

@section('activeMaterial')
    active
@endsection

@section('activeSeparatePackMaterial')
    active
@endsection

@section('title')
    Materiales
@endsection

@section('styles-plugins')
    <!-- Select2 -->
    <link rel="stylesheet" href="{{ asset('admin/plugins/select2/css/select2.min.css') }}">
    <link rel="stylesheet" href="{{ asset('admin/plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css') }}">
    <link rel="stylesheet" href="{{ asset('admin/plugins/bootstrap-datepicker/css/bootstrap-datepicker.css') }}">
    <link rel="stylesheet" href="{{ asset('admin/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css') }}">
    <link rel="stylesheet" href="{{ asset('admin/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.css') }}">
    <link rel="stylesheet" href="{{ asset('admin/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.standalone.css') }}">

@endsection

@section('styles')
    <style>
        .select2-search__field{
            width: 100% !important;
        }
        .letraTabla {
            font-family: "Calibri", Arial, sans-serif; /* Utiliza Calibri si está instalado, de lo contrario, usa Arial o una fuente sans-serif similar */
            font-size: 15px; /* Tamaño de fuente 11 */
        }
        .normal-title {
            background-color: #203764; /* Color deseado para el fondo */
            color: #fff; /* Color deseado para el texto */
            text-align: center;
        }
        .cliente-title {
            background-color: #FFC000; /* Color deseado para el fondo */
            color: #000; /* Color deseado para el texto */
            text-align: center;
        }
        .trabajo-title {
            background-color: #00B050; /* Color deseado para el fondo */
            color: #000; /* Color deseado para el texto */
            text-align: center;
        }
        .documentacion-title {
            background-color: #FFC000; /* Color deseado para el fondo */
            color: #000; /* Color deseado para el texto */
            text-align: center;
        }
        .importe-title {
            background-color: #00B050; /* Color deseado para el fondo */
            color: #000; /* Color deseado para el texto */
            text-align: center;
        }
        .facturacion-title {
            background-color: #FFC000; /* Color deseado para el fondo */
            color: #000; /* Color deseado para el texto */
            text-align: center;
        }
        .abono-title {
            background-color: #00B050; /* Color deseado para el fondo */
            color: #000; /* Color deseado para el texto */
            text-align: center;
        }
        .busqueda-avanzada {
            display: none;
        }

        #btnBusquedaAvanzada {
            display: inline-block;
            text-decoration: none;
            color: #007bff;
            border-bottom: 1px solid transparent;
            transition: border-bottom 0.3s ease;
        }
        #btnBusquedaAvanzada:hover {
            border-bottom: 2px solid #007bff;
        }
        .vertical-center {
            display: flex;
            align-items: center;
        }
        .datepicker-orient-top {
            top: 100px !important;
        }
    </style>
@endsection

@section('page-header')
    <h1 class="page-title">Materiales</h1>
@endsection

@section('page-title')
    <h5 class="card-title">Listado de materiales</h5>
    @can('create_material')
        <a href="{{ route('material.create') }}" class="btn btn-outline-success btn-sm float-right" > <i class="fa fa-plus font-20"></i> Nuevo material </a>
    @endcan
@endsection

@section('page-breadcrumb')
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item">
            <a href="{{ route('dashboard.principal') }}"><i class="fa fa-home"></i> Dashboard</a>
        </li>
        <li class="breadcrumb-item"><i class="fa fa-archive"></i> Materiales </li>
    </ol>
@endsection

@section('content')
    <input type="hidden" id="permissions" value="{{ json_encode($permissions) }}">
    <!--begin::Form-->
    <form action="#">
        <!--begin::Card-->
        <!--begin::Input group-->
        <div class="row">
            <div class="col-md-12">
                <!-- Barra de búsqueda -->
                <div class="input-group">
                    <input type="text" id="description" class="form-control" placeholder="Descripción del material..." autocomplete="off">
                    <div class="input-group-append ">
                        <button class="btn btn-primary" type="button" id="btn-search">Buscar</button>
                        <a href="#" id="btnBusquedaAvanzada" class="vertical-center ml-3 mt-2">Búsqueda Avanzada</a>
                    </div>
                </div>

                <!-- Sección de búsqueda avanzada (inicialmente oculta) -->
                <div class="mt-3 busqueda-avanzada">
                    <!-- Aquí coloca más campos de búsqueda avanzada -->
                    <div class="row">

                        <div class="col-md-3">
                            <label for="category">Categoría:</label>
                            <select id="category" class="form-control form-control-sm select2" style="width: 100%;">
                                <option value="">TODOS</option>
                                @for ($i=0; $i<count($arrayCategories); $i++)
                                    <option value="{{ $arrayCategories[$i]['id'] }}">{{ $arrayCategories[$i]['name'] }}</option>
                                @endfor
                            </select>
                        </div>

                        <div class="col-md-3">
                            <label for="subcategory">SubCategoría:</label>
                            <select id="subcategory" name="subcategory" class="form-control form-control-sm select2" style="width: 100%;">
                                <option value="">TODOS</option>

                            </select>
                        </div>

                        <div class="col-md-2">
                            <label for="material_type">Tipo:</label>
                            <select id="material_type" name="material_type" class="form-control form-control-sm select2" style="width: 100%;">
                                <option value="">TODOS</option>

                            </select>
                        </div>

                        <div class="col-md-2">
                            <label for="sub_type">SubTipo:</label>
                            <select id="sub_type" name="sub_type" class="form-control form-control-sm select2" style="width: 100%;">
                                <option value="">TODOS</option>

                            </select>
                        </div>
                        <div class="col-md-2">
                            <label for="rotation">Rotación:</label>
                            <select id="rotation" class="form-control form-control-sm select2" style="width: 100%;">
                                <option value="">TODOS</option>
                                @for ($i=0; $i<count($arrayRotations); $i++)
                                    <option value="{{ $arrayRotations[$i]['value'] }}">{{ $arrayRotations[$i]['display'] }}</option>
                                @endfor
                            </select>
                        </div>

                    </div>

                    <br>

                    <div class="row">
                        <div class="col-md-2">
                            <label for="cedula">Cédula:</label>
                            <select id="cedula" name="cedula" class="form-control form-control-sm select2" style="width: 100%;">
                                <option value="">TODOS</option>
                                @for ($i=0; $i<count($arrayCedulas); $i++)
                                    <option value="{{ $arrayCedulas[$i]['id'] }}">{{ $arrayCedulas[$i]['name'] }}</option>
                                @endfor
                            </select>
                        </div>
                        <div class="col-md-2">
                            <label for="calidad">Calidad:</label>
                            <select id="calidad" name="calidad" class="form-control form-control-sm select2" style="width: 100%;">
                                <option value="">TODOS</option>
                                @for ($i=0; $i<count($arrayCalidades); $i++)
                                    <option value="{{ $arrayCalidades[$i]['id'] }}">{{ $arrayCalidades[$i]['name'] }}</option>
                                @endfor
                            </select>
                        </div>
                        <div class="col-md-2">
                            <label for="marca">Marca:</label>
                            <select id="marca" name="marca" class="form-control form-control-sm select2" style="width: 100%;">
                                <option value="">TODOS</option>
                                @for ($i=0; $i<count($arrayMarcas); $i++)
                                    <option value="{{ $arrayMarcas[$i]['id'] }}">{{ $arrayMarcas[$i]['name'] }}</option>
                                @endfor
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label for="retaceria">Retacería:</label>
                            <select id="retaceria" name="retaceria" class="form-control form-control-sm select2" style="width: 100%;">
                                <option value="">TODOS</option>
                                @for ($i=0; $i<count($arrayRetacerias); $i++)
                                    <option value="{{ $arrayRetacerias[$i]['id'] }}">{{ $arrayRetacerias[$i]['name'] }}</option>
                                @endfor
                            </select>
                        </div>

                        <div class="col-md-3">
                            <label for="quote">Código:</label>
                            <input type="text" id="code" class="form-control form-control-sm" placeholder="791" autocomplete="off">

                        </div>
                    </div>

                    <br>

                    <!-- Añade más campos según lo necesario -->
                </div>
            </div>
        </div>
        <!--end::Input group-->
        <!--begin:Action-->
        {{--<div class="col-md-1">
            <label for="btn-search">&nbsp;</label><br>
            <button type="button" id="btn-search" class="btn btn-primary me-5">Buscar</button>
        </div>--}}

    </form>
    <!--end::Form-->

    <div class="row mt-3">
        <div class="col-md-2 custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
            <input type="checkbox" checked data-column="codigo" class="custom-control-input" id="customSwitch1">
            <label class="custom-control-label" for="customSwitch1">Código</label>
        </div>
        <div class="col-md-2 custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
            <input type="checkbox" checked data-column="descripcion" class="custom-control-input" id="customSwitch2">
            <label class="custom-control-label" for="customSwitch2">Descripcion</label>
        </div>
        <div class="col-md-2 custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
            <input type="checkbox" data-column="medida" class="custom-control-input" id="customSwitch3">
            <label class="custom-control-label" for="customSwitch3">Medida</label>
        </div>
        <div class="col-md-2 custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
            <input type="checkbox" checked data-column="unidad_medida" class="custom-control-input" id="customSwitch4">
            <label class="custom-control-label" for="customSwitch4">Unidad Medida</label>
        </div>
        <div class="col-md-2 custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
            <input type="checkbox" data-column="stock_max" class="custom-control-input" id="customSwitch5">
            <label class="custom-control-label" for="customSwitch5">Stock Max</label>
        </div>
        <div class="col-md-2 custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
            <input type="checkbox" data-column="stock_min" class="custom-control-input" id="customSwitch6">
            <label class="custom-control-label" for="customSwitch6">Stock Min</label>
        </div>
        <div class="col-md-2 custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
            <input type="checkbox" checked data-column="stock_actual" class="custom-control-input" id="customSwitch7">
            <label class="custom-control-label" for="customSwitch7">Stock Actual</label>
        </div>
        <div class="col-md-2 custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
            <input type="checkbox" checked data-column="prioridad" class="custom-control-input" id="customSwitch8">
            <label class="custom-control-label" for="customSwitch8">Prioridad</label>
        </div>
        <div class="col-md-2 custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
            <input type="checkbox" checked data-column="precio_unitario" class="custom-control-input" id="customSwitch9">
            <label class="custom-control-label" for="customSwitch9">Precio</label>
        </div>
        <div class="col-md-2 custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
            <input type="checkbox" checked data-column="categoria" class="custom-control-input" id="customSwitch11">
            <label class="custom-control-label" for="customSwitch11">Categoría</label>
        </div>
        <div class="col-md-2 custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
            <input type="checkbox" checked data-column="sub_categoria" class="custom-control-input" id="customSwitch12">
            <label class="custom-control-label" for="customSwitch12">SubCategoría</label>
        </div>
        <div class="col-md-2 custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
            <input type="checkbox" data-column="tipo" class="custom-control-input" id="customSwitch13">
            <label class="custom-control-label" for="customSwitch13">Tipo</label>
        </div>
        <div class="col-md-2 custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
            <input type="checkbox" data-column="sub_tipo" class="custom-control-input" id="customSwitch14">
            <label class="custom-control-label" for="customSwitch14">SubTipo</label>
        </div>
        <div class="col-md-2 custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
            <input type="checkbox" data-column="cedula" class="custom-control-input" id="customSwitch15">
            <label class="custom-control-label" for="customSwitch15">Cédula</label>
        </div>
        <div class="col-md-2 custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
            <input type="checkbox" data-column="calidad" class="custom-control-input" id="customSwitch16">
            <label class="custom-control-label" for="customSwitch16">Calidad</label>
        </div>
        <div class="col-md-2 custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
            <input type="checkbox" data-column="marca" class="custom-control-input" id="customSwitch17">
            <label class="custom-control-label" for="customSwitch17">Marca</label>
        </div>
        <div class="col-md-2 custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
            <input type="checkbox" data-column="modelo" class="custom-control-input" id="customSwitch18">
            <label class="custom-control-label" for="customSwitch18">Modelo</label>
        </div>
        <div class="col-md-2 custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
            <input type="checkbox" data-column="retaceria" class="custom-control-input" id="customSwitch19">
            <label class="custom-control-label" for="customSwitch19">Retacería</label>
        </div>
        <div class="col-md-2 custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
            <input type="checkbox" checked data-column="imagen" class="custom-control-input" id="customSwitch20">
            <label class="custom-control-label" for="customSwitch20">Imagen</label>
        </div>
        <div class="col-md-2 custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
            <input type="checkbox" checked data-column="rotation" class="custom-control-input" id="customSwitch21">
            <label class="custom-control-label" for="customSwitch21">Rotación</label>
        </div>
    </div>

    <!--begin::Toolbar-->
    <div class="d-flex flex-wrap flex-stack pb-7">
        <!--begin::Title-->
        <div class="d-flex flex-wrap align-items-center my-1">
            <h3 class="fw-bolder me-5 my-1"><span id="numberItems"></span> Materiales
                <span class="text-gray-400 fs-6">por fecha de creación ↓ </span>
            </h3>
        </div>
        <!--end::Title-->
    </div>
    <!--end::Toolbar-->

    <!--begin::Tab Content-->
    <div class="tab-content">
        <!--begin::Tab pane-->
        <hr>
        <div class="table-responsive">
            <table class="table table-bordered letraTabla table-hover table-sm mb-5">
                <thead id="header-table">
                {{--<tr class="normal-title">
                    <th>Código</th>
                    <th>Descripcion</th>
                    <th>Medida</th>
                    <th>Unidad Medida</th>
                    <th>Stock Max</th>
                    <th>Stock Min</th>
                    <th>Stock Actual</th>
                    <th>Prioridad</th>
                    <th>Precio Unitario</th>
                    <th>Categoría</th>
                    <th>SubCategoría</th>
                    <th>Tipo</th>
                    <th>SubTipo</th>
                    <th>Cédula</th>
                    <th>Calidad</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Retacería</th>
                    <th></th>
                </tr>--}}
                </thead>
                <tbody id="body-table">

                </tbody>
            </table>
        </div>
        <!--end::Tab pane-->
        <!--begin::Pagination-->
        <div class="d-flex flex-stack flex-wrap pt-1">
            <div class="fs-6 fw-bold text-gray-700" id="textPagination"></div>
            <!--begin::Pages-->
            <ul class="pagination" style="margin-left: auto;" id="pagination">

            </ul>
            <!--end::Pages-->
        </div>
        <!--end::Pagination-->
    </div>
    <!--end::Tab Content-->

    <template id="item-header">
        <tr class="normal-title">
            <th data-column="codigo" data-codigo>Código</th>
            <th data-column="descripcion" data-descripcion>Descripcion</th>
            <th data-column="medida" data-medida>Medida</th>
            <th data-column="unidad_medida" data-unidad_medida>Unidad Medida</th>
            <th data-column="stock_max" data-stock_max>Stock Max</th>
            <th data-column="stock_min" data-stock_min>Stock Min</th>
            <th data-column="stock_actual" data-stock_actual>Stock Actual</th>
            <th data-column="prioridad" data-prioridad>Prioridad</th>
            <th data-column="precio_unitario" data-precio_unitario>Precio Unitario</th>
            <th data-column="categoria" data-categoria>Categoría</th>
            <th data-column="sub_categoria" data-sub_categoria>SubCategoría</th>
            <th data-column="tipo" data-tipo>Tipo</th>
            <th data-column="sub_tipo" data-sub_tipo>SubTipo</th>
            <th data-column="cedula" data-cedula>Cédula</th>
            <th data-column="calidad" data-calidad>Calidad</th>
            <th data-column="marca" data-marca>Marca</th>
            <th data-column="modelo" data-modelo>Modelo</th>
            <th data-column="retaceria" data-retaceria>Retacería</th>
            <th data-column="imagen" data-imagen>Imagen</th>
            <th data-column="rotation" data-rotation>Rotación</th>
            <th></th>
        </tr>
    </template>

    <template id="previous-page">
        <li class="page-item previous">
            <a href="#" class="page-link" data-item>
                <!--<i class="previous"></i>-->
                <i class="fas fa-chevron-left"></i>
            </a>
        </li>
    </template>

    <template id="item-page">
        <li class="page-item" data-active>
            <a href="#" class="page-link" data-item="">5</a>
        </li>
    </template>

    <template id="next-page">
        <li class="page-item next">
            <a href="#" class="page-link" data-item>
                <!--<i class="next"></i>-->
                <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    </template>

    <template id="disabled-page">
        <li class="page-item disabled">
            <span class="page-link">...</span>
        </li>
    </template>

    <template id="item-table">
        <tr>
            <td data-column="codigo" data-codigo></td>
            <td data-column="descripcion" data-descripcion></td>
            <td data-column="medida" data-medida></td>
            <td data-column="unidad_medida" data-unidad_medida></td>
            <td data-column="stock_max" data-stock_max></td>
            <td data-column="stock_min" data-stock_min></td>
            <td data-column="stock_actual" data-stock_actual></td>
            <td data-column="prioridad" data-prioridad></td>
            <td data-column="precio_unitario" data-precio_unitario></td>
            <td data-column="categoria" data-categoria></td>
            <td data-column="sub_categoria" data-sub_categoria></td>
            <td data-column="tipo" data-tipo></td>
            <td data-column="sub_tipo" data-sub_tipo></td>
            <td data-column="cedula" data-cedula></td>
            <td data-column="calidad" data-calidad></td>
            <td data-column="marca" data-marca></td>
            <td data-column="modelo" data-modelo></td>
            <td data-column="retaceria" data-retaceria></td>
            <td data-column="imagen" data-imagen>
                <button data-ver_imagen data-src="{{--'+document.location.origin+ '/images/material/'+item.image+'--}}" data-image="{{--'+item.id+'--}}" class="btn btn-outline-primary btn-sm" data-toggle="tooltip" data-placement="top" title="Ver Imagen"><i class="fa fa-image"></i></button>
            </td>
            <td data-column="rotation" data-rotation></td>
            <td>
                <button data-separate data-material="" data-quantity data-description="" data-measure="" class="btn btn-outline-primary btn-sm" data-toggle="tooltip" data-placement="top" title="Separar Paquete"><i class="far fa-object-ungroup"></i></button>
                <button data-assign_child data-material="" data-description="" class="btn btn-outline-success btn-sm" data-toggle="tooltip" data-placement="top" title="Asignar Hijos"><i class="fas fa-boxes"></i></button>
            </td>
        </tr>
    </template>

    <template id="item-table-empty">
        <tr>
            <td colspan="20" align="center">No se ha encontrado ningún dato</td>
        </tr>
    </template>

    <div id="modalAssignChild" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Asignar Productos Hijos</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <form id="formAssignChild" data-url="{{--{{ route('save.assign.child') }}--}}">
                    @csrf
                    <div class="modal-body">
                        <input type="hidden" id="material_id" name="material_id">
                        <strong id="name_material"></strong>
                        <br>
                        <p>Listado de productos hijos</p>

                        <div class="row">
                            <div class="col-md-10">
                                <div class="form-group">
                                    <label for="material">Seleccione el material <span class="right badge badge-danger">(*)</span></label>
                                    <select id="material" name="material" class="form-control select2" style="width: 100%;">
                                        <option></option>
                                        @for( $i=0; $i<count($arrayMaterials); $i++ )
                                            <option value="{{ $arrayMaterials[$i]['id'] }}">{{ $arrayMaterials[$i]['full_name'] }}</option>
                                        @endfor
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-group">
                                    <label for="material">&nbsp;&nbsp;&nbsp;&nbsp;</label><br>
                                    <button type="button" class="btn btn-outline-success" id="btn-submitAssignChild"><i class="fas fa-plus"></i></button>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-12">
                                <div class="table-responsive">
                                    <table class="table">
                                        <thead class="thead-dark">
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Producto</th>
                                            <th scope="col"></th>
                                        </tr>
                                        </thead>
                                        <tbody id="body-childs">
                                        <tr>
                                            <th scope="row">1</th>
                                            <td>Mark</td>
                                            <td>
                                                <button type="button" class="btn btn-outline-danger btn-block"><i class="fas fa-trash-alt"></i></button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">2</th>
                                            <td>Jacob</td>
                                            <td>
                                                <button type="button" class="btn btn-outline-danger btn-block"><i class="fas fa-trash-alt"></i></button>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div id="modalSeparate" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Confirmar separación</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <form id="formSeparate" data-url="{{ route('save.separate.pack') }}">
                    @csrf
                    <div class="modal-body">
                        <input type="hidden" id="material_id" name="material_id">
                        <strong id="name_material"></strong>
                        <br>
                        <p>¿Cuántos paquetes necesitas separar</p>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="stock_max">Cantidad Total </label>
                                    <input type="number" id="packs_total" name="packs_total" class="form-control" placeholder="0.00" min="0" value="0" step="1" readonly>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="stock_max">Cantidad a separar <span class="right badge badge-danger">(*)</span></label>
                                    <input type="number" id="packs_separate" name="packs_separate" class="form-control" placeholder="0.00" min="0" value="0" step="1">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="materialChild">Seleccione el material <span class="right badge badge-danger">(*)</span></label>
                                    <select id="materialChild" name="materialChild" class="form-control select2" style="width: 100%;">
                                        <option></option>
                                        @for( $i=0; $i<count($arrayMaterials); $i++ )
                                            <option value="{{ $arrayMaterials[$i]['id'] }}">{{ $arrayMaterials[$i]['full_name'] }}</option>
                                        @endfor
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                        <button type="button" id="btn-submitSeparate" class="btn btn-success">Separar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div id="modalImage" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Visualización de la imagen</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <div class="modal-body">
                    <img id="image-document" src="" alt="" width="80%">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('plugins')
    <!-- Datatables -->
    <script src="{{ asset('admin/plugins/datatables/jquery.dataTables.min.js') }}"></script>
    <script src="{{ asset('admin/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js') }}"></script>
    <script src="{{ asset('admin/plugins/datatables-responsive/js/dataTables.responsive.min.js') }}"></script>
    <script src="{{ asset('admin/plugins/datatables-responsive/js/responsive.bootstrap4.min.js') }}"></script>
    <!-- Select2 -->
    <script src="{{ asset('admin/plugins/select2/js/select2.full.min.js') }}"></script>

    <script src="{{ asset('admin/plugins/moment/moment.min.js') }}"></script>

    <script src="{{ asset('admin/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js') }}"></script>
    <script src="{{ asset('admin/plugins/bootstrap-datepicker/locales/bootstrap-datepicker.es.min.js') }}"></script>
    <script src="{{ asset('admin/plugins/inputmask/min/jquery.inputmask.bundle.min.js') }}"></script>
@endsection

@section('scripts')
    <script>
        $(function () {
            //Initialize Select2 Elements
            $('#retaceria').select2({
                placeholder: "Selecione Retacería",
                allowClear: true
            });

            $('#marca').select2({
                placeholder: "Selecione Marca",
                allowClear: true
            });

            $('#calidad').select2({
                placeholder: "Selecione Calidad",
                allowClear: true
            });

            $('#cedula').select2({
                placeholder: "Seleccione Cedula",
                allowClear: true
            });

            $('#category').select2({
                placeholder: "Seleccione Categoría",
                allowClear: true
            });

            $('#subcategory').select2({
                placeholder: "Seleccione SubCategoría",
                allowClear: true
            });

            $('#material_type').select2({
                placeholder: "Seleccione Tipo",
                allowClear: true
            });

            $('#sub_type').select2({
                placeholder: "Seleccione SubTipo",
                allowClear: true
            });

            $('#rotation').select2({
                placeholder: "Seleccione Rotación",
                allowClear: true
            });

            $('#material').select2({
                placeholder: "Seleccione material",
                allowClear: true
            });


        })
    </script>
    <script src="{{ asset('js/material/separatePack.js') }}"></script>

@endsection