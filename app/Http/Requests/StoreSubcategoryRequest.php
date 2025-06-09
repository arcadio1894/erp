<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSubcategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'category_id' => 'required|exists:categories,id',
            'subcategories' => 'required|array|min:1',
            'subcategories.*.name' => [
                'required',
                'string',
                'max:255',
                'distinct',
                Rule::unique('subcategories', 'name')->where(function ($query) {
                    return $query->where('category_id', $this->category_id);
                }),
            ],
            'subcategories.*.description' => 'nullable|string|max:255',
        ];
    }

    public function messages()
    {
        return [
            'category_id.required' => 'El :attribute es obligatorio.',
            'category_id.exists' => 'El :attribute no existe en las marcas registradas.',

            'subcategories.required' => 'Debe agregar al menos una subcategoría.',
            'subcategories.array' => 'El campo subcategorías no tiene un formato válido.',

            'subcategories.*.name.required' => 'El nombre de la subcategoría es obligatorio.',
            'subcategories.*.name.string' => 'El nombre de la subcategoría debe contener caracteres válidos.',
            'subcategories.*.name.max' => 'El nombre de la subcategoría debe contener máximo 255 caracteres.',
            'subcategories.*.name.distinct' => 'Hay nombres de subcategorías duplicados en el formulario.',
            'subcategories.*.name.unique' => 'Ya existe una subcategoría con ese nombre en esta categoría.',

            'subcategories.*.description.string' => 'La descripción de la subcategoría debe contener caracteres válidos.',
            'subcategories.*.description.max' => 'La descripción de la subcategoría es demasiado larga.',
        ];
    }

    public function attributes()
    {
        return [
            'category_id' => 'categoría',
            'subcategories.*.name' => 'nombre de la subcategoría',
            'subcategories.*.description' => 'descripción de la subcategoría',
        ];
    }
}
