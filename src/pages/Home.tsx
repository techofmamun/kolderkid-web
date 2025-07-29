import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HorizontalScrollSection from "../components/HorizontalScrollSection";
import PageContainer from "../components/PageContainer";
import {
  useGetBannerQuery,
  useGetItemsQuery,
  useLazyGetMediaDetailsQuery,
  type Banner,
  type Item,
} from "../services/api";

// Reusable card for all item types
type ItemCardProps = {
  item: Item;
  type: "musics" | "videos" | "podcasts" | "apparels";
  asLink?: boolean;
};

const ItemCard: React.FC<ItemCardProps & { filter: number }> = ({
  item,
  type,
  filter,
}) => {
  const navigate = useNavigate();
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
  const [fetchDetails, { isLoading }] = useLazyGetMediaDetailsQuery();
  const detailsPath = `/${type}/${item.id}`;

  const handleClick = () => {
    if (type === "apparels") {
      navigate(detailsPath);
      return;
    }
    fetchDetails({ filter, id: item.id }, true)
      .unwrap()
      .then(() => {
        navigate(detailsPath);
      })
      .catch(() => {
        alert("Failed to load details");
      });
  };
  const card = (
    <button
      className="rounded-lg shadow-xs p-4 flex flex-col items-center min-w-[160px] justify-between hover:scale-105 transition cursor-pointer border border-sky-200/40 backdrop-blur-sm bg-white/50"
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-label={title}
      disabled={isLoading}
    >
      {itemImage && (
        <img
          src={itemImage}
          alt={title}
          className={`w-16 h-16  rounded${
            type === "musics" ? "-full" : ""
          } mb-2 object-cover ${
            isLoading
              ? type === "musics"
                ? "animate-spin"
                : "animate-ping"
              : ""
          }`}
        />
      )}
      <div
        className={`font-medium text-center line-clamp-1 ${
          isLoading ? "text-gray-400" : "text-sky-700"
        }`}
      >
        {title}
      </div>
      <div
        className={`text-xs text-gray-500 text-center line-clamp-1 ${
          isLoading ? "text-gray-400" : "text-sky-500"
        }`}
      >
        {subtitle}
      </div>
    </button>
  );
  return card;
};
const CarouselBanner = ({
  loadingBanner,
  banners,
}: {
  loadingBanner: boolean;
  banners: Banner[] | null | undefined;
}) => {
  const [bannerIdx, setBannerIdx] = useState(0);
  useEffect(() => {
    if (!banners || banners.length === 0) return;
    const timer = setTimeout(() => {
      setBannerIdx((prev) => (prev < banners.length - 1 ? prev + 1 : 0));
    }, 3000);
    return () => clearTimeout(timer);
  }, [bannerIdx, banners]);
  return (
    <div className="w-full h-68 rounded-xl flex items-center justify-center mb-8 overflow-hidden relative bg-white/50">
      {loadingBanner ? (
        <div className="text-sky-900 text-2xl font-bold"></div>
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
  );
};

const Home: React.FC = () => {
  const { data: music, isLoading: isLoadingMusic } = useGetItemsQuery({
    filter: 1,
  });
  const { data: video, isLoading: isLoadingVideo } = useGetItemsQuery({
    filter: 2,
  });
  const { data: podcast, isLoading: isLoadingPodcast } = useGetItemsQuery({
    filter: 3,
  });
  const { data: apparels, isLoading: isLoadingApparels } = useGetItemsQuery({
    filter: 4,
  });
  const { data: banners, isLoading: loadingBanner } = useGetBannerQuery();
  const musicData = music?.data || [];
  const videoData = video?.data || [];
  const podcastData = podcast?.data || [];
  const apparelsData = apparels?.data || [];
  return (
    <PageContainer>
      {/* Banner */}
      <CarouselBanner loadingBanner={loadingBanner} banners={banners} />

      {/* Horizontal Scroll Sections */}

      <HorizontalScrollSection
        title="Music"
        seeAllPath="/musics"
        items={musicData || []}
        loading={isLoadingMusic}
        emptyText="No Music"
        renderItem={(item) => <ItemCard item={item} type="musics" filter={1} />}
      />

      <HorizontalScrollSection
        title="Videos"
        seeAllPath="/videos"
        items={videoData || []}
        loading={isLoadingVideo}
        emptyText="No Videos"
        renderItem={(item) => (
          <ItemCard item={item} type="videos" asLink filter={2} />
        )}
      />

      <HorizontalScrollSection
        title="Apparels"
        seeAllPath="/apparels"
        items={apparelsData || []}
        loading={isLoadingApparels}
        emptyText="No Apparels"
        renderItem={(item) => (
          <ItemCard item={item} type="apparels" filter={4} />
        )}
      />

      <HorizontalScrollSection
        title="Podcasts"
        seeAllPath="/podcasts"
        items={podcastData || []}
        loading={isLoadingPodcast}
        emptyText="No Podcasts"
        renderItem={(item) => (
          <ItemCard item={item} type="podcasts" filter={3} />
        )}
      />
      {/* Example Button */}
      {/* <div className="flex justify-center mt-8">
          <Button text="Explore More" />
        </div> */}
    </PageContainer>
  );
};

export default Home;
