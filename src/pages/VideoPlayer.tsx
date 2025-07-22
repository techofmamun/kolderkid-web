import React, { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetVideosQuery, useGetMediaDetailsQuery } from "../services/api";
import type { MediaItem } from "../services/api";
import RelatedCard from "../components/RelatedCard";

const VideoPlayer: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  // Reuse getAudioDetailsQuery for video details with filter=2
  const { data: video, isLoading } = useGetMediaDetailsQuery({
    filter: 2,
    id: Number(id),
  });
  const { data: related = [], isLoading: relatedLoading } = useGetVideosQuery({
    page: 1,
  });

  if (isLoading) {
    return (
      <div className="text-center py-20 text-xl text-sky-700">Loading...</div>
    );
  }
  if (!video) {
    return (
      <div className="text-center py-20 text-xl text-sky-700">
        Video not found.
      </div>
    );
  }

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-neutral-900 via-sky-950 to-neutral-800 text-white p-4">
      <div className="w-full max-w-2xl mx-auto">
        <button
          className="mb-4 text-white text-2xl hover:text-sky-400 transition"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          ←
        </button>
        <div className="rounded-3xl overflow-hidden mb-6 shadow-xl bg-white/10 backdrop-blur-lg border border-white/20">
          <video
            ref={videoRef}
            src={video.file}
            poster={video.thumbnail}
            controls
            className="w-full h-96 object-cover bg-black"
          />
        </div>
        <h2 className="text-3xl font-bold text-center mb-2 drop-shadow-lg">
          {video.display_title}
        </h2>
        <p className="text-center text-gray-300 mb-6 text-lg">
          {video.description}
        </p>
        <div className="flex items-center justify-center gap-8 mt-6">
          <button
            onClick={handlePlayPause}
            className="bg-sky-500 rounded-full p-4 shadow-2xl hover:bg-sky-600 transition"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                <rect x="6" y="5" width="4" height="14" />
                <rect x="14" y="5" width="4" height="14" />
              </svg>
            ) : (
              <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {/* Related Section */}
      <div className="w-full max-w-3xl mx-auto mt-12">
        <h3 className="text-xl font-bold mb-4 text-sky-400">Related Videos</h3>
        {relatedLoading ? (
          <div className="text-center text-sky-400">Loading...</div>
        ) : related.length === 0 ? (
          <div className="text-center text-gray-400">
            No related videos found.
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-2 hide-scrollbar">
            {related.map((item: MediaItem) => (
              <RelatedCard key={item.id} track={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
