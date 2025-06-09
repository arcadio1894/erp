<?php

namespace App\Http\Controllers;

use App\Brand;
use App\Exampler;
use App\Http\Requests\DeleteExamplerRequest;
use App\Http\Requests\StoreExamplerRequest;
use App\Http\Requests\UpdateExamplerRequest;
use App\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ExamplerController extends Controller
{
    public function index()
    {
        $examplers = Exampler::with('brand')->get();
        //$permissions = Permission::all();
        $user = Auth::user();
        $permissions = $user->getPermissionsViaRoles()->pluck('name')->toArray();


        return view('exampler.index', compact('examplers', 'permissions'));
    }

    public function store(StoreExamplerRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {

            $exampler = Exampler::create([
                'name' => $request->get('name'),
                'comment' => $request->get('comment'),
                'brand_id' => $request->get('brand_id'),
            ]);

            DB::commit();
            return response()->json([
                'id' => $exampler->id,
                'exampler' => $exampler->name,
                'message' => 'Modelo guardado con éxito.'
            ], 200);

        } catch ( \Throwable $e ) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }

    }

    public function update(UpdateExamplerRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {

            $exampler = Exampler::find($request->get('exampler_id'));

            $exampler->name = $request->get('name');
            $exampler->comment = $request->get('comment');
            $exampler->brand_id = $request->get('brand_id');
            $exampler->save();

            DB::commit();

        } catch ( \Throwable $e ) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json(['message' => 'Modelo modificado con éxito.','url'=>route('exampler.index')], 200);
    }

    public function destroy(DeleteExamplerRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {

            $exampler = Exampler::find($request->get('exampler_id'));

            Material::where('exampler_id', $exampler->id)->update(['exampler_id' => null]);

            $exampler->delete();

            DB::commit();

        } catch ( \Throwable $e ) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json(['message' => 'Modelo eliminado con éxito.'], 200);
    }

    public function create()
    {
        $brands = Brand::all();
        return view('exampler.create', compact('brands'));
    }

    public function edit($id)
    {
        $brands = Brand::all();
        $exampler = Exampler::with('brand')->find($id);
        return view('exampler.edit', compact('exampler', 'brands'));
    }


    public function getExamplers()
    {
        $examplers = Exampler::with('brand')
            ->orderBy('name', 'asc')
            ->get();
        //dd($examplers);
        return datatables($examplers)->toJson();
        //dd(datatables($customers)->toJson());
    }

    public function deleteMultiple(Request $request)
    {
        $ids = $request->input('ids');
        if (!$ids || !is_array($ids)) {
            return response()->json(['message' => 'Datos inválidos'], 400);
        }

        $examplers = Exampler::whereIn('id', $ids)->get();

        foreach ($examplers as $exampler) {
            // Poner en null los materiales relacionados antes de eliminar el exampler
            Material::where('exampler_id', $exampler->id)->update(['exampler_id' => null]);

            // Ahora sí puedes eliminarlo sin error
            $exampler->delete();
        }

        return response()->json(['message' => 'Modelos eliminadas correctamente.']);
    }
}
