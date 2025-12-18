<?php

namespace App\Http\Controllers;

use App\MaterialDetailSetting;
use Illuminate\Http\Request;

class MaterialDetailSettingController extends Controller
{
    /**
     * Mostrar la vista de configuración
     */
    public function index()
    {
        $setting  = MaterialDetailSetting::first();
        $sections = config('material_details.sections');

        $enabled = [];
        if ($setting && is_array($setting->enabled_sections)) {
            $enabled = $setting->enabled_sections;
        }

        return view('materialDetailSetting.index', [
            'setting'  => $setting,
            'sections' => $sections,
            'enabled'  => $enabled,
        ]);
    }

    /**
     * Guardar configuración
     */
    public function store(Request $request)
    {
        $validKeys = array_keys(config('material_details.sections'));

        $enabled = [];
        if ($request->has('enabled_sections')) {
            foreach ($request->enabled_sections as $key) {
                if (in_array($key, $validKeys, true)) {
                    $enabled[] = $key;
                }
            }
        }

        // Dependencias
        if (in_array('subcategory', $enabled, true) && !in_array('category', $enabled, true)) {
            $enabled[] = 'category';
        }

        if (in_array('exampler', $enabled, true) && !in_array('brand', $enabled, true)) {
            $enabled[] = 'brand';
        }

        MaterialDetailSetting::updateOrCreate(
            ['id' => 1],
            ['enabled_sections' => $enabled]
        );

        return redirect()
            ->back()
            ->with('success', 'Configuración de detalles de producto guardada correctamente.');
    }
}
