<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePromotionLimitsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('promotion_limits', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('material_id');
            $table->integer('limit_quantity');
            $table->enum('applies_to', ['worker', 'global']);
            $table->enum('price_type', ['fixed', 'percentage']);
            $table->decimal('percentage', 10, 2)->nullable();
            $table->decimal('promo_price', 10, 2)->nullable();
            $table->decimal('original_price', 10, 2);
            $table->datetime('start_date')->nullable();
            $table->datetime('end_date')->nullable();
            $table->timestamps();

            // Claves foráneas
            $table->foreign('material_id')->references('id')->on('materials');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('promotion_limits');
    }
}
