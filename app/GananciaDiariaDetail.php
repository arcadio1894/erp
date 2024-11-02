<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class GananciaDiariaDetail extends Model
{
    protected $fillable = [
        'ganancia_diaria_id',
        'date_detail',
        'material_id',
        'quantity',
        'price_sale',
        'utility'
    ];

    public function gananciaDiaria()
    {
        return $this->belongsTo('App\GananciaDiaria');
    }

    public function material()
    {
        return $this->belongsTo('App\Material');
    }

    protected $dates = ['date_detail'];
}
