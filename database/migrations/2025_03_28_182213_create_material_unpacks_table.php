<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMaterialUnpacksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('material_unpacks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('parent_material_id'); // Producto padre (paquete)
            $table->unsignedBigInteger('child_material_id'); // Producto hijo (unitario)
            $table->timestamps();

            // Claves foráneas
            $table->foreign('parent_material_id')->references('id')->on('materials')->onDelete('cascade');
            $table->foreign('child_material_id')->references('id')->on('materials')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('material_unpacks');
    }
}
