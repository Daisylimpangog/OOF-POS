# OOF POS System - Complete Setup Guide

## 📋 System Requirements

- **Windows OS** (10, 11, or higher)
- **XAMPP 7.4+** (Apache, PHP 7.4+, MySQL 5.7+)
- **Modern Web Browser** (Chrome, Firefox, Safari, Edge)
- **Composer 1.10+** (for PHP dependencies)

---

## 🚀 Quick Start (5 Steps)

### Step 1️⃣: Start XAMPP Services

1. Open XAMPP Control Panel (`C:\xampp\xampp-control.exe`)
2. Click **Start** next to Apache
3. Click **Start** next to MySQL
4. Wait for both to show "Running" in green

### Step 2️⃣: Create Database

1. Open `http://localhost/phpmyadmin` in your browser
2. Click **+ New** in the left sidebar
3. Enter database name: `oof_pos_system`
4. Select collation: `utf8mb4_general_ci`
5. Click **Create**

### Step 3️⃣: Import Database Schema

1. Click the `oof_pos_system` database from the left panel
2. Click the **Import** tab
3. Click **Choose File** and select: `C:\xampp\htdocs\OOF POS\backend\database.sql`
4. Click **Import** at the bottom
5. Wait for success message (should show "Success" in green)

### Step 4: Install TCPDF (For PDF Export)

Open Command Prompt/PowerShell in `c:\xampp\OOF POS\backend` folder:

```bash
# First, check if composer is installed
composer --version

# If not installed, install via PHP
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
php -r "unlink('composer-setup.php');"

# Install TCPDF
php composer.phar require tecnickcom/tcpdf
```

**Alternative: Manual TCPDF Installation**
1. Download from: https://tcpdf.org/download.php
2. Extract to: `c:\xampp\OOF POS\backend\vendor\`
3. Rename folder to: `c:\xampp\OOF POS\backend\vendor\tcpdf\`

### Step 5: Configure Apache (Optional - if not using XAMPP default)

Edit `C:\xampp\apache\conf\extra\httpd-vhosts.conf`:

```apache
<VirtualHost *:80>
    ServerName oof-pos.local
    DocumentRoot "C:\xampp\OOF POS"
    <Directory "C:\xampp\OOF POS">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Then add to `C:\Windows\System32\drivers\etc\hosts`:
```
127.0.0.1    oof-pos.local
```

### Step 6: Access the Application

Open your browser and go to:
```
http://localhost/OOF%20POS/frontend/index.html
```

Or if using Apache vhost:
```
http://oof-pos.local/frontend/index.html
```

## Verification

After installation, verify everything is working:

1. **Check Database Connection**
   - Navigate to Sales tab
   - Try adding a test sale
   - If no error, database is connected

2. **Check Products**
   - Open the "Add Sale" modal
   - Should see product list (Banana Kanders, Banana Mondo, etc.)

3. **Check Stores**
   - Look at the store dropdown
   - Should see Store 1, Store 2, Store 3

4. **Test PDF Export** (if TCPDF installed)
   - Go to Summary tab
   - Click "Download Merged Report"
   - File should download successfully

## Configuration Details

### Database Connection (`backend/config.php`)
```php
define('DB_HOST', 'localhost');    // MySQL host
define('DB_USER', 'root');         // MySQL username
define('DB_PASS', '');             // MySQL password (usually empty for XAMPP)
define('DB_NAME', 'oof_pos_system'); // Database name
```

**Note**: If your XAMPP MySQL has a password, update `DB_PASS` value.

## Data Management

### Initial Sample Data
The database comes pre-loaded with:
- **11 Products** (Herbs and Crops)
- **3 Stores** (Store 1, 2, 3)

### Adding More Products
1. Go to phpMyAdmin
2. Select `oof_pos_system` database
3. Click `products` table
4. Click "Insert" tab
5. Fill in details:
   - Name: Product name
   - Category: HERBS or CROPS
   - Pack_size: e.g., "25 kg / week"
   - Retail_price: Price for retail
   - Institutional_price: Price for institutions

### Adding More Stores
1. Go to phpMyAdmin
2. Select `oof_pos_system` database
3. Click `stores` table
4. Click "Insert" tab
5. Fill in details:
   - Name: Store name
   - Address: Store address

## Port Configuration

If Apache/MySQL use non-standard ports:

1. **Change API Base in** `frontend/js/main.js`:
```javascript
// Change this line:
const API_BASE = 'http://localhost:8080/xampp/OOF%20POS/backend/';
```

2. Update MySQL port in `backend/config.php`:
```php
define('DB_HOST', 'localhost:3307'); // If using port 3307
```

## Troubleshooting

### "Cannot connect to database"
1. Check MySQL is running in XAMPP
2. Verify credentials in `backend/config.php`
3. Ensure database `oof_pos_system` exists

### "Products not loading"
1. Check database import was successful
2. Verify `api_products.php` permissions
3. Check browser console for errors (F12 → Console tab)

### "PDF export not working"
1. Verify TCPDF is installed
2. Check `vendor/` folder exists
3. Try re-running composer install

### "404 errors on API calls"
1. Verify file paths in API_BASE
2. Check all backend files exist
3. Verify Apache is serving the directory

### Modal not opening
1. Check browser console for JavaScript errors
2. Verify `frontend/js/main.js` is loaded
3. Try clearing browser cache (Ctrl+Shift+Delete)

## File Permissions

If you get permission errors:

1. Right-click on OOF POS folder
2. Properties → Security
3. Select your user → Edit
4. Check "Full Control"
5. Apply → OK

## Next Steps

1. **Test the System**
   - Add a test sale
   - Add a test delivery
   - Process a test return
   - Download PDF reports

2. **Customize Products**
   - Replace sample products with actual inventory
   - Update store information

3. **Backup Database**
   - Regular exports of data via phpMyAdmin
   - Use Export feature to create SQL backups

## Support

For detailed information, see `README.md` in the main OOF POS folder.
