<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\GameController;
use App\Http\Controllers\API\GameUserController;
use App\Http\Controllers\API\GridController;
use App\Http\Controllers\API\GuestUserController;
use App\Http\Controllers\API\SessionController;
use App\Http\Controllers\API\SessionLogController;
use App\Http\Controllers\API\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/** API RESOURCES ROUTES**/

    Route::resource('user', UserController::class);
    Route::resource('user/guest', GuestUserController::class);
    Route::resource('session', SessionController::class);
    Route::resource('session/log', SessionLogController::class);
    Route::resource('game/user', GameUserController::class);
    Route::resource('game', GameController::class);
    Route::resource('grid', GridController::class);
