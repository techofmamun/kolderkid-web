import React, { useRef, useCallback } from "react";
import { useGetPodcastsQuery, type MediaItem } from "../services/api";
import { Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";

const PodcastsList: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const [items, setItems] = React.useState<MediaItem[]>([]);
  const { data, isFetching } = useGetPodcastsQuery({ page });
  const loader = useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (data && Array.isArray(data)) {
      setItems((prev) => (page === 1 ? data : [...prev, ...data]));
    }
  }, [data, page]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !isFetching && data && data.length > 0) {
        setPage((prev) => prev + 1);
      }
    },
    [isFetching, data]
  );

  React.useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [handleObserver]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Breadcrumb />
      <h1 className="text-2xl font-bold mb-6 text-sky-800">All Podcasts</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <Link
            to={`/podcasts/${item.id}`}
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
      <div ref={loader} className="h-8 flex items-center justify-center">
        {isFetching && <span className="text-sky-600">Loading more...</span>}
      </div>
    </div>
  );
};

export default PodcastsList;
