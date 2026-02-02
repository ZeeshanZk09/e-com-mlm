import { createSlice, configureStore, type PayloadAction } from '@reduxjs/toolkit';

export type TCartItem = {
  productId: string;
  quantity: number;
  productName?: string;
  imgUrl?: string;
  price?: number;
  dealPrice?: number;
};

export type TCartState = {
  items: TCartItem[];
  isVisible: boolean;
};

const initialState: TCartState = {
  items: [],
  isVisible: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<TCartItem>) => {
      const existingItem = state.items.find((item) => item.productId === action.payload.productId);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    remove: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.productId !== action.payload);
    },
    modifyQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find((item) => item.productId === action.payload.productId);
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i.productId !== action.payload.productId);
        }
      }
    },
    toggleCart: (state, action: PayloadAction<boolean>) => {
      state.isVisible = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { add, remove, modifyQuantity, toggleCart, clearCart } = cartSlice.actions;

export const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default cartSlice.reducer;
