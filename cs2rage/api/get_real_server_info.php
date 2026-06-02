<?php
header('Content-Type: application/json');

$ip = '45.95.31.15';
$port = 27415;

// Используем Steam API для получения информации о сервере
$url = "https://api.steampowered.com/IGameServersService/GetServerList/v1/?key=" . STEAM_API_KEY . "&filter=\\addr\\" . $ip . ":" . $port;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$players = 0;
$max_players = 32;

if ($http_code == 200 && $response) {
    $data = json_decode($response, true);
    if (isset($data['response']['servers'][0])) {
        $server = $data['response']['servers'][0];
        $players = $server['players'] ?? 0;
        $max_players = $server['max_players'] ?? 32;
    }
}

echo json_encode([
    'success' => true,
    'server' => [
        'players' => $players,
        'max_players' => $max_players,
        'name' => 'CS2RAGE | MIRAGE #1',
        'map' => 'de_mirage',
        'online' => $players > 0
    ]
], JSON_UNESCAPED_UNICODE);
?>