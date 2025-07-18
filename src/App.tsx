import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";
import About from "./pages/About";
import AuthContainer from "./pages/AuthContainer";
import Cart from "./pages/Cart";
import DeleteAccount from "./pages/DeleteAccount";
import Downloads from "./pages/Downloads";
import Favourites from "./pages/Favourites";
import History from "./pages/History";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Terms from "./pages/Terms";
import AudioPlayer from "./pages/AudioPlayer";

// Auth guard for protected routes
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }
  return <>{children}</>;
};

// Protected layout for authenticated routes
const ProtectedLayout: React.FC = () => (
  <RequireAuth>
    <div className="flex min-h-screen bg-gradient-to-b from-sky-100 via-white to-sky-200">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto h-screen">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  </RequireAuth>
);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Auth routes with onboarding slider */}
        <Route path="/auth" element={<AuthContainer />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Route>
        {/* Protected layout route */}
        <Route element={<ProtectedLayout />}>
          <Route index element={<Home />} />
          <Route path="music/:id" element={<AudioPlayer />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cart" element={<Cart />} />
          <Route path="history" element={<History />} />
          <Route path="favourites" element={<Favourites />} />
          <Route path="downloads" element={<Downloads />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="about" element={<About />} />
          <Route path="delete-account" element={<DeleteAccount />} />
          <Route path="logout" element={<Logout />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
