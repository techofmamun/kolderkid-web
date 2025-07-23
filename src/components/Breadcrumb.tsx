import React from "react";
import { Link, useLocation } from "react-router-dom";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const isHome = pathnames.length === 0;
  if (isHome) return null;
  return (
    <nav
      className="flex items-center gap-2 text-sm mb-4 ml-4 mt-4 backdrop-blur-sm bg-transparent"
      aria-label="Breadcrumb"
    >
      <Link to="/" className="text-sky-700 hover:underline font-semibold">
        ← Home
      </Link>
      {pathnames.map((value, idx) => {
        const to = `/${pathnames.slice(0, idx + 1).join("/")}`;
        const isLast = idx === pathnames.length - 1;
        return isLast ? (
          <span key={to} className="text-gray-500">
            / {capitalize(decodeURIComponent(value))}
          </span>
        ) : (
          <span key={to}>
            <span className="mx-1 text-gray-400">/</span>
            <Link to={to} className="text-sky-700 hover:underline">
              {capitalize(decodeURIComponent(value))}
            </Link>
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
