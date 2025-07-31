<?php

use Illuminate\Database\Seeder;
use \Spatie\Permission\Models\Permission;
use \Spatie\Permission\Models\Role;

class PermissionsQuoteSaleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Permission::create([
            'name' => 'list_quoteSale',
            'description' => 'Ver listado de cotizaciones de ventas'
        ]);
        Permission::create([
            'name' => 'create_quoteSale',
            'description' => 'Crear cotizaciones de ventas'
        ]);
        Permission::create([
            'name' => 'edit_quoteSale',
            'description' => 'Editar cotizaciones de ventas'
        ]);
        Permission::create([
            'name' => 'destroy_quoteSale',
            'description' => 'Eliminar cotizaciones de ventas'
        ]);

        $roleA = Role::findByName('admin');

        $roleA->givePermissionTo([
            'list_quoteSale',
            'create_quoteSale',
            'edit_quoteSale',
            'destroy_quoteSale'
        ]);
    }
}
