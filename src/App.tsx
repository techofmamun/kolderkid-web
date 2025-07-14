import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AuthContainer from "./pages/AuthContainer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Auth guard for protected routes
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }
  return <>{children}</>;
};

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
        {/* Main app routes */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <div className="flex min-h-screen bg-gradient-to-b from-sky-100 via-white to-sky-200">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Navbar />
                  <main className="flex-1 p-4">
                    <Home />
                  </main>
                </div>
              </div>
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
