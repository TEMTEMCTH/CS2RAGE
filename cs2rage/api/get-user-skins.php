<?php
session_start();
header('Content-Type: application/json');
require_once 'config.php';

if (!isset($_SESSION['user'])) {
    echo json_encode(['success' => false, 'error' => 'Не авторизован']);
    exit;
}

$steamid = $_SESSION['user']['steamid'];

$stmt = $conn->prepare("SELECT weapon, paint, seed, wear FROM wp_player_skins WHERE steamid = ?");
$stmt->bind_param("s", $steamid);
$stmt->execute();
$result = $stmt->get_result();

$skins = [];
while ($row = $result->fetch_assoc()) {
    $skins[$row['weapon']] = [
        'paint' => (int)$row['paint'],
        'seed' => (int)$row['seed'],
        'wear' => (float)$row['wear']
    ];
}

echo json_encode(['success' => true, 'skins' => $skins]);
?>