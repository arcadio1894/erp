<?php

namespace App\Http\Controllers;

use App\Audit;
use App\CashMovement;
use App\CashRegister;
use App\Category;
use App\DataGeneral;
use App\Mail\StockLowNotificationMail;
use App\PorcentageQuote;
use Illuminate\Support\Facades\Mail;
use App\Material;
use App\MaterialDiscountQuantity;
use App\Notification;
use App\NotificationUser;
use App\Sale;
use App\SaleDetail;
use App\StoreMaterial;
use App\TipoPago;
use App\User;
use App\Worker;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Session\Store;
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

        $materialIds = StoreMaterial::where('enable_status', 1)
            ->pluck('material_id')
            ->unique()
            ->toArray();

        $query = Material::where('enable_status', 1)
            ->whereIn('id', $materialIds)
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
                "price" => $product->list_price,
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

        $dataGeneralIGV = PorcentageQuote::where('name', 'igv')->first();
        $igvdata = $dataGeneralIGV->value;

        $igv = round((100 + $igvdata)/100 , 2 );
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
                    "valueDiscount" => round(($material->list_price/$igv)*($materialDiscount->percentage/100), 2),
                    "stringDiscount" => "<p>Dscto. ".$materialDiscount->discount->description." <strong class='float-right'> ".round(($material->list_price/$igv)*($materialDiscount->percentage/100), 2)."</strong></p>",
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

            $items = json_decode($request->get('items'));

            // Validar que haya stock suficiente para todos los productos ANTES de crear la venta
            foreach ($items as $item) {
                $material = Material::find($item->productId);
                if (!$material) {
                    throw new \Exception("Material con ID {$item->productId} no encontrado.");
                }

                $currentQuantityStore = StoreMaterial::where('material_id', $material->id)
                    ->sum('stock_current');

                if ($currentQuantityStore < $item->productQuantity) {
                    throw new \Exception("Stock insuficiente para el producto '{$material->description}'. Disponible: {$material->stock_current}, requerido: {$item->productQuantity}");
                }
            }

            // TODO: VALIDACIONES DE INVOICE
            // Determinar tipo de documento SUNAT
            $type_document = null;
            $numero_documento_cliente = null;
            $nombre_cliente = null;
            $direccion_cliente = null;
            $tipo_documento_cliente = null;
            $email_cliente = null;

            // Asignar según el tipo de comprobante
            if ($request->invoice_type === 'boleta') {
                $type_document = '03'; // Boleta
                $numero_documento_cliente = $request->dni;
                $nombre_cliente = $request->name;
                $direccion_cliente = $request->address;
                $tipo_documento_cliente = '1'; // DNI
                $email_cliente = $request->email_invoice_boleta;
            } elseif ($request->invoice_type === 'factura') {
                $type_document = '01'; // Factura
                $numero_documento_cliente = $request->ruc;
                $nombre_cliente = $request->razon_social;
                $direccion_cliente = $request->direccion_fiscal;
                $tipo_documento_cliente = '6'; // RUC
                $email_cliente = $request->email_invoice_factura;
            }

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
                'tipo_pago_id' => $request->get('tipo_pago'),

                // Facturación
                'type_document' => $type_document,
                'numero_documento_cliente' => $numero_documento_cliente,
                'tipo_documento_cliente' => $tipo_documento_cliente,
                'nombre_cliente' => $nombre_cliente,
                'direccion_cliente' => $direccion_cliente,
                'email_cliente' => $email_cliente,

                // Los siguientes campos se llenarán más adelante cuando se genere el comprobante con Greenter
                'serie_sunat' => null,
                'numero' => null,
                'sunat_ticket' => null,
                'sunat_status' => null,
                'sunat_message' => null,
                'xml_path' => null,
                'cdr_path' => null,
                'fecha_emision' => null,
            ]);

            //$items = json_decode($request->get('items'));

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
                // TODO: Actualizar el stock del storeMaterial con la ubicacion que se este enviando
                $material = Material::find($items[$i]->productId);
                $material->stock_current = $material->stock_current - $items[$i]->productQuantity;
                $material->save();

                $cantidadVendida = $items[$i]->productQuantity;
                $storeMaterials = StoreMaterial::where('material_id', $material->id)
                    ->orderBy('id') // Opcional: para tener un orden consistente
                    ->get();

                foreach ($storeMaterials as $storeMaterial) {
                    if ($cantidadVendida <= 0) {
                        break;
                    }

                    $stockDisponible = $storeMaterial->stock_current; // Asumimos que esta columna representa el stock actual

                    if ($stockDisponible >= $cantidadVendida) {
                        // Descontamos solo lo que queda
                        $storeMaterial->stock_current -= $cantidadVendida;
                        $storeMaterial->save();
                        $cantidadVendida = 0;
                    } else {
                        // Descontamos todo el stock de este storeMaterial
                        $cantidadVendida -= $stockDisponible;
                        $storeMaterial->stock_current = 0;
                        $storeMaterial->save();
                    }
                }

                $storeMaterialFinal = StoreMaterial::where('material_id', $material->id)
                    ->orderBy('id') // Opcional: para tener un orden consistente
                    ->sum('stock_current');

                $storeMaterialMinData = DataGeneral::where('name', 'store_material_min')->first();

                //$storeMaterialMin = $storeMaterialMinData->valueNumber;

                /*if ($storeMaterialFinal <= $storeMaterialMin)
                {
                    // TODO: Crear notificaciones
                    $this->manageNotifications($material);
                }*/

                $this->manageNotifications($material);
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
            if ( $paymentType != 3 ) {
                // Crear el movimiento de ingreso (venta)
                CashMovement::create([
                    'cash_register_id' => $cashRegister->id,
                    'type' => 'sale', // Tipo de movimiento: venta
                    'amount' => (float)$request->get('total_importe')+(float)$request->get('total_vuelto'),
                    'description' => 'Venta registrada con tipo de pago: ' . $paymentTypeMap[$paymentType],
                    'sale_id' => $sale->id
                ]);

                // Actualizar el saldo actual y el total de ventas en la caja
                $cashRegister->current_balance += (float)$request->get('total_importe')+(float)$request->get('total_vuelto');
                $cashRegister->total_sales += (float)$request->get('total_importe')+(float)$request->get('total_vuelto');
                $cashRegister->save();
            } else {
                // Crear el movimiento de ingreso (venta)
                CashMovement::create([
                    'cash_register_id' => $cashRegister->id,
                    'type' => 'sale', // Tipo de movimiento: venta
                    'amount' => (float)$request->get('total_importe')+(float)$request->get('total_vuelto'),
                    'description' => 'Venta registrada con tipo de pago: ' . $paymentTypeMap[$paymentType],
                    'regularize' => 0,
                    'sale_id' => $sale->id
                ]);
            }


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
                    'sale_id' => $sale->id
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

    public function manageNotifications(Material $material)
    {
        $dataGeneralTypeNotificationPopUp = DataGeneral::where('name', 'send_notification_store_pop_up')->first();
        $dataGeneralTypeNotificationCampana = DataGeneral::where('name', 'send_notification_store_campana')->first();
        $dataGeneralTypeNotificationTelegram = DataGeneral::where('name', 'send_notification_store_email')->first();
        $dataGeneralTypeNotificationEmail = DataGeneral::where('name', 'send_notification_store_telegram')->first();

        // Texto base
        $content = 'El producto '.$material->full_name.' está por agotarse.';

        $nameMaterial = $material->full_name;

        // Obtener usuarios con roles específicos (excepto el actual)
        $users = User::role(['admin', 'principal', 'logistic'])->where('id', '!=', Auth::id())->get();

        if ($dataGeneralTypeNotificationCampana && $dataGeneralTypeNotificationCampana->valueText === 's')
        {
            $notification = Notification::create([
                'content' => $content,
                'reason_for_creation' => 'check_stock',
                'user_id' => Auth::id(),
                'url_go' => route('material.index.store')
            ]);

            foreach ($users as $user) {
                foreach ($user->roles as $role) {
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

        if ($dataGeneralTypeNotificationPopUp && $dataGeneralTypeNotificationPopUp->valueText === 's')
        {
            $notification = Notification::create([
                'content' => $content,
                'reason_for_creation' => 'check_stock_pop_up',
                'user_id' => Auth::id(),
                'url_go' => route('material.index.store')
            ]);

            foreach ($users as $user) {
                foreach ($user->roles as $role) {
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

        if ($dataGeneralTypeNotificationEmail && $dataGeneralTypeNotificationEmail->valueText === 's')
        {
            foreach ($users as $user) {
                Mail::to($user->email)->queue(new StockLowNotificationMail($nameMaterial));
            }
        }

        // Si deseas dejar el código preparado para Telegram:
        if ($dataGeneralTypeNotificationTelegram && $dataGeneralTypeNotificationTelegram->valueText === 's')
        {
            $telegram = new TelegramController();

            // Enviar al canal de procesos
            $telegram->sendNotification('📦 El producto XYZ está por agotarse.', 'process');
        }


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

        $dataName = DataGeneral::where('name', 'empresa')->first();
        $dataRuc = DataGeneral::where('name', 'ruc')->first();
        $dataAddress = DataGeneral::where('name', 'address')->first();

        $nameEmpresa = $dataName->valueText;
        $ruc = $dataRuc->valueText;
        $address = $dataAddress->valueText;


        $view = view('exports.salePdf', compact('sale', 'nameEmpresa', 'ruc', 'address'));

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

    public function listar() {
        $registros = Sale::all();

        $arrayYears = $registros->pluck('created_at')->map(function ($date) {
            return Carbon::parse($date)->format('Y');
        })->unique()->toArray();

        $arrayYears = array_values($arrayYears);

        return view('puntoVenta.list', compact('arrayYears'));
    }

    public function getSalesAdmin(Request $request, $pageNumber = 1)
    {
        $perPage = 10;
        $code = $request->input('code');
        $year = $request->input('year');
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');

        if ( $startDate == "" || $endDate == "" )
        {
            $query = Sale::where('state_annulled', 0)->orderBy('date_sale', 'DESC');
        } else {
            $fechaInicio = Carbon::createFromFormat('d/m/Y', $startDate);
            $fechaFinal = Carbon::createFromFormat('d/m/Y', $endDate);

            $query = Sale::where('state_annulled', 0)->whereDate('date_sale', '>=', $fechaInicio)
                ->whereDate('date_sale', '<=', $fechaFinal)
                ->orderBy('date_sale', 'DESC');
        }

        // Aplicar filtros si se proporcionan
        if ($code != "") {
            $query->where('id', 'LIKE', '%'.$code.'%');

        }

        if ($year != "") {
            $query->whereYear('date_sale', $year);

        }

        $totalFilteredRecords = $query->count();
        $totalPages = ceil($totalFilteredRecords / $perPage);

        $startRecord = ($pageNumber - 1) * $perPage + 1;
        $endRecord = min($totalFilteredRecords, $pageNumber * $perPage);

        $sales = $query->skip(($pageNumber - 1) * $perPage)
            ->take($perPage)
            ->get();

        $arraySales = [];

        foreach ( $sales as $sale )
        {
            $tipo_comprobante = null;
            if ($sale->type_document == '01')
            {
                $tipo_comprobante = 'factura';
            } elseif ( $sale->type_document == '03' ) {
                $tipo_comprobante = 'boleta';
            }

            $tipo_documento_cliente = null;
            if ($sale->tipo_documento_cliente == 1)
            {
                $tipo_documento_cliente = 'dni';
            } elseif ( $sale->tipo_documento_cliente == 6 ) {
                $tipo_documento_cliente = 'ruc';
            }

            $totals = $sale->data_totals;

            array_push($arraySales, [
                "id" => $sale->id,
                "code" => "VENTA - ".$sale->id,
                "date" => ($sale->date_sale != null) ? $sale->formatted_sale_date : "",
                "currency" => ($sale->currency == 'PEN') ? 'Soles' : 'Dólares',
                //"total" => $sale->importe_total,
                "total" => number_format($totals['total_a_pagar'], 2, '.', ''),
                "tipo_pago" => ($sale->tipo_pago_id == null) ? 'Sin método de pago':$sale->tipoPago->description ,
                "nombre_cliente" => $sale->nombre_cliente,
                "tipo_documento_cliente" => $tipo_documento_cliente,
                "numero_documento_cliente" => $sale->numero_documento_cliente,
                "direccion_cliente" => $sale->direccion_cliente,
                "email_cliente" => $sale->email_cliente,
                "tipo_comprobante" => $tipo_comprobante
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

        return ['data' => $arraySales, 'pagination' => $pagination];
    }

    public function getOrderDetails($orderId)
    {

        $sale = Sale::with([
            'details.material'
        ])->find($orderId);

        if (!$sale) {
            return response()->json(['error' => 'Pedido no encontrado'], 404);
        }

        $details = $sale->details->map(function ($detail) {
            return [
                'code' => $detail->material->code,
                'producto' => $detail->material->full_name,
                'quantity' => $detail->quantity,
                'price' => $detail->price,
                'total' => number_format($detail->total, 2),
            ];
        });

        return response()->json(['details' => $details], 200);
    }

    public function anularOrder($id)
    {
        DB::beginTransaction();
        try {

            $sale = Sale::with('details')->find($id);

            if (!$sale) {
                return response()->json(['message' => 'Orden no encontrada'], 422);
            }

            if ($sale->state_annulled == 1) {
                return response()->json(['message' => 'La orden ya ha sido anulada previamente'], 422);
            }

            // Revertir el stock de cada detalle
            foreach ($sale->details as $detail) {
                $material = Material::find($detail->material_id);
                if ($material) {
                    $material->stock_current += $detail->quantity;
                    $material->save();
                }
            }

            $sale->state_annulled = 1;
            $sale->save();

            // Cambios en los movimientos
            // Revertir los movimientos de caja asociados a la orden
            $movements = CashMovement::where('sale_id', $sale->id)->get();
            $tipoPago = $sale->tipoPago->description;
            foreach ($movements as $movement) {
                // Si es un movimiento de tipo "sale"
                if ($movement->type === 'sale') {
                    // Caso de pago POS (no pago directo)
                    if ($tipoPago === 'POS') {
                        if ($movement->regularize == 0) {
                            // No se regularizó: se elimina el movimiento
                            $movement->delete();
                        } elseif ($movement->regularize == 1) {
                            // Si se regularizó, se crea un movimiento inverso de tipo "expense"
                            CashMovement::create([
                                'cash_register_id' => $movement->cash_register_id,
                                'sale_id'         => $sale->id,
                                'type'             => 'expense',
                                'amount'           => $movement->amount,
                                'description'      => 'Reversión de venta (POS regularizado) por anulación de orden',
                                'regularize'       => $movement->regularize
                            ]);
                            $cashRegister = CashRegister::find($movement->cash_register_id);
                            $cashRegister->current_balance -= $movement->amount;
                            $cashRegister->total_sales    -= $movement->amount;
                            $cashRegister->total_incomes  -= $movement->amount;
                            $cashRegister->total_expenses += $movement->amount;
                            $cashRegister->save();
                        }
                    } else {
                        // Para ventas normales, se revierte creando un movimiento de tipo "expense"
                        CashMovement::create([
                            'cash_register_id' => $movement->cash_register_id,
                            'sale_id'         => $sale->id,
                            'type'             => 'expense',
                            'amount'           => $movement->amount,
                            'description'      => 'Reversión de venta por anulación de orden',
                            'regularize'       => $movement->regularize
                        ]);
                        $cashRegister = CashRegister::find($movement->cash_register_id);
                        $cashRegister->current_balance -= $movement->amount;
                        $cashRegister->total_sales    -= $movement->amount;
                        $cashRegister->total_incomes  -= $movement->amount;
                        $cashRegister->total_expenses += $movement->amount;
                        $cashRegister->save();
                    }
                }
                // Si es un movimiento de tipo "expense" (por ejemplo, el vuelto)
                elseif ($movement->type === 'expense') {
                    // Se revierte creando un movimiento de tipo "income"
                    CashMovement::create([
                        'cash_register_id' => $movement->cash_register_id,
                        'sale_id'          => $sale->id,
                        'type'             => 'income',
                        'amount'           => $movement->amount,
                        'description'      => 'Reversión de gasto (vuelto) por anulación de orden',
                        'subtype'          => $movement->subtype,
                        'regularize'       => $movement->regularize
                    ]);
                    $cashRegister = CashRegister::find($movement->cash_register_id);
                    $cashRegister->current_balance += $movement->amount;
                    $cashRegister->total_incomes  += $movement->amount;
                    $cashRegister->total_expenses -= $movement->amount;
                    $cashRegister->save();
                }
            }

            DB::commit();

            return response()->json(['message' => 'Orden anulada con éxito'], 200);

        } catch ( \Throwable $e ) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }

    }

    public function updateInvoiceData(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:sales,id',
            'type_document' => 'required|in:boleta,factura',
        ]);

        $order = Sale::findOrFail($request->order_id);

        if ($request->type_document === 'boleta') {
            $order->type_document = '03';
            $order->numero_documento_cliente = $request->dni;
            $order->nombre_cliente = $request->name;
            $order->email_cliente = $request->email;
        } elseif ($request->type_document === 'factura') {
            $order->type_document = '01';
            $order->numero_documento_cliente = $request->ruc;
            $order->nombre_cliente = $request->razon_social;
            $order->direccion_cliente = $request->direccion_fiscal;
            $order->email_cliente = $request->email;
        }

        $order->save();

        return response()->json(['message' => 'Datos actualizados correctamente.']);
    }
}
