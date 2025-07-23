import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
import { useParams } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import RelatedCard from "../components/RelatedCard";
import {
  useDownloadAudioMutation,
  useGetMediaDetailsQuery,
  useGetMusicQuery,
  useLikeAudioMutation,
  useSubscribeMutation,
} from "../services/api";

const AudioPlayer: React.FC = () => {
  const { id } = useParams();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [buying, setBuying] = useState(false);
  const [, setShowBuySuccess] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeAudio] = useLikeAudioMutation();
  const [downloadAudio] = useDownloadAudioMutation();
  const [buy] = useSubscribeMutation();
  // Fetch audio details from API
  const { data: track, isLoading } = useGetMediaDetailsQuery({
    filter: 1,
    id: Number(id),
  });
  // Fetch related audios (using music query)
  const { data: related = [], isLoading: relatedLoading } = useGetMusicQuery({
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
          <button
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
          </button>
          <button
            onClick={async () => {
              setLiked((l) => !l);
              try {
                if (track) await likeAudio({ filter: 1, id: track.id });
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
              stroke="black"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>
        {/* Buy Now Button (only if not subscribed) */}
        {!track?.subscription && (
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
                    product_id: track.id,
                    type_of_item: 1,
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
              <svg width="48" height="48" fill="#22c55e" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="#22c55e" opacity="0.15" />
                <path
                  d="M8 12.5l2.5 2.5L16 9"
                  stroke="#22c55e"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              <div className="text-2xl font-bold text-emerald-600 mt-4 mb-2">
                Success!
              </div>
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
      <div className="w-full mt-12">
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
    </PageContainer>
  );
};

function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export default AudioPlayer;
