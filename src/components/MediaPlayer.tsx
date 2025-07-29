// import React, { useEffect, useRef, useState } from "react";
// import LikeButton from "../pages/LikeButton";

// interface MediaPlayerProps {
//   file: string;
//   fileType: "audio" | "video";
//   title: string;
//   description?: string;
//   thumbnail?: string;
//   isSubscribed?: boolean;
//   isFavourite?: boolean;
//   categoryId: number;
//   itemId: number;
//   refetch?: () => void;
// }

// const MediaPlayer: React.FC<MediaPlayerProps> = ({
//   file,
//   fileType,
//   title,
//   description,
//   thumbnail,
//   isSubscribed,
//   isFavourite,
//   categoryId,
//   itemId,
//   refetch,
// }) => {
//   const playerRef = useRef<HTMLAudioElement | HTMLVideoElement>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [showAlert, setShowAlert] = useState(false);
//   const [isPlayerLoading, setIsPlayerLoading] = useState(true);

//   useEffect(() => {
//     if (!playerRef.current) return;
//     const vid = playerRef.current;
//     const updateTime = () => setCurrentTime(vid.currentTime);
//     const updateDuration = () => setDuration(vid.duration);
//     const handleLoadedData = () => setIsPlayerLoading(false);
//     setIsPlayerLoading(true);
//     vid.addEventListener("timeupdate", updateTime);
//     vid.addEventListener("loadedmetadata", updateDuration);
//     vid.addEventListener("loadeddata", handleLoadedData);
//     return () => {
//       vid.removeEventListener("timeupdate", updateTime);
//       vid.removeEventListener("loadedmetadata", updateDuration);
//       vid.removeEventListener("loadeddata", handleLoadedData);
//       vid.pause();
//     };
//   }, [file]);

//   useEffect(() => {
//     if (!isSubscribed && isPlaying && currentTime >= 15) {
//       playerRef.current?.pause();
//       setIsPlaying(false);
//       setShowAlert(true);
//     }
//   }, [currentTime, isPlaying, isSubscribed]);

//   const handlePlayPause = () => {
//     if (!playerRef.current) return;
//     if (isPlaying) {
//       playerRef.current.pause();
//       setIsPlaying(false);
//     } else {
//       playerRef.current.play();
//       setIsPlaying(true);
//     }
//   };

//   const handleSkip = (sec: number) => {
//     if (playerRef.current) {
//       playerRef.current.currentTime = Math.max(
//         0,
//         Math.min(duration, playerRef.current.currentTime + sec)
//       );
//     }
//   };

//   const handleShare = () => {
//     navigator.share?.({
//       title,
//       text: `Listen to or watch: ${title}`,
//       url: window.location.href,
//     });
//   };

//   function formatTime(time: number) {
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
//   }

//   const CollapseAbleDescription = () => {
//     const [isCollapsed, setIsCollapsed] = useState(true);
//     const toggleCollapse = () => setIsCollapsed(!isCollapsed);
//     if (!description) return null;
//     return (
//       <div className="text-gray-600 text-sm">
//         <div
//           style={{
//             maxHeight: isCollapsed ? 60 : 1000,
//             overflow: "hidden",
//             transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
//           }}
//         >
//           <p className="transition-all duration-300 whitespace-pre-line">
//             {description}
//           </p>
//         </div>
//         <button
//           onClick={toggleCollapse}
//           className="text-sky-500 hover:underline mt-1"
//         >
//           {isCollapsed ? "Read more" : "Read less"}
//         </button>
//       </div>
//     );
//   };

