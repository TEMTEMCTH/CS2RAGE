<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
require_once 'config.php';

$input = json_decode(file_get_contents('php://input'), true);

$steamid = $input['steamid'] ?? '';
$weapon = $input['weapon'] ?? '';
$paint = (int)($input['paint'] ?? 0);
$seed = (int)($input['seed'] ?? 0);
$wear = (float)($input['wear'] ?? 0.07);
$stattrak = (int)($input['stattrak'] ?? 0);
$team = $input['team'] ?? 'ct';

if (!$steamid || !$weapon) {
    echo json_encode(['success' => false, 'error' => 'Invalid data']);
    exit;
}

$stmt = $conn->prepare("INSERT INTO wp_player_skins (steamid, weapon, paint, seed, wear, stattrak, team) 
                        VALUES (?, ?, ?, ?, ?, ?, ?) 
                        ON DUPLICATE KEY UPDATE 
                        paint = VALUES(paint), seed = VALUES(seed), 
                        wear = VALUES(wear), stattrak = VALUES(stattrak)");
$stmt->bind_param("ssiidis", $steamid, $weapon, $paint, $seed, $wear, $stattrak, $team);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}
?>