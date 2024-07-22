<?php

use Illuminate\Database\Seeder;
use App\Location;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Location::create([
            'area_id' => 1,
            'warehouse_id' => 1,
            'shelf_id' => 1,
            'level_id' => 1,
            'container_id' => 1,
            'position_id' => 1,
        ]);
    }
}
