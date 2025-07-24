// Types for cart endpoints

export interface CartItem {
  cart_id: number;
  product_id: number;
  product_name: string;
  image: string[];
  price: number;
  size: string;
  quantity: number;
  // ...other fields as needed
}

export interface CartResponse {
  status: boolean;
  message: string;
  data: {
    cart_items: CartItem[];
    total_price: number;
    [key: string]: any;
  };
}

export interface AddToCartRequest {
  product_id: number;
  size: string;
  quantity: number;
}

export interface UpdateCartRequest {
  cart_id: number;
  quantity: number;
}
