import React from "react";
import { useSelector } from "react-redux";
import {
  Navigate,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Breadcrumb from "./components/Breadcrumb";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import About from "./pages/About";
import ApparelDetails from "./pages/ApparelDetails";
import ApparelsList from "./pages/ApparelsList";
import AudioPlayer from "./pages/AudioPlayer";
import AuthContainer from "./pages/AuthContainer";
import Cart from "./pages/Cart";
import FavouritesList from "./pages/FavouritesList";
import History from "./pages/History";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MusicList from "./pages/MusicList";
import PodcastPlayer from "./pages/PodcastPlayer";
import PodcastsList from "./pages/PodcastsList";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Terms from "./pages/Terms";
import VideoPlayer from "./pages/VideoPlayer";
import VideosList from "./pages/VideosList";
import { type RootState } from "./store";

// Auth guard for protected routes using Redux state
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useSelector((state: RootState) => state.auth.token);
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
        <main className="flex-1 h-full overflow-auto pb-[70px] sm:pb-0">
          <div className="min-h-screen">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  </RequireAuth>
);
const PublicLayout: React.FC = () => (
  <div className="flex min-h-screen bg-gradient-to-b from-sky-100 via-white to-sky-200">
    <main className="flex-1 h-full overflow-auto">
      <Outlet />
      <Footer />
    </main>
  </div>
);

const App: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  return (
    <Router>
      {token ? (
        <Routes>
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Home />} />
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
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="about" element={<About />} />
            <Route
              path="*"
              element={
                <div className="p-4 text-center text-gray-500">
                  Page not found
                </div>
              }
            />
          </Route>
        </Routes>
      ) : (
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthContainer />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="terms" element={<Terms />} />
              <Route path="about" element={<About />} />
            </Route>
          </Route>
          <Route
            path="*"
            element={<Navigate to={token ? "/" : "/auth/login"} replace />}
          />
        </Routes>
      )}
    </Router>
  );
};

export default App;
