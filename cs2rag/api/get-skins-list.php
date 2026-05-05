<?php
header('Content-Type: application/json');
header('Cache-Control: max-age=3600');

$jsonFile = __DIR__ . '/skins.json';
if (!file_exists($jsonFile)) {
    echo json_encode(['error' => 'Skins database not found']);
    exit;
}

$content = file_get_contents($jsonFile);
$data = json_decode($content, true);

if (!is_array($data)) {
    $data = [];
}

$result = [];
foreach ($data as $item) {
    $result[] = [
        'id' => $item['id'] ?? null,
        'name' => $item['name'] ?? 'Unknown',
        'weapon_name' => $item['weapon']['name'] ?? $item['category'] ?? 'Item',
        'category' => $item['category'] ?? '',
        'rarity' => $item['rarity']['name'] ?? $item['rarity'] ?? '',
        'paint_index' => $item['paint_index'] ?? null,
        'image' => getSkinImage($item),
        'min_float' => $item['min_float'] ?? 0,
        'max_float' => $item['max_float'] ?? 1
    ];
}

echo json_encode($result);

function getSkinImage($item) {
    if (!empty($item['image'])) return $item['image'];
    if (!empty($item['paint_index'])) {
        return "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJYTYW09K4m5S0hf_3JqjUklRd4cJ5mPOYpd2hjgLk_RZtN2r7JY2TcA9pYlrQ_1Hp0e_uhc3ov8LOw2Ux7XYgvC3l0VwCioCQTg";
    }
    return '/images/no-image.png';
}
?>