# OOF POS System - Functionality Guide

## Overview
The OOF POS System is a comprehensive Point of Sale and Delivery Management System with the following three main modules:

### 1. **SALES Module** 📊
Manages all product sales transactions with the following capabilities:

**Input Fields:**
- **Product** - Select from HERBS or CROPS categories
- **Category** - Auto-populated based on selected product
- **Store** - Select destination store
- **Date** - Sale transaction date
- **Quantity (kg)** - Weight in kilograms
- **Amount (₱)** - Sale price in Philippine Pesos
- **Notes** - Optional transaction notes

**Features:**
- Filter by product category (All, HERBS, CROPS)
- View sales history with complete details
- Summary statistics:
  - Total Sales Amount (₱)
  - Total Sales Count
  - Total Quantity (kg)
  - Sales by Category breakdown
- Download Sales Report as PDF
- Add unlimited sales transactions

**Workflow:**
1. Click "➕ Add Sale" button
2. Fill in all required fields (marked with *)
3. Click "Save Sale"
4. Transaction appears in Sales History table
5. Download PDF report for records

---

### 2. **DELIVERIES module** 📦
Manages delivery operations and tracks product returns:

**Input Fields:**
- **Product** - Select from HERBS or CROPS categories
- **Category** - Auto-populated based on selected product
- **Store** - Select delivery destination store
- **Date** - Delivery transaction date
- **Quantity (kg)** - Weight in kilograms
- **Amount (₱)** - Delivery amount
- **Receiver Name** - Name of person receiving delivery
- **Notes** - Optional delivery notes

**Features:**
- Filter by delivery status (All, Pending, Completed, Returned)
- View delivery history with complete details
- Summary statistics:
  - Total Deliveries Count
  - Total Quantity (kg)
  - Completed Deliveries
  - Pending Deliveries
  - Returned/Deducted Amount
- Return Product functionality (automatic deduction)
- Download Deliveries Report as PDF
- Track receiver information for each delivery

**Workflow:**
1. Click "➕ Add Delivery" button
2. Fill in all required fields including receiver name
3. Click "Save Delivery"
4. Transaction appears in Deliveries History table
5. For returns: Click "Return" button on delivery item to process return
6. Download PDF report for records

---

### 3. **SUMMARY module** 📈
Consolidated monthly reporting combining sales and deliveries:

**Features:**
- **Month/Year Selector** - Choose any month to view data
- **Load Report Button** - Fetch merged data for selected month
- **Download PDF Button** - Generate combined report

**Report Contains:**

**Sales Summary Section:**
- Total Sales Amount (₱)
- Total Quantity Sold (kg)
- Total Transactions
- Sales by Category:
  - HERBS total
  - CROPS total

**Deliveries Summary Section:**
- Total Deliveries Count
- Total Quantity Delivered (kg)
- Completed Deliveries Count
- Pending Deliveries Count
- Returns/Deducted Amount (₱)

**Workflow:**
1. Select desired month/year from date picker
2. Click "Load Report" to fetch data
3. View aggregated statistics
4. Click "Download PDF" to export merged monthly report

---

## Navigation

### Sidebar Menu
The left sidebar contains four main navigation options:
- **📊 Sales** - Access sales management
- **📦 Deliveries** - Access delivery management
- **📈 Summary** - Access monthly reports
- **⚙️ Settings** - System configuration (if available)

---

## Data Tables

### Sales History Table
Shows all recorded sales with columns:
- Product Name
- Category (HERBS/CROPS badge)
- Store Name
- Quantity (kg)
- Amount (₱)
- Sale Date
- Action (Delete button)

### Deliveries History Table
Shows all recorded deliveries with columns:
- Product Name
- Category (HERBS/CROPS badge)
- Store Name
- Receiver Name
- Quantity (kg)
- Status (Pending/Completed/Returned badge)
- Delivery Date
- Actions (Return/Delete buttons)

---

## Product Categories

### HERBS
Agricultural herb products tracked by weight (kg)
- Examples: Basil, Oregano, Mint, etc.

### CROPS
Agricultural crop products tracked by weight (kg)
- Examples: Rice, Corn, Wheat, etc.

---

## Status Badges

### Delivery Status
- **🔵 Pending** - Delivery not yet completed
- **✅ Completed** - Delivery successfully delivered
- **↩️ Returned** - Product returned and deducted

---

## PDF Reports

### Sales Report
Includes:
- Report date range
- Complete sales list with details
- Category breakdown
- Total amounts

### Deliveries Report
Includes:
- Report date range
- Complete deliveries list with details
- Status breakdown
- Returns information

### Merged Report
Includes:
- Both Sales and Deliveries for the month
- Separate summaries for each
- Combined statistics
- Category and status breakdowns

---

## Key Features

✅ **Real-time Data Updates** - All changes immediately reflected in tables
✅ **Automatic Category Population** - Category auto-fills based on selected product
✅ **Status Tracking** - Track deliveries from pending to completed
✅ **Return Management** - Easy return processing with amount deduction
✅ **PDF Export** - Generate reports for each module
✅ **Responsive Design** - Works on desktop and tablet devices
✅ **Input Validation** - All required fields must be completed
✅ **Error Handling** - Clear error messages for troubleshooting

---

## Tips & Best Practices

1. **Always fill required fields** - Marked with red asterisk (*)
2. **Check category** - Ensure correct category is selected for each product
3. **Use consistent store names** - Keep store naming consistent for better reporting
4. **Receiver tracking** - Always enter receiver name for delivery accountability
5. **Regular PDF backups** - Download reports regularly for record keeping
6. **Return process** - Process returns promptly to maintain accurate inventory
7. **Date accuracy** - Ensure correct dates for proper report generation

---

## System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Active internet connection
- Apache/PHP server running
- MySQL database configured
- XAMPP environment set up

---

## Contact & Support

For issues or feature requests, contact the system administrator.

---

**Last Updated:** 2024
**Version:** 1.0
