<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SessionLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'user_type',
        'user_id',
        'start',
        'end'
    ];
}