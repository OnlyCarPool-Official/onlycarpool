-- OnlyCarPool Supabase Schema V4 Update
-- Adding RLS policies for deleting school_ledger and school_passengers

-- Drivers can delete their own ledgers
CREATE POLICY "Drivers can delete own ledgers" ON school_ledger FOR DELETE USING (auth.uid() = driver_id);

-- Passengers can delete their own passenger records
CREATE POLICY "Passengers can delete own records" ON school_passengers FOR DELETE USING (auth.uid() = passenger_id);

-- Drivers can delete passenger records belonging to their ledgers
CREATE POLICY "Drivers can delete passengers on own ledgers" ON school_passengers FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM school_ledger WHERE id = school_passengers.ledger_id AND driver_id = auth.uid()
  )
);
