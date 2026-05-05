import { useContext, useState, useEffect } from 'react';
import { RideContext } from '../../context/RideContext';
import { AppContext } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';
import RideCard from '../../components/RideCard';
import { Geolocation } from '@capacitor/geolocation';
import { MapPin, Target } from 'lucide-react';

const SnapPassengerView = () => {
  const { session } = useContext(AppContext);
  const { snapRides, rideRequests } = useContext(RideContext);
  const [searching, setSearching] = useState(false);
  const [location, setLocation] = useState(null);
  
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');

  const printCurrentPosition = async () => {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      setLocation(coordinates);
    } catch (e) {
      setLocation({ coords: { latitude: 30.7333, longitude: 76.7794 } });
    }
  };

  useEffect(() => {
    printCurrentPosition();
  }, []);

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
      for (let j = 0; j < snapRides.length; j++) {
        if (snapRides[j].id === rideRequests[i].ride_id) {
          myActiveIntercepts.push({ ...snapRides[j], reqStatus: rideRequests[i].status });
          break;
        }
      }
    }
  }

  return (
    <div className="space-y-8">
      <div className="royal-3d-panel p-8 relative overflow-hidden">
        <h2 className="text-2xl font-display font-bold mb-8 gold-gradient-text uppercase tracking-widest italic">Set Vector</h2>
        
        <div className="space-y-6 mb-8">
          <div className="royal-3d-input p-5">
            <label className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-2 block opacity-70">Current Location</label>
            <input type="text" value={startPoint} onChange={(e) => setStartPoint(e.target.value)} className="w-full bg-transparent text-slate-900 font-bold outline-none text-sm" />
          </div>
          <div className="royal-3d-input p-5">
            <label className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-2 block opacity-70">Target Destination</label>
            <input type="text" value={endPoint} onChange={(e) => setEndPoint(e.target.value)} className="w-full bg-transparent text-slate-900 font-bold outline-none text-sm" />
          </div>
          <button onClick={() => setSearching(true)} className="w-full btn-gold py-5 font-bold tracking-[0.3em] uppercase text-xs">Initiate Wide-Band Scan</button>
        </div>
      </div>

      {location && (
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          GPS: {location.coords?.latitude?.toFixed(4)}, {location.coords?.longitude?.toFixed(4)}
        </div>
      )}

      {searching && (
        <div className="space-y-5 animate-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px bg-slate-200 flex-1"></div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Inbound Vectors</h3>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>
          {snapRides.map((ride, i) => {
            let reqStatus = null;
            for (let j = 0; j < rideRequests.length; j++) {
              if (rideRequests[j].ride_id === ride.id && rideRequests[j].passenger_id === session.user.id) {
                reqStatus = rideRequests[j].status;
              }
            }

            return (
              <div key={ride.id} className="animate-in fade-in" style={{ animationDelay: `${i * 150}ms` }}>
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
            <h3 className="text-[10px] font-bold text-premium uppercase tracking-widest px-2">Active Intercepts</h3>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>
          {myActiveIntercepts.map((ride) => (
            <div key={ride.id} className="glass-panel p-5 rounded-2xl border-l-4 border-l-premium">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-sm font-display text-slate-900 font-bold">{ride.start_location} → {ride.end_location}</h4>
                  <p className="text-[10px] text-premium uppercase tracking-widest mt-1 font-bold flex items-center gap-2">
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
                    <p className="text-[10px] text-premium uppercase tracking-widest font-bold">Secure Line</p>
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

export default SnapPassengerView;
