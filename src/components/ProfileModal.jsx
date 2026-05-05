import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { X, User, Mail, Phone, LogOut, ShieldCheck } from 'lucide-react';

const ProfileModal = ({ isOpen, onClose }) => {
  const { profile, signOut, session } = useContext(AppContext);

  if (!isOpen) return null;

  const initial = profile?.name ? profile.name.charAt(0) : 'U';
  const name = profile?.name || 'Unknown User';
  const email = profile?.email || session?.user?.email || 'No email';
  const phone = profile?.phone || 'Not Provided';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-sm glass-panel p-6 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors z-10">
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-accent to-premium flex items-center justify-center font-display font-bold text-4xl text-white shadow-lg mb-4 uppercase">
            {initial}
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900">{name}</h2>
          <div className="flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-widest text-emerald-600 mt-1">
            <ShieldCheck size={14} /> Verified Operator
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <Mail size={18} className="text-slate-400" />
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Registered Email</p>
              <p className="text-sm text-slate-900 font-medium">{email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <Phone size={18} className="text-slate-400" />
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Secure Comms Line</p>
              <p className="text-sm text-slate-900 font-medium">{phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <User size={18} className="text-slate-400" />
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">System ID</p>
              <p className="text-xs text-slate-500 font-mono truncate w-48">{session?.user?.id}</p>
            </div>
          </div>
        </div>

        <button 
          onClick={signOut}
          className="w-full py-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 font-bold tracking-widest uppercase hover:bg-rose-500 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <LogOut size={18} /> Sever Connection
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
