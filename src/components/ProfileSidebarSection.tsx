import React from "react";
import { useGetProfileQuery } from "../services/api";

const ProfileSidebarSection: React.FC = () => {
  const { data: profile, isLoading } = useGetProfileQuery();
  return (
    <div className="w-full mt-auto flex flex-col items-center">
      {isLoading ? (
        <div className="text-sky-700 text-sm font-semibold">
          Loading Profile...
        </div>
      ) : profile ? (
        <div className="flex flex-col items-center w-full bg-sky-50 rounded-xl shadow p-4">
          <img
            src={profile.profile_image}
            alt="Avatar"
            className="w-14 h-14 rounded-full border-4 border-sky-400 mb-2 shadow"
          />
          <div className="text-base font-bold text-sky-900 text-center">
            {profile.firstname} {profile.lastname}
          </div>
          <div className="text-xs text-sky-600 text-center break-all">
            {profile.email}
          </div>
        </div>
      ) : (
        <div className="text-sky-700 text-sm font-semibold">No Profile</div>
      )}
    </div>
  );
};

export default ProfileSidebarSection;
