<?php
session_start();
header('Content-Type: application/json');
require_once 'config.php';

if (!isset($_SESSION['user'])) {
    echo json_encode(['success' => false, 'error' => 'Не авторизован']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    echo json_encode(['success' => false, 'error' => 'Нет данных']);
    exit;
}

$weapon = $input['weapon'] ?? '';
$skinName = $input['skin'] ?? '';
$pattern = (int)($input['pattern'] ?? 0);
$float = (float)($input['float'] ?? 0.07);
$userId = $_SESSION['user']['id'];

if (!$weapon || !$skinName) {
    echo json_encode(['success' => false, 'error' => 'Не все поля заполнены']);
    exit;
}

$stmt = $conn->prepare("SELECT id FROM skins WHERE weapon = ? AND skin_name = ?");
$stmt->bind_param("ss", $weapon, $skinName);
$stmt->execute();
$result = $stmt->get_result();
$skin = $result->fetch_assoc();

if (!$skin) {
    $stmt = $conn->prepare("INSERT INTO skins (weapon, skin_name) VALUES (?, ?)");
    $stmt->bind_param("ss", $weapon, $skinName);
    $stmt->execute();
    $skinId = $conn->insert_id;
} else {
    $skinId = $skin['id'];
}

$stmt = $conn->prepare("INSERT INTO user_skins (user_id, weapon, skin_id, pattern_seed, float_value) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE skin_id = VALUES(skin_id), pattern_seed = VALUES(pattern_seed), float_value = VALUES(float_value)");
$stmt->bind_param("isiid", $userId, $weapon, $skinId, $pattern, $float);
$stmt->execute();

echo json_encode(['success' => true]);
?>