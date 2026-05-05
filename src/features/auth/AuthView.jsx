import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, Lock, User, Phone, CheckCircle2 } from 'lucide-react';
import logo from '../../assets/OnlyCarPoolLogo.png';

const AuthView = ({ initialMode = 'login', onBack }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, phone }
          }
        });
        if (signUpError) throw signUpError;
        setConfirmed(true);
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

        {confirmed ? (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} className="text-gold" />
            </div>
            <div>
              <h2 className="font-display font-bold text-slate-900 text-xl mb-2">Confirm Your Email</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                A confirmation link has been sent to
              </p>
              <p className="text-sm font-bold text-gold-dark mt-1">{email}</p>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Click the link in the email to activate your account, then come back here to log in.
              </p>
            </div>
            <button
              onClick={() => { setConfirmed(false); setIsLogin(true); }}
              className="w-full btn-gold py-4 font-bold tracking-[0.3em] uppercase text-xs"
            >
              Go to Log In
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-rose-50 text-rose-600 p-3 rounded-xl mb-6 text-xs font-bold border border-rose-200 text-center uppercase tracking-widest">
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
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent text-slate-900 focus:outline-none font-bold placeholder:text-slate-300"
                    />
                  </div>
                  <div className="royal-3d-input flex items-center px-5 py-4">
                    <Phone size={18} className="text-gold-dark mr-3 shrink-0" />
                    <span className="text-slate-900 font-bold mr-2 shrink-0">+91</span>
                    <div className="w-px h-5 bg-slate-300 mr-3 shrink-0" />
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={phone.replace('+91', '')}
                      maxLength={10}
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setPhone('+91' + digits);
                      }}
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
                  placeholder="Email Address"
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
                  placeholder="Password"
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
                {loading ? 'Please wait...' : (isLogin ? 'Log In' : 'Create Account')}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button
                onClick={() => { setIsLogin(!isLogin); setError(null); }}
                className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] hover:text-gold-dark transition-colors"
              >
                {isLogin ? 'New here? Create an account' : 'Already have an account? Log In'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthView;
