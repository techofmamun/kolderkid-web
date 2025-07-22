function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetVideosQuery,
  useGetMediaDetailsQuery,
  useLikeAudioMutation,
  useDownloadAudioMutation,
  useSubscribeMutation,
} from "../services/api";
import type { MediaItem } from "../services/api";
import RelatedCard from "../components/RelatedCard";

const VideoPlayer: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [liked, setLiked] = useState(false);
  // Reuse getAudioDetailsQuery for video details with filter=2
  const { data: video, isLoading } = useGetMediaDetailsQuery({
    filter: 2,
    id: Number(id),
  });
  const [likeVideo] = useLikeAudioMutation();
  const [downloadVideo] = useDownloadAudioMutation();
  const [buy] = useSubscribeMutation();
  const [buying, setBuying] = useState(false);
  const [showBuySuccess, setShowBuySuccess] = useState(false);
  useEffect(() => {
    if (!video) return;
    setLiked(video.favourite || false);
  }, [video]);

  useEffect(() => {
    if (!videoRef.current) return;
    const vid = videoRef.current;
    const updateTime = () => setCurrentTime(vid.currentTime);
    const updateDuration = () => setDuration(vid.duration);
    vid.addEventListener("timeupdate", updateTime);
    vid.addEventListener("loadedmetadata", updateDuration);
    return () => {
      vid.removeEventListener("timeupdate", updateTime);
      vid.removeEventListener("loadedmetadata", updateDuration);
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
          } else if ((document as Document & { webkitExitFullscreen?: () => void }).webkitExitFullscreen) {
            (document as Document & { webkitExitFullscreen: () => void }).webkitExitFullscreen();
          } else if ((document as Document & { msExitFullscreen?: () => void }).msExitFullscreen) {
            (document as Document & { msExitFullscreen: () => void }).msExitFullscreen();
          }
        }
        setIsPlaying(false);
        setShowAlert(true);
      }
    };
    vid.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      vid.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [video?.subscription, videoRef]);
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

  const handleSkip = (sec: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        Math.min(duration, videoRef.current.currentTime + sec)
      );
    }
  };

  // Like logic handled inline in button below

  const handleDownload = async () => {
    try {
      const res = await downloadVideo({ id: video.id }).unwrap();
      if (res.status) {
        window.open(video.file, "_blank");
      }
    } catch {
      console.error("Download failed");
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
            className="w-full h-96 object-cover bg-black"
            autoPlay
            onDoubleClick={() => {
              const vid = videoRef.current;
              if (vid) {
                if (vid.requestFullscreen) {
                  vid.requestFullscreen();
                } else if ((vid as HTMLVideoElement & { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen) {
                  (vid as HTMLVideoElement & { webkitRequestFullscreen: () => void }).webkitRequestFullscreen();
                } else if ((vid as HTMLVideoElement & { msRequestFullscreen?: () => void }).msRequestFullscreen) {
                  (vid as HTMLVideoElement & { msRequestFullscreen: () => void }).msRequestFullscreen();
                }
              }
            }}
          />
        </div>
        <h2 className="text-3xl font-bold text-center mb-2 drop-shadow-lg">
          {video.display_title}
        </h2>
        <p className="text-center text-gray-300 mb-6 text-lg">
          {video.description}
        </p>
        <div className="flex items-center justify-between w-full mb-2 mt-4">
          <span className="text-sm text-gray-400">{formatTime(currentTime)}</span>
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
            onClick={async () => {
              setLiked((l) => !l);
              try {
                if (video) await likeVideo({ filter: 2, id: video.id });
              } catch {
                setLiked((l) => !l); // Revert like state on error
                console.error("Like failed");
              }
            }}
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
        {/* Buy Now Button (only if not subscribed) */}
        {!video?.subscription && (
          <div className="flex items-center justify-center mt-8">
            <button
              className="px-8 py-3 rounded-full font-bold text-white relative overflow-hidden shadow-2xl transition disabled:opacity-60 backdrop-blur-xl border border-white/30"
              style={{
                background: "linear-gradient(90deg, #38bdf8 0%, #0ea5e9 100%)", // sky-400 to sky-500
                boxShadow: "0 8px 32px 0 rgba(14,165,233,0.15)",
                border: "1.5px solid rgba(255,255,255,0.25)",
                position: "relative",
                zIndex: 1,
              }}
              disabled={buying}
              onClick={async () => {
                setBuying(true);
                try {
                  const res = await buy({
                    product_id: video.id,
                    type_of_item: 2,
                  }).unwrap();
                  if (res.status && res.data?.payment_url) {
                    window.open(res.data.payment_url, "_blank");
                    setShowBuySuccess(true);
                  }
                } catch {
                  alert("Purchase failed. Please try again.");
                } finally {
                  setBuying(false);
                }
              }}
            >
              <span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(120deg, #fff 0%, #a7f3d0 100%)",
                  opacity: 0.18,
                  filter: "blur(8px)",
                  zIndex: 0,
                }}
              ></span>
              <span className="relative z-10 flex items-center gap-2">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <rect
                    x="2"
                    y="7"
                    width="20"
                    height="13"
                    rx="3"
                    fill="#fff"
                    fillOpacity="0.15"
                  />
                  <rect
                    x="2"
                    y="7"
                    width="20"
                    height="13"
                    rx="3"
                    stroke="#fff"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M7 11h10M7 15h6"
                    stroke="#fff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                {buying ? "Processing..." : "Subscribe Now"}
              </span>
            </button>
          </div>
        )}
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
