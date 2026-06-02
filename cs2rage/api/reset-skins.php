<?php
session_start();
header('Content-Type: application/json');
require_once 'config.php';

if (!isset($_SESSION['user'])) {
    echo json_encode(['success' => false, 'error' => 'Не авторизован']);
    exit;
}

$steamid = $_SESSION['user']['steamid'];

$stmt = $conn->prepare("DELETE FROM wp_player_skins WHERE steamid = ?");
$stmt->bind_param("s", $steamid);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}
?>