-- Migration: Add assisted_by column to sales table
-- Run this if you have an existing database

ALTER TABLE sales ADD COLUMN assisted_by TEXT AFTER notes;

-- Verify the column was added
SHOW COLUMNS FROM sales;
