<!-- Despues de iniciar sesion -->
@extends('layouts.appLanding2')

@section('title')
    Inicio
@endsection

@section('content')
    <div class="card">
        <div class="card-body login-card-body">

            @guest
                <h4 class="login-box-msg">Sistema interno de SERMEIND</h4>
            @else
                <h4 class="login-box-msg">Bienvenido a la Intranet</h4>
                <h4 class="login-box-msg">{{ Auth::user()->name }}</h4>
            @endguest
            <div class="row">
                <div class="col-md-12">
                    <a href="https://www.sermeind.com.pe/" class="btn btn-primary btn-block">Regresar a la pagina principal</a>
                </div>
                <br><br>
                @guest
                    <div class="col-md-12">
                        <a href="{{ route('login') }}" class="btn btn-primary btn-block">Iniciar sesión</a>
                    </div>
                @else
                    @can('access_dashboard')
                        <div class="col-md-12">
                            <a href="{{ route('dashboard.principal') }}" class="btn btn-success btn-block">Ir al Dashboard</a>
                        </div>

                    @endcan
                    <br><br>
                    <div class="col-md-12">
                        <a class="btn btn-danger btn-block" href="{{ route('logout') }}"
                           onclick="event.preventDefault();
                           document.getElementById('logout-form').submit();">
                            <i class="fa fa-sign-out"></i>
                            {{ __('Cerrar Sesión') }}
                        </a>
                        <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                            @csrf
                        </form>
                    </div>

                @endguest
            </div>

        </div>
        <!-- /.login-card-body -->
    </div>


@endsection
