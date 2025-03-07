-- Drop existing views first
DROP VIEW IF EXISTS public_profiles;

-- Drop existing tables and types if they exist (in reverse order to handle dependencies)
DROP TABLE IF EXISTS translations CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS return_images CASCADE;
DROP TABLE IF EXISTS drop_off_locations CASCADE;
DROP TABLE IF EXISTS return_items CASCADE;
DROP TABLE IF EXISTS returns CASCADE;
DROP TABLE IF EXISTS retailers CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS return_status;
DROP TYPE IF EXISTS refund_status;
DROP TYPE IF EXISTS notification_type;
DROP TYPE IF EXISTS return_image_type;

-- Create custom types
CREATE TYPE return_status AS ENUM ('pending', 'in_progress', 'shipped', 'delivered', 'completed', 'cancelled', 'expired');
CREATE TYPE refund_status AS ENUM ('pending', 'partial', 'complete', 'denied');
CREATE TYPE notification_type AS ENUM ('reminder', 'status_update', 'deadline', 'confirmation');
CREATE TYPE return_image_type AS ENUM ('receipt', 'product', 'label', 'qr_code', 'other');

    -- Create profiles table (replaces previous implementation)
CREATE TABLE public.profiles (
  id UUID NOT NULL,
  email TEXT NOT NULL,
  name TEXT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_premium BOOLEAN NULL DEFAULT FALSE,
  premium_expires_at TIMESTAMPTZ NULL,
  preferences JSONB NULL DEFAULT '{}'::JSONB,
  language TEXT NULL DEFAULT 'en'::TEXT,
  locale TEXT NULL DEFAULT 'en-US'::TEXT,
  display_name TEXT NULL,
  avatar_url TEXT NULL,
  onboarding_completed BOOLEAN NULL DEFAULT FALSE,
  bio TEXT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_email_key UNIQUE (email)
);

-- Add JSON validation for preferences
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS valid_preferences,
ADD CONSTRAINT valid_preferences CHECK (jsonb_typeof(preferences) = 'object');

-- Create retailers table
CREATE TABLE retailers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  website TEXT,
  logo TEXT,
  return_policy JSONB DEFAULT '{}'::jsonb,
  email_domains TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create drop_off_locations table
CREATE TABLE drop_off_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  coordinates JSONB DEFAULT '{"lat": 0, "lng": 0}'::jsonb,
  carriers TEXT[] DEFAULT '{}',
  hours TEXT,
  services TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create returns table (replaces previous implementation)
CREATE TABLE public.returns (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  retailer_name TEXT NOT NULL,
  order_number TEXT NULL,
  order_date TIMESTAMPTZ NULL,
  return_deadline TIMESTAMPTZ NULL,
  order_items JSONB NULL DEFAULT '[]'::JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  tracking_number TEXT NULL,
  carrier TEXT NULL,
  drop_off_location_id UUID NULL,
  custom_drop_off_notes TEXT NULL,
  refund_amount NUMERIC(10,2) NULL DEFAULT 0,
  refund_status TEXT NULL DEFAULT 'pending',
  notes TEXT NULL,
  source TEXT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT returns_pkey PRIMARY KEY (id),
  CONSTRAINT returns_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);


-- Create return_images table
CREATE TABLE return_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  return_id UUID NOT NULL REFERENCES returns(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  cloudinary_id TEXT,
  type return_image_type DEFAULT 'other',
  notes TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.return_items (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  return_id UUID NULL,
  name TEXT NULL,
  description TEXT NULL,
  quantity INTEGER NULL,
  price NUMERIC NULL,
  notes TEXT NULL,
  item_img_url TEXT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT return_items_pkey PRIMARY KEY (id),
  CONSTRAINT return_items_return_id_fkey FOREIGN KEY (return_id) REFERENCES public.returns(id) ON DELETE CASCADE
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  return_id UUID REFERENCES returns(id) ON DELETE SET NULL,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  scheduled_for TIMESTAMPTZ
);

-- Create translations table
CREATE TABLE translations (
  key TEXT PRIMARY KEY,
  english TEXT NOT NULL,
  spanish TEXT,
  french TEXT,
  german TEXT,
  italian TEXT,
  chinese TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for frequent queries
CREATE INDEX IF NOT EXISTS returns_user_id_idx ON returns(user_id);
CREATE INDEX IF NOT EXISTS returns_status_idx ON returns(status);
CREATE INDEX IF NOT EXISTS returns_retailer_id_idx ON returns(retailer_id);
CREATE INDEX IF NOT EXISTS return_items_return_id_idx ON return_items(return_id);
CREATE INDEX IF NOT EXISTS return_images_return_id_idx ON return_images(return_id);
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_return_id_idx ON notifications(return_id);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_retailers_updated_at
BEFORE UPDATE ON retailers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_drop_off_locations_updated_at
BEFORE UPDATE ON drop_off_locations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_returns_updated_at
BEFORE UPDATE ON returns
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_return_items_updated_at
BEFORE UPDATE ON return_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_translations_updated_at
BEFORE UPDATE ON translations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE retailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE drop_off_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Limited profile fields are publicly viewable
CREATE OR REPLACE VIEW public_profiles AS 
SELECT id, name
FROM profiles;

GRANT SELECT ON public_profiles TO anon, authenticated;

-- Retailers policies (allow read for authenticated users, admin for write operations)
CREATE POLICY "Authenticated users can view retailers"
  ON retailers
  FOR SELECT
  TO authenticated
  USING (true);

-- Drop-off locations policies (allow read for authenticated users, admin for write operations)
CREATE POLICY "Authenticated users can view drop-off locations"
  ON drop_off_locations
  FOR SELECT
  TO authenticated
  USING (true);

-- Returns policies
CREATE POLICY "Users can read their own returns"
  ON returns
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own returns"
  ON returns
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own returns"
  ON returns
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own returns"
  ON returns
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Return items policies
CREATE POLICY "Users can read their own return items"
  ON return_items
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM returns
    WHERE returns.id = return_items.return_id
    AND returns.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own return items"
  ON return_items
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM returns
    WHERE returns.id = return_items.return_id
    AND returns.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own return items"
  ON return_items
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM returns
    WHERE returns.id = return_items.return_id
    AND returns.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own return items"
  ON return_items
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM returns
    WHERE returns.id = return_items.return_id
    AND returns.user_id = auth.uid()
  ));

-- Return images policies
CREATE POLICY "Users can read their own return images"
  ON return_images
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM returns
    WHERE returns.id = return_images.return_id
    AND returns.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own return images"
  ON return_images
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM returns
    WHERE returns.id = return_images.return_id
    AND returns.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own return images"
  ON return_images
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM returns
    WHERE returns.id = return_images.return_id
    AND returns.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own return images"
  ON return_images
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM returns
    WHERE returns.id = return_images.return_id
    AND returns.user_id = auth.uid()
  ));

-- Notifications policies
CREATE POLICY "Users can read their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Translations policies (readable by all authenticated users)
CREATE POLICY "Translations are viewable by authenticated users"
  ON translations
  FOR SELECT
  TO authenticated
  USING (true);