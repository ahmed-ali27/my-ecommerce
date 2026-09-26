import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Api/api";

interface WishlistState {
  wishlistData: any[];
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
export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/wishlist");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch wishlist");
    }
  }
);

// 2. إضافة منتج للمفضلة
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/wishlist", { productId });
      dispatch(getWishlist());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add to wishlist");
    }
  }
);

// 3. حذف منتج من المفضلة
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.delete(`/wishlist/${productId}`);
      dispatch(getWishlist());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove from wishlist");
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
        state.wishlistIds = action.payload.data ? action.payload.data.map((item: any) => item._id || item.id) : [];
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default wishlistSlice.reducer;