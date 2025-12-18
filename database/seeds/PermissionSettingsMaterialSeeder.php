<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use \Spatie\Permission\Models\Role;

class PermissionSettingsMaterialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Permission::create([
            'name' => 'enable_materialSetting',
            'description' => 'Habilitar módulo de parametrización de materiales'
        ]);

        Permission::create([
            'name' => 'config_materialSetting',
            'description' => 'Configurar parámetros de materiales'
        ]);

        $roleA = Role::findByName('admin');

        $roleA->givePermissionTo([
            'enable_materialSetting',
            'config_materialSetting',
        ]);
    }
}
