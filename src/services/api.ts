export interface FavouriteItem {
  id: number;
  display_title?: string;
  artist_name?: string;
  description?: string;
  category_id?: number;
  thumbnail?: string;
  fileType?: string;
  product_name?: string;
  product_description?: string;
  image?: string[];
  date?: string; // Optional date field for display
}

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  AddToCartRequest,
  CartResponse,
  UpdateCartRequest,
} from "./cartTypes";

// --- Types ---

export interface PurchaseItem {
  id: number;
  display_title: string;
  thumbnail: string;
  created_order_date_time: string;
  payment: number;
}
export interface Profile {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string | null;
  about_you: string | null;
  address: string | null;
  profile_image: string;
}

export interface Banner {
  bannerTitel: string;
  bannerDescription: string;
  bannerImage: string;
}

export interface MediaItem {
  id: number;
  display_title: string;
  artist_name: string;
  description: string;
  category_id: number;
  thumbnail: string;
  fileType: string;
  file?: string;
  favourite?: boolean;
  subscription?: boolean;
  is_download?: boolean;
  price?: number;
}

export interface ApparelItem {
  id: number;
  product_name: string;
  product_description: string;
  image: string[];
  admin_profit_percentage: number;
  cart_quantity: number;
  category: string;
  creator_profit_percentage: number;
  favourite: boolean;
  is_admin_product: boolean;
  price: number;
  quantity: number | null;
  size: string;
  stripe_id: string;
  subscription: boolean;
}

