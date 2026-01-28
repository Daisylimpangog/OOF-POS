<?php
error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json');
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($method === 'GET') {
    $sql = "SELECT * FROM stores ORDER BY name";
    $result = $conn->query($sql);
    $stores = [];
    while ($row = $result->fetch_assoc()) {
        $stores[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $stores]);
} elseif ($method === 'POST') {
    if ($action === 'add') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $name = $input['name'] ?? '';
        $address = $input['address'] ?? null;
        
        if (!$name) {
            echo json_encode(['success' => false, 'message' => 'Store name is required']);
            exit;
        }
        
        $sql = "INSERT INTO stores (name, address) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ss', $name, $address);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Store added successfully', 'id' => $conn->insert_id]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error adding store']);
        }
        $stmt->close();
    } elseif ($action === 'delete') {
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        
        if (!$id) {
            echo json_encode(['success' => false, 'message' => 'Store ID required']);
            exit;
        }
        
        $sql = "DELETE FROM stores WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Store deleted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error deleting store']);
        }
        $stmt->close();
    } elseif ($action === 'edit') {
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        
        if (!$id) {
            echo json_encode(['success' => false, 'message' => 'Store ID required']);
            exit;
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        $name = $input['name'] ?? '';
        $address = $input['address'] ?? null;
        
        if (!$name) {
            echo json_encode(['success' => false, 'message' => 'Store name is required']);
            exit;
        }
        
        $sql = "UPDATE stores SET name = ?, address = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ssi', $name, $address, $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Store updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error updating store']);
        }
        $stmt->close();
    }
}
?>
