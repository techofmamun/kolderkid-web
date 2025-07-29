import React from "react";
import { api, useGetProfileQuery } from "../services/api";
import PageContainer from "../components/PageContainer";
import { logout } from "../features/authSlice";
import { useAppDispatch } from "../hooks";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

const Profile: React.FC = () => {
  const { data: profile, isLoading } = useGetProfileQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to logout?")) {
      dispatch(logout());
      dispatch(api.util.resetApiState());
      navigate("/auth/login", { replace: true });
    }
  };
  return (
    <PageContainer>
      {isLoading ? (
        <div className="text-sky-700 text-center">Loading...</div>
      ) : profile ? (
        <div className="flex flex-col items-center gap-4">
          <img
            src={profile.profile_image}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-sky-200 shadow"
          />
          <div className="text-xl font-semibold text-sky-800">
            {profile.firstname} {profile.lastname}
          </div>
          {profile.email && (
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-bold">Email:</span> {profile.email}
            </div>
          )}
          {profile.phone && (
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-bold">Phone:</span> {profile.phone}
            </div>
          )}
          {profile.address && (
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-bold">Address:</span> {profile.address}
            </div>
          )}
          {profile.about_you && (
            <div className="flex flex-col items-center text-gray-700">
              <span className="font-bold">About:</span>
              <span className="text-center">{profile.about_you}</span>
            </div>
          )}
          <div className="flex gap-4 mt-6 items-center justify-center">
            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center px-2 py-1 text-gray-500 cursor-pointer hover:text-sky-600 transition hover:scale-105"
              style={{ minWidth: 48 }}
            >
              <FaSignOutAlt className="text-2xl mb-0 text-sky-400" />
              <span className="text-xs mt-1">Logout</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-gray-400 text-center mt-32">
          Profile not found.
        </div>
      )}
    </PageContainer>
  );
};

export default Profile;
