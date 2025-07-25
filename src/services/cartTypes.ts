// Types for cart endpoints

export interface CartItem {
  cart_id: number;
  product_id: number;
  product_name: string;
  image: string[];
  price: number;
  size: string;
  quantity: number;
  category: string;
  product_description: string;
  admin_profit_percentage: number;
  creator_profit_percentage: number;
  favourite: boolean;
  is_admin_product: boolean;
  product_quantity: number | null;
  stripe_id: string;
  subscription: boolean | null;
  user_id: number;
}

export interface CartResponse {
  status: boolean;
  message: string;
  data: {
    cart_items: CartItem[];
    total_price: number;
    total_quantity: number;
  };
}

export interface AddToCartRequest {
  product_id: number;
  size: string;
}

export interface UpdateCartRequest {
  product_id?: number;
  action?: "increment" | "decrement";
}
