'use strict'

$(document).ready(() => {
    $('#loginBtn').on('click', () => {
        login();
    });

    $('#startNewGameBtn').on('click', () => {
        saveGame();
    });
});

async function checkUserLogin(){
    await me();

    if(sessionStorage.getItem("user_id") != null){
        let options = '<a id="newGame" onclick="openGameSettings()">New Game</a>';
            options += '<a id="oldGames" onclick="goToOldGames()">Old Games</a>';
            options += '<a id="logout" onclick="logout()">Logout</a>';

        $('#menuOptions').html(options);
    }else{
        let options = '<a id="login" onclick="openLogin()">Login</a>';
        $('#menuOptions').html(options);
    }
}

function openLogin(){
    $('#loginModal').modal('show');
}

function openGameSettings(){
    $('#gameSet').modal('show');
}

function goToOldGames(){
    window.location.href = './games.html';
}

function playGameById(gameId){
    sessionStorage.setItem("current_game", gameId);
    window.location.href = './play-game.html';
}