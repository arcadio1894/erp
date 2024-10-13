<?php

namespace App\Http\Controllers;

use App\Combo;
use App\ComboDetail;
use App\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ComboController extends Controller
{
    public function generateComboMaterials()
    {
        $user = Auth::user();
        $permissions = $user->getPermissionsViaRoles()->pluck('name')->toArray();

        return view('combo.generateCombo', compact( 'permissions'));

    }

    public function storeGeneratePack( Request $request )
    {
        //dd($request);
        // Validar la entrada de datos
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'materials' => 'required|array|min:1',
        ]);

        DB::beginTransaction();

        try {
            // Crear el paquete
            $combo = new Combo();
            $combo->name = $request->input('name');
            $combo->discount = $request->input('price');
            $combo->price = $request->input('total');
            $combo->save();

            // Agregar los materiales al paquete
            foreach ($request->input('materials') as $materialData) {

                $material = Material::where('full_name', $materialData['material'])->first();

                $comboDetail = new ComboDetail();
                $comboDetail->combo_id = $combo->id;
                $comboDetail->material_id = $material->id;
                $comboDetail->quantity = $materialData['quantity'];
                $comboDetail->save();
            }

            // Si todo va bien, se confirma la transacción
            DB::commit();

            return response()->json(['message' => 'Cambios guardados con éxito.'], 200);

        } catch (\Throwable $e) {
            // Si hay algún error, se deshacen los cambios
            DB::rollBack();

            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function getDataCombos(Request $request, $pageNumber = 1)
    {
        $perPage = 10;

        $query = Combo::where('enable', 1)->orderBy('id');

        $totalFilteredRecords = $query->count();
        $totalPages = ceil($totalFilteredRecords / $perPage);

        $startRecord = ($pageNumber - 1) * $perPage + 1;
        $endRecord = min($totalFilteredRecords, $pageNumber * $perPage);

        $combos = $query->skip(($pageNumber - 1) * $perPage)
            ->take($perPage)
            ->get();

        $array = [];

        foreach ( $combos as $combo )
        {
            array_push($array, [
                "id" => $combo->id,
                "name" => $combo->name,
                "discount" => $combo->discount,
                "price" => $combo->price,
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

    public function index()
    {
        $user = Auth::user();
        $permissions = $user->getPermissionsViaRoles()->pluck('name')->toArray();

        return view('combo.index_combo', compact( 'permissions'));

    }

    public function destroy(Request $request)
    {
        DB::beginTransaction();
        try {

            $combo = Combo::find($request->get('combo_id'));

            $combo->enable = 0;

            $combo->save();

            DB::commit();

        } catch ( \Throwable $e ) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json(['message' => 'Combo eliminado con éxito.'], 200);

    }

    public function getDataMaterialsCombo($combo_id)
    {
        $details = ComboDetail::where('combo_id', $combo_id)->get();
        $array = [];
        foreach ( $details as $detail )
        {
            array_push($array, [
                "material_id" => $detail->material_id,
                "material" => $detail->material->full_name,
                "quantity" => $detail->quantity
            ]);
        }

        return response()->json(['data' => $array], 200);
    }
}
