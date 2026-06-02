<?php
header('Content-Type: text/html; charset=utf-8');
require_once 'config.php';

echo "<h1>🔧 Создание таблиц для CS2RAGE</h1>";
echo "<p>База данных: " . DB_NAME . "</p>";
echo "<p>Хост: " . DB_HOST . "</p>";

if ($conn->connect_error) {
    die("<p style='color:red'>❌ Ошибка подключения: " . $conn->connect_error . "</p>");
}

echo "<p style='color:green'>✅ Подключено успешно!</p>";

// SQL для создания таблицы wp_player_skins
$sql = "
CREATE TABLE IF NOT EXISTS `wp_player_skins` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `steamid` VARCHAR(32) NOT NULL,
    `weapon` VARCHAR(64) NOT NULL,
    `paint` INT NOT NULL DEFAULT 0,
    `seed` INT NOT NULL DEFAULT 0,
    `wear` FLOAT NOT NULL DEFAULT 0.07,
    `stattrak` INT NOT NULL DEFAULT 0,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_steamid_weapon` (`steamid`, `weapon`),
    INDEX `idx_steamid` (`steamid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

if ($conn->query($sql) === TRUE) {
    echo "<p style='color:green'>✅ Таблица 'wp_player_skins' создана/обновлена</p>";
} else {
    echo "<p style='color:red'>❌ Ошибка: " . $conn->error . "</p>";
}

// Проверяем другие таблицы
$tables_to_check = ['users', 'payments', 'user_privileges'];

echo "<hr><h2>📋 Проверка других таблиц:</h2>";

foreach ($tables_to_check as $table) {
    $result = $conn->query("SHOW TABLES LIKE '$table'");
    if ($result && $result->num_rows > 0) {
        echo "<p style='color:green'>✅ Таблица '$table' существует</p>";
    } else {
        echo "<p style='color:orange'>⚠️ Таблица '$table' не найдена. Нужно создать.</p>";
        
        // Создаём недостающие таблицы
        switch($table) {
            case 'users':
                $conn->query("
                    CREATE TABLE IF NOT EXISTS `users` (
                        `id` INT NOT NULL AUTO_INCREMENT,
                        `steamid` VARCHAR(32) NOT NULL UNIQUE,
                        `nickname` VARCHAR(64) DEFAULT NULL,
                        `avatar` VARCHAR(255) DEFAULT NULL,
                        `balance` INT NOT NULL DEFAULT 0,
                        `is_admin` INT NOT NULL DEFAULT 0,
                        `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        PRIMARY KEY (`id`),
                        INDEX `idx_steamid` (`steamid`)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                ");
                echo "<p style='color:green'>  → Таблица 'users' создана</p>";
                break;
            case 'payments':
                $conn->query("
                    CREATE TABLE IF NOT EXISTS `payments` (
                        `id` INT NOT NULL AUTO_INCREMENT,
                        `order_id` VARCHAR(64) NOT NULL UNIQUE,
                        `user_id` INT NOT NULL,
                        `amount` INT NOT NULL,
                        `status` ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
                        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        `paid_at` TIMESTAMP NULL,
                        PRIMARY KEY (`id`)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                ");
                echo "<p style='color:green'>  → Таблица 'payments' создана</p>";
                break;
            case 'user_privileges':
                $conn->query("
                    CREATE TABLE IF NOT EXISTS `user_privileges` (
                        `id` INT NOT NULL AUTO_INCREMENT,
                        `steamid` VARCHAR(32) NOT NULL,
                        `tier` VARCHAR(32) NOT NULL,
                        `expires_at` DATETIME NOT NULL,
                        PRIMARY KEY (`id`),
                        UNIQUE KEY `unique_steamid` (`steamid`)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                ");
                echo "<p style='color:green'>  → Таблица 'user_privileges' создана</p>";
                break;
        }
    }
}

echo "<hr>";
echo "<h2>📊 Все таблицы в БД:</h2>";
$result = $conn->query("SHOW TABLES");
if ($result && $result->num_rows > 0) {
    echo "<ul>";
    while ($row = $result->fetch_row()) {
        echo "<li>" . $row[0] . "</li>";
    }
    echo "</ul>";
}

echo "<hr>";
echo "<p style='color:green; font-weight:bold;'>✅ Готово! Теперь страница скинченджера должна работать.</p>";
echo "<p><a href='/skinchanger.html'>🎨 Перейти в скинченджер</a></p>";

$conn->close();
?>