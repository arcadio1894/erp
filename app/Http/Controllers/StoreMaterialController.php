<?php

namespace App\Http\Controllers;

use App\StoreMaterial;
use Illuminate\Http\Request;

class StoreMaterialController extends Controller
{
    public function index()
    {
        $materials = StoreMaterial::with(['material', 'locations', 'vencimientos'])->get();
        return response()->json($materials);
    }

    public function store(Request $request)
    {
        $storeMaterial = StoreMaterial::create($request->only([
            'material_id', 'full_name', 'stock_max', 'stock_min',
            'unit_price', 'enable_status', 'codigo', 'isPack', 'quantityPack', 'store_id'
        ]));

        if ($request->locations) {
            foreach ($request->locations as $location) {
                $storeMaterial->locations()->create(['location' => $location]);
            }
        }

        if ($request->vencimientos) {
            foreach ($request->vencimientos as $v) {
                $storeMaterial->vencimientos()->create($v);
            }
        }

        return response()->json(['success' => true, 'data' => $storeMaterial]);
    }

    public function update(Request $request, $id)
    {
        $storeMaterial = StoreMaterial::findOrFail($id);
        $storeMaterial->update($request->only([
            'full_name', 'stock_max', 'stock_min', 'unit_price',
            'enable_status', 'codigo', 'isPack', 'quantityPack'
        ]));

        return response()->json(['success' => true, 'data' => $storeMaterial]);
    }

    public function destroy($id)
    {
        $storeMaterial = StoreMaterial::findOrFail($id);
        $storeMaterial->delete();

        return response()->json(['success' => true]);
    }
}
