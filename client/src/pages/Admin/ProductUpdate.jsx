import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

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
      toast.success("Image uploaded successfully", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      setImage(res.image);
    } catch (err) {
      toast.error("Image upload failed", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
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

      toast.success("Product successfully updated", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      navigate("/admin/allproductslist");
    } catch (err) {
      toast.error("Product update failed. Try again.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  const handleDelete = async () => {
    try {
      const confirmation = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!confirmation) return;

      const { data } = await deleteProduct(params.id);
      toast.success(`"${data.name}" has been deleted`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      navigate("/admin/allproductslist");
    } catch (err) {
      toast.error("Delete failed. Try again.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="sm:mx-[0] xl:mx-[9rem] container">
        <div className="flex md:flex-row flex-col">
          <AdminMenu />
          <div className="p-3 md:w-3/4">
            <h2 className="h-12">Update / Delete Product</h2>

            {image && (
              <div className="text-center">
                <img
                  src={image}
                  alt="product"
                  className="block mx-auto w-full h-[40%]"
                />
              </div>
            )}

            <div className="mb-3">
              <label className="block px-4 py-11 rounded-lg w-full font-bold text-center text-white cursor-pointer">
                {image ? "Change image" : "Upload image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className="hidden text-white"
                />
              </label>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-3">
                <div className="flex flex-wrap">
                  <div>
                    <label>Name</label>
                    <input
                      type="text"
                      className="bg-[#101011] mr-[5rem] mb-3 p-4 border rounded-lg w-[30rem] text-white"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Price</label>
                    <input
                      type="number"
                      className="bg-[#101011] mb-3 p-4 border rounded-lg w-[30rem] text-white"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap">
                  <div>
                    <label>Quantity</label>
                    <input
                      type="number"
                      min="1"
                      className="bg-[#101011] mr-[5rem] mb-3 p-4 border rounded-lg w-[30rem] text-white"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Brand</label>
                    <input
                      type="text"
                      className="bg-[#101011] mb-3 p-4 border rounded-lg w-[30rem] text-white"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    />
                  </div>
                </div>

                <label>Description</label>
                <textarea
                  className="bg-[#101011] mb-3 p-2 border rounded-lg w-[95%] text-white"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <div className="flex justify-between">
                  <div>
                    <label>Count in Stock</label>
                    <input
                      type="text"
                      className="bg-[#101011] mb-3 p-4 border rounded-lg w-[30rem] text-white"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Category</label>
                    <select
                      className="bg-[#101011] mr-[5rem] mb-3 p-4 border rounded-lg w-[30rem] text-white"
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

                <div>
                  <button
                    type="submit"
                    className="bg-green-600 mt-5 mr-6 px-10 py-4 rounded-lg font-bold text-lg"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-pink-600 mt-5 px-10 py-4 rounded-lg font-bold text-lg"
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
