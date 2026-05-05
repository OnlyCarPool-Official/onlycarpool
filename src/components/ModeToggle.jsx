import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const ModeToggle = () => {
  const { isDriver, setIsDriver } = useContext(AppContext);

  return (
    <div className="relative flex items-center royal-3d-input p-1 rounded-xl gap-1">
      <button
        onClick={() => setIsDriver(false)}
        className={`relative z-10 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all duration-300 ${
          !isDriver
            ? 'bg-gradient-to-br from-gold-light via-gold to-gold-dark text-white shadow-md'
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        Client
      </button>
      <button
        onClick={() => setIsDriver(true)}
        className={`relative z-10 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all duration-300 ${
          isDriver
            ? 'bg-gradient-to-br from-gold-light via-gold to-gold-dark text-white shadow-md'
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        Pilot
      </button>
    </div>
  );
};

export default ModeToggle;
