<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class PermissionsSync extends Command
{
    protected $signature = 'permissions:sync {--force}';
    protected $description = 'Sincroniza permisos desde el catálogo y los asigna al rol admin';

    public function handle()
    {
        $catalog = config('permissions_catalog');

        if (!is_array($catalog) || empty($catalog)) {
            $this->error('El catálogo de permisos está vacío.');
            return 1;
        }

        // Limpia cache de spatie
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $created = 0;
        $updated = 0;

        foreach ($catalog as $name => $description) {

            $exists = Permission::where('name', $name)->exists();

            Permission::updateOrCreate(
                ['name' => $name, 'guard_name' => 'web'],
                ['description' => $description]
            );

            if ($exists) {
                $updated++;
            } else {
                $created++;
            }
        }

        // Crear / actualizar rol admin
        $adminRole = Role::updateOrCreate(
            ['name' => 'admin', 'guard_name' => 'web'],
            ['description' => 'Administrador']
        );

        // Asignar TODOS los permisos al admin
        $adminRole->syncPermissions(
            Permission::where('guard_name', 'web')->get()
        );

        $this->info('Permisos sincronizados correctamente.');
        $this->line('Creados: ' . $created);
        $this->line('Actualizados: ' . $updated);
        $this->line('Rol admin sincronizado con todos los permisos.');

        return 0;
    }
}
