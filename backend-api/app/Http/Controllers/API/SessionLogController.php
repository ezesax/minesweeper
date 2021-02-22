<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\SessionLogRequest;
use App\Models\SessionLog;
use App\Http\Resources\SessionLogResource;

class SessionLogController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($userId)
    {
        try{
            $sessionLog = SessionLogResource::collection(
                SessionLog::where('user_id', $userId)->get()
            );

            return response()->json([
                'data' => $sessionLog,
                'message' => 'SessionLog retrieved successfully'
            ], 200);
        }catch(\Exception $e){
            return response()->json([
                'message' => 'Internal server error'
            ], 500);
        }
    }
}
