import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import TopProductsCardHeader from "../pages/Products/TopProductsCardHeader";
import ProductCarousel from "../pages/Products/ProductCarousel";
import { FaShoppingBag } from "react-icons/fa";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return (
      <div className="place-items-center grid h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center">
        <h1 className="font-bold text-2xl text-red-500">
          <p className="text-center"> Something went wrong</p>
        </h1>
      </div>
    );
  }

  return (
    <>
      {/* Header Section */}
      <div className="flex md:flex-row flex-col justify-between items-center bg-pink-800 bg-opacity-40 shadow-lg backdrop-blur-lg mx-4 md:mx-40 p-6 rounded-lg">
        <div className="flex items-center gap-4 md:ml-16">
          <h1 className="font-bold text-3xl text-white md:text-4xl">LYMORA</h1>
        </div>

        {/* Welcome Message */}
        <div className="flex flex-col items-center mb-4 md:mb-0 text-lg text-white">
          <p className="bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600 font-semibold text-3xl text-transparent md:text-4xl animate-pulse">
            Welcome to LYMORA!
          </p>
          <p className="mt-2 font-light text-base text-slate-100 md:text-xl italic tracking-wide">
            Find the best products just for you
          </p>
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
            <TopProductsCardHeader key={product._id} product={product} />
          ))}
        </div>
        <ProductCarousel />
      </div>

      {/* For smaller screens, show only small products */}
      <div className="gap-4 md:hidden grid grid-cols-2 my-8 px-2">
        {data.map((product) => (
          <TopProductsCardHeader key={product._id} product={product} />
        ))}
      </div>
    </>
  );
};

export default Header;
