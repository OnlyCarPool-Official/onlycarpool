import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Briefcase, School, ShoppingBag } from 'lucide-react';

const BottomNav = () => {
  const { currentCategory, setCurrentCategory } = useContext(AppContext);

  const navItems = [
    { id: 'commute', label: 'Commute', icon: Briefcase },
    { id: 'school', label: 'School', icon: School },
    { id: 'snap', label: 'Snap-Trip', icon: ShoppingBag },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-white border-t border-slate-200 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
      <nav className="flex justify-between items-center px-4 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentCategory === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentCategory(item.id)}
              className={`relative flex-1 py-3 flex flex-col items-center gap-1 rounded-xl transition-all duration-500 ${
                isActive ? 'bg-slate-50' : 'hover:bg-slate-50/50'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-accent/10 rounded-xl blur-sm"></div>
              )}
              
              <Icon
                size={22}
                className={`relative z-10 transition-all duration-500 ${
                  isActive ? 'text-accent drop-shadow-[0_0_8px_var(--theme-accent-glow)] scale-110' : 'text-gray-500 scale-100'
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`relative z-10 text-[10px] font-bold tracking-wide transition-all duration-500 ${
                  isActive ? 'text-slate-900' : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
