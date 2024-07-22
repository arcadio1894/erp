<?php

namespace App\Console\Commands;

use App\Exports\StockMaterialsExcel;
use App\Mail\StockmaterialsEmail;
use App\Material;
use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class SendEmailStock extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'stocks:send';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a email with an excel attachment of stocks materials';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        // TODO: Obtener los materiales por deshabastecerse
        $array = [];

        // TODO: Solo categoria de estructuras
        /*$materials = Material::where('category_id', 5)
            ->where('stock_min', '>',0)
            ->where('enable_status', 1)
            ->get();*/
        $materials = Material::where('stock_min', '>',0)
            ->where('enable_status', 1)
            ->get();

        foreach ( $materials as $material )
        {
            $state = '';

            if ( $material->stock_current == 0 )
            {
                $state = 'Agotado';
                array_push($array, [
                    'id' => $material->id,
                    'code' => $material->code,
                    'material' => $material->full_description,
                    'category' => ( $material->category_id == null ) ? 'Sin Categoria' : $material->category->name,
                    'stock' => $material->stock_current,
                    'stock_max' => $material->stock_max,
                    'stock_min' => $material->stock_min,
                    'unit_price' => $material->unit_price,
                    'state' => $state,
                    'to_buy' => ceil($material->stock_max - $material->stock_current),
                    'total_price' => round(ceil($material->stock_max - $material->stock_current) * $material->unit_price, 2),
                ]);
            } elseif ( $material->stock_current > 0 && ($material->stock_current <= $material->stock_min) ) {
                $state = 'Por agotarse';
                array_push($array, [
                    'id' => $material->id,
                    'code' => $material->code,
                    'material' => $material->full_description,
                    'category' => ( $material->category_id == null ) ? 'Sin Categoria' : $material->category->name,
                    'stock' => $material->stock_current,
                    'stock_max' => $material->stock_max,
                    'stock_min' => $material->stock_min,
                    'unit_price' => $material->unit_price,
                    'state' => $state,
                    'to_buy' => ceil($material->stock_max - $material->stock_current),
                    'total_price' => round(ceil($material->stock_max - $material->stock_current) * $material->unit_price, 2),
                ]);
            }

        }

        //return (new StockMaterialsExcel($array))->download('facturasFinanzas.xlsx');

        //dd($array);
        // TODO: Crear el excel y guardarlo
        $path = public_path('excels');
        $dt = Carbon::now();
        $filename = 'MaterialesDeshabastecidos_'. $dt->toDateString() .'.xlsx';
        Excel::store(new StockMaterialsExcel($array), $filename, 'excel_uploads');

        $pathComplete = $path .'/'. $filename;
        //TODO: Enviar el correo
        Mail::to('kparedes@sermeind.com.pe')
            ->cc(['almacen.sermeind@gmail.com','joryes1894@gmail.com','edesceperu@gmail.com','supervisor1@sermeind.com.pe','jmauricio@sermeind.com.pe'])
            ->send(new StockmaterialsEmail($pathComplete, $filename));
    }
}
