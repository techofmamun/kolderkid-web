import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks";
import { api } from "../services/api";
import logo from "/assets/images/kolderkid-logo.png";
// import ProfileSidebarSection from "./ProfileSidebarSection";
import {
  FaUserCircle,
  FaShoppingBag,
  FaHistory,
  FaHeart,
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
  // {
  //   name: "Downloads",
  //   path: "/downloads",
  //   icon: <FaDownload className="text-sky-400 text-xl mr-3" />,
  // },
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

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(true);

  // Optionally, close sidebar on route change if desired
  // React.useEffect(() => {
  //   setOpen(false);
  // }, [location.pathname]);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      dispatch(api.util.resetApiState());
      navigate("/auth/login", { replace: true });
    }
  };

  return (
    <div
      className={`flex flex-col h-full transition-all duration-300 ${
        open ? "w-64" : "w-20"
      } shadow-lg min-h-screen items-center relative backdrop-blur-sm`}
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
                  {item.name === "Logout" ? (
                    <a
                      href="#logout"
                      onClick={handleLogout}
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
                      {open && (
                        <FaSignOutAlt className="ml-auto text-sky-400 text-lg" />
                      )}
                    </a>
                  ) : (
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
                      {open && item.name === "Logout" && (
                        <FaSignOutAlt className="ml-auto text-sky-400 text-lg" />
                      )}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      {/* <div className="w-full flex flex-col items-center px-2 pb-2 box-border">
        {open && <ProfileSidebarSection />}
      </div> */}
      {/* Toggle button: top right when expanded, top center when collapsed */}
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
  );
};
export default Sidebar;
