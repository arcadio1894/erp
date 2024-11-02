<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGananciaDiariaDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ganancia_diaria_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ganancia_diaria_id')->nullable()->constrained('ganancia_diarias');
            $table->date('date_detail')->nullable();
            $table->foreignId('material_id')->nullable()->constrained('materials');
            $table->decimal('quantity', 9, 2)->nullable();
            $table->decimal('price_sale', 9, 2)->nullable();
            $table->decimal('utility', 9, 2)->nullable();
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
        Schema::dropIfExists('ganancia_diaria_details');
    }
}
