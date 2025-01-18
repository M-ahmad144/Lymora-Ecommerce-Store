import { createSlice } from "@reduxjs/toolkit";

// Helper function to check if token has expired
const checkTokenExpiration = () => {
  const expirationTime = localStorage.getItem("expirationTime");
  if (expirationTime && new Date().getTime() > expirationTime) {
    // Token expired
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }
  // Return user info if token is not expired
  return JSON.parse(localStorage.getItem("userInfo"));
};

const initialState = {
  userInfo: checkTokenExpiration(),
  token: localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Save user credentials and set token expiration time
    setCredentials: (state, action) => {
      state.userInfo = action.payload.userInfo;
      state.token = action.payload.token;

      // Store user info and token in localStorage
      localStorage.setItem("userInfo", JSON.stringify(action.payload.userInfo));
      localStorage.setItem("token", action.payload.token);

      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
      localStorage.setItem("expirationTime", expirationTime);
    },

    // Log out user and clear localStorage
    logout: (state) => {
      state.userInfo = null;
      state.token = null;

      // Remove user info, token, and expiration time from localStorage
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
      localStorage.removeItem("expirationTime");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
