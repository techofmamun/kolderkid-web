import Button from "../components/Button";
import {
  useGetApparelsQuery,
  useGetBannerQuery,
  useGetMusicQuery,
  useGetPodcastsQuery,
  useGetProfileQuery,
  useGetVideosQuery
} from "../services/api";

const Home: React.FC = () => {
  const { data: profile, isLoading: loadingProfile } = useGetProfileQuery();
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
        {/* Profile */}
        <div className="flex items-center gap-4 mb-8">
          {loadingProfile ? (
            <div className="text-sky-900 text-xl font-semibold">Loading Profile...</div>
          ) : profile ? (
            <>
              <img
                src={profile.profile_image}
                alt="Avatar"
                className="w-16 h-16 rounded-full border-4 border-sky-400"
              />
              <div>
                <div className="text-xl font-semibold text-sky-900">
                  {profile.firstname} {profile.lastname}
                </div>
                <div className="text-sky-600">{profile.email}</div>
              </div>
            </>
          ) : (
            <div className="text-sky-900 text-xl font-semibold">No Profile</div>
          )}
        </div>
        {/* Music Section */}
        <div className="mb-8">
          <div className="text-lg font-bold text-sky-800 mb-2">Music</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {!musicData ? (
              <div className="col-span-4 text-sky-700">Loading Music...</div>
            ) : musicData.length ? (
              musicData.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow p-4 flex flex-col items-center"
                >
                  <img
                    src={item.thumbnail}
                    alt={item.display_title}
                    className="w-16 h-16 rounded-full mb-2 object-cover"
                  />
                  <div className="text-sky-700 font-medium">{item.display_title}</div>
                  <div className="text-xs text-sky-500">{item.artist_name}</div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-sky-700">No Music</div>
            )}
          </div>
        </div>
        {/* Video Section */}
        <div className="mb-8">
          <div className="text-lg font-bold text-sky-800 mb-2">Videos</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {!videoData ? (
              <div className="col-span-4 text-sky-700">Loading Videos...</div>
            ) : videoData.length ? (
              videoData.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow p-4 flex flex-col items-center"
                >
                  <img
                    src={item.thumbnail}
                    alt={item.display_title}
                    className="w-16 h-16 rounded mb-2 object-cover"
                  />
                  <div className="text-sky-700 font-medium">{item.display_title}</div>
                  <div className="text-xs text-sky-500">{item.artist_name}</div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-sky-700">No Videos</div>
            )}
          </div>
        </div>
        {/* Podcast Section */}
        <div className="mb-8">
          <div className="text-lg font-bold text-sky-800 mb-2">Podcasts</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {!podcastData ? (
              <div className="col-span-4 text-sky-700">Loading Podcasts...</div>
            ) : podcastData.length ? (
              podcastData.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow p-4 flex flex-col items-center"
                >
                  <img
                    src={item.thumbnail}
                    alt={item.display_title}
                    className="w-16 h-16 rounded mb-2 object-cover"
                  />
                  <div className="text-sky-700 font-medium">{item.display_title}</div>
                  <div className="text-xs text-sky-500">{item.artist_name}</div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-sky-700">No Podcasts</div>
            )}
          </div>
        </div>
        {/* Apparels Section */}
        <div className="mb-8">
          <div className="text-lg font-bold text-sky-800 mb-2">Apparels</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {!apparelsData ? (
              <div className="col-span-4 text-sky-700">Loading Apparels...</div>
            ) : apparelsData.length ? (
              apparelsData.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow p-4 flex flex-col items-center"
                >
                  <img
                    src={item.image && item.image[0]}
                    alt={item.product_name}
                    className="w-16 h-16 rounded mb-2 object-cover"
                  />
                  <div className="text-sky-700 font-medium">{item.product_name}</div>
                  <div className="text-xs text-sky-500 text-center">{item.product_description}</div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-sky-700">No Apparels</div>
            )}
          </div>
        </div>
        {/* Example Button */}
        <div className="flex justify-center mt-8">
          <Button text="Explore More" />
        </div>
      </div>
    </div>
  );
};

export default Home;
