<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionDataGeneralSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Permission::create([
            'name' => 'enable_dataGeneral',
            'description' => 'Habilitar mantenedor Data General'
        ]);
        Permission::create([
            'name' => 'list_dataGeneral',
            'description' => 'Listar Data General'
        ]);
        Permission::create([
            'name' => 'create_dataGeneral',
            'description' => 'Crear Data General'
        ]);
        Permission::create([
            'name' => 'update_dataGeneral',
            'description' => 'Editar Data General'
        ]);

        $role = Role::findByName('admin');

        $role->givePermissionTo([
            'enable_dataGeneral',
            'list_dataGeneral',
            'create_dataGeneral',
            'update_dataGeneral'
        ]);
    }
}
