import { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isDriver, setIsDriverState] = useState(() => {
    const saved = localStorage.getItem('ocp_isDriver');
    return saved === null ? false : saved === 'true';
  });

  // Always write to localStorage when toggling so tab switches don't reset it
  const setIsDriver = (val) => {
    setIsDriverState(val);
    localStorage.setItem('ocp_isDriver', String(val));
  };
  const [currentCategory, setCurrentCategory] = useState('commute');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      // Only re-fetch profile on actual login events, NOT on TOKEN_REFRESHED
      // TOKEN_REFRESHED fires every time the user switches browser tabs, which
      // would incorrectly reset isDriver state before the DB update completes
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        if (session) fetchProfile(session.user.id);
        else { setProfile(null); setLoading(false); }
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) {
      setProfile(data);
      // Only use DB value on first-ever login (no localStorage preference saved yet)
      if (localStorage.getItem('ocp_isDriver') === null) {
        setIsDriver(data.is_driver);
      }
    } else {
      const { data: authData } = await supabase.auth.getUser();
      const meta = authData?.user?.user_metadata || {};
      const email = authData?.user?.email || 'recovered@onlycarpool.com';
      const name = meta.name || email.split('@')[0];
      const phone = meta.phone || 'Not Provided';
      
      const { data: newProfile } = await supabase.from('profiles').insert([{
        id: userId,
        email,
        name,
        phone
      }]).select('*').single();
      
      if (newProfile) {
        setProfile(newProfile);
        setIsDriver(newProfile.is_driver);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isDriver) {
      document.body.classList.add('mode-driver');
    } else {
      document.body.classList.remove('mode-driver');
    }
    if (session && profile) {
      supabase.from('profiles').update({ is_driver: isDriver }).eq('id', session.user.id);
    }
  }, [isDriver, session, profile]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AppContext.Provider value={{ session, profile, setProfile, isDriver, setIsDriver, currentCategory, setCurrentCategory, loading, signOut }}>
      {children}
    </AppContext.Provider>
  );
};
