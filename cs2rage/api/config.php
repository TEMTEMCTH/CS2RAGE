<?php
define('DB_HOST', '95.213.255.80');
define('DB_PORT', 3306);
define('DB_USER', 'u4795_T9UpeZNjB1');
define('DB_PASS', 'LVcysg^+5R!74P@hHtpe1Cs!');
define('DB_NAME', 's4795_Main');

define('STEAM_API_KEY', '529EF9E78B0A83A19796DE00D325CF33');
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