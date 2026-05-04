<?php
// config.php - настройки подключения к БД и Steam API

// Настройки базы данных MySQL
define('DB_HOST', 'localhost');
define('DB_USER', 'ваш_пользователь');
define('DB_PASS', 'ваш_пароль');
define('DB_NAME', 'cs2rage');

// Steam API Key (получить на https://steamcommunity.com/dev/apikey)
define('STEAM_API_KEY', 'ВАШ_STEAM_API_KEY');

// Настройки сайта
define('SITE_URL', 'https://ваш-сайт.ru');
define('SITE_NAME', 'CS2RAGE');

// Подключение к БД
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conn->connect_error) {
    die("Ошибка подключения к базе данных: " . $conn->connect_error);
}
$conn->set_charset("utf8mb4");

// Запуск сессии
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>