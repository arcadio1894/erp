<?php

namespace App\Http\Controllers;

use App\Http\Requests\DeleteUnitMeasureRequest;
use App\Http\Requests\StoreUnitMeasureRequest;
use App\Http\Requests\UpdateUnitMeasureRequest;
use App\UnitMeasure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UnitMeasureController extends Controller
{
    public function index()
    {
        $unitMeasures = UnitMeasure::orderBy('name', 'asc')->get();
        //$permissions = Permission::all();
        $user = Auth::user();
        $permissions = $user->getPermissionsViaRoles()->pluck('name')->toArray();

        return view('unitMeasure.index', compact('unitMeasures', 'permissions'));
    }

    public function store(StoreUnitMeasureRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {

            $unit = UnitMeasure::create([
                'name' => $request->get('name'),
                'description' => $request->get('description'),
            ]);

            DB::commit();

        } catch ( \Throwable $e ) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
        }
        return response()->json([
            'success' => true,
            'message' => 'Unidad de medida guardado con éxito.',
            'data' => [
                'id' => $unit->id,
                'description' => $unit->name
            ]
        ], 200);
    }

    public function update(UpdateUnitMeasureRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {

            $unitMeasure = UnitMeasure::find($request->get('unitMeasure_id'));

            $unitMeasure->name = $request->get('name');
            $unitMeasure->description = $request->get('description');
            $unitMeasure->save();

            DB::commit();

        } catch ( \Throwable $e ) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json(['message' => 'Unidad de medida modificada con éxito.','url'=>route('unitmeasure.index')], 200);
    }

    public function destroy(DeleteUnitMeasureRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {

            $brand = UnitMeasure::find($request->get('unitMeasure_id'));

            $brand->delete();

            DB::commit();

        } catch ( \Throwable $e ) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json(['message' => 'Unidad de medida eliminada con éxito.'], 200);
    }

    public function create()
    {
        return view('unitMeasure.create');
    }

    public function edit($id)
    {
        $unitMeasure = UnitMeasure::find($id);
        return view('unitMeasure.edit', compact('unitMeasure'));
    }


    public function getUnitMeasure()
    {
        $unitMeasures = UnitMeasure::select('id', 'name', 'description')
            ->orderBy('name', 'asc')
            ->get();
        return datatables($unitMeasures)->toJson();

    }

    public function deleteMultiple(Request $request)
    {
        $ids = $request->input('ids');
        if (!$ids || !is_array($ids)) {
            return response()->json(['message' => 'Datos inválidos'], 400);
        }

        UnitMeasure::whereIn('id', $ids)->delete();

        return response()->json(['message' => 'Unidades eliminadas correctamente.']);
    }

}
