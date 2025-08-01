function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import RelatedSection from "../components/RelatedCard";
import SubscribeNowButton from "../components/SubscribeNowButton";
import { useGetItemsQuery, useGetMediaDetailsQuery } from "../services/api";
import LikeButton from "./LikeButton";

const VideoPlayer: React.FC = () => {
  const { id } = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  // Reuse getAudioDetailsQuery for video details with filter=2
  const {
    data: video,
    isLoading,
    refetch,
  } = useGetMediaDetailsQuery({
    filter: 2,
    id: Number(id),
  });
  const [isPlayerLoading, setIsPlayerLoading] = useState(true);

  useEffect(() => {
    if (!videoRef.current) return;
    const vid = videoRef.current;
    const updateTime = () => setCurrentTime(vid.currentTime);
    const updateDuration = () => setDuration(vid.duration);
    const handleLoadedData = () => setIsPlayerLoading(false);
    setIsPlayerLoading(true);

    vid.addEventListener("timeupdate", updateTime);
    vid.addEventListener("loadedmetadata", updateDuration);
    vid.addEventListener("loadeddata", handleLoadedData);
    return () => {
      vid.removeEventListener("timeupdate", updateTime);
      vid.removeEventListener("loadedmetadata", updateDuration);
      vid.removeEventListener("loadeddata", handleLoadedData);
      // Pause video on unmount
      vid.pause();
    };
  }, [video]);

  // Enforce 15s limit even if play is triggered by browser or user in fullscreen
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || video?.subscription) return;
    const handleTimeUpdate = () => {
      if (vid.currentTime >= 15) {
        vid.pause();
        // Exit fullscreen if in fullscreen mode
        if (document.fullscreenElement === vid) {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (
            (document as Document & { webkitExitFullscreen?: () => void })
              .webkitExitFullscreen
          ) {
            (
              document as Document & { webkitExitFullscreen: () => void }
            ).webkitExitFullscreen();
          } else if (
            (document as Document & { msExitFullscreen?: () => void })
              .msExitFullscreen
          ) {
            (
              document as Document & { msExitFullscreen: () => void }
            ).msExitFullscreen();
          }
        }
        setIsPlaying(false);
        setShowAlert(true);
      }
    };
    vid.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      vid.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [video?.subscription, videoRef]);
  const { data, isLoading: relatedLoading } = useGetItemsQuery({
    page: 1,
    filter: 2,
  });
  const related = data?.data || [];

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

  const handleSkip = (sec: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        Math.min(duration, videoRef.current.currentTime + sec)
      );
    }
  };

  const handleShare = () => {
    navigator.share?.({
      title: video.display_title,
      text: `Watch this video: ${video.display_title}`,
      url: window.location.href,
    });
  };

  return (
    <PageContainer>
      <div className="w-full max-w-2xl mx-auto">
        <div className="rounded-3xl overflow-hidden mb-6 shadow-xl bg-white/10 backdrop-blur-lg border border-white/20">
          <video
            ref={videoRef}
            src={video.file}
            poster={video.thumbnail}
            className="w-full h-96 object-cover bg-black"
            autoPlay
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onDoubleClick={() => {
              const vid = videoRef.current;
              if (vid) {
                if (vid.requestFullscreen) {
                  vid.requestFullscreen();
                } else if (
                  (
                    vid as HTMLVideoElement & {
                      webkitRequestFullscreen?: () => void;
                    }
                  ).webkitRequestFullscreen
                ) {
                  (
                    vid as HTMLVideoElement & {
                      webkitRequestFullscreen: () => void;
                    }
                  ).webkitRequestFullscreen();
                } else if (
                  (
                    vid as HTMLVideoElement & {
                      msRequestFullscreen?: () => void;
                    }
                  ).msRequestFullscreen
                ) {
                  (
                    vid as HTMLVideoElement & {
                      msRequestFullscreen: () => void;
                    }
                  ).msRequestFullscreen();
                }
              }
            }}
          />
        </div>
        <h2 className="text-3xl font-bold text-center mb-2 drop-shadow-lg text-sky-700">
          {video.display_title}
        </h2>
        <p className="text-center text-gray-500 mb-6 text-lg">
          {video.description}
        </p>
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
              if (videoRef.current) videoRef.current.currentTime = val;
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
            className="bg-sky-500 rounded-full p-4 shadow-2xl hover:bg-sky-600 transition flex items-center justify-center"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlayerLoading ? (
              <svg
                className="animate-spin"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="white"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="#fff"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : isPlaying ? (
              <svg width="32" height="32" fill="black" viewBox="0 0 24 24">
                <rect x="6" y="5" width="4" height="14" />
                <rect x="14" y="5" width="4" height="14" />
              </svg>
            ) : (
              <svg width="32" height="32" fill="black" viewBox="0 0 24 24">
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
            type_of_item={video.category_id}
            item_id={video.id}
            isLiked={video.favourite || false}
            refetch={refetch}
          />
        </div>
        {/* Buy Now Button (only if not subscribed) */}
        {!video?.subscription && <SubscribeNowButton />}
        {/* Buy Success Modal */}
        {/* {showBuySuccess && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
            <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-xl">
              <svg width="48" height="48" fill="#22c55e" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#22c55e" opacity="0.15"/><path d="M8 12.5l2.5 2.5L16 9" stroke="#22c55e" strokeWidth="2" fill="none"/></svg>
              <div className="text-2xl font-bold text-emerald-600 mt-4 mb-2">Success!</div>
              <div className="text-gray-700 mb-4">Thanks for buying.</div>
              <button
                className="px-6 py-2 rounded-full bg-sky-500 text-white font-bold shadow hover:bg-sky-600 transition"
                onClick={() => {
                  setShowBuySuccess(false);
                  window.location.reload();
                }}
              >
                Continue
              </button>
            </div>
          </div>
        )} */}
        {showAlert && (
          <div className="mt-8 p-4 bg-sky-900/80 text-white rounded-2xl text-center shadow-xl">
            You can only watch 15 seconds of this video.
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
        title={"Related Videos"}
      />
    </PageContainer>
  );
};

export default VideoPlayer;
