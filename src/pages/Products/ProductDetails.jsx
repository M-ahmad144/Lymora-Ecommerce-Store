import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: productId } = useParams();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Fetch product details using the API query
  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch(); // Refresh the product details
      toast.success("Review created successfully");
    } catch (error) {
      if (error?.data?.error) {
        toast.error(error.data.error);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  if (isLoading) {
    return (
      <div className="place-items-center grid h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <Message variant="danger">
        {error?.data?.message || error.message}
      </Message>
    );
  }

  // Ensure product data exists before rendering
  if (!product) {
    return <Message variant="danger">Product not found!</Message>;
  }

  return (
    <>
      <div className="mx-auto px-4 py-8 container">
        <Link
          to="/"
          className="inline-block mb-6 font-medium text-pink-600 text-xl hover:text-pink-800"
        >
          &#8592; Back to products
        </Link>

        <div className="flex lg:flex-row flex-col justify-center gap-16 lg:gap-32">
          {/* Product Image */}
          <div className="flex justify-center items-center mb-6 lg:mb-0 w-full lg:w-1/2">
            <img
              src={product.image}
              alt={product.name}
              className="shadow-xl rounded-xl w-full lg:w-[500px] h-auto transition-transform duration-300 ease-in-out hover:scale-105"
            />
          </div>

          {/* Product Details */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h2 className="font-extrabold text-4xl text-pink-700">
              {product.name}
            </h2>
            <p className="mt-4 text-gray-200 text-xl">{product.description}</p>

            <div className="mt-6">
              <p className="font-bold text-3xl text-pink-600">
                ${product.price}
              </p>
              <div className="flex justify-center lg:justify-start space-x-6 mt-4">
                <div className="flex items-center text-gray-200 text-lg">
                  <FaStore className="mr-2 text-pink-600" /> Brand:{" "}
                  {product.brand}
                </div>
                <div className="flex items-center text-gray-200 text-lg">
                  <FaClock className="mr-2 text-pink-600" /> Added:{" "}
                  {moment(product.createdAt).calendar()}
                </div>
              </div>

              <div className="flex justify-center lg:justify-start items-center mt-4 text-gray-200 text-lg">
                <FaStar className="mr-2 text-pink-600" /> Ratings:{" "}
                {product.rating} ({product.numReviews} reviews)
              </div>
            </div>

            <div className="flex justify-center lg:justify-start items-center space-x-4 mt-6 p-4 rounded-lg">
              <p className="text-lg text-white">Quantity: </p>
              <select
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="border-white bg-[#181818] px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-600 text-white"
              >
                {[...Array(product.countInStock).keys()].map((x) => (
                  <option
                    key={x + 1}
                    value={x + 1}
                    className="bg-[#181818] text-white"
                  >
                    {x + 1}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              className="bg-pink-600 hover:bg-pink-700 mt-6 px-8 py-3 rounded-lg text-lg text-white transform transition duration-300 ease-in-out hover:scale-105"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Product Tabs for Reviews and Description */}
        <div className="mt-16 ml-8 text-center">
          <ProductTabs
            loadingProductReview={loadingProductReview}
            userInfo={userInfo}
            submitHandler={submitHandler}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            product={product}
          />
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
