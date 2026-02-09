-- ==========================================
-- ADD FULL PRODUCT DETAILS TO TABLES
-- Run this in the Supabase SQL Editor
-- ==========================================

-- 1. Update cart_items table
ALTER TABLE cart_items 
ADD COLUMN IF NOT EXISTS title TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS image TEXT DEFAULT '';

-- 2. Update wishlist_items table
ALTER TABLE wishlist_items 
ADD COLUMN IF NOT EXISTS title TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS image TEXT DEFAULT '';
