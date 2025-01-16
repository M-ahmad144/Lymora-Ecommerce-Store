import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  // Ensure the PayPal clientId and script load
  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: { "client-id": paypal.clientId, currency: "USD" },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      if (order && !order.isPaid && !window.paypal) {
        loadPayPalScript();
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onError(err) {
    toast.error(err.message);
  }

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order marked as delivered");
    } catch (err) {
      toast.error(err.message || "Failed to mark as delivered");
    }
  };

  if (isLoading)
    return (
      <div className="place-items-center grid h-screen">
        <Loader />
      </div>
    );
  if (error) return <Message variant="danger">{error.data.message}</Message>;

  return (
    <div className="mx-auto px-4 py-8 container">
      <div className="flex lg:flex-row flex-col gap-8">
        {/* Order Details Section */}
        <div className="lg:w-2/3">
          <h2 className="mb-6 font-bold text-3xl text-pink-600">
            Order Details
          </h2>
          {order.orderItems.length === 0 ? (
            <Message>Order is empty</Message>
          ) : (
            <div className="shadow-lg rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-center">Quantity</th>
                    <th className="text-right p-3">Price</th>
                    <th className="text-right p-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">
                        <div className="flex items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="mr-3 rounded-md w-16 h-16 object-cover"
                          />
                          <Link
                            to={`/product/${item.product}`}
                            className="text-pink-600 hover:underline"
                          >
                            {item.name}
                          </Link>
                        </div>
                      </td>
                      <td className="p-3 text-center">{item.qty}</td>
                      <td className="text-right p-3">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="text-right p-3 font-semibold">
                        ${(item.qty * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Summary Section */}
        <div className="lg:w-1/3">
          <div className="shadow-lg p-6 rounded-lg">
            <h2 className="mb-4 font-bold text-2xl text-pink-600">
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Items:</span>
                <span className="font-semibold">${order.itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-semibold">${order.shippingPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span className="font-semibold">${order.taxPrice}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${order.totalPrice}</span>
              </div>
            </div>

            {/* PayPal Payment Section */}
            {!order.isPaid && (
              <div className="mt-6">
                {loadingPay && (
                  <div className="place-items-center grid">
                    <Loader />
                  </div>
                )}
                {isPending ? (
                  <Loader />
                ) : (
                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                  />
                )}
              </div>
            )}

            {/* Admin "Mark As Delivered" Button */}

            {userInfo?.data?.isAdmin && order.isPaid && !order.isDelivered && (
              <div className="relative">
                <button
                  type="button"
                  className="bg-green-500 hover:bg-green-600 mt-6 px-4 py-2 rounded-md w-full text-white transition duration-300"
                  onClick={deliverHandler}
                  disabled={loadingDeliver}
                >
                  {loadingDeliver ? (
                    <div className="flex justify-center items-center">
                      <Loader />
                    </div>
                  ) : (
                    "Mark As Delivered"
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Shipping Information */}
          <div className="shadow-lg mt-8 p-6 rounded-lg">
            <h2 className="mb-4 font-bold text-2xl text-pink-600">
              Shipping Information
            </h2>
            <div className="space-y-3">
              <p>
                <strong>Name:</strong> {order.user.username}
              </p>
              <p>
                <strong>Email:</strong> {order.user.email}
              </p>
              <p>
                <strong>Address:</strong> {order.shippingAddress.address},{" "}
                {order.shippingAddress.city} {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              <p>
                <strong>Payment Method:</strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">
                  Paid on {new Date(order.paidAt).toLocaleString()}
                </Message>
              ) : (
                <Message variant="danger">Not paid</Message>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
