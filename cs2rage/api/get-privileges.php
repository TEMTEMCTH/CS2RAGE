<?php
require_once 'config.php';
header('Content-Type: application/json');

$result = $conn->query("SELECT * FROM privileges ORDER BY id DESC");
$privileges = [];
while ($row = $result->fetch_assoc()) {
    $privileges[] = $row;
}
echo json_encode(['success' => true, 'privileges' => $privileges]);
?>