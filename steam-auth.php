<?php
require_once 'config.php';

$return_url = isset($_GET['return']) ? $_GET['return'] : '/';

if (isset($_SESSION['user'])) {
    header('Location: ' . $return_url);
    exit;
}

if (!isset($_GET['openid_ns'])) {
    $openid_url = 'https://steamcommunity.com/openid/login?' . http_build_query([
        'openid.ns' => 'http://specs.openid.net/auth/2.0',
        'openid.mode' => 'checkid_setup',
        'openid.return_to' => SITE_URL . '/steam-auth.php?return=' . urlencode($return_url),
        'openid.realm' => SITE_URL,
        'openid.identity' => 'http://specs.openid.net/auth/2.0/identifier_select',
        'openid.claimed_id' => 'http://specs.openid.net/auth/2.0/identifier_select'
    ]);
    header('Location: ' . $openid_url);
    exit;
}

$steamid = $_GET['openid_claimed_id'] ?? '';
$steamid = str_replace('http://steamcommunity.com/openid/id/', '', $steamid);

if (!$steamid) {
    die('Ошибка авторизации через Steam');
}

$url = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" . STEAM_API_KEY . "&steamids=" . $steamid;
$json = file_get_contents($url);
$data = json_decode($json, true);

if (empty($data['response']['players'][0])) {
    die('Не удалось получить данные профиля');
}

$player = $data['response']['players'][0];
$nickname = $player['personaname'];
$avatar = $player['avatarmedium'];

$stmt = $conn->prepare("INSERT INTO users (steamid, nickname, avatar) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE nickname = VALUES(nickname), avatar = VALUES(avatar)");
$stmt->bind_param("sss", $steamid, $nickname, $avatar);
$stmt->execute();

$stmt = $conn->prepare("SELECT * FROM users WHERE steamid = ?");
$stmt->bind_param("s", $steamid);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

$_SESSION['user'] = $user;

header('Location: ' . $return_url);
exit;
?>