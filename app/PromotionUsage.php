<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PromotionUsage extends Model
{
    protected $fillable = [
        'promotion_limit_id',
        'user_id',
        'used_quantity',
    ];

    public function promotion()
    {
        return $this->belongsTo(PromotionLimit::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
