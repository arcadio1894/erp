<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EntryImage extends Model
{
    protected $fillable = [
        'entry_id',
        'code',
        'image',
        'type',
        'type_file'
    ];

    public function entry()
    {
        return $this->belongsTo('App\Entry');
    }
}
