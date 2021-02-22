<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory;

    protected $fillable = [
        'id',
        'fullName',
        'email',
        'password'
    ];

    public function games()
    {
        return $this->hasMany(Game::class);
    }

    public function sessionLog()
    {
        return $this->hasMany(SessionLog::class);
    }
}
