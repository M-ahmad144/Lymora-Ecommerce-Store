import { createSlice } from "@reduxjs/toolkit";

const checkTokenExpiration = () => {
  const expirationTime = localStorage.getItem("expirationTime");
  if (expirationTime && new Date().getTime() > expirationTime) {
    // Token expired
    localStorage.removeItem("userInfo");
    localStorage.removeItem("expirationTime");
    return null;
  }
  return JSON.parse(localStorage.getItem("userInfo"));
};

const initialState = {
  userInfo: checkTokenExpiration(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Save user credentials and set expiration time
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));

      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
      localStorage.setItem("expirationTime", expirationTime);
    },

    // Log out user and clear localStorage
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("expirationTime");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
