<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class GameResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id'        =>  $this->id,
            'user'      =>  new UserResource($this->whenLoaded('user')),
            'rows'      =>  $this->rows,
            'columns'   =>  $this->columns,
            'mines'     =>  $this->mines,
            'start_at'  =>  $this->start_at,
            'end_at'    =>  $this->end_at,
            'status'    =>  $this->status
        ];
    }
}
