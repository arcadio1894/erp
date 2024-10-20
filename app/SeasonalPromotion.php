<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SeasonalPromotion extends Model
{
    protected $fillable = [
        'category_id',
        'start_date',
        'end_date',
        'discount_percentage',
    ];

    protected $dates = ['created_at', 'updated_at'];

    public function category()
    {
        return $this->belongsTo('App\Category');
    }
}
