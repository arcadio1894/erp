<?php
/**
 * Created by PhpStorm.
 * User: Milly
 * Date: 20/11/2025
 * Time: 06:20 PM
 */
if (! function_exists('numeroALetras')) {

    function numeroALetras($monto, $moneda = 'SOLES')
    {
        // Normalizamos a 2 decimales exactos
        $monto = number_format($monto, 2, '.', '');
        list($enteros, $decimales) = explode('.', $monto);

        $enteros = intval($enteros);
        $decimales = str_pad($decimales, 2, '0', STR_PAD_LEFT);

        if ($enteros == 0) {
            $textoEnteros = 'CERO';
        } else {
            $textoEnteros = convertirNumero3Bloques($enteros);
        }

        // Construimos el texto final
        $resultado = $textoEnteros . ' CON ' . $decimales . '/100 ' . $moneda;

        // Todo en mayúsculas
        if (function_exists('mb_strtoupper')) {
            return mb_strtoupper($resultado, 'UTF-8');
        }

        return strtoupper($resultado);
    }

    /**
     * Convierte un número entero (0 – 999999999) a texto en español.
     */
    function convertirNumero3Bloques($numero)
    {
        $unidades = [
            '', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO',
            'SEIS', 'SIETE', 'OCHO', 'NUEVE', 'DIEZ',
            'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE',
            'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE',
            'VEINTE'
        ];

        $decenas = [
            2 => 'VEINTI',
            3 => 'TREINTA',
            4 => 'CUARENTA',
            5 => 'CINCUENTA',
            6 => 'SESENTA',
            7 => 'SETENTA',
            8 => 'OCHENTA',
            9 => 'NOVENTA',
        ];

        $centenas = [
            1 => 'CIENTO',
            2 => 'DOSCIENTOS',
            3 => 'TRESCIENTOS',
            4 => 'CUATROCIENTOS',
            5 => 'QUINIENTOS',
            6 => 'SEISCIENTOS',
            7 => 'SETECIENTOS',
            8 => 'OCHOCIENTOS',
            9 => 'NOVECIENTOS',
        ];

        $numero = intval($numero);

        if ($numero == 0) {
            return 'CERO';
        }

        // MILLONES
        $millones = intval($numero / 1000000);
        $resto = $numero % 1000000;

        // MILES
        $miles = intval($resto / 1000);
        $cientos = $resto % 1000;

        $texto = '';

        if ($millones > 0) {
            if ($millones == 1) {
                $texto .= 'UN MILLÓN';
            } else {
                $texto .= convertirGrupoTresCifras($millones, $unidades, $decenas, $centenas) . ' MILLONES';
            }
        }

        if ($miles > 0) {
            if ($texto !== '') {
                $texto .= ' ';
            }

            if ($miles == 1) {
                $texto .= 'MIL';
            } else {
                $texto .= convertirGrupoTresCifras($miles, $unidades, $decenas, $centenas) . ' MIL';
            }
        }

        if ($cientos > 0) {
            if ($texto !== '') {
                $texto .= ' ';
            }
            $texto .= convertirGrupoTresCifras($cientos, $unidades, $decenas, $centenas);
        }

        return $texto;
    }

    /**
     * Convierte un número de 1 a 999 en texto.
     */
    function convertirGrupoTresCifras($num, $unidades, $decenas, $centenas)
    {
        $num = intval($num);

        if ($num == 0) {
            return '';
        }
        if ($num == 100) {
            return 'CIEN';
        }

        $c = intval($num / 100);
        $resto = $num % 100;

        $texto = '';

        if ($c > 0) {
            $texto .= $centenas[$c];
        }

        if ($resto > 0) {
            if ($texto !== '') {
                $texto .= ' ';
            }

            if ($resto <= 20) {
                $texto .= $unidades[$resto];
            } elseif ($resto < 30) {
                // 21–29: veinti + algo
                $texto .= 'VEINTI' . strtolower($unidades[$resto - 20]);
                $texto = mb_strtoupper($texto, 'UTF-8');
            } else {
                $d = intval($resto / 10);
                $u = $resto % 10;

                $texto .= $decenas[$d];
                if ($u > 0) {
                    $texto .= ' Y ' . $unidades[$u];
                }
            }
        }

        return $texto;
    }
}