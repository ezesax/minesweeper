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
        'mark',
        'game_id'
    ];
}
