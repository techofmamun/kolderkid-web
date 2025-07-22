import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RelatedCard from "../components/RelatedCard";
import {
  useDownloadAudioMutation,
  useGetMediaDetailsQuery,
  useGetPodcastsQuery,
  useLikeAudioMutation
} from "../services/api";

const PodcastPlayer: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeAudio] = useLikeAudioMutation();
  const [downloadAudio] = useDownloadAudioMutation();
  // Fetch audio details from API
  const { data: track, isLoading } = useGetMediaDetailsQuery({
    filter: 1,
    id: Number(id),
  });
  // Fetch related audios (using podcasts query)
  const { data: related = [], isLoading: relatedLoading } = useGetPodcastsQuery({
    page: 1,
  });

  useEffect(() => {
    if (!track) return;
    setLiked(track.favourite || false);
  }, [track]);

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [track]);

  useEffect(() => {
    if (!track?.subscription && isPlaying && currentTime >= 15) {
      audioRef.current?.pause();
      setIsPlaying(false);
      setShowAlert(true);
    }
  }, [currentTime, isPlaying, track]);

  if (isLoading) {
    return (
      <div className="text-center py-20 text-xl text-sky-700">Loading...</div>
    );
  }
  if (!track) {
    return (
      <div className="text-center py-20 text-xl text-sky-700">
        Track not found.
      </div>
    );
  }

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSkip = (sec: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        0,
        Math.min(duration, audioRef.current.currentTime + sec)
      );
    }
  };

  const handleLike = async () => {
    setLiked((l) => !l);
    try {
      await likeAudio({ filter: 1, id: track.id });
    } catch {
      setLiked((l) => !l); // Revert like state on error
      console.error("Like failed");
    }
  };

  const handleDownload = async () => {
    try {
      const res = await downloadAudio({ id: track.id }).unwrap();
      if (res.status) {
        window.open(track.file, "_blank");
      }
    } catch {
      console.error("Download failed");
    }
  };

  const handleShare = () => {
    navigator.share?.({
      title: track.display_title,
      text: `Listen to this track: ${track.display_title}`,
      url: window.location.href,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-neutral-900 via-sky-950 to-neutral-800 text-white p-4">
      <div className="w-full max-w-md mx-auto">
        <button
          className="mb-4 text-white text-2xl hover:text-sky-400 transition"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          ←
        </button>
        <div className="rounded-3xl overflow-hidden mb-6 shadow-xl bg-white/10 backdrop-blur-lg border border-white/20">
          <img
            src={track.thumbnail}
            alt={track.display_title}
            className="w-full h-64 object-cover"
          />
        </div>
        <h2 className="text-3xl font-bold text-center mb-2 drop-shadow-lg">
          {track.display_title}
        </h2>
        <p className="text-center text-gray-300 mb-6 text-lg">
          {track.description}
        </p>
        <audio
          ref={audioRef}
          src={track.file}
          preload="metadata"
          className="w-full"
        />
        <div className="flex items-center justify-between w-full mb-2 mt-4">
          <span className="text-sm text-gray-400">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={(e) => {
              const val = Number(e.target.value);
              setCurrentTime(val);
              if (audioRef.current) audioRef.current.currentTime = val;
            }}
            className="flex-1 mx-2 accent-sky-500"
          />
          <span className="text-sm text-gray-400">{formatTime(duration)}</span>
        </div>
        <div className="flex items-center justify-center gap-8 mt-6">
          <button
            onClick={() => handleSkip(-10)}
            aria-label="Back 10s"
            className="hover:scale-110 transition"
          >
            <svg
              width="32"
              height="32"
              fill="none"
              stroke="white"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            <span className="block text-xs mt-1">10</span>
          </button>
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
          <button
            onClick={() => handleSkip(10)}
            aria-label="Forward 10s"
            className="hover:scale-110 transition"
          >
            <svg
              width="32"
              height="32"
              fill="none"
              stroke="white"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
            <span className="block text-xs mt-1">10</span>
          </button>
        </div>
        <div className="flex items-center justify-center gap-8 mt-8">
          <button
            onClick={handleShare}
            aria-label="Share"
            className="hover:text-sky-400 transition"
          >
            <svg
              width="28"
              height="28"
              fill="none"
              stroke="white"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7" />
              <path d="M16 6l-4-4-4 4" />
              <path d="M12 2v14" />
            </svg>
          </button>
          <button
            onClick={handleDownload}
            aria-label="Download"
            className="hover:text-sky-400 transition"
          >
            <svg
              width="28"
              height="28"
              fill="none"
              stroke="white"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 5v14" />
              <path d="M19 12l-7 7-7-7" />
            </svg>
          </button>
          <button
            onClick={handleLike}
            aria-label="Favourite"
            className="hover:scale-110 transition"
          >
            <svg
              width="28"
              height="28"
              fill={liked ? "#ef4444" : "none"}
              stroke="white"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>
        {showAlert && (
          <div className="mt-8 p-4 bg-sky-900/80 text-white rounded-2xl text-center shadow-xl">
            You can only listen to 15 seconds of this audio.
            <br />
            Subscribe for full access.
            <button
              className="mt-4 px-4 py-2 bg-sky-500 rounded text-white font-bold hover:bg-sky-600 transition"
              onClick={() => setShowAlert(false)}
            >
              OK
            </button>
          </div>
        )}
      </div>
      {/* Related Section */}
      <div className="w-full max-w-3xl mx-auto mt-12">
        <h3 className="text-xl font-bold mb-4 text-sky-400">Related Tracks</h3>
        {relatedLoading ? (
          <div className="text-center text-sky-400">Loading...</div>
        ) : related.length === 0 ? (
          <div className="text-center text-gray-400">
            No related tracks found.
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-2 hide-scrollbar">
            {related.map((item) => (
              <RelatedCard key={item.id} track={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export default PodcastPlayer;
