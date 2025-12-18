<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MaterialDetailSetting extends Model
{
    protected $fillable = [
        'enabled_sections',
    ];

    protected $casts = [
        'enabled_sections' => 'array',
    ];
}
