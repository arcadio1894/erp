<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TipoVenta extends Model
{
    protected $table = "tipo_ventas";

    protected $fillable = [
        'description',
    ];

    public function materials()
    {
        return $this->hasMany("App/Material", "tipo_venta_id");
    }
}
