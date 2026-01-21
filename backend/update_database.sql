-- Update OOF POS System Database to Add Fruits Category
-- Run this in phpMyAdmin after backing up your data

USE oof_pos_system;

-- Step 1: Modify the products table to add FRUITS category
ALTER TABLE products MODIFY COLUMN category ENUM('HERBS', 'CROPS', 'FRUITS') NOT NULL;

-- Step 2: Clear old sample products and add new ones
DELETE FROM products WHERE id <= 11;

-- Step 3: Insert new comprehensive product list
INSERT INTO products (name, category, pack_size, retail_price, institutional_price) VALUES
-- Herbs
('Lemon Meyer', 'HERBS', 'per kg', 420, 360),
('Lemonito', 'HERBS', 'per kg', 220, 180),

-- Crops
('Banana Kardava', 'CROPS', '25 kg / week', 60, 45),
('Banana Saba', 'CROPS', 'per kg', 125, 100),

-- Fruits
('Banana Kardava', 'FRUITS', '25 kg / week', 60, 45),
('Banana Mondo', 'FRUITS', 'per kg', 180, 150),
('Banana Morado', 'FRUITS', 'per kg', 180, 150),
('Banana Sab-a', 'FRUITS', 'per kg', 125, 100),
('Banana Senyorita', 'FRUITS', 'per kg', 200, 170),
('Banana Tindok', 'FRUITS', 'per kg', 180, 150),
('Banana Tondan', 'FRUITS', 'per kg', 120, 95),
('Biasong', 'FRUITS', 'per kg', 350, 300),
('Bisaya Bayabas (aromatic)', 'FRUITS', 'per kg', NULL, NULL),
('Doldol (Seasonal)', 'FRUITS', '1 kg / week', 450, 380),
('Dragon Fruit (Seasonal)', 'FRUITS', 'per kg', 280, 220),
('Guapple', 'FRUITS', '3 kg / week', 320, 260),
('Inyam (Seasonal)', 'FRUITS', 'per kg', 420, 380),
('Katmon (Seasonal)', 'FRUITS', '2 kg / week', 450, 380),
('Kamias / Iba (Seasonal)', 'FRUITS', '200 g / week', 35, 26),
('Karamay / Chinese Iba', 'FRUITS', '200 g / week', 65, 55),
('Lemon Meyer', 'FRUITS', 'per kg', 420, 360),
('Lemon Lime', 'FRUITS', 'per kg', 330, 280),
('Lemonsito', 'FRUITS', 'per kg', 220, 180),
('Lomboy (Seasonal)', 'FRUITS', '5 kg / week', 220, 180),
('Mansanitas', 'FRUITS', '100 g', 120, 95),
('Miracle Fruit', 'FRUITS', 'per piece', 35, 35),
('Mulberries', 'FRUITS', '100 g', 85, 70),
('Papaya Red Lady', 'FRUITS', 'per kg', 70, 60),
('Passion Fruit', 'FRUITS', 'per kg', 170, 140),
('Sambag / Tamarind', 'FRUITS', 'per kg', 280, 220),
('Tagpo', 'FRUITS', '100 g', 120, 95),
('Tambis (Seasonal)', 'FRUITS', 'per kg', 220, 180);

-- Verification: Show count by category
SELECT category, COUNT(*) as total_products FROM products GROUP BY category;
