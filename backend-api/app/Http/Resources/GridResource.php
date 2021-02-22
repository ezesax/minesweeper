<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class GridResource extends JsonResource
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
            'id'        => $this->id,
            'x_cord'    => $this->x_cord,
            'y_cord'    => $this->y_cord,
            'mine'      => $this->mine,
            'mark'      => $this->mark,
            'game'      => new GameResource($this->whenLoaded('game'))
        ];
    }
}