import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllCartItems,
  addToCart,
  removeCartItem,
  updateCartItem,
  clearCart
} from "../../services/cartService";

// Tạo async thunk actions
export const fetchCartItems = createAsyncThunk(
  "cart/fetchItems",
  async () => {
    try {
      const response = await getAllCartItems();
      return response.result.data;
    } catch (error) {
      console.log("error", error);
      return [];
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }) => {
    try {
      await addToCart(productId, quantity);
      const response = await getAllCartItems();
      return response.result.data;
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCart",
  async (productId) => {
    await removeCartItem(productId);
    const response = await getAllCartItems();
    return response.result.data;
  }
);

export const updateQuantityAsync = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, quantity }) => {
    await updateCartItem(productId, quantity);
    const response = await getAllCartItems();
    return response.result.data;
  }
);

export const clearCartAsync = createAsyncThunk(
  "cart/clearCart",
  async () => {
    await clearCart();
    return [];
  }
);

const initialState = {
  items: [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
  status: 'idle',
  error: null
};

const calculateTotals = (items) => {
  let quantity = 0;
  let total = 0;

  items.forEach((item) => {
    quantity += item.quantity;
    total += item?.product?.sellingPrice * item.quantity;
  });

  return { quantity, total };
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart: (state) => {
      state.items = [];
      state.cartTotalQuantity = 0;
      state.cartTotalAmount = 0;
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart items
      .addCase(fetchCartItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        const { quantity, total } = calculateTotals(action.payload);
        state.cartTotalQuantity = quantity;
        state.cartTotalAmount = total;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Add to cart
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.items = action.payload;
        const { quantity, total } = calculateTotals(action.payload);
        state.cartTotalQuantity = quantity;
        state.cartTotalAmount = total;
      })

      // Remove from cart
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.items = action.payload;
        const { quantity, total } = calculateTotals(action.payload);
        state.cartTotalQuantity = quantity;
        state.cartTotalAmount = total;
      })

      // Update quantity
      .addCase(updateQuantityAsync.fulfilled, (state, action) => {
        state.items = action.payload;
        const { quantity, total } = calculateTotals(action.payload);
        state.cartTotalQuantity = quantity;
        state.cartTotalAmount = total;
      })

      // Clear cart
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
        state.cartTotalQuantity = 0;
        state.cartTotalAmount = 0;
      })
  },
});

export const { resetCart } = cartSlice.actions;
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalQuantity = (state) => state.cart.cartTotalQuantity;
export const selectCartTotalAmount = (state) => state.cart.cartTotalAmount;
export const selectCartStatus = (state) => state.cart.status;
export const selectCartError = (state) => state.cart.error;

export default cartSlice.reducer;