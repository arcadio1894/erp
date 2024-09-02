<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SaleDetail extends Model
{
    protected $fillable = [
        'sale_id',
        'material_id',
        'price',
        'quantity',
        'percentage_tax',
        'total',
        'discount'
    ];

    public function sale()
    {
        return $this->belongsTo('App\Sale');
    }

    public function material()
    {
        return $this->belongsTo('App\Material');
    }
}
