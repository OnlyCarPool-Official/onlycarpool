import { useState } from 'react';
import { MapPin, ShieldCheck, CreditCard } from 'lucide-react';

const PaidPassengerView = () => {
  const [paid, setPaid] = useState(false);
  
  return (
    <div className="space-y-6">
      {!paid ? (
        <div className="glass-panel p-6 rounded-3xl">
          <div className="flex items-center gap-3 text-accent mb-6">
            <div className="bg-accent/20 p-2 rounded-lg border border-accent/30">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-display font-bold text-xl text-glow tracking-tight">Verified Fleet</h3>
          </div>
          <div className="bg-navy-900/60 p-5 rounded-2xl border border-white/10 mb-8 backdrop-blur-md">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-display font-bold text-lg text-white">Vikram Singh</h4>
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mt-1">DAV School Unit 8</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-display font-bold text-accent text-glow">₹1500</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Weekly Contract</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setPaid(true)}
            className="w-full py-4 rounded-xl bg-accent text-navy-900 font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_var(--theme-accent-glow)] hover:opacity-90 transition-opacity"
          >
            <CreditCard size={18} />
            Establish Escrow
          </button>
        </div>
      ) : (
        <div className="glass-panel p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-bold text-lg">Active Telemetry</h3>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-mint/20 text-mint px-3 py-1 rounded-full border border-mint/30 flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-mint rounded-full animate-ping"></div> Live
            </span>
          </div>
          <div className="aspect-[4/3] bg-navy-900 rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center border border-white/5">
            {/* Holographic Radar grid */}
            <div className="absolute inset-0 opacity-30" style={{ 
              backgroundImage: 'radial-gradient(circle, var(--theme-accent) 1px, transparent 1px)', 
              backgroundSize: '24px 24px',
              animation: 'float 10s linear infinite'
            }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent"></div>
            
            <div className="text-center relative z-10 p-6 glass-panel rounded-2xl mx-4">
              <MapPin className="text-accent mx-auto mb-3 animate-bounce" size={36} />
              <p className="font-display font-bold text-white tracking-wide">Target Acquired</p>
              <p className="text-xs font-medium text-gray-400 mt-1">Fleet unit is 2.0 km inbound</p>
            </div>
          </div>
          <button className="w-full py-4 rounded-xl bg-transparent border border-white/20 text-white font-bold tracking-widest uppercase hover:bg-white/5 transition-colors text-xs">
            Ping Coordinates
          </button>
        </div>
      )}
    </div>
  );
};

export default PaidPassengerView;
