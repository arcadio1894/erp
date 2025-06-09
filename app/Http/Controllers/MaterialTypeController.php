<?php

namespace App\Http\Controllers;

use App\Http\Requests\DeleteMaterialTypeRequest;
use App\Http\Requests\StoreMaterialTypeRequest;
use App\Http\Requests\UpdateMaterialTypeRequest;
use App\MaterialType;
use App\Subcategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MaterialTypeController extends Controller
{
 
    public function index()
    {
        $materialtypes = MaterialType::all();
        //$permissions = Permission::all();
        $user = Auth::user();
        $permissions = $user->getPermissionsViaRoles()->pluck('name')->toArray();

        return view('materialtype.index', compact('materialtypes', 'permissions'));
    }

    public function store(StoreMaterialTypeRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {

                $materialType = MaterialType::create([
                    'name' => $request->get('name'),
                    'description' => $request->get('description'),
                    'subcategory_id' => $request->get('subcategory_id'),
                ]);

            DB::commit();

        } catch ( \Throwable $e ) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }
        return response()->json(['message' => 'Tipo de Material guardado con éxito.'], 200);
    }

    public function update(UpdateMaterialTypeRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {

            $materialType = MaterialType::find($request->get('materialtype_id'));

            $materialType->name = $request->get('name');
            $materialType->description = $request->get('description');
            $materialType->subcategory_id = $request->get('subcategory_id');
            $materialType->save();

            DB::commit();

        } catch ( \Throwable $e ) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json(['message' => 'Tipo de material modificado con éxito.','url'=>route('materialtype.index')], 200);
    }

    public function destroy(DeleteMaterialTypeRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {

            $materialtype = MaterialType::find($request->get('materialtype_id'));

            $materialtype->delete();

            DB::commit();

        } catch ( \Throwable $e ) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json(['message' => 'Tipo de material eliminado con éxito.'], 200);
    }

    public function create()
    {
        $subcategories = Subcategory::all();
        return view('materialtype.create', compact('subcategories'));
    }

    public function edit($id)
    {
        $subcategories = Subcategory::all();
        $materialtype = MaterialType::find($id);
        return view('materialtype.edit', compact('materialtype', 'subcategories'));
    }

    public function getMaterialTypes()
    {
        $materialtypes = MaterialType::with('subcategory')
            ->orderBy('name', 'asc')
            ->get();
        return datatables($materialtypes)->toJson();
        //dd(datatables($customers)->toJson());
    }

    public function getTypesBySubCategory($id)
    {
        $types = MaterialType::where('subcategory_id', $id)->get();
        $array = [];
        foreach ( $types as $type )
        {
            array_push($array, ['id'=> $type->id, 'type' => $type->name]);
        }

        //dd($array);
        return $array;
    }

    public function deleteMultiple(Request $request)
    {
        $ids = $request->input('ids');
        if (!$ids || !is_array($ids)) {
            return response()->json(['message' => 'Datos inválidos'], 400);
        }

        DB::beginTransaction();

        try {
            $materialTypes = MaterialType::with('subtypes')->whereIn('id', $ids)->get();

            foreach ($materialTypes as $materialType) {
                // Eliminar subcategorías
                foreach ($materialType->subtypes as $subtype) {
                    $subtype->delete();
                }

                // Eliminar categoría
                $materialType->delete();
            }

            DB::commit();
            return response()->json(['message' => 'Tipos de material eliminados correctamente.']);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }
    
}
