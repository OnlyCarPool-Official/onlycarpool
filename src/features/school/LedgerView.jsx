import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { RideContext } from '../../context/RideContext';
import { supabase } from '../../lib/supabase';
import { ShieldCheck, Plus, Car } from 'lucide-react';

const LedgerView = () => {
  const { session, profile, isDriver } = useContext(AppContext);
  const { schoolLedgers } = useContext(RideContext);
  const [dailyRate, setDailyRate] = useState(150);
  const [school, setSchool] = useState('DAV Sector 8');
  const [startLoc, setStartLoc] = useState('');
  
  // Passenger Search Filters
  const [searchStart, setSearchStart] = useState('');
  const [searchSchool, setSearchSchool] = useState('');

  const createLedger = async () => {
    await supabase.from('school_ledger').insert([{
      driver_id: session.user.id,
      daily_rate: dailyRate,
      school_name: school,
      start_location: startLoc || 'Not Specified'
    }]);
  };

  const joinLedger = async (ledgerId) => {
    await supabase.from('school_passengers').insert([{
      ledger_id: ledgerId,
      passenger_id: session.user.id
    }]);
  };

  const addOverride = async (passengerRecord) => {
    await supabase.from('school_passengers').update({
      overrides: passengerRecord.overrides + 1
    }).eq('id', passengerRecord.id);
  };

  const abortLedger = async (ledgerId) => {
    await supabase.from('school_ledger').delete().eq('id', ledgerId);
  };

  const leaveLedger = async (passengerRecordId) => {
    await supabase.from('school_passengers').delete().eq('id', passengerRecordId);
  };

  const kickPassenger = async (passengerRecordId) => {
    await supabase.from('school_passengers').delete().eq('id', passengerRecordId);
  };

  return (
    <div className="space-y-8">
      {isDriver && (
        <div className="royal-3d-panel p-8 relative overflow-hidden mb-8">
          <h2 className="text-xl font-display font-bold mb-6 gold-gradient-text uppercase tracking-widest">Initialize High-Registry Ledger</h2>
          <div className="space-y-6 mb-8">
            <div className="royal-3d-input p-4">
              <label className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-2 block opacity-70">Origin Point</label>
              <input type="text" value={startLoc} onChange={(e) => setStartLoc(e.target.value)} className="w-full bg-transparent text-slate-900 font-bold outline-none text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="royal-3d-input p-4">
                <label className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-2 block opacity-70">Institution Name</label>
                <input type="text" value={school} onChange={(e) => setSchool(e.target.value)} className="w-full bg-transparent text-slate-900 font-bold outline-none text-sm" />
              </div>
              <div className="royal-3d-input p-4">
                <label className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-2 block opacity-70">Rate (INR)</label>
                <input type="number" value={dailyRate} onChange={(e) => setDailyRate(parseInt(e.target.value))} className="w-full bg-transparent text-slate-900 font-bold outline-none text-sm" />
              </div>
            </div>
          </div>
          <button onClick={createLedger} className="w-full btn-gold py-4 font-bold tracking-[0.3em] uppercase text-xs flex items-center justify-center gap-3">
            <Plus size={18} /> Establish Daily Rate
          </button>
        </div>
      )}

      {!isDriver && (
        <div className="royal-3d-panel p-8 relative overflow-hidden mb-8">
          <h2 className="text-xl font-display font-bold mb-6 gold-gradient-text uppercase tracking-widest">Global Network Filters</h2>
          <div className="space-y-6">
            <div className="royal-3d-input p-4">
              <label className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-2 block opacity-70">Search Start</label>
              <input type="text" value={searchStart} onChange={(e) => setSearchStart(e.target.value)} className="w-full bg-transparent text-slate-900 font-bold outline-none text-sm" />
            </div>
            <div className="royal-3d-input p-4">
              <label className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-2 block opacity-70">Search Institution</label>
              <input type="text" value={searchSchool} onChange={(e) => setSearchSchool(e.target.value)} className="w-full bg-transparent text-slate-900 font-bold outline-none text-sm" />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Active School Ledgers</h3>
        
        {schoolLedgers.filter(ledger => {
          if (!searchStart && !searchSchool) return true;
          const matchStart = ledger.start_location?.toLowerCase().includes(searchStart.toLowerCase()) || !searchStart;
          const matchSchool = ledger.school_name?.toLowerCase().includes(searchSchool.toLowerCase()) || !searchSchool;
          return matchStart && matchSchool;
        }).map((ledger) => {
          let totalMonthlyDays = 22; 
          let passengersUI = [];

          const passengerList = ledger.passengers || [];
          for (let i = 0; i < passengerList.length; i++) {
            const p = passengerList[i];
            const isMe = p.profile.id === session.user.id;
            const owes = (totalMonthlyDays * ledger.daily_rate) - (p.overrides * ledger.daily_rate);
            
            passengersUI.push(
              <div key={p.id} className="royal-3d-input p-4 flex items-center justify-between mb-3 border-l-2 border-l-gold/30">
                <div className="flex-1">
                  <div className="text-sm text-slate-900 font-bold flex items-center gap-2">
                    {p.profile.name}
                    {isMe && <span className="text-[8px] bg-gold/10 text-gold-dark px-1.5 py-0.5 rounded border border-gold/20 uppercase tracking-widest font-bold">Self</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Overrides: <span className="text-gold-dark">{p.overrides}</span></div>
                    {isDriver && (
                      <div className="text-[9px] gold-gradient-text uppercase tracking-widest font-bold">Line: {p.profile.phone}</div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900 tracking-tight">₹{owes} <span className="text-[8px] text-slate-400 uppercase font-bold opacity-60">Due</span></div>
                  {isMe && !isDriver && (
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => addOverride(p)} className="text-[8px] bg-gold/10 text-gold-dark px-2 py-1 rounded-lg border border-gold/30 font-bold uppercase tracking-widest hover:bg-gold hover:text-white transition-all">
                        Log Entry
                      </button>
                      <button onClick={() => leaveLedger(p.id)} className="text-[8px] bg-rose-50 text-rose-600 px-2 py-1 rounded-lg border border-rose-200 font-bold uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">
                        Sever
                      </button>
                    </div>
                  )}
                  {isDriver && (
                    <button onClick={() => kickPassenger(p.id)} className="text-[8px] bg-rose-50 text-rose-600 px-3 py-1 rounded-lg border border-rose-200 font-bold uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">
                      Expel
                    </button>
                  )}
                </div>
              </div>
            );
          }

          const amIJoined = passengerList.some(p => p.profile.id === session.user.id);

          return (
            <div key={ledger.id} className="royal-3d-panel p-6 border-l-4 border-l-gold bg-white/40">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 gold-gradient-text text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                    <ShieldCheck size={16} /> Elite Registry
                  </div>
                  <h4 className="text-xl font-display text-slate-900 font-bold leading-tight">{ledger.school_name}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">{ledger.start_location} → Institutional Grounds</p>
                  <p className="text-[9px] text-slate-400 mt-2 uppercase font-bold tracking-widest">Operator: {ledger.driver.name}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-display font-bold gold-gradient-text tracking-tighter">₹{ledger.daily_rate}</div>
                  <div className="text-[9px] text-slate-400 uppercase tracking-[0.2em] font-bold">/ Daily Unit</div>
                  {isDriver && ledger.driver_id === session.user.id && (
                    <button onClick={() => abortLedger(ledger.id)} className="text-[9px] bg-rose-50 text-rose-600 px-4 py-2 rounded-xl border border-rose-200 font-bold uppercase tracking-[0.2em] mt-3 hover:bg-rose-600 hover:text-white transition-all">
                      Terminate
                    </button>
                  )}
                </div>
              </div>

              {!isDriver && !amIJoined && (
                <button onClick={() => joinLedger(ledger.id)} className="w-full btn-gold py-4 text-xs font-bold uppercase tracking-[0.2em]">
                  Initialize Registry
                </button>
              )}

              {passengersUI.length > 0 && (
                <div className="mt-8 border-t border-gold/10 pt-8">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-bold">Monthly Ledger Statement</div>
                    <div className="text-[9px] bg-slate-900 text-white px-3 py-1 rounded-full uppercase tracking-widest font-bold">22 Business Days</div>
                  </div>
                  <div className="space-y-4">
                    {passengersUI}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LedgerView;
