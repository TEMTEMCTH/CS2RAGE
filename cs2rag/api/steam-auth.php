<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
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
        'openid.return_to' => SITE_URL . '/api/steam-auth.php?return=' . urlencode($return_url),
        'openid.realm' => SITE_URL,
        'openid.identity' => 'http://specs.openid.net/auth/2.0/identifier_select',
        'openid.claimed_id' => 'http://specs.openid.net/auth/2.0/identifier_select'
    ]);
    header('Location: ' . $openid_url);
    exit;
}

// Второй шаг: получаем SteamID
$steamid_full = $_GET['openid_claimed_id'] ?? '';

// ИЗВЛЕКАЕМ ТОЛЬКО ЧИСЛОВОЙ ID из ссылки вида:
// https://steamcommunity.com/openid/id/76561199032714181
if (preg_match('/\/openid\/id\/(\d+)$/', $steamid_full, $matches)) {
    $steamid = $matches[1];
} else {
    $steamid = str_replace('http://steamcommunity.com/openid/id/', '', $steamid_full);
    $steamid = str_replace('https://steamcommunity.com/openid/id/', '', $steamid);
}

if (!$steamid || !is_numeric($steamid)) {
    die('Ошибка авторизации через Steam: неверный SteamID. Получено: ' . htmlspecialchars($steamid_full));
}

// Получаем данные профиля из Steam API
$url = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" . STEAM_API_KEY . "&steamids=" . $steamid;
$json = file_get_contents($url);
$data = json_decode($json, true);

if (empty($data['response']['players'][0])) {
    die('Ошибка: не удалось получить данные профиля Steam для ID: ' . $steamid);
}

$player = $data['response']['players'][0];
$nickname = $player['personaname'];
$avatar = $player['avatarmedium'];

// Сохраняем пользователя в БД
$stmt = $conn->prepare("INSERT INTO users (steamid, nickname, avatar) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE nickname = VALUES(nickname), avatar = VALUES(avatar)");
if (!$stmt) {
    die('Ошибка подготовки запроса: ' . $conn->error);
}
$stmt->bind_param("sss", $steamid, $nickname, $avatar);
$stmt->execute();

if ($stmt->error) {
    die('Ошибка выполнения запроса: ' . $stmt->error);
}

// Получаем данные пользователя из БД
$stmt = $conn->prepare("SELECT * FROM users WHERE steamid = ?");
$stmt->bind_param("s", $steamid);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

if (!$user) {
    die('Ошибка: пользователь не найден в базе данных после авторизации. SteamID: ' . $steamid);
}

// Сохраняем в сессию
$_SESSION['user'] = $user;

// Перенаправляем обратно на сайт
header('Location: ' . $return_url);
exit;
?>