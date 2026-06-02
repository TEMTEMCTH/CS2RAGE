<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Сессия ДО любого вывода!
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once 'config.php';

$return_url = isset($_GET['return']) ? $_GET['return'] : '/';

// Если уже авторизован
if (isset($_SESSION['user']) && !empty($_SESSION['user'])) {
    header('Location: ' . $return_url);
    exit;
}

// Первый шаг: редирект на Steam
if (!isset($_GET['openid_ns'])) {
    $openid_url = 'https://steamcommunity.com/openid/login?' . http_build_query([
        'openid.ns' => 'http://specs.openid.net/auth/2.0',
        'openid.mode' => 'checkid_setup',
        'openid.return_to' => 'https://cs2rage.ru/api/steam-auth.php?return=' . urlencode($return_url),
        'openid.realm' => 'https://cs2rage.ru',
        'openid.identity' => 'http://specs.openid.net/auth/2.0/identifier_select',
        'openid.claimed_id' => 'http://specs.openid.net/auth/2.0/identifier_select'
    ]);
    header('Location: ' . $openid_url);
    exit;
}

// Второй шаг: получаем SteamID
$steamid_full = $_GET['openid_claimed_id'] ?? '';

if (preg_match('/\/openid\/id\/(\d+)$/', $steamid_full, $matches)) {
    $steamid = $matches[1];
} else {
    $steamid = str_replace('http://steamcommunity.com/openid/id/', '', $steamid_full);
    $steamid = str_replace('https://steamcommunity.com/openid/id/', '', $steamid);
}

if (!$steamid || !is_numeric($steamid)) {
    die('Ошибка авторизации: неверный SteamID');
}

// Получаем данные профиля
$url = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" . STEAM_API_KEY . "&steamids=" . $steamid;
$json = file_get_contents($url);
$data = json_decode($json, true);

if (empty($data['response']['players'][0])) {
    die('Ошибка: не удалось получить данные профиля');
}

$player = $data['response']['players'][0];
$nickname = $player['personaname'];
$avatar = $player['avatarmedium'];

// Сохраняем пользователя
$stmt = $conn->prepare("INSERT INTO users (steamid, nickname, avatar) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE nickname = VALUES(nickname), avatar = VALUES(avatar)");
$stmt->bind_param("sss", $steamid, $nickname, $avatar);
$stmt->execute();

// Получаем данные пользователя
$stmt = $conn->prepare("SELECT * FROM users WHERE steamid = ?");
$stmt->bind_param("s", $steamid);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

if (!$user) {
    die('Ошибка: пользователь не найден');
}

// Сохраняем в сессию
$_SESSION['user'] = $user;

// Принудительно сохраняем сессию
session_write_close();

// Перенаправляем
header('Location: ' . $return_url);
exit;
?>