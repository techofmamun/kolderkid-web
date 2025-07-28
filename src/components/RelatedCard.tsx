import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export interface RelatedTrack {
  id: number;
  display_title: string;
  thumbnail: string;
  description?: string;
  file?: string;
  fileType?: string;
}

const RelatedCard: React.FC<{ track: RelatedTrack }> = ({ track }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isNowPlaying =
    (track.fileType === "video" &&
      location.pathname === `/videos/${track.id}`) ||
    (track.fileType !== "video" && location.pathname === `/musics/${track.id}`);

  return (
    <div
      className="w-[200px]  rounded-2xl shadow-lg p-3 flex flex-col items-center hover:scale-105 transition relative border border-sky-200/40 backdrop-blur-sm bg-white/50 cursor-pointer"
      onClick={() =>
        navigate(
          track.fileType === "video"
            ? `/videos/${track.id}`
            : `/musics/${track.id}`
        )
      }
      aria-label={track.display_title}
      role="button"
    >
      <img
        src={track.thumbnail}
        alt={track.display_title}
        className="w-full h-32 object-cover rounded-xl mb-2"
      />
      {isNowPlaying && (
        <span className="absolute top-2 right-2 bg-sky-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
          Now Playing
        </span>
      )}
      <h4 className="text-lg font-semibold text-gray-500 text-center mb-1 line-clamp-1">
        {track.display_title}
      </h4>
      {track.description && (
        <p className="text-xs text-gray-500 text-center line-clamp-2 mb-2">
          {track.description}
        </p>
      )}
    </div>
  );
};

export default RelatedCard;
