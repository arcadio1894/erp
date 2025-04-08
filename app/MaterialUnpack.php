<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MaterialUnpack extends Model
{
    protected $fillable = ['parent_material_id', 'child_material_id'];

    public function parentProduct()
    {
        return $this->belongsTo(Material::class, 'parent_material_id');
    }

    public function childProduct()
    {
        return $this->belongsTo(Material::class, 'child_material_id');
    }
}
