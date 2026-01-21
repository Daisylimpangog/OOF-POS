<?php
header('Content-Type: application/pdf');
require_once 'config.php';
require_once 'vendor/autoload.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action === 'sales') {
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
    
    $pdf = new \TCPDF('P', 'mm', 'A4', true, 'UTF-8', false);
    $pdf->SetDefaultMonospacedFont('courier');
    $pdf->SetMargins(15, 15, 15);
    $pdf->SetAutoPageBreak(TRUE, 15);
    $pdf->AddPage();
    
    $pdf->SetFont('helvetica', 'B', 16);
    $pdf->Cell(0, 10, 'OOF POS SYSTEM - SALES REPORT', 0, 1, 'C');
    $pdf->SetFont('helvetica', '', 12);
    $pdf->Cell(0, 10, 'Month: ' . $month, 0, 1, 'C');
    $pdf->Ln(10);
    
    $pdf->SetFont('helvetica', 'B', 11);
    $pdf->SetFillColor(41, 128, 185);
    $pdf->SetTextColor(255, 255, 255);
    
    $pdf->Cell(40, 8, 'Product', 1, 0, 'L', true);
    $pdf->Cell(30, 8, 'Category', 1, 0, 'L', true);
    $pdf->Cell(40, 8, 'Store', 1, 0, 'L', true);
    $pdf->Cell(25, 8, 'Quantity', 1, 0, 'R', true);
    $pdf->Cell(20, 8, 'Unit', 1, 0, 'L', true);
    $pdf->Cell(30, 8, 'Amount', 1, 1, 'R', true);
    
    $pdf->SetFont('helvetica', '', 10);
    $pdf->SetTextColor(0, 0, 0);
    
    $total_amount = 0;
    while ($row = $result->fetch_assoc()) {
        $pdf->Cell(40, 8, substr($row['product_name'], 0, 15), 1, 0, 'L');
        $pdf->Cell(30, 8, $row['category'], 1, 0, 'L');
        $pdf->Cell(40, 8, substr($row['store_name'], 0, 15), 1, 0, 'L');
        $pdf->Cell(25, 8, number_format($row['total_quantity'], 2), 1, 0, 'R');
        $pdf->Cell(20, 8, $row['unit'], 1, 0, 'L');
        $pdf->Cell(30, 8, '₱' . number_format($row['total_amount'], 2), 1, 1, 'R');
        $total_amount += $row['total_amount'];
    }
    
    $pdf->SetFont('helvetica', 'B', 11);
    $pdf->SetFillColor(230, 230, 230);
    $pdf->Cell(140, 8, 'TOTAL', 1, 0, 'R', true);
    $pdf->Cell(30, 8, '₱' . number_format($total_amount, 2), 1, 1, 'R', true);
    
    $filename = 'Sales_Report_' . $month . '.pdf';
    $pdf->Output($filename, 'D');
    $stmt->close();
}

