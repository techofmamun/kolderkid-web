import React from "react";
import { useParams } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import { useGetApparelByIdQuery } from "../services/api";

const ApparelDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetApparelByIdQuery(id!);

  if (isLoading) {
    return (
      <div className="text-center py-10 text-sky-700 font-bold">Loading...</div>
    );
  }
  if (error || !data) {
    return (
      <div className="text-center py-10 text-red-600 font-bold">
        Failed to load product.
      </div>
    );
  }
  const apparel = data;

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row gap-6 items-center justify-center p-6 bg-white rounded-lg shadow-lg">
        <img
          src={apparel.image && apparel.image[0]}
          alt={apparel.product_name}
          className="w-48 h-48 object-cover rounded-lg border"
        />
        <div className="flex-1 flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-sky-800">
            {apparel.product_name}
          </h2>
          <div className="text-sky-600 font-medium">
            Category: {apparel.category}
          </div>
          <div className="text-lg font-semibold text-green-700">
            ${apparel.price}
          </div>
          <div className="text-gray-700">Size: {apparel.size}</div>
          <div className="text-gray-600 mt-2">
            {apparel.product_description}
          </div>
          <div className="flex gap-4 mt-4">
            <button className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 transition">
              Add to Cart
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ApparelDetails;
