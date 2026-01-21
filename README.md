# OOF POS - Deliveries & Sales System

A comprehensive point-of-sale system for managing product sales and deliveries with PDF export capabilities.

## Features

### Sales Module
- Add sales records with product, quantity, unit, store, and amount
- View all sales transactions
- Filter sales by date, store, and product category (HERBS/CROPS)
- Download sales reports as PDF
- Real-time sales summary with total amounts

### Deliveries Module
- Add delivery records with product, quantity, receiver, and store
- Track delivery status (pending, completed, returned)
- Process product returns with automatic quantity deduction
- Download delivery reports as PDF
- View all active deliveries

### Summary Module
- Monthly merged summary of sales and deliveries
- Download comprehensive monthly PDF reports
- View sales with revenue information
- View delivery quantities by product and store

## System Requirements

- PHP 7.4 or higher
- MySQL 5.7 or higher
- XAMPP (recommended for local development)
- TCPDF library for PDF generation

## Installation

### 1. Database Setup

1. Open phpMyAdmin (usually at `http://localhost/phpmyadmin`)
2. Import the `backend/database.sql` file:
   - Go to Import
   - Select `database.sql` file
   - Click Import

Or manually run the SQL in the SQL tab:
```sql
-- Copy contents from backend/database.sql and run
```

### 2. Install TCPDF

Navigate to the backend folder and run:
```bash
composer require tecnickcom/tcpdf
```

If you don't have Composer installed, download TCPDF manually from [tcpdf.org](https://tcpdf.org/) and extract to `backend/vendor/`

### 3. Configure Apache

Add an alias in your Apache httpd-vhosts.conf or use XAMPP:

```apache
<VirtualHost *:80>
    ServerName localhost
    DocumentRoot "C:/xampp/htdocs"
    <Directory "C:/xampp/htdocs">
        AllowOverride All
        Order Allow,Deny
        Allow from all
    </Directory>
</VirtualHost>
```

### 4. Access the Application

Place the entire project folder in XAMPP's htdocs:
```
C:/xampp/htdocs/OOF POS/
```

Open your browser and navigate to:
```
http://localhost/OOF%20POS/frontend/index.html
```

## File Structure

```
OOF POS/
├── backend/
│   ├── config.php              # Database configuration
│   ├── database.sql            # SQL database setup
│   ├── api_products.php        # Products API
│   ├── api_sales.php           # Sales API
│   ├── api_deliveries.php      # Deliveries API
│   ├── api_summary.php         # Summary API
│   ├── api_stores.php          # Stores API
│   ├── export_pdf.php          # PDF export functionality
│   └── vendor/                 # Third-party libraries (TCPDF)
│
├── frontend/
│   ├── index.html              # Main application interface
│   ├── css/
│   │   └── style.css           # Application styling
│   └── js/
│       └── main.js             # Application logic
│
├── README.md                    # This file
└── SETUP.md                     # Setup instructions
```

## Database Schema

### Products Table
- id (INT, Primary Key)
- name (VARCHAR)
- category (ENUM: HERBS, CROPS)
- pack_size (VARCHAR)
- retail_price (DECIMAL)
- institutional_price (DECIMAL)

### Sales Table
- id (INT, Primary Key)
- product_id (INT, Foreign Key)
- quantity (DECIMAL)
- unit (VARCHAR)
- store_id (INT, Foreign Key)
- amount (DECIMAL)
- sale_date (DATE)
- sale_time (TIME)
- notes (TEXT)

### Deliveries Table
- id (INT, Primary Key)
- product_id (INT, Foreign Key)
- quantity (DECIMAL)
- unit (VARCHAR)
- store_id (INT, Foreign Key)
- receiver (VARCHAR)
- delivery_date (DATE)
- delivery_time (TIME)
- status (ENUM: pending, completed, returned)
- notes (TEXT)

### Returns Table
- id (INT, Primary Key)
- delivery_id (INT, Foreign Key)
- product_id (INT, Foreign Key)
- quantity (DECIMAL)
- unit (VARCHAR)
- return_date (DATE)
- return_time (TIME)
- reason (TEXT)

## API Endpoints

### Products
- `GET /api_products.php?action=all` - Get all products
- `GET /api_products.php?action=by_category&category=HERBS` - Get products by category

### Sales
- `POST /api_sales.php?action=add` - Add new sale
- `GET /api_sales.php?action=all` - Get all sales
- `GET /api_sales.php?action=monthly_summary&month=2024-01` - Get monthly summary

### Deliveries
- `POST /api_deliveries.php?action=add` - Add new delivery
- `POST /api_deliveries.php?action=return` - Process product return
- `GET /api_deliveries.php?action=all` - Get all deliveries
- `GET /api_deliveries.php?action=monthly_summary&month=2024-01` - Get monthly summary

### Stores
- `GET /api_stores.php` - Get all stores

### PDF Export
- `GET /export_pdf.php?action=sales&month=2024-01` - Download sales report
- `GET /export_pdf.php?action=deliveries&month=2024-01` - Download deliveries report
- `GET /export_pdf.php?action=merged&month=2024-01` - Download merged monthly summary

## Usage Guide

### Adding a Sale
1. Click "Sales" tab
2. Click "Add Sale" button
3. Select product and store
4. Enter quantity, unit, and amount
5. Select sale date
6. (Optional) Add notes
7. Click "Save Sale"

### Adding a Delivery
1. Click "Deliveries" tab
2. Click "Add Delivery" button
3. Select product and store
4. Enter quantity and receiver name
5. Select delivery date
6. (Optional) Add notes
7. Click "Save Delivery"

### Processing a Return
1. In Deliveries tab, find the delivery to return
2. Click "Return" button
3. Enter quantity to return
4. Enter reason for return
5. Click "Process Return"
   - Quantity is automatically deducted from delivery

### Downloading Reports
- **Sales PDF**: Click "Download PDF" in Sales tab (exports current month)
- **Deliveries PDF**: Click "Download PDF" in Deliveries tab
- **Monthly Summary**: Go to Summary tab, select month, click "Download Merged Report"

## Customization

### Adding New Products
Edit `backend/database.sql` in the sample products section:
```sql
INSERT INTO products (name, category, pack_size, retail_price, institutional_price) VALUES
('Product Name', 'HERBS', '25 kg / week', 60, 45);
```

Then re-import the database or add directly via phpMyAdmin.

### Adding New Stores
1. Open phpMyAdmin
2. Navigate to the `stores` table
3. Add new store record with name and address

### Styling
Modify `frontend/css/style.css` to customize colors and layout.

## Troubleshooting

### Database Connection Error
- Check `backend/config.php` settings
- Ensure MySQL service is running
- Verify database credentials

### TCPDF Not Found
- Install TCPDF: `composer require tecnickcom/tcpdf`
- Or download manually and extract to `backend/vendor/`

### CORS Error
- Ensure `backend/config.php` has proper CORS headers
- Check browser console for specific errors

### API Endpoints Not Responding
- Verify Apache is running
- Check that files are in correct directory structure
- Ensure PHP is properly configured

## Support

For issues or questions, check the implementation files:
- Backend logic: `/backend/` PHP files
- Frontend UI: `/frontend/index.html`
- Styling: `/frontend/css/style.css`
- JavaScript: `/frontend/js/main.js`

## Future Enhancements

- User authentication and authorization
- Inventory management
- Advanced analytics and reporting
- Multi-user support with role-based access
- Mobile app version
- Real-time notifications
- Backup and restore functionality