elseif ($action === 'deliveries') {
    $month = isset($_GET['month']) ? $_GET['month'] : date('Y-m');
    
    $sql = "SELECT 
                p.name as product_name,
                p.category,
                st.name as store_name,
                d.receiver,
                SUM(d.quantity) as total_quantity,
                d.unit
            FROM deliveries d
            JOIN products p ON d.product_id = p.id
            JOIN stores st ON d.store_id = st.id
            WHERE DATE_FORMAT(d.delivery_date, '%Y-%m') = ?
            GROUP BY d.product_id, d.store_id, d.receiver
            ORDER BY st.name, p.name";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $month);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $pdf = new \TCPDF('P', 'mm', 'A4', true, 'UTF-8', false);
    $pdf->SetDefaultMonospacedFont('courier');
    $pdf->SetMargins(15, 15, 15);
    $pdf->SetAutoPageBreak(TRUE, 15);
    $pdf->AddPage();
    
    $pdf->SetFont('helvetica', 'B', 16);
    $pdf->Cell(0, 10, 'OOF POS SYSTEM - DELIVERIES REPORT', 0, 1, 'C');
    $pdf->SetFont('helvetica', '', 12);
    $pdf->Cell(0, 10, 'Month: ' . $month, 0, 1, 'C');
    $pdf->Ln(10);
    
    $pdf->SetFont('helvetica', 'B', 11);
    $pdf->SetFillColor(46, 125, 50);
    $pdf->SetTextColor(255, 255, 255);
    
    $pdf->Cell(35, 8, 'Product', 1, 0, 'L', true);
    $pdf->Cell(25, 8, 'Category', 1, 0, 'L', true);
    $pdf->Cell(30, 8, 'Store', 1, 0, 'L', true);
    $pdf->Cell(30, 8, 'Receiver', 1, 0, 'L', true);
    $pdf->Cell(25, 8, 'Quantity', 1, 0, 'R', true);
    $pdf->Cell(20, 8, 'Unit', 1, 1, 'L', true);
    
    $pdf->SetFont('helvetica', '', 10);
    $pdf->SetTextColor(0, 0, 0);
    
    while ($row = $result->fetch_assoc()) {
        $pdf->Cell(35, 8, substr($row['product_name'], 0, 12), 1, 0, 'L');
        $pdf->Cell(25, 8, $row['category'], 1, 0, 'L');
        $pdf->Cell(30, 8, substr($row['store_name'], 0, 12), 1, 0, 'L');
        $pdf->Cell(30, 8, substr($row['receiver'], 0, 12), 1, 0, 'L');
        $pdf->Cell(25, 8, number_format($row['total_quantity'], 2), 1, 0, 'R');
        $pdf->Cell(20, 8, $row['unit'], 1, 1, 'L');
    }
    
    $filename = 'Deliveries_Report_' . $month . '.pdf';
    $pdf->Output($filename, 'D');
    $stmt->close();
}

