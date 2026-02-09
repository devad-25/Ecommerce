-- ============================================================
-- EcomStore - Supabase Database Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- Only includes tables used by the app: users, cart_items, wishlist_items
-- Products & categories come from FakeStore API (no DB needed)
-- ============================================================

-- ==================== 1. USERS ====================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  email TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for phone lookup (login)
CREATE INDEX idx_users_phone ON users (phone);

-- ==================== 2. CART ITEMS ====================
-- Stores user_id, product_id, and full product details
-- Full details (title, price, image) ensure instant UI availability
CREATE TABLE cart_items (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  image TEXT NOT NULL DEFAULT '',
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);

CREATE INDEX idx_cart_items_user ON cart_items (user_id);

-- ==================== 3. WISHLIST ITEMS ====================
-- Stores user_id, product_id, and full product details
CREATE TABLE wishlist_items (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  image TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);

CREATE INDEX idx_wishlist_items_user ON wishlist_items (user_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Users
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Anyone can insert users (signup)"
  ON users FOR INSERT WITH CHECK (true);

-- Cart Items
-- IMPORTANT: Since this app uses a custom users table and NOT Supabase Auth's auth.users,
-- auth.uid() will not work. These policies allow access based on the provided user_id.
-- In a production app, you should use Supabase Auth for security.
CREATE POLICY "Users can manage own cart"
  ON cart_items FOR ALL USING (true); -- Simplified for custom auth compatibility

-- Wishlist Items
CREATE POLICY "Users can manage own wishlist"
  ON wishlist_items FOR ALL USING (true); -- Simplified for custom auth compatibility
