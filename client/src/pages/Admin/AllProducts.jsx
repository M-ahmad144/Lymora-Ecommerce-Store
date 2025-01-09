import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productSlice";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="font-bold text-2xl text-gray-800">
          Something went wrong
        </h1>
      </div>
    );
  }

  return (
    <>
      <div className="mx-4 md:mx-[9rem] container">
        <div className="flex md:flex-row flex-col">
          <div className="p-3">
            <div className="mb-4 ml-0 md:ml-[2rem] h-12 font-bold text-gray-900 text-xl">
              All Products ({products.length})
            </div>
            <div className="flex flex-wrap justify-center md:justify-around items-center gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="block shadow-lg hover:shadow-xl mb-6 rounded-lg w-full max-w-xs transition-shadow duration-300 overflow-hidden"
                >
                  <Link
                    to={`/admin/product/update/${product._id}`}
                    className="flex md:flex-row flex-col hover:bg-gray-50 p-4 rounded-lg transition-colors duration-300"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="mb-4 md:mb-0 rounded-lg w-full md:w-[10rem] h-auto object-cover"
                    />
                    <div className="flex flex-col justify-between p-4">
                      <div className="flex md:flex-row flex-col justify-between mb-4">
                        <h5 className="mb-2 font-semibold text-2xl text-gray-900">
                          {product?.name}
                        </h5>
                        <p className="text-gray-500 text-xs">
                          {moment(product.createdAt).format("MMMM Do YYYY")}
                        </p>
                      </div>

                      <p className="mb-4 text-gray-600 text-sm md:text-base leading-relaxed">
                        {product?.description?.substring(0, 160)}...
                      </p>

                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-lg text-pink-700">
                          ${product?.price}
                        </p>
                        <span className="inline-flex items-center bg-pink-700 hover:bg-pink-800 dark:hover:bg-pink-700 dark:bg-pink-600 px-4 py-2 rounded-lg font-medium text-sm text-white transition-colors duration-300 cursor-pointer">
                          Update Product
                          <svg
                            className="ml-2 w-3.5 h-3.5"
                            aria-hidden="true"
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
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2 p-3 md:w-1/4">
            <AdminMenu />
          </div>
        </div>
      </div>
    </>
  );
};

export default AllProducts;
