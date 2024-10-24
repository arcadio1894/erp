<?php

namespace App\Http\Controllers;

use App\Category;
use App\SeasonalPromotion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SeasonalPromotionController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $permissions = $user->getPermissionsViaRoles()->pluck('name')->toArray();
        return view('seasonalPromotion.index', compact('permissions'));
    }

    public function getDataPromotions(Request $request, $pageNumber = 1)
    {
        $perPage = 10;

        $query = SeasonalPromotion::where('enable', 1)->orderBy('id', 'desc');
        $totalFilteredRecords = $query->count();
        $totalPages = ceil($totalFilteredRecords / $perPage);

        $startRecord = ($pageNumber - 1) * $perPage + 1;
        $endRecord = min($totalFilteredRecords, $pageNumber * $perPage);

        $promotions = $query->skip(($pageNumber - 1) * $perPage)
            ->take($perPage)
            ->get();

        $array = [];

        foreach ( $promotions as $promotion )
        {
            array_push($array, [
                'id' => $promotion->id,
                'description' => $promotion->description,
                'category' => $promotion->category->name,
                'start_date' => ($promotion->start_date == null) ? "Sin fecha": $promotion->start_date->format('d/m/Y'),
                'end_date' => ($promotion->end_date == null) ? "Sin fecha": $promotion->end_date->format('d/m/Y'),
                'discount' => $promotion->discount_percentage,
            ]);
        }

        $pagination = [
            'currentPage' => (int)$pageNumber,
            'totalPages' => (int)$totalPages,
            'startRecord' => $startRecord,
            'endRecord' => $endRecord,
            'totalRecords' => $totalFilteredRecords,
            'totalFilteredRecords' => $totalFilteredRecords
        ];

        return ['data' => $array, 'pagination' => $pagination];
    }

    public function create()
    {
        $user = Auth::user();
        $permissions = $user->getPermissionsViaRoles()->pluck('name')->toArray();
        $categories = Category::all();
        return view('seasonalPromotion.create', compact('permissions', 'categories'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'description' => 'required',
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
                'message' => 'Promoción registrada con éxito.'
            ], 200);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }

    }

    public function destroy(Request $request)
    {

        DB::beginTransaction();
        try {

            $promotion = SeasonalPromotion::find($request->get('promotion_id'));

            $promotion->enable = 0;

            $promotion->save();

            DB::commit();

            return response()->json([
                'message' => 'Promoción eliminada con éxito.'
            ], 200);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }

    }
}
