import { Star } from 'lucide-react';

const RideCard = ({ ride, isPriority, onRequest, requestStatus, passengerPhone, driverPhone, isDriverView }) => {
  return (
    <div className={`relative perspective-1000 group w-full ${isPriority ? 'mb-4' : ''}`}>
      <div className={`royal-3d-panel p-6 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(200,190,180,0.5)] ${isPriority ? 'border-gold shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'border-white/40'}`}>
        
        {isPriority && (
          <div className="absolute -inset-[1px] rounded-2xl opacity-50 pointer-events-none" style={{
            background: 'conic-gradient(from 0deg, transparent, #00FFA3, transparent 30%)',
            animation: 'border-spin 3s linear infinite'
          }}></div>
        )}

        <div className="relative z-10">
          {isPriority && (
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Priority Target</span>
            </div>
          )}

          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-display font-bold royal-3d-button ${isPriority ? 'bg-gradient-to-br from-gold-light via-gold to-gold-dark text-white' : 'text-slate-900'}`}>
                {ride.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-900 text-lg leading-tight">{ride.name}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <Star size={14} className="text-gold fill-gold" />
                  <span className="text-xs font-bold text-slate-500">{ride.rating}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-display font-bold gold-gradient-text tracking-tighter">{ride.eta}</p>
              <p className="text-[9px] text-slate-400 uppercase font-bold tracking-[0.2em]">Departure</p>
            </div>
          </div>

          <div className="royal-3d-input p-4 flex items-center justify-between mb-5">
            <div className="flex-1">
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-1">Vector Path</p>
              <p className="text-xs font-bold text-slate-700">{ride.route.from} <span className="text-gold mx-2">→</span> {ride.route.to}</p>
            </div>
            <div className="pl-4 border-l border-gold/10 text-right">
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-1">Payload</p>
              <p className="text-sm font-bold text-slate-900">{ride.seatsLeft} Slots</p>
            </div>
          </div>

          {/* TWO-WAY CONFIRMATION & COMMUNICATION LOGIC */}
          {requestStatus === 'accepted' ? (
            <div className="royal-3d-input py-3 text-center border border-gold/20">
              <p className="text-[10px] font-bold gold-gradient-text uppercase tracking-[0.2em] mb-1">Intercept Confirmed</p>
              <p className="text-sm font-bold text-slate-900">
                Line: {isDriverView ? passengerPhone : driverPhone}
              </p>
            </div>
          ) : requestStatus === 'pending' ? (
            <div className="royal-3d-input py-3 text-gold-dark text-[10px] font-bold uppercase tracking-[0.2em] text-center flex justify-center items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.8)]"></div>
              Establishing Connection...
            </div>
          ) : requestStatus === 'rejected' ? (
            <div className="royal-3d-input py-3 text-rose-600 text-[10px] font-bold uppercase tracking-[0.2em] text-center opacity-60">
              Intercept Aborted
            </div>
          ) : (
            <button 
              onClick={onRequest}
              className="w-full btn-gold py-4 font-bold tracking-[0.2em] uppercase text-xs"
            >
              Initiate Intercept
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default RideCard;
