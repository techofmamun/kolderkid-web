import React, { useRef, useCallback } from "react";
import { useGetApparelsQuery } from "../services/api";
import { Link } from "react-router-dom";

const ApparelsList: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const [items, setItems] = React.useState<any[]>([]);
  const { data, isLoading, isFetching } = useGetApparelsQuery({ page });
  const loader = useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (data && Array.isArray(data)) {
      setItems((prev) => (page === 1 ? data : [...prev, ...data]));
    }
  }, [data, page]);

  const handleObserver = useCallback(
    (entries: any) => {
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
      <h1 className="text-2xl font-bold mb-6 text-sky-800">All Apparels</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <Link
            to={`/apparels/${item.id}`}
            key={item.id}
            className="bg-white rounded-lg shadow p-4 flex flex-col items-center hover:scale-105 transition"
          >
            <img
              src={item.image && item.image[0]}
              alt={item.product_name}
              className="w-24 h-24 rounded mb-2 object-cover"
            />
            <div className="text-sky-700 font-medium text-center line-clamp-1">
              {item.product_name}
            </div>
            <div className="text-xs text-gray-500 text-center line-clamp-1">
              {item.category}
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

export default ApparelsList;
