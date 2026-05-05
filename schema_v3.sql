-- OnlyCarPool Supabase Schema V3 Update
-- No new tables are required because the existing schema handles multi-rides.
-- However, we can add a 'cancelled' status to ride_requests to explicitly track Aborted Intercepts.
-- Or just allow users to delete their requests.
-- We will rely on DELETE for ride cancellations and request cancellations to keep the DB clean.

-- Since we are relying on DELETE, let's verify RLS policies for deletion.

-- Drivers can delete their own rides (already in schema.sql)
-- CREATE POLICY "Users can delete own rides" ON rides FOR DELETE USING (auth.uid() = driver_id);

-- Passengers must be able to delete their own ride requests
CREATE POLICY "Passengers can delete own requests" ON ride_requests FOR DELETE USING (auth.uid() = passenger_id);

-- Drivers must be able to delete requests belonging to their rides (Kick passenger)
CREATE POLICY "Drivers can delete requests on own rides" ON ride_requests FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM rides WHERE id = ride_requests.ride_id AND driver_id = auth.uid()
  )
);
