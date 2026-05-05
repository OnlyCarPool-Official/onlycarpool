import { useState, useContext } from 'react';
import ModeToggle from './ModeToggle';
import ProfileModal from './ProfileModal';
import ActiveOpsModal from './ActiveOpsModal';
import { Radar } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import logo from '../assets/OnlyCarPoolLogo.png';

const GlobalHeader = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOpsOpen, setIsOpsOpen] = useState(false);
  const { profile } = useContext(AppContext);

  return (
    <>
      <header className="fixed top-4 left-4 right-4 z-50">
        <div className="royal-3d-panel px-5 py-3 flex justify-between items-center bg-ivory/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="OnlyCarPool" 
              className="h-10 w-auto rounded-2xl cursor-pointer hover:opacity-80 active:scale-95 transition-all" 
              onClick={() => setIsProfileOpen(true)}
            />
            <div>
              <h1 className="text-sm font-display font-bold gold-gradient-text tracking-tight uppercase leading-none">OnlyCarPool</h1>
              <p className="text-[9px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">Elite Registry</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsOpsOpen(true)}
              className="w-10 h-10 rounded-xl royal-3d-button flex items-center justify-center text-gold hover:scale-105 active:scale-95 transition-all"
            >
              <Radar size={20} className="drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
            </button>
            <ModeToggle />
          </div>
        </div>
      </header>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <ActiveOpsModal isOpen={isOpsOpen} onClose={() => setIsOpsOpen(false)} />
    </>
  );
};

export default GlobalHeader;
