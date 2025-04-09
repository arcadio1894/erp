@extends('layouts.appAdmin2')

@section('title')
    Registro de Rostros
@endsection

@section('activeInvoice')
    active
@endsection

@section('page-title')
    Registrar Rostros
@endsection

@section('page-breadcrumb')
    <li class="breadcrumb-item active">Rostros</li>
@endsection

@section('styles-plugins')
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css">
@endsection

@section('content')
    <div class="container mt-3">
        <div class="card shadow">
            <div class="card-body">
                <h4 class="mb-3">Subir imágenes del rostro</h4>

                @if(session('success'))
                    <div class="alert alert-success">{{ session('success') }}</div>
                @endif

                <form action="{{ route('faces.store') }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    <div class="form-group">
                        <label for="name">Nombre de la persona</label>
                        <input type="text" name="name" class="form-control" required>
                    </div>

                    <div class="form-group">
                        <label for="images">Imágenes del rostro (puedes subir varias)</label>
                        <input type="file" name="images[]" class="form-control" accept="image/*" multiple required>
                    </div>

                    <button type="submit" class="btn btn-primary">Guardar rostros</button>
                </form>
            </div>
        </div>
    </div>
@endsection