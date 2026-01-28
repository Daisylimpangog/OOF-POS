-- Create Database
CREATE DATABASE IF NOT EXISTS oof_pos_system;
USE oof_pos_system;

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    pack_size VARCHAR(50),
    retail_price DECIMAL(10, 2),
    institutional_price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stores Table
CREATE TABLE IF NOT EXISTS stores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sales Table
CREATE TABLE IF NOT EXISTS sales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    quantity DECIMAL(10, 4) NOT NULL,
    unit VARCHAR(20),
    store_id INT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    sale_date DATE NOT NULL,
    sale_time TIME,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (store_id) REFERENCES stores(id)
);

-- Deliveries Table
CREATE TABLE IF NOT EXISTS deliveries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    quantity DECIMAL(10, 4) NOT NULL,
    unit VARCHAR(20),
    store_id INT NOT NULL,
    receiver VARCHAR(100),
    delivery_date DATE NOT NULL,
    delivery_time TIME,
    status ENUM('pending', 'completed', 'returned') DEFAULT 'completed',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (store_id) REFERENCES stores(id)
);

-- Returns Table
CREATE TABLE IF NOT EXISTS returns (
    id INT PRIMARY KEY AUTO_INCREMENT,
    delivery_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity DECIMAL(10, 4) NOT NULL,
    unit VARCHAR(20),
    return_date DATE NOT NULL,
    return_time TIME,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (delivery_id) REFERENCES deliveries(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Sample Products
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
('Tambis (Seasonal)', 'FRUITS', 'per kg', 220, 180),

-- Basket/Bags
('Woven Basket Small', 'BASKET/BAGS', 'per piece', 150, 120),
('Woven Basket Medium', 'BASKET/BAGS', 'per piece', 250, 200),
('Woven Basket Large', 'BASKET/BAGS', 'per piece', 350, 280),
('Paper Bag Premium', 'BASKET/BAGS', 'per pack (100)', 300, 250),

-- Dehydrated Products
('Dried Mango Slices', 'DEHYDRATED PRODUCT', 'per kg', 450, 380),
('Dried Banana Chips', 'DEHYDRATED PRODUCT', 'per kg', 380, 320),
('Dried Papaya', 'DEHYDRATED PRODUCT', 'per kg', 500, 420),
('Dried Herbs Mix', 'DEHYDRATED PRODUCT', 'per kg', 650, 550);

-- Sample Stores
INSERT INTO stores (name, address) VALUES
('Store 1', 'Address 1'),
('Store 2', 'Address 2'),
('Store 3', 'Address 3');
