'use strict'

var grid = [];
var adjacentCells = [];

$(document).ready(() => {

});

//** AUTH FUNCTIONS **/

function register(){
    let data = {fullName: $('#fullName').val(), email: $('#email').val(), password: $('#password').val()}
    axios.post('/api/auth/register', data)
    .then(response => {
        //TODO: REDIRECT TO LOGIN
    })
    .catch(function (error) {
        console.log(error);
    });
}

function login(){
    let data = {email: $('#email').val(), password: $('#password').val()}
    axios.post('/api/auth/login', data)
    .then(response => {
        sessionStorage.setItem("token", response.access_token);
        me();
        //TODO: REDIRECT TO SOMEWHERE
    })
    .catch(function (error) {
        console.log(error);
    });
}

function me(){
    axios.get('/api/auth/me')
    .then(response => {
        sessionStorage.setItem("user_id", response.id);
    })
    .catch(function (error) {
        console.log(error);
    });
}

function logout(){
    axios.post('/api/auth/logout')
    .then(response => {
        sessionStorage.removeItem("token");
        //TODO: REDIRECT TO SOMEWHERE
    })
    .catch(function (error) {
        console.log(error);
    });
}

function refresh(){
    axios.post('/api/auth/refresh')
    .then(response => {
        sessionStorage.setItem("token", response.access_token);
    })
    .catch(function (error) {
        console.log(error);
    });
}

//** GAME FUNCTIONS **/

function listGames(){
    axios.get('/api/resources/game')
    .then(response => {
        //{
        //    "data": [
        //        {
        //            "id": 4,
        //            "rows": 2,
        //            "columns": 2,
        //            "mines": 1,
        //            "start_at": "2021-02-23",
        //            "end_at": "2021-02-23",
        //            "status": "WIN"
        //        }
        //    ],
        //    "message": "Games retrieved successfully"
        //}
        //TODO: DO SOMETHING WITH ALL USER'S GAMES
    })
    .catch(function (error) {
        console.log(error);
    });
}

function saveGame(){
    let data = {
        user_id: sessionStorage.getItem("user_id"),
        rows: $('#gameRows').val(),
        columns: $('#gameColumns').val(),
        mines: $('#gameMines').val(),
        status: 'NONSTARTED'
    };

    axios.post('/api/resources/game', data)
    .then(response => {
        //{
        //    "data": {
        //        "id": 5,
        //        "rows": "2",
        //        "columns": "2",
        //        "mines": "1",
        //        "start_at": "2021-02-23T18:08:04.685680Z",
        //        "end_at": "2021-02-23T18:08:04.685778Z",
        //        "status": "NONSTARTED"
        //    },
        //    "message": "Game created successfully"
        //}
    })
    .catch(function (error) {
        console.log(error);
    });
}

function getGame(gameId){
    let url = '/api/resources/game/'+gameId;
    axios.get(url)
    .then(response => {
        //{
        //    "data": {
        //        "id": 4,
        //        "rows": 2,
        //        "columns": 2,
        //        "mines": 1,
        //        "start_at": "2021-02-23",
        //        "end_at": "2021-02-23",
        //        "status": "WIN"
        //    },
        //    "message": "Game retrieved successfully"
        //}
    })
    .catch(function (error) {
        console.log(error);
    });
}

function updateGame(gameId){
    let data = {
        user_id: sessionStorage.getItem("user_id"),
        rows: $('#gameRows').val(),
        columns: $('#gameColumns').val(),
        mines: $('#gameMines').val(),
        status: $('#gameStatus').val()
    };

    let url = '/api/resources/game/'+gameId;

    axios.put(url, data)
    .then(response => {
        //{
        //    "data": {
        //        "id": 5,
        //        "rows": "2",
        //        "columns": "2",
        //        "mines": "1",
        //        "start_at": "2021-02-23T18:08:04.685680Z",
        //        "end_at": "2021-02-23T18:08:04.685778Z",
        //        "status": "NONSTARTED"
        //    },
        //    "message": "Game updated successfully"
        //}
    })
    .catch(function (error) {
        console.log(error);
    });
}

function deleteGame(gameId){
    let url = '/api/resources/game/'+gameId;
    axios.delete(url)
    .then(response => {
        //NO RESPONSE
    })
    .catch(function (error) {
        console.log(error);
    });
}

//** GRID FUNCTIONS **/

