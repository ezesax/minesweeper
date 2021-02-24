<?php
use \App\Models\Game;
use \App\Models\Grid;

function generateGrid($rows, $columns, $mines, $gameId){
    $minesMap = setMines($rows, $columns, $mines);

    for($row = 0; $row < $rows; $row++){
        for($column = 0; $column < $columns; $column++){
            $grid = new Grid();
            $grid->x_cord = $column;
            $grid->y_cord = $row;
            $grid->mine = $minesMap[$row][$column];
            $grid->mines_around = getMinesAround($minesMap, $row, $column);
            $grid->mark = '0';
            $grid->hint = '0';
            $grid->game_id = $gameId;

            $grid->save();
        }
    }
}

function setMines($rows, $columns, $mines){
    $currentMines = 0;
    $map = [];

    for($row = 0; $row < $rows; $row++){
        array_push($map, []);
        for($column = 0; $column < $columns; $column++){
            array_push($map[$row], 0);
        }
    }

    while($currentMines < $mines){
        $r = rand(0, (count($map)-1));
        $c = rand(0, (count($map[0])-1));

        if($map[$r][$c] == 0){
            $map[$r][$c] = 1;
            $currentMines++;
        }
    }

    return $map;
}

function getMinesAround($minesMap, $row, $column){
    $around = $minesMap[$row][$column] == 1 ? -1 : 0;
    $row -= 1;
    $column -= 1;

    for($i = 0; $i < 3; $i++){
        for($j = 0; $j < 3; $j++){
            if(isset($minesMap[$row+$i]) && isset($minesMap[$row+$i][$column+$j])){
                if($minesMap[$row+$i][$column+$j] == 1){
                    $around++;
                }
            }
        }
    }

    return $around;
}

function handleGame($item){
    $game = Game::find($item->game_id);
    if($item->mark != '0'){
        if(checkWin($game)){
            $game->status = "WIN";
            $game->end_at = now();
            $game->save();
        }else{
            if($item->mark == 'R'){
                if($item->mine == 1){
                    $game->status = 'CLOSE';
                    $game->save();
                }else{
                    handleAdjacentCells($game->id, $item);
                    if(checkWin($game)){
                        $game->status = "WIN";
                        $game->end_at = now();
                        $game->save();
                    }
                }
            }
        }
    }
}

function checkWin($game){
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

function handleAdjacentCells($gameId, $item){
    $adjacentCells = Grid::orWhereRaw('game_id = ? AND y_cord = ? AND x_cord = ? AND mark = ?',
                                    [$gameId, $item->y_cord-1, $item->x_cord, "0"])
                         ->orWhereRaw('game_id = ? AND y_cord = ? AND x_cord = ? AND mark = ?',
                                    [$gameId, $item->y_cord+1, $item->x_cord, "0"])
                         ->orWhereRaw('game_id = ? AND y_cord = ? AND x_cord = ? AND mark = ?',
                                    [$gameId, $item->y_cord, $item->x_cord-1, "0"])
                         ->orWhereRaw('game_id = ? AND y_cord = ? AND x_cord = ? AND mark = ?',
                                    [$gameId, $item->y_cord, $item->x_cord+1, "0"])
                         ->get();

    foreach($adjacentCells as $cell){
        if($cell->mine == 0 && $cell->mines_around == 0){
            $cell->mark = 'R';
            $cell->hint = 1;
            $cell->save();
            handleAdjacentCells($gameId, $cell);
        }

        if($cell->mine == 0 && $cell->mines_around > 0){
            $cell->mark = 'R';
            $cell->hint = 1;
            $cell->save();
        }
    }
}