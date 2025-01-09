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
      console.log(data);
      if (data.error) {
        toast.error("Product create failed. Try Again.");
      } else {
        toast.success(`${data?.data?.product?.name} is created`);
        // navigate("/");
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
        <div className="p-3 md:w-3/4">
          <div className="h-12">Create Product</div>

          {imageUrl && (
            <div className="text-center">
              <img
                src={imageUrl}
                alt="product"
                className="block mx-auto max-h-[200px]"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="block px-4 py-11 border rounded-lg w-full font-bold text-center text-white cursor-pointer">
              {image ? image.name : "Upload Image"}

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className={!image ? "hidden" : "text-white"}
              />
            </label>
          </div>

          <div className="p-3">
            <div className="flex flex-wrap">
              <div className="one">
                <label htmlFor="name">Name</label> <br />
                <input
                  type="text"
                  className="bg-[#101011] mb-3 p-4 border rounded-lg w-[30rem] text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="ml-10 two">
                <label htmlFor="price" className="block">
                  Price
                </label>{" "}
                <br />
                <input
                  type="number"
                  className="bg-[#101011] mb-3 p-4 border rounded-lg w-[30rem] text-white"
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
            <div className="flex flex-wrap">
              <div className="one">
                <label htmlFor="name block">Quantity</label> <br />
                <input
                  type="number"
                  className="bg-[#101011] mb-3 p-4 border rounded-lg w-[30rem] text-white"
                  value={quantity}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value >= 0 || value === "") {
                      setQuantity(value);
                    }
                  }}
                />
              </div>
              <div className="ml-10 two">
                <label htmlFor="name block">Brand</label> <br />
                <input
                  type="text"
                  className="bg-[#101011] mb-3 p-4 border rounded-lg w-[30rem] text-white"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>

            <label htmlFor="" className="my-5">
              Description
            </label>
            <textarea
              type="text"
              className="bg-[#101011] mb-3 p-2 border rounded-lg w-[95%] text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <div className="flex justify-between">
              <div>
                <label htmlFor="name block">Count In Stock</label> <br />
                <input
                  type="text"
                  className="bg-[#101011] mb-3 p-4 border rounded-lg w-[30rem] text-white"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="">Category</label> <br />
                <select
                  placeholder="Choose Category"
                  className="bg-[#101011] mb-3 p-4 border rounded-lg w-[30rem] text-white"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category} // Ensure the selected value is controlled
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
              className="bg-pink-600 mt-5 px-10 py-4 rounded-lg font-bold text-lg"
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
