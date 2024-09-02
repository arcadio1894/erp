<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $fillable = [
        'date_sale',
        'serie',
        'worker_id',
        'caja',
        'currency',
        'op_exonerada',
        'op_inafecta',
        'op_gravada',
        'igv',
        'total_descuentos',
        'importe_total',
        'vuelto',
        'tipo_pago_id'
    ];

    protected $dates = ['date_sale'];

    public function worker()
    {
        return $this->belongsTo('App\Worker');
    }

    public function tipoPago()
    {
        return $this->belongsTo('App\TipoPago');
    }

    public function details()
    {
        return $this->hasMany('App\SaleDetail');
    }
}