//   return (
//     <div className="w-full max-w-2xl mx-auto">
//       <div className="rounded-3xl overflow-hidden mb-6 shadow-xl bg-white/10 backdrop-blur-lg border border-white/20">
//         {fileType === "video" ? (
//           <video
//             ref={playerRef as React.RefObject<HTMLVideoElement>}
//             src={file}
//             poster={thumbnail}
//             className="w-full h-96 object-cover bg-black"
//             autoPlay
//             onPlay={() => setIsPlaying(true)}
//             onPause={() => setIsPlaying(false)}
//             onDoubleClick={() => {
//               const vid = playerRef.current;
//               if (vid) {
//                 if (vid.requestFullscreen) {
//                   vid.requestFullscreen();
//                 } else if (
//                   (
//                     vid as HTMLVideoElement & {
//                       webkitRequestFullscreen?: () => void;
//                     }
//                   ).webkitRequestFullscreen
//                 ) {
//                   (
//                     vid as HTMLVideoElement & {
//                       webkitRequestFullscreen: () => void;
//                     }
//                   ).webkitRequestFullscreen();
//                 } else if (
//                   (
//                     vid as HTMLVideoElement & {
//                       msRequestFullscreen?: () => void;
//                     }
//                   ).msRequestFullscreen
//                 ) {
//                   (
//                     vid as HTMLVideoElement & {
//                       msRequestFullscreen: () => void;
//                     }
//                   ).msRequestFullscreen();
//                 }
//               }
//             }}
//           />
//         ) : (
//           <audio
//             ref={playerRef as React.RefObject<HTMLAudioElement>}
//             src={file}
//             preload="metadata"
//             className="w-full"
//             autoPlay
//             onPlay={() => setIsPlaying(true)}
//             onPause={() => setIsPlaying(false)}
//           />
//         )}
//       </div>
//       <h2 className="text-3xl font-bold text-center mb-2 drop-shadow-lg text-sky-700">
//         {title}
//       </h2>
//       <CollapseAbleDescription />
//       <div className="flex items-center justify-between w-full mb-2 mt-4">
//         <span className="text-sm text-gray-500">{formatTime(currentTime)}</span>
//         <input
//           type="range"
//           min={0}
//           max={duration}
//           value={currentTime}
//           onChange={(e) => {
//             const val = Number(e.target.value);
//             setCurrentTime(val);
//             if (playerRef.current) playerRef.current.currentTime = val;
//           }}
//           className="flex-1 mx-2 accent-sky-500"
//         />
//         <span className="text-sm text-gray-500">{formatTime(duration)}</span>
//       </div>
//       <div className="flex items-center justify-center gap-8 mt-6">
//         <button
//           onClick={() => handleSkip(-10)}
//           aria-label="Back 10s"
//           className="hover:scale-110 transition"
//         >
//           <svg
//             width="32"
//             height="32"
//             fill="none"
//             stroke="black"
//             strokeWidth="2"
//             viewBox="0 0 24 24"
//           >
//             <path d="M12 19V5M5 12l7-7 7 7" />
//           </svg>
//           <span className="block text-xs mt-1 text-gray-500">10</span>
//         </button>
//         <button
//           onClick={handlePlayPause}
//           className="bg-sky-500 rounded-full p-4 shadow-2xl hover:bg-sky-600 transition flex items-center justify-center"
//           aria-label={isPlaying ? "Pause" : "Play"}
//         >
//           {isPlayerLoading ? (
//             <svg
//               className="animate-spin"
//               width="28"
//               height="28"
//               viewBox="0 0 24 24"
//               fill="none"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="white"
//                 strokeWidth="4"
//               />
//               <path
//                 className="opacity-75"
//                 fill="#fff"
//                 d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//               />
//             </svg>
//           ) : isPlaying ? (
//             <svg width="32" height="32" fill="black" viewBox="0 0 24 24">
//               <rect x="6" y="5" width="4" height="14" />
//               <rect x="14" y="5" width="4" height="14" />
//             </svg>
//           ) : (
//             <svg width="32" height="32" fill="black" viewBox="0 0 24 24">
//               <polygon points="5,3 19,12 5,21" />
//             </svg>
//           )}
//         </button>
//         <button
//           onClick={() => handleSkip(10)}
//           aria-label="Forward 10s"
//           className="hover:scale-110 transition"
//         >
//           <svg
//             width="32"
//             height="32"
//             fill="none"
//             stroke="black"
//             strokeWidth="2"
//             viewBox="0 0 24 24"
//           >
//             <path d="M12 5v14M19 12l-7 7-7-7" />
//           </svg>
//           <span className="block text-xs mt-1 text-gray-500">10</span>
//         </button>
//       </div>
//       <div className="flex items-center justify-center gap-8 mt-8">
//         <button
//           onClick={handleShare}
//           aria-label="Share"
//           className="hover:text-sky-400 transition"
//         >
//           <svg
//             width="28"
//             height="28"
//             fill="none"
//             stroke="black"
//             strokeWidth="2"
//             viewBox="0 0 24 24"
//           >
//             <path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7" />
//             <path d="M16 6l-4-4-4 4" />
//             <path d="M12 2v14" />
//           </svg>
//         </button>
//         <LikeButton
//           type_of_item={categoryId}
//           item_id={itemId}
//           isLiked={isFavourite || false}
//           refetch={refetch}
//         />
//       </div>
//       {showAlert && (
//         <div className="mt-8 p-4 bg-sky-900/80 text-white rounded-2xl text-center shadow-xl">
//           You can only watch 15 seconds of this {fileType}.
//           <br />
//           Subscribe for full access.
//           <button
//             className="ml-2 mt-4 px-4 py-1 bg-sky-500 rounded text-white font-bold hover:bg-sky-600 transition"
//             onClick={() => setShowAlert(false)}
//           >
//             OK
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MediaPlayer;
