<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'user_id',
        'token'
    ];

    public function user()
    {
        return $this->hasOne(User::class);
    }
}
