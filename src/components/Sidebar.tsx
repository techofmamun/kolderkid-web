import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks";
import { api } from "../services/api";
import logo from "/assets/images/kolderkid-logo.png"; 
import ProfileSidebarSection from "./ProfileSidebarSection";
import {
  FaUserCircle,
  FaShoppingBag,
  FaHistory,
  FaHeart,
  FaDownload,
  FaShieldAlt,
  FaFileAlt,
  FaInfoCircle,
  FaUserTimes,
  FaSignOutAlt,
} from "react-icons/fa";
import { BiHome } from "react-icons/bi";

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
  {
    name: "Downloads",
    path: "/downloads",
    icon: <FaDownload className="text-sky-400 text-xl mr-3" />,
  },
  {
    name: "Privacy Policy",
    path: "/privacy-policy",
    icon: <FaShieldAlt className="text-sky-400 text-xl mr-3" />,
  },
  {
    name: "Terms & Condition",
    path: "/terms",
    icon: <FaFileAlt className="text-sky-400 text-xl mr-3" />,
  },
  {
    name: "About Us",
    path: "/about",
    icon: <FaInfoCircle className="text-sky-400 text-xl mr-3" />,
  },
  {
    name: "Delete Account",
    path: "/delete-account",
    icon: <FaUserTimes className="text-sky-400 text-xl mr-3" />,
  },
  {
    name: "Logout",
    path: "/logout",
    icon: <FaSignOutAlt className="text-sky-400 text-xl mr-3" />,
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      dispatch(api.util.resetApiState());
      navigate("/auth/login", { replace: true });
    }
  };

  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen p-6 flex flex-col items-center relative">
      {/* branding */}
      <div className="mb-10">
        <img
          src={logo}
          alt="Kolderkid Universe"
          className="size-40 mx-auto"
          draggable="false"
        />
        {/* <div className="text-center font-bold text-lg mt-2">
          KOLDERKID
          <br />
          UNIVERSE
        </div> */}
      </div>
      <div className="flex-1 w-full overflow-y-auto">
        <nav className="w-full">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                {item.name === "Logout" ? (
                  <a
                    href="#logout"
                    onClick={handleLogout}
                    className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-300 ease-in-out border-l-4  ${
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
                      className: `text-xl mr-3 transition-all duration-300 ease-in-out ${
                        location.pathname === item.path
                          ? "text-sky-600"
                          : "text-sky-400"
                      }`,
                    })}
                    <span>{item.name}</span>
                    <FaSignOutAlt className="ml-auto text-sky-400 text-lg" />
                  </a>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-300 ease-in-out border-l-4  ${
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
                      className: `text-xl mr-3 transition-all duration-300 ease-in-out ${
                        location.pathname === item.path
                          ? "text-sky-600"
                          : "text-sky-400"
                      }`,
                    })}
                    <span>{item.name}</span>
                    {item.name === "Logout" && (
                      <FaSignOutAlt className="ml-auto text-sky-400 text-lg" />
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="w-full absolute bottom-0  flex flex-col items-center">
        <ProfileSidebarSection />
      </div>
    </aside>
  );
};

export default Sidebar;
