import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="mx-auto px-4 container">
      <h2 className="mb-6 font-semibold text-2xl text-center">My Orders</h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <Message variant="danger">
            {error?.data?.error || error?.error || "An error occurred."}
          </Message>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Message variant="info">You have no orders yet.</Message>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="border-collapse border-gray-200 border w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 border-b">IMAGE</th>
                <th className="px-4 py-3 border-b">ID</th>
                <th className="px-4 py-3 border-b">DATE</th>
                <th className="px-4 py-3 border-b">TOTAL</th>
                <th className="px-4 py-3 border-b">PAID</th>
                <th className="px-4 py-3 border-b">DELIVERED</th>
                <th className="px-4 py-3 border-b"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="text-center">
                  <td className="px-4 py-3 border-b">
                    <img
                      src={order.orderItems[0]?.image}
                      alt={`Product: ${order.orderItems[0]?.name}`}
                      className="mx-auto w-16 h-16 object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 border-b">{order._id}</td>
                  <td className="px-4 py-3 border-b">
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td className="px-4 py-3 border-b">${order.totalPrice}</td>
                  <td className="px-4 py-3 border-b">
                    {order.isPaid ? (
                      <span className="bg-green-400 px-3 py-1 rounded-full text-white">
                        Completed
                      </span>
                    ) : (
                      <span className="bg-red-400 px-3 py-1 rounded-full text-white">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 border-b">
                    {order.isDelivered ? (
                      <span className="bg-green-400 px-3 py-1 rounded-full text-white">
                        Delivered
                      </span>
                    ) : (
                      <span className="bg-red-400 px-3 py-1 rounded-full text-white">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 border-b">
                    <Link to={`/order/${order._id}`}>
                      <button className="bg-pink-500 px-4 py-2 rounded text-white">
                        View Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserOrder;
