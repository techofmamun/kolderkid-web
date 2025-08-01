import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
import { useParams } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import RelatedSection from "../components/RelatedCard";
import SubscribeNowButton from "../components/SubscribeNowButton";
import { useGetItemsQuery, useGetMediaDetailsQuery } from "../services/api";
import LikeButton from "./LikeButton";

const AudioPlayer: React.FC = () => {
  const { id } = useParams();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  // Fetch audio details from API
  const {
    data: track,
    isLoading,
    refetch,
  } = useGetMediaDetailsQuery({
    filter: 1,
    id: Number(id),
  });
  // Fetch related audios (using music query)
  const { data, isLoading: relatedLoading } = useGetItemsQuery({
    page: 1,
    filter: 1,
  });
  const related = data?.data || [];

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
      // Pause audio on unmount
      audio.pause();
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

  const handleShare = () => {
    navigator.share?.({
      title: track.display_title,
      text: `Listen to this track: ${track.display_title}`,
      url: window.location.href,
    });
  };
  return (
    <PageContainer>
      <div className="w-full max-w-md mx-auto ">
        <div className="rounded-3xl overflow-hidden mb-6 shadow-xl bg-white/10 backdrop-blur-lg border border-white/20">
          <img
            src={track.thumbnail}
            alt={track.display_title}
            className="w-full h-64 object-cover"
          />
        </div>
        <h2 className="text-3xl font-bold text-center mb-2 drop-shadow-lg text-sky-700">
          {track.display_title}
        </h2>
        <p className="text-center mb-6 text-lg text-gray-500">
          {track.description}
        </p>
        <audio
          ref={audioRef}
          src={track.file}
          preload="metadata"
          className="w-full"
          autoPlay
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        <div className="flex items-center justify-between w-full mb-2 mt-4">
          <span className="text-sm text-gray-500">
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
          <span className="text-sm text-gray-500">{formatTime(duration)}</span>
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
              stroke="black"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            <span className="block text-xs mt-1 text-gray-500">10</span>
          </button>
          <button
            onClick={handlePlayPause}
            className="bg-sky-500 rounded-full p-4 shadow-2xl hover:bg-sky-600 transition"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg width="32" height="32" fill="black" viewBox="0 0 24 24">
                <rect x="6" y="5" width="4" height="14" />
                <rect x="14" y="5" width="4" height="14" />
              </svg>
            ) : (
              <svg width="32" height="32" fill="black " viewBox="0 0 24 24">
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
              stroke="black"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
            <span className="block text-xs mt-1 text-gray-500">10</span>
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
              stroke="black"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7" />
              <path d="M16 6l-4-4-4 4" />
              <path d="M12 2v14" />
            </svg>
          </button>
          {/* <button
            onClick={handleDownload}
            aria-label="Download"
            className="hover:text-sky-400 transition"
          >
            <svg
              width="28"
              height="28"
              fill="none"
              stroke="black"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 5v14" />
              <path d="M19 12l-7 7-7-7" />
            </svg>
          </button> */}
          <LikeButton
            type_of_item={track.category_id}
            item_id={track.id}
            isLiked={track.favourite || false}
            refetch={refetch}
          />
        </div>
        {/* Buy Now Button (only if not subscribed) */}
        {!track.subscription && <SubscribeNowButton />}
        {showAlert && (
          <div className="mt-8 p-4 bg-sky-900/80 text-white rounded-2xl text-center shadow-xl">
            You can only listen to 15 seconds of this audio.
            <br />
            Subscribe for full access.
            <button
              className="ml-2 mt-4 px-4 py-1 bg-sky-500 rounded text-white font-bold hover:bg-sky-600 transition"
              onClick={() => setShowAlert(false)}
            >
              OK
            </button>
          </div>
        )}
      </div>
      {/* Related Section */}
      <RelatedSection
        related={related}
        relatedLoading={relatedLoading}
        title={"Related Tracks"}
      />
    </PageContainer>
  );
};

function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export default AudioPlayer;
