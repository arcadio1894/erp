<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class StoreMaterialLocation extends Model
{
    protected $fillable = [
        'store_material_id',
        'location_id'
    ];

    public function storeMaterial()
    {
        return $this->belongsTo(StoreMaterial::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }
}
