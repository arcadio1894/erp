<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGananciaDiariasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ganancia_diarias', function (Blueprint $table) {
            $table->id();
            $table->date('date_resumen')->nullable();
            $table->decimal('quantity_sale', 9,2)->nullable();
            $table->decimal('total_sale', 9,2)->nullable();
            $table->decimal('total_utility', 9,2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ganancia_diarias');
    }
}
