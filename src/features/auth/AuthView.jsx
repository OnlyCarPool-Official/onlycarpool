import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, Lock, User, Phone } from 'lucide-react';
import logo from '../../assets/OnlyCarPoolLogo.png';

const AuthView = ({ initialMode = 'login', onBack }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;

        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([{ id: data.user.id, email, name, phone }]);
          if (profileError) throw profileError;
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-ivory flex items-center justify-center p-5 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gold/10 mix-blend-multiply filter blur-[100px] animate-blob" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-slate-200/50 mix-blend-multiply filter blur-[120px] animate-blob delay-2000" />
      </div>

      <div className="royal-3d-panel p-10 rounded-[40px] w-full max-w-md relative z-10 bg-white/60 backdrop-blur-xl">
        <div className="text-center mb-10">
          {onBack && (
            <button
              onClick={onBack}
              className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] hover:text-gold-dark transition-colors mb-6 flex items-center gap-1.5 mx-auto"
            >
              ← Back to Home
            </button>
          )}
          <div className="mb-6">
            <img src={logo} alt="OnlyCarPool" className="h-20 w-auto mx-auto rounded-2xl drop-shadow-xl" />
          </div>
          <p className="text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-[0.3em] opacity-70">Royal Registry & Logistics</p>
        </div>

        {error && (
          <div className="bg-rose/20 text-rose p-3 rounded-xl mb-6 text-xs font-bold border border-rose/30 text-center uppercase tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          {!isLogin && (
            <>
              <div className="royal-3d-input flex items-center px-5 py-4">
                <User size={18} className="text-gold-dark mr-4" />
                <input
                  type="text"
                  required
                  placeholder="Official Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent text-slate-900 focus:outline-none font-bold placeholder:text-slate-300"
                />
              </div>
              <div className="royal-3d-input flex items-center px-5 py-4">
                <Phone size={18} className="text-gold-dark mr-4" />
                <input
                  type="tel"
                  required
                  placeholder="Registered Line (+91...)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent text-slate-900 focus:outline-none font-bold placeholder:text-slate-300"
                />
              </div>
            </>
          )}

          <div className="royal-3d-input flex items-center px-5 py-4">
            <Mail size={18} className="text-gold-dark mr-4" />
            <input
              type="email"
              required
              placeholder="Primary Access Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-slate-900 focus:outline-none font-bold placeholder:text-slate-300"
            />
          </div>

          <div className="royal-3d-input flex items-center px-5 py-4">
            <Lock size={18} className="text-gold-dark mr-4" />
            <input
              type="password"
              required
              placeholder="Encryption Key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent text-slate-900 focus:outline-none font-bold placeholder:text-slate-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-5 font-bold tracking-[0.3em] uppercase text-xs mt-4"
          >
            {loading ? 'Verifying...' : (isLogin ? 'Establish Link' : 'Initialize Portal')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] hover:text-gold-dark transition-colors"
          >
            {isLogin ? "Request Access Clearance" : "Existing Member Log-In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
