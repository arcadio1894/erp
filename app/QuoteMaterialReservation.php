<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class QuoteMaterialReservation extends Model
{
    protected $fillable = [
        'quote_id',
        'material_id',
        'quantity',
    ];

    public function quote()
    {
        return $this->belongsTo(Quote::class);
    }

    public function material()
    {
        return $this->belongsTo(Material::class);
    }
}
