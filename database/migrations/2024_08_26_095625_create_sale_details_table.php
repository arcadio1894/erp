<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSaleDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sale_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sale_id')->nullable()->constrained('sales');
            $table->foreignId('material_id')->nullable()->constrained('materials');
            $table->decimal('price', 9,2)->nullable();
            $table->decimal('quantity', 9,2)->nullable();
            $table->decimal('percentage_tax', 9,2)->nullable();
            $table->decimal('total', 9,2)->nullable();
            $table->decimal('discount', 9,2)->nullable();
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
        Schema::dropIfExists('sale_details');
    }
}
