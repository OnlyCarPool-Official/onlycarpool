import { useState } from 'react';
import { ShieldAlert, Navigation } from 'lucide-react';

const PaidDriverView = () => {
  const [verified, setVerified] = useState(false);

  return (
    <div className="space-y-6">
      {!verified ? (
        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-amber">
            <ShieldAlert size={100} />
          </div>
          <div className="flex items-center gap-3 text-amber mb-6 relative z-10">
            <div className="bg-amber/20 p-2 rounded-lg border border-amber/30">
              <ShieldAlert size={24} className="animate-pulse" />
            </div>
            <h3 className="font-display font-bold text-xl tracking-tight text-glow">Verification Lock</h3>
          </div>
          <p className="text-sm font-medium text-gray-400 mb-8 relative z-10">Clearance required to operate Pro Fleet protocols.</p>
          
          <div className="space-y-5 mb-8 relative z-10">
            <input type="text" placeholder="Designated Facility ID" className="w-full bg-navy-900 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-amber transition-colors font-medium" />
            <input type="text" placeholder="Operator Clearance Hash" className="w-full bg-navy-900 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-amber transition-colors font-medium" />
          </div>

          <button 
            onClick={() => setVerified(true)}
            className="relative z-10 w-full py-4 rounded-xl bg-amber text-navy-900 font-bold tracking-widest uppercase hover:bg-yellow-400 transition-colors shadow-[0_0_20px_rgba(245,158,11,0.3)]"
          >
            Authenticate
          </button>
        </div>
      ) : (
        <div className="glass-panel p-6 rounded-3xl">
          <h3 className="font-display font-bold text-xl mb-6">Contract Parameters</h3>
          <div className="flex items-center justify-center gap-2 mb-8 bg-navy-900/50 py-8 rounded-2xl border border-white/5">
            <span className="text-3xl text-gray-500 font-display">₹</span>
            <input type="number" defaultValue="1500" className="w-32 bg-transparent text-5xl font-display font-bold text-white text-center outline-none focus:text-mint transition-colors" />
            <span className="text-xs font-bold text-gray-500 tracking-widest uppercase rotate-[-90deg] origin-left translate-x-2 translate-y-3">/Week</span>
          </div>
          <button className="w-full py-4 rounded-xl bg-mint text-navy-900 font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_var(--theme-accent-glow)] hover:scale-[0.98] transition-transform">
            <Navigation size={18} />
            Engage Fleet Mode
          </button>
        </div>
      )}
    </div>
  );
};

export default PaidDriverView;
