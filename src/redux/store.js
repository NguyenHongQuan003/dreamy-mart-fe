import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    // Thêm các reducer khác tại đây nếu cần
  },
});
