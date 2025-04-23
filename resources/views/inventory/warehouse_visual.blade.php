@extends('layouts.appAdmin2')

@section('openInventory')
    menu-open
@endsection

@section('activeInventory')
    active
@endsection

@section('activeListInventory')
    active
@endsection

@section('title')
    Inventario Fisico
@endsection

@section('styles-plugins')
    <style>
        .shelf-name {
            margin-bottom: 10px;
            font-weight: bold;
        }
        .shelf-grid {
            display: flex;
            flex-direction: column;
        }
        .row {
            display: flex;
            align-items: center;
        }
        .row .label {
            width: 20px;
            text-align: right;
            margin-right: 8px;
            font-weight: bold;
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

    </style>
@endsection

@section('page-header')
    <h1 class="page-title">Inventario Físico</h1>
@endsection

@section('page-breadcrumb')
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item">
            <a href="{{ route('dashboard.principal') }}"><i class="fa fa-home"></i> Dashboard</a>
        </li>
        <li class="breadcrumb-item"><i class="fa fa-lock"></i> Inventario Fisico</li>
    </ol>
@endsection

@section('page-title')
    <h5 class="card-title">Listado de Inventario Fisico</h5>

@endsection

@section('content')
    <input type="hidden" id="permissions" value="{{ json_encode($permissions) }}">

    <div class="row">
        @foreach($shelves as $shelf)
            <div class="col-sm-3">
                <div class="shelf-name">{{ $shelf->name }}</div>
                <div class="shelf-grid">
                    @foreach($shelf->levels as $level)
                        <div class="row">
                            {{-- Etiqueta de fila (Nivel A, B, etc) --}}
                            <div class="label">{{ $level->name }}</div>

                            {{-- Recorremos contenedores como columnas --}}
                            @foreach($level->containers as $container)
                                <div class="cell">
                                    @foreach($container->positions as $position)
                                        <button
                                                class="circle-btn {{ $position->status == 'active' ? 'active' : 'inactive' }}"
                                                data-position-id="{{ $position->id }}"
                                                data-position-name="{{ $position->name }}"
                                                data-position-status="{{ $position->status }}"
                                                onclick="openPositionModal(this)"
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

    <!-- Modal Bootstrap 4 -->
    <div class="modal fade" id="positionModal" tabindex="-1" role="dialog" aria-labelledby="positionModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Gestión de Posición: <span id="modal-position-name"></span></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    Estado actual: <strong id="modal-position-status"></strong>
                </div>
                <div class="modal-footer">
                    <button id="toggleStatusBtn" class="btn btn-primary">Activar/Desactivar</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>


@endsection

@section('plugins')

@endsection

@section('scripts')
    <script>
        let currentButton = null;

        function openPositionModal(button) {
            currentButton = $(button);
            const name = currentButton.data('position-name');
            const status = currentButton.data('position-status');

            $('#modal-position-name').text(name);
            $('#modal-position-status').text(status.toUpperCase());

            $('#positionModal').modal('show');
        }

        $('#toggleStatusBtn').on('click', function () {
            const positionId = currentButton.data('position-id');

            $.confirm({
                title: '¿Cambiar estado?',
                content: '¿Estás seguro que deseas cambiar el estado de esta posición?',
                buttons: {
                    confirmar: function () {
                        $.ajax({
                            url: "{{ route('positions.toggleStatus') }}",
                            method: 'POST',
                            data: {
                                _token: "{{ csrf_token() }}",
                                id: positionId
                            },
                            success: function (response) {
                                if (response.success) {
                                    // Actualizamos botón y estado visual
                                    currentButton.removeClass('active inactive');
                                    currentButton.addClass(response.new_status === 'active' ? 'active' : 'inactive');
                                    currentButton.data('position-status', response.new_status);
                                    $('#modal-position-status').text(response.new_status.toUpperCase());
                                    $.alert('Estado actualizado correctamente');
                                    $('#positionModal').modal('hide');
                                } else {
                                    $.alert('Error al actualizar el estado');
                                }
                            },
                            error: function () {
                                $.alert('Error inesperado');
                            }
                        });
                    },
                    cancelar: function () {
                        $('#positionModal').modal('hide');
                    }
                }
            });
        });
    </script>
@endsection
