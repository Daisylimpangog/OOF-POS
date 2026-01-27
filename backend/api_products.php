<?php
header('Content-Type: application/json');
require_once 'config.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($action === 'all') {
        // Get all products
        $sql = "SELECT * FROM products ORDER BY category, name";
        $result = $conn->query($sql);
        $products = [];
        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
        echo json_encode(['success' => true, 'data' => $products]);
    } elseif ($action === 'by_category') {
        $category = isset($_GET['category']) ? $_GET['category'] : '';
        $sql = "SELECT * FROM products WHERE category = ? ORDER BY name";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('s', $category);
        $stmt->execute();
        $result = $stmt->get_result();
        $products = [];
        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
        echo json_encode(['success' => true, 'data' => $products]);
        $stmt->close();
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($action === 'add') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $name = $input['name'] ?? '';
        $category = $input['category'] ?? '';
        $pack_size = $input['pack_size'] ?? '';
        $retail_price = $input['retail_price'] ?? null;
        $institutional_price = $input['institutional_price'] ?? null;
        
        if (!$name || !$category || !$pack_size) {
            echo json_encode(['success' => false, 'message' => 'Missing required fields']);
            exit;
        }
        
        $sql = "INSERT INTO products (name, category, pack_size, retail_price, institutional_price) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('sssdd', $name, $category, $pack_size, $retail_price, $institutional_price);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Product added successfully', 'id' => $conn->insert_id]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error adding product']);
        }
        $stmt->close();
    } elseif ($action === 'delete') {
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        
        if (!$id) {
            echo json_encode(['success' => false, 'message' => 'Product ID required']);
            exit;
        }
        
        $sql = "DELETE FROM products WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Product deleted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error deleting product']);
        }
        $stmt->close();
    } elseif ($action === 'edit') {
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        
        if (!$id) {
            echo json_encode(['success' => false, 'message' => 'Product ID required']);
            exit;
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        $name = $input['name'] ?? '';
        $category = $input['category'] ?? '';
        $pack_size = $input['pack_size'] ?? '';
        $retail_price = $input['retail_price'] ?? null;
        $institutional_price = $input['institutional_price'] ?? null;
        
        if (!$name || !$category || !$pack_size) {
            echo json_encode(['success' => false, 'message' => 'Missing required fields']);
            exit;
        }
        
        $sql = "UPDATE products SET name = ?, category = ?, pack_size = ?, retail_price = ?, institutional_price = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('sssddi', $name, $category, $pack_size, $retail_price, $institutional_price, $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Product updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error updating product']);
        }
        $stmt->close();
    }
}
?>