elseif ($action === 'merged') {
    $month = isset($_GET['month']) ? $_GET['month'] : date('Y-m');
    
    $pdf = new \TCPDF('P', 'mm', 'A4', true, 'UTF-8', false);
    $pdf->SetDefaultMonospacedFont('courier');
    $pdf->SetMargins(15, 15, 15);
    $pdf->SetAutoPageBreak(TRUE, 15);
    $pdf->AddPage();
    
    $pdf->SetFont('helvetica', 'B', 16);
    $pdf->Cell(0, 10, 'OOF POS SYSTEM - MONTHLY SUMMARY', 0, 1, 'C');
    $pdf->SetFont('helvetica', '', 12);
    $pdf->Cell(0, 10, 'Month: ' . $month, 0, 1, 'C');
    $pdf->Ln(10);
    
    // Sales Section
    $pdf->SetFont('helvetica', 'B', 13);
    $pdf->SetTextColor(41, 128, 185);
    $pdf->Cell(0, 10, 'SALES SUMMARY', 0, 1);
    $pdf->SetTextColor(0, 0, 0);
    
    $sales_sql = "SELECT 
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
    
    $stmt = $conn->prepare($sales_sql);
    $stmt->bind_param('s', $month);
    $stmt->execute();
    $sales_result = $stmt->get_result();
    
    $pdf->SetFont('helvetica', 'B', 10);
    $pdf->SetFillColor(41, 128, 185);
    $pdf->SetTextColor(255, 255, 255);
    
    $pdf->Cell(35, 7, 'Product', 1, 0, 'L', true);
    $pdf->Cell(20, 7, 'Cat.', 1, 0, 'L', true);
    $pdf->Cell(30, 7, 'Store', 1, 0, 'L', true);
    $pdf->Cell(20, 7, 'Qty', 1, 0, 'R', true);
    $pdf->Cell(15, 7, 'Unit', 1, 0, 'L', true);
    $pdf->Cell(25, 7, 'Amount', 1, 1, 'R', true);
    
    $pdf->SetFont('helvetica', '', 9);
    $pdf->SetTextColor(0, 0, 0);
    $total_sales = 0;
    
    while ($row = $sales_result->fetch_assoc()) {
        $pdf->Cell(35, 7, substr($row['product_name'], 0, 12), 1, 0, 'L');
        $pdf->Cell(20, 7, $row['category'], 1, 0, 'L');
        $pdf->Cell(30, 7, substr($row['store_name'], 0, 12), 1, 0, 'L');
        $pdf->Cell(20, 7, number_format($row['total_quantity'], 2), 1, 0, 'R');
        $pdf->Cell(15, 7, $row['unit'], 1, 0, 'L');
        $pdf->Cell(25, 7, '₱' . number_format($row['total_amount'], 2), 1, 1, 'R');
        $total_sales += $row['total_amount'];
    }
    
    $pdf->SetFont('helvetica', 'B', 10);
    $pdf->SetFillColor(230, 230, 230);
    $pdf->Cell(105, 7, 'Total Sales', 1, 0, 'R', true);
    $pdf->Cell(25, 7, '₱' . number_format($total_sales, 2), 1, 1, 'R', true);
    
    $pdf->Ln(10);
    
    // Deliveries Section
    $pdf->SetFont('helvetica', 'B', 13);
    $pdf->SetTextColor(46, 125, 50);
    $pdf->Cell(0, 10, 'DELIVERIES SUMMARY', 0, 1);
    $pdf->SetTextColor(0, 0, 0);
    
    $delivery_sql = "SELECT 
                        p.name as product_name,
                        p.category,
                        st.name as store_name,
                        d.receiver,
                        SUM(d.quantity) as total_quantity,
                        d.unit
                    FROM deliveries d
                    JOIN products p ON d.product_id = p.id
                    JOIN stores st ON d.store_id = st.id
                    WHERE DATE_FORMAT(d.delivery_date, '%Y-%m') = ?
                    GROUP BY d.product_id, d.store_id, d.receiver
                    ORDER BY st.name, p.name";
    
    $stmt = $conn->prepare($delivery_sql);
    $stmt->bind_param('s', $month);
    $stmt->execute();
    $delivery_result = $stmt->get_result();
    
    $pdf->SetFont('helvetica', 'B', 10);
    $pdf->SetFillColor(46, 125, 50);
    $pdf->SetTextColor(255, 255, 255);
    
    $pdf->Cell(30, 7, 'Product', 1, 0, 'L', true);
    $pdf->Cell(18, 7, 'Cat.', 1, 0, 'L', true);
    $pdf->Cell(25, 7, 'Store', 1, 0, 'L', true);
    $pdf->Cell(25, 7, 'Receiver', 1, 0, 'L', true);
    $pdf->Cell(18, 7, 'Qty', 1, 0, 'R', true);
    $pdf->Cell(14, 7, 'Unit', 1, 1, 'L', true);
    
    $pdf->SetFont('helvetica', '', 9);
    $pdf->SetTextColor(0, 0, 0);
    
    while ($row = $delivery_result->fetch_assoc()) {
        $pdf->Cell(30, 7, substr($row['product_name'], 0, 10), 1, 0, 'L');
        $pdf->Cell(18, 7, $row['category'], 1, 0, 'L');
        $pdf->Cell(25, 7, substr($row['store_name'], 0, 10), 1, 0, 'L');
        $pdf->Cell(25, 7, substr($row['receiver'], 0, 10), 1, 0, 'L');
        $pdf->Cell(18, 7, number_format($row['total_quantity'], 2), 1, 0, 'R');
        $pdf->Cell(14, 7, $row['unit'], 1, 1, 'L');
    }
    
    $filename = 'Monthly_Summary_' . $month . '.pdf';
    $pdf->Output($filename, 'D');
    $stmt->close();
}
?>
