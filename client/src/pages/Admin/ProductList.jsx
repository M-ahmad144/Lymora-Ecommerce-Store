import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const data = await createProduct(productData);
      if (data.error) {
        toast.error("Product create failed. Try Again.");
      } else {
        toast.success(`${data?.data?.product?.name} is created`);
        navigate("/admin/allproducts");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product create failed. Try Again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="sm:mx-[0] xl:mx-[9rem] container">
      <div className="flex md:flex-row flex-col">
        <AdminMenu />
        <div className="p-3 w-full md:w-3/4">
          <div className="h-12 font-bold text-3xl text-center text-pink-500">
            Create Product
          </div>

          {imageUrl && (
            <div className="text-center">
              <img
                src={imageUrl}
                alt="product"
                className="block mx-auto mb-3 max-h-[200px]"
              />
            </div>
          )}

          {/* upload image */}
          <div className="mb-3">
            <label className="flex justify-center items-center px-4 py-11 border rounded-lg w-full font-bold text-center text-white cursor-pointer">
              {image ? image.name : "Upload Image"}

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className={
                  !image
                    ? "hidden"
                    : "text-white flex justify-center items-center"
                }
              />
            </label>
          </div>

          <div className="p-3">
            {/* Name and Price */}
            <div className="flex gap-4 mb-3">
              <div className="w-full md:w-1/2">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="bg-[#101011] mb-3 p-4 border rounded-lg w-full text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="w-full md:w-1/2">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  className="bg-[#101011] mb-3 p-4 border rounded-lg w-full text-white"
                  value={price}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value >= 0 || value === "") {
                      setPrice(value);
                    }
                  }}
                />
              </div>
            </div>

            {/* Quantity and Brand */}
            <div className="flex gap-4 mb-3">
              <div className="w-full md:w-1/2">
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  className="bg-[#101011] mb-3 p-4 border rounded-lg w-full text-white"
                  value={quantity}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value >= 0 || value === "") {
                      setQuantity(value);
                    }
                  }}
                />
              </div>
              <div className="w-full md:w-1/2">
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  className="bg-[#101011] mb-3 p-4 border rounded-lg w-full text-white"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-3">
              <label htmlFor="description" className="block my-5">
                Description
              </label>
              <textarea
                type="text"
                className="bg-[#101011] mb-3 p-2 border rounded-lg w-full text-white"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Count In Stock and Category */}
            <div className="flex gap-4 mb-3">
              <div className="w-full md:w-1/2">
                <label htmlFor="countInStock">Count In Stock</label>
                <input
                  type="number"
                  className="bg-[#101011] mb-3 p-4 border rounded-lg w-full text-white"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div className="w-full md:w-1/2">
                <label htmlFor="category">Category</label>
                <select
                  placeholder="Choose Category"
                  className="bg-[#101011] mb-3 p-4 border rounded-lg w-full text-white"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                >
                  <option value="" disabled>
                    Select the category
                  </option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="bg-pink-600 mt-5 px-10 py-4 rounded-lg w-full md:w-auto font-bold text-lg"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
