<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePromotionUsagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('promotion_usages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('promotion_limit_id');
            $table->unsignedBigInteger('user_id')->nullable(); // solo se usa si applies_to = worker
            $table->decimal('used_quantity', 15, 2)->default(0); // cuánto ya consumió
            $table->timestamps();

            $table->foreign('promotion_limit_id')->references('id')->on('promotion_limits')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('promotion_usages');
    }
}
