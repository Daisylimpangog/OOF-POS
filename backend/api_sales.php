<?php
header('Content-Type: application/json');
require_once 'config.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if ($action === 'add') {
        $product_id = isset($data['product_id']) ? $data['product_id'] : null;
        $quantity = isset($data['quantity']) ? $data['quantity'] : null;
        $unit = isset($data['unit']) ? $data['unit'] : 'kg';
        $store_id = isset($data['store_id']) ? $data['store_id'] : null;
        $amount = isset($data['amount']) ? $data['amount'] : null;
        $sale_date = isset($data['sale_date']) ? $data['sale_date'] : date('Y-m-d');
        $notes = isset($data['notes']) ? $data['notes'] : '';
        
        // Validate required fields
        if (!$product_id || !$quantity || !$store_id || !$amount) {
            echo json_encode(['success' => false, 'message' => 'Missing required fields']);
            exit();
        }
        
        // Start transaction
        $conn->begin_transaction();
        
        try {
            // Insert sale record
            $sql = "INSERT INTO sales (product_id, quantity, unit, store_id, amount, sale_date, notes) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            
            if (!$stmt) {
                throw new Exception('Prepare failed: ' . $conn->error);
            }
            
            $stmt->bind_param('iisidss', $product_id, $quantity, $unit, $store_id, $amount, $sale_date, $notes);
            
            if (!$stmt->execute()) {
                throw new Exception('Execute failed: ' . $stmt->error);
            }
            
            $sale_id = $stmt->insert_id;
            $stmt->close();
            
            // Deduct from deliveries (FIFO - first in, first out)
            $delivery_sql = "SELECT id, quantity FROM deliveries 
                            WHERE product_id = ? AND store_id = ? AND status = 'completed'
                            ORDER BY delivery_date ASC, id ASC";
            $delivery_stmt = $conn->prepare($delivery_sql);
            $delivery_stmt->bind_param('ii', $product_id, $store_id);
            $delivery_stmt->execute();
            $delivery_result = $delivery_stmt->get_result();
            
            $remaining_quantity = $quantity;
            
            while (($delivery_row = $delivery_result->fetch_assoc()) && $remaining_quantity > 0) {
                $delivery_id = $delivery_row['id'];
                $delivery_qty = $delivery_row['quantity'];
                
                if ($delivery_qty >= $remaining_quantity) {
                    // Update this delivery - reduce its quantity
                    $new_qty = $delivery_qty - $remaining_quantity;
                    $update_sql = "UPDATE deliveries SET quantity = ? WHERE id = ?";
                    $update_stmt = $conn->prepare($update_sql);
                    $update_stmt->bind_param('di', $new_qty, $delivery_id);
                    
                    if (!$update_stmt->execute()) {
                        throw new Exception('Update failed: ' . $update_stmt->error);
                    }
                    $update_stmt->close();
                    
                    $remaining_quantity = 0;
                } else {
                    // Delete this delivery and continue with remaining quantity
                    $delete_sql = "DELETE FROM deliveries WHERE id = ?";
                    $delete_stmt = $conn->prepare($delete_sql);
                    $delete_stmt->bind_param('i', $delivery_id);
                    
                    if (!$delete_stmt->execute()) {
                        throw new Exception('Delete failed: ' . $delete_stmt->error);
                    }
                    $delete_stmt->close();
                    
                    $remaining_quantity -= $delivery_qty;
                }
            }
            $delivery_stmt->close();
            
            // Commit transaction
            $conn->commit();
            
            echo json_encode(['success' => true, 'id' => $sale_id, 'message' => 'Sale added successfully. Delivery quantity deducted.']);
        } catch (Exception $e) {
            // Rollback transaction
            $conn->rollback();
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }

    } elseif ($action === 'delete') {
        $id = isset($data['id']) ? $data['id'] : null;
        
        if (!$id) {
            echo json_encode(['success' => false, 'message' => 'Missing sale ID']);
            exit();
        }
        
        $sql = "DELETE FROM sales WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Sale deleted successfully']);
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
    } elseif ($action === 'check_inventory') {
        $product_id = isset($_GET['product_id']) ? $_GET['product_id'] : null;
        $store_id = isset($_GET['store_id']) ? $_GET['store_id'] : null;
        
        if (!$product_id || !$store_id) {
            echo json_encode(['success' => false, 'message' => 'Missing product_id or store_id']);
            exit();
        }
        
        $sql = "SELECT SUM(quantity) as available_quantity FROM deliveries 
                WHERE product_id = ? AND store_id = ? AND status = 'completed'";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ii', $product_id, $store_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $available = $row['available_quantity'] ?? 0;
        $stmt->close();
        
        echo json_encode(['success' => true, 'available_quantity' => $available]);
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
