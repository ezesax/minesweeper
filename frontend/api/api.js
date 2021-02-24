'use strict'

var basePath = 'http://localhost:8000';
var grid = [];

$(document).ready(() => {

});

//** AUTH FUNCTIONS **/

function register(){
    let url = basePath+'/api/auth/register';
    let data = {fullName: $('#fullName').val(), email: $('#email').val(), password: $('#password').val()}
    axios.post(url, data)
    .then(response => {
        //TODO: REDIRECT TO LOGIN
    })
    .catch(function (error) {
        console.log(error);
    });
}

function login(){
    let url = basePath+'/api/auth/login';
    let data = {email: $('#email').val(), password: $('#password').val()}
    axios.post(url, data)
    .then(response => {
        sessionStorage.setItem("token", response.data.access_token);
        checkUserLogin();
        $('#loginModal').modal('hide');
    })
    .catch(function (error) {
        console.log(error);
        sessionStorage.removeItem("user_id");
        sessionStorage.removeItem("token");
    });
}

async function me(){
    let url = basePath+'/api/auth/me';
    await axios.get(url, {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
    .then(response => {
        if(response.data.status == 200){
            sessionStorage.setItem("user_id", response.data.data.id);
        }else{
            sessionStorage.removeItem("user_id");
        }
    })
    .catch(function (error) {
        console.log(error);
    });
}

function logout(){
    let url = basePath+'/api/auth/logout';
    axios.post(url, {}, {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
    .then(response => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("current_game");
        checkUserLogin();
    })
    .catch(function (error) {
        console.log(error);
    });
}

function refresh(){
    let url = basePath+'/api/auth/refresh';
    axios.post(url, {}, {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
    .then(response => {
        sessionStorage.setItem("token", response.data.access_token);
    })
    .catch(function (error) {
        console.log(error);
    });
}

//** GAME FUNCTIONS **/

function listGames(){
    let url = basePath+'/api/resources/game';
    axios.get(url, {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
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
        let cardGames = '';
        $('#allActiveGames').html('');
        response.data.data.forEach((e, i) => {
            cardGames += `
                <div class="card gameCard" style="width: 18rem;" onclick="playGameById(${e.id})">
                  <div class="card-body">
                    <h5 class="card-title">Game ${i+1}</h5>
                    <p class="card-text">Rows: ${e.rows}</p>
                    <p class="card-text">Columns: ${e.columns}</p>
                    <p class="card-text">Mines: ${e.mines}</p>
                    <br>
                    <p class="card-text">Started At: ${e.start_at}</p>
                  </div>
                </div>
            `;
        });

        $('#allActiveGames').html(cardGames);
    })
    .catch(function (error) {
        console.log(error);
    });
}

function saveGame(){
    let url = basePath+'/api/resources/game';
    let data = {
        user_id: sessionStorage.getItem("user_id"),
        rows: $('#gameRows').val(),
        columns: $('#gameColumns').val(),
        mines: $('#gameMines').val(),
        status: 'NONSTARTED'
    };

    axios.post(url, data, {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
    .then(response => {
        $('#gameSet').modal('hide');
        sessionStorage.setItem("current_game", response.data.data.id);
        window.location.href = './play-game.html';
        //TODO: REDIRECT TO PLAY-GAME PAGE
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
    let url = basePath+'/api/resources/game/'+gameId;
    axios.get(url, {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
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
    let url = basePath+'/api/resources/game/'+gameId;
    let data = {
        user_id: sessionStorage.getItem("user_id"),
        rows: $('#gameRows').val(),
        columns: $('#gameColumns').val(),
        mines: $('#gameMines').val(),
        status: $('#gameStatus').val()
    };

    axios.put(url, data, {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
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
    let url = basePath+'/api/resources/game/'+gameId;
    axios.delete(url, {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
    .then(response => {
        //NO RESPONSE
    })
    .catch(function (error) {
        console.log(error);
    });
}

//** GRID FUNCTIONS **/

function listGrid(gameId){
    let url = basePath+'/api/resources/grid/'+gameId;
    axios.get(url, {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
    .then(response => {
        grid = response.data.data;
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
    let url = basePath+'/api/resources/grid/'+cellId;
    let cell = grid.filter(e => {return e.id == cellId})[0];
    let data = {
        x_cord: cell.x_cord,
        y_cord: cell.y_cord,
        mine: cell.mine,
        mark: mark,
        game_id: cell.game_id,
    };

    axios.put(url, data, {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
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
    let url = basePath+'/api/resources/session/log';
    axios.get(url, {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
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
    let url = basePath+'/api/resources/user';
    axios.get(url, {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
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
    let url = basePath+'/api/resources/user/'+userId;
    axios.get(url, {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
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
    let url = basePath+'/api/resources/user/'+userId;
    let data = {fullName: $('#fullName').val(), email: $('#email').val()}

    axios.put(url, data, {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
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
    let url = basePath+'/api/resources/game/'+userId;
    axios.delete(url, {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
    .then(response => {
        //NO RESPONSE
    })
    .catch(function (error) {
        console.log(error);
    });
}