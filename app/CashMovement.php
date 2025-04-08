<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CashMovement extends Model
{
    protected $fillable = [
        'cash_register_id',
        'type',
        'amount',
        'description',
        'regularize',
        'sale_id'
    ];

    protected $dates = ['created_at', 'updated_at'];

    public function cashRegister()
    {
        return $this->belongsTo('App\CashRegister');
    }

    public function sale()
    {
        return $this->belongsTo('App\Sale');
    }
}
