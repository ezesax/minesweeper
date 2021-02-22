<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GameRequest extends FormRequest
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
            'user_id'   =>  'required|exists:users,id',
            'rows'      =>  'required|integer',
            'columns'   =>  'required|integer',
            'mines'     =>  'required|integer',
            'status'    =>  'required|in:OPEN,CLOSE,NONSTARTED,WIN'
        ];
    }
}
