@extends('layouts.appAdmin2')

@section('openPuntoVenta')
    menu-open
@endsection

@section('activePuntoVenta')
    active
@endsection

@section('activeCreatePuntoVenta')
    active
@endsection

@section('title')
    Punto de Venta
@endsection

@section('styles-plugins')
    <link rel="stylesheet" href="{{ asset('admin/plugins/select2/css/select2.min.css') }}">
    <link rel="stylesheet" href="{{ asset('admin/plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css') }}">
    <link rel="stylesheet" href="{{ asset('admin/plugins/typehead/typeahead.css') }}">
    <link rel="stylesheet" href="{{ asset('admin/plugins/icheck-bootstrap/icheck-bootstrap.min.css') }}">
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
        .section-products {
            padding: 80px 0 54px;
        }

        .product-grid{
            background-color: #fff;
            font-family: 'Work Sans', sans-serif;
            text-align: center;
            transition: all 0.3s ease 0s;
        }
        .product-grid:hover{
            box-shadow:  0 0 20px -10px rgba(237,29,36,0.3);
        }
        .product-grid .product-image{
            overflow: hidden;
            position: relative;
            transition: all 0.3s ease 0s;
        }
        .product-grid:hover .product-image{ border-radius: 0 0 30px 30px; }
        .product-grid .product-image a.image{ display: block; }
        .product-grid .product-image img{
            width: 100%;
            height: auto;
        }
        .product-image .pic-1{
            backface-visibility: hidden;
            transition: all 0.5s ease 0s;
        }
        .product-grid:hover .product-image .pic-1{ opacity: 0; }
        .product-image .pic-2{
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            opacity: 0;
            position: absolute;
            top: 0;
            left: 0;
            transition: all 0.5s ease 0s;
        }
        .product-grid:hover .product-image .pic-2{ opacity: 1; }
        .product-grid .product-links{
            padding: 0;
            margin: 0;
            list-style: none;
            opacity: 0;
            position: absolute;
            bottom: 0;
            right: 10px;
            transition: all 0.3s ease 0s;
        }
        .product-grid:hover .product-links{ opacity: 1; }
        .product-grid .product-links li{
            margin: 0 0 10px 0;
            transform: rotate(360deg) scale(0);
            transition: all 0.3s ease 0s;
        }
        .product-grid:hover .product-links li{ transform: rotate(0) scale(1); }
        .product-grid:hover .product-links li:nth-child(3){ transition-delay: 0.1s; }
        .product-grid:hover .product-links li:nth-child(2){ transition-delay: 0.2s; }
        .product-grid:hover .product-links li:nth-child(1){ transition-delay: 0.3s; }
        .product-grid .product-links li a{
            color: #666;
            background-color: #fff;
            font-size: 18px;
            line-height: 42px;
            width: 40px;
            height: 40px;
            border-radius: 50px;
            display: block;
            transition: all 0.3s ease 0s;
        }
        .product-grid .product-links li a:hover{
            color: #fff;
            background-color: #ed1d24;
        }
        .product-grid .product-content{
            text-align: left;
            padding: 15px 10px;
        }
        .product-grid .rating{
            padding: 0;
            margin: 0 0 7px;
            list-style: none;
        }
        .product-grid .rating li{
            color: #f7bc3d;
            font-size: 13px;
        }
        .product-grid .rating li.far{ color: #777; }
        .product-grid .title{
            font-size: 16px;
            font-weight: 600;
            text-transform: capitalize;
            margin: 0 0 6px;
        }
        .product-grid .title a{
            color: #555;
            transition: all 0.3s ease 0s;
        }
        .product-grid .title a:hover{ color: #ed1d24; }
        .product-grid .price{
            color: #ed1d24;
            font-size: 18px;
            font-weight: 700;
        }
        @media screen and (max-width:990px){
            .product-grid{ margin: 0 0 30px; }
        }

        @media (min-width: 1025px) {
            .h-custom {
                height: 100vh !important;
            }
        }

        .number-input input[type="number"] {
            -webkit-appearance: textfield;
            -moz-appearance: textfield;
            appearance: textfield;
        }

        .number-input input[type=number]::-webkit-inner-spin-button,
        .number-input input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none;
        }

        .number-input button {
            -webkit-appearance: none;
            background-color: transparent;
            border: none;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            margin: 0;
            position: relative;
        }

        .number-input button:before,
        .number-input button:after {
            display: inline-block;
            position: absolute;
            content: '';
            height: 2px;
            transform: translate(-50%, -50%);
        }

        .number-input button.plus:after {
            transform: translate(-50%, -50%) rotate(90deg);
        }

        .number-input input[type=number] {
            text-align: center;
        }

        .number-input.number-input {
            border: 1px solid #ced4da;
            width: 10rem;
            border-radius: .25rem;
        }

        .number-input.number-input button {
            width: 2.6rem;
            height: .7rem;
        }

        .number-input.number-input button.minus {
            padding-left: 10px;
        }

        .number-input.number-input button:before,
        .number-input.number-input button:after {
            width: .7rem;
            background-color: #495057;
        }

        .number-input.number-input input[type=number] {
            max-width: 4rem;
            padding: .5rem;
            border: 1px solid #ced4da;
            border-width: 0 1px;
            font-size: 1rem;
            height: 2rem;
            color: #495057;
        }

        @media not all and (min-resolution:.001dpcm) {
            @supports (-webkit-appearance: none) and (stroke-color:transparent) {

                .number-input.def-number-input.safari_only button:before,
                .number-input.def-number-input.safari_only button:after {
                    margin-top: -.3rem;
                }
            }
        }

        .shopping-cart .def-number-input.number-input {
            border: none;
        }

        .shopping-cart .def-number-input.number-input input[type=number] {
            max-width: 8rem;
            border: none;
        }

        .shopping-cart .def-number-input.number-input input[type=number].black-text,
        .shopping-cart .def-number-input.number-input input.btn.btn-link[type=number],
        .shopping-cart .def-number-input.number-input input.md-toast-close-button[type=number]:hover,
        .shopping-cart .def-number-input.number-input input.md-toast-close-button[type=number]:focus {
            color: #212529 !important;
        }

        .shopping-cart .def-number-input.number-input button {
            width: 1rem;
        }

        .shopping-cart .def-number-input.number-input button:before,
        .shopping-cart .def-number-input.number-input button:after {
            width: .5rem;
        }

        .shopping-cart .def-number-input.number-input button.minus:before,
        .shopping-cart .def-number-input.number-input button.minus:after {
            background-color: #9e9e9e;
        }

        .shopping-cart .def-number-input.number-input button.plus:before,
        .shopping-cart .def-number-input.number-input button.plus:after {
            background-color: #4285f4;
        }

        .large-input {
            width: 100px; /* Ajusta el valor según sea necesario */
            text-align: center; /* Centra el texto en el input */
        }

        .details {
            border: 1.5px solid grey;
            color: #212121;
            width: 100%;
            height: auto;
            box-shadow: 0px 0px 10px #212121;
        }

        .cart {
            background-color: #212121;
            color: white;
            margin-top: 10px;
            font-size: 12px;
            font-weight: 900;
            width: 100%;
            height: 39px;
            padding-top: 9px;
            box-shadow: 0px 5px 10px  #212121;
        }

        .card2 {
            width: fit-content;
        }

        .card-body2 {
            width: fit-content;
        }

        .btn2 {
            border-radius: 0;
        }

        .img-thumbnail2 {
            border: none;
        }

        .card2 {
            box-shadow: 0 20px 40px rgba(0, 0, 0, .2);
            border-radius: 5px;
            padding-bottom: 10px;
        }

        .product-card {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
        }

        .product-image {
            max-height: 150px; /* Ajusta según sea necesario */
            object-fit: contain;
            margin-bottom: 15px;
        }

        .cvp {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .product-title {
            height: 80px; /* Altura fija para el título */
            overflow: hidden; /* Ocultar el texto que sobrepasa el límite */
            text-overflow: ellipsis; /* Añadir puntos suspensivos si el texto es demasiado largo */
            display: -webkit-box;
            -webkit-line-clamp: 2; /* Mostrar un máximo de 2 líneas */
            -webkit-box-orient: vertical;
        }

        .product-price {
            margin-bottom: 15px;
        }

        .btn.cart:hover {
            color: #007bff; /* Cambia este valor al color que prefieras */
        }

    </style>
@endsection

@section('page-header')
    <h1 class="page-title">Punto de Venta</h1>
@endsection

@section('page-title')
    <h5 class="card-title">Crear nueva venta</h5>
@endsection

@section('page-breadcrumb')
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item">
            <a href="{{ route('dashboard.principal') }}"><i class="fa fa-home"></i> Dashboard</a>
        </li>
        <li class="breadcrumb-item">
            <a href="{{ route('entry.purchase.index') }}"><i class="fa fa-archive"></i> Punto de venta</a>
        </li>
        <li class="breadcrumb-item"><i class="fa fa-plus-circle"></i> Nueva venta</li>
    </ol>
@endsection

@section('content')
    <form id="formCreate" class="form-horizontal" data-url="{{ route('puntoVenta.store') }}" enctype="multipart/form-data">
        @csrf
        <div class="row">
            <div class="col-md-4">
                <div class="card card-success">
                    <div class="card-header">
                        <h3 class="card-title">Productos Seleccionados</h3>

                        <div class="card-tools">
                            <button type="button" class="btn btn-tool" data-card-widget="collapse" data-toggle="tooltip" title="Collapse">
                                <i class="fas fa-minus"></i></button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="shopping-cart">
                            <div class="row">
                                <div class="col-lg-12 px-1 py-1">
                                    <div id="body-cart">

                                    </div>

                                    <hr class="mb-4" style="height: 2px; background-color: #1266f1; opacity: 1;">

                                    <div class="d-flex justify-content-between px-x">
                                        <p class="fw-bold">OP. EXONERADA:</p>
                                        <p class="fw-bold" id="op_exonerada">0.00</p>
                                    </div>
                                    <div class="d-flex justify-content-between px-x">
                                        <p class="fw-bold">OP. INAFECTA</p>
                                        <p class="fw-bold" id="op_inafecta">0.00</p>
                                    </div>
                                    <div class="d-flex justify-content-between px-x">
                                        <p class="fw-bold">OP. GRAVADA:</p>
                                        <p class="fw-bold" id="op_gravada">0.00</p>
                                    </div>
                                    <div class="d-flex justify-content-between px-x">
                                        <p class="fw-bold">I.G.V.:</p>
                                        <p class="fw-bold" id="total_igv">0.00</p>
                                    </div>
                                    <div class="d-flex justify-content-between px-x">
                                        <p class="fw-bold">TOTAL DESCUENTOS:</p>
                                        <p class="fw-bold" id="total_descuentos">0.00</p>
                                    </div>
                                    <div class="d-flex justify-content-between p-2 mb-2 bg-primary">
                                        <h5 class="fw-bold mb-0">IMPORTE TOTAL:</h5>
                                        <h5 class="fw-bold mb-0" id="total_importe">0.00</h5>
                                    </div>

                                </div>
                                <div class="col-md-12 px-1 py-1">

                                    <div data-mdb-input-init class="form-outline mb-1">
                                        @foreach( $tipoPagos as $tipoPago )
                                            <div class="form-group clearfix">
                                                <div class="icheck-primary d-inline">
                                                    <input type="radio" data-vuelto="{{$tipoPago->vuelto}}" name="tipo_pago" value="{{$tipoPago->id}}" id="checkboxPrimary{{$tipoPago->id}}">
                                                    <label for="checkboxPrimary{{$tipoPago->id}}">
                                                        {{$tipoPago->description}}
                                                    </label>
                                                </div>
                                            </div>
                                        @endforeach
                                    </div>

                                    <button  type="button" id="btn-pay" class="btn btn-success btn-block btn-lg">PAGAR</button>

                                    <a href="#" target="_blank" id="btn-printDocument" class="btn btn-primary btn-block btn-lg">IMPRIMIR COMPROBANTE</a>

                                    <button  type="button" id="btn-newSale" class="btn btn-warning btn-block btn-lg">NUEVA VENTA</button>

                                </div>
                                {{--<div class="col-md-12 px-5 py-4">

                                    <h3 class="mb-5 pt-2 text-center fw-bold text-uppercase">Payment</h3>

                                    <form class="mb-5">

                                        <div data-mdb-input-init class="form-outline mb-5">
                                            <input type="text" id="typeText" class="form-control form-control-lg" size="17"
                                                   value="1234 5678 9012 3457" minlength="19" maxlength="19" />
                                            <label class="form-label" for="typeText">Card Number</label>
                                        </div>

                                        <div data-mdb-input-init class="form-outline mb-5">
                                            <input type="text" id="typeName" class="form-control form-control-lg" size="17"
                                                   value="John Smith" />
                                            <label class="form-label" for="typeName">Name on card</label>
                                        </div>

                                        <div class="row">
                                            <div class="col-md-6 mb-5">
                                                <div data-mdb-input-init class="form-outline">
                                                    <input type="text" id="typeExp" class="form-control form-control-lg" value="01/22"
                                                           size="7" minlength="7" maxlength="7" />
                                                    <label class="form-label" for="typeExp">Expiration</label>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-5">
                                                <div data-mdb-input-init class="form-outline">
                                                    <input type="password" id="typeText2" class="form-control form-control-lg"
                                                           value="&#9679;&#9679;&#9679;" size="1" minlength="3" maxlength="3" />
                                                    <label class="form-label" for="typeText2">Cvv</label>
                                                </div>
                                            </div>
                                        </div>

                                        <p class="mb-5">Lorem ipsum dolor sit amet consectetur, adipisicing elit <a
                                                    href="#!">obcaecati sapiente</a>.</p>

                                        <button  type="button" data-mdb-button-init data-mdb-ripple-init class="btn btn-primary btn-block btn-lg">Buy now</button>

                                        <h5 class="fw-bold mb-5" style="position: absolute; bottom: 0;">
                                            <a href="#!"><i class="fas fa-angle-left me-2"></i>Back to shopping</a>
                                        </h5>

                                    </form>

                                </div>--}}
                            </div>
                        </div>

                    </div>
                    <!-- /.card-body -->
                </div>
                <!-- /.card -->
            </div>
            <div class="col-md-8">
                <div class="card card-warning">
                    <div class="card-header">
                        <h3 class="card-title">Listado de Productos</h3>

                        <div class="card-tools">
                            <button type="button" class="btn btn-tool" data-card-widget="collapse" data-toggle="tooltip" title="Collapse">
                                <i class="fas fa-minus"></i></button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-4">
                                <select id="category_id" class="form-control select2" name="category_id" data-states style="width: 100%;">
                                    <option></option>
                                    @foreach( $categories as $category )
                                        <option value="{{ $category->id }}">{{ $category->name }}</option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="col-md-2 offset-sm-2">
                                <select id="type_id" class="form-control select2" name="type_id" data-states style="width: 100%;">
                                    <option></option>
                                    <option value="c" selected>Celdas</option>
                                    <option value="f">Filas</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <div class="input-group">
                                    <input type="text" class="form-control" id="product_search" placeholder="Buscar productos">
                                    <div class="input-group-append">
                                        <button type="button" id="btn_search" class="btn btn-primary">
                                            <i class="fas fa-search"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="d-flex flex-wrap align-items-center mb-4">
                                <h5 class="fw-bold me-5 my-1"><span id="numberItems"></span> Productos encontrados</h5>
                            </div>
                        </div>

                        <div class="row" id="body-card">
                        </div>

                        <div class="d-flex justify-content-between align-items-center">
                            <div class="fs-6 fw-bold text-gray-700" id="textPagination"></div>
                            <ul class="pagination" id="pagination"></ul>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        {{--<div class="row">
            <div class="col-12">
                <button type="reset" class="btn btn-outline-secondary">Cancelar</button>
                <button type="submit" id="btn-submit" class="btn btn-outline-success float-right">Guardar venta</button>
            </div>
        </div>--}}
        <!-- /.card-footer -->
    </form>

    <div id="modalVuelto" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Ingrese el monto</h4>
                </div>

                <div class="modal-body">
                    <div class="form-group row">
                        <div class="col-md-6">
                            <label for="monto_total">Monto Total</label>
                            <input type="number" min="0" class="form-control" id="monto_total" readonly>
                        </div>
                        <div class="col-md-6">
                            <label for="importe_total">Importe</label>
                            <input type="number" min="0" class="form-control" id="importe_total">
                        </div>
                    </div>

                    <div class="form-group row">
                        <div class="col-md-6 ">
                            <label for="vuelto">Vuelto</label>
                            <input type="number" min="0" class="form-control" id="vuelto" readonly>
                        </div>
                        <div class="col-md-6 ">
                            <label for="vuelto">Caja</label>
                            <select id="type_caja" class="form-control select2" name="type_caja" data-states style="width: 100%;">
                                <option></option>
                                <option value="efectivo" selected>Efectivo</option>
                                <option value="yape">Yape</option>
                                <option value="plin">Plin</option>
                                <option value="bancario">Bancario</option>
                            </select>
                        </div>
                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="btn-notSave">Cancelar</button>
                    <button type="button" id="btn-save" class="btn btn-success">Guardar</button>
                </div>
            </div>
        </div>
    </div>

    <div id="modalQuantity" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Ingrese cantidad</h4>
                </div>

                <input type="hidden" id="quantity_productId">
                <input type="hidden" id="quantity_productPrice">
                <input type="hidden" id="quantity_productName">
                <input type="hidden" id="quantity_productUnit">
                <input type="hidden" id="quantity_productTax">
                <input type="hidden" id="quantity_productType">

                <div class="modal-body">
                    <div class="form-group row">
                        <div class="col-md-6">
                            <label for="quantity_total">Cantidad</label>
                            <input type="number" min="0" class="form-control" id="quantity_total">
                        </div>
                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="btn-notAddProduct">Cancelar</button>
                    <button type="button" id="btn-add_product" class="btn btn-success">Agregar</button>
                </div>
            </div>
        </div>
    </div>

    <template id="item-cart">
        <div class="d-flex align-items-center mb-3 w-100">
            <div class="flex-grow-1 ms-3">
                <a href="#!" class="float-right" data-delete><i class="fas fa-times"></i></a>
                <h5 class="text-primary" data-name>Samsung Galaxy M11 64GB</h5>
                <h6 style="color: #9e9e9e;" data-price></h6>
                <div class="d-flex align-items-center justify-content-between w-100">

                    <div class="def-number-input number-input safari_only">
                        <button type="button" data-mdb-button-init onclick="decrementQuantity(this)" data-product_id_minus class="minus"></button>
                        <input class="quantity fw-bold bg-body-tertiary text-body large-input" data-quantity min="0" name="quantity" type="number" step="0.01">
                        <button type="button" data-mdb-button-init onclick="incrementQuantity(this)" data-product_id_plus class="plus"></button>
                    </div>
                    <p class="fw-bold mb-0 me-5 pe-3" data-priceTotal>799$</p>
                </div>
                <div class="align-items-center justify-content-between">
                    <h6 class="text-success" data-discount></h6>
                </div>
                {{--<h6 class="text-success" data-discount></h6>--}}
                <hr class="mb-4" style="height: 0.8px; background-color: #9e9e9e; opacity: 1;">
            </div>
        </div>
    </template>

    <template id="item-card">
        <div class="card mx-auto col-md-3 col-10 mt-1 product-card">
            <img class='mx-auto img-thumbnail product-image'
                 data-image1
                 width="auto" height="auto"/>
            <div class="card-body2 text-center mx-auto">
                <div class='cvp'>
                    <h5 class="card-title font-weight-bold product-title" data-name>Yail wrist watch</h5>
                    <p class="card-text product-price" data-price>$299</p>
                    <a href="#" class="btn details px-auto" data-add_cart_special data-product_id data-product_price data-product_name data-product_unit data-product_tax data-product_type>ADD SPECIAL</a>
                    <a href="#" class="btn cart px-auto" data-add_cart data-product_id data-product_price data-product_name data-product_unit data-product_tax>ADD TO CART</a>
                </div>
            </div>
        </div>
    </template>

    <template id="item-card-empty">
        <div class="col-md-12 col-sm-12">
            No se ha encontrado ningún producto
        </div>
    </template>

    <template id="previous-page">
        <li class="page-item previous">
            <a href="#" class="page-link" data-item><
                <i class="previous"></i>
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
            <a href="#" class="page-link" data-item>>
                <i class="next"></i>
            </a>
        </li>
    </template>

    <template id="disabled-page">
        <li class="page-item disabled">
            <span class="page-link">...</span>
        </li>
    </template>

    <template id="item-table">
        <table class="table table-striped">
            <thead>
            <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody id="table-body">
            <tr data-row>
                <td>
                    <img class="img-thumbnail product-image" data-image1 width="50" height="50"/>
                </td>
                <td class="product-title" data-name>Yail wrist watch</td>
                <td class="product-price" data-price>$299</td>
                <td>
                    <a href="#" class="btn details btn-sm"
                       data-add_cart_special data-product_id data-product_price
                       data-product_name data-product_unit data-product_tax data-product_type>
                        ADD SPECIAL
                    </a>
                    <a href="#" class="btn cart btn-sm btn-primary"
                       data-add_cart data-product_id data-product_price
                       data-product_name data-product_unit data-product_tax>
                        ADD TO CART
                    </a>
                </td>
            </tr>
            </tbody>
        </table>
    </template>
@endsection

@section('plugins')
    <!-- Select2 -->
    <script src="{{ asset('admin/plugins/select2/js/select2.full.min.js') }}"></script>
    <script src="{{ asset('admin/plugins/bootstrap-switch/js/bootstrap-switch.min.js') }}"></script>
    <script src="{{ asset('admin/plugins/moment/moment.min.js') }}"></script>
    <script src="{{ asset('admin/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js') }}"></script>
    <script src="{{ asset('admin/plugins/bootstrap-datepicker/locales/bootstrap-datepicker.es.min.js') }}"></script>

@endsection

@section('scripts')
    <script src="{{asset('admin/plugins/typehead/typeahead.bundle.js')}}"></script>
    <script>
        $("input[data-bootstrap-switch]").each(function(){
            $(this).bootstrapSwitch();
        });
        $('#category_id').select2({
            placeholder: "Categorías",
            allowClear: true
        });
        $('#type_id').select2({
            placeholder: "Seleccione",
            allowClear: true
        });
        $('#type_caja').select2({
            placeholder: "Seleccione",
            allowClear: true
        });


    </script>
    <script src="{{ asset('js/puntoVenta/index.js') }}?v={{ time() }}"></script>

@endsection