export interface Item {
  id: number;
  display_title?: string;
  artist_name?: string;
  description?: string;
  category_id?: number;
  thumbnail?: string;
  fileType?: string;
  product_name?: string;
  product_description?: string;
  image?: string[];
}
export interface ItemsResponse {
  data: MediaItem[];
  Total_pages: number;
  message?: string;
  status?: boolean;
}
export interface ApparelResponse {
  data: ApparelItem[];
  Total_pages: number;
  message?: string;
  status?: boolean;
}
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://kolderkid.com/api/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    login: builder.mutation<
      { data: string },
      { email: string; password: string }
    >({
      query: (body) => ({
        url: "user/login",
        method: "POST",
        body,
      }),
    }),
    register: builder.mutation<
      { data: string },
      { firstname: string; lastname: string; email: string; password: string }
    >({
      query: (body) => ({
        url: "register",
        method: "POST",
        body,
      }),
    }),
    getProfile: builder.query<Profile | null, void>({
      query: () => "getprofile",
      transformResponse: (response: { data: Profile }) => response.data || null,
    }),
    getBanner: builder.query<Banner[] | null, void>({
      query: () => "getbanner",
      transformResponse: (response: { data: Banner[] }) =>
        response.data || null,
    }),
    getItems: builder.query<
      {
        data: MediaItem[];
        current_page: number;
        per_page: number;
        total_pages: number;
        newItemsCount?: number;
      },
      { page?: number; filter?: number }
    >({
      query: ({ page = 1, filter = 1 } = {}) =>
        `getitems?filter=${filter}&page=${page}`,
      transformResponse: (response: ItemsResponse, _meta, arg) => {
        const page = arg?.page || 1;
        return {
          data: response.data || [],
          current_page: page,
          per_page: 10,
          total_pages: response.Total_pages || 1,
        };
      },
      serializeQueryArgs: ({ queryArgs }) => {
        const newQueryArgs = { ...queryArgs };
        if (newQueryArgs?.page) delete newQueryArgs.page;
        return newQueryArgs;
      },
      merge: (currentCache, newItems) => {
        if (!currentCache || newItems.current_page === 1) {
          return newItems;
        }
        return {
          ...newItems,
          data: [...(currentCache.data || []), ...(newItems.data || [])],
          newItemsCount: newItems.data.length,
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
    }),
    getMediaDetails: builder.query<
      MediaItem | null,
      { filter: number; id: number }
    >({
      query: ({ filter, id }) =>
        `getitemsdetails?filter=${filter}&items_id=${id}`,
      transformResponse: (response: { data: MediaItem[] }) =>
        response.data?.[0] || null,
    }),
    like: builder.mutation<
      { status: boolean },
      { type_of_item: number; item_id: number }
    >({
      query: ({ type_of_item, item_id }) => ({
        url: "addorremovefavourite",
        method: "POST",
        body: { type_of_item, item_id },
      }),
    }),
    getApparelById: builder.query<ApparelItem | null, string>({
      query: (id) => `getitemsdetails?filter=4&items_id=${id}`,
      transformResponse: (response: { data: ApparelItem[] }) =>
        response.data?.[0] || null,
    }),
    getApparels: builder.query<
      {
        data: ApparelItem[];
        current_page: number;
        per_page: number;
        total_pages: number;
        newItemsCount?: number;
      },
      { page?: number }
    >({
      query: ({ page = 1 } = {}) => `getitems?filter=4&page=${page}`,
      transformResponse: (response: ApparelResponse, _meta, arg) => {
        const page = arg?.page || 1;
        return {
          data: response.data || [],
          current_page: page,
          per_page: 10,
          total_pages: response.Total_pages || 1,
        };
      },
      serializeQueryArgs: ({ queryArgs }) => {
        const newQueryArgs = { ...queryArgs };
        if (newQueryArgs?.page) delete newQueryArgs.page;
        return newQueryArgs;
      },
      merge: (currentCache, newItems) => {
        if (!currentCache || newItems.current_page === 1) {
          return newItems;
        }
        return {
          ...newItems,
          data: [...(currentCache.data || []), ...(newItems.data || [])],
          newItemsCount: newItems.data.length,
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
    }),

    subscribe: builder.mutation<
      { status: boolean; data?: { payment_url?: string } },
      { product_id: number; type_of_item: number }
    >({
      query: ({ product_id, type_of_item }) => ({
        url: "checkoutsession",
        method: "POST",
        body: {
          type: "product",
          product_id,
          type_of_item,
        },
      }),
    }),
    buyApparel: builder.mutation<
      { status: boolean; data?: { payment_url?: string } },
      { product_id: number }
    >({
      query: ({ product_id }) => ({
        url: "checkoutsession",
        method: "POST",
        body: {
          type: "product",
          product_id,
          type_of_item: 4,
        },
      }),
    }),
    // --- Cart Endpoints ---
    getCart: builder.query<CartResponse, void>({
      query: () => "cart/list",
      transformResponse: (response: CartResponse) => response,
      forceRefetch() {
        return true;
      },
      // providesTags: ['Cart'],
    }),
    addToCart: builder.mutation<CartResponse, AddToCartRequest>({
      query: (body) => ({
        url: "cart/add",
        method: "POST",
        body,
      }),
      transformResponse: (response: CartResponse) => response,
      // invalidatesTags: ['Cart'],
    }),
    updateCart: builder.mutation<CartResponse, UpdateCartRequest>({
      query: (body) => ({
        url: "cart/update",
        method: "POST",
        body,
      }),
      transformResponse: (response: CartResponse) => response,
      // invalidatesTags: ['Cart'],
    }),
    checkoutCart: builder.mutation<
      { status: boolean; data?: { payment_url?: string } },
      { product_id?: number }
    >({
      query: ({ product_id }) => ({
        url: "checkoutsession",
        method: "POST",
        body: { type: "cart", product_id },
      }),
    }),
    getPurchases: builder.query<{ data: PurchaseItem[] }, void>({
      query: () => "getpurchasing",
      transformResponse: (response: { data: PurchaseItem[] }) => response,
    }),
    getFavourites: builder.query<{ data: FavouriteItem[] }, void>({
      query: () => "getfavouriteitems",
      transformResponse: (response: { data: FavouriteItem[] }) => response,
      forceRefetch() {
        return true;
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useGetBannerQuery,
  useGetItemsQuery,
  useGetApparelsQuery,
  useGetApparelByIdQuery,
  useGetMediaDetailsQuery,
  useLazyGetMediaDetailsQuery,
  useLikeMutation,
  useSubscribeMutation,
  useBuyApparelMutation,
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartMutation,
  useCheckoutCartMutation,
  useGetPurchasesQuery,
  useGetFavouritesQuery,
} = api;
