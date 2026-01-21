-- Update products table to include new categories
ALTER TABLE products MODIFY COLUMN category ENUM('HERBS', 'CROPS', 'FRUITS', 'VEGETABLES', 'SPICES', 'EDIBLE FLOWERS', 'FROM THE WILD', 'EGGS & MEAT', 'SLOW FRESH DRINKS') NOT NULL;

-- ==================== VEGETABLES ====================
INSERT INTO products (name, category, pack_size, retail_price, institutional_price) VALUES
('Alugbati / Spinach', 'VEGETABLES', '200 g', 25.00, 20.00),
('Himbabao / Alukon', 'VEGETABLES', '100 g', 75.00, 60.00),
('Kamunggay / Moringa', 'VEGETABLES', '200 g', 45.00, 35.00),
('Kamunggay / Moringa (de-stemmed)', 'VEGETABLES', '200 g', 50.00, 40.00);

-- ==================== FRESH HERBS ====================
INSERT INTO products (name, category, pack_size, retail_price, institutional_price) VALUES
('Basil Holy', 'HERBS', '50 g', 85.00, 65.00),
('Basil Thai', 'HERBS', '50 g', 80.00, 60.00),
('Chives', 'HERBS', '100 g', 95.00, 75.00),
('Cilantro Mexican', 'HERBS', '200 g', 150.00, 115.00),
('Cilantro', 'HERBS', '100 g', 85.00, 65.00),
('Indian Curry', 'HERBS', '50 g', 100.00, 80.00),
('Guava Fresh Leaves', 'HERBS', '200 g', 160.00, 120.00),
('Lavender', 'HERBS', '50 g', 220.00, 180.00),
('Mint Pepper', 'HERBS', '50 g', 75.00, 60.00),
('Mint Eucalyptus', 'HERBS', '50 g', 75.00, 60.00),
('Oregano / Kalabo', 'HERBS', '50 g', 35.00, 25.00),
('Oregano Italian', 'HERBS', '50 g', 115.00, 90.00),
('Pandan', 'HERBS', '100 g', 35.00, 25.00),
('Root Beer', 'HERBS', '50 g', 85.00, 65.00),
('Rosemary', 'HERBS', '100 g', 150.00, 115.00),
('Sibuyas Dahonan', 'HERBS', '100 g', 25.00, 18.00),
('Tarragon', 'HERBS', '25 g', 160.00, 130.00),
('Thyme', 'HERBS', '25 g', 170.00, 140.00);

-- ==================== SPICES ====================
INSERT INTO products (name, category, pack_size, retail_price, institutional_price) VALUES
('Achuete / Annatto (Dried)', 'SPICES', '100 g', 130.00, 100.00),
('Bantiyong / Ash Gourd', 'SPICES', 'per kg', 95.00, 75.00),
('Ginger / Luy-a Bisaya', 'SPICES', '100 g', 55.00, 45.00),
('Ginger / Luy-a', 'SPICES', '100 g', 45.00, 35.00),
('Lemongrass', 'SPICES', '100 g', 35.00, 28.00),
('Sili Espada', 'SPICES', '100 g', 60.00, 48.00),
('Sili Kulikot', 'SPICES', '100 g', 110.00, 90.00),
('Sili Puti', 'SPICES', '100 g', 130.00, 110.00),
('Sugarcane / Tubó Tapol (Fresh)', 'SPICES', 'per kg', 110.00, 85.00),
('Turmeric', 'SPICES', '100 g', 45.00, 35.00),
('Cinnamon Fresh Leaves (Mana Mindanao)', 'SPICES', '10 g', 70.00, 55.00),
('Cinnamon Air-Dried Leaves (Mana Mindanao)', 'SPICES', '10 g', 85.00, 70.00),
('Cinnamon Fresh Leaves (Kaningag Cebu)', 'SPICES', '5 g', 110.00, 95.00),
('Cinnamon Air-Dried Leaves (Kaningag Cebu)', 'SPICES', '5 g', 130.00, 115.00);

-- ==================== EDIBLE FLOWERS ====================
INSERT INTO products (name, category, pack_size, retail_price, institutional_price) VALUES
('Banana Pusô', 'EDIBLE FLOWERS', '10 pcs', 60.00, 60.00),
('Blue Ternate', 'EDIBLE FLOWERS', '25 g', 95.00, 75.00),
('Bougainvillea', 'EDIBLE FLOWERS', '25 g', 85.00, 65.00),
('Hibiscus', 'EDIBLE FLOWERS', '50 g', 130.00, 100.00),
('Marigold Orange', 'EDIBLE FLOWERS', '50 g', 150.00, 120.00),
('Rose Red Local', 'EDIBLE FLOWERS', '50 g', 220.00, 170.00),
('Roselle (Seasonal)', 'EDIBLE FLOWERS', '100 g', 55.00, 40.00);

-- ==================== FROM THE WILD ====================
INSERT INTO products (name, category, pack_size, retail_price, institutional_price) VALUES
('Taklong / Tree Snail Escargot', 'FROM THE WILD', '1 kg', 450.00, 360.00),
('Pepinito', 'FROM THE WILD', '100 g', 60.00, 45.00),
('Wild Passion Fruit / Sto Papa', 'FROM THE WILD', '100 g', 110.00, 85.00);

-- ==================== EGGS & MEAT ====================
INSERT INTO products (name, category, pack_size, retail_price, institutional_price) VALUES
('Native Eggs', 'EGGS & MEAT', '1 tray / week', 450.00, 380.00),
('Native Pig Hybrid (Live)', 'EGGS & MEAT', 'per kg', 240.00, 220.00);

-- ==================== SLOW FRESH DRINKS ====================
INSERT INTO products (name, category, pack_size, retail_price, institutional_price) VALUES
('Tubâ', 'SLOW FRESH DRINKS', '0–12 hours', 380.00, 320.00),
('Tubâ with Tungog', 'SLOW FRESH DRINKS', '0–12 hours', 450.00, 400.00),
('Tubâ', 'SLOW FRESH DRINKS', '12–24 hours', 450.00, 400.00),
('Tubâ with Tungog', 'SLOW FRESH DRINKS', '12–24 hours', 520.00, 460.00),
('Coconut Buko', 'SLOW FRESH DRINKS', 'per piece', 95.00, 75.00),
('Coconut Buko (50+)', 'SLOW FRESH DRINKS', 'per piece', 55.00, 55.00);
