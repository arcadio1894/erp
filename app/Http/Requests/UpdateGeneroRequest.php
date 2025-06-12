<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGeneroRequest extends FormRequest
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
            'warrant_id' => 'required|exists:warrants,id',
            /*'name' => 'required|string|max:255',*/
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('warrants', 'name')->ignore($this->get('warrant_id')),
            ],
            'description' => 'nullable|string|max:255',
        ];
    }

    public function messages()
    {
        return [
            'warrant_id.required' => 'El :attribute es obligatoria.',
            'genero_id.exists' => 'El :attribute no existe en la base de datos.',

            'name.required' => 'El :attribute es obligatoria.',
            'name.string' => 'El :attribute debe contener caracteres válidos.',
            'name.max' => 'El :attribute debe contener máximo 255 caracteres.',
            'name.unique' => 'Ya existe un :attribute en la base de datos.',

            'description.string' => 'La :attribute debe contener caracteres válidos.',
            'description.max' => 'La :attribute es demasiado largo.',

        ];
    }

    public function attributes()
    {
        return [
            'warrant_id' => 'id del género',
            'name' => 'nombre de género de material',
            'description' => 'descripción de la género de material',
        ];
    }
}
