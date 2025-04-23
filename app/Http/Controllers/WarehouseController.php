<?php

namespace App\Http\Controllers;

use App\Area;
use App\Container;
use App\Http\Requests\DeleteWarehouseRequest;
use App\Http\Requests\StoreWarehouseRequest;
use App\Http\Requests\UpdateWarehouseRequest;
use App\Level;
use App\Location;
use App\Position;
use App\Shelf;
use App\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WarehouseController extends Controller
{
    public function index($area)
    {
        $area = Area::find($area);
        $user = Auth::user();
        $permissions = $user->getPermissionsViaRoles()->pluck('name')->toArray();

        //dd($area);
        return view('inventory.warehouses', compact('area', 'permissions'));
    }

    public function create()
    {
        //
    }

    public function store(StoreWarehouseRequest $request)
    {
        $validated = $request->validated();

        $warehouse = Warehouse::create([
            'name' => $request->get('name'),
            'comment' => $request->get('comment'),
            'area_id' => $request->get('area_id'),
        ]);

        return response()->json(['message' => 'Almacén guardado con éxito.'], 200);

    }

    public function show(Warehouse $warehouse)
    {
        //
    }

    public function edit(Warehouse $warehouse)
    {
        //
    }

    public function update(UpdateWarehouseRequest $request)
    {
        $validated = $request->validated();

        $warehouse = Warehouse::find($request->get('warehouse_id'));

        $warehouse->name = $request->get('name');
        $warehouse->comment = $request->get('comment');

        $warehouse->save();

        return response()->json(['message' => 'Almacén modificado con éxito.'], 200);

    }

    public function destroy(DeleteWarehouseRequest $request)
    {
        $validated = $request->validated();

        $warehouse = Warehouse::find($request->get('warehouse_id'));

        $warehouse->delete();

        return response()->json(['message' => 'Almacén eliminado con éxito.'], 200);

    }

    public function getWarehouses( $id_area )
    {
        $warehouses = Warehouse::where('area_id', $id_area)->with('area')->get();

        //dd(datatables($materials)->toJson());
        return datatables($warehouses)->toJson();
    }

    public function generateStructure(Request $request)
    {
        $quantityAnaqueles = $request->input('quantityAnaqueles');
        $quantityNiveles = $request->input('quantityNiveles');
        $quantityColumnas = $request->input('quantityColumnas');
        $warehouse_id = $request->input('warehouse_id');
        $area_id = $request->input('area_id');

        $levelLetters = range('A', 'Z'); // A, B, C, ...

        for ($s = 1; $s <= $quantityAnaqueles; $s++) {
            // Crear Anaquel
            $shelf = Shelf::create([
                'name' => 'ANAQUEL ' . $s,
                'comment' => 'Generado automáticamente',
                'warehouse_id' => $warehouse_id,
            ]);

            for ($n = 0; $n < $quantityNiveles; $n++) {
                $levelLetter = $levelLetters[$n]; // A, B, C...

                // Crear Nivel
                $level = Level::create([
                    'name' => $levelLetter,
                    'comment' => 'Nivel ' . $levelLetter,
                    'shelf_id' => $shelf->id,
                ]);

                for ($c = 1; $c <= $quantityColumnas; $c++) {
                    // Crear Contenedor
                    $container = Container::create([
                        'name' => 'Columna ' . $c,
                        'comment' => 'Contenedor ' . $c,
                        'level_id' => $level->id,
                    ]);

                    // ⚠️ Aquí el número se calcula con base en anaquel y columna
                    $positionNumber = (($s - 1) * $quantityColumnas) + $c;
                    $positionName = $levelLetter . $positionNumber;

                    // Crear Posición
                    $position = Position::create([
                        'name' => $positionName,
                        'comment' => 'Posición única',
                        'container_id' => $container->id,
                    ]);

                    // Crear Ubicación
                    Location::create([
                        'area_id' => $area_id,
                        'warehouse_id' => $warehouse_id,
                        'shelf_id' => $shelf->id,
                        'level_id' => $level->id,
                        'container_id' => $container->id,
                        'position_id' => $position->id,
                        'description' => 'Ubicación generada automáticamente'
                    ]);
                }
            }
        }

        return response()->json(['message' => 'Estructura generada correctamente']);
    }

    public function showCreateVisual($warehouse_id)
    {
        $user = Auth::user();
        $permissions = $user->getPermissionsViaRoles()->pluck('name')->toArray();

        $shelves = Shelf::with('levels.containers.positions')
            ->where('warehouse_id', $warehouse_id)->get();

        return view('inventory.warehouse_visual', compact('shelves', 'permissions'));
    }

    public function toggleStatus(Request $request)
    {
        $position = Position::findOrFail($request->id);
        $position->status = $position->status === 'active' ? 'inactive' : 'active';
        $position->save();

        return response()->json([
            'success' => true,
            'new_status' => $position->status,
        ]);
    }
}
