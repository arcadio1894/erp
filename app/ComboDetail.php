<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ComboDetail extends Model
{
    protected $fillable = [
        'combo_id',
        'material_id',
        'quantity',
    ];

    public function combo()
    {
        return $this->belongsTo('App\Combo');
    }

    public function material()
    {
        return $this->belongsTo('App\Material');
    }
}
