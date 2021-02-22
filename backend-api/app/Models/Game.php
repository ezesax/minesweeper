<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'user_id',
        'rows',
        'columns',
        'mines',
        'start_at',
        'end_at',
        'status'
    ];

    public function grid()
    {
        return $this->hasMany(Grid::class);
    }

    public function user()
    {
        return $this->hasOne(User::class);
    }
}
