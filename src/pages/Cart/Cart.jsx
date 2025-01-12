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
    <>
      <div className="flex justify-around items-start mx-auto mt-8 container wrap">
        {cartItems.length === 0 ? (
          <div>
            Your cart is empty{" "}
            <Link to="/shop" className="text-pink-500">
              Go To Shop
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col w-[80%]">
              <h1 className="mb-4 font-semibold text-2xl">Shopping Cart</h1>

              {cartItems.map((item) => (
                <div key={item._id} className="flex items-enter mb-[1rem] pb-2">
                  {/* Product Image */}
                  <div className="w-[25rem] h-[15rem]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="rounded w-full h-full object-cover"
                    />
                  </div>
                  {/* Product Details */}
                  <div className="flex-1 ml-4">
                    <Link to={`/product/${item._id}`} className="text-pink-500">
                      {item.name}
                    </Link>
                    {/*  */}
                    <div className="mt-2 text-white">{item.brand}</div>
                    <div className="mt-2 font-bold text-white">
                      $ {item.price}
                    </div>
                  </div>
                  {/* Quantity */}
                  <div className="w-24">
                    <select
                      className="p-1 border rounded w-full text-white"
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option
                          key={x + 1}
                          value={x + 1}
                          className="bg-inherit"
                        >
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Remove Button */}
                  <div>
                    <button
                      className="mr-[5rem] text-red-500"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash className="mt-[.5rem] ml-[1rem]" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Checkout Button */}
              <div className="mt-8 w-[40rem]">
                <div className="p-4 rounded-lg">
                  <h2 className="mb-2 font-semibold text-xl">
                    Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                  </h2>

                  <div className="font-bold text-2xl">
                    ${" "}
                    {cartItems
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                      .toFixed(2)}
                  </div>

                  <button
                    className="bg-pink-500 mt-4 px-4 py-2 rounded-full w-full text-lg"
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    Proceed To Checkout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
