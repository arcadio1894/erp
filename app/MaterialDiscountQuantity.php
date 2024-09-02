<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MaterialDiscountQuantity extends Model
{
    protected $fillable = [
        'material_id',
        'discount_quantity_id',
        'percentage'
    ];

    public function material()
    {
        return $this->belongsTo('App\Material');
    }

    public function discount()
    {
        return $this->belongsTo('App\DiscountQuantity', 'discount_quantity_id');
    }
}
