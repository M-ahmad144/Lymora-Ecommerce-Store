import React, { useState } from "react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">{error?.data?.message || error.error}</Message>
    );

  return (
    <div className="mx-auto px-4 py-8 text-white container">
      <AdminMenu />
      <h2 className="mb-8 font-bold text-3xl text-center text-pink-700">
        Order Management
      </h2>
      <div className="shadow-2xl md:ml-10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="">
              <tr>
                {[
                  "Items",
                  "ID",
                  "User",
                  "Date",
                  "Total",
                  "Paid",
                  "Delivered",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 font-semibold text-left text-pink-500 text-xs uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-700 transition-all hover:-translate-y-1 duration-200 cursor-pointer ease-in-out"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <img
                      src={order.orderItems[0].image}
                      alt={order._id}
                      className="rounded-full w-16 h-16 object-cover"
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
                  <td className="px-4 py-4 text-white whitespace-nowrap">
                    {order.user ? order.user.username : "N/A"}
                  </td>
                  <td className="px-4 py-4 text-white whitespace-nowrap">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-4 font-medium text-white whitespace-nowrap">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.isPaid
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.isDelivered
                          ? "bg-green-600 text-white"
                          : "bg-yellow-600 text-white"
                      }`}
                    >
                      {order.isDelivered ? "Delivered" : "Processing"}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-medium text-sm whitespace-nowrap">
                    <Link to={`/order/${order._id}`}>
                      <button className="text-blue-300 hover:text-blue-100 transition-colors duration-200">
                        Details
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

export default OrderList;
