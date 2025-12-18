@extends('layouts.appAdmin2')

@section('openConfig')
    menu-open
@endsection

@section('activeConfig')
    active
@endsection

@section('openSettingsMaterialDetail')
    menu-open
@endsection

@section('activeSettingsMaterialDetails')
    active
@endsection

@section('title')
    Materiales
@endsection

@section('page-header')
    <h1 class="page-title">Configuración de Materiales</h1>
@endsection

@section('page-title')
    <h5 class="card-title">Detalles de Materiales</h5>
@endsection

@section('page-breadcrumb')
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item">
            <a href="{{ route('dashboard.principal') }}"><i class="fa fa-home"></i> Dashboard</a>
        </li>
        <li class="breadcrumb-item">
            <a href="{{ route('settings.material-details.index') }}"><i class="fa fa-archive"></i> Detalles de Materiales</a>
        </li>
        <li class="breadcrumb-item"><i class="fa fa-plus-circle"></i> Configurar</li>
    </ol>
@endsection

@section('content')
    <div class="container">
        <h4>Configuración de detalles de producto</h4>

        @if(session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        <form method="POST" action="{{ route('settings.material-details.store') }}">
            @csrf

            <div class="row">
                @foreach($sections as $key => $meta)
                    <div class="col-md-4 mb-2">
                        <label class="d-flex align-items-center">
                            <input type="checkbox"
                                   name="enabled_sections[]"
                                   value="{{ $key }}"
                                   class="mr-2"
                                    {{ in_array($key, $enabled) ? 'checked' : '' }}>
                            {{ $meta['label'] }}
                        </label>
                    </div>
                @endforeach
            </div>

            <button class="btn btn-primary mt-3">
                Guardar configuración
            </button>
        </form>
    </div>
@endsection