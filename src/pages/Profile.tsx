
import React from "react";
import { useGetProfileQuery } from "../services/api";
import PageContainer from "../components/PageContainer";

const Profile: React.FC = () => {
  const { data: profile, isLoading } = useGetProfileQuery();

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
        </div>
      ) : (
        <div className="text-gray-400 text-center mt-32">Profile not found.</div>
      )}
    </PageContainer>
  );
};

export default Profile;
