<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTrazabilidadToPromotionUsagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('promotion_usages', function (Blueprint $table) {
            $table->unsignedBigInteger('equipment_id')->nullable()->after('user_id');
            $table->unsignedBigInteger('equipment_consumable_id')->nullable()->after('equipment_id');
            $table->unsignedBigInteger('quote_id')->nullable()->after('equipment_consumable_id');

            // 🔗 Claves foráneas (opcional pero recomendado)
            $table->foreign('equipment_id')->references('id')->on('equipments')->onDelete('cascade');
            $table->foreign('equipment_consumable_id')->references('id')->on('equipment_consumables')->onDelete('cascade');
            $table->foreign('quote_id')->references('id')->on('quotes')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('promotion_usages', function (Blueprint $table) {
            $table->dropForeign(['equipment_id']);
            $table->dropForeign(['equipment_consumable_id']);
            $table->dropForeign(['quote_id']);

            $table->dropColumn(['equipment_id', 'equipment_consumable_id', 'quote_id']);
        });
    }
}
