<?php
session_start();
header('Content-Type: application/json');
require_once 'config.php';

// Включаем отладку
error_reporting(E_ALL);
ini_set('display_errors', 1);

$response = ['success' => false, 'error' => ''];

// Проверяем авторизацию
if (!isset($_SESSION['user'])) {
    $response['error'] = 'Не авторизован';
    echo json_encode($response);
    exit;
}

// Получаем данные из запроса
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    $response['error'] = 'Нет данных. Получено: ' . file_get_contents('php://input');
    echo json_encode($response);
    exit;
}

$weapon = $input['weapon'] ?? '';
$paint = (int)($input['paint'] ?? 0);
$seed = (int)($input['seed'] ?? 0);
$wear = (float)($input['wear'] ?? 0.07);
$stattrak = (int)($input['stattrak'] ?? 0);
$steamid = $_SESSION['user']['steamid'];

if (!$weapon || !$paint) {
    $response['error'] = 'Неверные данные: weapon=' . $weapon . ', paint=' . $paint;
    echo json_encode($response);
    exit;
}

// Проверяем подключение к БД
if ($conn->connect_error) {
    $response['error'] = 'Ошибка БД: ' . $conn->connect_error;
    echo json_encode($response);
    exit;
}

// Проверяем существование таблицы
$table_check = $conn->query("SHOW TABLES LIKE 'wp_player_skins'");
if ($table_check->num_rows == 0) {
    $response['error'] = 'Таблица wp_player_skins не существует. Создайте её через create_skins_table_fixed.php';
    echo json_encode($response);
    exit;
}

// Сохраняем скин
$stmt = $conn->prepare("INSERT INTO wp_player_skins (steamid, weapon, paint, seed, wear, stattrak) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE paint = VALUES(paint), seed = VALUES(seed), wear = VALUES(wear), stattrak = VALUES(stattrak)");

if (!$stmt) {
    $response['error'] = 'Ошибка подготовки запроса: ' . $conn->error;
    echo json_encode($response);
    exit;
}

$stmt->bind_param("ssiidi", $steamid, $weapon, $paint, $seed, $wear, $stattrak);

if ($stmt->execute()) {
    $response['success'] = true;
} else {
    $response['error'] = 'Ошибка выполнения: ' . $stmt->error;
}

$stmt->close();
$conn->close();

echo json_encode($response);
?>