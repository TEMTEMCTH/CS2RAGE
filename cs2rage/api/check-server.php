<?php
$socket = @fsockopen('udp://45.95.31.15', 27415, $errno, $errstr, 2);
if ($socket) {
    echo "✅ Сервер доступен по UDP";
    fclose($socket);
} else {
    echo "❌ Сервер НЕ ДОСТУПЕН: $errstr";
}
?>