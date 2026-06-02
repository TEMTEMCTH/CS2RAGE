<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require_once 'config.php';

// Временно убираем проверку на админа для теста
// (потом вернёшь обратно)

$input = json_decode(file_get_contents('php://input'), true);
$steamid = $input['steamid'] ?? '';
$newBalance = (int)($input['balance'] ?? 0);

if (!$steamid || $newBalance < 0) {
    echo json_encode(['success' => false, 'error' => 'Неверные данные'], JSON_UNESCAPED_UNICODE);
    exit;
}

$stmt = $conn->prepare("UPDATE users SET balance = ? WHERE steamid = ?");
$stmt->bind_param("is", $newBalance, $steamid);

if ($stmt->execute()) {
    echo json_encode(['success' => true], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(['success' => false, 'error' => 'Ошибка БД: ' . $stmt->error], JSON_UNESCAPED_UNICODE);
}

$stmt->close();
$conn->close();
?>