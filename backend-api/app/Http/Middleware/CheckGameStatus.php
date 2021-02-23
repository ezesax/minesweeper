<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use \App\Models\Game;

class CheckGameStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        try{
            $game = Game::find($request->game_id);

            if($game->status == 'NONSTARTED'){
                return response()->json(['message' => 'This game has not started'], 200);
            }

            if($game->status != 'OPEN'){
                return response()->json(['message' => 'This game is over'], 200);
            }

            return $next($request);
        }catch(\Exception $e){
            return response()->json(['message' => 'Internal server error'], 500);
        }
    }
}
