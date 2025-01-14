import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const CreateProduct = () => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null); // Store the uploaded image URL
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!imageUrl) {
      toast.error("Please upload an image first.");
      setIsSubmitting(false);
      return;
    }

    try {
      // FormData for product data including image URL
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);
      productData.append("imageUrl", imageUrl);

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product creation failed. Please try again.");
      } else {
        toast.success(`${data.name} has been created successfully.`);
        navigate("/admin/allproducts");
      }
    } catch (error) {
      console.error("Error during product creation:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle image upload and save the URL
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      toast.error("Please select a valid image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully!");
      setImage(file);
      setImageUrl(res.imageUrl); // Set the image URL returned by backend
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(error?.data?.message || "Image upload failed. Try again.");
    }
  };

  return (
    <div className="sm:mx-[0] xl:mx-[9rem] container">
      <div className="flex md:flex-row flex-col">
        <AdminMenu />
        <div className="p-3 w-full md:w-3/4">
          <h2 className="mb-5 h-12 font-bold text-3xl text-pink-700">
            Create Product
          </h2>

          {imageUrl && (
            <div className="mb-3 text-center">
              <img
                src={imageUrl}
                alt="product"
                className="block mx-auto w-full max-h-[200px] object-contain"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="block hover:bg-gray-950 px-4 py-2 border rounded-lg w-full font-bold text-center text-white cursor-pointer">
              {image ? image.name : "Upload Image"}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className="hidden"
              />
            </label>
          </div>

          <form onSubmit={handleSubmit} className="p-3">
            <div className="flex flex-wrap md:flex-nowrap">
              <div className="mb-3 w-full md:w-1/2">
                <label htmlFor="name">Name</label> <br />
                <input
                  type="text"
                  className="bg-[#101011] mb-3 p-4 border rounded-lg w-full text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3 md:ml-10 w-full md:w-1/2">
                <label htmlFor="price">Price</label> <br />
                <input
                  type="number"
                  className="bg-[#101011] mb-3 p-4 border rounded-lg w-full text-white"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-wrap md:flex-nowrap">
              <div className="mb-3 w-full md:w-1/2">
                <label htmlFor="quantity">Quantity</label> <br />
                <input
                  type="number"
                  className="bg-[#101011] mb-3 p-4 border rounded-lg w-full text-white"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3 md:ml-10 w-full md:w-1/2">
                <label htmlFor="brand">Brand</label> <br />
                <input
                  type="text"
                  className="bg-[#101011] mb-3 p-4 border rounded-lg w-full text-white"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                />
              </div>
            </div>

            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="bg-[#101011] mb-3 p-2 border rounded-lg w-full text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>

            <div className="flex flex-wrap md:flex-nowrap justify-between space-x-10">
              <div className="mb-3 w-full md:w-1/2">
                <label htmlFor="stock">Count In Stock</label> <br />
                <input
                  type="number"
                  className="bg-[#101011] mb-3 p-4 border rounded-lg w-full text-white"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3 w-full md:w-1/2">
                <label htmlFor="category">Category</label> <br />
                <select
                  id="category"
                  className="bg-[#101011] mb-3 p-4 border rounded-lg w-full text-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select Category
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
              type="submit"
              className={`bg-pink-600 mt-5 px-10 py-4 rounded-lg font-bold text-lg w-full md:w-auto ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
