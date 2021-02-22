<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grid extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'x_cord',
        'y_cord',
        'mine',
        'mines_around',
        'mark',
        'game_id'
    ];

    public function game()
    {
        return $this->hasOne(Game::class);
    }
}
