import React from "react";
import OnboardingSlider from "./OnboardingSlider";
import { Outlet } from "react-router-dom";
import logo from "/assets/images/splash.png";

const AuthContainer: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-sky-200 via-white to-sky-100  ">
      {/* Onboarding left */}
      <div className="flex-1 hidden md:block">
        <OnboardingSlider />
      </div>
      {/* Auth form right */}
      <div className="w-full flex-1 flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg">
        {/* Existing Outlet for child routes */}
        <div className="mb-12 flex flex-col items-center">
          <img
            src={logo}
            alt="Kolderkid Universe"
            className="size-60 lg:size-80 mx-auto drop-shadow-lg transition-all duration-300"
          />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthContainer;
