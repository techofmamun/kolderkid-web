import React, { useState, useEffect } from "react";
import HorizontalScrollSection from "../components/HorizontalScrollSection";
import {
  useGetApparelsQuery,
  useGetBannerQuery,
  useGetMusicQuery,
  useGetPodcastsQuery,
  useGetVideosQuery,
} from "../services/api";

const Home: React.FC = () => {
  const { data: banners, isLoading: loadingBanner } = useGetBannerQuery();
  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    if (!banners || banners.length === 0) return;
    const timer = setTimeout(() => {
      setBannerIdx((prev) => (prev < banners.length - 1 ? prev + 1 : 0));
    }, 3000);
    return () => clearTimeout(timer);
  }, [bannerIdx, banners]);
  const { data: musicData } = useGetMusicQuery({});
  const { data: videoData } = useGetVideosQuery({});
  const { data: podcastData } = useGetPodcastsQuery({});
  const { data: apparelsData } = useGetApparelsQuery({});

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-sky-200 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Banner */}
        <div className="w-full h-68 bg-sky-300 rounded-xl flex items-center justify-center mb-8 overflow-hidden relative">
          {loadingBanner ? (
            <div className="text-sky-900 text-2xl font-bold">
              Loading Banner...
            </div>
          ) : banners && banners.length ? (
            <div className="w-full h-full relative">
              {banners.map((banner, idx) => (
                <React.Fragment key={banner.bannerImage}>
                  <img
                    src={banner.bannerImage}
                    alt={banner.bannerTitel}
                    className={`absolute top-0 left-0 w-full h-full object-cover rounded-xl transition-all duration-700 ease-in-out ${
                      idx === bannerIdx ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 translate-x-full z-0'
                    }`}
                    style={{
                      transitionProperty: 'opacity, transform',
                    }}
                    draggable={false}
                  />
                  {/* Overlay text and background */}
                  {idx === bannerIdx && (
                    <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-20 rounded-xl">
                      <div className="mb-2 text-xs text-sky-200 font-semibold tracking-widest">New Release</div>
                      <div className="text-2xl md:text-3xl font-bold text-white drop-shadow mb-1">{banner.bannerTitel}</div>
                      <div className="text-base md:text-lg text-sky-100 drop-shadow mb-4 max-w-xl">{banner.bannerDescription}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-white/80 bg-sky-700/60 px-2 py-0.5 rounded-full">
                          {bannerIdx + 1} / {banners.length}
                        </span>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
              {/* Dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Go to banner ${idx + 1}`}
                    onClick={() => setBannerIdx(idx)}
                    className={`h-2 w-6 rounded-full transition-all duration-300 focus:outline-none cursor-pointer hover:scale-110 ${
                      idx === bannerIdx ? 'bg-sky-500' : 'bg-sky-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sky-900 text-2xl font-bold">No Banner</div>
          )}
        </div>

        <HorizontalScrollSection
          title="Music"
          seeAllPath="/music"
          items={musicData || []}
          loading={!musicData}
          emptyText="No Music"
          detailsPath={(item) => `/music/${item.id}`}
          renderItem={(item) => (
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center min-w-[140px] justify-between">
              <img 
                src={item.thumbnail}
                alt={item.display_title}
                className="w-16 h-16 rounded-full mb-2 object-cover line-clamp-1"
              />
              <div className="text-sky-700 font-medium text-center line-clamp-1">
                {item.display_title}
              </div>
              <div className="text-xs text-sky-500 text-center line-clamp-1">
                {item.artist_name}
              </div>
            </div>
          )}
        />

        <HorizontalScrollSection
          title="Videos"
          seeAllPath="/videos"
          items={videoData || []}
          loading={!videoData}
          emptyText="No Videos"
          detailsPath={(item) => `/videos/${item.id}`}
          renderItem={(item) => (
            <a
              href={`/videos/${item.id}`}
              className="bg-white rounded-lg shadow p-4 flex flex-col items-center min-w-[140px] hover:scale-105 transition"
            >
              <img
                src={item.thumbnail}
                alt={item.display_title}
                className="w-16 h-16 rounded mb-2 object-cover"
              />
              <div className="text-sky-700 font-medium text-center line-clamp-1">
                {item.display_title}
              </div>
              <div className="text-xs text-sky-500 text-center">
                {item.artist_name}
              </div>
            </a>
          )}
        />

        <HorizontalScrollSection
          title="Podcasts"
          seeAllPath="/podcasts"
          items={podcastData || []}
          loading={!podcastData}
          emptyText="No Podcasts"
          detailsPath={(item) => `/podcasts/${item.id}`}
          renderItem={(item) => (
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center min-w-[140px]">
              <img
                src={item.thumbnail}
                alt={item.display_title}
                className="w-16 h-16 rounded mb-2 object-cover"
              />
              <div className="text-sky-700 font-medium text-center line-clamp-1">
                {item.display_title}
              </div>
              <div className="text-xs text-sky-500 text-center line-clamp-1">
                {item.artist_name}
              </div>
            </div>
          )}
        />

        <HorizontalScrollSection
          title="Apparels"
          seeAllPath="/apparels"
          items={apparelsData || []}
          loading={!apparelsData}
          emptyText="No Apparels"
          detailsPath={(item) => `/apparels/${item.id}`}
          renderItem={(item) => (
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center min-w-[140px]">
              <img
                src={item.image && item.image[0]}
                alt={item.product_name}
                className="w-16 h-16 rounded mb-2 object-cover"
              />
              <div className="text-sky-700 font-medium text-center line-clamp-1">
                {item.product_name}
              </div>
              <div className="text-xs text-sky-500 text-center line-clamp-1">
                {item.product_description}
              </div>
            </div>
          )}
        />

        {/* Example Button */}
        {/* <div className="flex justify-center mt-8">
          <Button text="Explore More" />
        </div> */}
      </div>
    </div>
  );
};

export default Home;
