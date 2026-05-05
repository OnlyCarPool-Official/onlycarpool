import LedgerView from './LedgerView';

const SchoolDashboard = () => {
  return (
    <div className="w-full h-full">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold mb-2 tracking-tight">ParentPulse<span className="text-accent text-glow">.</span></h1>
        <p className="text-sm font-medium text-gray-400 tracking-wide">Secure logistics monthly ledger.</p>
      </div>

      <div className="w-full relative z-10">
        <LedgerView />
      </div>
    </div>
  );
};

export default SchoolDashboard;
