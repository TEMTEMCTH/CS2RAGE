<?php
header('Content-Type: application/json');
require_once 'config.php';

// Здесь нужно подключение к твоему серверу CS2
// Пока возвращаем демо-данные. Когда настроишь сервер, замени на реальные запросы

$servers = [];

// Пример: получаем данные из таблицы servers (если она есть)
$result = $conn->query("SELECT id, players FROM servers");
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $servers[] = $row;
    }
    echo json_encode(['success' => true, 'servers' => $servers]);
} else {
    // Демо-данные, пока нет реального подключения
    echo json_encode(['success' => true, 'servers' => []]);
}
?>