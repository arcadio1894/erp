<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Meta extends Model
{
    protected $table = 'metas';

    protected $fillable = [
        'tipo',        // semanal | quincenal | mensual
        'nombre',
        'monto',
        'fecha_inicio',
        'fecha_fin',
    ];

    // Relación muchos a muchos con trabajadores
    public function workers()
    {
        return $this->belongsToMany(Worker::class, 'meta_workers')
            ->withTimestamps();
    }

    // Por si necesitas acceder a la tabla pivote directamente
    public function metaWorkers()
    {
        return $this->hasMany(MetaWorker::class);
    }
}
