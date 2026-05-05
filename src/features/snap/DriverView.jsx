import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { RideContext } from '../../context/RideContext';
import { supabase } from '../../lib/supabase';
import { ShoppingBag } from 'lucide-react';

const SnapDriverView = () => {
  const { session } = useContext(AppContext);
  const { snapRides, rideRequests, refreshAll } = useContext(RideContext);
  const [passengers, setPassengers] = useState(0);
  
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [time, setTime] = useState('Immediate');
  const [seats, setSeats] = useState(3);

  const myActiveRides = [];
  for (let i = 0; i < snapRides.length; i++) {
    if (snapRides[i].driver_id === session.user.id) {
      myActiveRides.push(snapRides[i]);
    }
  }

  const publishRoute = async () => {
    await supabase.from('rides').insert([{
      driver_id: session.user.id,
      type: 'snap',
      start_location: startPoint,
      end_location: endPoint,
      departure_time: time,
      seats_available: seats
    }]);
    await refreshAll();
  };

  const updateRequestStatus = async (reqId, newStatus) => {
    await supabase.from('ride_requests').update({ status: newStatus }).eq('id', reqId);
    if (newStatus === 'accepted') setPassengers(passengers + 1);
    await refreshAll();
  };

  const abortRoute = async (rideId) => {
    await supabase.from('rides').delete().eq('id', rideId);
    await refreshAll();
  };

  const kickPassenger = async (reqId) => {
    await supabase.from('ride_requests').delete().eq('id', reqId);
    await refreshAll();
  };

  return (
    <div className="space-y-8">
      <div className="royal-3d-panel p-8 relative overflow-hidden">
        <h2 className="text-2xl font-display font-bold mb-8 gold-gradient-text uppercase tracking-widest flex items-center gap-4">
          <ShoppingBag size={24} className="text-gold" />
          Destination Lock
        </h2>
        
        <div className="space-y-6 mb-8">
          <div className="royal-3d-input p-5">
            <label className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-2 block opacity-70">Starting Vector</label>
            <input type="text" value={startPoint} onChange={(e) => setStartPoint(e.target.value)} className="w-full bg-transparent text-slate-900 font-bold outline-none text-sm" />
          </div>
          <div className="royal-3d-input p-5">
            <label className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-2 block opacity-70">Terminal Destination</label>
            <input type="text" value={endPoint} onChange={(e) => setEndPoint(e.target.value)} className="w-full bg-transparent text-slate-900 font-bold outline-none text-sm" />
          </div>
          <div className="royal-3d-input p-5">
            <label className="text-[9px] uppercase tracking-[0.2em] text-gold-dark font-bold mb-2 block opacity-70">Synchronization Time</label>
            <input type="text" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-transparent text-slate-900 font-bold outline-none text-sm" />
          </div>
          <button onClick={publishRoute} className="w-full btn-gold py-5 font-bold tracking-[0.3em] uppercase text-xs">Authorize Snap Route</button>
        </div>

        <div className="flex justify-between items-center royal-3d-input p-6 mb-8">
          <div>
            <span className="font-bold text-[10px] text-slate-400 uppercase tracking-widest block mb-1">Payload Capacity</span>
            <span className="text-xs text-slate-900 font-bold">Authorized Seats</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setPassengers(Math.max(0, passengers - 1))} className="w-12 h-12 rounded-xl royal-3d-button flex items-center justify-center text-slate-900 font-bold">-</button>
            <span className="text-3xl font-display font-bold w-6 text-center gold-gradient-text">{passengers}</span>
            <button onClick={() => setPassengers(passengers + 1)} className="w-12 h-12 rounded-xl royal-3d-button flex items-center justify-center text-gold font-bold">+</button>
          </div>
        </div>

        </div>
      </div>

      {myActiveRides.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-px bg-slate-200 flex-1"></div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Active Operations</h3>
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
              <div key={ride.id} className="glass-panel p-5 rounded-2xl border-l-4 border-l-premium">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-sm font-display text-slate-900 font-bold">{ride.start_location} → {ride.end_location}</h4>
                    <p className="text-[10px] text-premium uppercase tracking-widest mt-1 font-bold">Departs: {ride.departure_time}</p>
                  </div>
                  <button onClick={() => abortRoute(ride.id)} className="text-[10px] bg-rose/10 text-rose px-3 py-1.5 rounded-lg border border-rose/30 font-bold uppercase tracking-widest hover:bg-rose hover:text-white transition-colors">
                    Abort
                  </button>
                </div>

                {reqsForThisRide.length > 0 ? (
                  <div className="space-y-3 mt-4 border-t border-slate-100 pt-4">
                    {reqsForThisRide.map((req) => (
                      <div key={req.id} className="flex flex-col p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-display font-bold text-slate-900 text-sm tracking-tight">{req.passenger?.name}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{req.status}</p>
                        </div>
                        
                        {req.status === 'pending' ? (
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => updateRequestStatus(req.id, 'accepted')} className="flex-1 py-1.5 bg-premium/10 border border-premium/20 text-premium font-bold text-[10px] uppercase tracking-widest rounded hover:bg-premium hover:text-white transition-colors">Confirm</button>
                            <button onClick={() => updateRequestStatus(req.id, 'rejected')} className="flex-1 py-1.5 bg-rose/10 border border-rose/20 text-rose font-bold text-[10px] uppercase tracking-widest rounded hover:bg-rose/20 transition-colors">Reject</button>
                          </div>
                        ) : req.status === 'accepted' ? (
                          <div className="w-full mt-2 flex justify-between items-center bg-premium/5 border border-premium/20 rounded p-2">
                            <div>
                              <p className="text-[9px] text-premium font-bold tracking-widest uppercase">Phone</p>
                              <p className="text-xs text-slate-900 mt-0.5">{req.passenger?.phone}</p>
                            </div>
                            <button onClick={() => kickPassenger(req.id)} className="text-[10px] text-rose font-bold uppercase tracking-widest border-b border-rose border-dashed pb-0.5">Kick</button>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 border-t border-slate-100 mt-4">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Awaiting Intercepts</p>
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

export default SnapDriverView;
