import React, { useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import { useGetItemsQuery } from "../services/api";

const VideosList: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const { data, isFetching, isLoading } = useGetItemsQuery({ page, filter: 2 });
  const loader = useRef<HTMLDivElement | null>(null);
  const items = data?.data || [];
  const isLastPage = data?.newItemsCount === 0;

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !isFetching) {
        setPage((prev) => prev + 1);
      }
    },
    [isFetching]
  );

  React.useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    if (isLastPage) {
      observer.disconnect();
    }
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [handleObserver, isLastPage]);

  return (
    <PageContainer>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <Link
            to={`/videos/${item.id}`}
            key={item.id}
            className="bg-white rounded-lg shadow p-4 flex flex-col items-center hover:scale-105 transition"
          >
            <img
              src={item.thumbnail}
              alt={item.display_title}
              className="w-24 h-24 rounded mb-2 object-cover"
            />
            <div className="text-sky-700 font-medium text-center line-clamp-1">
              {item.display_title}
            </div>
            <div className="text-xs text-gray-500 text-center line-clamp-1">
              {item.artist_name}
            </div>
          </Link>
        ))}
      </div>
      {isLoading ? (
        <div className="h-8 flex items-center justify-center">
          <span className="text-sky-600">Loading...</span>
        </div>
      ) : isLastPage ? (
        <div className="h-8 flex items-center justify-center">
          <span className="text-sky-600">End of list</span>
        </div>
      ) : (
        <div ref={loader} className="h-8 flex items-center justify-center">
          {isFetching && <span className="text-sky-600">Loading more...</span>}
        </div>
      )}
    </PageContainer>
  );
};

export default VideosList;
