<?php

namespace App\Http\Controllers;

use App\Audit;
use App\CashMovement;
use App\CashRegister;
use App\Category;
use App\Material;
use App\MaterialDiscountQuantity;
use App\Notification;
use App\NotificationUser;
use App\Sale;
use App\SaleDetail;
use App\TipoPago;
use App\User;
use App\Worker;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade as PDF;

class PuntoVentaController extends Controller
{
    public function index()
    {
        $categories = Category::all();
        $tipoPagos = TipoPago::all();
        return view('puntoVenta.index', compact('categories', 'tipoPagos'));
    }

    public function getDataProducts(Request $request, $pageNumber = 1)
    {
        $perPage = 10;
        $category_id = $request->input('category_id');
        $product_search = $request->input('product_search');

        $query = Material::where('enable_status', 1)
            ->where('stock_current', '>', 0)
            ->orderBy('id');

        // Aplicar filtros si se proporcionan

        if ($category_id != "") {
            $query->where('category_id', $category_id);

        }

        if ($product_search != "") {
            $query->where('full_name', 'like','%'.$product_search.'%');

        }

        $totalFilteredRecords = $query->count();
        $totalPages = ceil($totalFilteredRecords / $perPage);

        $startRecord = ($pageNumber - 1) * $perPage + 1;
        $endRecord = min($totalFilteredRecords, $pageNumber * $perPage);

        $products = $query->skip(($pageNumber - 1) * $perPage)
            ->take($perPage)
            ->get();

        $arrayProducts = [];

        foreach ( $products as $product )
        {
            array_push($arrayProducts, [
                "id" => $product->id,
                "full_name" => $product->full_name,
                "category" => ($product->category_id == null) ? '': $product->category->description,
                "price" => ( $product->percentage_price == null || $product->percentage_price == 0) ? $product->list_price: $product->percentage_price,
                "image" => $product->image,
                "unit" => $product->unitMeasure->description,
                "tax" => ($product->type_tax_id == null) ? 18 : $product->typeTax->tax,
                "rating" => 4,
                "type" => ($product->tipo_venta_id == null) ? 0 : $product->tipoVenta->id,
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

        return ['data' => $arrayProducts, 'pagination' => $pagination];
    }

    public function getDiscountProduct(Request $request, $product_id)
    {
        $materialDiscounts = MaterialDiscountQuantity::where('material_id', $product_id)
            ->with(['discount', 'material'])
            ->join('discount_quantities', 'material_discount_quantities.discount_quantity_id', '=', 'discount_quantities.id')
            ->orderBy('discount_quantities.quantity', 'desc')
            ->select('material_discount_quantities.*') // Selecciona los campos de MaterialDiscountQuantity
            ->get();
        //dump($materialDiscounts);
        $quantity = $request->input('quantity');
        //dump("quantity ". $quantity);
        $arrayDiscount = [];

        foreach ( $materialDiscounts as $materialDiscount )
        {
            $cantidad = $materialDiscount->discount->quantity;
            //dump("quantity ". $quantity);
            //dump("cantidad ". $cantidad);
            if ( $quantity >= $cantidad )
            {
                $material = $materialDiscount->material;
                //dump($material);
                // Aquí es donde aplicas el descuento
                array_push($arrayDiscount, [
                    "id" => $materialDiscount->id,
                    "percentage" => $materialDiscount->percentage,
                    "haveDiscount" => true,
                    "valueDiscount" => round(($material->list_price - $material->unit_price)*($materialDiscount->percentage/100), 2),
                    "stringDiscount" => "<p>Dscto. ".$materialDiscount->discount->description." <strong class='float-right'> ".round(($material->list_price - $material->unit_price)*($materialDiscount->percentage/100), 2)."</strong></p>",
                ]);

                // Salir del bucle una vez que se ha encontrado el descuento aplicable
                break;
            }
        }

        if ( count($arrayDiscount) == 0 )
        {
            array_push($arrayDiscount, [
                "id" => null,
                "percentage" => null,
                "haveDiscount" => false,
                "valueDiscount" => 0,
                "stringDiscount" => ""
            ]);
        }

        //dump($arrayDiscount);

        return ['data' => $arrayDiscount];
    }

    public function store(Request $request)
    {
        //dd($request);
        $begin = microtime(true);
        $worker = Worker::where('user_id', Auth::user()->id)->first();
        DB::beginTransaction();
        try {
            $sale = Sale::create([
                'date_sale' => Carbon::now(),
                'serie' => $this->generateRandomString(),
                'worker_id' => $worker->id,
                'caja' => $worker->id,
                'currency' => 'PEN',
                'op_exonerada' => $request->get('total_exonerada'),
                'op_inafecta' => 0,
                'op_gravada' => $request->get('total_igv'),
                'igv' => $request->get('total_gravada'),
                'total_descuentos' => $request->get('total_descuentos'),
                'importe_total' => $request->get('total_importe'),
                'vuelto' => $request->get('total_vuelto'),
                'tipo_pago_id' => $request->get('tipo_pago')
            ]);

            $items = json_decode($request->get('items'));

            for ( $i=0; $i<sizeof($items); $i++ )
            {
                $saleDetail = SaleDetail::create([
                    'sale_id' => $sale->id,
                    'material_id' => $items[$i]->productId,
                    'price' => $items[$i]->productPrice,
                    'quantity' => $items[$i]->productQuantity,
                    'percentage_tax' => $items[$i]->productTax,
                    'total' => $items[$i]->productTotal,
                    'discount' => $items[$i]->productDiscount,
                ]);

                // TODO: Actualizar stock
                $material = Material::find($items[$i]->productId);
                $material->stock_current = $material->stock_current - $items[$i]->productQuantity;
                $material->save();
            }

            // Agregar movimientos a la caja
            $paymentType = $request->get('tipo_pago');
            $vuelto = $request->get('total_vuelto');
            $typeVuelto = $request->get('type_vuelto');

            // Mapear tipo de pago a los nombres de las cajas
            $paymentTypeMap = [
                1 => 'yape',
                2 => 'plin',
                3 => 'bancario',
                4 => 'efectivo'
            ];

            // Obtener la caja del tipo de pago
            $cashRegister = CashRegister::where('type', $paymentTypeMap[$paymentType])
                ->where('user_id', Auth::user()->id)
                ->where('status', 1) // Caja abierta
                ->latest()
                ->first();

            if (!isset($cashRegister)) {
                return response()->json(['message' => 'No hay caja abierta para este tipo de pago.'], 422);
            }

            // Crear el movimiento de ingreso (venta)
            CashMovement::create([
                'cash_register_id' => $cashRegister->id,
                'type' => 'sale', // Tipo de movimiento: venta
                'amount' => (float)$request->get('total_importe')+(float)$request->get('total_vuelto'),
                'description' => 'Venta registrada con tipo de pago: ' . $paymentTypeMap[$paymentType],
            ]);

            // Actualizar el saldo actual y el total de ventas en la caja
            $cashRegister->current_balance += (float)$request->get('total_importe')+(float)$request->get('total_vuelto');
            $cashRegister->total_sales += (float)$request->get('total_importe')+(float)$request->get('total_vuelto');
            $cashRegister->save();

            // Registrar el vuelto como egreso si el tipo de pago es efectivo y hay vuelto
            if ($vuelto && $paymentType == 4) {
                // Mapear el type_vuelto (la caja desde donde se dará el vuelto)
                $typeVueltoMap = [
                    'efectivo' => 'efectivo',
                    'yape' => 'yape',
                    'plin' => 'plin',
                    'bancario' => 'bancario'
                ];

                // Obtener la caja para el vuelto
                $vueltoCashRegister = CashRegister::where('type', $typeVueltoMap[$typeVuelto])
                    ->where('user_id', Auth::user()->id)
                    ->where('status', 1) // Caja abierta
                    ->latest()
                    ->first();

                if (!isset($vueltoCashRegister)) {
                    return response()->json(['message' => 'No hay caja abierta para dar el vuelto.'], 422);
                }

                // Crear el movimiento de egreso (vuelto)
                CashMovement::create([
                    'cash_register_id' => $vueltoCashRegister->id,
                    'type' => 'expense', // Tipo de movimiento: egreso
                    'amount' => $vuelto,
                    'description' => 'Vuelto entregado de la venta',
                ]);

                // Actualizar el saldo de la caja del vuelto
                $vueltoCashRegister->current_balance -= $vuelto;
                $vueltoCashRegister->total_expenses += $vuelto;
                $vueltoCashRegister->save();
            }

            // Crear notificacion
            $notification = Notification::create([
                'content' => 'Venta creada por '.Auth::user()->name,
                'reason_for_creation' => 'create_quote',
                'user_id' => Auth::user()->id,
                'url_go' => route('puntoVenta.index')
            ]);

            // Roles adecuados para recibir esta notificación admin, logistica
            $users = User::role(['admin', 'principal' , 'logistic'])->get();
            foreach ( $users as $user )
            {
                if ( $user->id != Auth::user()->id )
                {
                    foreach ( $user->roles as $role )
                    {
                        NotificationUser::create([
                            'notification_id' => $notification->id,
                            'role_id' => $role->id,
                            'user_id' => $user->id,
                            'read' => false,
                            'date_read' => null,
                            'date_delete' => null
                        ]);
                    }
                }
            }

            $end = microtime(true) - $begin;

            Audit::create([
                'user_id' => Auth::user()->id,
                'action' => 'Guardar venta',
                'time' => $end
            ]);
            DB::commit();
        } catch ( \Throwable $e ) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }
        return response()->json(['message' => 'Venta guardada con éxito.',
            'sale_id' => $sale->id,
            'url_print' => route('puntoVenta.print', $sale->id)
        ], 200);

    }

    public function generateRandomString($length = 25) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    public function printDocumentSale($id)
    {
        $sale = Sale::where('id', $id)
            ->with('worker')
            ->with('tipoPago')
            ->with(['details' => function ($query) {
                $query->with(['material']);
            }])->first();

        $view = view('exports.salePdf', compact('sale'));

        $pdf = PDF::loadHTML($view);
        // Configurar el tamaño de la página a un tamaño personalizado para el ticket
        //$customPaper = array(0, 0, 226.77, 650); // Ancho y alto en puntos (1 pulgada = 72 puntos)
        //$customPaper = array(0, 0, 250, 650);
        //$pdf->setPaper($customPaper);
        $customPaper = array(0, 0, 250, 9999); // Ancho fijo, altura suficientemente grande para el contenido
        $pdf->setPaper($customPaper, 'portrait');
        $pdf->setOptions([
            'default_font_size' => 12,
            'default_font' => 'Arial',
            'isHtml5ParserEnabled' => true,
            'isPhpEnabled' => true,
            'default_margin' => [
                'top'    => 0,
                'right'  => 0,
                'bottom' => 0,
                'left'   => 0,
            ],
        ]);


        $length = 5;
        $codeOrder = ''.str_pad($id,$length,"0", STR_PAD_LEFT);
        $name = "comprobante_electronicoB". $codeOrder . '_'. $sale->serie . '.pdf';

        return $pdf->stream($name);

    }
}
