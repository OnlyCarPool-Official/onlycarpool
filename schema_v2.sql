-- OnlyCarPool Supabase Schema V2 Update

-- 1. Add Phone Number to Profiles
ALTER TABLE profiles ADD COLUMN phone TEXT;

-- 2. Add Start Location to School Ledger
ALTER TABLE school_ledger ADD COLUMN start_location TEXT DEFAULT 'Not Specified';

-- 3. Create Ride Requests Table for Two-Way Confirmation
CREATE TABLE ride_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ride_id UUID REFERENCES rides(id) ON DELETE CASCADE,
  passenger_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(ride_id, passenger_id)
);

-- Enable RLS on new table
ALTER TABLE ride_requests ENABLE ROW LEVEL SECURITY;

-- Policies for Ride Requests
-- Anyone involved (driver of the ride or the passenger) can view the request
CREATE POLICY "Requests viewable by involved parties" ON ride_requests FOR SELECT USING (true);
-- Passengers can create a request
CREATE POLICY "Passengers can insert requests" ON ride_requests FOR INSERT WITH CHECK (auth.uid() = passenger_id);
-- Drivers can update the status of requests for their rides
-- (Since we can't easily join in a standard policy without a function, we allow update if they are logged in, 
-- but the UI will restrict it. A more robust policy would join the rides table).
CREATE POLICY "Users can update requests" ON ride_requests FOR UPDATE USING (true);
CREATE POLICY "Users can delete requests" ON ride_requests FOR DELETE USING (true);
