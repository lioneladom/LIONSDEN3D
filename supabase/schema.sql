-- ==========================================================
-- Lion's Den 3D — Production PostgreSQL Schema for Supabase
-- Run this script in the Supabase SQL Editor (Project -> SQL Editor)
-- ==========================================================

-- 1. Profiles Table (Supports Supabase Auth & Clerk Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER', 'ADMIN')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Materials Table
CREATE TABLE IF NOT EXISTS public.materials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  density NUMERIC NOT NULL DEFAULT 1.24,
  price_per_gram NUMERIC NOT NULL DEFAULT 0.50,
  strength_rating INT DEFAULT 5,
  flexibility_rating INT DEFAULT 3,
  heat_resistance_rating INT DEFAULT 4,
  detail_rating INT DEFAULT 8,
  finish TEXT DEFAULT 'Matte',
  recommended_for TEXT[] DEFAULT '{}',
  active BOOLEAN DEFAULT TRUE,
  colors JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Products Catalog (STL Models & Hardware)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0.00,
  images TEXT[] DEFAULT '{}',
  sample_model_key TEXT,
  in_stock BOOLEAN DEFAULT TRUE,
  stock_count INT DEFAULT 50,
  dimensions TEXT,
  material TEXT,
  estimated_print_time TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL DEFAULT 0.00,
  printing_fee NUMERIC DEFAULT 0.00,
  setup_fee NUMERIC DEFAULT 0.00,
  delivery_fee NUMERIC DEFAULT 0.00,
  discount NUMERIC DEFAULT 0.00,
  total NUMERIC NOT NULL DEFAULT 0.00,
  currency TEXT DEFAULT 'GHS',
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'PREPARING', 'PRINTING', 'QUALITY_CHECK', 'READY', 'SHIPPED', 'CANCELLED')),
  payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
  payment_method TEXT DEFAULT 'MOMO',
  delivery_method TEXT DEFAULT 'STANDARD',
  delivery_address JSONB NOT NULL DEFAULT '{}'::jsonb,
  timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
  assigned_printer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Printer Fleet Telemetry
CREATE TABLE IF NOT EXISTS public.printer_fleet (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  model TEXT NOT NULL,
  technology TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'IDLE' CHECK (status IN ('IDLE', 'PRINTING', 'MAINTENANCE', 'OFFLINE')),
  current_order_id TEXT,
  progress_percent INT DEFAULT 0,
  material_loaded TEXT,
  nozzle_temp INT DEFAULT 0,
  bed_temp INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Storage Buckets Configuration
-- Creates 'stl-models' bucket for customer uploads and shop assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('stl-models', 'stl-models', true)
ON CONFLICT (id) DO NOTHING;

-- 7. Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.printer_fleet ENABLE ROW LEVEL SECURITY;

-- Public read access for materials and products
CREATE POLICY "Public can view active materials" ON public.materials FOR SELECT USING (active = true);
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public can view fleet telemetry" ON public.printer_fleet FOR SELECT USING (true);

-- Orders: Customers can view their own orders
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (true);

-- Realtime replication setup for orders and printer fleet
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.printer_fleet;
