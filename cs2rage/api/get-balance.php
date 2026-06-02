<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require_once 'config.php';

if (!isset($_SESSION['user'])) {
    echo json_encode(['success' => false, 'error' => 'Не авторизован'], JSON_UNESCAPED_UNICODE);
    exit;
}

$userId = $_SESSION['user']['id'];

$stmt = $conn->prepare("SELECT balance FROM users WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

echo json_encode([
    'success' => true,
    'balance' => (int)($user['balance'] ?? 0)
], JSON_UNESCAPED_UNICODE);
?>