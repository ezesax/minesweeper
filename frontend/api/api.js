'use strict'

var basePath = 'http://localhost/backend-api';
var grid = [];
var currentGame;

$(document).ready(() => {

});

//** AUTH FUNCTIONS **/

function register(){
    $('#createUserModal').modal('hide');
    startLoading();
    let url = basePath+'/api/auth/register';
    let data = {fullName: $('#fullName').val(), email: $('#userEmail').val(), password: $('#userPassword').val()}
    axios.post(url, data)
    .then(response => {
        stopLoading();
    })
    .catch(function (error) {
        stopLoading();
        console.log(error);
    });
}

function login(){
    $('#loginModal').modal('hide');
    startLoading();
    let url = basePath+'/api/auth/login';
    let data = {email: $('#email').val(), password: $('#password').val()}
    axios.post(url, data)
    .then(response => {
        sessionStorage.setItem("token", response.data.access_token);
        checkUserLogin();
        stopLoading();
    })
    .catch(function (error) {
        console.log(error);
        sessionStorage.removeItem("user_id");
        sessionStorage.removeItem("token");
        stopLoading();
    });
}

async function me(){
    startLoading();
    let url = basePath+'/api/auth/me';
    await axios.get(url, {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
    .then(response => {
        if(response.data.status == 200){
            sessionStorage.setItem("user_id", response.data.data.id);
        }else{
            sessionStorage.removeItem("user_id");
        }
        stopLoading();
    })
    .catch(function (error) {
        console.log(error);
        stopLoading();
    });
}

function logout(){
    startLoading();
    let url = basePath+'/api/auth/logout';
    axios.post(url, {}, {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
    .then(response => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("current_game");
        checkUserLogin();
        stopLoading();
        window.location.href = './index.html';
    })
    .catch(function (error) {
        console.log(error);
        stopLoading();
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
    startLoading();
    let url = basePath+'/api/resources/game';
    axios.get(url, {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
    .then(response => {
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
        stopLoading();
    })
    .catch(function (error) {
        console.log(error);
        stopLoading();
    });
}

function saveGame(){
    $('#gameSet').modal('hide');
    startLoading();
    let url = basePath+'/api/resources/game';
    let data = {
        user_id: sessionStorage.getItem("user_id"),
        rows: $('#gameRows').val(),
        columns: $('#gameColumns').val(),
        mines: $('#gameMines').val(),
        status: 'OPEN'
    };

    axios.post(url, data, {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
    .then(response => {
        sessionStorage.setItem("current_game", response.data.data.id);
        stopLoading();
        window.location.href = './play-game.html';
    })
    .catch(function (error) {
        console.log(error);
        stopLoading();
    });
}

async function getGame(gameId){
    let url = basePath+'/api/resources/game/'+gameId;
    await axios.get(url, {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
    .then(response => {
        currentGame = response.data.data;
    })
    .catch(function (error) {
        console.log(error);
    });
}

function updateGame(gameId){
    startLoading();
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
        stopLoading();
    })
    .catch(function (error) {
        console.log(error);
        stopLoading();
    });
}

function deleteGame(gameId){
    startLoading();
    let url = basePath+'/api/resources/game/'+gameId;
    axios.delete(url, {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
    .then(response => {
        stopLoading();
    })
    .catch(function (error) {
        console.log(error);
        stopLoading();
    });
}

//** GRID FUNCTIONS **/

async function listGrid(gameId){
    let url = basePath+'/api/resources/grid/'+gameId;
    await axios.get(url, {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
    .then(response => {
        grid = response.data.data;
    })
    .catch(function (error) {
        console.log(error);
    });
}

function updateGrid(cellId, event){
    startLoading();
    let url = basePath+'/api/resources/grid/'+cellId;
    let cell = grid.filter(e => {return e.id == cellId})[0];
    let mark = 0;

    if(event.button == 0){
        mark = 'R';
    }else if(event.button == 1){
        mark = 'Q';
    }else{
        mark = 'F';
    }

    let data = {
        x_cord: cell.x_cord,
        y_cord: cell.y_cord,
        mine: cell.mine,
        mark: mark,
        game_id: sessionStorage.getItem("current_game"),
    };

    axios.put(url, data, {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
    .then(response => {
        updateGameStatus();
        stopLoading();
    })
    .catch(function (error) {
        console.log(error);
        stopLoading();
    });
}

//** SESSION LOG FUNCTIONS **/

function listSessionLogs(){
    startLoading();
    let url = basePath+'/api/resources/session/log';
    axios.get(url, {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
    .then(response => {
        stopLoading();
    })
    .catch(function (error) {
        console.log(error);
        stopLoading();
    });
}

//** USER FUNCTIONS **/

function listUser(){
    startLoading();
    let url = basePath+'/api/resources/user';
    axios.get(url, {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
    .then(response => {
        stopLoading();
    })
    .catch(function (error) {
        console.log(error);
        stopLoading();
    });
}

function getUser(userId){
    startLoading();
    let url = basePath+'/api/resources/user/'+userId;
    axios.get(url, {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
    .then(response => {
        stopLoading();
    })
    .catch(function (error) {
        console.log(error);
        stopLoading();
    });
}

function updateUser(userId){
    startLoading();
    let url = basePath+'/api/resources/user/'+userId;
    let data = {fullName: $('#fullName').val(), email: $('#email').val()}

    axios.put(url, data, {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
    .then(response => {
        stopLoading();
    })
    .catch(function (error) {
        console.log(error);
        stopLoading();
    });
}

function deleteUser(userId){
    startLoading();
    let url = basePath+'/api/resources/game/'+userId;
    axios.delete(url, {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
    .then(response => {
        stopLoading();
    })
    .catch(function (error) {
        console.log(error);
        stopLoading();
    });
}