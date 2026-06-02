<?php
header('Content-Type: application/json');
header('Cache-Control: max-age=3600');

$jsonFile = __DIR__ . '/skins.json';
if (!file_exists($jsonFile)) {
    echo json_encode(['success' => false, 'error' => 'Skins database not found']);
    exit;
}

$content = file_get_contents($jsonFile);
$data = json_decode($content, true);

if (!is_array($data)) {
    echo json_encode(['success' => false, 'error' => 'Invalid skins.json format']);
    exit;
}

// Группируем скины по оружию
$grouped = [];
foreach ($data as $item) {
    $weapon = $item['weapon']['name'] ?? $item['weapon_name'] ?? $item['category'] ?? '';
    if (!$weapon || $weapon === 'Unknown') continue;
    
    if (!isset($grouped[$weapon])) {
        $grouped[$weapon] = [];
    }
    
    $grouped[$weapon][] = [
        'id' => $item['id'] ?? null,
        'name' => $item['name'] ?? 'Unknown',
        'paint_index' => $item['paint_index'] ?? 0,
        'rarity' => $item['rarity']['name'] ?? $item['rarity'] ?? 'Common',
        'image' => $item['image'] ?? '',
        'min_float' => $item['min_float'] ?? 0,
        'max_float' => $item['max_float'] ?? 1
    ];
}

echo json_encode(['success' => true, 'data' => $grouped]);
?>