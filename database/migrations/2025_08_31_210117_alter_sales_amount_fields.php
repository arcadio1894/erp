<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterSalesAmountFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sales', function (Blueprint $table) {
            Schema::table('sales', function (Blueprint $table) {
                $table->decimal('op_gravada', 13, 3)->change();
                $table->decimal('igv', 13, 3)->change();
                $table->decimal('total_descuentos', 13, 3)->change();
                $table->decimal('importe_total', 13, 3)->change();
            });
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sales', function (Blueprint $table) {
            //
        });
    }
}
