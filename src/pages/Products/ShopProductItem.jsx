import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { addToCart } from "../../redux/features/cart/cartSlice";
import HeartIcon from "./HeartIcon";

const ProductItem = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully");
  };

  return (
    <div className="relative rounded-lg max-w-sm shaodw">
      <section className="relative">
        <Link to={`/product/${p._id}`}>
          <span className="right-3 bottom-3 absolute bg-pink-100 dark:bg-pink-900 mr-2 px-2.5 py-0.5 rounded-full font-medium text-pink-800 text-sm dark:text-pink-300">
            {p?.brand}
          </span>
          <img
            className="w-full cursor-pointer"
            src={p.image}
            alt={p.name}
            style={{ height: "170px", objectFit: "cover" }}
          />
        </Link>
        <HeartIcon product={p} />
      </section>

      <div className="p-5">
        <div className="flex justify-between">
          <h5 className="mb-2 text-whiet text-xl dark:text-white">{p?.name}</h5>

          <p className="font-semibold text-pink-500">
            {p?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>

        <p className="mb-3 font-normal text-[#CFCFCF]">
          {p?.description?.substring(0, 60)} ...
        </p>

        <section className="flex justify-between items-center">
          <Link
            to={`/product/${p._id}`}
            className="inline-flex items-center bg-pink-700 hover:bg-pink-800 dark:hover:bg-pink-700 dark:bg-pink-600 px-3 py-2 rounded-lg focus:ring-4 focus:ring-pink-300 dark:focus:ring-pink-800 font-medium text-center text-sm text-white focus:outline-none"
          >
            Read More
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
          </Link>

          <button
            className="p-2 rounded-full"
            onClick={() => addToCartHandler(p, 1)}
          >
            <AiOutlineShoppingCart size={25} />
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProductItem;
