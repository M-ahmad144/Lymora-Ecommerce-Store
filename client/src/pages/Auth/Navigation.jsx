import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../../redux/api/userApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";

import "./Navigation.css";

function Navigation() {
  const currentUser = useSelector((state) => state.auth.userInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutApiCall] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      // Call the API to perform logout
      await logoutApiCall().unwrap();
      // Clear user info from Redux store
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
  };

  return (
    <div
      style={{ zIndex: "1000" }}
      id="navigation-container"
      className={`${
        showSidebar ? "hidden" : "flex"
      } xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-white bg-black w-[6%] hover:w-[15%] h-[100vh] fixed`}
    >
      {/* Sidebar Links */}
      <div className="flex flex-col justify-center">
        <Link
          to="/"
          className="flex items-center transform transition-transform hover:translate-x-2"
        >
          <AiOutlineHome className="mt-[3rem] mr-2" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">Home</span>
        </Link>
        <Link
          to="/shop"
          className="flex items-center transform transition-transform hover:translate-x-2"
        >
          <AiOutlineShopping className="mt-[3rem] mr-2" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">Shop</span>
        </Link>
        <Link
          to="/cart"
          className="flex items-center transform transition-transform hover:translate-x-2"
        >
          <AiOutlineShoppingCart className="mt-[3rem] mr-2" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">Cart</span>
        </Link>

        <Link
          to="/favorites"
          className="flex items-center transform transition-transform hover:translate-x-2"
        >
          <FaHeart className="mt-[3rem] mr-2" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">Favorites</span>
        </Link>
      </div>

      {/* Dropdown Menu for User Profile */}
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center text-white hover:text-gray-300 focus:outline-none"
        >
          {currentUser && (
            <span className="mr-2 font-medium text-white">
              {currentUser.data.name}
            </span>
          )}
          {currentUser && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          )}
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && currentUser && (
          <ul
            className={`absolute right-0 mt-2 w-36 bg-black rounded-md shadow-lg ring-1 ring-slate-900 ring-opacity-55 ${
              !currentUser.data.isAdmin ? "-top-20" : "-top-72"
            }`}
          >
            {/* Admin-specific links */}
            {currentUser.data.isAdmin && (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="block hover:bg-gray-700 px-4 py-2 rounded-t-md text-sm text-white"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/productlist"
                    className="block hover:bg-gray-700 px-4 py-2 text-sm text-white"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/categorylist"
                    className="block hover:bg-gray-700 px-4 py-2 text-sm text-white"
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/orderlist"
                    className="block hover:bg-gray-700 px-4 py-2 text-sm text-white"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/userlist"
                    className="block hover:bg-gray-700 px-4 py-2 text-sm text-white"
                  >
                    Users
                  </Link>
                </li>
              </>
            )}

            {/* General links */}
            <li>
              <Link
                to="/profile"
                className="block hover:bg-gray-700 px-4 py-2 text-sm text-white"
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="block hover:bg-gray-700 px-4 py-2 rounded-b-md w-full text-left text-sm text-white"
              >
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>

      {/* Login/Register Options */}
      {!currentUser && (
        <ul>
          <li>
            <Link
              to="/login"
              className="flex items-center mt-5 transform transition-transform hover:translate-x-2"
            >
              <AiOutlineLogin className="mt-[4px] mr-2" size={26} />
              <span className="hidden nav-item-name">LOGIN</span>
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="flex items-center mt-5 transform transition-transform hover:translate-x-2"
            >
              <AiOutlineUserAdd size={26} />
              <span className="hidden nav-item-name">REGISTER</span>
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}

export default Navigation;
