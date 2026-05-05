import { useContext, useState } from 'react';
import { RideContext } from '../../../context/RideContext';
import { assignDriverOfDay } from '../../../utils/rotationLogic';
import { Calendar, RefreshCcw, ShieldCheck } from 'lucide-react';

const CircleView = () => {
  const { parents, mockData } = useContext(RideContext);
  const circle = mockData.parentCircle;
  const [currentDate] = useState(new Date('2026-05-04')); // Fixed date for demo
  
  const driverIdOfDay = assignDriverOfDay(circle, currentDate.toISOString());
  const driverOfDay = parents.find(p => p.id === driverIdOfDay);

  return (
    <div className="space-y-6">
      {/* Holographic Driver of the Day Card */}
      <div className="perspective-1000">
        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden transform preserve-3d rotate-x-2 border-accent/20">
          <div className="absolute top-[-20%] right-[-10%] opacity-20 text-accent mix-blend-screen animate-border-spin">
            <RefreshCcw size={150} strokeWidth={1} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={16} className="text-accent" />
              <p className="text-xs font-bold text-accent tracking-widest uppercase">{circle.name}</p>
            </div>
            <h2 className="text-3xl font-display font-bold mb-6 text-white text-glow">Active Rotation</h2>
            
            <div className="bg-navy-900/60 p-5 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">Protocol: Monday Lead</div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-accent to-premium flex items-center justify-center text-2xl font-display font-bold shadow-[0_0_15px_var(--theme-accent-glow)]">
                    {driverOfDay?.name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-navy-900 rounded-full flex items-center justify-center border border-white/10">
                    <div className="w-3 h-3 bg-mint rounded-full shadow-[0_0_8px_#00FFA3]"></div>
                  </div>
                </div>
                <div>
                  <div className="text-xl font-display font-bold text-white">{driverOfDay?.name}</div>
                  <div className="text-xs text-mint font-medium">System Authorized</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Duty Balance Ledger */}
      <div className="glass-panel p-6 rounded-3xl">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="text-gray-400" size={20} />
          <h3 className="font-display font-bold text-xl tracking-tight">Ledger Matrix</h3>
        </div>
        
        <div className="space-y-4">
          {parents.map((parent, i) => (
            <div key={parent.id} className="relative overflow-hidden flex justify-between items-center p-4 rounded-xl bg-navy-900/50 border border-white/5" style={{ animation: `fade-in 0.5s ease-out ${i * 0.1}s both` }}>
              <span className="font-medium text-sm text-gray-200">{parent.name}</span>
              
              <div className="flex items-center gap-3">
                <div className={`h-1.5 w-16 rounded-full overflow-hidden bg-navy-900`}>
                  <div className={`h-full ${parent.credits > 0 ? 'bg-mint' : parent.credits < 0 ? 'bg-rose' : 'bg-gray-500'}`} style={{ width: parent.credits > 0 ? '100%' : parent.credits < 0 ? '20%' : '50%' }}></div>
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest ${
                  parent.credits > 0 ? 'text-mint drop-shadow-[0_0_5px_#00FFA3]' :
                  parent.credits < 0 ? 'text-rose drop-shadow-[0_0_5px_#FF0055]' :
                  'text-gray-400'
                }`}>
                  {parent.credits > 0 ? `+${parent.credits}` : parent.credits} CR
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CircleView;
