import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ product }) => {
  return (
    <div className="relative ml-[2rem] p-3 w-[30rem] transform transition-transform duration-300 hover:scale-105">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="rounded w-[30rem]"
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center">
            <div className="text-lg">{product.name}</div>
            <span className="bg-pink-100 dark:bg-pink-900 mr-2 px-2.5 py-0.5 rounded-full font-medium text-pink-800 text-sm dark:text-pink-300">
              $ {product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