function listGrid(){
    axios.get('/api/resources/grid')
    .then(response => {
        grid = response.data;
        //{
        //    "data": [
        //        {
        //            "id": 9,
        //            "x_cord": 0,
        //            "y_cord": 0,
        //            "mine": 1,
        //            "mines_around": 0,
        //            "mark": "0"
        //        },
        //        ...
        //    ],
        //    "message": "Grid retrieved successfully"
        //}
        //TODO: SHOW GRID SOMEHOW
    })
    .catch(function (error) {
        console.log(error);
    });
}

function updateGrid(cellId, mark){
    let cell = grid.filter(e => {return e.id == cellId})[0];
    let data = {
        x_cord: cell.x_cord,
        y_cord: cell.y_cord,
        mine: cell.mine,
        mark: mark,
        game_id: cell.game_id
    };

    let url = '/api/resources/grid/'+cellId;

    adjacentCells = [];
    getAdjacentCells(cellId);

    axios.put(url, data)
    .then(response => {
        //{
        //    "data": {
        //        "id": 9,
        //        "x_cord": "0",
        //        "y_cord": "0",
        //        "mine": "1",
        //        "mines_around": 0,
        //        "mark": "F"
        //    },
        //    "message": "Grid updated successfully"
        //}
    })
    .catch(function (error) {
        console.log(error);
    });
}

//** SESSION LOG FUNCTIONS **/

function listSessionLogs(){
    axios.get('/api/resources/session/log')
    .then(response => {
        //{
        //    "data": [{
        //        "id": 1,
        //        "user": "",
        //        "start": "",
        //        "end": ""
        //    }
        //    ...
        //    ],
        //    "message": "SessionLog retrieved successfully"
        //}
    })
    .catch(function (error) {
        console.log(error);
    });
}

//** USER FUNCTIONS **/

function listUser(){
    axios.get('/api/resources/user')
    .then(response => {
        //{
        //    "data": [
        //        {
        //            "id": 1,
        //            "fullName": "Ezequiel",
        //            "email": "ezesax@hotmail.com"
        //        }
        //        ...
        //    ],
        //    "message": "Users retrieved successfully"
        //}
        //TODO: DO SOMETHING WITH ALL USER'S GAMES
    })
    .catch(function (error) {
        console.log(error);
    });
}

function getUser(userId){
    let url = '/api/resources/user/'+userId;
    axios.get(url)
    .then(response => {
        //{
        //    "data": {
        //        "id": 1,
        //        "fullName": "Ezequiel",
        //        "email": "ezesax@hotmail.com"
        //    },
        //    "message": "User retrieved successfully"
        //}
    })
    .catch(function (error) {
        console.log(error);
    });
}

function updateUser(userId){
    let data = {fullName: $('#fullName').val(), email: $('#email').val()}

    let url = '/api/resources/user/'+userId;

    axios.put(url, data)
    .then(response => {
        //{
        //    "data": {
        //        "id": 1,
        //        "fullName": "Ezequiel Evaristo",
        //        "email": "ezesax@nonono.com"
        //    },
        //    "message": "User updated successfully"
        //}
    })
    .catch(function (error) {
        console.log(error);
    });
}

function deleteUser(userId){
    let url = '/api/resources/game/'+userId;
    axios.delete(url)
    .then(response => {
        //NO RESPONSE
    })
    .catch(function (error) {
        console.log(error);
    });
}

//** ADJACENT CELLS LOGIC **/adjacentCells grid
    //    [
    //        {
    //            "id": 9,
    //            "x_cord": 0,
    //            "y_cord": 0,
    //            "mine": 1,
    //            "mines_around": 0,
    //            "mark": "0"
    //        },
    //        ...
    //    ]

function getAdjacentCells(cellId){
    let cell = grid.filter(e => {return e.id == cellId})[0];

    if(cell.mine == 0){
        adjacents = grid.filter(e => {
            if(e.x_cord == cell.x_cord-1 && e.y_cord == cell.y_cord ||
               e.x_cord == cell.x_cord+1 && e.y_cord == cell.y_cord ||
               e.x_cord == cell.x_cord && e.y_cord == cell.y_cord-1 ||
               e.x_cord == cell.x_cord && e.y_cord == cell.y_cord+1){
                return e;
            }
        });

        adjacents.forEach(e => {
            if(e.mine == 0){
                getAdjacentCells(e.id);
                adjacentCells.push(e.id);
            }
        });
    }
}