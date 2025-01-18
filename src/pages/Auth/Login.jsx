import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useLoginMutation } from "../../redux/api/userApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const userInfo = useSelector((state) => state.auth.userInfo);

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    try {
      const user = await login({ email, password }).unwrap();

      dispatch(setCredentials(user)); // Save user credentials to Redux store
      navigate(redirect); // Redirect after successful login
    } catch (error) {
      toast.error(error?.message || "Failed to sign in");
    }
  };

  return (
    <div>
      <section className="flex flex-wrap justify-center items-center lg:px-20 p-4 min-h-screen">
        {/* Form Container */}
        <div className="mt-8 md:mt-10 lg:mt-16 px-4 sm:px-6 lg:px-0 w-full lg:w-1/2">
          <form
            onSubmit={submitHandler}
            className="mx-auto p-6 md:p-8 rounded-lg w-full max-w-lg"
          >
            <h1 className="mb-6 font-semibold text-3xl text-center text-pink-500 lg:text-left">
              Sign In
            </h1>

            <div className="mb-6">
              <label
                htmlFor="email"
                className="block font-medium text-gray-300 text-sm"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="border-gray-700 bg-gray-900 mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 w-full text-white focus:outline-none placeholder-gray-500"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block font-medium text-gray-300 text-sm"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="border-gray-700 bg-gray-900 mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 w-full text-white focus:outline-none placeholder-gray-500"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-lg w-full font-semibold text-lg text-white"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              New Customer?{" "}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
                className="text-pink-500 hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>

        {/* Image Section */}
        <div className="lg:block hidden p-4 lg:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
            alt="Sign In"
            className="rounded-lg w-full h-[35rem] object-cover"
          />
        </div>
      </section>
    </div>
  );
}

export default Login;
