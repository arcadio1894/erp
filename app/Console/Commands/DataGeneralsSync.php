<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\DataGeneral;

class DataGeneralsSync extends Command
{
    protected $signature = 'data-generals:sync';
    protected $description = 'Sincroniza DataGenerals desde el catálogo (config/data_generals_catalog.php)';

    public function handle()
    {
        $items = config('data_generals_catalog');

        if (!is_array($items) || count($items) === 0) {
            $this->error('El catálogo data_generals_catalog está vacío o no existe.');
            return 1;
        }

        $created = 0;
        $updated = 0;

        foreach ($items as $item) {

            $name = isset($item['name']) ? $item['name'] : null;
            $module = array_key_exists('module', $item) ? $item['module'] : null;
            $valueNumber = array_key_exists('valueNumber', $item) ? $item['valueNumber'] : null;
            $valueText = array_key_exists('valueText', $item) ? $item['valueText'] : null;

            if (!$name) {
                continue;
            }

            /**
             * IMPORTANTE:
             * En tu data hay "name" repetido (ej: typeBoleta semanal/mensual).
             * Por eso NO podemos usar solo name como key.
             *
             * Usamos una "key natural" compuesta para evitar duplicados:
             * name + module + valueNumber + valueText
             */
            $where = array(
                'name' => $name,
                'module' => $module,
                'valueNumber' => $valueNumber,
                'valueText' => $valueText,
            );

            $exists = DataGeneral::where($where)->exists();

            DataGeneral::updateOrCreate(
                $where,
                array(
                    'description' => array_key_exists('description', $item) ? $item['description'] : null,
                )
            );

            if ($exists) {
                $updated++;
            } else {
                $created++;
            }
        }

        $this->info('DataGenerals sincronizados correctamente.');
        $this->line('Creados: ' . $created);
        $this->line('Actualizados: ' . $updated);

        return 0;
    }
}
