<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
require_once 'config.php';

$steamid = $_GET['steamid'] ?? '';

if (!$steamid) {
    echo json_encode(['success' => false, 'error' => 'No steamid']);
    exit;
}

$stmt = $conn->prepare("SELECT weapon, paint, seed, wear, stattrak, team FROM wp_player_skins WHERE steamid = ?");
$stmt->bind_param("s", $steamid);
$stmt->execute();
$result = $stmt->get_result();

$skins = [];
while ($row = $result->fetch_assoc()) {
    $skins[$row['weapon'] . '_' . $row['team']] = [
        'weapon' => $row['weapon'],
        'paint' => (int)$row['paint'],
        'seed' => (int)$row['seed'],
        'wear' => (float)$row['wear'],
        'stattrak' => (int)$row['stattrak'],
        'team' => $row['team']
    ];
}

echo json_encode(['success' => true, 'skins' => $skins]);
?>