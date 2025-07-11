<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class StockLowNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $material;

    public function __construct($material)
    {
        $this->material = $material;
    }

    public function build()
    {
        return $this->subject('Producto por agotarse')
            ->markdown('email.sendStockLow')
            ->with([
                'material' => $this->material
            ]);
    }
}
