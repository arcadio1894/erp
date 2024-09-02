<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSalesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->dateTime('date_sale')->nullable();
            $table->string('serie')->nullable();
            $table->foreignId('worker_id')->nullable()->constrained('workers');
            $table->integer('caja')->nullable();
            $table->enum('currency', ['USD', 'PEN'])->nullable()->default('PEN');
            $table->decimal('op_exonerada', 6,3)->nullable()->default(null);
            $table->decimal('op_inafecta', 6,3)->nullable()->default(null);
            $table->decimal('op_gravada', 6,3)->nullable()->default(null);
            $table->decimal('igv', 6,3)->nullable()->default(null);
            $table->decimal('total_descuentos', 6,3)->nullable()->default(null);
            $table->decimal('importe_total', 6,3)->nullable()->default(null);
            $table->decimal('vuelto', 6,3)->nullable()->default(null);
            $table->foreignId('tipo_pago_id')->nullable()->constrained('tipo_pagos');
            $table->timestamps();
            /*
             * Tipos de pago
             * Yape
             * Plin
             * POS
             * Efectivo (Ingresar monto para calcular el vuelto)
             * */
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sales');
    }
}
