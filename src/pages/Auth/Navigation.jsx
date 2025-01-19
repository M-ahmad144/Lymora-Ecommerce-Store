import { useState, useRef, useEffect } from "react";
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
import { RiMenu3Line } from "react-icons/ri"; // Icon for mobile menu toggle
import "./Navigation.css";
import FavoritesCount from "../Products/FavoritesCount";

function Navigation() {
  const currentUser = useSelector((state) => state.auth.userInfo);

  const { cartItems } = useSelector((state) => state.cart);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutApiCall] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleSidebar = () => setShowSidebar(!showSidebar);

  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      {/* Mobile Menu Toggle Icon */}
      <div
        id="mobile-navigation-toggle"
        onClick={toggleSidebar}
        className="md:block top-6 left-5 z-[11111111] fixed hidden text-2xl text-pink-500 cursor-pointer"
      >
        <RiMenu3Line />
      </div>

      {/* Sidebar Navigation (Mobile and Desktop) */}
      <div
        id="navigation-container"
        className={`${
          showSidebar ? "open" : ""
        } flex flex-col justify-between p-4 text-white bg-black h-[100vh] fixed transition-transform duration-300`}
      >
        {/* Sidebar Links */}
        <div className="flex flex-col justify-center space-y-2">
          <Link
            to="/"
            className="flex items-center transform transition-transform hover:translate-x-2 group"
          >
            <AiOutlineHome className="mt-[3rem] mr-2" size={26} />
            <span className="nav-item-name mt-[3rem]">Home</span>{" "}
            {/* Display on hover */}
          </Link>

          <Link
            to="/shop"
            className="flex items-center transform transition-transform hover:translate-x-2 group"
          >
            <AiOutlineShopping className="mt-[3rem] mr-2" size={26} />
            <span className="nav-item-name mt-[3rem]">Shop</span>{" "}
            {/* Display on hover */}
          </Link>

          <Link
            to="/cart"
            className="relative flex items-center transform transition-transform hover:translate-x-2 group"
          >
            <AiOutlineShoppingCart className="mt-[3rem] mr-2" size={26} />
            <span className="nav-item-name mt-[3rem]">Cart</span>{" "}
            {/* Display on hover */}
            {cartItems.length > 0 && (
              <span className="top-[1rem] left-[1rem] absolute bg-pink-500 px-2 py-0.5 rounded-full text-white text-xs">
                {cartItems.length}
              </span>
            )}
          </Link>

          <Link
            to="/favorites"
            className="flex items-center transform transition-transform hover:translate-x-2 group"
          >
            <FaHeart className="mt-[3rem] mr-2" size={26} />
            <span className="nav-item-name mt-[3rem]">Favorites</span>{" "}
            {/* Display on hover */}
            <FavoritesCount />
          </Link>
        </div>

        {/* Dropdown Menu for User Profile */}
        <div ref={dropdownRef} className="relative">
          {currentUser ? (
            <button
              onClick={toggleDropdown}
              className="flex items-center text-white hover:text-gray-300 focus:outline-none"
            >
              <span className="font-bold text-[0.4rem] text-pink-500">
                {currentUser.username}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-3 transition-transform mr-20 ${
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
            </button>
          ) : (
            <ul>
              <li>
                <Link
                  to="/login"
                  className="flex items-center mt-5 transform transition-transform hover:translate-x-2"
                >
                  <AiOutlineLogin className="mt-[4px] mr-2" size={26} />
                  <span className="hidden nav-item-name">LOGIN</span>{" "}
                  {/* Hidden initially */}
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="flex items-center mt-5 transform transition-transform hover:translate-x-2"
                >
                  <AiOutlineUserAdd size={26} />
                  <span className="hidden nav-item-name">REGISTER</span>{" "}
                  {/* Hidden initially */}
                </Link>
              </li>
            </ul>
          )}

          {dropdownOpen && currentUser && (
            <ul
              className={`absolute right-0 mt-2 w-36 bg-black ml-10 rounded-md shadow-lg ring-1 ring-slate-900 ring-opacity-55 ${
                !currentUser.isAdmin ? "-top-20" : "-top-72"
              }`}
            >
              {/* Admin-specific links */}
              {currentUser.isAdmin && (
                <>
                  <li>
                    <Link
                      to="/admin/dashboard"
                      className="block hover:bg-pink-900 px-4 py-2 rounded-t-md text-sm text-white"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/product/create"
                      className="block hover:bg-pink-900 px-4 py-2 text-sm text-white"
                    >
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/categorylist"
                      className="block hover:bg-pink-900 px-4 py-2 text-sm text-white"
                    >
                      Categories
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/orderlist"
                      className="block hover:bg-pink-900 px-4 py-2 text-sm text-white"
                    >
                      Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/userlist"
                      className="block hover:bg-pink-900 px-4 py-2 text-sm text-white"
                    >
                      Users
                    </Link>
                  </li>
                </>
              )}

              {/* General user links */}
              <li>
                <Link
                  to="/profile"
                  className="block hover:bg-pink-900 px-4 py-2 text-sm text-white"
                >
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="block hover:bg-pink-900 px-4 py-2 rounded-b-md w-full text-left text-sm text-white"
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navigation;
