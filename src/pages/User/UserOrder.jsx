import React, { useState } from "react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!orders || !Array.isArray(orders) || orders.length === 0) {
    return (
      <Message variant="">
        <p className="text-center">No orders found</p>
      </Message>
    );
  }

  return (
    <div className="mx-auto px-4 py-8 container">
      <h2 className="mb-8 font-bold text-3xl text-center text-pink-800">
        My Orders
      </h2>
      <div className="shadow-2xl rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-4 py-3 font-semibold text-left text-pink-600 text-xs uppercase tracking-wider">
                  Image
                </th>
                <th className="px-4 py-3 font-semibold text-left text-pink-600 text-xs uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 font-semibold text-left text-pink-600 text-xs uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 font-semibold text-left text-pink-600 text-xs uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 font-semibold text-left text-pink-600 text-xs uppercase tracking-wider">
                  Paid
                </th>
                <th className="px-4 py-3 font-semibold text-left text-pink-600 text-xs uppercase tracking-wider">
                  Delivered
                </th>
                <th className="px-4 py-3 font-semibold text-left text-pink-600 text-xs uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-700 transition-all hover:-translate-y-1 duration-200 cursor-pointer ease-in-out"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <img
                      src={order.orderItems[0]?.image || "/default-image.png"}
                      alt={`Order for ${order.user || "unknown user"}`}
                      className="w-16 h-16 object-cover"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div
                      className="text-sm text-white cursor-pointer"
                      onClick={() => toggleExpand(order._id)}
                    >
                      {order._id.length > 8
                        ? expandedId === order._id
                          ? order._id
                          : `${order._id.substring(0, 8)}...`
                        : order._id}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium text-sm text-white">
                      ${order.totalPrice?.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.isPaid
                          ? "bg-green-600 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.isDelivered
                          ? "bg-green-800 text-white"
                          : "bg-yellow-800 text-white"
                      }`}
                    >
                      {order.isDelivered ? "Delivered" : "Processing"}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-medium text-sm whitespace-nowrap">
                    <Link to={`/order/${order._id}`}>
                      <button className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200">
                        More
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserOrder;
