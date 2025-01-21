import React, { useState, useRef, useEffect } from "react";
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
import { RiMenu3Line } from "react-icons/ri";
import "./Navigation.css";
import FavoritesCount from "../Products/FavoritesCount";

function Navigation() {
  const currentUser = useSelector((state) => state.auth.userInfo);
  const { cartItems } = useSelector((state) => state.cart);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutApiCall] = useLogoutMutation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleSidebar = () => setShowSidebar(!showSidebar);

  const dropdownRef = useRef(null);

  // Handle click outside for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNavigation = () => {
    if (isMobile) setShowSidebar(false);
  };

  return (
    <div>
      {/* Mobile Sidebar Toggle Button */}
      {isMobile && (
        <div
          id="mobile-navigation-toggle"
          onClick={toggleSidebar}
          className="top-0 left-0 z-[111111111] fixed text-2xl text-pink-900 cursor-pointer"
        >
          <RiMenu3Line />
        </div>
      )}

      {/* Sidebar Navigation */}
      <div
        id="navigation-container"
        className={`${
          showSidebar || !isMobile ? "open" : ""
        } flex flex-col justify-between p-4 text-white bg-black h-full fixed transition-transform duration-300 ${
          isMobile ? "w-60 " : "w-20"
        }`}
      >
        {/* Sidebar Links */}
        <div className="flex flex-col space-y-6 mt-10">
          <Link
            to="/"
            className="flex items-center transform transition-transform hover:translate-x-2 group"
            onClick={handleNavigation}
          >
            <AiOutlineHome size={26} />
            {/* Show name only if the sidebar is expanded */}
            <span
              className={`nav-item-name ${
                showSidebar ? "inline-block" : "hidden"
              } ml-2`}
            >
              Home
            </span>
          </Link>

          <Link
            to="/shop"
            className="flex items-center transform transition-transform hover:translate-x-2 group"
            onClick={handleNavigation}
          >
            <AiOutlineShopping size={26} />
            <span
              className={`nav-item-name ${
                showSidebar ? "inline-block" : "hidden"
              } ml-2`}
            >
              Shop
            </span>
          </Link>

          <Link
            to="/cart"
            className="relative flex items-center transform transition-transform hover:translate-x-2 group"
            onClick={handleNavigation}
          >
            <AiOutlineShoppingCart size={26} />
            <span
              className={`nav-item-name ${
                showSidebar ? "inline-block" : "hidden"
              } ml-2`}
            >
              Cart
            </span>
            {cartItems.length > 0 && (
              <span className="top-0 left-8 absolute bg-pink-500 px-2 py-0.5 rounded-full text-white text-xs">
                {cartItems.length}
              </span>
            )}
          </Link>

          <Link
            to="/favorites"
            className="flex items-center transform transition-transform hover:translate-x-2 group"
            onClick={handleNavigation}
          >
            <FaHeart size={26} />
            <span
              className={`nav-item-name ${
                showSidebar ? "inline-block" : "hidden"
              } ml-2`}
            >
              Favorites
            </span>
            <FavoritesCount />
          </Link>
        </div>

        {/* Dropdown for User Profile */}
        <div ref={dropdownRef} className="relative mt-auto">
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
