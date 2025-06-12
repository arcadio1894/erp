<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSubcategoryRequest extends FormRequest
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
            'subcategory_id' => 'required|exists:subcategories,id',
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('subcategories', 'name')->where(function ($query) {
                    return $query->where('category_id', $this->category_id);
                }),
            ],
            'description' => 'nullable|string|max:255',
            'category_id' => 'required|exists:categories,id'
        ];
    }

    public function messages()
    {
        return [
            'subcategory_id.required' => 'El :attribute es obligatorio.',
            'subcategory_id.exists' => 'El :attribute no existe en las subcategorías registradas.',

            'category_id.required' => 'El :attribute es obligatorio.',
            'category_id.exists' => 'El :attribute no existe en las categorías registradas.',

            'name.required' => 'El :attribute es obligatoria.',
            'name.string' => 'El :attribute debe contener caracteres válidos.',
            'name.max' => 'El :attribute debe contener máximo 255 caracteres.',
            'name.unique' => 'Ya existe una subcategoría con ese nombre en esta categoría.',

            'description.string' => 'La :attribute debe contener caracteres válidos.',
            'description.max' => 'La :attribute es demasiado largo.',
        ];
    }

    public function attributes()
    {
        return [
            'subcategory_id' => 'id de la subcategoría',
            'category_id' => 'id de la categoría',
            'name' => 'nombre de la subcategoría',
            'description' => 'descripción de la subcategoría',
        ];
    }
}
