<?php
session_start();
header('Content-Type: application/json');
require_once 'config.php';

if (!isset($_SESSION['user'])) {
    echo json_encode(['success' => false, 'error' => 'Не авторизован']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$amount = $input['amount'] ?? 0;
$method = $input['method'] ?? 'sbp';
$userId = $_SESSION['user']['id'];
$orderId = 'ORDER_' . $userId . '_' . time() . '_' . rand(1000, 9999);

if ($amount < 10) {
    echo json_encode(['success' => false, 'error' => 'Минимальная сумма 10 ₽']);
    exit;
}

// Сохраняем заказ в БД
$stmt = $conn->prepare("INSERT INTO payments (order_id, user_id, amount, status, created_at) VALUES (?, ?, ?, 'pending', NOW())");
$stmt->bind_param("sid", $orderId, $userId, $amount);
$stmt->execute();

// Здесь должен быть код для генерации QR-кода через API СБП
// Пока возвращаем тестовый QR-код (заглушка)

// ВАЖНО: Для реальной работы нужно:
// 1. Зарегистрироваться как ИП/Юрлицо
// 2. Открыть расчётный счёт в банке (Т-Банк, Сбер, ПСБ и т.д.)
// 3. Подключить интернет-эквайринг и СБП
// 4. Получить API-ключи от банка
// 5. Заменить заглушку на реальный API-запрос к банку

// Пример для Т-Банка (Tinkoff):
// $api = new TinkoffApi();
// $qr = $api->createQR($orderId, $amount);

// Временная заглушка (только для теста!)
$testQrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" . urlencode("https://qr.nspk.ru/" . $orderId);

echo json_encode([
    'success' => true,
    'qr_code' => $testQrUrl,
    'order_id' => $orderId,
    'amount' => $amount
]);
?>