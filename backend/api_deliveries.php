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
        $receiver = $data['receiver'];
        $delivery_date = $data['delivery_date'];
        $notes = isset($data['notes']) ? $data['notes'] : '';
        
        $sql = "INSERT INTO deliveries (product_id, quantity, unit, store_id, receiver, delivery_date, notes) 
                VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('idsisss', $product_id, $quantity, $unit, $store_id, $receiver, $delivery_date, $notes);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'id' => $stmt->insert_id]);
        } else {
            echo json_encode(['success' => false, 'message' => $stmt->error]);
        }
        $stmt->close();
    } elseif ($action === 'return') {
        $delivery_id = $data['delivery_id'];
        $quantity = $data['quantity'];
        $reason = isset($data['reason']) ? $data['reason'] : '';
        
        // Get delivery details
        $sql = "SELECT product_id, quantity, unit FROM deliveries WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $delivery_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $delivery = $result->fetch_assoc();
        $stmt->close();
        
        if ($delivery) {
            // Create return record
            $sql = "INSERT INTO returns (delivery_id, product_id, quantity, unit, return_date, reason) 
                    VALUES (?, ?, ?, ?, CURDATE(), ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param('iidss', $delivery_id, $delivery['product_id'], $quantity, $delivery['unit'], $reason);
            
            if ($stmt->execute()) {
                // Update delivery quantity
                $new_quantity = $delivery['quantity'] - $quantity;
                $update_sql = "UPDATE deliveries SET quantity = ?, status = 'returned' WHERE id = ?";
                $update_stmt = $conn->prepare($update_sql);
                $update_stmt->bind_param('di', $new_quantity, $delivery_id);
                $update_stmt->execute();
                $update_stmt->close();
                
                echo json_encode(['success' => true, 'id' => $stmt->insert_id]);
            } else {
                echo json_encode(['success' => false, 'message' => $stmt->error]);
            }
            $stmt->close();
        }
    } elseif ($action === 'delete') {
        $id = isset($data['id']) ? $data['id'] : null;
        
        if (!$id) {
            echo json_encode(['success' => false, 'message' => 'Missing delivery ID']);
            exit();
        }
        
        $sql = "DELETE FROM deliveries WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Delivery deleted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => $stmt->error]);
        }
        $stmt->close();
    }
}

if ($method === 'GET') {
    if ($action === 'all') {
        $sql = "SELECT d.*, p.name as product_name, p.category, st.name as store_name 
                FROM deliveries d 
                JOIN products p ON d.product_id = p.id 
                JOIN stores st ON d.store_id = st.id 
                ORDER BY d.delivery_date DESC";
        $result = $conn->query($sql);
        $deliveries = [];
        while ($row = $result->fetch_assoc()) {
            $deliveries[] = $row;
        }
        echo json_encode(['success' => true, 'data' => $deliveries]);
    } elseif ($action === 'monthly_summary') {
        $month = isset($_GET['month']) ? $_GET['month'] : date('Y-m');
        $sql = "SELECT 
                    p.name as product_name,
                    p.category,
                    st.name as store_name,
                    SUM(d.quantity) as total_quantity,
                    d.unit
                FROM deliveries d
                JOIN products p ON d.product_id = p.id
                JOIN stores st ON d.store_id = st.id
                WHERE DATE_FORMAT(d.delivery_date, '%Y-%m') = ?
                GROUP BY d.product_id, d.store_id
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
