import React from 'react';
import { Outlet } from 'react-router-dom';
import OnboardingSlider from './OnboardingSlider';

const AuthContainer: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      {/* Onboarding left */}
      <div className="md:w-1/2 w-full flex items-center justify-center bg-gradient-to-b from-sky-200 via-white to-sky-100">
        <div className="w-full max-w-md h-full flex items-center justify-center">
          <OnboardingSlider />
        </div>
      </div>
      {/* Auth form right */}
      <div className="md:w-1/2 w-full flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8">
          {/* Existing Outlet for child routes */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
