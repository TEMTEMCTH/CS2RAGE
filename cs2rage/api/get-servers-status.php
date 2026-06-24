<?php
/**
 * API для получения статуса серверов
 * Возвращает список серверов с реальным онлайном
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Параметры сервера
$server_ip = '45.95.31.102';
$server_port = 27315;

// Пытаемся получить реальный онлайн через Steam API
$real_status = null;
$steam_api_key = '40F730167B45B3497D8E5058BE91C521';
$url = "https://api.steampowered.com/IGameServersService/GetServerList/v1/?key=" . $steam_api_key . "&filter=\\addr\\" . $server_ip . ":" . $server_port;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 3);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code == 200 && $response) {
    $data = json_decode($response, true);
    if (isset($data['response']['servers'][0])) {
        $server = $data['response']['servers'][0];
        $real_status = [
            'players' => (int)($server['players'] ?? 0),
            'max_players' => (int)($server['max_players'] ?? 32),
            'map' => $server['map'] ?? 'de_mirage',
            'status' => ($server['players'] ?? 0) > 0 ? 'online' : 'offline'
        ];
    }
}

// Если не удалось через Steam API, пробуем UDP ping
if (!$real_status) {
    $socket = @fsockopen("udp://{$server_ip}", $server_port, $errno, $errstr, 1);
    if ($socket) {
        fclose($socket);
        $real_status = [
            'players' => 0,
            'max_players' => 32,
            'map' => 'de_mirage',
            'status' => 'offline'
        ];
    } else {
        $real_status = [
            'players' => 0,
            'max_players' => 32,
            'map' => 'de_mirage',
            'status' => 'offline'
        ];
    }
}

// Формируем список серверов
$servers = [];
$id = 1;

// Mirage (10 серверов)
for ($i = 1; $i <= 10; $i++) {
    $is_main = ($i === 1);
    $servers[] = [
        'id' => $id++,
        'name' => 'CS2RAGE | MIRAGE #' . $i,
        'mode' => 'public',
        'map' => 'de_mirage',
        'region' => 'ru',
        'city' => 'Москва',
        'slots' => 32,
        'players' => $is_main ? $real_status['players'] : 0,
        'status' => $is_main ? $real_status['status'] : 'offline',
        'ip' => $server_ip . ':' . (27315 + $i - 1)
    ];
}

// Dust2 (5 серверов)
for ($i = 1; $i <= 5; $i++) {
    $servers[] = [
        'id' => $id++,
        'name' => 'CS2RAGE | DUST2 #' . $i,
        'mode' => 'public',
        'map' => 'de_dust2',
        'region' => 'ru',
        'city' => 'Москва',
        'slots' => 32,
        'players' => 0,
        'status' => 'offline',
        'ip' => $server_ip . ':' . (27325 + $i - 1)
    ];
}

// Cache (5 серверов)
for ($i = 1; $i <= 5; $i++) {
    $servers[] = [
        'id' => $id++,
        'name' => 'CS2RAGE | CACHE #' . $i,
        'mode' => 'public',
        'map' => 'de_cache',
        'region' => 'ru',
        'city' => 'Москва',
        'slots' => 32,
        'players' => 0,
        'status' => 'offline',
        'ip' => $server_ip . ':' . (27330 + $i - 1)
    ];
}

// AWP (5 серверов)
for ($i = 1; $i <= 5; $i++) {
    $servers[] = [
        'id' => $id++,
        'name' => 'CS2RAGE | AWP #' . $i,
        'mode' => 'awp',
        'map' => 'awp_lego',
        'region' => 'ru',
        'city' => 'Москва',
        'slots' => 20,
        'players' => 0,
        'status' => 'offline',
        'ip' => $server_ip . ':' . (27335 + $i - 1)
    ];
}

// Arena (5 серверов)
for ($i = 1; $i <= 5; $i++) {
    $servers[] = [
        'id' => $id++,
        'name' => 'CS2RAGE | ARENA #' . $i,
        'mode' => 'arena',
        'map' => 'aim_redline',
        'region' => 'ru',
        'city' => 'Москва',
        'slots' => 16,
        'players' => 0,
        'status' => 'offline',
        'ip' => $server_ip . ':' . (27340 + $i - 1)
    ];
}

echo json_encode([
    'success' => true,
    'servers' => $servers
], JSON_UNESCAPED_UNICODE);