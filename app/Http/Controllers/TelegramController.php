<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\TelegramService;

class TelegramController extends Controller
{
    protected $telegramService;

    public function __construct()
    {
        $this->telegramService = new TelegramService();
    }

    public function sendNotification($message, $channel = 'process')
    {
        return $this->telegramService->sendMessage($message, $channel);
    }
}
