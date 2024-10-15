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
    ];

    protected $dates = ['created_at', 'updated_at'];

    public function cashRegister()
    {
        return $this->belongsTo('App\CashRegister');
    }
}
