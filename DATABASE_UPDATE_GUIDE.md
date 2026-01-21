# Update Database with Fruits Category

## Overview
This update adds a new **FRUITS** category to the OOF POS System with 28 different fruit products including detailed pricing information.

## What's New
- ✅ New **FRUITS** category added
- ✅ 28 fruit products with complete pricing
- ✅ Seasonal products marked with (Seasonal) notation
- ✅ Support for various pack sizes and pricing formats

## How to Apply the Update

### Method 1: Using phpMyAdmin (Recommended)

1. **Backup Your Database** (Important!)
   - Open http://localhost/phpmyadmin
   - Select `oof_pos_system` database
   - Click "Export" tab
   - Click "Go" to download backup

2. **Run the Update Script**
   - In phpMyAdmin, click the `oof_pos_system` database
   - Click "Import" tab
   - Browse and select: `C:\xampp\htdocs\OOF POS\backend\update_database.sql`
   - Click "Import" button
   - Wait for success message

3. **Verify the Update**
   - Click `products` table
   - Scroll down to see all 32 products
   - Verify FRUITS category appears with 28 items

### Method 2: Manual SQL Execution

1. Open phpMyAdmin
2. Click SQL tab
3. Copy and paste the SQL from `update_database.sql`
4. Click "Go"

### Method 3: Command Line

```powershell
cd "C:\xampp\mysql\bin"
mysql -u root oof_pos_system < "C:\xampp\htdocs\OOF POS\backend\update_database.sql"
```

---

## Products Added

### Fruits Category (28 Items)

**Bananas (8 varieties):**
- Banana Kardava - 25 kg/week - ₱60/₱45
- Banana Mondo - per kg - ₱180/₱150
- Banana Morado - per kg - ₱180/₱150
- Banana Sab-a - per kg - ₱125/₱100
- Banana Senyorita - per kg - ₱200/₱170
- Banana Tindok - per kg - ₱180/₱150
- Banana Tondan - per kg - ₱120/₱95

**Tropical & Special Fruits:**
- Biasong - per kg - ₱350/₱300
- Bisaya Bayabas (aromatic) - per kg - Price TBA
- Dragon Fruit (Seasonal) - per kg - ₱280/₱220
- Guapple - 3 kg/week - ₱320/₱260
- Doldol (Seasonal) - 1 kg/week - ₱450/₱380
- Inyam (Seasonal) - per kg - ₱420/₱380
- Katmon (Seasonal) - 2 kg/week - ₱450/₱380
- Mulberries - 100g - ₱85/₱70

**Citrus & Specialty:**
- Lemon Meyer - per kg - ₱420/₱360
- Lemon Lime - per kg - ₱330/₱280
- Lemonsito - per kg - ₱220/₱180
- Passion Fruit - per kg - ₱170/₱140

**Small Package Items:**
- Kamias / Iba (Seasonal) - 200g/week - ₱35/₱26
- Karamay / Chinese Iba - 200g/week - ₱65/₱55
- Mansanitas - 100g - ₱120/₱95
- Tagpo - 100g - ₱120/₱95

**Other Fruits:**
- Lomboy (Seasonal) - 5 kg/week - ₱220/₱180
- Miracle Fruit - per piece - ₱35/₱35
- Papaya Red Lady - per kg - ₱70/₱60
- Sambag / Tamarind - per kg - ₱280/₱220
- Tambis (Seasonal) - per kg - ₱220/₱180

**Format:** Retail Price / Institutional Price

---

## Database Changes

### Updated Schema
```sql
-- Before:
category ENUM('HERBS', 'CROPS') NOT NULL

-- After:
category ENUM('HERBS', 'CROPS', 'FRUITS') NOT NULL
```

### Product Count by Category After Update
- **HERBS**: 2 products
- **CROPS**: 2 products
- **FRUITS**: 28 products
- **Total**: 32 products

---

## Filtering in Frontend

After update, users can filter by:
- ✅ All Categories
- ✅ HERBS
- ✅ CROPS
- ✅ **FRUITS** (New!)

The filter buttons in Sales and Deliveries modules will automatically recognize the new FRUITS category.

---

## API Changes

The API endpoints will now return fruits in their responses:

**Example API Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "name": "Banana Kardava",
      "category": "FRUITS",
      "pack_size": "25 kg / week",
      "retail_price": 60,
      "institutional_price": 45
    },
    ...
  ]
}
```

---

## Testing the Update

### Test 1: Check Products Dropdown
1. Open http://localhost/OOF%20POS/frontend/index.html
2. Click "➕ Add Sale"
3. Click Product dropdown
4. Verify you can see FRUITS products (like "Banana Mondo", "Dragon Fruit", etc.)

### Test 2: Test Fruit Sale
1. Select a fruit product (e.g., "Papaya Red Lady")
2. Verify Category auto-populates as "FRUITS"
3. Enter quantity and amount
4. Click "Save Sale"
5. Verify it appears in Sales History

### Test 3: Test Fruit Delivery
1. Click "➕ Add Delivery"
2. Select a fruit product
3. Enter receiver name and details
4. Click "Save Delivery"
5. Verify it appears in Deliveries History

---

## Rollback Instructions

If you need to rollback to the original database:

1. Open phpMyAdmin
2. Select `oof_pos_system` database
3. Click "Empty" (or delete the database)
4. Click "Import" tab
5. Re-import the original `database.sql` file

Or restore from backup:
1. Open phpMyAdmin
2. Select `oof_pos_system` database
3. Click "Import" tab
4. Select your backed-up SQL file
5. Click "Import"

---

## Notes

- **Seasonal Items**: Products marked "(Seasonal)" have limited availability
- **Price TBA**: "Bisaya Bayabas (aromatic)" has no set pricing - update manually as needed
- **Duplicates**: Some items appear in both CROPS and FRUITS categories for flexibility
- **Pack Sizes**: Vary from per kg to per piece to grams/week - all supported by system

---

## Support

If you encounter any issues:

1. Check the `update_database.sql` file for any errors
2. Verify database connection in `C:\xampp\htdocs\OOF POS\backend\config.php`
3. Ensure phpMyAdmin is accessible at http://localhost/phpmyadmin
4. Check MySQL is running in XAMPP Control Panel

---

**Update Applied On**: January 21, 2026
**Total Products After Update**: 32
**New Category**: FRUITS (28 items)
