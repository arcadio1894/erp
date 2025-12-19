<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use \Spatie\Permission\Models\Role;

class PermissionAdminAppSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // TODO: Punto de Venta
        Permission::create([
            'name' => 'enable_puntoVenta',
            'description' => 'Habilitar módulo de punto de venta'
        ]);
        Permission::create([
            'name' => 'create_puntoVenta',
            'description' => 'Crear ventas en punto de venta'
        ]);
        Permission::create([
            'name' => 'list_puntoVenta',
            'description' => 'Listar ventas en punto de venta'
        ]);

        // TODO: Caja
        Permission::create([
            'name' => 'enable_caja',
            'description' => 'Habilitar módulo de caja'
        ]);
        Permission::create([
            'name' => 'showEfectivo_caja',
            'description' => 'Ver Caja Efectivo'
        ]);
        Permission::create([
            'name' => 'showYape_caja',
            'description' => 'Ver Caja Yape'
        ]);
        Permission::create([
            'name' => 'showPlin_caja',
            'description' => 'Ver Caja Plin'
        ]);
        Permission::create([
            'name' => 'showBancario_caja',
            'description' => 'Ver Caja Bancario'
        ]);

        //TODO: Ganancia Diaria
        Permission::create([
            'name' => 'enable_gananciaDiaria',
            'description' => 'Habilitar Módulo Ganancia Diaria'
        ]);
        Permission::create([
            'name' => 'show_gananciaDiaria',
            'description' => 'Ver Ganancia Diaria'
        ]);
        Permission::create([
            'name' => 'showGananciaWorker_gananciaDiaria',
            'description' => 'Ver Ganancia Diaria por Trabajdor'
        ]);

        //TODO: Metas
        Permission::create([
            'name' => 'enable_metas',
            'description' => 'Habilitar Módulo Meta'
        ]);
        Permission::create([
            'name' => 'list_metas',
            'description' => 'Listar Metas'
        ]);
        Permission::create([
            'name' => 'create_metas',
            'description' => 'Crear Metas'
        ]);
        Permission::create([
            'name' => 'progress_metas',
            'description' => 'Progreso de Metas'
        ]);

        //TODO: Promociones
        Permission::create([
            'name' => 'enable_promotions',
            'description' => 'Habilitar módulo de Promociones'
        ]);
        Permission::create([
            'name' => 'showSeasonal_promotions',
            'description' => 'Configurar Promociones por Temporada'
        ]);
        Permission::create([
            'name' => 'showCombo_promotions',
            'description' => 'Configurar Promociones por Combos'
        ]);
        Permission::create([
            'name' => 'showLimite_promotions',
            'description' => 'Configurar Promociones por Límites'
        ]);
        Permission::create([
            'name' => 'order_promotions',
            'description' => 'Configurar Orden dePromociones'
        ]);

        $roleA = Role::findByName('admin');

        $roleA->givePermissionTo([
            'enable_puntoVenta',
            'create_puntoVenta',
            'list_puntoVenta',

            'enable_caja',
            'showEfectivo_caja',
            'showYape_caja',
            'showPlin_caja',
            'showBancario_caja',

            'enable_gananciaDiaria',
            'show_gananciaDiaria',
            'showGananciaWorker_gananciaDiaria',

            'enable_metas',
            'list_metas',
            'create_metas',
            'progress_metas',

            'enable_promotions',
            'showSeasonal_promotions',
            'showCombo_promotions',
            'showLimite_promotions',
            'order_promotions',

        ]);
    }
}
