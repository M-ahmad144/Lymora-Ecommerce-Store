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

  const [image, setImage] = useState(null); // This will hold the image file.
  const [imageUrl, setImageUrl] = useState(""); // This will hold the image URL (after upload).
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  // Populate form with product data on load
  useEffect(() => {
    if (productData) {
      setImageUrl(productData.image || "");
      setName(productData.name || "");
      setDescription(productData.description || "");
      setPrice(productData.price || "");
      setCategory(productData.category || "");
      setQuantity(productData.quantity || "");
      setBrand(productData.brand || "");
      setStock(productData.countInStock || "");
    }
  }, [productData]);

  // Upload image handler
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setIsLoading(true);
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully");
      setImage(file);
      setImageUrl(res.imageUrl); // Set the image URL after upload.
    } catch (err) {
      toast.error("Image upload failed");
    }
  };

  // Handle product update form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("quantity", quantity);
    formData.append("brand", brand);
    formData.append("countInStock", stock);
    formData.append("imageUrl", imageUrl);

    try {
      await updateProduct({
        productId: params.id,
        formData,
      }).unwrap();

      toast.success("Product successfully updated");
      navigate("/admin/allproducts");
    } catch (err) {
      toast.error("Product update failed. Try again.");
    }
  };

  // Handle product deletion
  const handleDelete = async () => {
    try {
      await deleteProduct(params.id).unwrap();
      toast.success(`"${name}" has been deleted successfully`);
      setIsModalOpen(false);
      navigate("/admin/allproducts");
    } catch (err) {
      toast.error("Delete failed. Try again.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  // Modal open/close
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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

            {imageUrl && (
              <div className="mb-4 text-center">
                <img
                  src={imageUrl}
                  alt="product"
                  className="block mx-auto w-full max-w-xs md:max-w-md h-[40%]"
                />
              </div>
            )}

            <div className="mb-3">
              <label className="block border-2 border-white px-6 py-3 border-transparent hover:border-blue-500 focus:border-blue-500 rounded-lg w-full font-bold text-center text-white cursor-pointer focus:outline-none">
                {image ? image.name : loading ? "Uploading..." : "Upload Image"}
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
                    {isUpdating ? "Updating..." : "Update"}
                  </button>
                  <button
                    type="button"
                    onClick={openModal}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-black shadow-lg p-6 rounded w-full max-w-sm">
            <h2 className="mb-4 font-bold text-lg">Confirm Delete</h2>
            <p className="mb-6">
              Are you sure you want to delete <strong>{name}</strong>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductUpdate;
