import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { RideContext } from '../context/RideContext';
import { supabase } from '../lib/supabase';
import { X, Target, Navigation, CheckCircle2, Skull } from 'lucide-react';

const ActiveOpsModal = ({ isOpen, onClose }) => {
  const { session } = useContext(AppContext);
  const { commuteRides, snapRides, schoolLedgers, rideRequests } = useContext(RideContext);

  if (!isOpen) return null;

  const myHostedCommutes = [];
  const myHostedSnaps = [];
  const myJoinedCommutes = [];
  const myJoinedSnaps = [];
  const myLedgers = [];

  for (let i = 0; i < commuteRides.length; i++) {
    if (commuteRides[i].driver_id === session.user.id) {
      myHostedCommutes.push(commuteRides[i]);
    }
  }

  for (let i = 0; i < snapRides.length; i++) {
    if (snapRides[i].driver_id === session.user.id) {
      myHostedSnaps.push(snapRides[i]);
    }
  }

  for (let i = 0; i < rideRequests.length; i++) {
    const req = rideRequests[i];
    if (req.passenger_id === session.user.id && req.status === 'accepted') {
      let found = false;
      for (let j = 0; j < commuteRides.length; j++) {
        if (commuteRides[j].id === req.ride_id) {
          myJoinedCommutes.push(commuteRides[j]);
          found = true;
          break;
        }
      }
      if (!found) {
        for (let j = 0; j < snapRides.length; j++) {
          if (snapRides[j].id === req.ride_id) {
            myJoinedSnaps.push(snapRides[j]);
            break;
          }
        }
      }
    }
  }

  for (let i = 0; i < schoolLedgers.length; i++) {
    const ledger = schoolLedgers[i];
    if (ledger.driver_id === session.user.id) {
      myLedgers.push({ type: 'hosted', data: ledger });
    } else {
      const pList = ledger.passengers || [];
      for (let j = 0; j < pList.length; j++) {
        if (pList[j].profile.id === session.user.id) {
          myLedgers.push({ type: 'joined', data: ledger });
          break;
        }
      }
    }
  }

  const handleAbortRide = async (rideId) => {
    await supabase.from('rides').delete().eq('id', rideId);
  };

  const handleAbortIntercept = async (rideId) => {
    await supabase.from('ride_requests').delete().match({ ride_id: rideId, passenger_id: session.user.id });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full max-w-lg h-[85vh] flex flex-col royal-3d-panel p-8 bg-ivory/95 backdrop-blur-xl animate-in zoom-in-95 duration-300 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-gold transition-colors z-10">
          <X size={24} />
        </button>

        <div className="mb-8 border-b border-gold/20 pb-6">
          <h2 className="text-3xl font-display font-bold gold-gradient-text flex items-center gap-4">
            <Target className="text-gold animate-pulse" size={32} />
            Royal Command
          </h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-2 font-bold opacity-70">Active Operations & Logistics</p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-8 pr-2 scroll-smooth">
          {myHostedCommutes.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold gold-gradient-text uppercase tracking-[0.3em] flex items-center gap-2 border-b border-gold/10 pb-2">
                Hosted Pilot Assets
              </h3>
              {myHostedCommutes.map(r => (
                <div key={r.id} className="royal-3d-panel p-5 bg-white/50 border border-gold/5">
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-sm font-bold text-slate-900">{r.start_location} → {r.end_location}</p>
                    <button onClick={() => handleAbortRide(r.id)} className="text-[10px] bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg border border-rose-200 font-bold uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">Abort</button>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Scheduled: {r.departure_time}</p>
                </div>
              ))}
            </div>
          )}

          {myHostedSnaps.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-purple-600 uppercase tracking-[0.3em] flex items-center gap-2 border-b border-purple-200 pb-2">
                Hosted Snap Logistics
              </h3>
              {myHostedSnaps.map(r => (
                <div key={r.id} className="royal-3d-panel p-5 bg-white/50 border border-purple-100/30">
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-sm font-bold text-slate-900">{r.start_location} → {r.end_location}</p>
                    <button onClick={() => handleAbortRide(r.id)} className="text-[10px] bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg border border-rose-200 font-bold uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">Abort</button>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Immediate: {r.departure_time}</p>
                </div>
              ))}
            </div>
          )}

          {myJoinedCommutes.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-sky-600 uppercase tracking-[0.3em] flex items-center gap-2 border-b border-sky-200 pb-2">
                Intercepted Client Routes
              </h3>
              {myJoinedCommutes.map(r => (
                <div key={r.id} className="royal-3d-panel p-5 bg-sky-50/30 border border-sky-200/50">
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-sm font-bold text-slate-900">{r.start_location} → {r.end_location}</p>
                    <button onClick={() => handleAbortIntercept(r.id)} className="text-[10px] bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg border border-rose-200 font-bold uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">Sever</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Operator: {r.driver.name}</p>
                    <p className="text-[10px] gold-gradient-text font-bold uppercase">{r.driver.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {myLedgers.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.3em] flex items-center gap-2 border-b border-amber-200 pb-2">
                School Registry Ledgers
              </h3>
              {myLedgers.map((l, idx) => (
                <div key={idx} className="royal-3d-panel p-5 bg-amber-50/20 border border-amber-200/50">
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-sm font-bold text-slate-900">{l.data.school_name}</p>
                    <span className="text-[9px] bg-gold/10 text-gold-dark px-3 py-1 rounded-full border border-gold/30 font-bold uppercase tracking-widest">{l.type}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{l.data.start_location} → {l.data.school_name}</p>
                </div>
              ))}
            </div>
          )}

          {myHostedCommutes.length === 0 && myHostedSnaps.length === 0 && myJoinedCommutes.length === 0 && myJoinedSnaps.length === 0 && myLedgers.length === 0 && (
            <div className="text-center py-10">
              <Navigation size={32} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Active Operations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveOpsModal;
