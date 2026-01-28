# Quick Start - Categories Management

## How to Get Started

### 1. Database Setup (One-time)
Run this SQL in your MySQL database:

```sql
USE oof_pos_system;

CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE products ADD COLUMN category_id INT AFTER id;

INSERT INTO categories (name, description) VALUES
('HERBS', 'Herbs and Herbs Products'),
('CROPS', 'Crops and Agricultural Products'),
('FRUITS', 'Fresh Fruits')
ON DUPLICATE KEY UPDATE id=id;

UPDATE products SET category_id = (
    SELECT id FROM categories WHERE categories.name = products.category
) WHERE category_id IS NULL;

ALTER TABLE products ADD CONSTRAINT fk_product_category 
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT;
```

### 2. Files to Deploy

**Copy these new files to your server:**
- `backend/api_categories.php` - Categories API
- `backend/update_categories.sql` - Migration script (for reference)

**Update these existing files:**
- `frontend/index.html` - Updated with categories modal UI
- `frontend/js/main.js` - Updated with categories functions

### 3. Using Categories Management

1. Login to the POS System
2. Click "⚙️ Management" button (bottom left)
3. Click "🏷️ Categories"
4. Use the interface to:
   - View all categories
   - Add new categories
   - Edit existing categories
   - Delete categories (if not in use)

## Files Added

```
backend/
  ├── api_categories.php (NEW)
  └── update_categories.sql (NEW)

frontend/
  ├── index.html (UPDATED - modals added)
  └── js/main.js (UPDATED - functions added)

Root/
  └── CATEGORIES_SETUP.md (THIS GUIDE)
```

## Features

✅ Create unlimited categories  
✅ Edit category names and descriptions  
✅ Delete categories (prevents accidental deletion of used categories)  
✅ View all categories in organized table  
✅ Error validation and user-friendly messages  

## API Endpoints

```
GET  /backend/api_categories.php?action=all       → Get all categories
POST /backend/api_categories.php?action=add       → Create category
POST /backend/api_categories.php?action=update    → Update category
POST /backend/api_categories.php?action=delete    → Delete category
```

## Troubleshooting

**Issue:** "Cannot delete category - it is being used by X product(s)"
- **Solution:** First delete or reassign those products to a different category

**Issue:** "Category name already exists"
- **Solution:** Each category name must be unique. Use a different name.

**Issue:** Categories not showing in the list
- **Solution:** Make sure the database migration was applied successfully

## Next Steps

After setting up categories, you can:
1. Start managing your product categories
2. Create new categories specific to your business
3. Organize products by their categories
4. Maintain data consistency across sales and deliveries

---

**Version:** 1.0  
**Last Updated:** January 28, 2026
