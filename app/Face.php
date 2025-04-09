<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Face extends Model
{
    protected $fillable = ['name', 'image_path'];
}
