<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MetaWorker extends Model
{
    protected $table = 'meta_workers';

    protected $fillable = [
        'meta_id',
        'worker_id',
    ];

    public function meta()
    {
        return $this->belongsTo(Meta::class);
    }

    public function worker()
    {
        return $this->belongsTo(Worker::class);
    }
}
