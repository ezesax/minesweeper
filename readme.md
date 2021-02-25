# Minesweeper

This is a project built in Laravel that emulates the classic game Minesweeper.

## Installation

Just clone or download the repo and run the following commands in the "backend-api" path:

```bash
composer install
php artisan serve
```
After that you should replace the basePath variable in the "frontend/api/api.js" file with the path and the port you are running the laravel application

## Usage

To use it you should to open the "frontend/index.html" in your web browser.

## Clarifications
### The Game mode
The game is very slow, because it was built as a restful api in Laravel, and any interaction with the game board, the front should to interact with the back and consult or update the database.

### Technology stack
I'm not a front developer, so the backend is a restful api built in Laravel 8, but the frontend is only javascript with jQuery and axios with no front framework.