<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldsToMaterialsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('materials', function (Blueprint $table) {
            $table->foreignId('genero_id')->nullable()->constrained('generos');
            $table->foreignId('talla_id')->nullable()->constrained('tallas');
            $table->foreignId('tipo_venta_id')->nullable()->constrained('tipo_ventas');
            $table->enum('perecible', ['s', 'n'])->nullable();
            $table->string('codigo')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('materials', function (Blueprint $table) {
            //
        });
    }
}
