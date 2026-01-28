-- Update existing tables to support 4 decimal places for quantities
-- Run this to update the database precision for better decimal handling

USE oof_pos_system;

-- Update Sales table quantity column
ALTER TABLE sales MODIFY COLUMN quantity DECIMAL(10, 4) NOT NULL;

-- Update Deliveries table quantity column  
ALTER TABLE deliveries MODIFY COLUMN quantity DECIMAL(10, 4) NOT NULL;

-- Update Returns table quantity column
ALTER TABLE returns MODIFY COLUMN quantity DECIMAL(10, 4) NOT NULL;

-- Verify changes
SHOW COLUMNS FROM sales WHERE Field = 'quantity';
SHOW COLUMNS FROM deliveries WHERE Field = 'quantity';
SHOW COLUMNS FROM returns WHERE Field = 'quantity';
