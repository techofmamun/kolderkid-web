import moment from "moment";
import React, { useEffect, useState } from "react";
import PageContainer from "../components/PageContainer";
import { useGetPurchasesQuery } from "../services/api";

const History: React.FC = () => {
  const { data, isLoading, error } = useGetPurchasesQuery();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const purchases = data?.data ?? [];

  return (
    <PageContainer>
      <div className="py-8 px-4 max-w-2xl mx-auto">
        {loading ? (
          <div className="text-center py-20 text-sky-700 font-bold">
            Loading...
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-600 font-bold">
            Failed to load purchases.
          </div>
        ) : purchases.length === 0 ? (
          <div className="text-center py-20 text-sky-700 font-bold">
            No Items in Purchase
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {purchases.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white rounded shadow p-4"
              >
                <img
                  src={item.thumbnail}
                  alt={item.display_title}
                  className="w-16 h-16 object-cover rounded border bg-gray-100"
                />
                <div className="flex-1 flex flex-col gap-1">
                  <div className="font-bold text-sky-800 text-lg">
                    {item.display_title}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {moment(item.created_order_date_time).format(
                      "DD MMMM YYYY"
                    )}
                  </div>
                  <div className="text-green-700 font-bold text-base">
                    $ {item.payment}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default History;
