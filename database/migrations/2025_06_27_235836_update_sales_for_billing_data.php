<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateSalesForBillingData extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sales', function (Blueprint $table) {
            // Volver a agregar 'numero' como string
            $table->string('numero', 8)->nullable();
            $table->string('xml_path')->nullable();
            $table->string('cdr_path')->nullable();
            $table->string('pdf_path')->nullable();

            // Nuevos campos para datos de facturación del cliente
            $table->string('nombre_cliente')->nullable();                  // Nombre o razón social
            $table->string('tipo_documento_cliente', 2)->nullable();       // '1' = DNI, '6' = RUC
            $table->string('numero_documento_cliente', 15)->nullable();    // DNI o RUC
            $table->string('direccion_cliente')->nullable();               // Dirección fiscal
            $table->string('email_cliente')->nullable();                   // Email si se desea enviar el comprobante
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
