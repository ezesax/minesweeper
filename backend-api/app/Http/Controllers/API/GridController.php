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

            handleGame($item, $request->adjacentCells);

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
}
