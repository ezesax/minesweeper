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
                Game::where('user_id', $user->id)
                    ->whereIn('status', ['NONSTARTED', 'OPEN'])
                    ->get()
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

            $item->start_at = now();

            $item->save();

            generateGrid($item->rows, $item->columns, $item->mines, $item->id);

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
}