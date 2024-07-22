<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CreditPay extends Model
{
    public $fillable = [
        'supplier_credit_id',
        'amount',
        'date_pay',
        'image',
    ];

    protected $dates = ['date_pay'];

    public function supplier_credit()
    {
        return $this->belongsTo('App\SupplierCredit');
    }
}
