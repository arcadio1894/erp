<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class StoreMaterial extends Model
{
    protected $fillable = [
        'material_id',
        'full_name',
        'stock_max',
        'stock_min',
        'stock_current',
        'unit_price',
        'enable_status',
        'codigo',
        'isPack',
        'quantityPack'
    ];

    public function material()
    {
        return $this->belongsTo(Material::class);
    }

    public function locations()
    {
        return $this->hasMany(StoreMaterialLocation::class);
    }

    public function vencimientos()
    {
        return $this->hasMany(StoreMaterialVencimiento::class);
    }

    // Scope para obtener el resumen por material
    public function scopeResumenPorMaterial($query)
    {
        return $query->selectRaw('
                material_id,
                full_name,
                MIN(stock_min) as stock_min,
                SUM(stock_current) as stock_total
            ')
            ->groupBy('material_id', 'full_name')
            ->orderBy('full_name');
    }
}
