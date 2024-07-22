<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = [
        'detail_entry_id',
        'material_id',
        'code',
        'length',
        'width',
        'weight',
        'price',
        'percentage',
        'typescrap_id',
        'location_id',
        'state',
        'state_item',
        'type',
        'usage'
    ];

    public function detailEntry()
    {
        return $this->belongsTo('App\DetailEntry');
    }

    public function material()
    {
        return $this->belongsTo('App\Material');
    }

    public function typescrap()
    {
        return $this->belongsTo('App\Typescrap', 'typescrap_id');
    }

    public function location()
    {
        return $this->belongsTo('App\Location');
    }

    public function outputDetail()
    {
        return $this->hasMany('App\OutputDetail', 'item_id','id');
    }
}
