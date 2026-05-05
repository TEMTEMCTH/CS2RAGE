<?php
require_once 'api/config.php';

echo "Проверка таблиц в базе данных...<br><br>";

$result = $conn->query("SHOW TABLES");
if ($result) {
    echo "Таблицы в базе:<br>";
    while ($row = $result->fetch_row()) {
        echo "- " . $row[0] . "<br>";
    }
} else {
    echo "Ошибка: " . $conn->error;
}
?>