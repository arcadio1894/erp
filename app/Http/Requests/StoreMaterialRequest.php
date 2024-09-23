<?php

namespace App\Http\Requests;

use App\Material;
use Illuminate\Foundation\Http\FormRequest;

class StoreMaterialRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'description' => 'required|string',
            'unit_measure' => 'nullable|exists:unit_measures,id',
            'typescrap' => 'nullable|exists:typescraps,id',
            'stock_max' => 'nullable|numeric|min:0',
            'stock_min' => 'nullable|numeric|min:0',
            'unit_price' => 'nullable|numeric|between:0,99999.99',
            'image' => 'image',
            'category' => 'nullable|exists:categories,id',
            'subcategory' => 'nullable|exists:subcategories,id',
            'brand' => 'nullable|exists:brands,id',
            'exampler' => 'nullable|exists:examplers,id',
            'name' => 'required|string'
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'El :attribute es obligatorio.',
            'name.string' => 'El :attribute debe contener caracteres válidos',

            'description.required' => 'El :attribute es obligatorio.',
            'description.string' => 'El :attribute debe contener caracteres válidos',

            'unit_measure.required' => 'El :attribute es obligatorio.',
            'unit_measure.exists' => 'El :attribute no existe en la base de datos.',

            'typescrap.exists' => 'El :attribute no existe en la base de datos.',

            'stock_max.required' => 'El :attribute es obligatorio.',
            'stock_max.numeric' => 'El :attribute debe ser un número.',
            'stock_max.min' => 'El :attribute debe ser mayor a 0.',

            'stock_min.required' => 'El :attribute es obligatorio.',
            'stock_min.numeric' => 'El :attribute debe ser un número.',
            'stock_min.min' => 'El :attribute debe ser mayor a 0.',

            'unit_price.numeric' => 'El :attribute debe ser un número.',
            'unit_price.between' => 'El :attribute esta fuera del rango numérico.',

            'image.image' => 'La :attribute debe ser un formato de imagen correcto',

            'category.exists' => 'El :attribute no existe en la base de datos.',
            'category.required' => 'La :attribute es obligatoria.',

            'subcategory.exists' => 'El :attribute no existe en la base de datos.',
            'subcategory.required' => 'La :attribute es obligatoria.',

            'brand.exists' => 'El :attribute no existe en la base de datos.',
            'brand.required' => 'La :attribute es obligatoria.',

            'exampler.exists' => 'El :attribute no existe en la base de datos.',
            'exampler.required' => 'La :attribute es obligatoria.',

        ];
    }

    public function attributes()
    {
        return [
            'name' => 'Nombre Completo',
            'description' => 'descripción',
            'measure' => 'medida',
            'unit_measure' => 'unidad de medida',
            'stock_max' => 'stock máximo',
            'stock_min' => 'stock mínimo',
            'unit_price' => 'precio unitario',
            'image' => 'imagen',
            'type' => 'tipo de material',
            'category' => 'categoría',
            'brand' => 'marca',
            'exampler' => 'modelo',
            'typescrap' => 'retacería',
            'quality' => 'calidad',
            'warrant' => 'cédula',
            'subtype' => 'subtipo de material',
        ];
    }

    /*public function withValidator($validator)
    {
        $result = Material::where('name', $this->name)->get();
        $validator->after(function ($validator) use ($result) {
            if (!$result->isEmpty()) {
                $validator->errors()->add('User', 'Something wrong with this guy');
            }
        });
        //return $validator;
    }*/
}
