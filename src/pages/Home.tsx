import Button from "../components/Button";
import HorizontalScrollSection from "../components/HorizontalScrollSection";
import {
  useGetApparelsQuery,
  useGetBannerQuery,
  useGetMusicQuery,
  useGetPodcastsQuery,
  useGetVideosQuery
} from "../services/api";

const Home: React.FC = () => {
  const { data: banners, isLoading: loadingBanner } = useGetBannerQuery();
  const { data: musicData } = useGetMusicQuery();
  const { data: videoData } = useGetVideosQuery();
  const { data: podcastData } = useGetPodcastsQuery();
  const { data: apparelsData } = useGetApparelsQuery();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-sky-200 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Banner */}
        <div className="w-full h-48 bg-sky-300 rounded-xl flex items-center justify-center mb-8">
          {loadingBanner ? (
            <div className="text-sky-900 text-2xl font-bold">Loading Banner...</div>
          ) : banners && banners.length ? (
            <img
              src={banners[0].bannerImage}
              alt={banners[0].bannerTitel}
              className="h-full object-cover rounded-xl w-full"
            />
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
          detailsPath={item => `/music/${item.id}`}
          renderItem={item => (
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center min-w-[140px]">
              <img
                src={item.thumbnail}
                alt={item.display_title}
                className="w-16 h-16 rounded-full mb-2 object-cover"
              />
              <div className="text-sky-700 font-medium text-center">{item.display_title}</div>
              <div className="text-xs text-sky-500 text-center">{item.artist_name}</div>
            </div>
          )}
        />

        <HorizontalScrollSection
          title="Videos"
          seeAllPath="/videos"
          items={videoData || []}
          loading={!videoData}
          emptyText="No Videos"
          detailsPath={item => `/videos/${item.id}`}
          renderItem={item => (
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center min-w-[140px]">
              <img
                src={item.thumbnail}
                alt={item.display_title}
                className="w-16 h-16 rounded mb-2 object-cover"
              />
              <div className="text-sky-700 font-medium text-center">{item.display_title}</div>
              <div className="text-xs text-sky-500 text-center">{item.artist_name}</div>
            </div>
          )}
        />

        <HorizontalScrollSection
          title="Podcasts"
          seeAllPath="/podcasts"
          items={podcastData || []}
          loading={!podcastData}
          emptyText="No Podcasts"
          detailsPath={item => `/podcasts/${item.id}`}
          renderItem={item => (
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center min-w-[140px]">
              <img
                src={item.thumbnail}
                alt={item.display_title}
                className="w-16 h-16 rounded mb-2 object-cover"
              />
              <div className="text-sky-700 font-medium text-center">{item.display_title}</div>
              <div className="text-xs text-sky-500 text-center">{item.artist_name}</div>
            </div>
          )}
        />

        <HorizontalScrollSection
          title="Apparels"
          seeAllPath="/apparels"
          items={apparelsData || []}
          loading={!apparelsData}
          emptyText="No Apparels"
          detailsPath={item => `/apparels/${item.id}`}
          renderItem={item => (
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center min-w-[140px]">
              <img
                src={item.image && item.image[0]}
                alt={item.product_name}
                className="w-16 h-16 rounded mb-2 object-cover"
              />
              <div className="text-sky-700 font-medium text-center">{item.product_name}</div>
              <div className="text-xs text-sky-500 text-center">{item.product_description}</div>
            </div>
          )}
        />

        {/* Example Button */}
        <div className="flex justify-center mt-8">
          <Button text="Explore More" />
        </div>
      </div>
    </div>
  );
};

export default Home;
