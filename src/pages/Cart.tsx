import React from "react";
import PageContainer from "../components/PageContainer";
import {
  useGetCartQuery,
  useUpdateCartMutation,
  useBuyApparelMutation,
} from "../services/api";

const Cart: React.FC = () => {
  const { data, isLoading, error, refetch } = useGetCartQuery();
  const [updateCart, { isLoading: isUpdating }] = useUpdateCartMutation();
  const [buyApparel, { isLoading: isBuying }] = useBuyApparelMutation();
  const [quantities, setQuantities] = React.useState<Record<number, number>>(
    {}
  );
  const [showModal, setShowModal] = React.useState(false);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (data?.data?.cart_items) {
      const q: Record<number, number> = {};
      data.data.cart_items.forEach((item) => {
        q[item.cart_id] = item.quantity;
      });
      setQuantities(q);
    }
  }, [data]);

  const handleUpdate = async (
    cartId: number,
    action: "set" | "increment" | "decrement"
  ) => {
    const newQty = quantities[cartId];
    const items = data?.data?.cart_items ?? [];
    const item = items.find((i) => i.cart_id === cartId);
    try {
      if ((action === "increment" || action === "decrement") && item) {
        // Send product_id and action for increment/decrement
        // @ts-expect-error: product_id is not in UpdateCartRequest but required by API
        const res = await updateCart({ product_id: item.product_id, action });
        setFeedback(res?.data?.message || "Cart updated");
      } else if (action === "set") {
        // Send cart_id and quantity for direct set
        const res = await updateCart({ cart_id: cartId, quantity: newQty });
        setFeedback(res?.data?.message || "Cart updated");
      }
      refetch();
    } catch {
      setFeedback("Failed to update cart.");
    }
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleCheckout = async () => {
    setFeedback(null);
    try {
      // Use RTK Query buyApparel mutation for checkout
      const res = await buyApparel({ product_id: 0, type: "cart" });
      const url = res?.data?.payment_url || res?.data?.data?.payment_url;
      if (url) {
        window.open(url, "_blank");
        setShowModal(true);
      } else {
        setFeedback("Checkout failed: No payment URL returned.");
      }
    } catch {
      setFeedback("Checkout failed.");
    }
  };

  if (isLoading || isBuying) {
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
      {/* <div className="text-2xl font-bold text-sky-700 mb-6">My Cart</div> */}
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
                className="bg-gray-200 px-2 py-1 rounded"
                onClick={() => handleUpdate(item.cart_id, "decrement")}
                disabled={isUpdating || quantities[item.cart_id] <= 1}
              >
                -
              </button>
              <span className="px-3 font-bold">
                {quantities[item.cart_id] ?? item.quantity}
              </span>
              <button
                className="bg-gray-200 px-2 py-1 rounded"
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
          <span>{data.data.total_quantity ?? data.data.cart_items.length}</span>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          {data.data.cart_items.map((item) => (
            <div key={item.cart_id} className="flex justify-between text-white">
              <span>{item.product_name}:</span>
              <span>${item.price}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xl font-bold text-white mt-6">
          <span>Total Amount:</span>
          <span>${data.data.total_price?.toFixed(2)}</span>
        </div>
      </div>
      {feedback && (
        <div className="text-center text-red-600 font-bold mt-4">
          {feedback}
        </div>
      )}
      <div className="flex justify-end mt-8">
        <button
          className="bg-sky-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-sky-700 transition"
          onClick={handleCheckout}
        >
          Continue
        </button>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center shadow-lg">
            <img
              src="/assets/icons/payment.png"
              alt="Success"
              className="w-16 h-16 mb-4"
            />
            <div className="text-2xl font-bold text-sky-700 mb-2">Success!</div>
            <div className="text-lg text-gray-700 mb-4">Thanks for Buying.</div>
            <button
              className="bg-sky-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-sky-700 transition"
              onClick={() => {
                setShowModal(false);
                refetch();
              }}
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Cart;
