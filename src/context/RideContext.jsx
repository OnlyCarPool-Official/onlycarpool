import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { AppContext } from './AppContext';

export const RideContext = createContext();

export const RideProvider = ({ children }) => {
  const { session } = useContext(AppContext);
  const [activeRide, setActiveRide] = useState(null);
  const [commuteRides, setCommuteRides] = useState([]);
  const [snapRides, setSnapRides] = useState([]);
  const [schoolLedgers, setSchoolLedgers] = useState([]);
  const [rideRequests, setRideRequests] = useState([]);

  const fetchRides = useCallback(async () => {
    const { data } = await supabase.from('rides').select(`
      *,
      driver:profiles!rides_driver_id_fkey(name, phone, is_offline)
    `);
    if (data) {
      const cRides = [];
      const sRides = [];
      for (let i = 0; i < data.length; i++) {
        if (!data[i].driver?.is_offline) {
          if (data[i].type === 'commute') cRides.push(data[i]);
          if (data[i].type === 'snap') sRides.push(data[i]);
        }
      }
      setCommuteRides(cRides);
      setSnapRides(sRides);
    }
  }, []);

  const fetchLedgers = useCallback(async () => {
    const { data } = await supabase.from('school_ledger').select(`
      *,
      driver:profiles!school_ledger_driver_id_fkey(name, phone),
      passengers:school_passengers(id, overrides, profile:profiles!school_passengers_passenger_id_fkey(id, name, phone))
    `);
    if (data) setSchoolLedgers(data);
  }, []);

  const fetchRequests = useCallback(async () => {
    const { data } = await supabase.from('ride_requests').select(`
      *,
      passenger:profiles!ride_requests_passenger_id_fkey(name, phone)
    `);
    if (data) setRideRequests(data);
  }, []);

  // Call this after any mutation for instant UI update
  const refreshAll = useCallback(async () => {
    await Promise.all([fetchRides(), fetchLedgers(), fetchRequests()]);
  }, [fetchRides, fetchLedgers, fetchRequests]);

  useEffect(() => {
    if (!session) return;

    fetchRides();
    fetchLedgers();
    fetchRequests();

    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rides' }, fetchRides)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'school_ledger' }, fetchLedgers)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'school_passengers' }, fetchLedgers)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ride_requests' }, fetchRequests)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, fetchRides, fetchLedgers, fetchRequests]);

  return (
    <RideContext.Provider value={{
      activeRide, setActiveRide,
      commuteRides, snapRides, schoolLedgers, rideRequests,
      refreshAll
    }}>
      {children}
    </RideContext.Provider>
  );
};
