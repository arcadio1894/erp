<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class GananciaDiaria extends Model
{
    protected $fillable = [
        'date_resumen',
        'quantity_sale',
        'total_sale',
        'total_utility'
    ];

    public function details()
    {
        return $this->hasMany('App\GananciaDiariaDetail');
    }

    protected $dates = ['date_resumen'];
}
