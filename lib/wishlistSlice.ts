import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Api/api";
import axios from "axios";

export interface WishlistProduct {
  _id: string;
  id?: string;
  title: string;
  imageCover: string;
  price: number;
  ratingsAverage?: number;
}

interface WishlistApiResponse {
  data: WishlistProduct[];
}

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || fallback;
  }
  return fallback;
}

interface WishlistState {
  wishlistData: WishlistProduct[];
  wishlistIds: string[]; // لحفظ الـ IDs لتسهيل تلوين أيقونة القلب
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  wishlistData: [],
  wishlistIds: [],
  loading: false,
  error: null,
};

// 1. جلب المفضلة
export const getWishlist = createAsyncThunk<WishlistApiResponse, void, { rejectValue: string }>(
  "wishlist/getWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<WishlistApiResponse>("/wishlist");
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to fetch wishlist"));
    }
  }
);

// 2. إضافة منتج للمفضلة
export const addToWishlist = createAsyncThunk<unknown, string, { rejectValue: string }>(
  "wishlist/addToWishlist",
  async (productId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post<unknown>("/wishlist", { productId });
      // مزامنة القائمة بعد التعديل للحفاظ على بيانات العناصر ومعرّفاتها
      dispatch(getWishlist());
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to add to wishlist"));
    }
  }
);

// 3. حذف منتج من المفضلة
export const removeFromWishlist = createAsyncThunk<unknown, string, { rejectValue: string }>(
  "wishlist/removeFromWishlist",
  async (productId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.delete<unknown>(`/wishlist/${productId}`);
      dispatch(getWishlist());
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to remove from wishlist"));
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistData = action.payload.data;
        state.wishlistIds = action.payload.data
          .map((item) => item._id || item.id)
          .filter((id): id is string => Boolean(id));
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch wishlist";
      });
  },
});

export default wishlistSlice.reducer;