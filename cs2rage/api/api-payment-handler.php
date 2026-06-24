<?php

header('Content-Type: application/json');
require_once 'api/config.php';

$input = json_decode(file_get_contents('php://input'), true);

$orderId = $input['OrderId'] ?? '';
$status = $input['Status'] ?? '';

if ($status === 'CONFIRMED' && $orderId) {
    $stmt = $conn->prepare("UPDATE payments SET status = 'paid', paid_at = NOW() WHERE order_id = ?");
    $stmt->bind_param("s", $orderId);
    $stmt->execute();
    
    
    $stmt = $conn->prepare("
        UPDATE users u 
        JOIN payments p ON u.id = p.user_id 
        SET u.balance = u.balance + p.amount 
        WHERE p.order_id = ? AND p.status = 'pending'
    ");
    $stmt->bind_param("s", $orderId);
    $stmt->execute();
}

echo json_encode(['status' => 'ok']);
?>