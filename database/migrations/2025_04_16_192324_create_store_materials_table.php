<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStoreMaterialsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('store_materials', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('material_id');
            $table->string('full_name');
            $table->decimal('stock_max', 10, 2)->default(0);
            $table->decimal('stock_min', 10, 2)->default(0);
            $table->decimal('unit_price', 10, 2)->nullable();
            $table->boolean('enable_status')->default(true);
            $table->string('codigo')->nullable();
            $table->boolean('isPack')->default(false);
            $table->decimal('quantityPack', 10, 2)->nullable();
            $table->timestamps();

            $table->foreign('material_id')->references('id')->on('materials')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('store_materials');
    }
}
