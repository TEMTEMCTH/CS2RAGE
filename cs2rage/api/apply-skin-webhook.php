<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
require_once 'config.php';

$input = json_decode(file_get_contents('php://input'), true);

$steamid = $input['steamid'] ?? '';
$weapon = $input['weapon'] ?? '';
$team = $input['team'] ?? 'ct';

if (!$steamid || !$weapon) {
    echo json_encode(['success' => false, 'error' => 'Invalid data']);
    exit;
}

// Получаем скин из БД
$stmt = $conn->prepare("SELECT paint, seed, wear, stattrak FROM wp_player_skins WHERE steamid = ? AND weapon = ? AND team = ?");
$stmt->bind_param("sss", $steamid, $weapon, $team);
$stmt->execute();
$result = $stmt->get_result();
$skin = $result->fetch_assoc();

if (!$skin) {
    echo json_encode(['success' => false, 'error' => 'Skin not found']);
    exit;
}

// Отправка на CS2 сервер через HTTP запрос
$server_url = 'http://95.213.31.15:8080/api/skin'; // URL API на сервере друга
$payload = [
    'steamid' => $steamid,
    'weapon' => $weapon,
    'team' => $team,
    'paint' => $skin['paint'],
    'seed' => $skin['seed'],
    'wear' => $skin['wear'],
    'stattrak' => $skin['stattrak']
];

$ch = curl_init($server_url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 2); // Не ждём ответа долго

curl_exec($ch);
curl_close($ch);

echo json_encode(['success' => true]);
?>