import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeCart = async (cart) => {
  try {
    await AsyncStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.log("Error storing cart:", error);
  }
};

export const CartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const itemPresent = state.cart.find(
        (item) => item.id === action.payload.id
      );
      if (itemPresent) {
        itemPresent.quantity++;
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
      }
      storeCart(state.cart); // Save the updated cart
    },
    removeFromCart: (state, action) => {
      const removeItem = state.cart.filter(
        (item) => item.id !== action.payload.id
      );
      state.cart = removeItem;
      storeCart(state.cart); // Save the updated cart
    },
    incementQuantity: (state, action) => {
      const itemPresent = state.cart.find(
        (item) => item.id === action.payload.id
      );
      itemPresent.quantity++;
      storeCart(state.cart); // Save the updated cart
    },
    decrementQuantity: (state, action) => {
      const itemPresent = state.cart.find(
        (item) => item.id === action.payload.id
      );
      if (itemPresent.quantity === 1) {
        itemPresent.quantity = 0;
        const removeItem = state.cart.filter(
          (item) => item.id !== action.payload.id
        );
        state.cart = removeItem;
      } else {
        itemPresent.quantity--;
      }
      storeCart(state.cart); // Save the updated cart
    },
    cleanCart: (state) => {
      state.cart = [];
      storeCart(state.cart); // Save the updated cart
    },
    setCart: (state, action) => {
      state.cart = action.payload;
    }
  },
});

export const { addToCart, removeFromCart, incementQuantity, decrementQuantity, cleanCart, setCart } = CartSlice.actions;

export default CartSlice.reducer;
