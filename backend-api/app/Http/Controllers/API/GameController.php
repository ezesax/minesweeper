<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\GameRequest;
use App\Models\Game;
use App\Http\Resources\GameResource;
use App\Http\Requests\GridRequest;
use App\Models\Grid;

class GameController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try{
            $user = Auth::user();

            $games = GameResource::collection(
                Game::where('user_id', $user->id)->get()
            );

            return response()->json([
                'data' => $games,
                'message' => 'Games retrieved successfully'
            ], 200);
        }catch(\Exception $e){
            return response()->json([
                'message' => 'Internal server error'
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(GameRequest $request)
    {
        try{
            $data = $request->validated();
            $item = new Game($data);
            $item->save();

            $this->generateGrid($item->rows, $item->columns, $item->mines, $item->id);

            return response()->json([
                'data' => new GameResource($item),
                'message' => 'Game created successfully'
            ], 201);
        }catch(\Exception $e){
            return response()->json([
                'message' => 'Internal server error'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try{
            $item = Game::findOrFail($id);

            return response()->json([
                'data' => new GameResource($item),
                'message' => 'Game retrieved successfully'
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
    public function update(GameRequest $request, $id)
    {
        try{
            $data = $request->validated();
            $item = Game::findOrFail($id);
            $item->update($data);

            return response()->json([
                'data' => new GameResource($item),
                'message' => 'Game updated successfully'
            ], 201);
        }catch(\Exception $e){
            return response()->json([
                'message' => 'Internal server error'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try{
            $item = Game::findOrFail($id);
            $item->delete();

            return response()->json([
                'message' => 'Game deleted successfully'
            ], 204);
        }catch(\Exception $e){
            return response()->json([
                'message' => 'Internal server error'
            ], 500);
        }
    }

    private function generateGrid($rows, $columns, $mines, $gameId){
        $currentMines = 0;

        for($row = 0; $row < $rows; $row++){
            for($column = 0; $column < $columns; $column++){
                $grid = new Grid();
                $hasMine = $this->setMine($currentMines, $mines);
                if($hasMine == 1)
                    $currentMines++;

                $grid->x_cord = $column;
                $grid->y_cord = $row;
                $grid->mine = $hasMine;
                $grid->mark = 'NA';
                $grid->game_id = $gameId;
            }
        }
    }

    private function setMine($currentMines, $mines){
        if($currentMines < $mines){
            //TODO: LOGIC TO SET MINES
        }else{
            return 0;
        }
    }
}
