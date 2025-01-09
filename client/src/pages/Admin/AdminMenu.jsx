import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";

const AdminMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        className={`${
          isMenuOpen ? "top-4 right-4" : "top-4 right-4"
        } fixed z-50 bg-pink-500 p-3 rounded-lg shadow-lg transition-all duration-300 ease-in-out`}
        onClick={toggleMenu}
      >
        {isMenuOpen ? (
          <FaTimes color="white" size={20} />
        ) : (
          <FiMenu color="white" size={24} />
        )}
      </button>

      {/* Menu Items */}
      {isMenuOpen && (
        <section className="top-0 right-0 z-40 fixed bg-[#151515] shadow-xl p-5 w-64 h-full transform transition-transform duration-300 ease-in-out">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-white text-xl">Admin Menu</h2>
          </div>

          <ul className="space-y-5 mt-10">
            {[
              { to: "/admin/dashboard", text: "Admin Dashboard" },
              { to: "/admin/categorylist", text: "Create Category" },
              { to: "/admin/productlist", text: "Create Product" },
              { to: "/admin/allproducts", text: "All Products" },
              { to: "/admin/userlist", text: "Manage Users" },
              { to: "/admin/orderlist", text: "Manage Orders" },
            ].map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className="block hover:bg-[#333] px-4 py-2 rounded-md text-white transition duration-200 ease-in-out"
                  style={({ isActive }) => ({
                    color: isActive ? "pink" : "white",
                  })}
                >
                  {item.text}
                </NavLink>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
};

export default AdminMenu;
