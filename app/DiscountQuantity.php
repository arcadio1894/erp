<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DiscountQuantity extends Model
{
    protected $fillable = [
        'description',
        'percentage',
        'quantity'
    ];

    public function discount_quantity_material()
    {
        return $this->hasMany('App\MaterialDiscountQuantity');
    }
}
