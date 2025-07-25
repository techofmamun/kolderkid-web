import React, { useEffect, useRef } from "react";
import PageContainer from "../components/PageContainer";
import {
  useCheckoutCartMutation,
  useGetCartQuery,
  useUpdateCartMutation,
} from "../services/api";

const Cart: React.FC = () => {
  const { data, isLoading, error, refetch } = useGetCartQuery();
  const [updateCart, { isLoading: isUpdating }] = useUpdateCartMutation();
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const paymentWindowRef = useRef<Window | null>(null);
  const paymentPollRef = useRef<number | null>(null);
  const [checkoutCart, { isLoading: isCheckingOut }] =
    useCheckoutCartMutation();
  const handleUpdate = async (
    cartId: number,
    action: "set" | "increment" | "decrement"
  ) => {
    const items = data?.data?.cart_items ?? [];
    const item = items.find((i) => i.cart_id === cartId);
    try {
      if ((action === "increment" || action === "decrement") && item) {
        await updateCart({ product_id: item.product_id, action });
      }
      refetch();
    } catch {
      // Handle error
    }
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleCheckout = async () => {
    try {
      const response = await checkoutCart({}).unwrap();
      if (response.data?.payment_url) {
        paymentWindowRef.current = window.open(
          response.data.payment_url,
          "_blank"
        );
      }
    } catch {
      setFeedback("Failed to initiate purchase.");
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
      <div className="text-center py-10 text-sky-700 font-bold">
        Loading cart...
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="text-center py-10 text-red-600 font-bold">
        Failed to load cart.
      </div>
    );
  }
  if (!data.data?.cart_items?.length) {
    return (
      <div className="text-center py-10 text-sky-700 font-bold">
        Your cart is empty.
      </div>
    );
  }

  return (
    <PageContainer>
      <div className="mx-auto w-full max-w-3xl h-fit">
        <div className="flex flex-col gap-6">
          {data.data.cart_items.map((item) => (
            <div
              key={item.cart_id}
              className="flex items-center gap-4 bg-white rounded shadow p-4"
            >
              <img
                src={item.image && item.image[0]}
                alt={item.product_name}
                className="w-20 h-20 object-cover rounded border"
              />
              <div className="flex-1">
                <div className="font-semibold text-sky-800">
                  {item.product_name}
                </div>
                <div className="text-gray-600">Size: {item.size}</div>
                <div className="text-green-700 font-bold">${item.price}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="bg-gray-200 px-2 py-1 rounded text-gray-500 hover:scale-105 transition cursor-pointer disabled:opacity-50"
                  onClick={() => handleUpdate(item.cart_id, "decrement")}
                  disabled={isUpdating}
                >
                  {item.quantity > 1 ? "-" : "x"}
                </button>
                <span className="px-3 font-bold text-gray-500 ">
                  {item.quantity}
                </span>
                <button
                  className="bg-gray-200 px-2 py-1 rounded text-gray-500 hover:scale-105 transition cursor-pointer disabled:opacity-50"
                  onClick={() => handleUpdate(item.cart_id, "increment")}
                  disabled={isUpdating}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 p-6 bg-gradient-to-r from-sky-300 via-sky-500 to-sky-700 rounded-lg shadow">
          <div className="flex justify-between text-lg font-bold text-white">
            <span>Total Products:</span>
            <span>
              {data.data.total_quantity ?? data.data.cart_items.length}
            </span>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            {data.data.cart_items.map((item) => (
              <div
                key={item.cart_id}
                className="flex justify-between text-white"
              >
                <span>{item.product_name}:</span>
                <span>${item.price}</span>
              </div>
            ))}
          </div>
          <div>
            <hr className="border-white/20 my-3" />
            <div className="flex justify-between text-xl font-bold text-white">
              <span>Total Amount:</span>
              <span>${data.data.total_price?.toFixed(2)}</span>
            </div>
          </div>
        </div>
        {feedback && (
          <div className="text-center text-red-600 font-bold mt-4">
            {feedback}
          </div>
        )}
        <div className="flex justify-end mt-8">
          <button
            className="bg-sky-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-sky-700 transition hover:scale-105 cursor-pointer disabled:opacity-50"
            onClick={handleCheckout}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? "Processing..." : "Checkout"}
          </button>
        </div>
        <div className="mt-4 text-center text-gray-500">
          Note: Payment will open in a new window.
        </div>
      </div>
    </PageContainer>
  );
};

export default Cart;
