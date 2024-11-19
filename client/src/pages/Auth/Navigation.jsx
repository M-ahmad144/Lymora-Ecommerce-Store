import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../redux/api/userApiSlice";
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
  const currentUser = useSelector((state) => state.auth.userInfo); // Current logged-in user
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [triggerLogout] = useLoginMutation(); // Logout API mutation

  const performLogout = async () => {
    try {
      await triggerLogout().unwrap(); // Send logout request
      dispatch(logout()); // Clear user data
      navigate("/login"); // Redirect to login page
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
      } xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-white bg-black w-[4%] hover:w-[15%] h-[100vh] fixed`}
    >
      {/* Sidebar Links */}
      <div className="flex flex-col justify-center space-y-4">
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
          className="flex items-center text-gray-800 focus:outline-none"
        >
          {currentUser ? (
            <span className="text-white">currentUser.name</span>
          ) : (
            <></>
          )}
        </button>
      </div>

      <ul>
        <li>
          <Link
            to="/login"
            className="flex items-center transform transition-transform hover:translate-x-2"
          >
            <AiOutlineLogin className="mt-[3rem] mr-2" size={26} />
            <span className="hidden nav-item-name mt-[3rem]">Login</span>
          </Link>
        </li>
        <li>
          <Link
            to="/register"
            className="flex items-center transform transition-transform hover:translate-x-2"
          >
            <AiOutlineUserAdd className="mt-[3rem] mr-2" size={26} />
            <span className="hidden nav-item-name mt-[3rem]">Register</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Navigation;
