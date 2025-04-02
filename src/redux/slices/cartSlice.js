import { createSlice } from "@reduxjs/toolkit";

// Lấy items từ localStorage khi khởi tạo state
const getItemsFromStorage = () => {
  try {
    const storedItems = localStorage.getItem("cartItems");
    return storedItems ? JSON.parse(storedItems) : [];
  } catch (error) {
    console.error("Lỗi khi đọc giỏ hàng từ localStorage:", error);
    return [];
  }
};

// Tính toán số lượng và tổng tiền ban đầu
const calculateInitialTotals = (items) => {
  let quantity = 0;
  let total = 0;

  items.forEach((item) => {
    quantity += item.quantity;
    total += item.price * item.quantity;
  });

  return { quantity, total };
};

const items = getItemsFromStorage();
const { quantity, total } = calculateInitialTotals(items);

const initialState = {
  items,
  cartTotalQuantity: quantity,
  cartTotalAmount: total,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.id === product.id
      );

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += quantity;
      } else {
        state.items.push({ ...product, quantity });
      }

      localStorage.setItem("cartItems", JSON.stringify(state.items));
      cartSlice.caseReducers.calculateTotals(state);
    },

    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
      localStorage.setItem("cartItems", JSON.stringify(state.items));
      cartSlice.caseReducers.calculateTotals(state);
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const itemIndex = state.items.findIndex((item) => item.id === id);

      if (itemIndex >= 0) {
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item.id !== id);
        } else {
          state.items[itemIndex].quantity = quantity;
        }
      }

      localStorage.setItem("cartItems", JSON.stringify(state.items));
      cartSlice.caseReducers.calculateTotals(state);
    },

    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cartItems");
      cartSlice.caseReducers.calculateTotals(state);
    },

    calculateTotals: (state) => {
      let quantity = 0;
      let total = 0;

      state.items.forEach((item) => {
        quantity += item.quantity;
        total += item.price * item.quantity;
      });

      state.cartTotalQuantity = quantity;
      state.cartTotalAmount = total;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalQuantity = (state) => state.cart.cartTotalQuantity;
export const selectCartTotalAmount = (state) => state.cart.cartTotalAmount;

export default cartSlice.reducer;
