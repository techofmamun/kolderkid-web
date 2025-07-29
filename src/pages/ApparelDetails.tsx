import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import RelatedApparelCard from "../components/RelatedApparelCard";
import { useGetApparelsQuery } from "../services/api";
import { useParams } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import {
  useGetApparelByIdQuery,
  useAddToCartMutation,
  useBuyApparelMutation,
} from "../services/api";
import LikeButton from "./LikeButton";

const ApparelDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error, refetch } = useGetApparelByIdQuery(id!);
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [buyNow, { isLoading: isBuying }] = useBuyApparelMutation();
  const paymentWindowRef = useRef<Window | null>(null);
  const paymentPollRef = useRef<number | null>(null);
  const navigate = useNavigate();
  const apparel = data;
  // Fetch related apparels (excluding current)
  const { data: related, isLoading: relatedLoading } = useGetApparelsQuery({});
  const relatedApparels = related?.data || [];
  const filteredRelated = relatedApparels
    .filter((item) => item.id !== apparel?.id)
    .slice(0, 10);

  const handleAddToCart = async () => {
    if (!apparel) return;
    try {
      await addToCart({ product_id: apparel.id, size: apparel.size });
      setFeedback("Added to cart!");
    } catch {
      setFeedback("Failed to add to cart.");
    }
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleBuyNow = async () => {
    if (!apparel) return;
    // Open a blank window synchronously to avoid popup blockers
    paymentWindowRef.current = window.open("about:blank", "_blank");
    try {
      const response = await buyNow({ product_id: apparel.id }).unwrap();
      if (response.data?.payment_url && paymentWindowRef.current) {
        paymentWindowRef.current.location.href = response.data.payment_url;
      } else if (paymentWindowRef.current) {
        paymentWindowRef.current.close();
      }
    } catch {
      setFeedback("Failed to initiate purchase.");
      if (paymentWindowRef.current) {
        paymentWindowRef.current.close();
      }
    }
  };
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      // Optionally check event.origin for security
      if (typeof event.data === "string") {
        if (event.data.includes("payment-success")) {
          setFeedback("Payment successful!");
        } else if (event.data.includes("payment-cancel")) {
          setFeedback("Payment cancelled.");
        }
      }
    }
    window.addEventListener("message", handleMessage);

    // Fallback: poll for window.closed
    paymentPollRef.current = window.setInterval(() => {
      if (paymentWindowRef.current && paymentWindowRef.current.closed) {
        // Optionally, check payment status via API here
        setFeedback("Payment cancelled.");
        paymentWindowRef.current = null;
        if (paymentPollRef.current) {
          clearInterval(paymentPollRef.current);
          paymentPollRef.current = null;
        }
      }
    }, 1000);

    return () => {
      window.removeEventListener("message", handleMessage);
      if (paymentPollRef.current) {
        clearInterval(paymentPollRef.current);
      }
    };
  }, []);
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
  if (!apparel) {
    return (
      <div className="text-center py-10 text-red-600 font-bold">
        Apparel not found.
      </div>
    );
  }
  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row gap-6 items-center justify-centerbg-white/50 rounded-lg shadow-lg max-w-4xl mx-auto overflow-hidden">
        <img
          src={apparel.image && apparel.image[0]}
          alt={apparel.product_name}
          className="size-full object-cover rounded-lg border flex-1 max-w-xs md:max-w-sm"
        />
        <div className="flex-1 flex flex-col gap-2 p-6">
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
          <div className="flex gap-4 mt-4 items-center flex-wrap">
            <LikeButton
              type_of_item={4}
              item_id={apparel.id}
              isLiked={apparel.favourite || false}
              refetch={refetch}
            />
            <button
              className="border text-sky-600 px-4 py-2 rounded transition hover:scale-105 cursor-pointer"
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? "Adding..." : "Add to Cart"}
            </button>
            <button
              className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 transition hover:scale-105 cursor-pointer"
              onClick={handleBuyNow}
            >
              {isBuying ? "Processing..." : "Buy Now"}
            </button>
            {feedback && (
              <span className="ml-4 text-sm font-semibold text-sky-700">
                {feedback}
              </span>
            )}
          </div>
        </div>
      </div>
      {/* Related Apparels Section */}
      <div className="mt-auto">
        <h3 className="text-xl font-bold text-sky-800 mb-4">
          Related Apparels
        </h3>
        {relatedLoading ? (
          <div className="text-sky-600">Loading...</div>
        ) : filteredRelated.length ? (
          <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-sky-700 scrollbar-track-gray-200px-4">
            {filteredRelated.map((item) => (
              <RelatedApparelCard
                key={item.id}
                apparel={item}
                onClick={() => navigate(`/apparels/${item.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No related apparels found.</div>
        )}
      </div>
    </PageContainer>
  );
};

export default ApparelDetails;
