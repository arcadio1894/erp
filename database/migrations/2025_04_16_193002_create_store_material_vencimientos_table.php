<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStoreMaterialVencimientosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('store_material_vencimientos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('store_material_id');
            $table->date('fecha_vencimiento');
            $table->timestamps();

            $table->foreign('store_material_id')->references('id')->on('store_materials')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('store_material_vencimientos');
    }
}
