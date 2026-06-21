<?php
define('DB_HOST', '95.213.255.80');
define('DB_PORT', 3306);
define('DB_USER', 'u5006_lkP9XtcVyC');
define('DB_PASS', 'VtiFk^S@lBKF+SDI@SD=TvHV');
define('DB_NAME', 's5006_Main');

define('STEAM_API_KEY', '40F730167B45B3497D8E5058BE91C521');
define('SITE_URL', 'https://cs2rage.ru');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);
if ($conn->connect_error) {
    die("Ошибка подключения: " . $conn->connect_error);
}
$conn->set_charset("utf8mb4");
?>