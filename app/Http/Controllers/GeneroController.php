<?php

namespace App\Http\Controllers;

use App\Genero;
use App\Http\Requests\StoreGeneroRequest;
use App\Http\Requests\UpdateGeneroRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class GeneroController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $permissions = $user->getPermissionsViaRoles()->pluck('name')->toArray();

        return view('warrant.index', compact( 'permissions'));
    }

    public function create()
    {
        return view('warrant.create');
    }

    public function store(StoreGeneroRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {

            $unit = Genero::create([
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
            'message' => 'Género guardado con éxito.',
            'data' => [
                'id' => $unit->id,
                'description' => $unit->name
            ]
        ], 200);
    }

    public function edit($id)
    {
        $warrant = Genero::find($id);
        return view('warrant.edit', compact('warrant'));
    }

    public function update(UpdateGeneroRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {

            $warrant = Genero::find($request->get('warrant_id'));

            $warrant->name = $request->get('name');
            $warrant->description = $request->get('description');
            $warrant->save();

            DB::commit();

        } catch ( \Throwable $e ) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json(['message' => 'Género de material modificada con éxito.','url'=>route('genero.index')], 200);
    }

    public function destroy(Request $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {

            $warrant = Genero::find($request->get('warrant_id'));

            $warrant->delete();

            DB::commit();

        } catch ( \Throwable $e ) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json(['message' => 'Género de material eliminada con éxito.'], 200);
    }

    public function getGeneros()
    {
        $warrants = Genero::select('id', 'name', 'description')
            ->orderBy('name', 'asc')
            ->get();
        return datatables($warrants)->toJson();
        //dd(datatables($customers)->toJson());
    }

    public function deleteMultiple(Request $request)
    {
        $ids = $request->input('ids');
        if (!$ids || !is_array($ids)) {
            return response()->json(['message' => 'Datos inválidos'], 400);
        }

        Genero::whereIn('id', $ids)->delete();

        return response()->json(['message' => 'Géneros eliminados correctamente.']);
    }
}
