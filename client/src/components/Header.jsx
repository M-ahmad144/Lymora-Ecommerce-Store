import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";
import { FaShoppingBag } from "react-icons/fa"; // Added icon

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center">
        <h1 className="font-bold text-2xl text-red-500">
          Something went wrong
        </h1>
      </div>
    );
  }

  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center bg-pink-800 bg-opacity-40 shadow-lg backdrop-blur-lg mx-40 p-6 rounded-lg">
        {/* Logo and Icon Section */}
        <div className="flex items-center gap-4 ml-16">
          <h1 className="font-bold text-3xl text-white">LYMORA</h1>
        </div>

        {/* Shopping Icon */}
        <div className="text-2xl text-white hover:text-gray-300 transition duration-300 cursor-pointer">
          <FaShoppingBag />
        </div>
      </div>

      {/* For larger screens, show both carousel and small products */}
      <div className="md:flex justify-around hidden my-8 md:ml-10">
        <div className="gap-4 grid grid-cols-2">
          {data.map((product) => (
            <SmallProduct key={product._id} product={product} />
          ))}
        </div>
        <ProductCarousel />
      </div>

      {/* For smaller screens, show only small products */}
      <div className="gap-4 md:hidden grid grid-cols-2 my-8 px-2">
        {data.map((product) => (
          <SmallProduct key={product._id} product={product} />
        ))}
      </div>
    </>
  );
};

export default Header;
