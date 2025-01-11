import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Rating";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import ProductCard from "./ProductCard";
import Loader from "../../components/Loader";
import { FaStar, FaComments, FaBoxOpen } from "react-icons/fa";
const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();

  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="flex lg:flex-row flex-col lg:justify-between mt-6 px-4 md:px-10">
      {/* Tabs */}
      <section className="flex lg:flex-col flex-wrap justify-center lg:justify-start space-x-4 lg:space-x-0 mb-6 lg:mb-0 w-full lg:w-[20%]">
        {/* Write Review Tab */}
        <div
          className={`cursor-pointer p-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:bg-pink-600 hover:text-white text-center lg:w-full lg:mb-4  border-pink-600 border-s
    ${
      activeTab === 1
        ? "bg-pink-600 text-white border-2 "
        : "bg-transparent text-gray-300 border-2 border-transparent :border-pink-600"
    }`}
          onClick={() => handleTabClick(1)}
        >
          <FaStar className="inline-block mr-2" />
          Write Your Review
        </div>

        {/* All Reviews Tab */}
        <div
          className={`cursor-pointer p-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:bg-pink-600 hover:text-white text-center lg:w-full lg:mb-4 
      ${
        activeTab === 2
          ? "bg-pink-600 text-white border-2 border-pink-600"
          : "bg-transparent text-gray-300 border-2 border-transparent border-pink-600"
      }`}
          onClick={() => handleTabClick(2)}
        >
          <FaComments className="inline-block mr-2" />
          All Reviews
        </div>

        {/* Related Products Tab */}
        <div
          className={`cursor-pointer p-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:bg-pink-600 hover:text-white text-center lg:w-full lg:mb-4 
      ${
        activeTab === 3
          ? "bg-pink-600 text-white border-2 border-pink-600"
          : "bg-transparent text-gray-300 border-2 border-transparent border-pink-600"
      }`}
          onClick={() => handleTabClick(3)}
        >
          <FaBoxOpen className="inline-block mr-2" />
          Related Products
        </div>
      </section>
      {/* Content According To Tabs */}
      <section className="lg:w-[75%]">
        {/* Write Your Review Tab */}
        {activeTab === 1 && (
          <div className="bg-inherit shadow-lg mt-6 p-6 rounded-lg">
            {/* If user is logged in */}
            {userInfo ? (
              <form onSubmit={submitHandler}>
                {/* Rating Field */}
                <div className="my-4 md:w-[100%]">
                  <label
                    htmlFor="rating"
                    className="block mb-2 text-gray-300 text-xl"
                  >
                    Rating
                  </label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="border-pink-600 bg-inherit p-3 border rounded-lg focus:ring-2 focus:ring-pink-600 w-full lg:w-96 text-white focus:outline-none"
                  >
                    <option value="" className="bg-[#121212] text-white">
                      Select
                    </option>
                    <option value="1" className="bg-[#121212] text-white">
                      Inferior
                    </option>
                    <option value="2" className="bg-[#121212] text-white">
                      Decent
                    </option>
                    <option value="3" className="bg-[#121212] text-white">
                      Great
                    </option>
                    <option value="4" className="bg-[#121212] text-white">
                      Excellent
                    </option>
                    <option value="5" className="bg-[#121212] text-white">
                      Exceptional
                    </option>
                  </select>
                </div>

                {/* Comment Field */}
                <div className="my-4">
                  <label
                    htmlFor="comment"
                    className="block mb-2 text-gray-300 text-xl"
                  >
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    rows="3"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Leave a comment..."
                    className="border-pink-600 bg-inherit p-3 border rounded-lg focus:ring-2 focus:ring-pink-600 w-full lg:w-[80%] text-white focus:outline-none placeholder-gray-400"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-lg focus:ring-2 focus:ring-pink-600 text-white transition-all"
                >
                  {loadingProductReview ? "Loading..." : "Submit"}
                </button>
              </form>
            ) : (
              <p className="text-gray-300">
                Please{" "}
                <Link to="/login" className="text-pink-600 hover:underline">
                  sign in
                </Link>{" "}
                to write a review.
              </p>
            )}
          </div>
        )}

        {/* All Reviews Tab */}
        {activeTab === 2 && (
          <div className="mt-6">
            {product.reviews.length === 0 && (
              <p className="text-center text-gray-400 text-lg">
                No reviews available yet. Be the first to leave your thoughts!
              </p>
            )}
            {product.reviews.map((review) => (
              <div
                key={review._id}
                className="border-gray-800 bg-gradient-to-b from-[#2E2E2E] to-[#1C1C1C] shadow-lg hover:shadow-xl mb-6 p-6 border rounded-lg transform transition-transform hover:-translate-y-1"
              >
                {/* Header */}
                <div className="flex justify-between items-center border-gray-700 pb-4 border-b">
                  <strong className="text-pink-500 text-xl">
                    {review.name}
                  </strong>
                  <span className="text-gray-500 text-sm italic">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Comment */}
                <p className="my-4 text-base text-gray-200 leading-relaxed">
                  {review.comment}
                </p>

                {/* Ratings */}
                <div className="flex items-center">
                  <Ratings value={review.rating} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Related Products Tab (top product) */}
        {activeTab === 3 && (
          <div className="flex flex-wrap justify-start gap-6 mt-6 overflow-hidden">
            {!data ? (
              <Loader />
            ) : (
              data.map((product) => (
                <div
                  key={product._id}
                  className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
                >
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductTabs;
