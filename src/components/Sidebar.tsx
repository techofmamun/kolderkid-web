import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "/assets/images/kolderkid-logo.png";
// import ProfileSidebarSection from "./ProfileSidebarSection";
import { BiHome } from "react-icons/bi";
import {
  FaHeart,
  FaHistory,
  FaShoppingBag,
  FaUserCircle
} from "react-icons/fa";

const navItems = [
  {
    name: "Home",
    path: "/",
    icon: <BiHome className="text-sky-400 text-xl mr-3" />,
  },

  {
    name: "My Profile",
    path: "/profile",
    icon: <FaUserCircle className="text-sky-400 text-xl mr-3" />,
  },
  {
    name: "My Cart",
    path: "/cart",
    icon: <FaShoppingBag className="text-sky-400 text-xl mr-3" />,
  },
  {
    name: "History",
    path: "/history",
    icon: <FaHistory className="text-sky-400 text-xl mr-3" />,
  },
  {
    name: "Favourites",
    path: "/favourites",
    icon: <FaHeart className="text-sky-400 text-xl mr-3" />,
  },
];

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [open, setOpen] = React.useState(true);

  return (
    <>
      <div
        className={`flex-col h-full transition-all duration-300 ${
          open ? "w-64" : "w-20"
        } shadow-lg min-h-screen items-center relative backdrop-blur-sm hidden sm:flex`}
      >
        {/* branding */}
        <div className="mb-8 flex flex-col items-center w-full">
          <img
            src={logo}
            alt="Kolderkid Universe"
            className={`size-20 mx-auto transition-all duration-300 ${
              open ? "" : "mt-16"
            }`}
            draggable="false"
          />
          {open && (
            <h1 className="text-xl sm:text-2xl font-bold mb-6 bg-gradient-to-r from-[#00B4FF] to-[#FF4D00] bg-clip-text text-transparent text-center w-full px-1">
              KOLDERKID UNIVERSE
            </h1>
          )}
        </div>
        <div className="flex-1 w-full overflow-y-auto max-h-[74vh]">
          <nav className="w-full p-2 md:p-6">
            <ul className="space-y-2">
              {navItems.map((item) => {
                // Handler for nav item click (not logout)
                const handleNavClick = () => {
                  if (
                    location.pathname !== item.path &&
                    open &&
                    window.innerWidth < 768
                  ) {
                    setOpen(false);
                  }
                };
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      onClick={handleNavClick}
                      className={`flex ${
                        open
                          ? "items-center"
                          : "flex-col items-center justify-center"
                      } px-2 md:px-4 py-3 rounded-lg font-medium transition-all duration-300 ease-in-out border-l-4  ${
                        location.pathname === item.path
                          ? "bg-sky-100 text-sky-700  border-sky-500"
                          : "text-gray-700 hover:bg-sky-50 border-transparent"
                      }`}
                      style={{
                        WebkitTransition: "background 0.3s, color 0.3s",
                        transition: "background 0.3s, color 0.3s",
                      }}
                    >
                      {React.cloneElement(item.icon, {
                        className: `text-xl transition-all duration-300 ease-in-out ${
                          open ? "mr-0 md:mr-3" : "mb-0"
                        } ${
                          location.pathname === item.path
                            ? "text-sky-600"
                            : "text-sky-400"
                        }`,
                      })}
                      {open && <span className="ml-3">{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        <button
          className={`absolute top-4 z-50 p-2 rounded-md bg-white shadow border border-sky-200 text-sky-500 transition-all duration-300 ${
            open ? "right-2" : "left-1/2 -translate-x-1/2"
          }`}
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          {open ? <FaChevronLeft size={22} /> : <FaChevronRight size={22} />}
        </button>
      </div>
      {/* Mobile Sidebar fixed at bottom */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-sky-200 flex justify-around items-center py-2 shadow-lg">
        {navItems
          .filter((item) => item.name !== "Logout")
          .map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center px-2 py-1 ${
                location.pathname === item.path
                  ? "text-sky-600"
                  : "text-gray-500"
              }`}
              style={{ minWidth: 48 }}
            >
              {React.cloneElement(item.icon, {
                className: `text-2xl mb-0 ${
                  location.pathname === item.path
                    ? "text-sky-600"
                    : "text-sky-400"
                }`,
              })}
              <span className="text-xs mt-1">
                {item.name.replace("My ", "")}
              </span>
            </Link>
          ))}
      </nav>
    </>
  );
};
export default Sidebar;
