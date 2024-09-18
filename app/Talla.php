<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Talla extends Model
{
    use SoftDeletes;

    protected $table = "qualities";

    protected $fillable = [
        'name',
        'description'
    ];

    public function materials()
    {
        return $this->hasMany('App\Material');
    }

    protected $dates = ['deleted_at'];
}
