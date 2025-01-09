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
  const { data: productData } = useGetProductByIdQuery(params._id);

  const [image, setImage] = useState(productData?.image || "");
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(
    productData?.description || ""
  );
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [stock, setStock] = useState(productData?.countInStock);

  const navigate = useNavigate();

  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category?._id);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
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

      const data = await updateProduct({ productId: params._id, formData });

      if (data?.error) {
        toast.error(data.error, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      } else {
        toast.success(`Product successfully updated`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        navigate("/admin/allproductslist");
      }
    } catch (err) {
      toast.error("Product update failed. Try again.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;

      const { data } = await deleteProduct(params._id);
      toast.success(`"${data.name}" is deleted`, {
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

  return (
    <div className="mx-auto sm:px-6 lg:px-8 xl:px-20 p-4 container">
      <div className="flex md:flex-row flex-col">
        <AdminMenu />
        <div className="p-3 md:w-3/4">
          <h1 className="mb-4 font-bold text-2xl">Update / Delete Product</h1>

          {image && (
            <div className="mb-4 text-center">
              <img
                src={image}
                alt="product"
                className="mx-auto w-full max-w-md"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-2 font-bold text-white">
              {image ? image.name : "Upload image"}
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={uploadFileHandler}
              className="block border-gray-700 bg-gray-800 p-2 border rounded-lg w-full text-white"
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
              <div className="mb-4">
                <label htmlFor="name" className="block font-bold text-white">
                  Name
                </label>
                <input
                  type="text"
                  className="border-gray-700 bg-gray-800 p-3 border rounded-lg w-full text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="price" className="block font-bold text-white">
                  Price
                </label>
                <input
                  type="number"
                  className="border-gray-700 bg-gray-800 p-3 border rounded-lg w-full text-white"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="quantity"
                  className="block font-bold text-white"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  className="border-gray-700 bg-gray-800 p-3 border rounded-lg w-full text-white"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="brand" className="block font-bold text-white">
                  Brand
                </label>
                <input
                  type="text"
                  className="border-gray-700 bg-gray-800 p-3 border rounded-lg w-full text-white"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block font-bold text-white"
                >
                  Description
                </label>
                <textarea
                  className="border-gray-700 bg-gray-800 p-3 border rounded-lg w-full text-white"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="countInStock"
                  className="block font-bold text-white"
                >
                  Count In Stock
                </label>
                <input
                  type="number"
                  className="border-gray-700 bg-gray-800 p-3 border rounded-lg w-full text-white"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="category"
                  className="block font-bold text-white"
                >
                  Category
                </label>
                <select
                  className="border-gray-700 bg-gray-800 p-3 border rounded-lg w-full text-white"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                >
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                type="submit"
                className="bg-green-600 px-10 py-4 rounded-lg font-bold text-lg text-white"
              >
                Update
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 px-10 py-4 rounded-lg font-bold text-lg text-white"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
