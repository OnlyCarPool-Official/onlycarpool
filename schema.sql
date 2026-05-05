-- OnlyCarPool Supabase Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  is_driver BOOLEAN DEFAULT FALSE,
  is_offline BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Rides Table (Commute & Snap)
CREATE TABLE rides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'commute' or 'snap'
  start_location TEXT NOT NULL,
  end_location TEXT NOT NULL,
  departure_time TEXT NOT NULL,
  seats_available INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. School Ledger Table
CREATE TABLE school_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  daily_rate INTEGER NOT NULL,
  school_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. School Passengers (Joining the ledger)
CREATE TABLE school_passengers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ledger_id UUID REFERENCES school_ledger(id) ON DELETE CASCADE,
  passenger_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  overrides INTEGER DEFAULT 0, -- Days the parent picked up their own kids
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_passengers ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- Profiles: Users can read all profiles (to see driver names), but only update their own.
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Rides: Anyone can read, only drivers can insert/update their own
CREATE POLICY "Rides are viewable by everyone" ON rides FOR SELECT USING (true);
CREATE POLICY "Users can insert own rides" ON rides FOR INSERT WITH CHECK (auth.uid() = driver_id);
CREATE POLICY "Users can update own rides" ON rides FOR UPDATE USING (auth.uid() = driver_id);
CREATE POLICY "Users can delete own rides" ON rides FOR DELETE USING (auth.uid() = driver_id);

-- School Ledger: Anyone can read, only drivers can create
CREATE POLICY "Ledgers viewable by everyone" ON school_ledger FOR SELECT USING (true);
CREATE POLICY "Users can create ledgers" ON school_ledger FOR INSERT WITH CHECK (auth.uid() = driver_id);
CREATE POLICY "Drivers can update own ledgers" ON school_ledger FOR UPDATE USING (auth.uid() = driver_id);

-- School Passengers: Anyone can read, passengers can join, passengers can update overrides
CREATE POLICY "Ledger passengers viewable by everyone" ON school_passengers FOR SELECT USING (true);
CREATE POLICY "Passengers can join ledgers" ON school_passengers FOR INSERT WITH CHECK (auth.uid() = passenger_id);
CREATE POLICY "Passengers can update their overrides" ON school_passengers FOR UPDATE USING (auth.uid() = passenger_id);
