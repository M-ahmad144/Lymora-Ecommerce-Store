import { PRODUCT_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch products with an optional keyword filter
    getProducts: builder.query({
      query: ({ keyword }) => ({
        url: PRODUCT_URL,
        params: { keyword },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Products"],
      invalidatesTags: ["Products"],
    }),

    // Fetch a single product by ID
    getProductById: builder.query({
      query: (productId) => `${PRODUCT_URL}/${productId}`,

      providesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),

    // Fetch all products
    allProducts: builder.query({
      query: () => `${PRODUCT_URL}/allProducts`,
      keepUnusedDataFor: 5,
      providesTags: ["Products"],
      invalidatesTags: ["Products"],
    }),

    // Fetch product details by ID
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    // Create a new product
    createProduct: builder.mutation({
      query: (productData) => ({
        url: PRODUCT_URL,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Products"],
    }),

    // Update a product by ID
    updateProduct: builder.mutation({
      query: ({ productId, formData }) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
      ],
    }),

    // Upload a product image
    uploadProductImage: builder.mutation({
      query: (formData) => ({
        url: UPLOAD_URL,
        method: "POST",
        body: formData,
      }),
    }),

    // Delete a product by ID
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "DELETE",
      }),
      providesTags: ["Products"],
    }),

    // Create a review for a product
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
    }),

    // Get top products (e.g., popular)
    getTopProducts: builder.query({
      query: () => `${PRODUCT_URL}/top`,
      keepUnusedDataFor: 5,
    }),

    // Get new products (e.g., newly added products)
    getNewProducts: builder.query({
      query: () => `${PRODUCT_URL}/new`,
      keepUnusedDataFor: 5,
    }),

    // Get filtered products based on category and price range
    getFilteredProducts: builder.query({
      query: ({ checked, radio }) => ({
        url: `${PRODUCT_URL}/filtered-products`,
        method: "POST",
        body: { checked, radio },
      }),
    }),
  }),
});

export const {
  useGetProductByIdQuery,
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useGetNewProductsQuery,
  useUploadProductImageMutation,
  useGetFilteredProductsQuery,
} = productApiSlice;
