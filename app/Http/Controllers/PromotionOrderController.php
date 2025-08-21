<?php

namespace App\Http\Controllers;

use App\DiscountQuantity;
use App\Material;
use App\MaterialDiscountQuantity;
use App\PromotionLimit;
use App\PromotionOrder;
use App\PromotionUsage;
use App\SeasonalPromotion;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PromotionOrderController extends Controller
{
    // ⚙️ Array global de nombres de tablas promocionales
    private $promotionTables = [
        'promotion_limits',
        'discount_quantities',
        'seasonal_promotions',
        // Puedes añadir más según tus necesidades
    ];

    public function index()
    {
        $user = Auth::user();
        $permissions = $user->getPermissionsViaRoles()->pluck('name')->toArray();

        // Obtenemos los nombres ya registrados
        $existing = PromotionOrder::pluck('table_name')->toArray();

        $maxOrder = PromotionOrder::max('order') ?? 0;

        foreach ($this->promotionTables as $tableName) {
            if (!in_array($tableName, $existing)) {
                $maxOrder++;
                PromotionOrder::create([
                    'table_name' => $tableName,
                    'order' => $maxOrder,
                ]);
            }
        }

        // Listar ordenados
        $promotionOrders = PromotionOrder::orderBy('order')->get();

        return view('promotionOrder.index', compact('promotionOrders', 'permissions'));
    }

    public function getDataPromotions(Request $request, $pageNumber = 1)
    {
        $perPage = 10;

        $query = PromotionOrder::orderBy('order', 'ASC');

        // Aplicar filtros si se proporcionan

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
                "id" => $promotion->id,
                "table" => $promotion->table_name,
                "order" => $promotion->order,
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

    public function updateOrder(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:promotion_orders,id',
            'direction' => 'required|in:up,down',
        ]);

        $promotion = PromotionOrder::find($request->id);
        $currentOrder = $promotion->order;

        $swapWith = PromotionOrder::where('order', $request->direction === 'up' ? '<' : '>', $currentOrder)
            ->orderBy('order', $request->direction === 'up' ? 'desc' : 'asc')
            ->first();

        if ($swapWith) {
            DB::transaction(function () use ($promotion, $swapWith) {
                $tempOrder = $promotion->order;
                $promotion->order = $swapWith->order;
                $swapWith->order = $tempOrder;
                $promotion->save();
                $swapWith->save();
            });

            return response()->json(['success' => true]);
        }

        return response()->json(['success' => false, 'message' => 'No se puede mover más.']);
    }

    public function checkPromotions(Request $request)
    {
        $request->validate([
            'material_id' => 'required|exists:materials,id',
            'quantity' => 'required|numeric|min:0.01',
        ]);

        $material = Material::with('category')->find($request->material_id);
        $quantity = $request->quantity;
        $today = Carbon::now()->format('Y-m-d');

        $results = [];

        $orders = PromotionOrder::orderBy('order', 'asc')->get();

        foreach ($orders as $promotionOrder) {
            $table = $promotionOrder->table_name;

            // 1️⃣ Si es seasonal_promotions (por categoría)
            if ($table === 'seasonal_promotions') {
                if ($material->category_id) {
                    $promo = SeasonalPromotion::where('category_id', $material->category_id)
                        ->where('enable', true)
                        ->whereDate('start_date', '<=', $today)
                        ->whereDate('end_date', '>=', $today)
                        ->first();

                    if ($promo) {
                        $results[] = [
                            'type' => 'seasonal',
                            'source' => 'seasonal_promotions',
                            'category_id' => $material->category_id,
                            'discount' => $promo->discount_percentage,
                            'valid_until' => $promo->end_date,
                        ];
                    }
                }
            }

            // 2️⃣ Si es material_discount_quantities
            elseif ($table === 'discount_quantities') {
                $record = MaterialDiscountQuantity::where('material_id', $material->id)->first();

                if ($record) {
                    $discount = DiscountQuantity::find($record->discount_quantity_id);
                    if ($discount) {
                        $results[] = [
                            'type' => 'quantity_discount',
                            'source' => 'material_discount_quantities',
                            'material_id' => $material->id,
                            'percentage' => $record->percentage,
                            'extra_info' => $discount->toArray()
                        ];
                    }
                }
            }

            // 3️⃣ Si es promotion_limits
            elseif ($table === 'promotion_limits') {
                $promo = PromotionLimit::where('material_id', $material->id)
                    ->whereDate('start_date', '<=', $today)
                    ->whereDate('end_date', '>=', $today)
                    ->first();

                if ($promo) {
                    // 🔎 Buscar el uso de la promo
                    $query = PromotionUsage::where('promotion_limit_id', $promo->id);

                    if ($promo->applies_to === 'worker') {
                        $query->where('user_id', auth()->id());
                    }

                    $usage = $query->first();

                    $used = $usage ? $usage->used_quantity : 0;
                    $remaining = $promo->limit_quantity - $used;

                    if ($remaining > 0) {
                        $results[] = [
                            'type' => 'limit',
                            'source' => 'promotion_limits',
                            'material_id' => $material->id,
                            'limit_quantity' => $promo->limit_quantity,
                            'remaining_quantity' => $remaining,   // ✅ ahora sabes lo que queda
                            'price_type' => $promo->price_type,
                            'percentage' => $promo->percentage,
                            'promo_price' => $promo->promo_price,
                        ];
                    }
                }
            }

            // ➕ Puedes añadir más condiciones aquí según nuevas tablas en PromotionOrder
        }

        return response()->json([
            'success' => true,
            'promotions' => $results,
        ]);
    }
}
