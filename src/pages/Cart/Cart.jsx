import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="mx-auto p-4 container">
      {cartItems.length === 0 ? (
        <div className="text-center">
          <h2 className="mb-4 font-semibold text-xl">Your cart is empty</h2>
          <Link
            to="/shop"
            className="text-pink-500 hover:text-pink-700 underline"
          >
            Go To Shop
          </Link>
        </div>
      ) : (
        <div className="flex lg:flex-row flex-col gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <h1 className="mb-4 ml-8 font-bold text-3xl text-pink-700">
              Shopping Cart
            </h1>
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 border-gray-200 p-4 border-b"
              >
                {/* Product Image */}
                <div className="w-24 h-24">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="rounded w-full h-full object-cover"
                  />
                </div>
                {/* Product Details */}
                <div className="flex-1">
                  <Link
                    to={`/product/${item._id}`}
                    className="font-semibold text-pink-500 hover:underline"
                  >
                    {item.name}
                  </Link>
                  <div className="text-gray-500 text-sm">{item.brand}</div>
                  <div className="font-bold text-lg">$ {item.price}</div>
                </div>
                {/* Quantity Selector */}
                <div>
                  <select
                    value={item.qty}
                    onChange={(e) =>
                      addToCartHandler(item, Number(e.target.value))
                    }
                    className="border-white bg-[#181818] px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-600 text-white"
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option
                        key={x + 1}
                        value={x + 1}
                        className="bg-[#181818] text-white"
                      >
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Remove Button */}
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeFromCartHandler(item._id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border-pink-500 md:mt-5 p-6 border rounded-lg w-full lg:w-1/3">
            <h2 className="mb-6 font-bold text-2xl text-center text-pink-500">
              Order Summary
            </h2>

            <div className="mb-4">
              <div className="flex justify-between mb-2 text-lg">
                <span className="text-gray-300">Items:</span>
                <span className="font-semibold text-white">
                  {cartItems.length}
                </span>
              </div>
              <div className="flex justify-between mb-2 text-lg">
                <span className="text-gray-300">Total:</span>
                <span className="font-bold text-pink-400">
                  $
                  {cartItems
                    .reduce((acc, item) => acc + item.qty * item.price, 0)
                    .toFixed(2)}
                </span>
              </div>
            </div>

            <button
              className={`mt-4 py-3 rounded-lg w-full text-lg font-semibold ${
                cartItems.length === 0
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-pink-500 hover:bg-pink-600 text-white"
              }`}
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
