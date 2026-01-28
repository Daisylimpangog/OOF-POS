# Categories Management Feature - Implementation Guide

## Overview
This document describes the new Categories Management feature added to the OOF POS System. This feature allows users to create, edit, and delete product categories from the Management menu.

## What's New

### 1. Database Changes
A new `categories` table has been added to manage product categories dynamically:

**Table Structure:**
```sql
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Backend API
A new API endpoint has been created: `api_categories.php`

**Supported Actions:**
- `GET ?action=all` - Retrieve all categories
- `POST ?action=add` - Add a new category
- `POST ?action=update` - Update an existing category
- `POST ?action=delete` - Delete a category

**Request/Response Examples:**

**Add Category:**
```json
POST /backend/api_categories.php?action=add
{
    "name": "VEGETABLES",
    "description": "Fresh vegetables"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Category added successfully",
    "id": 4
}
```

### 3. Frontend UI
Two new modals have been added:

#### Categories Management Modal
- Accessible from Management menu → "🏷️ Categories" button
- Displays all categories in a table
- Shows: ID, Category Name, Description, Actions (Edit/Delete)
- Contains button to add new categories

#### Add/Edit Category Modal
- Form to enter category name (required) and description (optional)
- Validates that category names are unique
- Shows different title based on add/edit mode
- Submit button saves the category

### 4. JavaScript Functions
New functions added to `main.js`:

- `openCategoriesModal()` - Opens the categories list modal
- `closeCategoriesModal()` - Closes the categories list modal
- `openAddCategoryModal()` - Opens the add category form
- `openEditCategoryModal(id, name, description)` - Opens the edit category form
- `closeCategoryModal()` - Closes the add/edit category modal
- `loadCategoriesList()` - Fetches and displays all categories
- `displayCategoriesList(categories)` - Renders the categories table
- `saveCategory(event)` - Saves a new or updated category
- `deleteCategory(categoryId)` - Deletes a category
- `loadCategories()` - Loads categories for dropdowns

## Installation Steps

### Step 1: Apply Database Migration
Run the SQL script to create the categories table and update the products table:

1. Open your MySQL client (phpMyAdmin or command line)
2. Select the `oof_pos_system` database
3. Execute the SQL from `backend/update_categories.sql`

**SQL Script:**
```sql
USE oof_pos_system;

-- Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add category_id column to products table
ALTER TABLE products ADD COLUMN category_id INT AFTER id;

-- Insert default categories
INSERT INTO categories (name, description) VALUES
('HERBS', 'Herbs and Herbs Products'),
('CROPS', 'Crops and Agricultural Products'),
('FRUITS', 'Fresh Fruits')
ON DUPLICATE KEY UPDATE id=id;

-- Update products to use category_id
UPDATE products SET category_id = (SELECT id FROM categories WHERE categories.name = products.category) WHERE category_id IS NULL;

-- Add foreign key constraint
ALTER TABLE products ADD CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT;
```

### Step 2: Files Added/Modified
- **New Files:**
  - `backend/api_categories.php` - Categories API endpoint
  - `backend/update_categories.sql` - Database migration script
  - `CATEGORIES_SETUP.md` - This guide

- **Modified Files:**
  - `frontend/index.html` - Added categories management modals
  - `frontend/js/main.js` - Added categories management functions

## Features

### Add Category
1. Click "⚙️ Management" in the sidebar
2. Click "🏷️ Categories"
3. Click "➕ Add New Category"
4. Enter category name and optional description
5. Click "Save Category"

### Edit Category
1. Go to "⚙️ Management" → "🏷️ Categories"
2. Click "Edit" button next to the category
3. Modify the name or description
4. Click "Save Category"

### Delete Category
1. Go to "⚙️ Management" → "🏷️ Categories"
2. Click "Delete" button next to the category
3. Confirm the deletion

**Note:** A category cannot be deleted if it's currently used by any products. Delete or reassign the products first.

## Data Validation

### Category Name
- Required field
- Must be unique
- Maximum 100 characters
- Cannot be empty or whitespace

### Description
- Optional field
- Maximum allowed by TEXT field
- Can be left blank

## Error Handling

The system provides clear error messages for:
- Duplicate category names
- Missing required fields
- Database constraints violations
- Products using the category (cannot delete)

## Future Enhancements

1. **Category Usage Count** - Display number of products in each category
2. **Bulk Operations** - Import/export categories
3. **Category Hierarchy** - Parent/child category relationships
4. **Color Coding** - Assign colors to categories for better UI
5. **Search & Filter** - Filter products by category with better UI

## Technical Details

### API Response Format
All API responses follow this format:
```json
{
    "success": boolean,
    "message": "descriptive message",
    "data": {} or []  // only included when retrieving data
}
```

### Database Constraints
- Category names must be UNIQUE
- Foreign Key constraint prevents deletion of categories used by products
- Cascade behavior can be modified if needed in the future

### Backward Compatibility
The original `category` ENUM column in the `products` table is preserved for backward compatibility. It can be dropped later if fully migrated to the new `category_id` foreign key.

## Support
For issues or questions regarding the Categories Management feature, please refer to the main project documentation or contact the development team.
