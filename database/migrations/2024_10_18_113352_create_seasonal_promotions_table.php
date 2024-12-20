<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSeasonalPromotionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('seasonal_promotions', function (Blueprint $table) {
            $table->id();
            $table->mediumText('description')->nullable();
            $table->foreignId('category_id')->nullable()->constrained('categories');  // Tipo de producto o categoría
            $table->date('start_date')->nullable();  // Fecha de inicio de la promoción
            $table->date('end_date')->nullable();    // Fecha de finalización
            $table->decimal('discount_percentage', 6, 2)->nullable();  // Porcentaje de descuento
            $table->boolean('enable')->nullable()->default(1);
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
        Schema::dropIfExists('seasonal_promotions');
    }
}
