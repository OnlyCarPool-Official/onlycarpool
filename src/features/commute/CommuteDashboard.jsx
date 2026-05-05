import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import DriverView from './DriverView';
import PassengerView from './PassengerView';

const CommuteDashboard = () => {
  const { isDriver } = useContext(AppContext);

  return (
    <div className="w-full h-full">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold mb-2 tracking-tight">Commute<span className="text-accent text-glow">.</span></h1>
        <p className="text-sm font-medium text-gray-400 tracking-wide">High-speed trusted colleague routing.</p>
      </div>

      <div className="w-full relative z-10">
        {isDriver ? <DriverView /> : <PassengerView />}
      </div>
    </div>
  );
};

export default CommuteDashboard;
