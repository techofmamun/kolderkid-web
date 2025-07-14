import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-56 bg-sky-100 border-r border-sky-200 min-h-screen p-4 hidden md:block">
      <div className="mb-8 text-sky-700 font-bold text-2xl">Menu</div>
      <ul className="space-y-4">
        <li>
          <Link to="/" className="text-sky-700 hover:text-sky-900 font-medium">Home</Link>
        </li>
        {/* Add more links as you migrate more pages */}
      </ul>
    </aside>
  );
};

export default Sidebar;
