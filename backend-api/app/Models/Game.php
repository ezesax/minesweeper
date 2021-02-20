<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'rows',
        'columns',
        'mines',
        'start_at',
        'end_at',
        'status'
    ];
}
