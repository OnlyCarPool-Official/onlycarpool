import GlobalHeader from '../GlobalHeader';
import BottomNav from '../BottomNav';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const AppShell = ({ children }) => {
  const { isDriver } = useContext(AppContext);

  return (
    <div className="w-full h-screen flex flex-col bg-ivory text-slate-900 overflow-hidden relative">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[100vw] h-[100vw] rounded-full bg-gold/5 mix-blend-multiply filter blur-[120px] opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[100vw] h-[100vw] rounded-full bg-slate-200/40 mix-blend-multiply filter blur-[120px] opacity-40"></div>
      </div>

      <GlobalHeader />
      
      {/* Scrollable Main Content */}
      <main className="flex-1 w-full overflow-y-auto pt-28 pb-40 px-5 scroll-smooth relative z-10">
        <div className="max-w-md mx-auto h-full flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          <div className="h-32 w-full flex-shrink-0 pointer-events-none" />
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default AppShell;
