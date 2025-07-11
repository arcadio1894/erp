<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Producto por agotarse</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f8f8;
            padding: 20px;
        }
        .email-container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            max-width: 600px;
            margin: 0 auto;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .button {
            display: inline-block;
            padding: 12px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #777;
            text-align: center;
        }
    </style>
</head>
<body>
<div class="email-container">
    <h2>⚠ Producto por Agotarse</h2>
    <p>El producto <strong>{{ $material }}</strong> está por agotarse en el almacén.</p>

    <p>Por favor, revisa el stock y toma las acciones necesarias.</p>

    <a href="{{ route('material.index.store') }}" class="button">Ver materiales</a>

    <div class="footer">
        <p>{{ config('app.name') }} &copy; {{ date('Y') }}</p>
    </div>
</div>
</body>
</html>