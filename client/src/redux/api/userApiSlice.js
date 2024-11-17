import { aplSlice } from "./apiSlice";
import { USER_URL } from "../constants";

export const userApiSlice = aplSlice.injectEndpoints({
  endpoints: (builder) => ({
    //mutations: for creating, updating, and deleting data from the API
    login: builder.mutation({
      query: (data) => {
        url: `${USER_URL}/auth`;
        method: "POST";
        body: data;
      },
    }),
  }),
});

export const { useLoginMutation } = userApiSlice;
