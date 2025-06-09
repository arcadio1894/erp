<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyCategoryForeignOnMaterialsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('materials', function (Blueprint $table) {
            // Primero, eliminar la clave foránea actual
            $table->dropForeign(['category_id']);

            // Hacer la columna nullable
            $table->unsignedBigInteger('category_id')->nullable()->change();

            // Volver a crear la clave foránea con SET NULL
            $table->foreign('category_id')
                ->references('id')
                ->on('categories')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('materials', function (Blueprint $table) {
            // Eliminar la nueva clave foránea
            $table->dropForeign(['category_id']);

            // Revertir a NOT NULL
            $table->unsignedBigInteger('category_id')->nullable(false)->change();

            // Volver a crear la clave foránea sin acción explícita
            $table->foreign('category_id')
                ->references('id')
                ->on('categories');
        });
    }
}
