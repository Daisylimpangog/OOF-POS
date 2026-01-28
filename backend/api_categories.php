<?php
header('Content-Type: application/json');
require_once 'config.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

// Check if categories table exists
$tableCheck = $conn->query("SHOW TABLES LIKE 'categories'");
if ($tableCheck->num_rows == 0) {
    // Table doesn't exist, create it
    $createTableSQL = "CREATE TABLE IF NOT EXISTS categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    if (!$conn->query($createTableSQL)) {
        echo json_encode(['success' => false, 'message' => 'Error creating categories table: ' . $conn->error]);
        exit;
    }
    
    // Insert default categories
    $defaultCategories = "INSERT INTO categories (name, description) VALUES
    ('HERBS', 'Herbs and Herbs Products'),
    ('CROPS', 'Crops and Agricultural Products'),
    ('FRUITS', 'Fresh Fruits'),
    ('BASKET/BAGS', 'Baskets and Bags'),
    ('DEHYDRATED PRODUCT', 'Dehydrated Products')
    ON DUPLICATE KEY UPDATE id=id";
    $conn->query($defaultCategories);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($action === 'all') {
        // Get all categories
        $sql = "SELECT * FROM categories ORDER BY name";
        $result = $conn->query($sql);
        
        if (!$result) {
            echo json_encode(['success' => false, 'message' => 'Error fetching categories: ' . $conn->error]);
            exit;
        }
        
        $categories = [];
        while ($row = $result->fetch_assoc()) {
            $categories[] = $row;
        }
        echo json_encode(['success' => true, 'data' => $categories]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($action === 'add') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $name = $input['name'] ?? '';
        $description = $input['description'] ?? '';
        
        if (!$name) {
            echo json_encode(['success' => false, 'message' => 'Category name is required']);
            exit;
        }
        
        // Check if category already exists
        $check_sql = "SELECT id FROM categories WHERE name = ?";
        $check_stmt = $conn->prepare($check_sql);
        $check_stmt->bind_param('s', $name);
        $check_stmt->execute();
        $check_result = $check_stmt->get_result();
        
        if ($check_result->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'Category already exists']);
            $check_stmt->close();
            exit;
        }
        $check_stmt->close();
        
        $sql = "INSERT INTO categories (name, description) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ss', $name, $description);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Category added successfully', 'id' => $conn->insert_id]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error adding category: ' . $conn->error]);
        }
        $stmt->close();
    } elseif ($action === 'update') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $id = $input['id'] ?? 0;
        $name = $input['name'] ?? '';
        $description = $input['description'] ?? '';
        
        if (!$id || !$name) {
            echo json_encode(['success' => false, 'message' => 'ID and category name are required']);
            exit;
        }
        
        // Check if another category with this name exists
        $check_sql = "SELECT id FROM categories WHERE name = ? AND id != ?";
        $check_stmt = $conn->prepare($check_sql);
        $check_stmt->bind_param('si', $name, $id);
        $check_stmt->execute();
        $check_result = $check_stmt->get_result();
        
        if ($check_result->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'Category name already exists']);
            $check_stmt->close();
            exit;
        }
        $check_stmt->close();
        
        $sql = "UPDATE categories SET name = ?, description = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ssi', $name, $description, $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Category updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error updating category: ' . $conn->error]);
        }
        $stmt->close();
    } elseif ($action === 'delete') {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? 0;
        
        if (!$id) {
            echo json_encode(['success' => false, 'message' => 'Category ID is required']);
            exit;
        }
        
        // Check if category is used in products
        $check_sql = "SELECT COUNT(*) as count FROM products WHERE category_id = ?";
        $check_stmt = $conn->prepare($check_sql);
        $check_stmt->bind_param('i', $id);
        $check_stmt->execute();
        $check_result = $check_stmt->get_result();
        $row = $check_result->fetch_assoc();
        
        if ($row['count'] > 0) {
            echo json_encode(['success' => false, 'message' => 'Cannot delete category - it is being used by ' . $row['count'] . ' product(s)']);
            $check_stmt->close();
            exit;
        }
        $check_stmt->close();
        
        $sql = "DELETE FROM categories WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Category deleted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error deleting category: ' . $conn->error]);
        }
        $stmt->close();
    }
}

$conn->close();
?>
