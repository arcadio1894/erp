<?php

namespace App\Http\Controllers;

use App\MaterialUnpack;
use Illuminate\Http\Request;

class MaterialUnpackController extends Controller
{
    public function getChilds($id)
    {
        $childs = MaterialUnpack::where('parent_material_id', $id)
            ->with('childProduct:id,full_name') // Trae solo los campos necesarios
            ->get()
            ->map(function($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->childProduct->full_name ?? 'Sin nombre',
                ];
            });

        //dd($childs);

        return response()->json($childs);
    }

    public function destroy($id)
    {
        $unpack = MaterialUnpack::findOrFail($id);
        $unpack->delete();

        return response()->json(['success' => true]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'parent_material_id' => 'required|exists:materials,id',
            'child_material_id' => 'required|exists:materials,id',
        ]);

        // Opcional: evitar duplicados
        $exists = MaterialUnpack::where('parent_material_id', $request->parent_material_id)
            ->where('child_material_id', $request->child_material_id)
            ->exists();

        if ($exists) {
            return response()->json(['error' => 'Ya existe esa relación.'], 422);
        }

        MaterialUnpack::create([
            'parent_material_id' => $request->parent_material_id,
            'child_material_id' => $request->child_material_id,
        ]);

        return response()->json(['success' => true]);
    }

    public function getChildMaterials($id)
    {
        $childs = MaterialUnpack::where('parent_material_id', $id)
            ->with('childProduct:id,full_name')
            ->get()
            ->map(function($item) {
                return [
                    'id' => $item->child_material_id, // ID del material hijo
                    'name' => $item->childProduct->full_name ?? 'Sin nombre',
                ];
            });

        return response()->json($childs);
    }
}
