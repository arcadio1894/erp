<?php

use Illuminate\Database\Seeder;
use App\DataGeneral;

class DataGeneralSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DataGeneral::create([
            'name' => 'typeBoleta',
            'valueText' => 'Semanal',
            'valueNumber' => 1,
            'module' => 'boleta',
            'description' => 'Tipo de Boleta Semanal'
        ]);

        DataGeneral::create([
            'name' => 'typeBoleta',
            'valueText' => 'Mensual',
            'valueNumber' => 2,
            'module' => 'boleta',
            'description' => 'Tipo de Boleta Semanal'
        ]);

        DataGeneral::create([
            'name' => 'daysOfWeek',
            'valueText' => '',
            'valueNumber' => 7,
            'module' => 'boleta',
            'description' => 'Dias de una semana'
        ]);

        DataGeneral::create([
            'name' => 'empresa',
            'valueText' => 'SERMEIND FABRICACIONES INDUSTRIALES S.A.C.',
            'valueNumber' => 0,
            'module' => 'boleta',
            'description' => 'Nombre la empresa sermeind'
        ]);

        DataGeneral::create([
            'name' => 'ruc',
            'valueText' => '20540001384',
            'valueNumber' => 0,
            'module' => 'boleta',
            'description' => 'Ruc la empresa sermeind'
        ]);

        DataGeneral::create([
            'name' => 'horasXDia',
            'valueText' => '',
            'valueNumber' => 8,
            'module' => 'boleta',
            'description' => 'Horas trabajadas por día'
        ]);

        DataGeneral::create([
            'name' => 'diasMes',
            'valueText' => '',
            'valueNumber' => 30,
            'module' => 'boleta',
            'description' => 'Dias por mes'
        ]);

        DataGeneral::create([
            'name' => 'horasSemanales',
            'valueText' => '',
            'valueNumber' => 48,
            'module' => 'boleta',
            'description' => 'Horas máximas por semana'
        ]);

        DataGeneral::create([
            'name' => 'tipoDomumento',
            'valueText' => 'DNI',
            'valueNumber' => 1,
            'module' => 'boleta',
            'description' => 'Tipo de documento DNI'
        ]);

        DataGeneral::create([
            'name' => 'tipoDomumento',
            'valueText' => 'RUC',
            'valueNumber' => 2,
            'module' => 'boleta',
            'description' => 'Tipo de documento RUC'
        ]);

        DataGeneral::create([
            'name' => 'tipoDomumento',
            'valueText' => 'C.E.',
            'valueNumber' => 3,
            'module' => 'boleta',
            'description' => 'Tipo de documento C.E.'
        ]);

        DataGeneral::create([
            'name' => 'daysToExpireMin',
            'valueText' => '',
            'valueNumber' => 4,
            'module' => 'credit',
            'description' => 'Dias minimos para cambiar a Expire'
        ]);

        DataGeneral::create([
            'name' => 'start_rotation_baja',
            'valueText' => 's_r_b',
            'valueNumber' => 0,
            'module' => 'material',
            'description' => 'Inicio porcentage rotacion baja'
        ]);
        DataGeneral::create([
            'name' => 'end_rotation_baja',
            'valueText' => 'e_r_b',
            'valueNumber' => 40,
            'module' => 'material',
            'description' => 'Fin porcentage rotacion baja'
        ]);
        DataGeneral::create([
            'name' => 'start_rotation_media',
            'valueText' => 's_r_m',
            'valueNumber' => 40,
            'module' => 'material',
            'description' => 'Inicio porcentage rotacion media'
        ]);
        DataGeneral::create([
            'name' => 'end_rotation_media',
            'valueText' => 'e_r_m',
            'valueNumber' => 70,
            'module' => 'material',
            'description' => 'Fin porcentage rotacion media'
        ]);
        DataGeneral::create([
            'name' => 'start_rotation_alta',
            'valueText' => 's_r_a',
            'valueNumber' => 70,
            'module' => 'material',
            'description' => 'Inicio porcentage rotacion alta'
        ]);
    }
}
