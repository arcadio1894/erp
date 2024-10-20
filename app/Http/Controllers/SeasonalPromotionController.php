<?php

namespace App\Http\Controllers;

use App\SeasonalPromotion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SeasonalPromotionController extends Controller
{
    public function index()
    {
        $promotions = SeasonalPromotion::all();
        return view('seasonalPromotion.index', compact('promotions'));
    }

    public function create()
    {
        $user = Auth::user();
        $permissions = $user->getPermissionsViaRoles()->pluck('name')->toArray();
        return view('seasonalPromotion.create', compact('permissions'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'discount_percentage' => 'required|numeric|min:0|max:100',
        ]);

        DB::beginTransaction();
        try {

            SeasonalPromotion::create($request->all());

            DB::commit();

            return response()->json([
                'message' => 'Egreso registrado con éxito.'
            ], 200);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }

    }

}
