<?php

use Illuminate\Database\Seeder;
use \Spatie\Permission\Models\Permission;
use \Spatie\Permission\Models\Role;

class PermissionsPromotionLimitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Permission::create([
            'name' => 'list_promotionLimit',
            'description' => 'Ver listado de promociones por límite'
        ]);
        Permission::create([
            'name' => 'create_promotionLimit',
            'description' => 'Crear promociones por límite'
        ]);
        Permission::create([
            'name' => 'edit_promotionLimit',
            'description' => 'Editar promociones por límite'
        ]);
        Permission::create([
            'name' => 'destroy_promotionLimit',
            'description' => 'Eliminar promociones por límite'
        ]);

        $roleA = Role::findByName('admin');

        $roleA->givePermissionTo([
            'list_promotionLimit',
            'create_promotionLimit',
            'edit_promotionLimit',
            'destroy_promotionLimit'
        ]);
    }
}
