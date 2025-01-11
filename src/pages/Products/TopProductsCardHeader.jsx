import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const TopProductsCardHeader = ({ product }) => {
  return (
    <div className="p-4 w-full sm:w-[12rem] md:w-[14rem] lg:w-[18rem] xl:w-[26rem] transform transition-transform duration-300 hover:scale-105">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="group-hover:scale-105 rounded-lg w-full h-[10rem] sm:h-[12rem] md:h-[12rem] lg:h-[14rem] xl:h-[24rem] transform transition-transform object-cover"
        />
        <HeartIcon product={product} />
      </div>
      <Link to={`/product/${product._id}`} className="block group">
        <div className="flex justify-between items-center mt-2">
          <h2 className="font-medium text-gray-800 text-sm md:text-base lg:text-lg xl:text-xl dark:text-white truncate">
            {product.name}
          </h2>
          <span className="bg-pink-100 dark:bg-pink-800 px-2 py-0.5 rounded-full text-pink-800 text-xs md:text-sm lg:text-base dark:text-pink-300">
            ${product.price}
          </span>
        </div>
        {/* Navigation Icon (Right Arrow) */}
        <div className="flex items-center mt-2 text-pink-600 hover:text-pink-800 transition duration-200">
          <span className="mr-2 text-sm">Explore</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h14M12 5l7 7-7 7"
            />
          </svg>
        </div>
      </Link>
    </div>
  );
};

export default TopProductsCardHeader;
