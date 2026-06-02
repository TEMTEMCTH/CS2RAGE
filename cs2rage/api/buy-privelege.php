<?php
session_start();
header('Content-Type: application/json');
require_once 'config.php';

$input = json_decode(file_get_contents('php://input'), true);
$tier = $input['tier'] ?? '';
$days = (int)($input['days'] ?? 0);
$price = (int)($input['price'] ?? 0);
$steamid = $input['steamid'] ?? '';

if (!$steamid || !$tier || !$days) {
    echo json_encode(['success' => false, 'error' => 'Неверные данные']);
    exit;
}

// Проверяем баланс пользователя
$stmt = $conn->prepare("SELECT balance FROM users WHERE steamid = ?");
$stmt->bind_param("s", $steamid);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user || $user['balance'] < $price) {
    echo json_encode(['success' => false, 'error' => 'Недостаточно средств']);
    exit;
}

// Списываем деньги
$newBalance = $user['balance'] - $price;
$stmt = $conn->prepare("UPDATE users SET balance = ? WHERE steamid = ?");
$stmt->bind_param("is", $newBalance, $steamid);
$stmt->execute();

// Активируем привилегию
$expiresAt = date('Y-m-d H:i:s', strtotime("+$days days"));
$stmt = $conn->prepare("INSERT INTO user_privileges (steamid, tier, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE tier = VALUES(tier), expires_at = VALUES(expires_at)");
$stmt->bind_param("sss", $steamid, $tier, $expiresAt);
$stmt->execute();

echo json_encode(['success' => true]);
?>