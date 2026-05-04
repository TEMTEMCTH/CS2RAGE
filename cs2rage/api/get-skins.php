<?php
session_start();
header('Content-Type: application/json');
require_once '../config.php';

if (!isset($_SESSION['user'])) {
    echo json_encode([]);
    exit;
}

$userId = $_SESSION['user']['id'];

$stmt = $conn->prepare("
    SELECT us.weapon, s.skin_name, us.pattern_seed, us.float_value 
    FROM user_skins us 
    JOIN skins s ON us.skin_id = s.id 
    WHERE us.user_id = ?
");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$skins = [];
while ($row = $result->fetch_assoc()) {
    $skins[$row['weapon']] = [
        'skin_name' => $row['skin_name'],
        'pattern' => $row['pattern_seed'],
        'float' => (float)$row['float_value']
    ];
}

echo json_encode($skins);
?>