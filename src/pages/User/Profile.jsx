import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useProfileMutation } from "../../redux/api/userApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.username, userInfo.email]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const updateData = {
          _id: userInfo._id,
          username,
          email,
        };

        if (password) {
          if (!currentPassword) {
            toast.error("Current password is required to update password");
            return;
          }
          updateData.currentPassword = currentPassword;
          updateData.password = password;
        }

        const res = await updateProfile(updateData).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
        setCurrentPassword("");
        setPassword("");
        setConfirmPassword("");
      } catch (err) {
        toast.error(
          err?.data?.message || err.error || "Failed to update profile"
        );
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="shadow-xl p-8 rounded-2xl w-full max-w-md"
      >
        <h2 className="mb-6 font-bold text-3xl text-center text-pink-500">
          Update Profile
        </h2>
        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            {/*username input */}
            <label className="block mb-2 font-medium text-gray-300 text-sm">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter name"
              className="border-gray-600 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 w-full text-black transition duration-200 focus:outline-none"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div>
            {/*email input */}
            <label className="block mb-2 font-medium text-gray-300 text-sm">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter email"
              className="border-gray-600 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 w-full text-black transition duration-200 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            {/*password input */}
            <label className="block mb-2 font-medium text-gray-300 text-sm">
              Current Password
            </label>
            <input
              type="password"
              placeholder="Enter current password"
              className="border-gray-600 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 w-full text-black transition duration-200 focus:outline-none"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div>
            {/*password input */}
            <label className="block mb-2 font-medium text-gray-300 text-sm">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              className="border-gray-600 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 w-full text-black transition duration-200 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-300 text-sm">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="border-gray-600 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 w-full text-black transition duration-200 focus:outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loadingUpdateProfile}
              className="flex justify-center items-center bg-pink-600 hover:bg-pink-700 focus:ring-opacity-50 px-6 py-3 rounded-lg focus:ring-2 focus:ring-pink-500 text-white transition duration-200 focus:outline-none"
            >
              {loadingUpdateProfile ? (
                <svg
                  className="mr-3 w-5 h-5 text-white animate-spin"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Update"
              )}
            </motion.button>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/user-orders"
                className="bg-gray-600 focus:ring-opacity-50 px-6 py-3 rounded-lg focus:ring-2 focus:ring-gray-500 text-white transition duration-200 hover: focus:outline-none"
              >
                My Orders
              </Link>
            </motion.div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;
