<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class StoreMaterialVencimiento extends Model
{
    protected $fillable = [
        'store_material_id',
        'fecha_vencimiento'
    ];

    public function storeMaterial()
    {
        return $this->belongsTo(StoreMaterial::class);
    }
}
