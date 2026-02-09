-- ==========================================
-- FIX FOR 401 UNAUTHORIZED / RLS ISSUES
-- Run this in the Supabase SQL Editor
-- ==========================================

-- 1. Ensure RLS is enabled but policies are wide open for our custom auth
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can manage own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can manage own wishlist" ON wishlist_items;
DROP POLICY IF EXISTS "Anyone can insert users (signup)" ON users;
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- 3. Create new explicitly open policies for ANON users
-- This allows our custom phone-auth logic to work without Supabase Auth JWTs

-- User Profile
CREATE POLICY "Public Users Access" ON users
  FOR ALL USING (true) WITH CHECK (true);

-- Cart
CREATE POLICY "Public Cart Access" ON cart_items
  FOR ALL USING (true) WITH CHECK (true);

-- Wishlist
CREATE POLICY "Public Wishlist Access" ON wishlist_items
  FOR ALL USING (true) WITH CHECK (true);

-- 4. Ensure tables have full product data columns
-- Run these one by one if they don't exist
ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT '';
ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS image TEXT NOT NULL DEFAULT '';

ALTER TABLE wishlist_items ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT '';
ALTER TABLE wishlist_items ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE wishlist_items ADD COLUMN IF NOT EXISTS image TEXT NOT NULL DEFAULT '';

-- 5. Ensure composite primary keys exist (One user to many products)
-- This confirms that one user can have multiple entries in these tables
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'cart_items_pkey') THEN
        ALTER TABLE cart_items ADD PRIMARY KEY (user_id, product_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'wishlist_items_pkey') THEN
        ALTER TABLE wishlist_items ADD PRIMARY KEY (user_id, product_id);
    END IF;
END $$;

-- 6. Grant explicit permissions to the anon role
GRANT ALL ON TABLE users TO anon;
GRANT ALL ON TABLE cart_items TO anon;
GRANT ALL ON TABLE wishlist_items TO anon;
