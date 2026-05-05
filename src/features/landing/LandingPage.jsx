import { useState, useEffect } from 'react';
import { Briefcase, School, ShoppingBag, ArrowRight, Shield, Zap, Users, MapPin, Star, ChevronRight } from 'lucide-react';
import logo from '../../assets/OnlyCarPoolLogo.png';

const StatCard = ({ value, label }) => (
  <div className="flex flex-col items-center gap-1">
    <div className="text-2xl font-display font-bold gold-gradient-text">{value}</div>
    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, desc, accentClass, delay }) => (
  <div
    className="royal-3d-panel p-6 flex flex-col gap-4 hover:scale-[1.02] transition-all duration-500"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${accentClass}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <h3 className="font-display font-bold text-slate-900 text-lg mb-1">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-auto">
      Explore <ChevronRight size={12} />
    </div>
  </div>
);

const StepBadge = ({ num, title, desc }) => (
  <div className="flex gap-4 items-start">
    <div className="w-10 h-10 rounded-xl btn-gold flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
      {num}
    </div>
    <div>
      <p className="font-display font-bold text-slate-900 text-sm">{title}</p>
      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const LandingPage = ({ onLogin, onSignup }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = document.getElementById('landing-scroll');
    const handleScroll = () => setScrolled(el.scrollTop > 40);
    el?.addEventListener('scroll', handleScroll);
    return () => el?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div id="landing-scroll" className="w-full h-screen bg-ivory overflow-y-auto relative">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-gold/8 mix-blend-multiply filter blur-[120px] animate-blob" />
        <div className="absolute top-[30%] right-[-15%] w-[60vw] h-[60vw] rounded-full bg-slate-300/20 mix-blend-multiply filter blur-[100px] animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-gold/5 mix-blend-multiply filter blur-[130px] animate-blob" style={{ animationDelay: '4s' }} />
      </div>

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-ivory/90 backdrop-blur-xl border-b border-gold/10 shadow-sm' : ''}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="OnlyCarPool" className="h-10 w-auto rounded-2xl" />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onLogin}
              className="text-[11px] font-bold text-slate-600 uppercase tracking-[0.15em] hover:text-gold-dark transition-colors px-4 py-2"
            >
              Log In
            </button>
            <button
              onClick={onSignup}
              className="btn-gold text-[11px] font-bold uppercase tracking-[0.15em] px-5 py-2.5"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 royal-3d-panel px-4 py-2 mb-10">
          <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em]">India's Premium Carpooling Platform</span>
        </div>

        <div className="mx-auto mb-8">
          <img src={logo} alt="OnlyCarPool" className="h-32 w-auto mx-auto rounded-3xl drop-shadow-2xl" />
        </div>

        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-6 leading-none">
          <span className="gold-gradient-text italic">Only</span>
          <span className="text-slate-900">CarPool</span>
          <br />
          <span className="text-slate-400 text-3xl md:text-4xl font-normal not-italic">Smarter Rides. Across India.</span>
        </h1>

        <p className="text-base md:text-lg text-slate-500 max-w-xl mb-12 leading-relaxed">
          The premium, multi-channel platform for daily commutes, school runs, and real-time trips. Connect with verified co-travelers wherever you are in India.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onSignup}
            className="btn-gold px-8 py-4 font-bold uppercase tracking-[0.2em] text-sm flex items-center gap-3 w-full sm:w-auto justify-center"
          >
            Begin Your Journey <ArrowRight size={18} />
          </button>
          <button
            onClick={onLogin}
            className="royal-3d-button px-8 py-4 font-bold uppercase tracking-[0.2em] text-sm text-slate-700 w-full sm:w-auto"
          >
            Already a Member
          </button>
        </div>

        <div className="mt-16 w-full max-w-xl mx-auto">
          <div className="royal-3d-panel p-6 flex justify-around">
            <StatCard value="3" label="Channels" />
            <div className="w-px bg-gold/10" />
            <StatCard value="Live" label="Real-Time" />
            <div className="w-px bg-gold/10" />
            <StatCard value="Pan" label="India" />
            <div className="w-px bg-gold/10" />
            <StatCard value="100%" label="Secure" />
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-[10px] font-bold gold-gradient-text uppercase tracking-[0.3em] mb-3">Three Channels. One Platform.</p>
          <h2 className="text-4xl font-display font-bold text-slate-900 tracking-tighter">Built for Every Journey</h2>
          <p className="text-slate-500 mt-3 max-w-lg mx-auto text-sm leading-relaxed">
            Whether it's a daily office route, a school run for your child, or a spontaneous trip — OnlyCarPool has a dedicated channel for it, in any city across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={Briefcase}
            title="Daily Commute"
            desc="Broadcast your fixed route to work. Build a reliable group of co-travelers who share your daily schedule. Manage multiple active rides simultaneously."
            accentClass="bg-gradient-to-br from-emerald-400 to-emerald-600"
            delay={0}
          />
          <FeatureCard
            icon={School}
            title="School Ledger"
            desc="The premium monthly billing registry for school runs. Track daily pickups, log overrides, and maintain a verified financial ledger per student."
            accentClass="bg-gradient-to-br from-amber-400 to-amber-600"
            delay={100}
          />
          <FeatureCard
            icon={ShoppingBag}
            title="Snap-Trip"
            desc="Real-time one-off rides. Set your destination vector, initiate a wide-band scan, and intercept the nearest available driver — instantly."
            accentClass="bg-gradient-to-br from-purple-400 to-purple-700"
            delay={200}
          />
        </div>
      </section>

      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[10px] font-bold gold-gradient-text uppercase tracking-[0.3em] mb-3">How It Works</p>
            <h2 className="text-4xl font-display font-bold text-slate-900 tracking-tighter mb-4">Up in Minutes.<br />Riding in Seconds.</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-10">
              OnlyCarPool is designed for speed. Create your profile, pick your role, and start connecting with co-travelers in your city.
            </p>
            <div className="space-y-8">
              <StepBadge
                num="1"
                title="Create Your Royal Registry"
                desc="Sign up with your email and register your official name and phone number. Your profile is your identity on the platform."
              />
              <StepBadge
                num="2"
                title="Choose Your Role"
                desc="Switch between Pilot (Driver) and Client (Passenger) modes at any time. You can even be both simultaneously across different channels."
              />
              <StepBadge
                num="3"
                title="Connect and Commute"
                desc="Publish routes, accept passengers, or intercept available rides. Track all your active operations from the Royal Command Hub."
              />
            </div>
          </div>

          <div className="space-y-5">
            {[
              { icon: Shield, title: 'Verified Identities', desc: 'Every member on the platform has a registered phone and email. No anonymous connections.' },
              { icon: Zap, title: 'Real-Time Matching', desc: 'Ride requests and acceptances are reflected instantly across all devices using Supabase real-time.' },
              { icon: Users, title: 'Multi-Ride Support', desc: 'Drivers can host multiple routes. Passengers can be on multiple rides. Full parallel operation.' },
              { icon: MapPin, title: 'GPS Intercept', desc: 'Snap-Trip uses device GPS to provide proximity-aware ride matching for spontaneous one-off trips.' },
              { icon: Star, title: 'Zero Commission', desc: 'No platform cuts, no surge pricing. Drivers and passengers connect directly and settle fares on their own terms.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="royal-3d-panel p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-gold-dark" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-slate-900 text-sm">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="royal-3d-panel p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-48 h-48 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-gold/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-4">Join the Registry Today</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-4">
            <span className="gold-gradient-text italic">Premium Commuting</span>
            <br />
            <span className="text-slate-900">Starts Here.</span>
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-10 leading-relaxed">
            Join commuters across India who have upgraded their daily ride. Free to use. No commissions. Pure connection.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={onSignup}
              className="btn-gold px-10 py-4 font-bold uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3"
            >
              Create Free Account <ArrowRight size={16} />
            </button>
            <button
              onClick={onLogin}
              className="royal-3d-button px-10 py-4 font-bold uppercase tracking-[0.2em] text-sm text-slate-700"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      <footer className="relative z-10 max-w-6xl mx-auto px-6 py-10 border-t border-gold/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center">
            <img src={logo} alt="OnlyCarPool" className="h-10 w-auto rounded-2xl" />
          </div>
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold text-center">
            © 2026 OnlyCarPool · Premium Carpooling · Pan-India
          </p>
          <button
            onClick={onLogin}
            className="text-[10px] font-bold text-gold-dark uppercase tracking-[0.2em] hover:opacity-70 transition-opacity"
          >
            Log In →
          </button>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
