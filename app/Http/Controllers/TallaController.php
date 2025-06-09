<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTallaRequest;
use App\Http\Requests\UpdateTallaRequest;
use App\Talla;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TallaController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $permissions = $user->getPermissionsViaRoles()->pluck('name')->toArray();

        return view('quality.index', compact( 'permissions'));
    }

    public function create()
    {
        return view('quality.create');
    }

    public function store(StoreTallaRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {

            $unit = Talla::create([
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
            'message' => 'Talla guardada con éxito.',
            'data' => [
                'id' => $unit->id,
                'description' => $unit->name
            ]
        ], 200);
    }

    public function edit($id)
    {
        $quality = Talla::find($id);
        return view('quality.edit', compact('quality'));
    }

    public function update(UpdateTallaRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {

            $warrant = Talla::find($request->get('quality_id'));

            $warrant->name = $request->get('name');
            $warrant->description = $request->get('description');
            $warrant->save();

            DB::commit();

        } catch ( \Throwable $e ) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json(['message' => 'Talla de modificada con éxito.','url'=>route('talla.index')], 200);
    }

    public function destroy(Request $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {

            $warrant = Talla::find($request->get('quality_id'));

            $warrant->delete();

            DB::commit();

        } catch ( \Throwable $e ) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json(['message' => 'Género de material eliminada con éxito.'], 200);
    }

    public function getTallas()
    {
        $warrants = Talla::select('id', 'name', 'description')
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

        Talla::whereIn('id', $ids)->delete();

        return response()->json(['message' => 'Tallaa eliminadas correctamente.']);
    }
}
