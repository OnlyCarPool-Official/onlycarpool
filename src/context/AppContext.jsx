import { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isDriver, setIsDriver] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('commute');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else {
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
      setIsDriver(data.is_driver);
    } else {
      // Auto-heal missing profile from corrupted signups
      const { data: authData } = await supabase.auth.getUser();
      const email = authData?.user?.email || 'recovered@onlycarpool.com';
      const name = email.split('@')[0];
      
      const { data: newProfile } = await supabase.from('profiles').insert([{
        id: userId,
        email: email,
        name: name,
        phone: 'Not Provided'
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
