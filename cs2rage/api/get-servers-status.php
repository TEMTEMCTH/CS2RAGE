<?php
/**
 * API для получения статуса серверов
 * Использует get_real_server_info.php для реального онлайна
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Параметры сервера
$server_ip = '45.95.31.15';
$server_port = 27415;

// Пытаемся получить реальный онлайн через Source Query
$real_status = null;

// Способ 1: через наш новый скрипт (локальный вызов)
if (file_exists(__DIR__ . '/get_real_server_info.php')) {
    ob_start();
    include __DIR__ . '/get_real_server_info.php';
    $output = ob_get_clean();
    $data = json_decode($output, true);
    
    if ($data && isset($data['success']) && $data['success']) {
        $real_status = $data['server'];
    }
}

// Формируем ответ для сайта
if ($real_status) {
    $servers = [[
        'id' => 1,
        'name' => 'CS2RAGE | MIRAGE #1',
        'mode' => 'public',
        'map' => $real_status['map'],
        'city' => 'Москва',
        'players' => $real_status['players'],
        'max_players' => $real_status['max_players'],
        'status' => $real_status['online'] ? 'online' : 'offline',
        'ip' => $server_ip . ':' . $server_port
    ]];
} else {
    // Если не удалось получить статус — сервер считается оффлайн
    $servers = [[
        'id' => 1,
        'name' => 'CS2RAGE | MIRAGE #1',
        'mode' => 'public',
        'map' => 'de_mirage',
        'city' => 'Москва',
        'players' => 0,
        'max_players' => 32,
        'status' => 'offline',
        'ip' => $server_ip . ':' . $server_port
    ]];
}

echo json_encode([
    'success' => true,
    'servers' => $servers
], JSON_UNESCAPED_UNICODE);
?>