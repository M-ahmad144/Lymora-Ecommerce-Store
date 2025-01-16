import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    cartItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error.message || "Error placing order.");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <ProgressSteps step1 step2 step3 />

        {cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="space-y-8 mt-12">
            <div className="shadow-2xl rounded-xl overflow-hidden">
              <div className="px-6 py-4">
                <h2 className="font-bold text-2xl text-pink-600">
                  Order Items
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="">
                    <tr>
                      <th className="px-6 py-3 font-medium text-gray-300 text-left text-xs uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 font-medium text-gray-300 text-left text-xs uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 font-medium text-gray-300 text-left text-xs uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 font-medium text-gray-300 text-left text-xs uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {cartItems.map((item, index) => (
                      <tr
                        key={index}
                        className="transition-colors duration-200"
                      >
                        {/* image  */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="mr-4 rounded-lg w-16 h-16 object-cover"
                            />
                            <Link
                              to={`/product/${item.product}`}
                              className="font-medium text-gray-200 text-sm hover:text-pink-500 transition-colors duration-200"
                            >
                              {item.name}
                            </Link>
                          </div>
                        </td>
                        {/* quantity */}
                        <td className="px-6 py-4 text-gray-300 text-sm whitespace-nowrap">
                          {item.qty}
                        </td>
                        {/* price */}
                        <td className="px-6 py-4 text-gray-300 text-sm whitespace-nowrap">
                          ${item.price.toFixed(2)}
                        </td>
                        {/* Total */}
                        <td className="px-6 py-4 text-gray-300 text-sm whitespace-nowrap">
                          ${(item.qty * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="shadow-2xl p-8 rounded-xl">
              <h2 className="mb-6 font-bold text-3xl text-pink-500">
                Order Summary
              </h2>
              <div className="gap-8 grid grid-cols-1 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-semibold text-gray-200 text-xl">
                      Shipping Address
                    </h3>
                    <p className="text-gray-400">
                      {shippingAddress.address}, {shippingAddress.city}{" "}
                      {shippingAddress.postalCode}, {shippingAddress.country}
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-gray-200 text-xl">
                      Payment Method
                    </h3>
                    <p className="text-gray-400">{paymentMethod}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Items:</span>
                    <span className="font-medium text-gray-200">
                      ${itemsPrice}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Shipping:</span>
                    <span className="font-medium text-gray-200">
                      ${shippingPrice}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Tax:</span>
                    <span className="font-medium text-gray-200">
                      ${taxPrice}
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-xl">
                    <span className="text-gray-200">Total:</span>
                    <span className="text-pink-500">${totalPrice}</span>
                  </div>
                </div>
              </div>
              {error && (
                <Message variant="danger">{error.data.message}</Message>
              )}
              <button
                type="button"
                className="bg-pink-600 hover:bg-pink-700 focus:ring-opacity-50 disabled:opacity-50 mt-8 px-6 py-4 rounded-lg focus:ring-2 focus:ring-pink-500 w-full font-semibold text-lg text-white transition duration-300 disabled:cursor-not-allowed focus:outline-none"
                disabled={cartItems.length === 0 || isLoading}
                onClick={placeOrderHandler}
              >
                {isLoading ? (
                  <span className="flex justify-center items-center">
                    <svg
                      className="mr-3 -ml-1 w-5 h-5 text-white animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
      {isLoading && <Loader />}
    </div>
  );
};

export default PlaceOrder;
