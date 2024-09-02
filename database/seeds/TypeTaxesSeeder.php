<?php

use Illuminate\Database\Seeder;
use \App\TypeTax;

class TypeTaxesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        TypeTax::create([
            'name' => 'IGV normal',
            'tax' => 18,
        ]);

        TypeTax::create([
            'name' => 'IGV exonerado',
            'tax' => 0,
        ]);
    }
}
