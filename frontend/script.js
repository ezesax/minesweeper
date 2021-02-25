'use strict'

$(document).ready(() => {
    $('#loginBtn').on('click', () => {
        login();
    });

    $('#startNewGameBtn').on('click', () => {
        saveGame();
    });

    $('#gameOverClose').on('click', () => {
        window.location.href = './index.html';
    });

    $('#createNewUserBtn').on('click', () => {
        register();
    });

    $(document).bind("contextmenu",function(e){
        return false;
    });

    checkUserLogin();
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
            options += '<a id="createUser" onclick="openCreateUser()">Create User</a>';
        $('#menuOptions').html(options);
    }
}

function openLogin(){
    $('#loginModal').modal('show');
}

function openCreateUser(){
    $('#createUserModal').modal('show');
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

function playGame(){
    updateGameStatus();
}

async function updateGameStatus(){
    startLoading();
    await getGame(sessionStorage.getItem("current_game"));
    await listGrid(sessionStorage.getItem("current_game"));
    buildGrid();
    stopLoading();

    if(currentGame.status == 'WIN'){
        win();
    }

    if(currentGame.status == 'CLOSE'){
        loose();
    }
}

function buildGrid(){
    $('#currentGame').html('');
    let table = '<table><tbody>';
    for(let row = 0; row < currentGame.rows; row++){
        table += '<tr>';
        for(let column = 0; column < currentGame.columns; column++){
            let cell = grid.filter(e => {if(e.y_cord == row && e.x_cord == column){return e}})[0];
            if(cell.mark == 'R'){
                if(cell.hint == 1 && cell.mines_around > 0){
                    table += `<td style="background-color:#d4dfeb">${cell.mines_around}</td>`;
                }else{
                    table += `<td style="background-color:#d4dfeb">&nbsp</td>`;
                }
            }else if(cell.mark == 'F'){
                table += `<td onmousedown="updateGrid(${cell.id}, event)" style="background-color:#d4dfeb">F</td>`;
            }else if(cell.mark == 'Q'){
                table += `<td onmousedown="updateGrid(${cell.id}, event)" style="background-color:#d4dfeb">?</td>`;
            }else{
                table += `<td style="background-color:#636b6f;cursor:pointer" onmousedown="updateGrid(${cell.id}, event)">&nbsp</td>`;
            }
        }
        table += '</tr>';
    }
    table += '</tbody></table>';
    $('#currentGame').html(table);
}

function win(){
    $('#gameOverMessage').html('<p>You win!!</p>');
    $('#gameOver').modal('show');
}

function loose(){
    $('#gameOverMessage').html('<p>You loose!!</p>');
    $('#gameOver').modal('show');
}

function startLoading(){
    document.getElementById('loading').style.display = 'block';
}

function stopLoading(){
    document.getElementById('loading').style.display = 'none';
}
