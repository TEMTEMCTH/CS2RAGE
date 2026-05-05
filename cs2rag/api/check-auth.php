<?php
session_start();
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

if (isset($_SESSION['user']) && !empty($_SESSION['user'])) {
    echo json_encode([
        'authenticated' => true,
        'user' => [
            'steamid' => $_SESSION['user']['steamid'],
            'nickname' => $_SESSION['user']['nickname'],
            'avatar' => $_SESSION['user']['avatar'],
            'is_admin' => (int)$_SESSION['user']['is_admin'],
            'id' => $_SESSION['user']['id']
        ]
    ]);
} else {
    echo json_encode(['authenticated' => false]);
}
?>