import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
const ProductUpdate = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { data: productData, isLoading } = useGetProductByIdQuery(params.id);
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");

  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  // Populate form with product data on load
  useEffect(() => {
    if (productData) {
      setImage(productData.image || "");
      setName(productData.name || "");
      setDescription(productData.description || "");
      setPrice(productData.price || "");
      setCategory(productData.category?._id || "");
      setQuantity(productData.quantity || "");
      setBrand(productData.brand || "");
      setStock(productData.countInStock || "");
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();

      toast.success("Image uploaded successfully");
      setImage(res.image);
    } catch (err) {
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      const data = await updateProduct({
        productId: params.id,
        formData,
      }).unwrap();

      toast.success("Product successfully updated");
      navigate("/admin/allproducts");
    } catch (err) {
      toast.error("Product update failed. Try again.");
    }
  };

  const handleDelete = async () => {
    try {
      const confirmation = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!confirmation) return;

      const { data } = await deleteProduct(params.id);
      toast.success(`"${data.name}" has been deleted successfully`);
      navigate("/admin/allproducts");
    } catch (err) {
      toast.error("Delete failed. Try again.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="sm:mx-[0] xl:mx-[9rem] container">
        <div className="flex md:flex-row flex-col">
          <AdminMenu />
          <div className="p-3 w-full md:w-3/4">
            <h2 className="mb-4 font-bold text-2xl text-center text-pink-500 text-pretty">
              Update / Delete Product
            </h2>

            {image && (
              <div className="mb-4 text-center">
                <img
                  src={image}
                  alt="product"
                  className="block mx-auto w-full max-w-xs md:max-w-md h-[40%]"
                />
              </div>
            )}

            <div className="mb-3">
              <label className="block border-2 border-white px-6 py-3 border-transparent hover:border-blue-500 focus:border-blue-500 rounded-lg w-full font-bold text-center text-white cursor-pointer focus:outline-none">
                {image ? "Change image" : "Upload image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className="hidden"
                />
              </label>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-3">
                {/* Two textboxes in one row for large screens */}
                <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mb-4">
                  <div className="w-full">
                    <label>Name</label>
                    <input
                      type="text"
                      className="bg-[#101011] p-4 border rounded-lg w-full text-white"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="w-full">
                    <label>Price</label>
                    <input
                      type="number"
                      className="bg-[#101011] p-4 border rounded-lg w-full text-white"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </div>

                {/* Another set of two textboxes */}
                <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mb-4">
                  <div className="w-full">
                    <label>Quantity</label>
                    <input
                      type="number"
                      min="1"
                      className="bg-[#101011] p-4 border rounded-lg w-full text-white"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>

                  <div className="w-full">
                    <label>Brand</label>
                    <input
                      type="text"
                      className="bg-[#101011] p-4 border rounded-lg w-full text-white"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    />
                  </div>
                </div>

                <label>Description</label>
                <textarea
                  className="bg-[#101011] mb-4 p-2 border rounded-lg w-full text-white"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                {/* Last set of two textboxes */}
                <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mb-4">
                  <div className="w-full">
                    <label>Count in Stock</label>
                    <input
                      type="text"
                      className="bg-[#101011] p-4 border rounded-lg w-full text-white"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>

                  <div className="w-full">
                    <label>Category</label>
                    <select
                      className="bg-[#101011] p-4 border rounded-lg w-full text-white"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    type="submit"
                    className="bg-green-600 mt-5 mb-4 md:mb-0 px-10 py-4 rounded-lg w-full md:w-auto font-bold text-lg"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-pink-600 mt-5 mb-4 md:mb-0 px-10 py-4 rounded-lg w-full md:w-auto font-bold text-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductUpdate;
