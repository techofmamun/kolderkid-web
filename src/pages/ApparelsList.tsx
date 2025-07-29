import React, { useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import { useGetApparelsQuery } from "../services/api";

const ApparelsList: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const { data, isFetching, isLoading } = useGetApparelsQuery({ page });
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
            {isFetching && (
              <span className="text-sky-600">Loading more...</span>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default ApparelsList;
