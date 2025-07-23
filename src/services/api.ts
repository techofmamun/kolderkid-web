import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// --- Types ---
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
    getMusic: builder.query<MediaItem[], { page?: number }>({
      query: ({ page = 1 } = {}) => `getitems?filter=1&page=${page}`,
      transformResponse: (response: { data: MediaItem[] }) =>
        response.data || [],
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
    likeAudio: builder.mutation<
      { status: boolean },
      { filter: number; id: number }
    >({
      query: ({ filter, id }) => ({
        url: "addorremovefavourite",
        method: "POST",
        body: { type_of_item: filter, item_id: id },
      }),
    }),
    downloadAudio: builder.mutation<
      { status: boolean; message: string },
      { id: number }
    >({
      query: ({ id }) => ({
        url: "download",
        method: "POST",
        body: { items_id: id },
      }),
    }),
    getVideos: builder.query<MediaItem[], { page?: number }>({
      query: ({ page = 1 } = {}) => `getitems?filter=2&page=${page}`,
      transformResponse: (response: { data: MediaItem[] }) =>
        response.data || [],
    }),
    getPodcasts: builder.query<MediaItem[], { page?: number }>({
      query: ({ page = 1 } = {}) => `getitems?filter=3&page=${page}`,
      transformResponse: (response: { data: MediaItem[] }) =>
        response.data || [],
    }),

    getApparelById: builder.query<ApparelItem | null, string>({
      query: (id) => `getitemsdetails?filter=4&items_id=${id}`,
      transformResponse: (response: { data: ApparelItem[] }) =>
        response.data?.[0] || null,
    }),
    getApparels: builder.query<ApparelItem[], { page?: number }>({
      query: ({ page = 1 } = {}) => `getitems?filter=4&page=${page}`,
      transformResponse: (response: { data: ApparelItem[] }) =>
        response.data || [],
    }),

    // Related audios endpoint (example: returns similar items by category or artist)
    getRelatedAudios: builder.query<MediaItem[], { id: number }>({
      query: ({ id }) => `getrelateditems?items_id=${id}`,
      transformResponse: (response: { data: MediaItem[] }) =>
        response.data || [],
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
        body: { type: "product", product_id, type_of_item: 4 },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useGetBannerQuery,
  useGetMusicQuery,
  useGetVideosQuery,
  useGetPodcastsQuery,
  useGetApparelsQuery,
  useGetApparelByIdQuery,
  useGetMediaDetailsQuery,
  useLazyGetMediaDetailsQuery,
  useLikeAudioMutation,
  useDownloadAudioMutation,
  useGetRelatedAudiosQuery,
  useSubscribeMutation,
  useBuyApparelMutation,
} = api;
