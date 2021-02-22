<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\GridRequest;
use App\Models\Grid;
use App\Http\Resources\GridResource;
use App\Models\Game;

class GridController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($gameId)
    {
        try{
            $grid = GridResource::collection(
                Grid::where('game_id', $gameId)->get()
            );

            return response()->json([
                'data' => $grid,
                'message' => 'Grid retrieved successfully'
            ], 200);
        }catch(\Exception $e){
            return response()->json([
                'message' => 'Internal server error'
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(GridRequest $request, $id)
    {
        try{
            $data = $request->validated();
            $item = Grid::findOrFail($id);
            $item->update($data);

            $this->handleGame($item);

            return response()->json([
                'data' => new GridResource($item),
                'message' => 'Grid updated successfully'
            ], 201);
        }catch(\Exception $e){
            return response()->json([
                'message' => 'Internal server error'
            ], 500);
        }
    }

    private function handleGame($item){
        $game = Game::find($item->game_id);
        if($item->mark != '0'){
            if($this->checkWin($game)){
                $game->status = "WIN";
                $game->save();
            }else{
                if($item->mark == 'R'){
                    if($item->mine == 1){
                        $game->status = 'CLOSE';
                        $game->save();
                    }else{
                        $this->handleAdjacentCells($game->id, $item);
                    }
                }
            }
        }
    }

    private function checkWin($game){
        $grid = Grid::where('game_id', $game->id)->get();
        $minesFound = 0;
        $cellsRevealed = 0;

        foreach($grid as $cell){
            if($cell->mine == 0 && $cell->mark == 'R')
                $cellsRevealed++;
            if($cell->mine == 1 && $cell->mark == 'F')
                $minesFound++;
        }

        if($game->mines == $minesFound
            && (($game->rows*$game->columns)-$game->mines) == $cellsRevealed){
                return true;
            }else{
                return false;
            }
    }

    private function handleAdjacentCells($gameId, $cellRevealed){
        $y = [$cellRevealed->y_cord-1, $cellRevealed->y_cord, $cellRevealed->y_cord+1];
        $x = [$cellRevealed->x_cord-1, $cellRevealed->x_cord, $cellRevealed->x_cord+1];


        $grid = Grid::where('game_id', $gameId)
                    ->whereIn('y_cord', $y)
                    ->whereIn('x_cord', $x)
                    ->get();

        foreach($cell as $grid){
            if($cell->mine == 0){
                $this->handleAdjacentCells($gameId, $cell);
                $cell->mark = 'R';
                $cell->save();
            }
        }
    }
}
