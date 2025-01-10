import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="p-4 w-full sm:w-[12rem] md:w-[16rem] lg:w-[20rem] xl:w-[24rem]">
      <Link to={`/product/${product._id}`} className="block group">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="group-hover:scale-105 rounded-lg w-full h-[10rem] sm:h-[12rem] md:h-[12rem] lg:h-[14rem] xl:h-[24rem] transform transition-transform object-cover"
          />
          <HeartIcon product={product} />
        </div>

        <div className="mt-2">
          <h2 className="flex justify-between items-center font-medium text-gray-800 text-sm md:text-base lg:text-lg xl:text-xl dark:text-white">
            <span className="truncate">{product.name}</span>
            <span className="bg-pink-100 dark:bg-pink-800 px-2 py-0.5 rounded-full text-pink-800 text-xs md:text-sm lg:text-base dark:text-pink-300">
              ${product.price}
            </span>
          </h2>
        </div>
      </Link>
    </div>
  );
};

export default SmallProduct;
