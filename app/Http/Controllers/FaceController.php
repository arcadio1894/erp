<?php

namespace App\Http\Controllers;

use App\Face;
use Illuminate\Http\Request;

class FaceController extends Controller
{
    public function index()
    {
        return view('faces.index'); // Vista con el formulario para subir
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'images.*' => 'required|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        foreach ($request->file('images') as $image) {
            $path = $image->store('faces', 'public');

            Face::create([
                'name' => $request->name,
                'image_path' => $path
            ]);
        }

        return back()->with('success', 'Imágenes registradas correctamente.');
    }

    public function verify()
    {
        $faces = Face::all();
        return view('faces.verify', compact('faces'));
    }
}
