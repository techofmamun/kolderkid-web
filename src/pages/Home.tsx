import React, { useState, useEffect } from "react";
import HorizontalScrollSection from "../components/HorizontalScrollSection";
import {
  useGetApparelsQuery,
  useGetBannerQuery,
  useGetMusicQuery,
  useGetPodcastsQuery,
  useGetVideosQuery,
  type Item,
} from "../services/api";
import PageContainer from "../components/PageContainer";

// Reusable card for all item types
type ItemCardProps = {
  item: Item;
  type: "music" | "video" | "podcast" | "apparel";
  asLink?: boolean;
  detailsPath?: string;
};

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  type,
  asLink = false,
  detailsPath,
}) => {
  const {
    thumbnail,
    display_title,
    artist_name,
    image,
    product_name,
    product_description,
  } = item;
  const title = display_title || product_name || "Untitled";
  const subtitle = artist_name || product_description || "Unknown Artist";
  const itemImage = thumbnail || image?.[0] || "";
  const card = (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center min-w-[140px] justify-between hover:scale-105 transition">
      {itemImage && (
        <img
          src={itemImage}
          alt={title}
          className={`w-16 h-16 rounded${
            type === "music" ? "-full" : ""
          } mb-2 object-cover`}
        />
      )}
      <div className="text-sky-700 font-medium text-center line-clamp-1">
        {title}
      </div>
      <div className="text-xs text-sky-500 text-center line-clamp-1">
        {subtitle}
      </div>
    </div>
  );
  if (asLink && detailsPath) {
    return (
      <a href={detailsPath} className="block">
        {card}
      </a>
    );
  }
  return card;
};

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
    <PageContainer>
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
                    idx === bannerIdx
                      ? "opacity-100 translate-x-0 z-10"
                      : "opacity-0 translate-x-full z-0"
                  }`}
                  style={{
                    transitionProperty: "opacity, transform",
                  }}
                  draggable={false}
                />
                {/* Overlay text and background */}
                {idx === bannerIdx && (
                  <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-20 rounded-xl">
                    <div className="mb-2 text-xs text-sky-200 font-semibold tracking-widest">
                      New Release
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-white drop-shadow mb-1">
                      {banner.bannerTitel}
                    </div>
                    <div className="text-base md:text-lg text-sky-100 drop-shadow mb-4 max-w-xl">
                      {banner.bannerDescription}
                    </div>
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
                    idx === bannerIdx ? "bg-sky-500" : "bg-sky-200"
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
        renderItem={(item) => <ItemCard item={item} type="music" />}
      />

      <HorizontalScrollSection
        title="Videos"
        seeAllPath="/videos"
        items={videoData || []}
        loading={!videoData}
        emptyText="No Videos"
        detailsPath={(item) => `/videos/${item.id}`}
        renderItem={(item) => (
          <ItemCard
            item={item}
            type="video"
            asLink
            detailsPath={`/videos/${item.id}`}
          />
        )}
      />

      <HorizontalScrollSection
        title="Podcasts"
        seeAllPath="/podcasts"
        items={podcastData || []}
        loading={!podcastData}
        emptyText="No Podcasts"
        detailsPath={(item) => `/podcasts/${item.id}`}
        renderItem={(item) => <ItemCard item={item} type="podcast" />}
      />

      <HorizontalScrollSection
        title="Apparels"
        seeAllPath="/apparels"
        items={apparelsData || []}
        loading={!apparelsData}
        emptyText="No Apparels"
        detailsPath={(item) => `/apparels/${item.id}`}
        renderItem={(item) => <ItemCard item={item} type="apparel" />}
      />

      {/* Example Button */}
      {/* <div className="flex justify-center mt-8">
          <Button text="Explore More" />
        </div> */}
    </PageContainer>
  );
};

export default Home;
