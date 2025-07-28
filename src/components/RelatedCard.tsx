import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export interface RelatedTrack {
  id: number;
  display_title: string;
  thumbnail: string;
  description?: string;
  file?: string;
  fileType?: string;
  category_id?: number;
}

const RelatedCard: React.FC<{ track: RelatedTrack }> = ({ track }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isNowPlaying =
    (track.fileType === "video" &&
      location.pathname === `/videos/${track.id}`) ||
    (track.fileType !== "video" && location.pathname === `/musics/${track.id}`);
  const handleClick = () => {
    switch (track.category_id) {
      case 1:
        navigate(`/misics/${track.id}`);
        break;
      case 2:
        navigate(`/videos/${track.id}`);
        break;
      case 3:
        navigate(`/podcasts/${track.id}`);
        break;
      case 4:
        navigate(`/apparels/${track.id}`);
        break;
      default:
        navigate(`/other/${track.id}`);
    }
  };
  return (
    <div
      className="min-w-[200px] max-w-[300px] rounded-2xl shadow-lg p-3 flex flex-col items-center hover:scale-105 transition relative border border-sky-200/40 backdrop-blur-sm bg-white/50 cursor-pointer"
      onClick={handleClick}
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
const RelatedSection = ({
  related,
  relatedLoading,
  title = "Related Tracks",
}: {
  related: RelatedTrack[];
  relatedLoading: boolean;
  title?: string;
}) => {
  return (
    <div className="w-full mt-12">
      <h3 className="text-xl font-bold mb-4 text-sky-400">{title}</h3>
      {relatedLoading ? (
        <div className="text-center text-sky-400">Loading...</div>
      ) : related.length === 0 ? (
        <div className="text-center text-gray-400">Not available now.</div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-2 hide-scrollbar">
          {related.map((item) => (
            <RelatedCard key={item.id} track={item} />
          ))}
        </div>
      )}
    </div>
  );
};
export default RelatedSection;
