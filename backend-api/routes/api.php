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
use App\Http\Controllers\API\AuthController;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, HEAD');

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
Route::group([
    'prefix' => 'auth'
], function ($router) {
    /** AUTH ROUTES**/
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [UserController::class, 'store']);
});

    Route::group([
        'middleware' => 'check.JWT',
        'prefix' => 'auth'
    ], function ($router) {
        /** AUTH ROUTES**/
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
        Route::get('me', [AuthController::class, 'me']);
    });

    Route::group([
        'middleware' => 'check.JWT',
        'prefix' => 'resources'
    ], function ($router) {
        /** API RESOURCES ROUTES**/
        Route::resource('user', UserController::class);
        Route::resource('session/log', SessionLogController::class);
        Route::resource('game', GameController::class);
        Route::get('grid/{gameId}', [GridController::class, 'index']);
        Route::put('grid/{id}', [GridController::class, 'update'])->middleware('check.game.status');
    });

/** **/
