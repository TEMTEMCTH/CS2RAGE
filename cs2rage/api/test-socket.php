<?php
header('Content-Type: text/plain');

$ip = '45.95.31.15';
$port = 27415;

echo "Тестируем соединение с {$ip}:{$port}...\n\n";

$socket = @fsockopen("udp://{$ip}", $port, $errno, $errstr, 2);

if ($socket) {
    echo "✅ Сокет создан успешно!\n";
    fclose($socket);
} else {
    echo "❌ Ошибка: {$errstr} (код: {$errno})\n";
}
?>