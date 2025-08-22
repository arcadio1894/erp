<?php

namespace App\Http\Controllers;

use App\Audit;
use App\Customer;
use App\DataGeneral;
use App\Equipment;
use App\EquipmentConsumable;
use App\EquipmentElectric;
use App\EquipmentMaterial;
use App\EquipmentTurnstile;
use App\EquipmentWorkday;
use App\EquipmentWorkforce;
use App\Http\Requests\StoreQuoteRequest;
use App\Http\Requests\UpdateQuoteRequest;
use App\ImagesQuote;
use App\Material;
use App\Notification;
use App\NotificationUser;
use App\OutputDetail;
use App\PaymentDeadline;
use App\PorcentageQuote;
use App\PromotionLimit;
use App\PromotionUsage;
use App\Quote;
use App\QuoteUser;
use App\UnitMeasure;
use App\User;
use App\Workforce;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade as PDF;
use Webklex\PDFMerger\Facades\PDFMergerFacade as PDFMerger;
use Intervention\Image\Facades\Image;

class QuoteSaleController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $permissions = $user->getPermissionsViaRoles()->pluck('name')->toArray();

        $registros = Quote::all();

        $arrayYears = $registros->pluck('date_quote')->map(function ($date) {
            return Carbon::parse($date)->format('Y');
        })->unique()->toArray();

        $arrayYears = array_values($arrayYears);

        $arrayCustomers = Customer::select('id', 'business_name')->get()->toArray();
        // created, send, confirm, raised, VB_finance, VB_operation, close, canceled
        $arrayStates = [
            ["value" => "created", "display" => "CREADAS"],
            ["value" => "send", "display" => "ENVIADAS"],
            ["value" => "confirm", "display" => "CONFIRMADAS"],
            ["value" => "raised", "display" => "ELEVADAS"],
            ["value" => "VB_operation", "display" => "VB OPERACIONES"],
            ["value" => "close", "display" => "FINALIZADOS"],
            ["value" => "canceled", "display" => "CANCELADAS"]
        ];

        $arrayUsers = User::select('id', 'name')->get()->toArray();

        return view('quoteSale.general', compact( 'permissions', 'arrayYears', 'arrayCustomers', 'arrayStates', 'arrayUsers'));

    }

    public function getMaterials(Request $request)
    {
        $materials = [];

        if ($request->filled('q')) {
            $search = trim($request->input('q'));

            $materials = Material::query()
                ->where('enable_status', 1)
                ->where('full_description', 'LIKE', "%{$search}%")
                ->get();
        } else {
            $materials = Material::where('enable_status', 1)->get();
        }

        return json_encode($materials);
    }

    public function getMaterialTotals()
    {
        $materials = Material::with('unitMeasure','typeScrap')
            ->where('enable_status', 1)->get();

        $array = [];
        foreach ( $materials as $material )
        {
            array_push($array, [
                'id'=> $material->id,
                'full_description' => $material->full_description,
                'unit' => $material->unitMeasure->name,
                'code' => $material->code,
                'type_scrap' => $material->typeScrap,
                'unit_measure' => $material->unitMeasure,
                'list_price' => $material->list_price,
                'enable_status' => $material->enable_status,
                'stock_current' => $material->stock_current,
                'state_update_price' => $material->state_update_price
            ]);
        }

        return $array;
    }

    public function create()
    {
        $begin = microtime(true);
        $user = Auth::user();
        $permissions = $user->getPermissionsViaRoles()->pluck('name')->toArray();
        $unitMeasures = UnitMeasure::all();
        $customers = Customer::all();
        $defaultConsumable = '(*)';
        $defaultElectric = '(e)';
        $consumables = Material::with('unitMeasure')->where('category_id', 2)->whereConsumable('description',$defaultConsumable)->orderBy('full_name', 'asc')->get();
        $electrics = Material::with('unitMeasure')->where('category_id', 2)->whereElectric('description',$defaultElectric)->orderBy('full_name', 'asc')->get();
        $workforces = Workforce::with('unitMeasure')->get();
        $maxId = Quote::max('id')+1;
        $length = 5;
        $codeQuote = 'COT-'.str_pad($maxId,$length,"0", STR_PAD_LEFT);
        $paymentDeadlines = PaymentDeadline::where('type', 'quotes')->get();
        $utility = PorcentageQuote::where('name', 'utility')->first();
        $rent = PorcentageQuote::where('name', 'rent')->first();
        $letter = PorcentageQuote::where('name', 'letter')->first();

        $materials = Material::with('unitMeasure','typeScrap')
            /*->where('enable_status', 1)*/->get();

        //dd($array);

        $array = [];

        $dataCurrency = DataGeneral::where('name', 'type_current')->first();
        $currency = $dataCurrency->valueText;

        $dataIgv = PorcentageQuote::where('name', 'igv')->first();
        $igv = $dataIgv->value;

        $end = microtime(true) - $begin;

        Audit::create([
            'user_id' => Auth::user()->id,
            'action' => 'Crear cotizacion VISTA',
            'time' => $end
        ]);


        return view('quoteSale.create', compact('currency', 'customers', 'unitMeasures', 'consumables', 'electrics', 'workforces', 'codeQuote', 'permissions', 'paymentDeadlines', 'utility', 'rent', 'letter', 'array', 'igv'));
    }

    public function store(StoreQuoteRequest $request)
    {
        //dd($request);
        $begin = microtime(true);
        $validated = $request->validated();

        DB::beginTransaction();
        try {
            $maxCode = Quote::max('id');
            $maxId = $maxCode + 1;
            $length = 5;
            //$codeQuote = 'COT-'.str_pad($maxId,$length,"0", STR_PAD_LEFT);

            $quote = Quote::create([
                'code' => '',
                'description_quote' => $request->get('code_description'),
                'observations' => $request->get('observations'),
                'date_quote' => ($request->has('date_quote')) ? Carbon::createFromFormat('d/m/Y', $request->get('date_quote')) : Carbon::now(),
                'date_validate' => ($request->has('date_validate')) ? Carbon::createFromFormat('d/m/Y', $request->get('date_validate')) : Carbon::now()->addDays(5),
                'way_to_pay' => ($request->has('way_to_pay')) ? $request->get('way_to_pay') : '',
                'delivery_time' => ($request->has('delivery_time')) ? $request->get('delivery_time') : '',
                'customer_id' => ($request->has('customer_id')) ? $request->get('customer_id') : null,
                'contact_id' => ($request->has('contact_id')) ? $request->get('contact_id') : null,
                'payment_deadline_id' => ($request->has('payment_deadline')) ? $request->get('payment_deadline') : null,
                'state' => 'created',
                // Guardamos los totales
                'descuento' => ($request->has('descuento')) ? $request->get('descuento') : null,
                'gravada' => ($request->has('gravada')) ? $request->get('gravada') : null,
                'igv_total' => ($request->has('igv_total')) ? $request->get('igv_total') : null,
                'total_importe' => ($request->has('total_importe')) ? $request->get('total_importe') : null
            ]);

            $codeQuote = '';
            if ( $maxId < $quote->id ){
                $codeQuote = 'COT-'.str_pad($quote->id,$length,"0", STR_PAD_LEFT);
                $quote->code = $codeQuote;
                $quote->save();
            } else {
                $codeQuote = 'COT-'.str_pad($maxId,$length,"0", STR_PAD_LEFT);
                $quote->code = $codeQuote;
                $quote->save();
            }

            QuoteUser::create([
                'quote_id' => $quote->id,
                'user_id' => Auth::user()->id,
            ]);

            $equipments = json_decode($request->get('equipments'));

            $totalQuote = 0;

            for ( $i=0; $i<sizeof($equipments); $i++ )
            {
                $equipment = Equipment::create([
                    'quote_id' => $quote->id,
                    'description' =>($equipments[$i]->description == "" || $equipments[$i]->description == null) ? '':$equipments[$i]->description,
                    'detail' => ($equipments[$i]->detail == "" || $equipments[$i]->detail == null) ? '':$equipments[$i]->detail,
                    'quantity' => $equipments[$i]->quantity,
                    'utility' => $equipments[$i]->utility,
                    'rent' => $equipments[$i]->rent,
                    'letter' => $equipments[$i]->letter,
                    'total' => $equipments[$i]->total
                ]);

                $totalMaterial = 0;

                $totalConsumable = 0;

                $totalElectric = 0;

                $totalWorkforces = 0;

                $totalTornos = 0;

                $totalDias = 0;

                $materials = $equipments[$i]->materials;

                $consumables = $equipments[$i]->consumables;

                $electrics = $equipments[$i]->electrics;

                $workforces = $equipments[$i]->workforces;

                $tornos = $equipments[$i]->tornos;

                $dias = $equipments[$i]->dias;

                for ( $j=0; $j<sizeof($materials); $j++ )
                {
                    $equipmentMaterial = EquipmentMaterial::create([
                        'equipment_id' => $equipment->id,
                        'material_id' => $materials[$j]->material->id,
                        'quantity' => (float) $materials[$j]->quantity,
                        'price' => (float) $materials[$j]->material->unit_price,
                        'length' => (float) ($materials[$j]->length == '') ? 0: $materials[$j]->length,
                        'width' => (float) ($materials[$j]->width == '') ? 0: $materials[$j]->width,
                        'percentage' => (float) $materials[$j]->quantity,
                        'state' => ($materials[$j]->quantity > $materials[$j]->material->stock_current) ? 'Falta comprar':'En compra',
                        'availability' => ($materials[$j]->quantity > $materials[$j]->material->stock_current) ? 'Agotado':'Completo',
                        'total' => (float) $materials[$j]->quantity*(float) $materials[$j]->material->unit_price,
                    ]);

                    $totalMaterial += $equipmentMaterial->total;
                }

                for ($k = 0; $k < sizeof($consumables); $k++) {
                    $material = Material::find($consumables[$k]->id);

                    // 🟢 VALIDAR PROMOCIÓN SI type_promo = limit
                    if ($consumables[$k]->type_promo == "limit") {
                        $promotion = PromotionLimit::where('material_id', $consumables[$k]->id)
                            ->whereDate('start_date', '<=', now())
                            ->whereDate('end_date', '>=', now())
                            ->first();

                        if ($promotion) {
                            // buscar uso
                            $query = PromotionUsage::where('promotion_limit_id', $promotion->id);

                            if ($promotion->applies_to == 'worker') {
                                $query->where('user_id', auth()->id());
                            }

                            $usage = $query->first();

                            if (!$usage) {
                                $usage = PromotionUsage::create([
                                    'promotion_limit_id' => $promotion->id,
                                    'user_id' => $promotion->applies_to == 'worker' ? auth()->id() : null,
                                    'used_quantity' => 0,
                                ]);
                            }

                            $requestedQty = (float) $consumables[$k]->quantity;
                            $remaining = $promotion->limit_quantity - $usage->used_quantity;

                            if ($remaining < $requestedQty) {
                                throw new \Exception("La promoción para {$material->full_name} ya no tiene suficiente cantidad disponible");
                            }

                            // actualizar consumo
                            $usage->increment('used_quantity', $requestedQty);
                        }
                    }

                    // 🟢 REGISTRAR EQUIPMENT CONSUMABLE
                    $equipmentConsumable = EquipmentConsumable::create([
                        'availability' => ((float) $consumables[$k]->quantity > $material->stock_current) ? 'Agotado' : 'Completo',
                        'state' => ((float) $consumables[$k]->quantity > $material->stock_current) ? 'Falta comprar' : 'En compra',
                        'equipment_id' => $equipment->id,
                        'material_id' => $consumables[$k]->id,
                        'quantity' => (float) $consumables[$k]->quantity,
                        'price' => (float) $consumables[$k]->price,
                        'valor_unitario' => (float) $consumables[$k]->valor,
                        'discount' => (float) $consumables[$k]->discount,
                        'total' => (float) $consumables[$k]->importe,
                        'type_promo' => $consumables[$k]->type_promo,
                    ]);

                    $totalConsumable += $equipmentConsumable->total;
                }

                for ( $k=0; $k<sizeof($electrics); $k++ )
                {
                    $equipmentElectric = EquipmentElectric::create([
                        'equipment_id' => $equipment->id,
                        'material_id' => $electrics[$k]->id,
                        'quantity' => (float) $electrics[$k]->quantity,
                        'price' => (float) $electrics[$k]->price,
                        'total' => (float) $electrics[$k]->total,
                    ]);

                    $totalElectric += $equipmentElectric->total;
                }

                for ( $w=0; $w<sizeof($workforces); $w++ )
                {
                    $equipmentWorkforce = EquipmentWorkforce::create([
                        'equipment_id' => $equipment->id,
                        'description' => $workforces[$w]->description,
                        'price' => (float) $workforces[$w]->price,
                        'quantity' => (float) $workforces[$w]->quantity,
                        'total' => (float) $workforces[$w]->total,
                        'unit' => $workforces[$w]->unit,
                    ]);

                    $totalWorkforces += $equipmentWorkforce->total;
                }

                for ( $r=0; $r<sizeof($tornos); $r++ )
                {
                    $equipmenttornos = EquipmentTurnstile::create([
                        'equipment_id' => $equipment->id,
                        'description' => $tornos[$r]->description,
                        'price' => (float) $tornos[$r]->price,
                        'quantity' => (float) $tornos[$r]->quantity,
                        'total' => (float) $tornos[$r]->total
                    ]);

                    $totalTornos += $equipmenttornos->total;
                }

                for ( $d=0; $d<sizeof($dias); $d++ )
                {
                    $equipmentdias = EquipmentWorkday::create([
                        'equipment_id' => $equipment->id,
                        'description' => $dias[$d]->description,
                        'quantityPerson' => (float) $dias[$d]->quantity,
                        'hoursPerPerson' => (float) $dias[$d]->hours,
                        'pricePerHour' => (float) $dias[$d]->price,
                        'total' => (float) $dias[$d]->total
                    ]);

                    $totalDias += $equipmentdias->total;
                }

                // TODO: Cambio el 16/01/2024
                //$totalEquipo = (($totalMaterial + $totalConsumable + $totalWorkforces + $totalTornos) * (float)$equipment->quantity)+$totalDias;
                $totalEquipo = (($totalMaterial + $totalConsumable + $totalElectric + $totalWorkforces + $totalTornos + $totalDias) * (float)$equipment->quantity);
                $totalEquipmentU = $totalEquipo*(($equipment->utility/100)+1);
                $totalEquipmentL = $totalEquipmentU*(($equipment->letter/100)+1);
                $totalEquipmentR = $totalEquipmentL*(($equipment->rent/100)+1);

                $totalQuote += $totalEquipmentR;

                $equipment->total = $totalEquipo;

                $equipment->save();
            }

            $quote->save();

            // TODO: Tratamiento de las imagenes de los planos
            $images = $request->planos;
            $descriptions = $request->descplanos;

            if ( isset($images) )
            {
                if ( count($images) != 0 && count($descriptions) )
                {
                    foreach ( $images as $key => $image )
                    {
                        $path = public_path().'/images/planos/';
                        $img = $image;

                        $filename = $quote->id .'_'. $this->generateRandomString(20). '.JPG';
                        $imgQuote = Image::make($img);
                        $imgQuote->orientate();
                        $imgQuote->save($path.$filename, 80, 'JPG');

                        ImagesQuote::create([
                            'quote_id' => $quote->id,
                            'description' => $descriptions[$key],
                            'image' => $filename,
                            'order' => $key+1
                        ]);

                    }
                }
            }


            // Crear notificacion
            $notification = Notification::create([
                'content' => $quote->code.' creada por '.Auth::user()->name,
                'reason_for_creation' => 'create_quote',
                'user_id' => Auth::user()->id,
                'url_go' => route('quote.edit', $quote->id)
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
                'action' => 'Guardar cotizacion POST',
                'time' => $end
            ]);
            DB::commit();
        } catch ( \Throwable $e ) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }
        return response()->json(['message' => 'Cotización '.$codeQuote.' guardada con éxito.'], 200);

    }

    public function getDataQuotesIndex(Request $request, $pageNumber = 1)
    {
        $perPage = 10;
        $description_quote = $request->input('description_quote');
        $year = $request->input('year');
        $code = $request->input('code');
        $order = $request->input('order');
        $customer = $request->input('customer');
        $creator = $request->input('creator');
        $stateQuote = $request->input('stateQuote');
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');

        if ( $startDate == "" || $endDate == "" )
        {
            $dateCurrent = Carbon::now('America/Lima');
            $date4MonthAgo = $dateCurrent->subMonths(6);
            $query = Quote::with('customer', 'deadline', 'users')
                /*->where('created_at', '>=', $date4MonthAgo)*/
                ->where('raise_status', 0)
                ->whereNotIn('state', ['canceled', 'expired'])
                ->where('state_active', 'open')
                ->orderBy('created_at', 'DESC');

        } else {
            $fechaInicio = Carbon::createFromFormat('d/m/Y', $startDate);
            $fechaFinal = Carbon::createFromFormat('d/m/Y', $endDate);

            $query = Quote::with('customer', 'deadline', 'users')
                ->where('raise_status', 0)
                ->whereNotIn('state', ['canceled', 'expired'])
                ->where('state_active', 'open')
                ->whereDate('date_quote', '>=', $fechaInicio)
                ->whereDate('date_quote', '<=', $fechaFinal)
                ->orderBy('created_at', 'DESC');
        }

        // Aplicar filtros si se proporcionan
        if ($description_quote) {
            $query->where('description_quote', 'LIKE', '%'.$description_quote.'%');
        }

        if ($year) {
            $query->whereYear('date_quote', $year);
        }

        if ($code) {
            $query->where('code', 'LIKE', '%'.$code.'%');

        }

        if ($order) {
            $query->where('code_customer', 'LIKE', '%'.$order.'%');

        }

        if ($customer) {
            $query->whereHas('customer', function ($query2) use ($customer) {
                $query2->where('customer_id', $customer);
            });

        }

        if ($creator != "")
        {
            $query->whereHas('users', function ($query2) use ($creator) {
                $query2->where('user_id', $creator);
            });
        }

        if ($stateQuote) {
            // Creada, Enviada, confirmada, elevada, VB Finanzas, VB Operaciones, Finalizadas, Anuladas
            // created, send, confirm, raised, VB_finance, VB_operation, close, canceled
            $query->where(function ($subquery) use ($stateQuote) {
                $subquery->where(function ($q) use ($stateQuote) {
                    switch ($stateQuote) {
                        case 'created':
                            $q->where('state', 'created')
                                ->where(function ($q2) {
                                    $q2->where('send_state', 0)
                                        ->orWhere('send_state', false);
                                });
                            break;
                        case 'send':
                            $q->where('state', 'created')
                                ->where(function ($q2) {
                                    $q2->where('send_state', 1)
                                        ->orWhere('send_state', true);
                                });
                            break;
                        case 'close':
                            $q->where('state_active', 'close');
                            break;
                        case 'VB_finance':
                            $q->where('state', 'confirmed')
                                ->where('raise_status', 1)
                                ->where('vb_finances', 1)
                                ->whereNull('vb_operations');
                            break;
                        case 'VB_operation':
                            $q->where('state', 'confirmed')
                                ->where('raise_status', 1)
                                ->where('vb_finances', 1)
                                ->where('vb_operations', 1);
                            break;
                        case 'raised':
                            $q->where('state', 'confirmed')
                                ->where('raise_status', 1)
                                ->where('state', '<>','canceled')
                                ->where('state_active', '<>','close')
                                ->where(function ($q2) {
                                    $q2->where('vb_finances', null)
                                        ->where('vb_operations', null);
                                });
                            break;
                        case 'confirm':
                            $q->where('state', 'confirmed')
                                ->where('raise_status', 0);
                            break;
                        case 'canceled':
                            $q->where('state', 'canceled');
                            break;
                        default:
                            // Lógica por defecto o manejo de errores si es necesario
                            break;
                    }
                });
            });
        }

        //$query = FinanceWork::with('quote', 'bank');

        $totalFilteredRecords = $query->count();
        $totalPages = ceil($totalFilteredRecords / $perPage);

        $startRecord = ($pageNumber - 1) * $perPage + 1;
        $endRecord = min($totalFilteredRecords, $pageNumber * $perPage);

        $quotes = $query->skip(($pageNumber - 1) * $perPage)
            ->take($perPage)
            ->get();

        //dd($proformas);

        $array = [];

        foreach ( $quotes as $quote )
        {
            $state = "";
            $stateText = "";
            if ( $quote->state === 'created' ) {
                if ( $quote->send_state == 1 || $quote->send_state == true )
                {
                    $state = 'send';
                    $stateText = '<span class="badge bg-warning">Enviado</span>';
                } else {
                    $state = 'created';
                    $stateText = '<span class="badge bg-primary">Creada</span>';
                }
            }
            if ($quote->state_active === 'close'){
                $state = 'close';
                $stateText = '<span class="badge bg-danger">Finalizada</span>';
            } else {
                if ($quote->state === 'confirmed' && $quote->raise_status === 1){
                    if ( $quote->vb_finances == 1 && $quote->vb_operations == null )
                    {
                        $state = 'raise';
                        $stateText = '<span class="badge bg-success">Elevada</span>';
                        /*$state = 'VB_finance';
                        $stateText = '<span class="badge bg-gradient-navy text-white">V.B. Finanzas <br>'. $quote->date_vb_finances->format("d/m/Y") .' </span>';
                    */
                    } else {
                        if ( /*$quote->vb_finances == 1 &&*/ $quote->vb_operations == 1 )
                        {
                            $state = 'VB_operation';
                            $stateText = '<span class="badge bg-gradient-orange text-white">V.B. Operaciones <br> '.$quote->date_vb_operations->format("d/m/Y").'</span>';
                        } else {
                            if ( $quote->vb_operations == 0 || $quote->vb_operations == null )
                            {
                                $state = 'raise';
                                $stateText = '<span class="badge bg-success">Elevada</span>';
                            }
                        }
                    }
                }
                if ($quote->state === 'confirmed' && $quote->raise_status === 0){
                    $state = 'confirm';
                    $stateText =  '<span class="badge bg-success">Confirmada</span>';
                }
                if ($quote->state === 'canceled'){
                    $state = 'canceled';
                    $stateText = '<span class="badge bg-danger">Cancelada</span>';
                }
            }

            $stateDecimals = '';
            if ( $quote->state_decimals == 1 )
            {
                $stateDecimals = '<span class="badge bg-success">Mostrar</span>';
            } else {
                $stateDecimals = '<span class="badge bg-danger">Ocultar</span>';
            }
            array_push($array, [
                "id" => $quote->id,
                "year" => ( $quote->date_quote == null || $quote->date_quote == "") ? '':$quote->date_quote->year,
                "code" => ($quote->code == null || $quote->code == "") ? '': $quote->code,
                "description" => ($quote->description_quote == null || $quote->description_quote == "") ? '': $quote->description_quote,
                "date_quote" => ($quote->date_quote == null || $quote->date_quote == "") ? '': $quote->date_quote->format('d/m/Y'),
                "order" => ($quote->code_customer == null || $quote->code_customer == "") ? "": $quote->code_customer,
                "date_validate" => ($quote->date_validate == null || $quote->date_validate == "") ? '': $quote->date_validate->format('d/m/Y'),
                "deadline" => ($quote->payment_deadline_id == null || $quote->payment_deadline_id == "") ? "":$quote->deadline->description,
                "time_delivery" => $quote->time_delivery.' DÍAS',
                "customer" => ($quote->customer_id == "" || $quote->customer_id == null) ? "" : $quote->customer->business_name,
                "total_igv" => number_format($quote->total_quote/1.18, 0),
                "total" => number_format($quote->total_importe),
                "currency" => ($quote->currency_invoice == null || $quote->currency_invoice == "") ? '': $quote->currency_invoice,
                "state" => $state,
                "stateText" => $stateText,
                "created_at" => $quote->created_at->format('d/m/Y'),
                "creator" => ($quote->users[0] == null) ? "": $quote->users[0]->user->name,
                "decimals" => $stateDecimals,
                "send_state" => $quote->send_state
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

    public function edit($id)
    {
        $begin = microtime(true);
        $user = Auth::user();
        $permissions = $user->getPermissionsViaRoles()->pluck('name')->toArray();
        $unitMeasures = UnitMeasure::all();
        $customers = Customer::all();
        $defaultConsumable = '(*)';
        $defaultElectric = '(e)';
        $consumables = Material::with('unitMeasure')->where('category_id', 2)->where('description','LIKE',"%".$defaultConsumable."%")->orderBy('full_name', 'asc')->get();
        $electrics = Material::with('unitMeasure')->where('category_id', 2)->whereElectric('description',$defaultElectric)->orderBy('full_name', 'asc')->get();
        $workforces = Workforce::with('unitMeasure')->get();
        $paymentDeadlines = PaymentDeadline::where('type', 'quotes')->get();
        $utility = PorcentageQuote::where('name', 'utility')->first();
        $rent = PorcentageQuote::where('name', 'rent')->first();
        $letter = PorcentageQuote::where('name', 'letter')->first();
        /*$quote3 = Quote::where('id', $id)
            ->with(['equipments' => function ($query) {
                $query->with(['materials', 'consumables', 'electrics', 'workforces', 'turnstiles', 'workdays']);
            }])->first();*/

        /*if ( $quote3->state === 'created' )
        {

            foreach( $quote3->equipments as $equipment )
            {
                // TODO: Actualizamos los porcentages si no estan registrados
                if ( $equipment->utility == 0 && $equipment->rent && $equipment->letter == 0 )
                {
                    $equipment->utility = $quote3->utility;
                    $equipment->rent = $quote3->rent;
                    $equipment->letter = $quote3->letter;
                    $equipment->save();

                }

                // TODO: Actualizar los precios
                foreach ( $equipment->materials as $equipment_material )
                {
                    if ( $equipment_material->price !== $equipment_material->material->unit_price )
                    {
                        $equipment_material->price = $equipment_material->material->unit_price;
                        $equipment_material->total = $equipment_material->material->unit_price * $equipment_material->quantity;
                        $equipment_material->save();
                    }
                }

                foreach ( $equipment->consumables as $equipment_consumable )
                {
                    if ( $equipment_consumable->price !== $equipment_consumable->material->unit_price )
                    {
                        $equipment_consumable->price = $equipment_consumable->material->list_price;
                        $equipment_consumable->total = $equipment_consumable->material->list_price * $equipment_consumable->quantity;
                        $equipment_consumable->save();
                    }
                }

                foreach ( $equipment->electrics as $equipment_electric )
                {
                    if ( $equipment_electric->price !== $equipment_electric->material->unit_price )
                    {
                        $equipment_electric->price = $equipment_electric->material->unit_price;
                        $equipment_electric->total = $equipment_electric->material->unit_price * $equipment_electric->quantity;
                        $equipment_electric->save();
                    }
                }
            }

            $quote2 = Quote::where('id', $id)
                ->with(['equipments' => function ($query) {
                    $query->with(['materials', 'consumables', 'electrics', 'workforces', 'turnstiles', 'workdays']);
                }])->first();

            $new_total_quote = 0;
            foreach( $quote2->equipments as $equipment )
            {
                $new_total_material = 0;
                foreach ( $equipment->materials as $equipment_material )
                {
                    $new_total_material = $new_total_material + $equipment_material->total;
                }
                $new_total_consumable = 0;
                foreach ( $equipment->consumables as $equipment_consumable )
                {
                    $new_total_consumable = $new_total_consumable + $equipment_consumable->total;
                }
                $new_total_electric = 0;
                foreach ( $equipment->electrics as $equipment_electric )
                {
                    $new_total_electric = $new_total_electric + $equipment_electric->total;
                }
                $new_total_workforce = 0;
                foreach ( $equipment->workforces as $equipment_workforce )
                {
                    $new_total_workforce = $new_total_workforce + $equipment_workforce->total;
                }
                $new_total_turnstile = 0;
                foreach ( $equipment->turnstiles as $equipment_turnstile )
                {
                    $new_total_turnstile = $new_total_turnstile + $equipment_turnstile->total;
                }
                $new_total_workday = 0;
                foreach ( $equipment->workdays as $equipment_workday )
                {
                    $new_total_workday = $new_total_workday + $equipment_workday->total;
                }

                $totalEquipo = (($new_total_material + $new_total_consumable + $new_total_electric + $new_total_workforce + $new_total_turnstile  + $new_total_workday ) * $equipment->quantity);
                $totalEquipmentU = $totalEquipo*(($equipment->utility/100)+1);
                $totalEquipmentL = $totalEquipmentU*(($equipment->letter/100)+1);
                $totalEquipmentR = $totalEquipmentL*(($equipment->rent/100)+1);

                $new_total_quote = $new_total_quote + $totalEquipmentR;
                $equipment->total = $totalEquipo;
                $equipment->save();
            }
            $quote2->total = $new_total_quote ;
            $quote2->save();


        }*/

        $quote = Quote::where('id', $id)
            ->with('customer')
            ->with('deadline')
            ->with(['equipments' => function ($query) {
                $query->with(['materials', 'consumables', 'electrics', 'workforces', 'turnstiles', 'workdays']);
            }])->first();

        $images = [];

        $materials = Material::with('unitMeasure','typeScrap')
            /*->where('enable_status', 1)*/->get();

        //dd($array);

        $array = [];
        foreach ( $materials as $material )
        {
            array_push($array, [
                'id'=> $material->id,
                'full_name' => $material->full_name,
                'type_scrap' => $material->typeScrap,
                'stock_current' => $material->stock_current,
                'unit_price' => $material->unit_price,
                'unit' => $material->unitMeasure->name,
                'code' => $material->code,
                'unit_measure' => $material->unitMeasure,
                'typescrap_id' => $material->typescrap_id,
                'enable_status' => $material->enable_status,
                'update_price' => $material->state_update_price
            ]);
        }

        $dataCurrency = DataGeneral::where('name', 'type_current')->first();
        $currency = $dataCurrency->valueText;

        $dataIgv = PorcentageQuote::where('name', 'igv')->first();
        $igv = $dataIgv->value;

        $end = microtime(true) - $begin;

        Audit::create([
            'user_id' => Auth::user()->id,
            'action' => 'Editar cotizacion VISTA',
            'time' => $end
        ]);


        /*dump($quote->total_equipments);
        dd();*/

        return view('quoteSale.edit', compact('quote', 'unitMeasures', 'customers', 'consumables', 'electrics', 'workforces', 'permissions', 'paymentDeadlines', 'utility', 'rent', 'letter', 'images', 'array', 'currency', 'igv'));

    }

    public function update(UpdateQuoteRequest $request)
    {
        $begin = microtime(true);
        $validated = $request->validated();

        DB::beginTransaction();
        try {
            $quote = Quote::find($request->get('quote_id'));

            $quote->code = $request->get('code_quote');
            $quote->description_quote = $request->get('code_description');
            $quote->observations = $request->get('observations');
            $quote->date_quote = ($request->has('date_quote')) ? Carbon::createFromFormat('d/m/Y', $request->get('date_quote')) : Carbon::now();
            $quote->date_validate = ($request->has('date_validate')) ? Carbon::createFromFormat('d/m/Y', $request->get('date_validate')) : Carbon::now()->addDays(5);
            $quote->way_to_pay = ($request->has('way_to_pay')) ? $request->get('way_to_pay') : '';
            $quote->payment_deadline_id = ($request->has('payment_deadline')) ? $request->get('payment_deadline') : null;
            $quote->delivery_time = ($request->has('delivery_time')) ? $request->get('delivery_time') : '';
            $quote->customer_id = ($request->has('customer_id')) ? $request->get('customer_id') : null;
            $quote->contact_id = ($request->has('contact_id')) ? $request->get('contact_id') : null;
            //$quote->utility = ($request->has('utility')) ? $request->get('utility'): 0;
            //$quote->letter = ($request->has('letter')) ? $request->get('letter'): 0;
            //$quote->rent = ($request->has('taxes')) ? $request->get('taxes'): 0;
            $quote->currency_invoice = 'USD';
            $quote->currency_compra = null;
            $quote->currency_venta = null;
            $quote->total_soles = 0;
            $quote->save();

            $equipments = json_decode($request->get('equipments'));

            $totalQuote = 0;

            for ( $i=0; $i<sizeof($equipments); $i++ )
            {
                if ($equipments[$i]->quote === '' )
                {
                    $equipment = Equipment::create([
                        'quote_id' => $quote->id,
                        'description' => ($equipments[$i]->description == "" || $equipments[$i]->description == null) ? '':$equipments[$i]->description,
                        'detail' => ($equipments[$i]->detail == "" || $equipments[$i]->detail == null) ? '':$equipments[$i]->detail,
                        'quantity' => $equipments[$i]->quantity,
                        'utility' => $equipments[$i]->utility,
                        'rent' => $equipments[$i]->rent,
                        'letter' => $equipments[$i]->letter,
                        'total' => $equipments[$i]->total
                    ]);

                    $totalMaterial = 0;

                    $totalConsumable = 0;

                    $totalElectric = 0;

                    $totalWorkforces = 0;

                    $totalTornos = 0;

                    $totalDias = 0;

                    $materials = $equipments[$i]->materials;

                    $consumables = $equipments[$i]->consumables;

                    $electrics = $equipments[$i]->electrics;

                    $workforces = $equipments[$i]->workforces;

                    $tornos = $equipments[$i]->tornos;

                    $dias = $equipments[$i]->dias;

                    for ( $j=0; $j<sizeof($materials); $j++ )
                    {
                        $equipmentMaterial = EquipmentMaterial::create([
                            'equipment_id' => $equipment->id,
                            'material_id' => $materials[$j]->material->id,
                            'quantity' => (float) $materials[$j]->quantity,
                            'price' => (float) $materials[$j]->material->unit_price,
                            'length' => (float) ($materials[$j]->length == '') ? 0: $materials[$j]->length,
                            'width' => (float) ($materials[$j]->width == '') ? 0: $materials[$j]->width,
                            'percentage' => (float) $materials[$j]->quantity,
                            'state' => ($materials[$j]->quantity > $materials[$j]->material->stock_current) ? 'Falta comprar':'En compra',
                            'availability' => ($materials[$j]->quantity > $materials[$j]->material->stock_current) ? 'Agotado':'Completo',
                            'total' => (float) $materials[$j]->material->unit_price*(float) $materials[$j]->quantity,
                        ]);

                        $totalMaterial += $equipmentMaterial->total;
                    }

                    for ($k = 0; $k < sizeof($consumables); $k++) {
                        $material = Material::find($consumables[$k]->id);

                        // 🟢 VALIDAR PROMOCIÓN SI type_promo = limit
                        if ($consumables[$k]->type_promo == "limit") {
                            $promotion = PromotionLimit::where('material_id', $consumables[$k]->id)
                                ->whereDate('start_date', '<=', now())
                                ->whereDate('end_date', '>=', now())
                                ->first();

                            if ($promotion) {
                                // buscar uso
                                $query = PromotionUsage::where('promotion_limit_id', $promotion->id);

                                if ($promotion->applies_to == 'worker') {
                                    $query->where('user_id', auth()->id());
                                }

                                $usage = $query->first();

                                if (!$usage) {
                                    $usage = PromotionUsage::create([
                                        'promotion_limit_id' => $promotion->id,
                                        'user_id' => $promotion->applies_to == 'worker' ? auth()->id() : null,
                                        'used_quantity' => 0,
                                    ]);
                                }

                                $requestedQty = (float) $consumables[$k]->quantity;
                                $remaining = $promotion->limit_quantity - $usage->used_quantity;

                                if ($remaining < $requestedQty) {
                                    throw new \Exception("La promoción para {$material->full_name} ya no tiene suficiente cantidad disponible");
                                }

                                // actualizar consumo
                                $usage->increment('used_quantity', $requestedQty);
                            }
                        }

                        // 🟢 REGISTRAR EQUIPMENT CONSUMABLE
                        $equipmentConsumable = EquipmentConsumable::create([
                            'availability' => ((float) $consumables[$k]->quantity > $material->stock_current) ? 'Agotado' : 'Completo',
                            'state' => ((float) $consumables[$k]->quantity > $material->stock_current) ? 'Falta comprar' : 'En compra',
                            'equipment_id' => $equipment->id,
                            'material_id' => $consumables[$k]->id,
                            'quantity' => (float) $consumables[$k]->quantity,
                            'price' => (float) $consumables[$k]->price,
                            'valor_unitario' => (float) $consumables[$k]->valor,
                            'discount' => (float) $consumables[$k]->discount,
                            'total' => (float) $consumables[$k]->importe,
                            'type_promo' => $consumables[$k]->type_promo,
                        ]);

                        $totalConsumable += $equipmentConsumable->total;
                    }

                    for ( $k=0; $k<sizeof($electrics); $k++ )
                    {
                        $equipmentElectric = EquipmentElectric::create([
                            'equipment_id' => $equipment->id,
                            'material_id' => $electrics[$k]->id,
                            'quantity' => (float) $electrics[$k]->quantity,
                            'price' => (float) $electrics[$k]->price,
                            'total' => (float) $electrics[$k]->quantity*(float) $electrics[$k]->price,
                        ]);

                        $totalElectric += $equipmentElectric->total;
                    }

                    for ( $w=0; $w<sizeof($workforces); $w++ )
                    {
                        $equipmentWorkforce = EquipmentWorkforce::create([
                            'equipment_id' => $equipment->id,
                            'description' => $workforces[$w]->description,
                            'price' => (float) $workforces[$w]->price,
                            'quantity' => (float) $workforces[$w]->quantity,
                            'total' => (float) $workforces[$w]->price*(float) $workforces[$w]->quantity,
                            'unit' => $workforces[$w]->unit,
                        ]);

                        $totalWorkforces += $equipmentWorkforce->total;
                    }

                    for ( $r=0; $r<sizeof($tornos); $r++ )
                    {
                        $equipmenttornos = EquipmentTurnstile::create([
                            'equipment_id' => $equipment->id,
                            'description' => $tornos[$r]->description,
                            'price' => (float) $tornos[$r]->price,
                            'quantity' => (float) $tornos[$r]->quantity,
                            'total' => (float) $tornos[$r]->price*(float) $tornos[$r]->quantity
                        ]);

                        $totalTornos += $equipmenttornos->total;
                    }

                    for ( $d=0; $d<sizeof($dias); $d++ )
                    {
                        $equipmentdias = EquipmentWorkday::create([
                            'equipment_id' => $equipment->id,
                            'description' => $dias[$d]->description,
                            'quantityPerson' => (float) $dias[$d]->quantity,
                            'hoursPerPerson' => (float) $dias[$d]->hours,
                            'pricePerHour' => (float) $dias[$d]->price,
                            'total' => (float) $dias[$d]->quantity*(float) $dias[$d]->hours*(float) $dias[$d]->price
                        ]);

                        $totalDias += $equipmentdias->total;
                    }

                    //$totalQuote += ($totalMaterial + $totalConsumable + $totalWorkforces + $totalTornos + $totalDias) * (float)$equipment->quantity;

                    //$equipment->total = ($totalMaterial + $totalConsumable + $totalWorkforces + $totalTornos + $totalDias)* (float)$equipment->quantity;

                    // Cambio el 16/01/2024
                    //$totalEquipo = (($totalMaterial + $totalConsumable + $totalWorkforces + $totalTornos) * (float)$equipment->quantity) + $totalDias;
                    $totalEquipo = (($totalMaterial + $totalConsumable + $totalElectric + $totalWorkforces + $totalTornos + $totalDias) * (float)$equipment->quantity);
                    $totalEquipmentU = $totalEquipo*(($equipment->utility/100)+1);
                    $totalEquipmentL = $totalEquipmentU*(($equipment->letter/100)+1);
                    $totalEquipmentR = $totalEquipmentL*(($equipment->rent/100)+1);

                    $totalQuote += $totalEquipmentR;

                    $equipment->total = $totalEquipo;

                    $equipment->save();
                }

            }

            $quote->total += $totalQuote;

            $quote->save();

            $end = microtime(true) - $begin;

            Audit::create([
                'user_id' => Auth::user()->id,
                'action' => 'Editar cotizaciones POST',
                'time' => $end
            ]);

            DB::commit();
        } catch ( \Throwable $e ) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }
        return response()->json(['message' => 'Nuevos equipos guardados con éxito.'], 200);

    }

    public function destroy(Quote $quote)
    {
        $quote->state = 'canceled';
        $quote->save();
    }

    public function updateEquipmentOfQuote(Request $request, $id_equipment, $id_quote)
    {
        //dump($request);
        //dd();
        $begin = microtime(true);
        $user = Auth::user();
        $quote = Quote::find($id_quote);
        $quote_user = QuoteUser::where('quote_id', $id_quote)
            ->where('user_id', $user->id)->first();
        /*if ( !$quote_user && !$user->hasRole(['admin','principal', 'logistic']) ) {
            return response()->json(['message' => 'No puede editar un equipo que no es de su propiedad'], 422);
        }*/

        $equipmentSent = null;

        DB::beginTransaction();
        try {
            $equipment_quote = Equipment::where('id', $id_equipment)
                ->where('quote_id',$quote->id)->first();

            $output_details= OutputDetail::where('equipment_id', $equipment_quote->id)->get();

            if ( count($output_details) == 0 )
            {
                // TODO: Si no hay outputs details que proceda como estaba planificado
                //$totalDeleted = 0;
                foreach( $equipment_quote->materials as $material ) {
                    //$totalDeleted = $totalDeleted + (float) $material->total;
                    $material->delete();
                }
                foreach( $equipment_quote->consumables as $consumable ) {
                    //$totalDeleted = $totalDeleted + (float) $consumable->total;
                    $consumable->delete();
                }
                foreach( $equipment_quote->electrics as $electric ) {
                    //$totalDeleted = $totalDeleted + (float) $consumable->total;
                    $electric->delete();
                }
                foreach( $equipment_quote->workforces as $workforce ) {
                    //$totalDeleted = $totalDeleted + (float) $workforce->total;
                    $workforce->delete();
                }
                foreach( $equipment_quote->turnstiles as $turnstile ) {
                    //$totalDeleted = $totalDeleted + (float) $turnstile->total;
                    $turnstile->delete();
                }
                foreach( $equipment_quote->workdays as $workday ) {
                    //$totalDeleted = $totalDeleted + (float) $workday->total;
                    $workday->delete();
                }

                $equipment_quote->delete();

                $equipments = $request->input('equipment');

                $totalQuote = 0;

                foreach ( $equipments as $equip )
                {
                    $equipment = Equipment::create([
                        'quote_id' => $quote->id,
                        'description' => ($equip['description'] == "" || $equip['description'] == null) ? '':$equip['description'],
                        'detail' => ($equip['detail'] == "" || $equip['detail'] == null) ? '':$equip['detail'],
                        'quantity' => $equip['quantity'],
                        'utility' => $equip['utility'],
                        'rent' => $equip['rent'],
                        'letter' => $equip['letter'],
                        'total' => $equip['total']
                    ]);

                    $totalMaterial = 0;

                    $totalConsumable = 0;

                    $totalElectric = 0;

                    $totalWorkforces = 0;

                    $totalTornos = 0;

                    $totalDias = 0;

                    $materials = $equip['materials'];

                    $consumables = $equip['consumables'];

                    $electrics = $equip['electrics'];

                    $workforces = $equip['workforces'];

                    $tornos = $equip['tornos'];

                    $dias = $equip['dias'];
                    //dump($materials);
                    foreach ( $materials as $material )
                    {
                        $equipmentMaterial = EquipmentMaterial::create([
                            'equipment_id' => $equipment->id,
                            'material_id' => (int)$material['material']['id'],
                            'quantity' => (float) $material['quantity'],
                            'price' => (float) $material['material']['unit_price'],
                            'length' => (float) ($material['length'] == '') ? 0: $material['length'],
                            'width' => (float) ($material['width'] == '') ? 0: $material['width'],
                            'percentage' => (float) $material['quantity'],
                            'state' => ($material['quantity'] > $material['material']['stock_current']) ? 'Falta comprar':'En compra',
                            'availability' => ($material['quantity'] > $material['material']['stock_current']) ? 'Agotado':'Completo',
                            'total' => (float) $material['quantity']*(float) $material['material']['unit_price']
                        ]);

                        //$totalMaterial += $equipmentMaterial->total;
                    }

                    /*for ($k = 0; $k < sizeof($consumables); $k++) {
                        $material = Material::find($consumables[$k]->id);

                        // 🟢 VALIDAR PROMOCIÓN SI type_promo = limit
                        if ($consumables[$k]->type_promo == "limit") {
                            $promotion = PromotionLimit::where('material_id', $consumables[$k]->id)
                                ->whereDate('start_date', '<=', now())
                                ->whereDate('end_date', '>=', now())
                                ->first();

                            if ($promotion) {
                                // buscar uso
                                $query = PromotionUsage::where('promotion_limit_id', $promotion->id);

                                if ($promotion->applies_to == 'worker') {
                                    $query->where('user_id', auth()->id());
                                }

                                $usage = $query->first();

                                if (!$usage) {
                                    $usage = PromotionUsage::create([
                                        'promotion_limit_id' => $promotion->id,
                                        'user_id' => $promotion->applies_to == 'worker' ? auth()->id() : null,
                                        'used_quantity' => 0,
                                    ]);
                                }

                                $requestedQty = (float) $consumables[$k]->quantity;
                                $remaining = $promotion->limit_quantity - $usage->used_quantity;

                                if ($remaining < $requestedQty) {
                                    throw new \Exception("La promoción para {$material->full_name} ya no tiene suficiente cantidad disponible");
                                }

                                // actualizar consumo
                                $usage->increment('used_quantity', $requestedQty);
                            }
                        }

                        // 🟢 REGISTRAR EQUIPMENT CONSUMABLE
                        $equipmentConsumable = EquipmentConsumable::create([
                            'availability' => ((float) $consumables[$k]->quantity > $material->stock_current) ? 'Agotado' : 'Completo',
                            'state' => ((float) $consumables[$k]->quantity > $material->stock_current) ? 'Falta comprar' : 'En compra',
                            'equipment_id' => $equipment->id,
                            'material_id' => $consumables[$k]->id,
                            'quantity' => (float) $consumables[$k]->quantity,
                            'price' => (float) $consumables[$k]->price,
                            'valor_unitario' => (float) $consumables[$k]->valor,
                            'discount' => (float) $consumables[$k]->discount,
                            'total' => (float) $consumables[$k]->importe,
                            'type_promo' => $consumables[$k]->type_promo,
                        ]);

                        $totalConsumable += $equipmentConsumable->total;
                    }*/

                    foreach ( $consumables as $consumable )
                    {
                        $material = Material::find((int)$consumable['id']);

                        // 🟢 VALIDAR PROMOCIÓN SI type_promo = limit
                        if ($consumable["type_promo"] == "limit") {
                            $promotion = PromotionLimit::where('material_id', $consumable["id"])
                                ->whereDate('start_date', '<=', now())
                                ->whereDate('end_date', '>=', now())
                                ->first();

                            if ($promotion) {
                                // buscar uso
                                $query = PromotionUsage::where('promotion_limit_id', $promotion->id);

                                if ($promotion->applies_to == 'worker') {
                                    $query->where('user_id', auth()->id());
                                }

                                $usage = $query->first();

                                if (!$usage) {
                                    $usage = PromotionUsage::create([
                                        'promotion_limit_id' => $promotion->id,
                                        'user_id' => $promotion->applies_to == 'worker' ? auth()->id() : null,
                                        'used_quantity' => 0,
                                    ]);
                                }

                                $requestedQty = (float) $consumable["quantity"];
                                $remaining = $promotion->limit_quantity - $usage->used_quantity;

                                if ($remaining < $requestedQty) {
                                    throw new \Exception("La promoción para {$material->full_name} ya no tiene suficiente cantidad disponible");
                                }

                                // actualizar consumo
                                $usage->increment('used_quantity', $requestedQty);
                            }
                        }

                        $equipmentConsumable = EquipmentConsumable::create([
                            'availability' => ((float) $consumable['quantity'] > $material->stock_current) ? 'Agotado':'Completo',
                            'state' => ((float) $consumable['quantity'] > $material->stock_current) ? 'Falta comprar':'En compra',
                            'equipment_id' => $equipment->id,
                            'material_id' => $consumable['id'],
                            'quantity' => (float) $consumable['quantity'],
                            'price' => (float) $consumable['price'],
                            'valor_unitario' => (float) $consumable['valor'],
                            'discount' => (float) $consumable['discount'],
                            'total' => (float) $consumable['importe'],
                            'type_promo' => $consumables['type_promo'],
                        ]);
                    }

                    foreach ( $electrics as $electricd )
                    {
                        $equipmentElectric = EquipmentElectric::create([
                            'equipment_id' => $equipment->id,
                            'material_id' => $electricd['id'],
                            'quantity' => (float) $electricd['quantity'],
                            'price' => (float) $electricd['price'],
                            'total' => (float) $electricd['quantity']*(float) $electricd['price'],
                        ]);

                        //$totalConsumable += $equipmentConsumable->total;
                    }

                    foreach ( $workforces as $workforce )
                    {
                        $equipmentWorkforce = EquipmentWorkforce::create([
                            'equipment_id' => $equipment->id,
                            'description' => $workforce['description'],
                            'price' => (float) $workforce['price'],
                            'quantity' => (float) $workforce['quantity'],
                            'total' => (float) $workforce['price']*(float) $workforce['quantity'],
                            'unit' => $workforce['unit'],
                        ]);

                        //$totalWorkforces += $equipmentWorkforce->total;
                    }

                    foreach ( $tornos as $torno )
                    {
                        $equipmenttornos = EquipmentTurnstile::create([
                            'equipment_id' => $equipment->id,
                            'description' => $torno['description'],
                            'price' => (float) $torno['price'],
                            'quantity' => (float) $torno['quantity'],
                            'total' => (float) $torno['price']*(float) $torno['quantity']
                        ]);

                        //$totalTornos += $equipmenttornos->total;
                    }

                    foreach ( $dias as $dia )
                    {
                        $equipmentdias = EquipmentWorkday::create([
                            'equipment_id' => $equipment->id,
                            'description' => $dia['description'],
                            'quantityPerson' => (float) $dia['quantity'],
                            'hoursPerPerson' => (float) $dia['hours'],
                            'pricePerHour' => (float) $dia['price'],
                            'total' => (float) $dia['quantity']*(float) $dia['hours']*(float) $dia['price']
                        ]);

                        //$totalDias += $equipmentdias->total;
                    }

                    $totalEquipo2 = (float)$equip['total'];
                    $totalEquipmentU2 = $totalEquipo2*(($equip['utility']/100)+1);
                    $totalEquipmentL2 = $totalEquipmentU2*(($equip['letter']/100)+1);
                    $totalEquipmentR2 = $totalEquipmentL2*(($equip['rent']/100)+1);

                    $totalQuote = $totalQuote + $totalEquipmentR2;

                    $equipment->total = $totalEquipo2;

                    $equipment->save();

                    $equipmentSent = $equipment;
                }

                // Guardamos los totales
                $quote->descuento = ($request->has('descuento')) ? $request->get('descuento') : null;
                $quote->gravada = ($request->has('gravada')) ? $request->get('gravada') : null;
                $quote->igv_total = ($request->has('igv_total')) ? $request->get('igv_total') : null;
                $quote->total_importe = ($request->has('total_importe')) ? $request->get('total_importe') : null;

                $quote->save();
            } else {
                // TODO: Ya no eliminamos el equipo solo lo modificamos
                //$totalDeleted = 0;
                foreach( $equipment_quote->materials as $material ) {
                    //$totalDeleted = $totalDeleted + (float) $material->total;
                    $material->delete();
                }
                foreach( $equipment_quote->consumables as $consumable ) {
                    //$totalDeleted = $totalDeleted + (float) $consumable->total;
                    $consumable->delete();
                }
                foreach( $equipment_quote->electrics as $electric ) {
                    //$totalDeleted = $totalDeleted + (float) $consumable->total;
                    $electric->delete();
                }
                foreach( $equipment_quote->workforces as $workforce ) {
                    //$totalDeleted = $totalDeleted + (float) $workforce->total;
                    $workforce->delete();
                }
                foreach( $equipment_quote->turnstiles as $turnstile ) {
                    //$totalDeleted = $totalDeleted + (float) $turnstile->total;
                    $turnstile->delete();
                }
                foreach( $equipment_quote->workdays as $workday ) {
                    //$totalDeleted = $totalDeleted + (float) $workday->total;
                    $workday->delete();
                }

                $quote->save();

                //$equipment_quote->delete();

                $equipments = $request->input('equipment');

                $totalQuote = 0;

                foreach ( $equipments as $equip )
                {
                    $equipment_quote->quote_id = $quote->id;
                    $equipment_quote->description = ($equip['description'] == "" || $equip['description'] == null) ? '':$equip['description'];
                    $equipment_quote->detail = ($equip['detail'] == "" || $equip['detail'] == null) ? '':$equip['detail'];
                    $equipment_quote->quantity = $equip['quantity'];
                    $equipment_quote->utility = $equip['utility'];
                    $equipment_quote->rent = $equip['rent'];
                    $equipment_quote->letter = $equip['letter'];
                    $equipment_quote->total = $equip['total'];
                    $equipment_quote->save();

                    $totalMaterial = 0;

                    $totalConsumable = 0;

                    $totalElectric = 0;

                    $totalWorkforces = 0;

                    $totalTornos = 0;

                    $totalDias = 0;

                    $materials = $equip['materials'];

                    $consumables = $equip['consumables'];

                    $electrics = $equip['electrics'];

                    $workforces = $equip['workforces'];

                    $tornos = $equip['tornos'];

                    $dias = $equip['dias'];
                    //dump($materials);
                    foreach ( $materials as $material )
                    {
                        $equipmentMaterial = EquipmentMaterial::create([
                            'equipment_id' => $equipment_quote->id,
                            'material_id' => (int)$material['material']['id'],
                            'quantity' => (float) $material['quantity'],
                            'price' => (float) $material['material']['unit_price'],
                            'length' => (float) ($material['length'] == '') ? 0: $material['length'],
                            'width' => (float) ($material['width'] == '') ? 0: $material['width'],
                            'percentage' => (float) $material['quantity'],
                            'state' => ($material['quantity'] > $material['material']['stock_current']) ? 'Falta comprar':'En compra',
                            'availability' => ($material['quantity'] > $material['material']['stock_current']) ? 'Agotado':'Completo',
                            'total' => (float) $material['quantity']*(float) $material['material']['unit_price']
                        ]);

                        //$totalMaterial += $equipmentMaterial->total;
                    }

                    foreach ( $consumables as $consumable )
                    {
                        $material = Material::find((int)$consumable['id']);

                        // 🟢 VALIDAR PROMOCIÓN SI type_promo = limit
                        if ($consumable["type_promo"] == "limit") {
                            $promotion = PromotionLimit::where('material_id', $consumable["id"])
                                ->whereDate('start_date', '<=', now())
                                ->whereDate('end_date', '>=', now())
                                ->first();

                            if ($promotion) {
                                // buscar uso
                                $query = PromotionUsage::where('promotion_limit_id', $promotion->id);

                                if ($promotion->applies_to == 'worker') {
                                    $query->where('user_id', auth()->id());
                                }

                                $usage = $query->first();

                                if (!$usage) {
                                    $usage = PromotionUsage::create([
                                        'promotion_limit_id' => $promotion->id,
                                        'user_id' => $promotion->applies_to == 'worker' ? auth()->id() : null,
                                        'used_quantity' => 0,
                                    ]);
                                }

                                $requestedQty = (float) $consumable["quantity"];
                                $remaining = $promotion->limit_quantity - $usage->used_quantity;

                                if ($remaining < $requestedQty) {
                                    throw new \Exception("La promoción para {$material->full_name} ya no tiene suficiente cantidad disponible");
                                }

                                // actualizar consumo
                                $usage->increment('used_quantity', $requestedQty);
                            }
                        }

                        $equipmentConsumable = EquipmentConsumable::create([
                            'availability' => ((float) $consumable['quantity'] > $material->stock_current) ? 'Agotado':'Completo',
                            'state' => ((float) $consumable['quantity'] > $material->stock_current) ? 'Falta comprar':'En compra',
                            'equipment_id' => $equipment_quote->id,
                            'material_id' => $consumable['id'],
                            'quantity' => (float) $consumable['quantity'],
                            'price' => (float) $consumable['price'],
                            'valor_unitario' => (float) $consumable['valor'],
                            'discount' => (float) $consumable['discount'],
                            'total' => (float) $consumable['importe'],
                            'type_promo' => $consumables['type_promo'],
                        ]);
                    }

                    /*foreach ( $consumables as $consumable )
                    {
                        $material = Material::find((int)$consumable['id']);

                        $equipmentConsumable = EquipmentConsumable::create([
                            'availability' => ((float) $consumable['quantity'] > $material->stock_current) ? 'Agotado':'Completo',
                            'state' => ((float) $consumable['quantity'] > $material->stock_current) ? 'Falta comprar':'En compra',
                            'equipment_id' => $equipment_quote->id,
                            'material_id' => $consumable['id'],
                            'quantity' => (float) $consumables['quantity'],
                            'price' => (float) $consumables['price'],
                            'valor_unitario' => (float) $consumables['valor'],
                            'discount' => (float) $consumables['discount'],
                            'total' => (float) $consumables['importe'],
                            ]);

                        //$totalConsumable += $equipmentConsumable->total;
                    }*/

                    foreach ( $electrics as $electric )
                    {
                        $equipmentElectric = EquipmentElectric::create([
                            'equipment_id' => $equipment_quote->id,
                            'material_id' => $electric['id'],
                            'quantity' => (float) $electric['quantity'],
                            'price' => (float) $electric['price'],
                            'total' => (float) $electric['quantity']*(float) $electric['price'],
                        ]);

                        //$totalConsumable += $equipmentConsumable->total;
                    }

                    foreach ( $workforces as $workforce )
                    {
                        $equipmentWorkforce = EquipmentWorkforce::create([
                            'equipment_id' => $equipment_quote->id,
                            'description' => $workforce['description'],
                            'price' => (float) $workforce['price'],
                            'quantity' => (float) $workforce['quantity'],
                            'total' => (float) $workforce['price']*(float) $workforce['quantity'],
                            'unit' => $workforce['unit'],
                        ]);

                        //$totalWorkforces += $equipmentWorkforce->total;
                    }

                    foreach ( $tornos as $torno )
                    {
                        $equipmenttornos = EquipmentTurnstile::create([
                            'equipment_id' => $equipment_quote->id,
                            'description' => $torno['description'],
                            'price' => (float) $torno['price'],
                            'quantity' => (float) $torno['quantity'],
                            'total' => (float) $torno['price']*(float) $torno['quantity']
                        ]);

                        //$totalTornos += $equipmenttornos->total;
                    }

                    foreach ( $dias as $dia )
                    {
                        $equipmentdias = EquipmentWorkday::create([
                            'equipment_id' => $equipment_quote->id,
                            'description' => $dia['description'],
                            'quantityPerson' => (float) $dia['quantity'],
                            'hoursPerPerson' => (float) $dia['hours'],
                            'pricePerHour' => (float) $dia['price'],
                            'total' => (float) $dia['quantity']*(float) $dia['hours']*(float) $dia['price']
                        ]);

                        //$totalDias += $equipmentdias->total;
                    }
                }

                $quote->descuento = ($request->has('descuento')) ? $request->get('descuento') : null;
                $quote->gravada = ($request->has('gravada')) ? $request->get('gravada') : null;
                $quote->igv_total = ($request->has('igv_total')) ? $request->get('igv_total') : null;
                $quote->total_importe = ($request->has('total_importe')) ? $request->get('total_importe') : null;

                $quote->save();
            }

            $end = microtime(true) - $begin;

            Audit::create([
                'user_id' => Auth::user()->id,
                'action' => 'Modificar equipo de cotizacion',
                'time' => $end
            ]);
            DB::commit();
        } catch ( \Throwable $e ) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage().' '.$e->getLine()], 422);
        }
        return response()->json(['message' => 'Equipo guardado con éxito.', 'equipment'=>$equipmentSent, 'quote'=>$quote], 200);

    }

}
