import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useRegisterMutation } from "../../redux/api/userApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

function Register() {
  // user register state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // user register api call
  const [register, { isLoading }] = useRegisterMutation();

  const { search } = useLocation(); // search could be "?redirect=/dashboard"
  const redirectInUrl = new URLSearchParams(search).get("redirect"); // redirectInUrl = "/dashboard"
  const redirect = redirectInUrl ? redirectInUrl : "/";

  // check if user is already logged in
  const { userInfo } = useSelector((state) => state.auth);
  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, redirect, userInfo]);

  // submit handler
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please enter all the fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const user = await register({ username, email, password }).unwrap();
      dispatch(setCredentials(user)); // Save user credentials to Redux store
      navigate(redirect); // Redirect after successful registration
      toast.success("User registered successfully");
    } catch (error) {
      toast.error(error.data.message || "Failed to register user");
    }
  };

  return (
    <section className="flex flex-wrap justify-center items-center px-4 md:px-10 lg:px-20 min-h-screen">
      {/* Form Container */}
      <div className="mt-10 md:mt-8 w-full lg:w-1/2">
        <form
          onSubmit={submitHandler}
          className="shadow-lg mx-auto lg:mx-0 p-6 md:p-8 rounded-lg max-w-lg"
        >
          <h1 className="mb-6 font-semibold text-3xl text-pink-500">
            Register
          </h1>

          <div className="my-6">
            <label
              htmlFor="name"
              className="block font-medium text-gray-500 text-sm"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 w-full text-black focus:outline-none"
              placeholder="Enter name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="my-6">
            <label
              htmlFor="email"
              className="block font-medium text-gray-500 text-sm"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 w-full text-black focus:outline-none"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="my-6">
            <label
              htmlFor="password"
              className="block font-medium text-gray-500 text-sm"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 w-full text-black focus:outline-none"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="my-6">
            <label
              htmlFor="confirmPassword"
              className="block font-medium text-gray-500 text-sm"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 w-full text-black focus:outline-none"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-lg w-full font-semibold text-lg text-white"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
          <p className="mt-4 text-center text-gray-300">
            Already have an account?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-pink-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>

      {/* Image Section */}
      <div className="lg:block hidden lg:w-1/2">
        <img
          src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
          alt="Register"
          className="rounded-lg w-full h-[35rem] object-cover"
        />
      </div>
    </section>
  );
}

export default Register;
