<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GridRequest extends FormRequest
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
            'x_cord'  =>  'required|integer',
            'y_cord'  =>  'required|integer',
            'mine'    =>  'required|boolean',
            'mark'    =>  'required|char',
            'game_id' =>  'required|exists:games,id',
        ];
    }
}
