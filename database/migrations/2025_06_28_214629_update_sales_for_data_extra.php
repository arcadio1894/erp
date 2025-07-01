<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateSalesForDataExtra extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->string('serie_sunat', 10)->nullable();
            $table->string('type_document', 2)->nullable();
            $table->string('sunat_ticket')->nullable();
            $table->string('sunat_status')->nullable();
            $table->text('sunat_message')->nullable();
            $table->date('fecha_emision')->nullable();                  // Email si se desea enviar el comprobante
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
