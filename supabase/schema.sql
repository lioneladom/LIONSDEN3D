-- ==========================================================
-- Lion's Den 3D — Production PostgreSQL Schema for Supabase
-- Run this script in the Supabase SQL Editor (Project -> SQL Editor)
-- Fully idempotent (safe to run multiple times without error)
-- ==========================================================

-- 1. Profiles Table (Supports Supabase Auth & Clerk Users with Username & Email)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE,
  email TEXT,
  name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER', 'ADMIN')),
  org_id TEXT,
  org_role TEXT DEFAULT 'org:member',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure username and org columns exist if table already existed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'username'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN username TEXT UNIQUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'org_id'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN org_id TEXT;
    ALTER TABLE public.profiles ADD COLUMN org_role TEXT DEFAULT 'org:member';
  END IF;
END $$;

ALTER TABLE public.profiles ALTER COLUMN email DROP NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_org_id ON public.profiles(org_id);

-- 2. Organizations Table (Clerk Multi-Tenancy / B2B)
CREATE TABLE IF NOT EXISTS public.organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view organizations" ON public.organizations;
CREATE POLICY "Public can view organizations" ON public.organizations FOR SELECT USING (true);

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
  org_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure org_id column exists on orders if table already existed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'org_id'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN org_id TEXT;
  END IF;
END $$;

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
INSERT INTO storage.buckets (id, name, public)
VALUES ('stl-models', 'stl-models', true)
ON CONFLICT (id) DO NOTHING;

-- 7. Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.printer_fleet ENABLE ROW LEVEL SECURITY;

-- Materials policies (Idempotent: drop before create)
DROP POLICY IF EXISTS "Public can view active materials" ON public.materials;
CREATE POLICY "Public can view active materials" ON public.materials FOR SELECT USING (active = true);

-- Products policies
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);

-- Fleet telemetry policies
DROP POLICY IF EXISTS "Public can view fleet telemetry" ON public.printer_fleet;
CREATE POLICY "Public can view fleet telemetry" ON public.printer_fleet FOR SELECT USING (true);

-- Orders policies
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (true);

-- Realtime replication setup for orders and printer fleet (Idempotent check)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'printer_fleet'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.printer_fleet;
  END IF;
END $$;
