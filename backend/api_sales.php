<?php
header('Content-Type: application/json');
require_once 'config.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if ($action === 'add') {
        $product_id = $data['product_id'];
        $quantity = $data['quantity'];
        $unit = $data['unit'];
        $store_id = $data['store_id'];
        $amount = $data['amount'];
        $sale_date = $data['sale_date'];
        $notes = isset($data['notes']) ? $data['notes'] : '';
        
        $sql = "INSERT INTO sales (product_id, quantity, unit, store_id, amount, sale_date, notes) 
                VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('idsiids', $product_id, $quantity, $unit, $store_id, $amount, $sale_date, $notes);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'id' => $stmt->insert_id]);
        } else {
            echo json_encode(['success' => false, 'message' => $stmt->error]);
        }
        $stmt->close();
    }
}

if ($method === 'GET') {
    if ($action === 'all') {
        $sql = "SELECT s.*, p.name as product_name, p.category, st.name as store_name 
                FROM sales s 
                JOIN products p ON s.product_id = p.id 
                JOIN stores st ON s.store_id = st.id 
                ORDER BY s.sale_date DESC";
        $result = $conn->query($sql);
        $sales = [];
        while ($row = $result->fetch_assoc()) {
            $sales[] = $row;
        }
        echo json_encode(['success' => true, 'data' => $sales]);
    } elseif ($action === 'monthly_summary') {
        $month = isset($_GET['month']) ? $_GET['month'] : date('Y-m');
        $sql = "SELECT 
                    p.name as product_name,
                    p.category,
                    st.name as store_name,
                    SUM(s.quantity) as total_quantity,
                    SUM(s.amount) as total_amount,
                    s.unit
                FROM sales s
                JOIN products p ON s.product_id = p.id
                JOIN stores st ON s.store_id = st.id
                WHERE DATE_FORMAT(s.sale_date, '%Y-%m') = ?
                GROUP BY s.product_id, s.store_id
                ORDER BY st.name, p.name";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('s', $month);
        $stmt->execute();
        $result = $stmt->get_result();
        $summary = [];
        while ($row = $result->fetch_assoc()) {
            $summary[] = $row;
        }
        echo json_encode(['success' => true, 'data' => $summary]);
        $stmt->close();
    }
}
?>
