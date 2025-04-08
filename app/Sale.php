<?php

namespace App;

use Carbon\Carbon;
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
        'tipo_pago_id',
        'state_annulled'
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

    public function getFormattedSaleDateAttribute()
    {
        return Carbon::parse($this->date_sale)->isoFormat('DD/MM/YYYY [a las] h:mm A');
    }
}
