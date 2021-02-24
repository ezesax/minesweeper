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
            'id'            => $this->id,
            'x_cord'        => $this->x_cord,
            'y_cord'        => $this->y_cord,
            'mine'          => $this->mine,
            'mines_around'  => $this->mines_around,
            'mark'          => $this->mark,
            'hint'          => $this->hint,
            'game'          => new GameResource($this->whenLoaded('game'))
        ];
    }
}
