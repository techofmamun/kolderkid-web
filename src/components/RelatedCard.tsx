import React from "react";
import { useNavigate } from "react-router-dom";

export interface RelatedTrack {
  id: number;
  display_title: string;
  thumbnail: string;
  description?: string;
  file?: string;
}

const RelatedCard: React.FC<{ track: RelatedTrack }> = ({ track }) => {
  const navigate = useNavigate();

  return (
    <div className="min-w-[200px] bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg p-3 flex flex-col items-center hover:scale-105 transition">
      <img
        src={track.thumbnail}
        alt={track.display_title}
        className="w-full h-32 object-cover rounded-xl mb-2"
      />
      <h4 className="text-lg font-semibold text-white text-center mb-1 line-clamp-1">{track.display_title}</h4>
      {track.description && (
        <p className="text-xs text-gray-300 text-center line-clamp-2 mb-2">{track.description}</p>
      )}
      <button
        onClick={() => navigate(`/music/${track.id}`)}
        className="mt-auto px-3 py-1 bg-sky-500 rounded text-white text-xs font-bold hover:bg-sky-600 transition"
      >
        Listen
      </button>
    </div>
  );
};

export default RelatedCard;
