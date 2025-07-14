import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full h-16 bg-white flex items-center justify-between px-8 shadow-lg">
      <div className="font-bold text-xl text-sky-700">Dashboard</div>
      <div className="flex items-center gap-3">
        {/* Profile avatar and name, replace with actual user data if available */}
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Creator"
          className="h-10 w-10 rounded-full border"
        />
        <span className="font-medium text-gray-700">Creator</span>
      </div>
    </nav>
  );
};

export default Navbar;
