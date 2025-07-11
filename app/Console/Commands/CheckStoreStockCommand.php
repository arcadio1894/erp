<?php

namespace App\Console\Commands;

use App\DataGeneral;
use App\Notification;
use App\NotificationUser;
use App\StoreMaterial;
use App\User;
use Illuminate\Console\Command;
use App\Mail\StockLowNotificationMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use App\Http\Controllers\TelegramController;

class CheckStoreStockCommand extends Command
{
    protected $signature = 'store:check-stock';
    protected $description = 'Verifica si hay materiales en tienda con stock bajo y crea notificaciones';

    public function handle()
    {
        $storeMaterialMinData = DataGeneral::where('name', 'store_material_min')->first();
        if (!$storeMaterialMinData) {
            Log::warning('No se encontró configuración store_material_min');
            return;
        }

        $storeMaterialMin = (float) $storeMaterialMinData->valueNumber;

        // Obtener todos los materiales únicos de StoreMaterial
        $materials = StoreMaterial::with('material')->get()->groupBy('material_id');

        // Notificaciones activadas
        $notifPopUp = DataGeneral::where('name', 'send_notification_store_pop_up')->first();
        $notifCampana = DataGeneral::where('name', 'send_notification_store_campana')->first();
        $notifEmail = DataGeneral::where('name', 'send_notification_store_email')->first();
        $notifTelegram = DataGeneral::where('name', 'send_notification_store_telegram')->first();

        $users = User::role(['admin', 'principal', 'logistic'])->get();

        foreach ($materials as $materialGroup) {
            $material = $materialGroup->first()->material;

            $totalStock = $materialGroup->sum('stock_current');

            if ($totalStock >= $storeMaterialMin) {
                continue; // No hay problema con este material
            }

            $nameMaterial = $material->full_name;
            $content = "El producto {$nameMaterial} está por agotarse.";

            // 1. Notificación campana
            if ($notifCampana && $notifCampana->valueText === 's') {
                $notification = Notification::create([
                    'content' => $content,
                    'reason_for_creation' => 'check_stock',
                    'user_id' => 1, // Asignas un usuario fijo, por ejemplo Admin
                    'url_go' => route('material.index.store'),
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

            // 2. Notificación pop-up
            if ($notifPopUp && $notifPopUp->valueText === 's') {
                $notification = Notification::create([
                    'content' => $content,
                    'reason_for_creation' => 'check_stock_pop_up',
                    'user_id' => 1,
                    'url_go' => route('material.index.store'),
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

            // 3. Email
            if ($notifEmail && $notifEmail->valueText === 's') {
                foreach ($users as $user) {
                    Mail::to($user->email)->queue(new StockLowNotificationMail($nameMaterial));
                }
            }

            // 4. Telegram
            if ($notifTelegram && $notifTelegram->valueText === 's') {
                $telegram = new TelegramController();
                $telegram->sendNotification("📦 El producto {$nameMaterial} está por agotarse.", 'process');
            }
        }

        $this->info('Verificación de stock en tienda completada.');
    }
}
