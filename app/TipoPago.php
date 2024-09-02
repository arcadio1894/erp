<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TipoPago extends Model
{
    protected $fillable = [
        'description',
        'vuelto'
    ];
}
