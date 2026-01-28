<?php
error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json');
require_once 'config.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if ($action === 'merged_monthly') {
        $month = isset($_GET['month']) ? $_GET['month'] : date('Y-m');
        
        // Sales summary
        $sales_sql = "SELECT 
                        'SALE' as type,
                        p.name as product_name,
                        p.category,
                        st.name as store_name,
                        SUM(s.quantity) as quantity,
                        s.unit,
                        SUM(s.amount) as amount,
                        'Sale' as description
                    FROM sales s
                    JOIN products p ON s.product_id = p.id
                    JOIN stores st ON s.store_id = st.id
                    WHERE DATE_FORMAT(s.sale_date, '%Y-%m') = ?
                    GROUP BY s.product_id, s.store_id
                    ORDER BY st.name, p.name";
        
        // Deliveries summary
        $delivery_sql = "SELECT 
                        'DELIVERY' as type,
                        p.name as product_name,
                        p.category,
                        st.name as store_name,
                        SUM(d.quantity) as quantity,
                        d.unit,
                        NULL as amount,
                        'Delivery' as description
                    FROM deliveries d
                    JOIN products p ON d.product_id = p.id
                    JOIN stores st ON d.store_id = st.id
                    WHERE DATE_FORMAT(d.delivery_date, '%Y-%m') = ?
                    GROUP BY d.product_id, d.store_id
                    ORDER BY st.name, p.name";
        
        $stmt1 = $conn->prepare($sales_sql);
        $stmt1->bind_param('s', $month);
        $stmt1->execute();
        $sales_result = $stmt1->get_result();
        
        $stmt2 = $conn->prepare($delivery_sql);
        $stmt2->bind_param('s', $month);
        $stmt2->execute();
        $delivery_result = $stmt2->get_result();
        
        $sales_data = [];
        while ($row = $sales_result->fetch_assoc()) {
            $sales_data[] = $row;
        }
        
        $delivery_data = [];
        while ($row = $delivery_result->fetch_assoc()) {
            $delivery_data[] = $row;
        }
        
        $merged = [
            'month' => $month,
            'sales' => $sales_data,
            'deliveries' => $delivery_data
        ];
        
        echo json_encode(['success' => true, 'data' => $merged]);
        $stmt1->close();
        $stmt2->close();
    }
}
?>
