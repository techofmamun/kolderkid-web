
import React from "react";
import PageContainer from "../components/PageContainer";
import { useGetCartQuery, useUpdateCartMutation } from "../services/api";

const Cart: React.FC = () => {
  const { data, isLoading, error, refetch } = useGetCartQuery();
  const [updateCart, { isLoading: isUpdating }] = useUpdateCartMutation();
  const [quantities, setQuantities] = React.useState<Record<number, number>>({});

  React.useEffect(() => {
    if (data?.data?.cart_items) {
      const q: Record<number, number> = {};
      data.data.cart_items.forEach((item) => {
        q[item.cart_id] = item.quantity;
      });
      setQuantities(q);
    }
  }, [data]);

  const handleQuantityChange = (cartId: number, value: number) => {
    setQuantities((prev) => ({ ...prev, [cartId]: value }));
  };

  const handleUpdate = async (cartId: number) => {
    await updateCart({ cart_id: cartId, quantity: quantities[cartId] });
    refetch();
  };

  if (isLoading) {
    return <div className="text-center py-10 text-sky-700 font-bold">Loading cart...</div>;
  }
  if (error || !data) {
    return <div className="text-center py-10 text-red-600 font-bold">Failed to load cart.</div>;
  }
  if (!data.data?.cart_items?.length) {
    return <div className="text-center py-10 text-sky-700 font-bold">Your cart is empty.</div>;
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        {data.data.cart_items.map((item) => (
          <div key={item.cart_id} className="flex items-center gap-4 bg-white rounded shadow p-4">
            <img src={item.image && item.image[0]} alt={item.product_name} className="w-20 h-20 object-cover rounded border" />
            <div className="flex-1">
              <div className="font-semibold text-sky-800">{item.product_name}</div>
              <div className="text-gray-600">Size: {item.size}</div>
              <div className="text-green-700 font-bold">${item.price}</div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={quantities[item.cart_id] ?? item.quantity}
                onChange={(e) => handleQuantityChange(item.cart_id, Number(e.target.value))}
                className="w-16 border rounded px-2 py-1 text-center"
                disabled={isUpdating}
              />
              <button
                className="bg-sky-600 text-white px-3 py-1 rounded hover:bg-sky-700 transition"
                onClick={() => handleUpdate(item.cart_id)}
                disabled={isUpdating}
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="text-xl font-bold text-right text-sky-800 mt-8">
        Total: ${data.data.total_price}
      </div>
    </PageContainer>
  );
};

export default Cart;
