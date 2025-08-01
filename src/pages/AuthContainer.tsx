import React from "react";
import OnboardingSlider from "./OnboardingSlider";
import { Outlet } from "react-router-dom";
import logo from "/assets/images/splash.png";
import { Link } from "react-router-dom";

const AuthContainer: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-sky-200 via-white to-sky-100  ">
      {/* Onboarding left */}
      <div className="flex-1 hidden md:block">
        <OnboardingSlider />
      </div>
      {/* Auth form right */}
      <div
        className="w-full flex-1 flex flex-col items-center justify-center ˝"
        style={{
          backgroundImage: `url(${logo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#F0F4F8",
        }}
      >
        {/* Existing Outlet for child routes */}
        <div className="h-full w-full flex items-center justify-center backdrop-blur-sm p-6">
          <div className="flex flex-col items-center w-full max-w-md gap-8">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-[#00B4FF] to-[#FF4D00] bg-clip-text text-transparent text-center">
              KOLDERKID UNIVERSE
            </h1>
            <div className="bg-white/85  p-8 rounded-xl shadow-md w-full max-w-md">
              <Outlet />
              <Link
                to="/"
                className="text-sky-700 hover:underline mt-4 block text-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
