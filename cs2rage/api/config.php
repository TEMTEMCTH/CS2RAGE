<?php
// config.php - НАСТРОЙ ПОД СЕБЯ!

// ===== ДАННЫЕ БАЗЫ ДАННЫХ (MySQL) =====
define('DB_HOST', 'localhost');           // Обычно localhost
define('DB_USER', 'dadadanepo');          // Твой пользователь БД
define('DB_PASS', 'eG1ZQAPWNT_MXEN5');   // Пароль от базы
define('DB_NAME', 'dadadanepo');          // Имя базы

// ===== STEAM API =====
// Получи здесь: https://steamcommunity.com/dev/apikey
define('STEAM_API_KEY', 'ТВОЙ_STEAM_API_КЛЮЧ');

// ===== НАСТРОЙКИ САЙТА =====
define('SITE_URL', 'https://cs2rage.ru');  // Твой домен
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

// Создание таблиц, если их нет
$conn->query("
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `steamid` VARCHAR(32) UNIQUE NOT NULL,
    `nickname` VARCHAR(64) NOT NULL,
    `avatar` VARCHAR(255),
    `is_admin` TINYINT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

$conn->query("
CREATE TABLE IF NOT EXISTS `skins` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `weapon` VARCHAR(64) NOT NULL,
    `skin_name` VARCHAR(128) NOT NULL,
    UNIQUE KEY `weapon_skin` (`weapon`, `skin_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

$conn->query("
CREATE TABLE IF NOT EXISTS `user_skins` (
    `user_id` INT NOT NULL,
    `weapon` VARCHAR(64) NOT NULL,
    `skin_id` INT NOT NULL,
    `pattern_seed` INT DEFAULT 0,
    `float_value` DECIMAL(10,8) DEFAULT 0.07,
    PRIMARY KEY (`user_id`, `weapon`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`skin_id`) REFERENCES `skins`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");
?>