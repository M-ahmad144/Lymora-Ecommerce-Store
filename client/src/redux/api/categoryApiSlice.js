import apiSlice from "./apiSlice";
import { CATEGORY_URL } from "../constants";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: `${CATEGORY_URL}`,
        method: "POST",
        body: newCategory,
      }),
      // Invalidates the cached 'Category' data when creating a new category
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),

    updateCategory: builder.mutation({
      query: ({ categoryId, updatedCategory }) => ({
        url: `${CATEGORY_URL}/${categoryId}`,
        method: "PUT",
        body: updatedCategory,
      }),
      // Invalidates the cached 'Category' data when updating a category
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),

    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `${CATEGORY_URL}/${categoryId}`,
        method: "DELETE",
      }),
      // Invalidates the cached 'Category' data when deleting a category
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),

    fetchCategories: builder.query({
      query: () => `${CATEGORY_URL}`,
      // Provides the cached 'Category' data with a tag
      providesTags: (result = [], error) => [
        { type: "Category", id: "LIST" },
        ...result.map(({ id }) => ({ type: "Category", id })),
      ],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} = categoryApiSlice;
