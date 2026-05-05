import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { RideContext } from '../../context/RideContext';
import RideCard from '../../components/RideCard';
import { Search, PowerOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const PassengerView = () => {
  const { session, profile } = useContext(AppContext);
  const { commuteRides, rideRequests } = useContext(RideContext);
  const [searching, setSearching] = useState(false);

  const toggleOffline = async () => {
    await supabase.from('profiles').update({ is_offline: !profile.is_offline }).eq('id', profile.id);
  };

  const handleBook = async (rideId) => {
    await supabase.from('ride_requests').insert([{
      ride_id: rideId,
      passenger_id: session.user.id
    }]);
  };

  const abortIntercept = async (rideId) => {
    await supabase.from('ride_requests').delete().match({ ride_id: rideId, passenger_id: session.user.id });
  };

  const myActiveIntercepts = [];
  for (let i = 0; i < rideRequests.length; i++) {
    if (rideRequests[i].passenger_id === session.user.id) {
      for (let j = 0; j < commuteRides.length; j++) {
        if (commuteRides[j].id === rideRequests[i].ride_id) {
          myActiveIntercepts.push({ ...commuteRides[j], reqStatus: rideRequests[i].status });
          break;
        }
      }
    }
  }

  if (profile?.is_offline) {
    return (
      <div className="glass-panel p-8 rounded-3xl text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto mb-4 flex items-center justify-center border border-slate-200">
          <PowerOff size={24} className="text-slate-400" />
        </div>
        <h2 className="text-xl font-display font-bold text-slate-700 mb-2">Offline Mode Engaged</h2>
        <p className="text-sm text-slate-500 mb-6">You are hidden from the routing matrix for 24 hours.</p>
        <button 
          onClick={toggleOffline}
          className="px-6 py-3 rounded-xl bg-accent text-white font-bold tracking-widest uppercase hover:opacity-90 transition-all shadow-md shadow-accent/30"
        >
          Go Online
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button 
          onClick={toggleOffline}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors"
        >
          <PowerOff size={14} /> Mark On Leave Today
        </button>
      </div>

      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
        <h2 className="text-2xl font-display font-bold mb-6 text-gradient">Configure Route</h2>
        <div className="space-y-4 mb-8">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Home Location" 
              className="relative w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium shadow-sm"
            />
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Work Destination" 
              className="relative w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium shadow-sm"
            />
          </div>
        </div>
        
        <button 
          onClick={() => setSearching(true)}
          className="w-full py-4 rounded-xl bg-transparent border border-accent text-accent font-bold tracking-wide hover:bg-accent hover:text-white transition-all flex items-center justify-center gap-2"
        >
          <Search size={18} /> Deep Scan (2km Radius)
        </button>
      </div>

      {searching && (
        <div className="space-y-5 animate-in slide-in-from-bottom-8 duration-700 ease-out">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px bg-slate-200 flex-1"></div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Matches Found</h3>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>
          {commuteRides.map((ride, i) => {
            let reqStatus = null;
            for (let j = 0; j < rideRequests.length; j++) {
              if (rideRequests[j].ride_id === ride.id && rideRequests[j].passenger_id === session.user.id) {
                reqStatus = rideRequests[j].status;
              }
            }

            return (
              <div key={ride.id} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'both' }}>
                <RideCard 
                  ride={{
                    id: ride.id,
                    name: ride.driver.name,
                    rating: 5.0,
                    eta: ride.departure_time,
                    route: { from: ride.start_location, to: ride.end_location },
                    seatsLeft: ride.seats_available
                  }} 
                  isPriority={false}
                  onRequest={() => handleBook(ride.id)}
                  requestStatus={reqStatus}
                  driverPhone={ride.driver.phone}
                  isDriverView={false}
                />
              </div>
            );
          })}
        </div>
      )}

      {myActiveIntercepts.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px bg-slate-200 flex-1"></div>
            <h3 className="text-[10px] font-bold text-accent uppercase tracking-widest px-2">Active Intercepts</h3>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>
          {myActiveIntercepts.map((ride) => (
            <div key={ride.id} className="glass-panel p-5 rounded-2xl border-l-4 border-l-accent">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-sm font-display text-slate-900 font-bold">{ride.start_location} → {ride.end_location}</h4>
                  <p className="text-[10px] text-accent uppercase tracking-widest mt-1 font-bold flex items-center gap-2">
                    Departs: {ride.departure_time}
                    <span className={`px-2 py-0.5 rounded ${ride.reqStatus === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {ride.reqStatus}
                    </span>
                  </p>
                </div>
                <button onClick={() => abortIntercept(ride.id)} className="text-[10px] bg-rose/10 text-rose px-3 py-1.5 rounded-lg border border-rose/30 font-bold uppercase tracking-widest hover:bg-rose hover:text-white transition-colors">
                  Abort
                </button>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-bold mb-1">Driver: {ride.driver.name}</p>
                {ride.reqStatus === 'accepted' ? (
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-accent uppercase tracking-widest font-bold">Secure Line</p>
                    <p className="text-sm text-slate-900">{ride.driver.phone}</p>
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold italic">Awaiting Confirmation to Reveal Line</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PassengerView;
