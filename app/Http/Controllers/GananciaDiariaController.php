<?php

namespace App\Http\Controllers;

use App\GananciaDiaria;
use App\GananciaDiariaDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GananciaDiariaController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $permissions = $user->getPermissionsViaRoles()->pluck('name')->toArray();

        return view('ganancia.index', compact( 'permissions'));

    }

    public function getDataGanancias(Request $request, $pageNumber = 1)
    {
        $perPage = 1;

        $array = [];
        $pagination = [];

        $query = GananciaDiaria::orderBy('id', 'desc');

        $totalFilteredRecords = $query->count();
        $totalPages = ceil($totalFilteredRecords / $perPage);

        $startRecord = ($pageNumber - 1) * $perPage + 1;
        $endRecord = min($totalFilteredRecords, $pageNumber * $perPage);

        $ganancias = $query->skip(($pageNumber - 1) * $perPage)
            ->take($perPage)
            ->get();

        foreach ( $ganancias as $ganancia )
        {
            array_push($array, [
                "id" => $ganancia->id,
                "date_resumen" => $ganancia->date_resumen->format('d/m/Y'),
                "quantity_sale" => $ganancia->quantity_sale,
                "total_sale" => $ganancia->total_sale,
                "total_utility" => $ganancia->total_utility
            ]);
        }

        $pagination = [
            'currentPage' => (int)$pageNumber,
            'totalPages' => (int)$totalPages,
            'startRecord' => $startRecord,
            'endRecord' => $endRecord,
            'totalRecords' => $totalFilteredRecords,
            'totalFilteredRecords' => $totalFilteredRecords
        ];

        return ['data' => $array, 'pagination' => $pagination];
    }

    public function indexDetail($gananciaId)
    {
        $user = Auth::user();

        $permissions = $user->getPermissionsViaRoles()->pluck('name')->toArray();

        $ganancia = GananciaDiaria::find($gananciaId);

        return view('ganancia.indexDetail', compact( 'permissions', 'ganancia'));

    }

    public function getDataGananciaDetails(Request $request, $pageNumber = 1)
    {
        $perPage = 10;

        $ganancia_id = $request->input('ganancia_id');

        $array = [];
        $pagination = [];

        $query = GananciaDiariaDetail::where('ganancia_diaria_id', $ganancia_id)->orderBy('id', 'desc');

        $totalFilteredRecords = $query->count();
        $totalPages = ceil($totalFilteredRecords / $perPage);

        $startRecord = ($pageNumber - 1) * $perPage + 1;
        $endRecord = min($totalFilteredRecords, $pageNumber * $perPage);

        $gananciaDetails = $query->skip(($pageNumber - 1) * $perPage)
            ->take($perPage)
            ->get();

        $quantity = 0;
        $price_sale = 0;
        $utility = 0;

        foreach ( $gananciaDetails as $detail )
        {
            array_push($array, [
                "id" => $detail->id,
                "date_detail" => $detail->date_detail->format('d/m/Y'),
                "material_id" => $detail->material_id,
                "material_description" => $detail->material->full_name,
                "quantity" => $detail->quantity,
                "price_sale" => $detail->price_sale,
                "utility" => $detail->utility
            ]);

            $quantity += $detail->quantity;
            $price_sale += $detail->price_sale;
            $utility += $detail->utility;
        }

        array_push($array, [
            "id" => 0,
            "date_detail" => "",
            "material_id" => "",
            "material_description" => "TOTAL",
            "quantity" => $quantity,
            "price_sale" => $price_sale,
            "utility" => $utility
        ]);

        $pagination = [
            'currentPage' => (int)$pageNumber,
            'totalPages' => (int)$totalPages,
            'startRecord' => $startRecord,
            'endRecord' => $endRecord,
            'totalRecords' => $totalFilteredRecords,
            'totalFilteredRecords' => $totalFilteredRecords
        ];

        return ['data' => $array, 'pagination' => $pagination];
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        //
    }

    public function show(GananciaDiaria $gananciaDiaria)
    {
        //
    }

    public function edit(GananciaDiaria $gananciaDiaria)
    {
        //
    }

    public function update(Request $request, GananciaDiaria $gananciaDiaria)
    {
        //
    }

    public function destroy(GananciaDiaria $gananciaDiaria)
    {
        //
    }
}
