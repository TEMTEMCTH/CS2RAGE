<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require_once 'config.php';

// Получаем всех пользователей с полем balance
$result = $conn->query("SELECT id, steamid, nickname, avatar, balance, is_admin, created_at FROM users ORDER BY id DESC");

if (!$result) {
    echo json_encode(['success' => false, 'error' => 'Ошибка запроса: ' . $conn->error], JSON_UNESCAPED_UNICODE);
    exit;
}

$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = [
        'id' => (int)$row['id'],
        'steamid' => $row['steamid'],
        'nickname' => $row['nickname'],
        'avatar' => $row['avatar'],
        'balance' => (int)($row['balance'] ?? 0),
        'is_admin' => (int)($row['is_admin'] ?? 0),
        'created_at' => $row['created_at']
    ];
}

echo json_encode(['success' => true, 'users' => $users], JSON_UNESCAPED_UNICODE);
?>