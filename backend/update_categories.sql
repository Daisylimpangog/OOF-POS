-- Add Categories Management
USE oof_pos_system;

-- Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add category_id column to products table (if not exists)
ALTER TABLE products ADD COLUMN category_id INT AFTER id;

-- Insert default categories based on existing ENUM values
INSERT INTO categories (name, description) VALUES
('HERBS', 'Herbs and Herbs Products'),
('CROPS', 'Crops and Agricultural Products'),
('FRUITS', 'Fresh Fruits')
ON DUPLICATE KEY UPDATE id=id;

-- Update products to use category_id based on existing category
UPDATE products SET category_id = (SELECT id FROM categories WHERE categories.name = products.category) WHERE category_id IS NULL;

-- Add foreign key constraint (if not already exists)
ALTER TABLE products ADD CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT;

-- Note: The original category ENUM column can be kept for backward compatibility or dropped later
-- To drop it, use: ALTER TABLE products DROP COLUMN category;
