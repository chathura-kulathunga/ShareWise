<?php
header('Content-Type: application/json');

// Read POST inputs safely
$peopleCount = isset($_POST['peopleCount']) ? intval($_POST['peopleCount']) : 0;
$purchasePrice = isset($_POST['purchasePrice']) ? floatval($_POST['purchasePrice']) : 0;
$salePrice = isset($_POST['salePrice']) ? floatval($_POST['salePrice']) : 0;
$commission = isset($_POST['commission']) && $_POST['commission'] !== '' ? floatval($_POST['commission']) : 0;
$shareType = isset($_POST['shareType']) ? $_POST['shareType'] : 'contribution';

// Validate basic inputs
if ($peopleCount < 2 || $purchasePrice <= 0 || $salePrice <= 0) {
    echo json_encode(['error' => 'Missing or invalid inputs.']);
    exit;
}

// Get contributions
$contributions = [];
$totalContribution = 0;
for ($i = 1; $i <= $peopleCount; $i++) {
    $key = 'contribution' . $i;
    if (!isset($_POST[$key]) || !is_numeric($_POST[$key])) {
        echo json_encode(['error' => "Contribution of person $i is missing or invalid."]);
        exit;
    }
    $val = floatval($_POST[$key]);
    if ($val < 0) {
        echo json_encode(['error' => "Contribution of person $i cannot be negative."]);
        exit;
    }
    $contributions[] = $val;
    $totalContribution += $val;
}

// Calculate profit after commission
$totalProfit = $salePrice - $purchasePrice;
$commissionAmount = 0;
if ($commission > 0) {
    $commissionAmount = $totalProfit * ($commission / 100);
    $totalProfit -= $commissionAmount;
}

if ($totalProfit < 0) {
    echo json_encode(['error' => 'Loss occurred. Profit sharing not possible.']);
    exit;
}

$shares = [];

if ($shareType === 'contribution') {
    if ($totalContribution == 0) {
        echo json_encode(['error' => 'Total contribution cannot be zero.']);
        exit;
    }
    // Share by contribution ratio
    foreach ($contributions as $c) {
        $shares[] = $totalProfit * ($c / $totalContribution);
    }
} elseif ($shareType === 'percentage') {
    // In your form, percentage inputs don’t exist yet,
    // so just divide equally as fallback
    $equalShare = $totalProfit / $peopleCount;
    for ($i = 0; $i < $peopleCount; $i++) {
        $shares[] = $equalShare;
    }
} else {
    echo json_encode(['error' => 'Invalid sharing method.']);
    exit;
}

echo json_encode([
    'totalProfit' => $totalProfit,
    'shares' => $shares,
    'commission' => $commission,
    'commissionAmount' => $commissionAmount
]);

exit;
