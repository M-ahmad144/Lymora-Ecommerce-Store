import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./features/auth/authSlice";
import favoriteReducer from "./features/favorites/favoritesSlice";
import cartSlicer from "./features/cart/cartSlice";

import { getFavoritesFromLocalStorage } from "../utils/localStorage";

const favorites = getFavoritesFromLocalStorage() || [];
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    favorites: favoriteReducer,
    cart: cartSlicer,
  },

  preloadedState: {
    favorites: favorites,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch); // Enable focus/refetch behaviors

export default store;
