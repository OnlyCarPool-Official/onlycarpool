import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { X, User, Mail, Phone, LogOut, ShieldCheck, Pencil, Check } from 'lucide-react';

const ProfileModal = ({ isOpen, onClose }) => {
  const { profile, signOut, session, setProfile } = useContext(AppContext);
  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const initial = profile?.name ? profile.name.charAt(0) : 'U';
  const name = profile?.name || 'Unknown User';
  const email = profile?.email || session?.user?.email || 'No email';
  const phone = profile?.phone || 'Not Provided';
  const isNotProvided = !profile?.phone || profile.phone === 'Not Provided';

  const handleSavePhone = async () => {
    const digits = phoneInput.replace(/\D/g, '').slice(0, 10);
    if (digits.length !== 10) return;
    setSaving(true);
    const fullPhone = '+91' + digits;
    const { data } = await supabase
      .from('profiles')
      .update({ phone: fullPhone })
      .eq('id', session.user.id)
      .select('*')
      .single();
    if (data) setProfile(data);
    setEditingPhone(false);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full max-w-sm royal-3d-panel p-6 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 bg-ivory">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors z-10">
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-gold-light via-gold to-gold-dark flex items-center justify-center font-display font-bold text-4xl text-white shadow-lg mb-4 uppercase">
            {initial}
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900">{name}</h2>
          <div className="flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-widest text-emerald-600 mt-1">
            <ShieldCheck size={14} /> Verified Operator
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <Mail size={18} className="text-slate-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Registered Email</p>
              <p className="text-sm text-slate-900 font-medium">{email}</p>
            </div>
          </div>

          {/* Phone — editable */}
          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <Phone size={18} className="text-slate-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Mobile Number</p>
              {editingPhone ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">+91</span>
                  <input
                    autoFocus
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="10-digit number"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="flex-1 bg-white border border-gold/30 rounded-lg px-2 py-1 text-sm font-bold text-slate-900 focus:outline-none focus:border-gold"
                  />
                  <button
                    onClick={handleSavePhone}
                    disabled={saving || phoneInput.replace(/\D/g, '').length !== 10}
                    className="w-7 h-7 rounded-lg bg-gold flex items-center justify-center text-white disabled:opacity-40"
                  >
                    <Check size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium ${isNotProvided ? 'text-rose-400 italic' : 'text-slate-900'}`}>
                    {phone}
                  </p>
                  <button
                    onClick={() => { setEditingPhone(true); setPhoneInput(''); }}
                    className="w-7 h-7 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold-dark hover:bg-gold/20 transition-colors ml-2 shrink-0"
                  >
                    <Pencil size={13} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <User size={18} className="text-slate-400 shrink-0" />
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
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
