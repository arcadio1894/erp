<?php

namespace App\Http\Controllers;

use App\Category;
use App\Http\Requests\DeleteSubcategoryRequest;
use App\Http\Requests\StoreSubcategoryRequest;
use App\Http\Requests\UpdateSubcategoryRequest;
use App\Subcategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SubcategoryController extends Controller
{
    public function index()
    {
        $subcategories = Subcategory::with('category')->get();
        //$permissions = Permission::all();
        $user = Auth::user();
        $permissions = $user->getPermissionsViaRoles()->pluck('name')->toArray();

        return view('subcategory.index', compact('subcategories', 'permissions'));
    }

    public function store(StoreSubcategoryRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {
            $created = [];

            foreach ($validated['subcategories'] as $sub) {
                $subcategory = Subcategory::create([
                    'name' => $sub['name'],
                    'description' => $sub['description'] ?? null,
                    'category_id' => $validated['category_id'],
                ]);
                $created[] = $subcategory;
            }

            DB::commit();

            return response()->json([
                'message' => 'Subcategorías guardadas con éxito.',
                'data' => $created
            ], 200);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function update(UpdateSubcategoryRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {

            $subcategory = Subcategory::find($request->get('subcategory_id'));

            $subcategory->name = $request->get('name');
            $subcategory->description = $request->get('description');
            $subcategory->category_id = $request->get('category_id');
            $subcategory->save();

            DB::commit();

        } catch ( \Throwable $e ) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json(['message' => 'Subcategoría modificada con éxito.','url'=>route('subcategory.index')], 200);
    }

    public function destroy(DeleteSubcategoryRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {

            $subcategory = Subcategory::find($request->get('subcategory_id'));

            $subcategory->delete();

            DB::commit();

        } catch ( \Throwable $e ) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json(['message' => 'Subcategoría eliminada con éxito.'], 200);
    }

    public function create()
    {
        $categories = Category::all();
        return view('subcategory.create', compact('categories'));
    }

    public function edit($id)
    {
        $categories = Category::all();
        $subcategory = Subcategory::with('category')->find($id);
        return view('subcategory.edit', compact('categories', 'subcategory'));
    }


    public function getSubcategories()
    {
        $subcategories = Subcategory::select('subcategories.*')
            ->join('categories', 'subcategories.category_id', '=', 'categories.id')
            ->orderBy('categories.name', 'asc')
            ->orderBy('subcategories.name', 'asc')
            ->with('category')
            ->get();

        return datatables($subcategories)->toJson();
    }

    public function deleteMultiple(Request $request)
    {
        $ids = $request->input('ids');
        if (!$ids || !is_array($ids)) {
            return response()->json(['message' => 'Datos inválidos'], 400);
        }

        Subcategory::whereIn('id', $ids)->delete();

        return response()->json(['message' => 'Unidades eliminadas correctamente.']);
    }
}
