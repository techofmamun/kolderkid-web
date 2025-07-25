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
import FavouritesList from "./pages/FavouritesList";
import History from "./pages/History";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Terms from "./pages/Terms";
import AudioPlayer from "./pages/AudioPlayer";
import VideoPlayer from "./pages/VideoPlayer";
import ApparelDetails from "./pages/ApparelDetails";
import MusicList from "./pages/MusicList";
import VideosList from "./pages/VideosList";
import PodcastsList from "./pages/PodcastsList";
import ApparelsList from "./pages/ApparelsList";
import PodcastPlayer from "./pages/PodcastPlayer";
import Breadcrumb from "./components/Breadcrumb";

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
    <div className="flex min-h-screen bg-gradient-to-b from-sky-100 via-white to-sky-200 ">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto h-screen">
        <Breadcrumb />
        <main className="flex-1 h-full overflow-auto ">
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
          <Route path="musics" element={<MusicList />} />
          <Route path="musics/:id" element={<AudioPlayer />} />
          <Route path="videos" element={<VideosList />} />
          <Route path="videos/:id" element={<VideoPlayer />} />
          <Route path="podcasts" element={<PodcastsList />} />
          <Route path="podcasts/:id" element={<PodcastPlayer />} />
          <Route path="apparels" element={<ApparelsList />} />
          <Route path="apparels/:id" element={<ApparelDetails />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cart" element={<Cart />} />
          <Route path="history" element={<History />} />
          <Route path="favourites" element={<FavouritesList />} />
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
