<?php
session_start();
header('Content-Type: application/json');
require_once 'config.php';

$orderId = $_GET['order_id'] ?? '';

if (!$orderId) {
    echo json_encode(['status' => 'error', 'message' => 'No order_id']);
    exit;
}

$stmt = $conn->prepare("SELECT status, amount FROM payments WHERE order_id = ?");
$stmt->bind_param("s", $orderId);
$stmt->execute();
$result = $stmt->get_result();
$payment = $result->fetch_assoc();

if (!$payment) {
    echo json_encode(['status' => 'error', 'message' => 'Order not found']);
    exit;
}

echo json_encode([
    'status' => $payment['status'],
    'amount' => $payment['amount']
]);
?>