import moment from "moment";
import React from "react";
import { CgRemove } from "react-icons/cg";
import PageContainer from "../components/PageContainer";
import {
  useGetFavouritesQuery,
  useLikeMutation,
  type FavouriteItem,
} from "../services/api";
import { useNavigate } from "react-router-dom";
const Item = ({
  item,
  refetch,
}: {
  item: FavouriteItem;
  refetch: () => void;
}) => {
  const [like, { isLoading }] = useLikeMutation();
  const navigate = useNavigate();
  const handleLike = async () => {
    if (!item.category_id) return;
    try {
      await like({
        type_of_item: item.category_id,
        item_id: item.id,
      });
      refetch();
    } catch {
      // Optionally show error
    }
  };
  const handleClick = () => {
    if (item.category_id === 1) {
      navigate(`/musics/${item.id}`);
    } else if (item.category_id === 2) {
      navigate(`/videos/${item.id}`);
    } else if (item.category_id === 3) {
      navigate(`/podcasts/${item.id}`);
    } else if (item.category_id === 4) {
      navigate(`/apparels/${item.id}`);
    }
  };
  return (
    <div className="flex items-center gap-1 md:gap-2 lg:gap-4 bg-white rounded shadow p-4 max-w-md w-full">
      <div
        className="flex gap-2 items-center flex-1 hover:scale-105 transition cursor-pointer"
        onClick={handleClick}
      >
        <img
          src={item.thumbnail}
          alt={item.display_title}
          className="w-16 h-16 object-cover rounded border bg-gray-100"
        />
        <div className="flex-1 flex flex-col gap-1">
          <div className="font-bold text-sky-800 text-lg line-clamp-1 ">
            {item.display_title}
          </div>
          <div className="text-gray-500 text-sm">
            {moment(item.date).fromNow()}
          </div>
        </div>
      </div>
      <button
        className="ml-2 p-2 rounded-full disabled:opacity-50 bg-red-100 hover:bg-red-200 cursor-pointer hover:scale-105 transition"
        onClick={handleLike}
        aria-label="Like"
        disabled={isLoading}
      >
        <CgRemove className="w-6 h-6 text-red-600" />
      </button>
    </div>
  );
};
const FavouritesList: React.FC = () => {
  // For now, we use getMusicQuery and filter by favourite, but you may want a dedicated endpoint
  const { data, isLoading, error, refetch } = useGetFavouritesQuery();

  const favourites = data?.data ?? [];

  return (
    <PageContainer>
      {isLoading ? (
        <div className="text-center py-20 text-sky-700 font-bold">
          Loading...
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-600 font-bold">
          Failed to load favourites.
        </div>
      ) : favourites.length === 0 ? (
        <div className="text-center py-20 text-sky-700 font-bold">
          No Items in Favourites
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {favourites.map((item) => (
            <Item key={item.id} item={item} refetch={refetch} />
          ))}
        </div>
      )}
    </PageContainer>
  );
};

export default FavouritesList;
