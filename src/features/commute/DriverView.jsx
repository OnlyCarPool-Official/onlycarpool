import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { RideContext } from '../../context/RideContext';
import { supabase } from '../../lib/supabase';
import { CheckCircle2, Radio } from 'lucide-react';

const DriverView = () => {
  const { session } = useContext(AppContext);
  const { rideRequests, commuteRides, refreshAll } = useContext(RideContext);
  const [tripStatus, setTripStatus] = useState('idle');
  const [startLoc, setStartLoc] = useState('Sector 17');
  const [endLoc, setEndLoc] = useState('PEC');
  const [time, setTime] = useState('8:30 AM');
  const [seats, setSeats] = useState(3);

  const myActiveRides = [];
  for (let i = 0; i < commuteRides.length; i++) {
    if (commuteRides[i].driver_id === session.user.id) {
      myActiveRides.push(commuteRides[i]);
    }
  }

  const handleStartTrip = async () => {
    setTripStatus('publishing');
    await supabase.from('rides').insert([{
      driver_id: session.user.id,
      type: 'commute',
      start_location: startLoc,
      end_location: endLoc,
      departure_time: time,
      seats_available: seats
    }]);
    await refreshAll();
    setTripStatus('global');
    setTimeout(() => setTripStatus('idle'), 2000);
  };

  const abortRoute = async (rideId) => {
    await supabase.from('rides').delete().eq('id', rideId);
    await refreshAll();
  };

  const kickPassenger = async (reqId) => {
    await supabase.from('ride_requests').delete().eq('id', reqId);
    await refreshAll();
  };

  const updateRequestStatus = async (reqId, newStatus) => {
    await supabase.from('ride_requests').update({ status: newStatus }).eq('id', reqId);
    await refreshAll();
  };

  return (
    <div className="space-y-8">
      <div className="royal-3d-panel p-6 flex justify-between items-center bg-white/40">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Pilot Status</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Visibility</p>
        </div>
        <button 
          className={`w-16 h-8 rounded-full royal-3d-input p-1 relative transition-all duration-500 ${tripStatus === 'offline' ? 'bg-slate-200 shadow-inner' : 'bg-gold/20'}`}
          onClick={() => setTripStatus(tripStatus === 'offline' ? 'idle' : 'offline')}
        >
          <div className={`absolute top-1 bottom-1 w-6 rounded-full transition-all duration-500 ${tripStatus === 'offline' ? 'left-1 bg-slate-400 shadow-md' : 'left-9 bg-gold shadow-lg'}`}></div>
        </button>
      </div>

      <div className="royal-3d-panel p-8 relative overflow-hidden">
        <h2 className="text-2xl font-display font-bold mb-8 gold-gradient-text uppercase tracking-widest">Initiate Broadcast</h2>
        
          <>
            <div className="space-y-6 mb-8">
              <div className="royal-3d-input p-5">
                <label className="text-[9px] uppercase tracking-[0.2em] text-gold-dark font-bold mb-2 block opacity-70">Departure Window</label>
                <input type="text" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-transparent text-slate-900 font-bold outline-none text-xl tracking-tight" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="royal-3d-input p-5">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-2 block opacity-70">Origin</label>
                  <input type="text" value={startLoc} onChange={(e) => setStartLoc(e.target.value)} className="w-full bg-transparent text-slate-900 font-bold outline-none text-sm" />
                </div>
                <div className="royal-3d-input p-5">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-2 block opacity-70">Destination</label>
                  <input type="text" value={endLoc} onChange={(e) => setEndLoc(e.target.value)} className="w-full bg-transparent text-slate-900 font-bold outline-none text-sm" />
                </div>
              </div>
            </div>

            <button 
              onClick={handleStartTrip}
              className="w-full btn-gold py-5 font-bold tracking-[0.3em] uppercase text-xs flex items-center justify-center gap-3"
            >
              {tripStatus === 'global' ? <CheckCircle2 size={20} /> : <Radio size={20} className={tripStatus === 'publishing' ? 'animate-pulse' : ''} />}
              {tripStatus === 'global' ? 'Broadcast Live' : 'Publish Route'}
            </button>
          </>
      </div>

      {myActiveRides.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-px bg-slate-200 flex-1"></div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Active Broadcasts</h3>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>
          
          {myActiveRides.map(ride => {
            const reqsForThisRide = [];
            for (let i = 0; i < rideRequests.length; i++) {
              if (rideRequests[i].ride_id === ride.id) {
                reqsForThisRide.push(rideRequests[i]);
              }
            }

            return (
              <div key={ride.id} className="royal-3d-panel p-6 border-l-4 border-l-gold">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-lg font-display text-slate-900 font-bold">{ride.start_location} → {ride.end_location}</h4>
                    <p className="text-[9px] gold-gradient-text uppercase tracking-[0.2em] mt-1 font-bold">In-Transit: {ride.departure_time}</p>
                  </div>
                  <button onClick={() => abortRoute(ride.id)} className="text-[10px] bg-rose-50 text-rose-600 px-4 py-2 rounded-xl border border-rose-200 font-bold uppercase tracking-[0.2em] hover:bg-rose-600 hover:text-white transition-all">
                    Abort
                  </button>
                </div>

                {reqsForThisRide.length > 0 ? (
                  <div className="space-y-4 mt-6 border-t border-gold/10 pt-6">
                    {reqsForThisRide.map((req) => (
                      <div key={req.id} className="royal-3d-input p-5 flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                          <p className="font-display font-bold text-slate-900 text-sm">{req.passenger?.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{req.status}</p>
                        </div>
                        
                        {req.status === 'pending' ? (
                          <div className="flex gap-3 mt-2">
                            <button onClick={() => updateRequestStatus(req.id, 'accepted')} className="flex-1 py-2 bg-gold/10 border border-gold/30 text-gold-dark font-bold text-[9px] uppercase tracking-widest rounded-lg hover:bg-gold hover:text-white transition-all">Authorize</button>
                            <button onClick={() => updateRequestStatus(req.id, 'rejected')} className="flex-1 py-2 bg-rose-50 border border-rose-200 text-rose-600 font-bold text-[9px] uppercase tracking-widest rounded-lg hover:bg-rose-100 transition-all">Decline</button>
                          </div>
                        ) : req.status === 'accepted' ? (
                          <div className="w-full mt-2 flex justify-between items-center royal-3d-panel bg-gold/5 border-gold/10 p-3">
                            <div>
                              <p className="text-[8px] text-gold-dark font-bold tracking-widest uppercase opacity-60">Verified Line</p>
                              <p className="text-xs text-slate-900 font-bold mt-0.5">{req.passenger?.phone}</p>
                            </div>
                            <button onClick={() => kickPassenger(req.id)} className="text-[9px] text-rose-600 font-bold uppercase tracking-widest border-b border-rose-600 border-dashed pb-0.5">Sever</button>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border-t border-gold/10 mt-6">
                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-[0.3em] opacity-60">Awaiting External Intercepts</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DriverView;
