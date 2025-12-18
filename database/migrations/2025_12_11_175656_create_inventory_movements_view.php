<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInventoryMovementsView extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("DROP VIEW IF EXISTS inventory_movements_view");

        DB::statement("
            CREATE VIEW inventory_movements_view AS
        
            -- ==========================
            -- ENTRADAS (DetailEntry + Entry)
            -- ==========================
            SELECT
                de.id AS movement_id,
                'IN' AS movement_type,
                de.material_id AS material_id,
                e.date_entry AS movement_date,
                de.entered_quantity AS quantity,
        
                (
                    CASE
                        WHEN UPPER(dg.valueText) = 'USD' THEN
                            CASE UPPER(e.currency_invoice)
                                WHEN 'USD' THEN
                                    CASE
                                        WHEN de.total_detail IS NOT NULL AND de.entered_quantity > 0
                                            THEN de.total_detail / de.entered_quantity
                                        ELSE de.unit_price
                                    END
                                WHEN 'PEN' THEN
                                    CASE
                                        WHEN e.currency_venta IS NOT NULL AND e.currency_venta > 0 THEN
                                            (
                                                CASE
                                                    WHEN de.total_detail IS NOT NULL AND de.entered_quantity > 0
                                                        THEN de.total_detail / de.entered_quantity
                                                    ELSE de.unit_price
                                                END
                                            ) / e.currency_venta
                                        ELSE
                                            CASE
                                                WHEN de.total_detail IS NOT NULL AND de.entered_quantity > 0
                                                    THEN de.total_detail / de.entered_quantity
                                                ELSE de.unit_price
                                            END
                                    END
                                ELSE
                                    CASE
                                        WHEN de.total_detail IS NOT NULL AND de.entered_quantity > 0
                                            THEN de.total_detail / de.entered_quantity
                                        ELSE de.unit_price
                                    END
                            END
        
                        WHEN UPPER(dg.valueText) = 'PEN' THEN
                            CASE UPPER(e.currency_invoice)
                                WHEN 'PEN' THEN
                                    CASE
                                        WHEN de.total_detail IS NOT NULL AND de.entered_quantity > 0
                                            THEN de.total_detail / de.entered_quantity
                                        ELSE de.unit_price
                                    END
                                WHEN 'USD' THEN
                                    CASE
                                        WHEN e.currency_compra IS NOT NULL AND e.currency_compra > 0 THEN
                                            (
                                                CASE
                                                    WHEN de.total_detail IS NOT NULL AND de.entered_quantity > 0
                                                        THEN de.total_detail / de.entered_quantity
                                                    ELSE de.unit_price
                                                END
                                            ) * e.currency_compra
                                        ELSE
                                            CASE
                                                WHEN de.total_detail IS NOT NULL AND de.entered_quantity > 0
                                                    THEN de.total_detail / de.entered_quantity
                                                ELSE de.unit_price
                                            END
                                    END
                                ELSE
                                    CASE
                                        WHEN de.total_detail IS NOT NULL AND de.entered_quantity > 0
                                            THEN de.total_detail / de.entered_quantity
                                        ELSE de.unit_price
                                    END
                            END
        
                        ELSE
                            CASE
                                WHEN de.total_detail IS NOT NULL AND de.entered_quantity > 0
                                    THEN de.total_detail / de.entered_quantity
                                ELSE de.unit_price
                            END
                    END
                ) AS unit_cost,
        
                'entry' AS source_type,
                e.id AS source_id
        
            FROM detail_entries de
            JOIN entries e ON e.id = de.entry_id
            LEFT JOIN data_generals dg ON dg.name = 'type_current'
            WHERE e.deleted_at IS NULL
        
            UNION ALL
        
            -- ==========================
            -- SALIDAS (OutputDetail)
            -- ==========================
            SELECT
                CONCAT('O', t.source_id, '_', t.material_id) AS movement_id,
                'OUT' AS movement_type,
                t.material_id AS material_id,
                t.movement_date AS movement_date,
                t.quantity AS quantity,
                NULL AS unit_cost,
                'output' AS source_type,
                t.source_id AS source_id
            FROM (
                SELECT
                    o.id AS source_id,
                    o.request_date AS movement_date,
                    COALESCE(od.material_id, i.material_id) AS material_id,
            
                    -- 🔥 CANTIDAD REAL (itemeable, no itemeable, retazos)
                    SUM(COALESCE(od.percentage, 1)) AS quantity
            
                FROM output_details od
                JOIN outputs o ON o.id = od.output_id
                LEFT JOIN items i ON i.id = od.item_id
                JOIN materials m ON m.id = COALESCE(od.material_id, i.material_id)
            
                -- Solo salidas válidas para Kardex
                WHERE o.state IN ('attended', 'confirmed')
            
                GROUP BY
                    o.id,
                    o.request_date,
                    COALESCE(od.material_id, i.material_id)
            ) t
        ");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('inventory_movements_view');
    }
}
