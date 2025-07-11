<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramService
{
    protected $botToken;
    protected $chatIdProcess;
    protected $chatIdDocument;

    public function __construct()
    {
        $this->botToken = config('services.telegram.bot_token');
        $this->chatIdProcess = config('services.telegram.chat_id_process');
        $this->chatIdDocument = config('services.telegram.chat_id_document');
    }

    public function sendMessage($message, $channel = 'process')
    {
        $allowedChannels = ['process', 'document'];

        if (!in_array($channel, $allowedChannels)) {
            $channel = 'process'; // fallback
        }

        $chatId = $channel === 'document'
            ? $this->chatIdDocument
            : $this->chatIdProcess;

        try {
            $response = Http::post("https://api.telegram.org/bot{$this->botToken}/sendMessage", [
                'chat_id' => $chatId,
                'text' => $message,
                'parse_mode' => 'HTML'
            ]);

            if (!$response->successful()) {
                Log::error('Telegram error: ' . $response->body());
            }

            return $response->json();
        } catch (\Exception $e) {
            Log::error('Telegram exception: ' . $e->getMessage());
            return false;
        }
    }
}