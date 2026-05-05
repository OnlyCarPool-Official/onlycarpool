import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import SnapDriverView from './DriverView';
import SnapPassengerView from './PassengerView';

const SnapDashboard = () => {
  const { isDriver } = useContext(AppContext);

  return (
    <div className="w-full h-full">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold mb-2 tracking-tight">SnapTrip<span className="text-premium text-glow">.</span></h1>
        <p className="text-sm font-medium text-gray-400 tracking-wide">Instant logistics & Elite vouchers.</p>
      </div>

      <div className="w-full relative z-10">
        {isDriver ? <SnapDriverView /> : <SnapPassengerView />}
      </div>
    </div>
  );
};

export default SnapDashboard;
