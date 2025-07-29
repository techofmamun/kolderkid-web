import { FaFileAlt, FaInfoCircle, FaShieldAlt } from "react-icons/fa";
import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <footer className="py-4 bg-white/20 backdrop-blur-sm shadow-md flex justify-center items-center gap-4 flex-wrap">
      <Link
        to="/privacy-policy"
        className="text-sky-500 font-medium hover:underline flex items-center"
      >
        <FaShieldAlt className="text-sky-400 text-xl mr-3" />
        Privacy Policy
      </Link>
      <Link
        to="/terms"
        className="text-sky-500 font-medium hover:underline flex items-center"
      >
        <FaFileAlt className="text-sky-400 text-xl mr-3" />
        Terms & Conditions
      </Link>
      <Link
        to="/about"
        className="text-sky-500 font-medium hover:underline flex items-center"
      >
        <FaInfoCircle className="text-sky-400 text-xl mr-3" />
        About Us
      </Link>
      <p className="text-gray-500">
        &copy; {new Date().getFullYear()} KolderKid. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
