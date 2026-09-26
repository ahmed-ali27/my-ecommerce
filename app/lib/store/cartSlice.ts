import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Api/api"; // أو مسار ملف axios الخاص بك
import axios from "axios";

export interface CartProduct {
  _id: string;
  title: string;
  imageCover: string;
  category?: { name: string } | null;
}

export interface CartItem {
  _id: string;
  product: CartProduct;
  price: number;
  count: number;
}

export interface CartData {
  _id: string;
  products: CartItem[];
  totalCartPrice: number;
}

interface CartApiResponse {
  data: CartData;
  numOfCartItems?: number;
}

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || fallback;
  }
  return fallback;
}

interface CartState {
  cartData: CartData | null;
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
export const getCart = createAsyncThunk<CartApiResponse, void, { rejectValue: string }>(
  "cart/getCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<CartApiResponse>("/cart");
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to fetch cart"));
    }
  }
);

// 2. إضافة منتج للسلة
export const addToCart = createAsyncThunk<unknown, string, { rejectValue: string }>(
  "cart/addToCart",
  async (productId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post<unknown>("/cart", { productId });
      // إعادة الجلب تجعل بيانات السلة والعداد متطابقين مع استجابة الخادم
      dispatch(getCart()); // إعادة تحديث السلة تلقائياً
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to add to cart"));
    }
  }
);

// 3. حذف عنصر من السلة
export const removeCartItem = createAsyncThunk<unknown, string, { rejectValue: string }>(
  "cart/removeCartItem",
  async (productId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.delete<unknown>(`/cart/${productId}`);
      dispatch(getCart());
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to remove item"));
    }
  }
);

// 4. تحديث كمية المنتج
export const updateCartQuantity = createAsyncThunk<
  unknown,
  { productId: string; count: number },
  { rejectValue: string }
>(
  "cart/updateCartQuantity",
  async ({ productId, count }: { productId: string; count: number }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.put<unknown>(`/cart/${productId}`, { count });
      dispatch(getCart());
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to update quantity"));
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
        state.error = action.payload || "Failed to fetch cart";
      });
  },
});

export default cartSlice.reducer;