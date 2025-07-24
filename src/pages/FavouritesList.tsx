import React from "react";
import { useGetMusicQuery, useLikeAudioMutation } from "../services/api";
import { FaHeart } from "react-icons/fa";
import PageContainer from "../components/PageContainer";

const FavouritesList: React.FC = () => {
  // For now, we use getMusicQuery and filter by favourite, but you may want a dedicated endpoint
  const { data: musicData, isLoading } = useGetMusicQuery({});
  const [likeAudio] = useLikeAudioMutation();

  const handleLike = async (item: { category_id: number; id: number }) => {
    await likeAudio({ filter: item.category_id, id: item.id });
  };

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-sky-700 mb-6">Favourites</h1>
      {isLoading ? (
        <div className="text-sky-700">Loading...</div>
      ) : (
        <div className="flex flex-col gap-4">
          {musicData &&
            musicData.filter((item) => item.favourite).length === 0 && (
              <div className="text-gray-400 text-center mt-32">
                No Items in Favourites
              </div>
            )}
          {musicData &&
            musicData
              .filter((item) => item.favourite)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-center bg-white rounded-lg shadow p-4 gap-4"
                >
                  <img
                    src={item.thumbnail}
                    alt={item.display_title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="text-sky-700 font-medium text-lg line-clamp-1">
                      {item.display_title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.artist_name}
                    </div>
                  </div>
                  <button
                    className="ml-2 text-red-500 hover:scale-110 transition"
                    onClick={() => handleLike(item)}
                    aria-label="Remove from favourites"
                  >
                    <FaHeart size={24} />
                  </button>
                </div>
              ))}
        </div>
      )}
    </PageContainer>
  );
};

export default FavouritesList;
