<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(PermissionSeeder::class);
        $this->call(RoleSeeder::class);
        $this->call(UserSeeder::class);

        $this->call(CategorySeeder::class);
        $this->call(SubcategorySeeder::class);
        $this->call(MaterialTypeSeeder::class);
        $this->call(SubtypeSeeder::class);
        $this->call(QualitySeeder::class);
        $this->call(WarrantSeeder::class);
        $this->call(UnitMeasureSeeder::class);
        $this->call(TypescrapSeeder::class);

        $this->call(CustomerSeeder::class);
        $this->call(ContactNameSeeder::class);

        $this->call(BrandSeeder::class);
        $this->call(ExamplerSeeder::class);
        $this->call(MaterialSeeder::class);

        $this->call(AreaSeeder::class);
        $this->call(WarehouseSeeder::class);
        $this->call(ShelfSeeder::class);
        $this->call(LevelSeeder::class);
        $this->call(ContainerSeeder::class);
        $this->call(PositionSeeder::class);
        $this->call(LocationSeeder::class);

        $this->call(ConsumableSeeder::class);
        $this->call(InvoicePurchaseSeeder::class);
        $this->call(WorkforceSeeder::class);
    }
}
