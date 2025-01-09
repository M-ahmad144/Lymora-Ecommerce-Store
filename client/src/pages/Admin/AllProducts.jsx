import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productSlice";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (isError) {
    toast.error("Failed to fetch products.", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-xl">
          Error loading products. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-6 container">
      <div className="flex md:flex-row flex-col">
        {/* Product List */}
        <div className="p-4 md:w-3/4">
          <div className="mb-4 font-bold text-xl">
            All Products ({products.length})
          </div>

          <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/admin/product/update/${product._id}`}
                className="block bg-white shadow-md rounded-lg overflow-hidden"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between">
                    <h5 className="font-semibold text-lg">{product?.name}</h5>
                    <p className="text-gray-400 text-xs">
                      {moment(product.createdAt).format("MMMM Do YYYY")}
                    </p>
                  </div>
                  <p className="mb-4 text-gray-600 text-sm">
                    {product?.description?.substring(0, 100)}...
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-green-600 text-xl">
                      ${product?.price}
                    </p>
                    <Link
                      to={`/admin/product/update/${product._id}`}
                      className="inline-flex items-center bg-pink-700 hover:bg-pink-800 px-4 py-2 rounded-lg text-white focus:outline-none"
                    >
                      Update
                      <svg
                        className="ml-2 w-3 h-3"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Admin Menu */}
        <div className="p-4 md:w-1/4">
          <AdminMenu />
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
