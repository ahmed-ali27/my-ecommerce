import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Api/api"; // أو مسار ملف axios الخاص بك

interface CartState {
  cartData: any;
  numOfCartItems: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cartData: null,
  numOfCartItems: 0,
  loading: false,
  error: null,
};

// 1. جلب بيانات السلة
export const getCart = createAsyncThunk(
  "cart/getCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/cart");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch cart");
    }
  }
);

// 2. إضافة منتج للسلة
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (productId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/cart", { productId });
      dispatch(getCart()); // إعادة تحديث السلة تلقائياً
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add to cart");
    }
  }
);

// 3. حذف عنصر من السلة
export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (productId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.delete(`/cart/${productId}`);
      dispatch(getCart());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove item");
    }
  }
);

// 4. تحديث كمية المنتج
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ productId, count }: { productId: string; count: number }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.put(`/cart/${productId}`, { count });
      dispatch(getCart());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update quantity");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Cart
      .addCase(getCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartData = action.payload.data;
        state.numOfCartItems = action.payload.numOfCartItems || 0;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default cartSlice.reducer;