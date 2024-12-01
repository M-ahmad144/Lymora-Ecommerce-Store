// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";

// import Loader from "../../components/Loader";
// // import { useProfileMutation } from "../../redux/api/usersApiSlice";
// import { setCredentials } from "../../redux/features/auth/authSlice";
// import { Link } from "react-router-dom";

// const Profile = () => {
//   const [username, setUserName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const { userInfo } = useSelector((state) => state.auth);

//   const [updateProfile, { isLoading: loadingUpdateProfile }] =
//     useProfileMutation();

//   useEffect(() => {
//     setUserName(userInfo.username);
//     setEmail(userInfo.email);
//   }, [userInfo.email, userInfo.username]);

//   const dispatch = useDispatch();

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match");
//     } else {
//       try {
//         const res = await updateProfile({
//           _id: userInfo._id,
//           username,
//           email,
//           password,
//         }).unwrap();
//         dispatch(setCredentials({ ...res }));
//         toast.success("Profile updated successfully");
//       } catch (err) {
//         toast.error(err?.data?.message || err.error);
//       }
//     }
//   };

//   return (
//     <div className="mx-auto mt-[10rem] p-4 container">
//       <div className="flex md:flex justify-center md:space-x-4 align-center">
//         <div className="md:w-1/3">
//           <h2 className="mb-4 font-semibold text-2xl">Update Profile</h2>
//           <form onSubmit={submitHandler}>
//             <div className="mb-4">
//               <label className="block mb-2 text-white">Name</label>
//               <input
//                 type="text"
//                 placeholder="Enter name"
//                 className="form-input p-4 rounded-sm w-full"
//                 value={username}
//                 onChange={(e) => setUserName(e.target.value)}
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block mb-2 text-white">Email Address</label>
//               <input
//                 type="email"
//                 placeholder="Enter email"
//                 className="form-input p-4 rounded-sm w-full"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block mb-2 text-white">Password</label>
//               <input
//                 type="password"
//                 placeholder="Enter password"
//                 className="form-input p-4 rounded-sm w-full"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block mb-2 text-white">Confirm Password</label>
//               <input
//                 type="password"
//                 placeholder="Confirm password"
//                 className="form-input p-4 rounded-sm w-full"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//               />
//             </div>

//             <div className="flex justify-between">
//               <button
//                 type="submit"
//                 className="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded text-white"
//               >
//                 Update
//               </button>

//               <Link
//                 to="/user-orders"
//                 className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded text-white"
//               >
//                 My Orders
//               </Link>
//             </div>
//             {loadingUpdateProfile && <Loader />}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;

import React from "react";

function Profile() {
  return <div></div>;
}

export default Profile;
