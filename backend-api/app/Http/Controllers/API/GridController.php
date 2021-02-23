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
        $game = Game::find($gameId);
        $leftCell = $cellRevealed->x_cord - 1 < 0 ? null : Grid::where('game_id', $gameId)
                                                               ->where('x_cord', $cellRevealed->x_cord - 1)
                                                               ->where('y_cord', $cellRevealed->y_cord)
                                                               ->first();
        $rightCell = $cellRevealed->x_cord + 1 > ($game->columns-1) ? null : Grid::where('game_id', $gameId)
                                                                                ->where('x_cord', $cellRevealed->x_cord + 1)
                                                                                ->where('y_cord', $cellRevealed->y_cord)
                                                                                ->first();
        $topCell = $cellRevealed->y_cord - 1 < 0 ? null : Grid::where('game_id', $gameId)
                                                              ->where('x_cord', $cellRevealed->x_cord)
                                                              ->where('y_cord', $cellRevealed->y_cord - 1)
                                                              ->first();
        $bottomCell = $cellRevealed->y_cord + 1 > ($game->rows-1) ? null : Grid::where('game_id', $gameId)
                                                                                  ->where('x_cord', $cellRevealed->x_cord)
                                                                                  ->where('y_cord', $cellRevealed->y_cord + 1)
                                                                                  ->first();
        if($leftCell != null){
            if($leftCell->mine == 0){
                $this->handleAdjacentCells($gameId, $leftCell);
                $cell->mark = 'R';
                $cell->save();
            }
        }

        if($rightCell != null){
            if($rightCell->mine == 0){
                $this->handleAdjacentCells($gameId, $rightCell);
                $cell->mark = 'R';
                $cell->save();
            }
        }

        if($topCell != null){
            if($topCell->mine == 0){
                $this->handleAdjacentCells($gameId, $topCell);
                $cell->mark = 'R';
                $cell->save();
            }
        }

        if($bottomCell != null){
            if($bottomCell->mine == 0){
                $this->handleAdjacentCells($gameId, $bottomCell);
                $cell->mark = 'R';
                $cell->save();
            }
        }
    }
}
