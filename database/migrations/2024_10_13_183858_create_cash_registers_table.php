<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCashRegistersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cash_registers', function (Blueprint $table) {
            $table->id();
            $table->decimal('opening_balance', 9,2)->nullable()->default(0);
            $table->decimal('closing_balance', 9,2)->nullable()->default(0);
            $table->decimal('total_sales', 9,2)->nullable()->default(0);
            $table->decimal('total_incomes', 9,2)->nullable()->default(0);
            $table->decimal('total_expenses', 9,2)->nullable()->default(0);
            $table->dateTime('opening_time')->nullable();
            $table->dateTime('closing_time')->nullable();
            $table->boolean('status')->nullable();
            $table->enum('type', ['efectivo', 'yape', 'plin', 'bancario'])->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
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
        Schema::dropIfExists('cash_registers');
    }
}
