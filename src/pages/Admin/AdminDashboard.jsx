import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/userApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";
import { FaUsers, FaShoppingCart, FaDollarSign } from "react-icons/fa";

const AdminDashboard = () => {
  const { data: sales, isLoading: salesLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: customersLoading } = useGetUsersQuery();
  const { data: orders, isLoading: ordersLoading } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  console.log(customers);
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        type: "area",
        background: "transparent",
        foreColor: "#ffffff",
        toolbar: {
          show: true,
        },
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#FF4081"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      grid: {
        borderColor: "#444",
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
          style: {
            color: "#ffffff",
            fontSize: "14px",
          },
        },
      },
      yaxis: {
        title: {
          text: "Sales ($)",
          style: {
            color: "#ffffff",
            fontSize: "14px",
          },
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        offsetY: -10,
      },
      theme: {
        mode: "dark",
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setChartData((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: formattedSalesDate.map((item) => item.x),
          },
        },
        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  const StatCard = ({ title, value, icon }) => (
    <div className="flex items-center space-x-4 bg-black shadow-sm ml-3 p-6 rounded-lg text-white transform transition-transform duration-300 hover:scale-105">
      <div className="text-3xl text-pink-500">{icon}</div>
      <div>
        <p className="text-sm">{title}</p>
        <h2 className="font-bold text-2xl">{value}</h2>
      </div>
    </div>
  );

  return (
    <>
      <AdminMenu />
      <section className="md:ml-10 p-6 min-h-screen">
        <h1 className="mb-8 font-bold text-4xl text-center text-pink-500">
          Admin Dashboard
        </h1>

        {/* Stat Cards */}
        <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
          <StatCard
            title="Total Sales"
            value={
              salesLoading ? <Loader /> : `$${sales?.totalSales?.toFixed(2)}`
            }
            icon={<FaDollarSign />}
          />
          <StatCard
            title="Total Customers"
            value={customersLoading ? <Loader /> : customers?.users?.length}
            icon={<FaUsers />}
          />
          <StatCard
            title="Total Orders"
            value={ordersLoading ? <Loader /> : orders?.totalOrders}
            icon={<FaShoppingCart />}
          />
        </div>

        {/* Sales Chart */}
        <div className="mt-12">
          <div className="bg-black shadow-sm md:m-10 p-8 rounded-lg">
            <h2 className="mb-4 font-bold text-2xl text-pink-500">
              Sales Overview
            </h2>
            {salesDetail ? (
              <Chart
                options={chartData.options}
                series={chartData.series}
                type="area"
                height={400}
              />
            ) : (
              <Loader />
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mt-12">
          <div className="bg-black shadow-sm md:m-10 p-8 rounded-lg">
            <h2 className="mb-4 font-bold text-2xl text-pink-500">
              Recent Orders
            </h2>
            <OrderList />
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
